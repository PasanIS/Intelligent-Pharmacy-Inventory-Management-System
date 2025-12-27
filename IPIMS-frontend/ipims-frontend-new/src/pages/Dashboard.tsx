import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/common/Card';
import InventoryValueChart from '../components/charts/InventoryValueChart';
import StockLevelChart from '../components/charts/StockLevelChart';
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart';
import { getDashboardSummary } from '../api/apiService';
import type { DashboardSummary } from '../types';


const initialSummaryState: DashboardSummary = {
    totalInventoryValue: '0.00',
    lowStockItemCount: 0,
    expiringSoonCount: 0,
    stockLevelsByCategory: [],
    recentTransactions: [],
    // Initialize chart data
    stockLevels: [],
    categoryBreakdown: [],
    inventoryValue: []
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
                <div className="flex flex-col gap-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Dashboard</h2>
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (isLoading) {
        return (
            <MainLayout activePage="Dashboard">
                <div className="flex flex-col gap-6 animate-pulse">
                    <h2 className="text-3xl font-bold text-slate-200">Dashboard</h2>

                    {/* Skeleton for Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-32 bg-slate-800/50 rounded-xl"></div>
                        <div className="h-32 bg-slate-800/50 rounded-xl"></div>
                        <div className="h-32 bg-slate-800/50 rounded-xl"></div>
                    </div>

                    {/* Skeleton for Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-[400px] bg-slate-800/50 rounded-xl"></div>
                        <div className="h-[400px] bg-slate-800/50 rounded-xl"></div>
                    </div>
                </div>
            </MainLayout>
        );
    }


    const formattedTotalValue = `Rs. ${parseFloat(summaryData.totalInventoryValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return (
        <MainLayout activePage="Dashboard">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
                    <span className="text-slate-400 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                {/* --- Summary Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        title="Total Inventory Value"
                        value={formattedTotalValue}
                        icon="💵"
                        className="bg-gradient-to-br from-slate-900 to-slate-800"
                    />
                    <Card
                        title="Low Stock Items"
                        value={summaryData.lowStockItemCount.toString()}
                        icon="⚠️"
                        className="bg-gradient-to-br from-slate-900 to-slate-800"
                    />
                    <Card
                        title="Expiring Soon"
                        value={summaryData.expiringSoonCount.toString()}
                        icon="📅"
                        className="bg-gradient-to-br from-slate-900 to-slate-800"
                    />
                </div>

                {/* --- Chart Section & Recent Transactions --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-card rounded-xl p-6">
                        <h3 className="text-xl font-bold text-slate-200 mb-6">Inventory Value Over Time</h3>
                        <InventoryValueChart data={summaryData.inventoryValue || []} />
                    </div>

                    <div className="glass-card rounded-xl p-6 flex flex-col">
                        <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                            Recent Transactions
                            <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full">Live</span>
                        </h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <ul className="space-y-4">
                                {/* Map the real data from the backend */}
                                {summaryData.recentTransactions.length > 0 ? (
                                    summaryData.recentTransactions.map((transaction: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3 text-sm text-slate-400 border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                                            <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                            {transaction}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-slate-500 italic">No recent transactions available.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- Stock Level Charts --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card rounded-xl p-6">
                        <h3 className="text-xl font-bold text-slate-200 mb-6">Stock Levels by Category</h3>
                        <StockLevelChart data={summaryData.stockLevels || []} />
                    </div>

                    <div className="glass-card rounded-xl p-6">
                        <h3 className="text-xl font-bold text-slate-200 mb-6">Inventory Breakdown by Category</h3>
                        <CategoryBreakdownChart data={summaryData.categoryBreakdown || []} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;