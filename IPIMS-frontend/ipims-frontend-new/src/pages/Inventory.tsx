import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Table from '../components/common/Table';
import type { TableColumn } from '../components/common/Table';

import type { InventoryItem, Category, Supplier } from '../types'; 
import '../styles/pages/inventory.css';

import { 
    getInventoryItems, 
    getAllCategories, 
    getSuppliers, 
    deleteInventoryItem 
} from '../api/apiService'; 

const InventoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(''); // Holds Category ID
    const [supplierFilter, setSupplierFilter] = useState(''); // Holds Supplier ID

    // --- Data Fetching ---
    
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [items, cats, supps] = await Promise.all([
                getInventoryItems(),
                getAllCategories(),
                getSuppliers()
            ]);
            
            setInventoryData(items);
            setCategories(cats);
            setSuppliers(supps);

        } catch (err) {
            console.error('Failed to fetch inventory data:', err);
            setError('Failed to load inventory data. Please check the server connection.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Handlers ---

    const handleAddDrug = () => {
        navigate('/add-drug');
    };

    const handleViewDrug = (item: InventoryItem) => {
        alert(`Viewing details for: ${item.brandName} (ID: ${item.id})`);
  
    };

    const handleEditDrug = (item: InventoryItem) => {
 
        navigate(`/edit-drug/${item.id}`); 
    };

    const handleDeleteDrug = async (item: InventoryItem) => {
        if (window.confirm(`Are you sure you want to delete ${item.brandName} (${item.genericName})?`)) {
            try {
                await deleteInventoryItem(item.id!);
                alert(`Successfully deleted: ${item.brandName}`);
                fetchData(); 
            } catch (err) {
                console.error('Failed to delete drug:', err);
                alert('Deletion failed. Check console for details.');
            }
        }
    };
    
    // --- Data Filtering Logic ---

    const filteredData = useMemo(() => {
        return inventoryData.filter(item => {
            
            const matchesSearch = searchTerm === '' ||
                item.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.genericName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = categoryFilter === '' || item.categoryId === Number(categoryFilter);
            
            const matchesSupplier = supplierFilter === '' || item.supplierId === Number(supplierFilter);

            return matchesSearch && matchesCategory && matchesSupplier;
        });
    }, [inventoryData, searchTerm, categoryFilter, supplierFilter]);


    // --- Table Configuration ---
   
    const columns: TableColumn<InventoryItem>[] = [
        { key: 'brandName', header: 'BRAND NAME' },
        { key: 'genericName', header: 'GENERIC NAME' },
        { key: 'dosage', header: 'DOSAGE' },
        {
            key: 'categoryName',
            header: 'CATEGORY',
    
            render: (_value: unknown, item) => item.categoryName || 'N/A'
        },
        {
            key: 'supplierName',
            header: 'SUPPLIER',
        
            render: (_value: unknown, item) => item.supplierName || 'N/A'
        },
        {
            key: 'unitPrice',
            header: 'UNIT PRICE',
            render: (value: unknown) => {
                const numValue = Number(value);
             
                return `Rs. ${numValue.toFixed(2)}`; 
            }
        },
        {
            key: 'currentStock',
            header: 'CURRENT STOCK',
            render: (value: unknown, item) => {
                const numValue = Number(value);
                const isLowStock = numValue <= (item.minStockThreshold || 50);
                
                return (
                    <span className={isLowStock ? 'low-stock' : 'high-stock'}>
                        {numValue.toLocaleString()}
                    </span>
                );
            }
        },
    ];

    const renderActions = (item: InventoryItem) => (
        <div className="action-buttons">
            <button
                className="btn-action btn-view"
                onClick={() => handleViewDrug(item)}
                title="View Drug Details"
            >
                View
            </button>
            <button
                className="btn-action btn-edit"
                onClick={() => handleEditDrug(item)}
                title="Edit Drug"
            >
                Edit
            </button>
            <button
                className="btn-action btn-delete"
                onClick={() => handleDeleteDrug(item)}
                title="Delete Drug"
            >
                Delete
            </button>
        </div>
    );

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <MainLayout activePage="Inventory">
                <div className="inventory-content">
                    <p className="loading-message">Loading inventory data...</p>
                </div>
            </MainLayout>
        );
    }
    
    if (error) {
        return (
            <MainLayout activePage="Inventory">
                <div className="inventory-content">
                    <p className="error-message">{error}</p>
                </div>
            </MainLayout>
        );
    }

    // --- Render ---
    return (
        <MainLayout activePage="Inventory">
            <div className="inventory-content">
                <div className="inventory-header-section">
                    <h2 className="page-title">Inventory Management</h2>
                    <div className="actions">
                        <input
                            type="text"
                            placeholder="Search by Brand Name or Generic Name"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="add-drug-btn" onClick={handleAddDrug}>Add New Drug</button>
                    </div>
                </div>

                <div className="filters-section">
                    {/* Category Filter */}
                    <div className="filter-group">
                        <label htmlFor="category-filter">Filter by Category:</label>
                        <select
                            id="category-filter"
                            value={categoryFilter}
                 
                            onChange={(e) => setCategoryFilter(e.target.value)} 
                            className="filter-select"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                      
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Supplier Filter */}
                    <div className="filter-group">
                        <label htmlFor="supplier-filter">Filter by Supplier:</label>
                        <select
                            id="supplier-filter"
                            value={supplierFilter}
                      
                            onChange={(e) => setSupplierFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Suppliers</option>
                            {suppliers.map(supplier => (
                    
                                <option key={supplier.id} value={supplier.id}>{supplier.supplierName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-summary">
                        Showing {filteredData.length} of {inventoryData.length} drugs
                    </div>
                </div>

                <div className="inventory-table-container">
                    <Table
                        columns={columns}
                        data={filteredData}
                        actions={renderActions}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default InventoryPage;