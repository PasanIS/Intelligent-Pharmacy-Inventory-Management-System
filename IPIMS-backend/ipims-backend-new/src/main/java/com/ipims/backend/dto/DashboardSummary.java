package com.ipims.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {
    private BigDecimal totalInventoryValue;
    private Long lowStockItemCount;
    private Long expiringSoonCount;
    private List<Map<String, Object>> stockLevelsByCategory; // For the bar chart
    private List<String> recentTransactions;
}