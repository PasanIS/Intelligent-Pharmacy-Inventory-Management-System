import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Table from '../components/common/Table';
import type { TableColumn } from '../components/common/Table';
import type { Supplier } from '../types'; 
import '../../src/styles/pages/suppliers.css';
import { getSuppliers, deleteSupplier } from '../api/apiService'; 

const SuppliersPage: React.FC = () => {
    const navigate = useNavigate();
    const [supplierData, setSupplierData] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Data Fetching ---

    const fetchSuppliers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
    
            const data = await getSuppliers(); 
            setSupplierData(data);
        } catch (err) {
            console.error('Failed to fetch suppliers:', err);
            setError('Failed to load supplier data. Please check the server connection.');
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);


    // --- CRUD Handlers ---

    const handleAddSupplier = () => {
        navigate('/add-supplier');
    };

    const handleViewSupplier = (supplier: Supplier) => {

        alert(`Viewing details for: ${supplier.supplierName} (ID: ${supplier.id})`);

    };

    const handleEditSupplier = (supplier: Supplier) => {
    
        alert(`Editing: ${supplier.supplierName} (ID: ${supplier.id})`);
   
    };

    const handleDeleteSupplier = async (supplier: Supplier) => {
        if (window.confirm(`Are you sure you want to delete ${supplier.supplierName}? This cannot be undone.`)) {
            try {
                await deleteSupplier(supplier.id!);
                alert(`Successfully deleted supplier: ${supplier.supplierName}`);

                fetchSuppliers(); 
            } catch (err) {
                console.error('Failed to delete supplier:', err);
                alert('Deletion failed. Check console for details.');
            }
        }
    };
    
    // --- Filtering ---
    const filteredData = useMemo(() => {
        if (!searchTerm) return supplierData;
        
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        return supplierData.filter(supplier => (
            supplier.supplierName.toLowerCase().includes(lowerCaseSearch) ||
            supplier.contactPerson.toLowerCase().includes(lowerCaseSearch) ||
            supplier.email.toLowerCase().includes(lowerCaseSearch) ||
            supplier.phone.toLowerCase().includes(lowerCaseSearch)
        ));
    }, [supplierData, searchTerm]);


    // --- Table Configuration ---

    const columns: TableColumn<Supplier>[] = [
        { key: 'supplierName', header: 'SUPPLIER NAME' },
        { key: 'contactPerson', header: 'CONTACT PERSON' },
        { key: 'email', header: 'EMAIL' },
        { key: 'phone', header: 'PHONE NUMBER' },
    ];

    const renderActions = (supplier: Supplier) => (
        <div className="action-buttons">
            <button
                className="btn-action btn-view"
                onClick={() => handleViewSupplier(supplier)}
                title="View Supplier Details"
            >
                View
            </button>
            <button
                className="btn-action btn-edit"
                onClick={() => handleEditSupplier(supplier)}
                title="Edit Supplier"
            >
                Edit
            </button>
            <button
                className="btn-action btn-delete"
                onClick={() => handleDeleteSupplier(supplier)}
                title="Delete Supplier"
            >
                Delete
            </button>
        </div>
    );
    
    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <MainLayout activePage="Suppliers">
                <div className="suppliers-content">
                    <p className="loading-message">Loading suppliers data...</p>
                </div>
            </MainLayout>
        );
    }
    
    if (error) {
        return (
            <MainLayout activePage="Suppliers">
                <div className="suppliers-content">
                    <p className="error-message">{error}</p>
                </div>
            </MainLayout>
        );
    }

    // --- Render ---
    return (
        <MainLayout activePage="Suppliers">
            <div className="suppliers-content">
                <div className="suppliers-header-section">
                    <h2 className="page-title">Suppliers</h2>
                    <div className="actions">
                        <input
                            type="text"
                            placeholder="Search by Name, Contact, Email, or Phone"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="add-supplier-btn" onClick={handleAddSupplier}>Add New Supplier</button>
                    </div>
                </div>
                <div className="filter-summary">
                    Showing {filteredData.length} of {supplierData.length} suppliers
                </div>
                <div className="suppliers-table-container">
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

export default SuppliersPage;