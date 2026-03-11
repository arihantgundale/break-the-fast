package com.breakthefast.service;

import com.breakthefast.dto.request.*;
import com.breakthefast.dto.response.*;
import com.breakthefast.entity.*;
import com.breakthefast.enums.*;
import com.breakthefast.exception.BadRequestException;
import com.breakthefast.exception.ResourceNotFoundException;
import com.breakthefast.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final CustomerRepository customerRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    // ─── Customer: Place Order ──────────────────────────────────

    @Transactional
    public OrderResponse placeOrder(UUID customerId, PlaceOrderRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Validate catering fields
        if (request.getOrderType() == OrderType.CATERING) {
            if (request.getEventDate() == null) {
                throw new BadRequestException("Event date is required for catering orders");
            }
            if (request.getGuestCount() == null || request.getGuestCount() < 1) {
                throw new BadRequestException("Guest count is required for catering orders");
            }
        }

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .customer(customer)
                .customerName(customer.getName())
                .customerPhone(customer.getPhoneNumber())
                .orderType(request.getOrderType())
                .orderSource(OrderSource.WEB)
                .status(OrderStatus.RECEIVED)
                .specialInstructions(request.getSpecialInstructions())
                .eventDate(request.getEventDate())
                .guestCount(request.getGuestCount())
                .totalAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + itemReq.getMenuItemId()));

            // Check availability (FR-ORD-IND-06)
            if (!menuItem.getIsAvailable()) {
                throw new BadRequestException("Item '" + menuItem.getName() + "' is currently out of stock");
            }

            BigDecimal subtotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .menuItemId(menuItem.getId())
                    .menuItemName(menuItem.getName())
                    .menuItemImageUrl(menuItem.getImageUrl())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .subtotal(subtotal)
                    .build();

            order.addItem(orderItem);
        }

        order.setTotalAmount(total);
        order = orderRepository.save(order);

        // Async: Send Phase 1 notification
        notificationService.sendOrderNotification(order, NotificationPhase.RECEIVED);

        // WebSocket: Notify admin dashboard
        messagingTemplate.convertAndSend("/topic/orders", mapToResponse(order));

        return mapToResponse(order);
    }

    // ─── Customer: Get My Orders ────────────────────────────────

    public PagedResponse<OrderResponse> getMyOrders(UUID customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);

        List<OrderResponse> orders = orderPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<OrderResponse>builder()
                .data(orders)
                .page(page)
                .size(size)
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .build();
    }

    public OrderResponse getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        return mapToResponse(order);
    }

    // ─── Admin: Get All Orders (filtered) ───────────────────────

    public PagedResponse<OrderResponse> getAllOrders(OrderStatus status, OrderType orderType,
                                                      OrderSource orderSource, Instant startDate,
                                                      Instant endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findWithFilters(status, orderType, orderSource, startDate, endDate, pageable);

        List<OrderResponse> orders = orderPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<OrderResponse>builder()
                .data(orders)
                .page(page)
                .size(size)
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .build();
    }

    // ─── Admin: Update Order Status ─────────────────────────────

    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Cannot change status of a " + order.getStatus() + " order");
        }

        order.setStatus(request.getStatus());
        if (request.getEstimatedReadyTime() != null) {
            order.setEstimatedReadyTime(Instant.parse(request.getEstimatedReadyTime()));
        }

        order = orderRepository.save(order);

        // Send notification for this phase
        NotificationPhase phase = NotificationPhase.valueOf(request.getStatus().name());
        notificationService.sendOrderNotification(order, phase);

        // WebSocket update
        messagingTemplate.convertAndSend("/topic/orders", mapToResponse(order));

        return mapToResponse(order);
    }

    // ─── Admin: Cancel Order ────────────────────────────────────

    @Transactional
    public OrderResponse cancelOrder(UUID orderId, CancelOrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed order");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(request.getReason());
        order = orderRepository.save(order);

        // Send cancellation notification
        notificationService.sendOrderNotification(order, NotificationPhase.CANCELLED);

        // WebSocket update
        messagingTemplate.convertAndSend("/topic/orders", mapToResponse(order));

        return mapToResponse(order);
    }

    // ─── Admin: Quick Entry (Phone Orders) ──────────────────────

    @Transactional
    public OrderResponse quickEntry(QuickEntryRequest request) {
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .orderType(request.getOrderType())
                .orderSource(OrderSource.PHONE)
                .status(OrderStatus.RECEIVED)
                .specialInstructions(request.getSpecialInstructions())
                .eventDate(request.getEventDate())
                .guestCount(request.getGuestCount())
                .totalAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        // Link to existing customer if phone number matches
        customerRepository.findByPhoneNumber(request.getCustomerPhone())
                .ifPresent(order::setCustomer);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + itemReq.getMenuItemId()));

            BigDecimal subtotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .menuItemId(menuItem.getId())
                    .menuItemName(menuItem.getName())
                    .menuItemImageUrl(menuItem.getImageUrl())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .subtotal(subtotal)
                    .build();

            order.addItem(orderItem);
        }

        order.setTotalAmount(total);

        if (request.getEstimatedReadyTime() != null) {
            order.setEstimatedReadyTime(Instant.parse(request.getEstimatedReadyTime()));
        }

        order = orderRepository.save(order);

        // Send Phase 1 notification
        notificationService.sendOrderNotification(order, NotificationPhase.RECEIVED);

        // WebSocket
        messagingTemplate.convertAndSend("/topic/orders", mapToResponse(order));

        return mapToResponse(order);
    }

    // ─── Admin: Resend Notification ─────────────────────────────

    public void resendNotification(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        NotificationPhase phase = NotificationPhase.valueOf(order.getStatus().name());
        notificationService.sendOrderNotification(order, phase);
    }

    // ─── Admin: Order Summary ───────────────────────────────────

    public OrderSummaryResponse getOrderSummary() {
        List<Object[]> counts = orderRepository.countActiveByStatus();
        Map<String, Long> statusCounts = new LinkedHashMap<>();

        for (OrderStatus s : OrderStatus.values()) {
            statusCounts.put(s.name(), 0L);
        }
        for (Object[] row : counts) {
            statusCounts.put(row[0].toString(), (Long) row[1]);
        }

        long total = statusCounts.values().stream().mapToLong(Long::longValue).sum();

        return OrderSummaryResponse.builder()
                .totalOrders(total)
                .statusCounts(statusCounts)
                .build();
    }

    // ─── Helpers ────────────────────────────────────────────────

    private String generateOrderNumber() {
        String prefix = "BTF-" + Year.now().getValue();
        long count = orderRepository.countByOrderNumberPrefix(prefix);
        return String.format("%s-%04d", prefix, count + 1);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .menuItemId(item.getMenuItemId())
                        .menuItemName(item.getMenuItemName())
                        .menuItemImageUrl(item.getMenuItemImageUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .orderType(order.getOrderType())
                .orderSource(order.getOrderSource())
                .status(order.getStatus())
                .items(itemResponses)
                .specialInstructions(order.getSpecialInstructions())
                .eventDate(order.getEventDate())
                .guestCount(order.getGuestCount())
                .totalAmount(order.getTotalAmount())
                .estimatedReadyTime(order.getEstimatedReadyTime())
                .cancellationReason(order.getCancellationReason())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
