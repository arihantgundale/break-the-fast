package com.breakthefast.controller;

import com.breakthefast.dto.request.CustomerProfileRequest;
import com.breakthefast.dto.response.CustomerResponse;
import com.breakthefast.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final AuthService authService;

    /**
     * GET /api/v1/customer/profile — Get customer profile
     */
    @GetMapping("/profile")
    public ResponseEntity<CustomerResponse> getProfile(Authentication auth) {
        UUID customerId = UUID.fromString(auth.getName());
        return ResponseEntity.ok(authService.getCustomerProfile(customerId));
    }

    /**
     * PUT /api/v1/customer/profile — Update customer profile
     */
    @PutMapping("/profile")
    public ResponseEntity<CustomerResponse> updateProfile(
            Authentication auth,
            @Valid @RequestBody CustomerProfileRequest request) {
        UUID customerId = UUID.fromString(auth.getName());
        return ResponseEntity.ok(authService.updateProfile(customerId, request));
    }
}
