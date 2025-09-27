package com.ipims.backend.service;

import com.ipims.backend.dto.InventoryRequest;
import com.ipims.backend.model.*;
import com.ipims.backend.repository.CategoryRepository;
import com.ipims.backend.repository.InventoryItemRepository;
import com.ipims.backend.repository.SupplierRepository;
import com.ipims.backend.repository.TransactionRepository;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final TransactionRepository transactionRepository;
    private final ModelMapper modelMapper;

    public InventoryService(InventoryItemRepository itemRepository, CategoryRepository categoryRepository,
                            SupplierRepository supplierRepository, ModelMapper modelMapper,
                            TransactionRepository transactionRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.modelMapper = modelMapper;
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

        InventoryItem item = modelMapper.map(request, InventoryItem.class);
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

    // UPDATE
    @Transactional
    public InventoryItem updateItem(Long id, InventoryRequest request) {
        InventoryItem existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found for update."));

        modelMapper.map(request, existingItem);

        if (request.getCategoryId() != null && !request.getCategoryId().equals(existingItem.getCategory().getId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existingItem.setCategory(category);
        }

        if (request.getSupplierId() != null && !request.getSupplierId().equals(existingItem.getSupplier().getId())) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found"));
            existingItem.setSupplier(supplier);
        }

        return itemRepository.save(existingItem);
    }

    // DELETE
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found for deletion.");
        }
        itemRepository.deleteById(id);
    }
}
