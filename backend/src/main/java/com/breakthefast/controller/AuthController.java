package com.breakthefast.controller;

import com.breakthefast.dto.request.*;
import com.breakthefast.dto.response.AuthResponse;
import com.breakthefast.dto.response.CustomerResponse;
import com.breakthefast.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/v1/auth/otp/send — Send OTP to phone number
     */
    @PostMapping("/otp/send")
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody OtpSendRequest request) {
        authService.sendOtp(request);
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    /**
     * POST /api/v1/auth/otp/verify — Verify OTP; returns JWT + refresh token
     */
    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/admin/login — Admin email+password login
     */
    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        AuthResponse response = authService.adminLogin(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/token/refresh — Rotate JWT access token
     */
    @PostMapping("/token/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/logout — Invalidate tokens (client-side)
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        // JWT tokens are stateless; client should discard them
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
