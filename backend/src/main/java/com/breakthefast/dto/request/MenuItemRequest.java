package com.breakthefast.dto.request;

import com.breakthefast.enums.MenuCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MenuItemRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Category is required")
    private MenuCategory category;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String portionSize;
    private String imageUrl;
    private Boolean isAvailable;
    private Boolean isSpicy;
    private String heritageNote;
    private Integer displayOrder;
}
