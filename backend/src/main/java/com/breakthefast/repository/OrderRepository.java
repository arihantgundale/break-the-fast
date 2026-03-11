package com.breakthefast.repository;

import com.breakthefast.entity.Order;
import com.breakthefast.enums.OrderSource;
import com.breakthefast.enums.OrderStatus;
import com.breakthefast.enums.OrderType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findByOrderNumber(String orderNumber);

    // Customer orders
    Page<Order> findByCustomerIdOrderByCreatedAtDesc(UUID customerId, Pageable pageable);

    // Admin: filter orders
    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:orderType IS NULL OR o.orderType = :orderType) AND " +
           "(:orderSource IS NULL OR o.orderSource = :orderSource) AND " +
           "(:startDate IS NULL OR o.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR o.createdAt <= :endDate) " +
           "ORDER BY o.createdAt DESC")
    Page<Order> findWithFilters(
            @Param("status") OrderStatus status,
            @Param("orderType") OrderType orderType,
            @Param("orderSource") OrderSource orderSource,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable
    );

    // Summary counts by status
    @Query("SELECT o.status, COUNT(o) FROM Order o WHERE o.status NOT IN ('COMPLETED', 'CANCELLED') GROUP BY o.status")
    List<Object[]> countActiveByStatus();

    // Order number generation
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderNumber LIKE :prefix%")
    long countByOrderNumberPrefix(@Param("prefix") String prefix);
}
