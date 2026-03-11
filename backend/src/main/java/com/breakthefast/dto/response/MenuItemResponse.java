package com.breakthefast.dto.response;

import com.breakthefast.enums.MenuCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class MenuItemResponse {
    private UUID id;
    private String name;
    private String description;
    private MenuCategory category;
    private BigDecimal price;
    private String portionSize;
    private String imageUrl;
    private Boolean isAvailable;
    private Boolean isSpicy;
    private String heritageNote;
    private Integer displayOrder;
}
