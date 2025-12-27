import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Table from '../components/common/Table';
import type { TableColumn } from '../components/common/Table';

import type { InventoryItem, Category, Supplier } from '../types';

import {
    getInventoryItems,
    getAllCategories,
    getSuppliers,
    deleteInventoryItem,
    updateInventoryItem
} from '../api/apiService';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const InventoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // -----Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');

    // -----Dialog States
    const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);

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

            console.log('API RAW DATA:', { firstItem: items[0], categories: cats, suppliers: supps });

            // Map IDs to names to ensure table displays correct info
            const enrichedItems = items.map(item => {
                // Handle potential snake_case from backend if camelCase is missing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rawItem = item as any;

                // Robust ID extraction
                let catId = item.categoryId || rawItem.category_id;
                if (!catId && rawItem.category && typeof rawItem.category === 'object') {
                    catId = rawItem.category.id;
                } else if (!catId && rawItem.category) {
                    catId = rawItem.category;
                }

                let suppId = item.supplierId || rawItem.supplier_id;
                if (!suppId && rawItem.supplier && typeof rawItem.supplier === 'object') {
                    suppId = rawItem.supplier.id;
                } else if (!suppId && rawItem.supplier) {
                    suppId = rawItem.supplier;
                }

                // Ensure IDs are compared as numbers (or strings if necessary)
                const categoryMatch = cats.find(c => Number(c.id) === Number(catId));
                const supplierMatch = supps.find(s => Number(s.id) === Number(suppId));

                return {
                    ...item,
                    categoryId: catId ? Number(catId) : null, // Normalize for filtering
                    supplierId: suppId ? Number(suppId) : null, // Normalize for filtering
                    categoryName: categoryMatch?.name || item.categoryName || 'N/A',
                    supplierName: supplierMatch?.supplierName || item.supplierName || 'N/A'
                };
            });

            console.log('ENRICHED DATA:', enrichedItems[0]);

            setInventoryData(enrichedItems);
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

    const handleUpdateDrug = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editItem) return;

        try {
            await updateInventoryItem(editItem.id!, editItem);
            setEditItem(null); // -----Close dialog
            fetchData(); // -----Refresh list
        } catch (err) {
            console.error('Failed to update drug:', err);
            alert('Failed to update drug details.');
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteItem) return;
        try {
            await deleteInventoryItem(deleteItem.id!);
            setDeleteItem(null); // -----Close dialog
            fetchData(); // -----Refresh list
        } catch (err) {
            console.error('Failed to delete drug:', err);
            alert('Deletion failed. Check console for details.');
        }
    };

    // --- Data Filtering Logic ---

    const filteredData = useMemo(() => {
        return inventoryData.filter(item => {

            const matchesSearch = searchTerm === '' ||
                item.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.genericName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = categoryFilter === 'all' || item.categoryId === Number(categoryFilter);

            const matchesSupplier = supplierFilter === 'all' || item.supplierId === Number(supplierFilter);

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
            render: (_value: unknown, item) => item.categoryName || <span className="text-slate-500">N/A</span>
        },
        {
            key: 'supplierName',
            header: 'SUPPLIER',
            render: (_value: unknown, item) => item.supplierName || <span className="text-slate-500">N/A</span>
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
                    <div className={`flex items-center gap-2 font-medium ${isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isLowStock && <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />}
                        {numValue.toLocaleString()}
                    </div>
                );
            }
        },
    ];

    const renderActions = (item: InventoryItem) => (
        <div className="flex gap-2 justify-center">
            <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/50"
                onClick={() => setViewItem(item)}
            >
                View
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/50"
                onClick={() => setEditItem({ ...item })}
            >
                Edit
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
                onClick={() => setDeleteItem(item)}
            >
                Delete
            </Button>
        </div>
    );

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <MainLayout activePage="Inventory">
                <div className="flex flex-col gap-6 p-4 animate-pulse">
                    <div className="h-12 w-48 bg-slate-800/50 rounded-lg" />
                    <div className="h-24 w-full bg-slate-800/50 rounded-lg" />
                    <div className="h-96 w-full bg-slate-800/50 rounded-lg" />
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout activePage="Inventory">
                <div className="flex flex-col gap-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Inventory Management</h2>
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </MainLayout>
        );
    }

    // --- Render ---
    return (
        <MainLayout activePage="Inventory">
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Inventory Management</h2>
                    <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto">
                        <Input
                            placeholder="Search by Brand Name or Generic Name"
                            className="w-full sm:w-[300px] bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20" onClick={handleAddDrug}>
                            Add New Drug
                        </Button>
                    </div>
                </div>

                <div className="glass-card flex flex-wrap gap-4 items-end p-4 rounded-xl border border-slate-800/50">
                    {/* Category Filter */}
                    <div className="space-y-2 min-w-[200px] flex-1">
                        <Label htmlFor="category-filter" className="text-slate-400">Filter by Category</Label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger id="category-filter" className="bg-slate-950/50 border-slate-700 text-slate-200">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Supplier Filter */}
                    <div className="space-y-2 min-w-[200px] flex-1">
                        <Label htmlFor="supplier-filter" className="text-slate-400">Filter by Supplier</Label>
                        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                            <SelectTrigger id="supplier-filter" className="bg-slate-950/50 border-slate-700 text-slate-200">
                                <SelectValue placeholder="All Suppliers" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                <SelectItem value="all">All Suppliers</SelectItem>
                                {suppliers.map(supplier => (
                                    <SelectItem key={supplier.id} value={String(supplier.id)}>
                                        {supplier.supplierName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="ml-auto text-sm text-slate-500 pb-2">
                        Showing <span className="text-emerald-400 font-bold">{filteredData.length}</span> of {inventoryData.length} drugs
                    </div>
                </div>

                <Table columns={columns} data={filteredData} actions={renderActions} />

            </div>

            {/* View Drug Dialog */}
            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <DialogContent className="border border-slate-700 bg-slate-900/95 backdrop-blur-xl text-slate-200 shadow-2xl max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Drug Details</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Detailed information for <span className="text-slate-200 font-medium">{viewItem?.brandName}</span>
                        </DialogDescription>
                    </DialogHeader>
                    {viewItem && (
                        <div className="grid grid-cols-2 gap-6 py-4">
                            <div className="space-y-1">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider">Brand Name</Label>
                                <p className="font-medium text-lg text-white">{viewItem.brandName}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider">Generic Name</Label>
                                <p className="font-medium text-lg text-white">{viewItem.genericName}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider">Dosage</Label>
                                <p className="text-slate-300">{viewItem.dosage}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider">Category</Label>
                                <p className="text-slate-300">{viewItem.categoryName}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider">Supplier</Label>
                                <p className="text-slate-300">{viewItem.supplierName}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider">Stock</Label>
                                <p className="text-slate-300">{viewItem.currentStock}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider">Price</Label>
                                <p className="text-slate-300">Rs. {viewItem.unitPrice}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider">Manufactured Date</Label>
                                <p className="text-slate-300">{new Date(viewItem.manufacturedDate as unknown as string).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider">Expiry Date</Label>
                                <p className="text-slate-300">{new Date(viewItem.expiryDate as unknown as string).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Drug Dialog */}
            <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                <DialogContent className="border border-slate-700 bg-slate-900/95 backdrop-blur-xl text-slate-200 shadow-2xl max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white">Edit Drug</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Update inventory details for this item.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateDrug} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-brand" className="text-slate-300">Brand Name</Label>
                                <Input
                                    id="edit-brand"
                                    value={editItem?.brandName || ''}
                                    onChange={(e) => setEditItem(prev => prev ? { ...prev, brandName: e.target.value } : null)}
                                    required
                                    className="bg-slate-950 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-generic" className="text-slate-300">Generic Name</Label>
                                <Input
                                    id="edit-generic"
                                    value={editItem?.genericName || ''}
                                    onChange={(e) => setEditItem(prev => prev ? { ...prev, genericName: e.target.value } : null)}
                                    required
                                    className="bg-slate-950 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-price" className="text-slate-300">Unit Price</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    value={editItem?.unitPrice || 0}
                                    onChange={(e) => setEditItem(prev => prev ? { ...prev, unitPrice: Number(e.target.value) } : null)}
                                    required
                                    className="bg-slate-950 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-stock" className="text-slate-300">Current Stock</Label>
                                <Input
                                    id="edit-stock"
                                    type="number"
                                    value={editItem?.currentStock || 0}
                                    onChange={(e) => setEditItem(prev => prev ? { ...prev, currentStock: Number(e.target.value) } : null)}
                                    required
                                    className="bg-slate-950 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setEditItem(null)} className="text-slate-400 hover:text-white hover:bg-slate-800">Cancel</Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                <DialogContent className="border border-red-900/50 bg-slate-900/95 backdrop-blur-xl text-slate-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 font-bold text-xl">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Are you sure you want to delete <strong className="text-white">{deleteItem?.brandName}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteItem(null)} className="text-slate-400 hover:text-white hover:bg-slate-800">Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
};

export default InventoryPage;