package com.breakthefast.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OtpVerifyRequest {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+1\\d{10}$", message = "Phone must be US E.164 format: +1XXXXXXXXXX")
    private String phoneNumber;

    @NotBlank(message = "OTP code is required")
    @Size(min = 6, max = 6, message = "OTP must be 6 digits")
    private String otpCode;
}
