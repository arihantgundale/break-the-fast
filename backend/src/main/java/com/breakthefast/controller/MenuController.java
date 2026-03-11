package com.breakthefast.controller;

import com.breakthefast.dto.response.MenuItemResponse;
import com.breakthefast.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    /**
     * GET /api/v1/menu/items — List all menu items (filterable by category)
     */
    @GetMapping("/items")
    public ResponseEntity<List<MenuItemResponse>> getAllItems(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(menuService.getAllItems(category));
    }

    /**
     * GET /api/v1/menu/items/{id} — Get single menu item detail
     */
    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItemResponse> getItem(@PathVariable UUID id) {
        return ResponseEntity.ok(menuService.getItemById(id));
    }

    /**
     * GET /api/v1/menu/categories — List all categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(menuService.getAllCategories());
    }

    /**
     * GET /api/v1/menu/search?q=... — Search menu items
     */
    @GetMapping("/search")
    public ResponseEntity<List<MenuItemResponse>> searchItems(@RequestParam String q) {
        return ResponseEntity.ok(menuService.searchItems(q));
    }
}
