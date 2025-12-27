import { axiosInstance } from './client';
import type { DashboardSummary, CategoryBreakdownData, InventoryValueData, StockLevelData, InventoryItem } from '../types';
import { getInventoryItems } from './inventory';

// ----------DASHBOARD & REPORTS ENDPOINTS----------

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    try {
        const items = await getInventoryItems();

        // ----------Calculate Total Inventory Value
        const totalValue = items.reduce((sum, item) => {
            return sum + (item.unitPrice * item.currentStock);
        }, 0);

        // ----------Low Stock Count
        const lowStockCount = items.filter(item =>
            item.currentStock <= (item.minStockThreshold || 10)
        ).length;

        // ----------Expiring Soon Count (next 90 days)
        const today = new Date();
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(today.getDate() + 90);

        const expiringCount = items.filter(item => {
            if (!item.expiryDate) return false;
            const expiryDate = new Date(item.expiryDate);
            return expiryDate <= ninetyDaysFromNow && expiryDate >= today;
        }).length;

        // ----------Stock Levels by Category & Chart Data
        const aggregated = aggregateInventoryByCategory(items);
        const stockLevels = Object.entries(aggregated).map(([name, stats]) => ({
            categoryName: name,
            currentStock: stats.currentStock
        }));

        // ----------Prepare Category Breakdown Data
        const categoryColors = [
            '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
            '#d084d0', '#87ceeb', '#ffb347', '#98fb98', '#f0e68c'
        ];
        const categoryBreakdown: CategoryBreakdownData[] = Object.entries(aggregated).map(([name, stats], index) => ({
            name,
            value: stats.currentStock,
            color: categoryColors[index % categoryColors.length]
        }));

        // ----------Prepare Stock Level Chart Data
        const stockLevelChartData: StockLevelData[] = Object.entries(aggregated).map(([category, stats]) => ({
            category,
            currentStock: stats.currentStock,
            minStock: stats.minStock,
            maxStock: Math.max(stats.currentStock + 50, stats.minStock * 3)
        }));

        // ----------Prepare Inventory Value Data (Current Only)
        const currentDate = new Date().toISOString().slice(0, 7); // YYYY-MM
        const inventoryValueData: InventoryValueData[] = [
            { date: currentDate, value: totalValue, category: 'Total' }
        ];

        return {
            totalInventoryValue: totalValue.toString(),
            lowStockItemCount: lowStockCount,
            expiringSoonCount: expiringCount,
            stockLevelsByCategory: stockLevels,
            recentTransactions: [], // No transaction API available yet
            categoryBreakdown: categoryBreakdown,
            inventoryValue: inventoryValueData,
            stockLevels: stockLevelChartData
        };
    } catch (error) {
        console.error('Error calculating dashboard summary:', error);
        throw error;
    }
};

// ----------CHART DATA ENDPOINTS----------

const aggregateInventoryByCategory = (items: InventoryItem[]): Record<string, { currentStock: number; minStock: number }> => {
    return items.reduce((acc, item) => {
        const category = item.categoryName || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = { currentStock: 0, minStock: 0 };
        }
        acc[category].currentStock += item.currentStock;
        acc[category].minStock += item.minStockThreshold || 0;
        return acc;
    }, {} as Record<string, { currentStock: number; minStock: number }>);
};

export const getCategoryBreakdownData = async (): Promise<{ data: CategoryBreakdownData[] }> => {
    try {
        const items = await getInventoryItems();
        const aggregated = aggregateInventoryByCategory(items);

        const categoryColors = [
            '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
            '#d084d0', '#87ceeb', '#ffb347', '#98fb98', '#f0e68c'
        ];

        const chartData: CategoryBreakdownData[] = Object.entries(aggregated).map(([name, stats], index) => ({
            name,
            value: stats.currentStock,
            color: categoryColors[index % categoryColors.length]
        }));

        return { data: chartData };
    } catch (error) {
        console.error('Error fetching category breakdown data:', error);
        throw error;
    }
};

export const getInventoryValueData = async (): Promise<{ data: InventoryValueData[] }> => {
    try {
        const items = await getInventoryItems();

        //----------Calculate total value of current inventory
        const totalValue = items.reduce((sum, item) => {
            return sum + (item.unitPrice * item.currentStock);
        }, 0);

        const currentDate = new Date().toISOString().slice(0, 7); // YYYY-MM

        const realData: InventoryValueData[] = [
            { date: currentDate, value: totalValue, category: 'Total' }
        ];

        return { data: realData };
    } catch (error) {
        console.error('Error fetching inventory value data:', error);
        throw error;
    }
};

export const getStockLevelData = async (): Promise<{ data: StockLevelData[] }> => {
    try {
        const items = await getInventoryItems();
        const aggregated = aggregateInventoryByCategory(items);

        const chartData: StockLevelData[] = Object.entries(aggregated).map(([category, stats]) => ({
            category,
            currentStock: stats.currentStock,
            minStock: stats.minStock,
            maxStock: Math.max(stats.currentStock + 50, stats.minStock * 3) // Dynamic max for visualization
        }));

        return { data: chartData };
    } catch (error) {
        console.error('Error fetching stock level data:', error);
        throw error;
    }
};

// ----------ALERTS & REPORTS----------


export const getExpiringItems = async (days: number = 90): Promise<InventoryItem[]> => {
    // -----ReportingController endpoint
    const response = await axiosInstance.get(`/reports/alerts/expiring?days=${days}`);
    return response.data;
};

export const getReorderSuggestions = async (): Promise<InventoryItem[]> => {
    // -----ReportingController endpoint
    const response = await axiosInstance.get('/reports/alerts/reorder');
    return response.data;
};
