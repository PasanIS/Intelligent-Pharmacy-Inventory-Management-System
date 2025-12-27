import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Table from '../components/common/Table';
import type { TableColumn } from '../components/common/Table';
import type { Supplier, ApiError } from '../types';
import { getSuppliers, deleteSupplier, addSupplier, updateSupplier } from '../api/apiService';
import { AxiosError } from 'axios';

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

interface AddSupplierForm {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
}

const SuppliersPage: React.FC = () => {
    const [supplierData, setSupplierData] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Dialog States ---
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
    const [deleteSupplierItem, setDeleteSupplierItem] = useState<Supplier | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Forms ---
    const [addForm, setAddForm] = useState<AddSupplierForm>({
        name: '',
        contactPerson: '',
        email: '',
        phone: ''
    });
    const [addErrors, setAddErrors] = useState<Partial<AddSupplierForm>>({});

    const [editForm, setEditForm] = useState<AddSupplierForm>({
        name: '',
        contactPerson: '',
        email: '',
        phone: ''
    });
    const [editErrors, setEditErrors] = useState<Partial<AddSupplierForm>>({});


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

    const handleViewSupplier = (supplier: Supplier) => {
        setViewSupplier(supplier);
    };

    const handleEditSupplier = (supplier: Supplier) => {
        setEditSupplier(supplier);
        setEditForm({
            name: supplier.supplierName,
            contactPerson: supplier.contactPerson,
            email: supplier.email,
            phone: supplier.phone
        });
        setEditErrors({});
    };

    const handleDeleteSupplier = (supplier: Supplier) => {
        setDeleteSupplierItem(supplier);
    };

    const confirmDeleteSupplier = async () => {
        if (!deleteSupplierItem) return;

        setIsSubmitting(true);
        try {
            await deleteSupplier(deleteSupplierItem.id!);
            setDeleteSupplierItem(null);
            fetchSuppliers();
        } catch (err) {
            console.error('Failed to delete supplier:', err);
            alert('Deletion failed. Check console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Validation Logic (Reusable) ---
    const validateForm = (form: AddSupplierForm, setErrors: React.Dispatch<React.SetStateAction<Partial<AddSupplierForm>>>): boolean => {
        const newErrors: Partial<AddSupplierForm> = {};
        let isValid = true;

        if (!form.name.trim()) { newErrors.name = 'Supplier name is required'; isValid = false; }
        if (!form.contactPerson.trim()) { newErrors.contactPerson = 'Contact person is required'; isValid = false; }

        if (!form.email.trim()) {
            newErrors.email = 'Email is required'; isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Invalid email address'; isValid = false;
        }

        if (!form.phone.trim()) {
            newErrors.phone = 'Phone number is required'; isValid = false;
        } else if (!/^[\d\s\-+()]{10,}$/.test(form.phone)) {
            newErrors.phone = 'Invalid phone number (min 10 digits)'; isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    // --- Submit Handlers ---

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm(addForm, setAddErrors)) return;

        setIsSubmitting(true);
        try {
            await addSupplier({
                supplierName: addForm.name,
                contactPerson: addForm.contactPerson,
                email: addForm.email,
                phone: addForm.phone,
            });

            // -----Success
            setIsAddOpen(false);
            setAddForm({ name: '', contactPerson: '', email: '', phone: '' }); // -----Reset form
            fetchSuppliers(); // -----Refresh list
        } catch (error) {
            console.error('Error adding supplier:', error);
            const errorMessage = error instanceof AxiosError && error.response?.data
                ? (error.response.data as ApiError).message || 'Failed to add supplier.'
                : 'Network error.';
            alert(errorMessage); // -----Simple alert for error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editSupplier) return;

        if (!validateForm(editForm, setEditErrors)) return;

        setIsSubmitting(true);
        try {
            await updateSupplier(editSupplier.id!, {
                supplierName: editForm.name,
                contactPerson: editForm.contactPerson,
                email: editForm.email,
                phone: editForm.phone,
            });

            // -----Success
            setEditSupplier(null);
            fetchSuppliers(); // Refresh list
        } catch (error) {
            console.error('Error updating supplier:', error);
            const errorMessage = error instanceof AxiosError && error.response?.data
                ? (error.response.data as ApiError).message || 'Failed to update supplier.'
                : 'Network error.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
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
        <div className="flex gap-2 justify-center">
            <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/50"
                onClick={() => handleViewSupplier(supplier)}
                title="View Supplier Details"
            >
                View
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/50"
                onClick={() => handleEditSupplier(supplier)}
                title="Edit Supplier"
            >
                Edit
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
                onClick={() => handleDeleteSupplier(supplier)}
                title="Delete Supplier"
            >
                Delete
            </Button>
        </div>
    );

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <MainLayout activePage="Suppliers">
                <div className="flex flex-col gap-6 p-4 animate-pulse">
                    <div className="h-12 w-48 bg-slate-800/50 rounded-lg" />
                    <div className="h-96 w-full bg-slate-800/50 rounded-lg" />
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout activePage="Suppliers">
                <div className="flex flex-col gap-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Suppliers</h2>
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </MainLayout>
        );
    }

    // --- Render ---
    return (
        <MainLayout activePage="Suppliers">
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Suppliers</h2>
                    <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto">
                        <Input
                            placeholder="Search by Name, Contact, Email, or Phone"
                            className="w-full sm:w-[350px] bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20"
                            onClick={() => setIsAddOpen(true)}
                        >
                            Add New Supplier
                        </Button>
                    </div>
                </div>

                <div className="glass-card flex items-center justify-between p-4 rounded-xl border border-slate-800/50">
                    <div className="text-sm text-slate-500">
                        Showing <span className="text-emerald-400 font-bold">{filteredData.length}</span> of {supplierData.length} suppliers
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredData}
                    actions={renderActions}
                />
            </div>

            {/* View Supplier Dialog */}
            <Dialog open={!!viewSupplier} onOpenChange={(open) => !open && setViewSupplier(null)}>
                <DialogContent className="border border-slate-700 bg-slate-900/95 backdrop-blur-xl text-slate-200 shadow-2xl max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Supplier Details
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Complete information for <span className="text-white font-medium">{viewSupplier?.supplierName}</span>
                        </DialogDescription>
                    </DialogHeader>
                    {viewSupplier && (
                        <div className="grid grid-cols-1 gap-6 py-4">
                            <div className="space-y-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                <Label className="text-cyan-500 text-xs uppercase tracking-wider font-semibold">Contact Person</Label>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="p-2 rounded-full bg-slate-700/50 text-emerald-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    </div>
                                    <p className="font-medium text-lg text-white">{viewSupplier.contactPerson}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <Label className="text-cyan-500 text-xs uppercase tracking-wider font-semibold">Email Address</Label>
                                    <p className="text-slate-300 mt-1 break-all">{viewSupplier.email}</p>
                                </div>
                                <div className="space-y-1 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <Label className="text-cyan-500 text-xs uppercase tracking-wider font-semibold">Phone Number</Label>
                                    <p className="text-slate-300 mt-1">{viewSupplier.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setViewSupplier(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Supplier Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="border border-slate-700 bg-slate-900/95 backdrop-blur-xl text-slate-200 shadow-2xl max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Add New Supplier
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Enter the details of the new supplier below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="add-name" className="text-slate-300">Supplier Name <span className="text-red-400">*</span></Label>
                            <Input
                                id="add-name"
                                value={addForm.name}
                                onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., ABC Pharma Ltd"
                                className={`bg-slate-950 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 ${addErrors.name ? 'border-red-500/50' : ''}`}
                            />
                            {addErrors.name && <p className="text-xs text-red-400">{addErrors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="add-contactPerson" className="text-slate-300">Contact Person <span className="text-red-400">*</span></Label>
                            <Input
                                id="add-contactPerson"
                                value={addForm.contactPerson}
                                onChange={(e) => setAddForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                                placeholder="e.g., John Doe"
                                className={`bg-slate-900 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 ${addErrors.contactPerson ? 'border-red-500/50' : ''}`}
                            />
                            {addErrors.contactPerson && <p className="text-xs text-red-400">{addErrors.contactPerson}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="add-email" className="text-slate-300">Email <span className="text-red-400">*</span></Label>
                                <Input
                                    id="add-email"
                                    type="email"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="john@example.com"
                                    className={`bg-slate-950 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 ${addErrors.email ? 'border-red-500/50' : ''}`}
                                />
                                {addErrors.email && <p className="text-xs text-red-400">{addErrors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="add-phone" className="text-slate-300">Phone <span className="text-red-400">*</span></Label>
                                <Input
                                    id="add-phone"
                                    type="tel"
                                    value={addForm.phone}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="+1 234 567 890"
                                    className={`bg-slate-900 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 ${addErrors.phone ? 'border-red-500/50' : ''}`}
                                />
                                {addErrors.phone && <p className="text-xs text-red-400">{addErrors.phone}</p>}
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsAddOpen(false)}
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20"
                            >
                                {isSubmitting ? 'Adding...' : 'Add Supplier'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Supplier Dialog */}
            <Dialog open={!!editSupplier} onOpenChange={(open) => !open && setEditSupplier(null)}>
                <DialogContent className="border border-slate-700 bg-slate-900/95 backdrop-blur-xl text-slate-200 shadow-2xl max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Edit Supplier
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Update the supplier details below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-slate-300">Supplier Name <span className="text-red-400">*</span></Label>
                            <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., ABC Pharma Ltd"
                                className={`bg-slate-950 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 ${editErrors.name ? 'border-red-500/50' : ''}`}
                            />
                            {editErrors.name && <p className="text-xs text-red-400">{editErrors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-contactPerson" className="text-slate-300">Contact Person <span className="text-red-400">*</span></Label>
                            <Input
                                id="edit-contactPerson"
                                value={editForm.contactPerson}
                                onChange={(e) => setEditForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                                placeholder="e.g., John Doe"
                                className={`bg-slate-900 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 ${editErrors.contactPerson ? 'border-red-500/50' : ''}`}
                            />
                            {editErrors.contactPerson && <p className="text-xs text-red-400">{editErrors.contactPerson}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-email" className="text-slate-300">Email <span className="text-red-400">*</span></Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="john@example.com"
                                    className={`bg-slate-950 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 ${editErrors.email ? 'border-red-500/50' : ''}`}
                                />
                                {editErrors.email && <p className="text-xs text-red-400">{editErrors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone" className="text-slate-300">Phone <span className="text-red-400">*</span></Label>
                                <Input
                                    id="edit-phone"
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="+1 234 567 890"
                                    className={`bg-slate-900 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 ${editErrors.phone ? 'border-red-500/50' : ''}`}
                                />
                                {editErrors.phone && <p className="text-xs text-red-400">{editErrors.phone}</p>}
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setEditSupplier(null)}
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold border-none shadow-lg shadow-amber-500/20"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteSupplierItem} onOpenChange={(open) => !open && setDeleteSupplierItem(null)}>
                <DialogContent className="border border-red-900/50 bg-slate-900/95 backdrop-blur-xl text-slate-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 font-bold text-xl">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Are you sure you want to delete <strong className="text-white">{deleteSupplierItem?.supplierName}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteSupplierItem(null)} className="text-slate-400 hover:text-white hover:bg-slate-800">Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteSupplier}
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete Supplier'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
};

export default SuppliersPage;