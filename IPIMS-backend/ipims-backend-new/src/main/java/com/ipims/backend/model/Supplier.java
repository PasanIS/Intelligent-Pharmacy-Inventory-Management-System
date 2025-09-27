package com.ipims.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String supplierName;

    private String contactPerson;

    @Column(unique = true)
    private String email;

    private String phoneNumber;

    // Relationship: One supplier can supply many Inventory items
    // Add the mappedBy field in the InventoryItem
}
