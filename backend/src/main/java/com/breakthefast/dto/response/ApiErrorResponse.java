package com.breakthefast.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class ApiErrorResponse {
    private String error;
    private String code;
    private Object details;
}
