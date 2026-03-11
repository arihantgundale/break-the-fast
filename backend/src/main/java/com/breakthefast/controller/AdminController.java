package com.breakthefast.controller;

import com.breakthefast.dto.request.*;
import com.breakthefast.dto.response.*;
import com.breakthefast.enums.OrderSource;
import com.breakthefast.enums.OrderStatus;
import com.breakthefast.enums.OrderType;
import com.breakthefast.service.MenuService;
import com.breakthefast.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrderService orderService;
    private final MenuService menuService;

    // ─── ORDER MANAGEMENT ───────────────────────────────────────

    /**
     * GET /api/v1/admin/orders — Get all orders (filterable, paginated)
     */
    @GetMapping("/orders")
    public ResponseEntity<PagedResponse<OrderResponse>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) OrderType orderType,
            @RequestParam(required = false) OrderSource orderSource,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Instant start = startDate != null ? Instant.parse(startDate) : null;
        Instant end = endDate != null ? Instant.parse(endDate) : null;

        return ResponseEntity.ok(orderService.getAllOrders(status, orderType, orderSource, start, end, page, size));
    }

    /**
     * GET /api/v1/admin/orders/{orderId} — Get full order detail
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrderDetail(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    /**
     * PATCH /api/v1/admin/orders/{orderId}/status — Update order status
     */
    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request));
    }

    /**
     * PATCH /api/v1/admin/orders/{orderId}/cancel — Cancel order with reason
     */
    @PatchMapping("/orders/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable UUID orderId,
            @Valid @RequestBody CancelOrderRequest request) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId, request));
    }

    /**
     * POST /api/v1/admin/orders/quick-entry — Create phone order via Quick Entry
     */
    @PostMapping("/orders/quick-entry")
    public ResponseEntity<OrderResponse> quickEntry(@Valid @RequestBody QuickEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.quickEntry(request));
    }

    /**
     * POST /api/v1/admin/orders/{orderId}/notify/resend — Manually resend notification
     */
    @PostMapping("/orders/{orderId}/notify/resend")
    public ResponseEntity<Map<String, String>> resendNotification(@PathVariable UUID orderId) {
        orderService.resendNotification(orderId);
        return ResponseEntity.ok(Map.of("message", "Notification resent"));
    }

    /**
     * GET /api/v1/admin/orders/summary — Order status summary counts
     */
    @GetMapping("/orders/summary")
    public ResponseEntity<OrderSummaryResponse> getOrderSummary() {
        return ResponseEntity.ok(orderService.getOrderSummary());
    }

    // ─── MENU MANAGEMENT ────────────────────────────────────────

    /**
     * POST /api/v1/admin/menu/items — Create new menu item
     */
    @PostMapping("/menu/items")
    public ResponseEntity<MenuItemResponse> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.createItem(request));
    }

    /**
     * PUT /api/v1/admin/menu/items/{id} — Update menu item
     */
    @PutMapping("/menu/items/{id}")
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable UUID id,
            @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(menuService.updateItem(id, request));
    }

    /**
     * PUT /api/v1/admin/menu/items/{id}/availability — Toggle item OOS status
     */
    @PutMapping("/menu/items/{id}/availability")
    public ResponseEntity<MenuItemResponse> toggleAvailability(@PathVariable UUID id) {
        return ResponseEntity.ok(menuService.toggleAvailability(id));
    }

    /**
     * PUT /api/v1/admin/menu/items/bulk-availability — Bulk toggle
     */
    @PutMapping("/menu/items/bulk-availability")
    public ResponseEntity<List<MenuItemResponse>> bulkToggle(
            @RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<String> ids = (List<String>) body.get("ids");
        boolean available = (Boolean) body.get("available");
        List<UUID> uuids = ids.stream().map(UUID::fromString).toList();
        return ResponseEntity.ok(menuService.bulkToggleAvailability(uuids, available));
    }

    /**
     * DELETE /api/v1/admin/menu/items/{id} — Soft-delete menu item
     */
    @DeleteMapping("/menu/items/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable UUID id) {
        menuService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
