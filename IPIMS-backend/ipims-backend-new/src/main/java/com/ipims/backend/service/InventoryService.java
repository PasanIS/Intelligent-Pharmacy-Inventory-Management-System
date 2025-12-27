package com.ipims.backend.service;

import com.ipims.backend.dto.InventoryRequest;
import com.ipims.backend.model.*;
import com.ipims.backend.repository.CategoryRepository;
import com.ipims.backend.repository.InventoryItemRepository;
import com.ipims.backend.repository.SupplierRepository;
import com.ipims.backend.repository.TransactionRepository;

// import org.modelmapper.ModelMapper; (Removed)
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final TransactionRepository transactionRepository;

    public InventoryService(InventoryItemRepository itemRepository, CategoryRepository categoryRepository,
            SupplierRepository supplierRepository,
            TransactionRepository transactionRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<InventoryItem> findAllItems() {
        return itemRepository.findAll();
    }

    public InventoryItem findItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory Item not found with ID: " + id));
    }

    @Transactional
    public InventoryItem addNewItem(InventoryRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        InventoryItem item = new InventoryItem();
        item.setBrandName(request.getBrandName());
        item.setGenericName(request.getGenericName());
        item.setDosage(request.getDosage());
        item.setCurrentStock(request.getCurrentStock());
        item.setMinStockThreshold(request.getMinStockThreshold());
        item.setBatchNumber(request.getBatchNumber());
        item.setExpiryDate(request.getExpiryDate());
        item.setUnit(request.getUnit());
        item.setUnitPrice(request.getUnitPrice());

        item.setCategory(category);
        item.setSupplier(supplier);

        InventoryItem savedItem = itemRepository.save(item);

        Transaction transaction = new Transaction();
        transaction.setItem(savedItem);
        transaction.setType(TransactionType.RECEIVE);
        transaction.setQuantityChange(request.getCurrentStock());
        transactionRepository.save(transaction);

        return savedItem;
    }

    // -----UPDATE
    @Transactional
    public InventoryItem updateItem(Long id, InventoryRequest request) {
        InventoryItem existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found for update."));

        // -----Manual mapping to avoid ModelMapper ambiguity with IDs
        existingItem.setBrandName(request.getBrandName());
        existingItem.setGenericName(request.getGenericName());
        existingItem.setDosage(request.getDosage());
        existingItem.setCurrentStock(request.getCurrentStock());
        existingItem.setMinStockThreshold(request.getMinStockThreshold());
        existingItem.setBatchNumber(request.getBatchNumber());
        existingItem.setExpiryDate(request.getExpiryDate());
        existingItem.setUnit(request.getUnit());
        existingItem.setUnitPrice(request.getUnitPrice());

        // -----Update Category
        if (request.getCategoryId() != null && !request.getCategoryId().equals(existingItem.getCategory().getId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existingItem.setCategory(category);
        }

        // ------Update Supplier
        if (request.getSupplierId() != null && !request.getSupplierId().equals(existingItem.getSupplier().getId())) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found"));
            existingItem.setSupplier(supplier);
        }

        return itemRepository.save(existingItem);
    }

    @Transactional
    public InventoryItem restockItem(Long id, Integer quantity) {
        InventoryItem item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setCurrentStock(item.getCurrentStock() + quantity);

        Transaction transaction = new Transaction();
        transaction.setItem(item);
        transaction.setType(TransactionType.RECEIVE);
        transaction.setQuantityChange(quantity);
        transactionRepository.save(transaction);

        return itemRepository.save(item);
    }

    // ------DELETE
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found for deletion.");
        }
        itemRepository.deleteById(id);
    }
}
