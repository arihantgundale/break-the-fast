package com.breakthefast.service;

import com.breakthefast.dto.request.AdminLoginRequest;
import com.breakthefast.dto.request.CustomerLoginRequest;
import com.breakthefast.dto.request.CustomerProfileRequest;
import com.breakthefast.dto.request.CustomerSignupVerifyRequest;
import com.breakthefast.dto.request.OtpSendRequest;
import com.breakthefast.dto.request.OtpVerifyRequest;
import com.breakthefast.dto.response.AuthResponse;
import com.breakthefast.dto.response.CustomerResponse;
import com.breakthefast.entity.AdminUser;
import com.breakthefast.entity.Customer;
import com.breakthefast.entity.OtpRecord;
import com.breakthefast.enums.UserRole;
import com.breakthefast.exception.BadRequestException;
import com.breakthefast.exception.OtpLockoutException;
import com.breakthefast.exception.ResourceNotFoundException;
import com.breakthefast.repository.AdminUserRepository;
import com.breakthefast.repository.CustomerRepository;
import com.breakthefast.repository.OtpRecordRepository;
import com.breakthefast.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final CustomerRepository customerRepository;
    private final AdminUserRepository adminUserRepository;
    private final OtpRecordRepository otpRecordRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final TwilioService twilioService;

    @Value("${app.otp.length}")
    private int otpLength;

    @Value("${app.otp.expiry-minutes}")
    private int otpExpiryMinutes;

    @Value("${app.otp.max-attempts}")
    private int maxAttempts;

    @Value("${app.otp.lockout-minutes}")
    private int lockoutMinutes;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Send OTP to phone number via SMS
     */
    @Transactional
    public void sendOtp(OtpSendRequest request) {
        String phone = request.getPhoneNumber();

        // Check lockout
        otpRecordRepository.findTopByPhoneNumberOrderByCreatedAtDesc(phone)
                .ifPresent(record -> {
                    if (record.getLockedUntil() != null && record.getLockedUntil().isAfter(Instant.now())) {
                        throw new OtpLockoutException("Too many attempts. Try again after " + lockoutMinutes + " minutes.");
                    }
                });

        // Generate 6-digit OTP
        String otp = generateOtp();

        // Save OTP record
        OtpRecord record = OtpRecord.builder()
                .phoneNumber(phone)
                .otpCode(otp)
                .expiresAt(Instant.now().plus(otpExpiryMinutes, ChronoUnit.MINUTES))
                .build();
        otpRecordRepository.save(record);

        // Send via Twilio SMS
        try {
            twilioService.sendSms(phone, "Your Break The Fast verification code is: " + otp + ". Valid for " + otpExpiryMinutes + " minutes.");
        } catch (Exception e) {
            log.warn("Failed to send OTP SMS to {}. For dev, OTP is: {}", phone, otp);
            // In development, we still save OTP so it can be verified manually
        }

        log.info("OTP sent to {}: {}", phone, otp); // Remove in production
    }

    /**
     * Send OTP for customer signup
     */
    @Transactional
    public void sendSignupOtp(OtpSendRequest request) {
        String phone = request.getPhoneNumber();
        if (customerRepository.existsByPhoneNumber(phone)) {
            throw new BadRequestException("Account already exists. Please log in.");
        }
        sendOtp(request);
    }

    /**
     * Verify OTP and return JWT tokens
     */
    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        String phone = request.getPhoneNumber();

        verifyOtpRecord(phone, request.getOtpCode());

        // Find or create customer
        boolean isNewUser = !customerRepository.existsByPhoneNumber(phone);
        Customer customer;

        if (isNewUser) {
            customer = Customer.builder()
                    .phoneNumber(phone)
                    .name("New Customer") // Will be updated via profile
                    .build();
            customer = customerRepository.save(customer);
        } else {
            customer = customerRepository.findByPhoneNumber(phone)
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        }

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(customer.getId().toString(), UserRole.CUSTOMER.name());
        String refreshToken = jwtUtil.generateRefreshToken(customer.getId().toString());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .newUser(isNewUser)
                .customer(mapToCustomerResponse(customer))
                .build();
    }

    /**
     * Verify signup OTP and create customer account
     */
    @Transactional
    public AuthResponse verifySignupOtp(CustomerSignupVerifyRequest request) {
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException("Account already exists. Please log in.");
        }
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use. Please log in.");
        }

        verifyOtpRecord(request.getPhoneNumber(), request.getOtpCode());

        Customer customer = Customer.builder()
                .phoneNumber(request.getPhoneNumber())
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();
        customer = customerRepository.save(customer);

        String accessToken = jwtUtil.generateAccessToken(customer.getId().toString(), UserRole.CUSTOMER.name());
        String refreshToken = jwtUtil.generateRefreshToken(customer.getId().toString());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .newUser(true)
                .customer(mapToCustomerResponse(customer))
                .build();
    }

    /**
     * Customer login with phone + password
     */
    public AuthResponse customerLogin(CustomerLoginRequest request) {
        Customer customer = customerRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (customer.getPasswordHash() == null) {
            throw new BadRequestException("Password not set. Please sign up.");
        }

        if (!passwordEncoder.matches(request.getPassword(), customer.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String accessToken = jwtUtil.generateAccessToken(customer.getId().toString(), UserRole.CUSTOMER.name());
        String refreshToken = jwtUtil.generateRefreshToken(customer.getId().toString());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .newUser(false)
                .customer(mapToCustomerResponse(customer))
                .build();
    }

    /**
     * Admin login with email + password
     */
    public AuthResponse adminLogin(AdminLoginRequest request) {
        AdminUser admin = adminUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String accessToken = jwtUtil.generateAccessToken(admin.getId().toString(), UserRole.ADMIN.name());
        String refreshToken = jwtUtil.generateRefreshToken(admin.getId().toString());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .newUser(false)
                .build();
    }

    /**
     * Refresh access token
     */
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }

        String subject = jwtUtil.getSubject(refreshToken);
        String role = jwtUtil.getRole(refreshToken);
        if (role == null) role = UserRole.CUSTOMER.name(); // refresh tokens may not have role

        String newAccessToken = jwtUtil.generateAccessToken(subject, role);
        String newRefreshToken = jwtUtil.generateRefreshToken(subject);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .build();
    }

    /**
     * Update customer profile
     */
    @Transactional
    public CustomerResponse updateProfile(UUID customerId, CustomerProfileRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        customer.setName(request.getName());
        if (request.getEmail() != null) customer.setEmail(request.getEmail());
        if (request.getWhatsappOptIn() != null) customer.setWhatsappOptIn(request.getWhatsappOptIn());
        if (request.getEmailOptIn() != null) customer.setEmailOptIn(request.getEmailOptIn());

        customer = customerRepository.save(customer);
        return mapToCustomerResponse(customer);
    }

    public CustomerResponse getCustomerProfile(UUID customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return mapToCustomerResponse(customer);
    }

    private void verifyOtpRecord(String phone, String otpCode) {
        OtpRecord record = otpRecordRepository.findTopByPhoneNumberOrderByCreatedAtDesc(phone)
                .orElseThrow(() -> new BadRequestException("No OTP found for this phone number. Request a new one."));

        if (record.getLockedUntil() != null && record.getLockedUntil().isAfter(Instant.now())) {
            throw new OtpLockoutException("Account locked. Try again later.");
        }

        if (record.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("OTP has expired. Request a new one.");
        }

        if (record.getUsed()) {
            throw new BadRequestException("OTP already used. Request a new one.");
        }

        if (!record.getOtpCode().equals(otpCode)) {
            record.setFailedAttempts(record.getFailedAttempts() + 1);
            if (record.getFailedAttempts() >= maxAttempts) {
                record.setLockedUntil(Instant.now().plus(lockoutMinutes, ChronoUnit.MINUTES));
            }
            otpRecordRepository.save(record);
            throw new BadRequestException("Invalid OTP. " + (maxAttempts - record.getFailedAttempts()) + " attempts remaining.");
        }

        record.setUsed(true);
        otpRecordRepository.save(record);
    }

    private String generateOtp() {
        int bound = (int) Math.pow(10, otpLength);
        int otp = secureRandom.nextInt(bound);
        return String.format("%0" + otpLength + "d", otp);
    }

    private CustomerResponse mapToCustomerResponse(Customer c) {
        return CustomerResponse.builder()
                .id(c.getId())
                .phoneNumber(c.getPhoneNumber())
                .name(c.getName())
                .email(c.getEmail())
                .whatsappOptIn(c.getWhatsappOptIn())
                .emailOptIn(c.getEmailOptIn())
                .build();
    }
}
