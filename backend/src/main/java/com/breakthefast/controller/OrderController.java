package com.breakthefast.controller;

import com.breakthefast.dto.request.PlaceOrderRequest;
import com.breakthefast.dto.response.OrderResponse;
import com.breakthefast.dto.response.PagedResponse;
import com.breakthefast.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * POST /api/v1/orders — Place new web order (Individual or Catering)
     */
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            Authentication auth,
            @Valid @RequestBody PlaceOrderRequest request) {
        UUID customerId = UUID.fromString(auth.getName());
        OrderResponse response = orderService.placeOrder(customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/v1/orders/my — Get current customer's orders (paginated)
     */
    @GetMapping("/my")
    public ResponseEntity<PagedResponse<OrderResponse>> getMyOrders(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        UUID customerId = UUID.fromString(auth.getName());
        return ResponseEntity.ok(orderService.getMyOrders(customerId, page, size));
    }

    /**
     * GET /api/v1/orders/my/{orderId} — Get order detail by ID
     */
    @GetMapping("/my/{orderId}")
    public ResponseEntity<OrderResponse> getMyOrder(
            Authentication auth,
            @PathVariable UUID orderId) {
        // TODO: verify the order belongs to this customer
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
}
