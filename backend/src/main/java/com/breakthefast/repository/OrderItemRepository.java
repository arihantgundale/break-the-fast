package com.breakthefast.repository;

import com.breakthefast.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    @Query("SELECT oi.menuItemId, oi.menuItemName, SUM(oi.quantity), SUM(oi.subtotal) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.createdAt >= :startDate AND oi.order.createdAt <= :endDate " +
           "GROUP BY oi.menuItemId, oi.menuItemName " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopProducts(@Param("startDate") Instant startDate,
                                   @Param("endDate") Instant endDate,
                                   Pageable pageable);
}
