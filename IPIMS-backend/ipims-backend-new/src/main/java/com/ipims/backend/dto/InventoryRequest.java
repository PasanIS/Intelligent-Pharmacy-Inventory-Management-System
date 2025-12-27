package com.ipims.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryRequest {

    @NotBlank(message = "Brand name is required")
    private String brandName;

    @NotBlank(message = "Generic name is required")
    private String genericName;

    @NotBlank(message = "Dosage is required")
    private String dosage;

    @NotNull(message = "Current stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer currentStock;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDate expiryDate;

    @NotBlank(message = "Batch number is required")
    private String batchNumber;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @Min(value = 0, message = "Min stock threshold cannot be negative")
    private Integer minStockThreshold = 50;

    private String unit;

    @NotNull(message = "Unit price is required")
    @Min(value = 0, message = "Unit price must be positive")
    private Double unitPrice;
}
