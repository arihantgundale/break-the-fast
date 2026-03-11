package com.breakthefast.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OtpSendRequest {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+1\\d{10}$", message = "Phone must be US E.164 format: +1XXXXXXXXXX")
    private String phoneNumber;
}
