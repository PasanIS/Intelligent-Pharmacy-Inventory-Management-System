package com.ipims.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class DashboardSummary {
    private BigDecimal totalInventoryValue;
    private Long lowStockItemCount;
    private Long expiringSoonCount;
    private List<Map<String, Object>> stockLevelsByCategory; // For the bar chart
    private List<String> recentTransactions;
}