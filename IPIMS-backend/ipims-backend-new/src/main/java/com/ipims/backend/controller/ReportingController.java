package com.ipims.backend.controller;

import com.ipims.backend.dto.DashboardSummary;
import com.ipims.backend.model.InventoryItem;
import com.ipims.backend.service.ReportingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5175")
public class ReportingController {

    private final ReportingService reportingService;

    public ReportingController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }

    // Endpoint: Dashboard Data (Total Inventory Value, Low Stock Count, Charts)
    // Front-end should call this when /dashboard is loaded
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getDashboardData() {
        DashboardSummary summary = reportingService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    // Endpoint: Alerts - Expiring Items
    @GetMapping("/alerts/expiring")
    public ResponseEntity<List<InventoryItem>> getExpiringItems(
            @RequestParam(defaultValue = "90") int days) {

        List<InventoryItem> items = reportingService.getExpiringItems(days);
        return ResponseEntity.ok(items);
    }

    // Endpoint: Alerts - Reorder Suggestions
    @GetMapping("/alerts/reorder")
    public ResponseEntity<List<InventoryItem>> getReorderSuggestions() {
        List<InventoryItem> items = reportingService.getReorderSuggestions();
        return ResponseEntity.ok(items);
    }
}
