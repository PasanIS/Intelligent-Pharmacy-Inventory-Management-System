import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Table from '../components/common/Table';
import type { TableColumn } from '../components/common/Table';

import type { InventoryItem } from '../types';

import { getExpiringItems, getReorderSuggestions } from '../api/apiService';
import { differenceInDays, isAfter } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const AlertsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('expiring');
    const [expiringItems, setExpiringItems] = useState<InventoryItem[]>([]);
    const [reorderSuggestions, setReorderSuggestions] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching ---

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {

            const [expiring, reorder] = await Promise.all([
                getExpiringItems(),
                getReorderSuggestions(),
            ]);

            setExpiringItems(expiring);
            setReorderSuggestions(reorder);

        } catch (err) {
            console.error('Failed to fetch alerts:', err);
            setError('Failed to load alerts. Please check the server connection.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Action Handlers ---

    // -----State for the review modal
    const [reviewItem, setReviewItem] = useState<InventoryItem | null>(null);

    const handleReviewDrug = (item: InventoryItem) => {
        setReviewItem(item);
    };


    const handleReorderAction = (item: InventoryItem) => {
        navigate(`/reorder/${item.id}`);
        console.log('Navigating to reorder drug:', item.brandName, 'ID:', item.id);
    };


    const handleDiscardAction = (item: InventoryItem) => {
        if (window.confirm(`Are you sure you want to discard the reorder suggestion for ${item.brandName}?`)) {

            console.log('Discarded reorder suggestion for:', item.brandName);

            alert(`Suggestion for ${item.brandName} manually noted as reviewed.`);
        }
    };

    // --- Table Configuration ---

    const getDaysRemaining = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        if (isAfter(today, expiry)) {
            return 'EXPIRED';
        }
        return differenceInDays(expiry, today);
    }

    const expiringColumns: TableColumn<InventoryItem>[] = [
        { key: 'brandName', header: 'BRAND NAME' },
        { key: 'genericName', header: 'GENERIC NAME' },
        { key: 'batchNumber', header: 'BATCH NUMBER' },
        { key: 'currentStock', header: 'QUANTITY' },
        { key: 'expiryDate', header: 'EXPIRY DATE', render: (value: unknown) => new Date(value as string).toLocaleDateString() },
        {
            key: 'expiryDate',
            header: 'DAYS REMAINING',
            render: (_value: unknown, item) => {
                const days = getDaysRemaining(item.expiryDate);
                const isCritical = days !== 'EXPIRED' && Number(days) <= 30;
                const isExpired = days === 'EXPIRED';

                let bgClass = 'bg-slate-800 text-slate-300';
                if (isExpired) bgClass = 'bg-red-500/20 text-red-500 border border-red-500/50';
                else if (isCritical) bgClass = 'bg-amber-500/20 text-amber-500 border border-amber-500/50';

                return <span className={`px-2 py-1 rounded text-xs font-bold ${bgClass}`}>{days}</span>
            }
        },
    ];

    const reorderColumns: TableColumn<InventoryItem>[] = [
        { key: 'brandName', header: 'DRUG NAME' },
        {
            key: 'minStockThreshold',
            header: 'REORDER THRESHOLD',
            render: (_value: unknown, item) => item.minStockThreshold ?? 'Not Set'
        },
        {
            key: 'currentStock',
            header: 'CURRENT STOCK',
            render: (value: unknown) => {
                const stock = Number(value);
                const isCritical = stock <= 0;
                return (
                    <span className={isCritical ? 'text-red-500 font-bold' : 'text-amber-500 font-bold'}>
                        {stock.toLocaleString()}
                    </span>
                );
            }
        },
        {
            key: 'id',
            header: 'SUGGESTED QUANTITY',
            render: (_value: unknown, item) => {
                const threshold = item.minStockThreshold ?? 50;
                const suggested = (threshold * 2) - item.currentStock;
                return Math.max(suggested, threshold);
            }
        },
    ];

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <MainLayout activePage="Alerts">
                <div className="flex flex-col gap-6 p-4 animate-pulse">
                    <div className="h-12 w-48 bg-slate-800/50 rounded-lg" />
                    <div className="h-96 w-full bg-slate-800/50 rounded-lg" />
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout activePage="Alerts">
                <div className="flex flex-col gap-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Alerts</h2>
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </MainLayout>
        );
    }


    // --- Render ---
    return (
        <MainLayout activePage="Alerts">
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Alerts</h2>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-800/50 pb-2">
                    <button
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'expiring'
                            ? 'border-emerald-500 text-emerald-400'
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                        onClick={() => setActiveTab('expiring')}
                    >
                        Expiring Items ({expiringItems.length})
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'reorder'
                            ? 'border-emerald-500 text-emerald-400'
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                        onClick={() => setActiveTab('reorder')}
                    >
                        Reorder Suggestions ({reorderSuggestions.length})
                    </button>
                </div>

                {/* Table Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'expiring' && (
                        <Table
                            columns={expiringColumns}
                            data={expiringItems}
                            actions={(item) => (
                                <div className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/50"
                                        onClick={() => handleReviewDrug(item)}
                                        title="Review Drug Details"
                                    >
                                        Review
                                    </Button>
                                </div>
                            )}
                        />
                    )}
                    {activeTab === 'reorder' && (
                        <Table
                            columns={reorderColumns}
                            data={reorderSuggestions}
                            actions={(item) => (
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-transparent border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/50"
                                        onClick={() => handleReorderAction(item)}
                                        title="Reorder Drug (Go to Edit Page)"
                                    >
                                        Reorder
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
                                        onClick={() => handleDiscardAction(item)}
                                        title="Discard Suggestion"
                                    >
                                        Discard
                                    </Button>
                                </div>
                            )}
                        />
                    )}
                </div>
            </div>

            {/* Review Dialog */}
            <Dialog open={!!reviewItem} onOpenChange={(open) => !open && setReviewItem(null)}>
                <DialogContent className="border border-slate-700 bg-slate-900/95 backdrop-blur-xl text-slate-200 shadow-2xl max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Drug Review
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Expiration details for <span className="text-white font-medium">{reviewItem?.brandName}</span>
                        </DialogDescription>
                    </DialogHeader>
                    {reviewItem && (
                        <div className="grid grid-cols-1 gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <Label className="text-cyan-500 text-xs uppercase tracking-wider font-semibold">Generic Name</Label>
                                    <p className="text-slate-300 mt-1">{reviewItem.genericName}</p>
                                </div>
                                <div className="space-y-1 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <Label className="text-cyan-500 text-xs uppercase tracking-wider font-semibold">Batch Number</Label>
                                    <p className="text-slate-300 mt-1">{reviewItem.batchNumber}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <Label className="text-cyan-500 text-xs uppercase tracking-wider font-semibold">Current Stock</Label>
                                    <p className="text-slate-300 mt-1 font-bold">{reviewItem.currentStock}</p>
                                </div>
                                <div className="space-y-1 bg-red-900/10 p-3 rounded-lg border border-red-500/30">
                                    <Label className="text-red-400 text-xs uppercase tracking-wider font-semibold">Expiry Date</Label>
                                    <p className="text-red-300 mt-1 font-bold">{new Date(reviewItem.expiryDate).toLocaleDateString()}</p>
                                    <p className="text-red-400 text-xs mt-1">
                                        {(() => {
                                            const days = getDaysRemaining(reviewItem.expiryDate);
                                            return days === 'EXPIRED' ? 'Item has expired' : `${days} days remaining`;
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setReviewItem(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
};

export default AlertsPage;