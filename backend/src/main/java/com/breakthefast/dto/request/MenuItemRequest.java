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

    @NotNull(message = "Category is required")
    private MenuCategory category;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Portion size is required")
    private String portionSize;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "Availability is required")
    private Boolean isAvailable;

    @NotNull(message = "Spicy flag is required")
    private Boolean isSpicy;

    @NotBlank(message = "Heritage note is required")
    private String heritageNote;

    @NotNull(message = "Display order is required")
    private Integer displayOrder;
}
