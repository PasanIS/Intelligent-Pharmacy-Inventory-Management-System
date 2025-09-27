import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Table from '../components/common/Table';
import type { TableColumn } from '../components/common/Table';

import type { InventoryItem } from '../types'; 
import '../styles/pages/alerts.css';

import { getExpiringItems, getReorderSuggestions } from '../api/apiService';
import { differenceInDays, isAfter } from 'date-fns'; 

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

    const handleReviewDrug = (item: InventoryItem) => {
        navigate(`/inventory/${item.id}`); 
        console.log('Navigating to review drug:', item.brandName, 'ID:', item.id);
    };

 
    const handleReorderAction = (item: InventoryItem) => {
       
        navigate(`/edit-drug/${item.id}`); 
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
        { key: 'expiryDate', header: 'EXPIRY DATE' },
        { 
            key: 'expiryDate', 
            header: 'DAYS REMAINING',
            render: (_value: unknown, item) => {
                const days = getDaysRemaining(item.expiryDate);
                const className = (days !== 'EXPIRED' && Number(days) <= 30) ? 'critical-alert' : '';
                return <span className={className}>{days}</span>
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
                const className = stock <= 0 ? 'critical-alert' : 'low-stock';
                return <span className={className}>{stock.toLocaleString()}</span>
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
                <div className="alerts-content">
                    <p className="loading-message">Loading alerts...</p>
                </div>
            </MainLayout>
        );
    }
    
    if (error) {
        return (
            <MainLayout activePage="Alerts">
                <div className="alerts-content">
                    <p className="error-message">{error}</p>
                </div>
            </MainLayout>
        );
    }


    // --- Render ---
    return (
        <MainLayout activePage="Alerts">
            <div className="alerts-content">
                <h2 className="page-title">Alerts</h2>
                
                {/* Tabs */}
                <div className="tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'expiring' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('expiring')}
                    >
                        Expiring Items ({expiringItems.length})
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'reorder' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('reorder')}
                    >
                        Reorder Suggestions ({reorderSuggestions.length})
                    </button>
                </div>
                
                {/* Table Content */}
                <div className="table-wrapper">
                    {activeTab === 'expiring' && (
                        <Table
                            columns={expiringColumns}
                            data={expiringItems}
                            actions={(item) => (
                                <div className="action-buttons">
                                    <button
                                        className="btn-action btn-view"
                                        onClick={() => handleReviewDrug(item)}
                                        title="Review Drug Details"
                                    >
                                        Review
                                    </button>
                                </div>
                            )}
                        />
                    )}
                    {activeTab === 'reorder' && (
                        <Table
                            columns={reorderColumns}
                            data={reorderSuggestions}
                            actions={(item) => (
                                <div className="action-buttons">
                                    <button
                                        className="btn-action btn-edit"
                                        onClick={() => handleReorderAction(item)}
                                        title="Reorder Drug (Go to Edit Page)"
                                    >
                                        Reorder
                                    </button>
                                    <button
                                        className="btn-action btn-delete"
                                        onClick={() => handleDiscardAction(item)}
                                        title="Discard Suggestion"
                                    >
                                        Discard
                                    </button>
                                </div>
                            )}
                        />
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default AlertsPage;