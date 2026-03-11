package com.breakthefast.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerProfileRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String email;
    private Boolean whatsappOptIn;
    private Boolean emailOptIn;
}
