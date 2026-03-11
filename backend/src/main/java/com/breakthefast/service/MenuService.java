package com.breakthefast.service;

import com.breakthefast.dto.request.MenuItemRequest;
import com.breakthefast.dto.response.MenuItemResponse;
import com.breakthefast.entity.MenuItem;
import com.breakthefast.enums.MenuCategory;
import com.breakthefast.exception.ResourceNotFoundException;
import com.breakthefast.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    /**
     * Get all menu items, optionally filtered by category
     */
    public List<MenuItemResponse> getAllItems(String category) {
        List<MenuItem> items;
        if (category != null && !category.isEmpty()) {
            try {
                MenuCategory cat = MenuCategory.valueOf(category.toUpperCase());
                items = menuItemRepository.findByCategoryOrderByDisplayOrderAsc(cat);
            } catch (IllegalArgumentException e) {
                items = menuItemRepository.findAllByOrderByDisplayOrderAsc();
            }
        } else {
            items = menuItemRepository.findAllByOrderByDisplayOrderAsc();
        }
        return items.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Get single menu item by ID
     */
    public MenuItemResponse getItemById(UUID id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + id));
        return mapToResponse(item);
    }

    /**
     * Get all categories
     */
    public List<String> getAllCategories() {
        return Arrays.stream(MenuCategory.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    /**
     * Search menu items by name or description
     */
    public List<MenuItemResponse> searchItems(String query) {
        return menuItemRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Admin: Create menu item
     */
    @Transactional
    public MenuItemResponse createItem(MenuItemRequest request) {
        MenuItem item = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .portionSize(request.getPortionSize())
                .imageUrl(request.getImageUrl())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .isSpicy(request.getIsSpicy() != null ? request.getIsSpicy() : false)
                .heritageNote(request.getHeritageNote())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();
        item = menuItemRepository.save(item);
        return mapToResponse(item);
    }

    /**
     * Admin: Update menu item
     */
    @Transactional
    public MenuItemResponse updateItem(UUID id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + id));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        if (request.getPortionSize() != null) item.setPortionSize(request.getPortionSize());
        if (request.getImageUrl() != null) item.setImageUrl(request.getImageUrl());
        if (request.getIsAvailable() != null) item.setIsAvailable(request.getIsAvailable());
        if (request.getIsSpicy() != null) item.setIsSpicy(request.getIsSpicy());
        if (request.getHeritageNote() != null) item.setHeritageNote(request.getHeritageNote());
        if (request.getDisplayOrder() != null) item.setDisplayOrder(request.getDisplayOrder());

        item = menuItemRepository.save(item);
        return mapToResponse(item);
    }

    /**
     * Admin: Toggle item availability (OOS management)
     */
    @Transactional
    public MenuItemResponse toggleAvailability(UUID id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + id));
        item.setIsAvailable(!item.getIsAvailable());
        item = menuItemRepository.save(item);
        return mapToResponse(item);
    }

    /**
     * Admin: Bulk toggle availability
     */
    @Transactional
    public List<MenuItemResponse> bulkToggleAvailability(List<UUID> ids, boolean available) {
        List<MenuItem> items = menuItemRepository.findAllById(ids);
        items.forEach(item -> item.setIsAvailable(available));
        menuItemRepository.saveAll(items);
        return items.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Admin: Soft delete menu item
     */
    @Transactional
    public void deleteItem(UUID id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + id));
        item.setIsAvailable(false);
        menuItemRepository.save(item);
    }

    private MenuItemResponse mapToResponse(MenuItem item) {
        return MenuItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .price(item.getPrice())
                .portionSize(item.getPortionSize())
                .imageUrl(item.getImageUrl())
                .isAvailable(item.getIsAvailable())
                .isSpicy(item.getIsSpicy())
                .heritageNote(item.getHeritageNote())
                .displayOrder(item.getDisplayOrder())
                .build();
    }
}
