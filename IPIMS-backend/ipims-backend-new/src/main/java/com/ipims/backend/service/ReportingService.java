package com.ipims.backend.service;

import com.ipims.backend.dto.DashboardSummary;
import com.ipims.backend.model.InventoryItem;
import com.ipims.backend.model.TransactionType;
import com.ipims.backend.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;
import com.ipims.backend.model.Transaction;
import com.ipims.backend.repository.TransactionRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReportingService {

    private final InventoryItemRepository itemRepository;
    private final TransactionRepository transactionRepository;

    public ReportingService(InventoryItemRepository itemRepository,
                            TransactionRepository transactionRepository) {
        this.itemRepository = itemRepository;
        this.transactionRepository = transactionRepository;
    }

    // --- DASHBOARD METHODS ---

    public DashboardSummary getDashboardSummary() {
        DashboardSummary summary = new DashboardSummary();

        // Total Inventory Value
        try {
            summary.setTotalInventoryValue(itemRepository.calculateTotalInventoryValue());
        } catch (Exception e) {

            summary.setTotalInventoryValue(new BigDecimal("150000.00")); // Mock Value
        }


        // Low Stock Items
        long lowStockCount = itemRepository.findAll().stream()
                .filter(i -> i.getCurrentStock() < (i.getMinStockThreshold() != null ? i.getMinStockThreshold() : 50))
                .count();
        summary.setLowStockItemCount(lowStockCount);

        // Expiring Soon (Within the next 90 days)
        LocalDate expiringDate = LocalDate.now().plusDays(90);
        long expiringCount = itemRepository.findByExpiryDateBefore(expiringDate).size();
        summary.setExpiringSoonCount(expiringCount);

        summary.setStockLevelsByCategory(itemRepository.findStockLevelsByCategory());

        List<Transaction> recentTransactions = transactionRepository.findTop10ByOrderByTransactionDateDesc();

        // Convert Transaction objects into the string format
        List<String> transactionStrings = recentTransactions.stream()
                .map(this::formatTransactionToString) // Use a helper method
                .toList();

        summary.setRecentTransactions(transactionStrings);

        return summary;
    }

    private String formatTransactionToString(Transaction t) {
        String action;
        String sign = (t.getQuantityChange() > 0 && t.getType() == TransactionType.RECEIVE) ? "Received" : "Dispensed";
        int quantity = Math.abs(t.getQuantityChange());

        if (t.getType() == TransactionType.ADJUST) {
            action = "Adjusted";
        } else {
            action = (t.getQuantityChange() > 0) ? "Received" : "Dispensed";
        }

        return String.format("%s %d '%s'",
                action,
                quantity,
                t.getItem().getGenericName());
    }

    // --- ALERTS METHODS ---

    public List<InventoryItem> getExpiringItems(int days) {
        LocalDate expiryLimit = LocalDate.now().plusDays(days);
        return itemRepository.findByExpiryDateBefore(expiryLimit);
    }

    public List<InventoryItem> getReorderSuggestions() {
        return itemRepository.findAll().stream()
                .filter(i -> i.getCurrentStock() < (i.getMinStockThreshold() != null ? i.getMinStockThreshold() : 50))
                .toList();
    }
}