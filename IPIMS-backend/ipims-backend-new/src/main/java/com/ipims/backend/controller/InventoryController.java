package com.ipims.backend.controller;

import com.ipims.backend.dto.InventoryRequest;
import com.ipims.backend.model.InventoryItem;
import com.ipims.backend.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5175")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // CREATE: POST /api/inventory
    @PostMapping
    public ResponseEntity<InventoryItem> createInventoryItem(@Valid @RequestBody InventoryRequest request) {
        InventoryItem newItem = inventoryService.addNewItem(request);
        return ResponseEntity.ok(newItem);
    }

    // READ ALL: GET /api/inventory (for table display)
    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.findAllItems());
    }

    // READ ONE: GET /api/inventory/{id} (for View/Edit form population)
    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getInventoryItemById(@PathVariable Long id) {
        InventoryItem item = inventoryService.findItemById(id);
        return ResponseEntity.ok(item);
    }

    // UPDATE: PUT /api/inventory/{id} (for Edit form submission)
    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateInventoryItem(@PathVariable Long id, @Valid @RequestBody InventoryRequest request) {
        InventoryItem updatedItem = inventoryService.updateItem(id, request);
        return ResponseEntity.ok(updatedItem);
    }

    // DELETE: DELETE /api/inventory/{id} (for Delete button)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventoryItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok("Inventory Item with ID " + id + " deleted successfully.");
    }
}