package com.ipims.backend.repository;

import com.ipims.backend.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

    // For Low Stock Alerts
    List<InventoryItem> findByCurrentStockLessThan(Integer threshold);

    // For Expiring Soon Alerts (e.g., expiry within the next 'date')
    List<InventoryItem> findByExpiryDateBefore(LocalDate date);

    // For Dashboard Stock Levels Chart (Aggregates stock by Category)
    @Query("SELECT i.category.name as categoryName, SUM(i.currentStock) as currentStock " +
            "FROM InventoryItem i GROUP BY i.category.name")
    List<Map<String, Object>> findStockLevelsByCategory();


    @Query("SELECT COALESCE(SUM(i.currentStock * i.unitPrice), 0) FROM InventoryItem i")
    BigDecimal calculateTotalInventoryValue();
}
