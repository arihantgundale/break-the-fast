package com.breakthefast.repository;

import com.breakthefast.entity.MenuItem;
import com.breakthefast.enums.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {
    List<MenuItem> findByCategoryOrderByDisplayOrderAsc(MenuCategory category);
    List<MenuItem> findAllByOrderByDisplayOrderAsc();
    List<MenuItem> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    List<MenuItem> findByIsAvailableTrue();
}
