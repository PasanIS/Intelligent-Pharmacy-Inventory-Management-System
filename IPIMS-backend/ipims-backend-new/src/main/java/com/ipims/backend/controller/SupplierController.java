package com.ipims.backend.controller;

import com.ipims.backend.model.Supplier;
import com.ipims.backend.repository.SupplierRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:5175")
public class SupplierController {

    private final SupplierRepository supplierRepository;

    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // CREATE: POST /api/suppliers
    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        // Basic validation: Check if supplierName or email already exists (can be improved)
        if (supplierRepository.findBySupplierName(supplier.getSupplierName()).isPresent() ||
                supplierRepository.findByEmail(supplier.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(supplierRepository.save(supplier));
    }

    // READ ALL: GET /api/suppliers (for table and dropdown)
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierRepository.findAll());
    }

    // READ ONE: GET /api/suppliers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with ID: " + id));
        return ResponseEntity.ok(supplier);
    }

    // UPDATE: PUT /api/suppliers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier updatedSupplier) {
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found for update."));

        // Update fields (excluding the ID)
        existingSupplier.setSupplierName(updatedSupplier.getSupplierName());
        existingSupplier.setContactPerson(updatedSupplier.getContactPerson());
        existingSupplier.setEmail(updatedSupplier.getEmail());
        existingSupplier.setPhoneNumber(updatedSupplier.getPhoneNumber());

        return ResponseEntity.ok(supplierRepository.save(existingSupplier));
    }

    // DELETE: DELETE /api/suppliers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found for deletion.");
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.ok("Supplier with ID " + id + " deleted successfully.");
    }
}
