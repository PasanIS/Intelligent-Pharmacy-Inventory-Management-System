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
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // -----CREATE ITEM
    @PostMapping
    public ResponseEntity<InventoryItem> createInventoryItem(@Valid @RequestBody InventoryRequest request) {
        InventoryItem newItem = inventoryService.addNewItem(request);
        return ResponseEntity.ok(newItem);
    }

    // -----GET ALL
    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.findAllItems());
    }

    // -----GET ONE
    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getInventoryItemById(@PathVariable Long id) {
        InventoryItem item = inventoryService.findItemById(id);
        return ResponseEntity.ok(item);
    }

    // -----UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateInventoryItem(@PathVariable Long id,
            @Valid @RequestBody InventoryRequest request) {
        InventoryItem updatedItem = inventoryService.updateItem(id, request);
        return ResponseEntity.ok(updatedItem);
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<InventoryItem> restockItem(@PathVariable Long id, @RequestParam Integer quantity) {
        return ResponseEntity.ok(inventoryService.restockItem(id, quantity));
    }

    // -----DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventoryItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok("Inventory Item with ID " + id + " deleted successfully.");
    }
}