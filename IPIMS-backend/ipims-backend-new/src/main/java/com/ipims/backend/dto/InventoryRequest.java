package com.ipims.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class InventoryRequest {
    private String brandName;
    private String genericName;
    private String dosage;
    private Integer currentStock;
    private LocalDate expiryDate;
    private String batchNumber;
    private Long supplierId;   // ID selected from the dropdown
    private Long categoryId;   // ID selected from the dropdown
    private Integer minStockThreshold = 50; // Default or fetched from Category
}
