import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/common/Card';
import InventoryValueChart from '../components/charts/InventoryValueChart';
import StockLevelChart from '../components/charts/StockLevelChart';
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart';
import { getDashboardSummary } from '../api/apiService'; 
import type { DashboardSummary } from '../types';
import '../../src/styles/pages/dashboard.css';

const initialSummaryState: DashboardSummary = {
    totalInventoryValue: '0.00',
    lowStockItemCount: 0,
    expiringSoonCount: 0,
    stockLevelsByCategory: [],
    recentTransactions: [],
};

const DashboardPage: React.FC = () => {
    const [summaryData, setSummaryData] = useState<DashboardSummary>(initialSummaryState);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getDashboardSummary();
            setSummaryData(data);
        } catch (err) {
            console.error("Failed to fetch dashboard summary:", err);
            setError("Failed to load dashboard data. Please check the backend connection.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();

        const intervalId = setInterval(fetchDashboardData, 60000); 

        return () => clearInterval(intervalId);
    }, [fetchDashboardData]);

    if (error) {
        return (
            <MainLayout activePage="Dashboard">
                <div className="dashboard-content">
                    <h2 className="page-title">Dashboard</h2>
                    <p className="error-message">{error}</p>
                </div>
            </MainLayout>
        );
    }

    if (isLoading) {
        return (
            <MainLayout activePage="Dashboard">
                <div className="dashboard-content">
                    <h2 className="page-title">Dashboard</h2>
                    <p>Loading dashboard data...</p>

                </div>
            </MainLayout>
        );
    }

 
    const formattedTotalValue = `Rs. ${parseFloat(summaryData.totalInventoryValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return (
        <MainLayout activePage="Dashboard">
            <div className="dashboard-content">
                <h2 className="page-title">Dashboard</h2>
                
                {/* --- 1. Summary Cards (KPIs) --- */}
                <div className="summary-cards">
                    <Card 
                        title="Total Inventory Value" 
                        value={formattedTotalValue} 
                        icon="💵" 
                    />
                    <Card 
                        title="Low Stock Items" 
                        value={summaryData.lowStockItemCount.toString()} 
                        icon="⚠️" 
                    />
                    <Card 
                        title="Expiring Soon" 
                        value={summaryData.expiringSoonCount.toString()} 
                        icon="📅" 
                    />
                </div>
                
                {/* --- 2. Chart Section & Recent Transactions --- */}
                <div className="dashboard-sections">
                    <div className="chart-section">
                        <h3>Inventory Value Over Time</h3>
                        <InventoryValueChart /> 
                    </div>

                    <div className="recent-transactions">
                        <h3>Recent Transactions</h3>
                        <ul>
                            {/* Map the real data from the backend */}
                            {summaryData.recentTransactions.length > 0 ? (
                                summaryData.recentTransactions.map((transaction: string, index: number) => (
                                    <li key={index}>{transaction}</li>
                                ))
                            ) : (
                                <li>No recent transactions available.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* --- 3. Stock Level Charts --- */}
                <div className="dashboard-sections">
                    <div className="chart-section">
                        <h3>Stock Levels by Category</h3>
                        <StockLevelChart />
                    </div>
                    
                    <div className="chart-section">
                        <h3>Inventory Breakdown by Category</h3>
                        <CategoryBreakdownChart />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;