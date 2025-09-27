package com.ipims.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "inventory_items")
@Data
@NoArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brandName;

    @Column(nullable = false)
    private String genericName;

    @Column(nullable = false)
    private String dosage; // e.g., "500 mg"

    @Column(nullable = false)
    private Integer currentStock;

    private Integer minStockThreshold; // For low stock alerts

    @Column(nullable = false)
    private String batchNumber;

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false)
    private String unit; // e.g., "tablets", "bottles"

    @Column(nullable = false)
    private Double unitPrice; // Price per unit


    // --- Relationships ---

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;


}
