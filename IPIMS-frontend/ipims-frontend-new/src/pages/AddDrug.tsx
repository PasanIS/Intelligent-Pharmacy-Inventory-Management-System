import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import MainLayout from "../components/layouts/MainLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import type { InventoryItem, Category, Supplier, ApiError } from "../types";


import { getAllCategories, getSuppliers, addInventoryItem } from "../api/apiService";
import { format } from "date-fns";


interface FormDataType extends Partial<InventoryItem> {

    categoryId: number | null;
    supplierId: number | null;
    categoryName?: string;
    supplierName?: string;
    minStockThreshold?: number;
}

const AddDrug: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormDataType>({
        brandName: "",
        genericName: "",
        dosage: "",
        categoryId: null,
        supplierId: null,
        currentStock: 0,
        expiryDate: "",
        batchNumber: "",
        unitPrice: 0,
        minStockThreshold: 50,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [message, setMessage] = useState("");


    const fetchSuppliers = async () => {
        try {
            const response = await getSuppliers();
            setSuppliers(response);
        } catch (error) {
            setMessage("Failed to load suppliers.");
            console.error("Failed to fetch suppliers:", error);
        }
    };


    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response);
        } catch (error) {
            setMessage("Failed to load categories.");
            console.error("Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchSuppliers();
    }, []);

    const handleInputChange = (field: keyof FormDataType, value: string | number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };


    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors: Partial<Record<keyof FormDataType, string>> = {};

        if (!formData.brandName) { newErrors.brandName = "Brand Name is required."; isValid = false; }
        if (!formData.genericName) { newErrors.genericName = "Generic Name is required."; isValid = false; }
        if (!formData.dosage) { newErrors.dosage = "Dosage is required."; isValid = false; }
        if (formData.categoryId === null) { newErrors.categoryId = "Category is required."; isValid = false; }
        if (formData.supplierId === null) { newErrors.supplierId = "Supplier is required."; isValid = false; }
        if (formData.currentStock === undefined || formData.currentStock <= 0) { newErrors.currentStock = "Stock must be a positive number."; isValid = false; }
        if (!formData.expiryDate) { newErrors.expiryDate = "Expiry Date is required."; isValid = false; }
        if (formData.unitPrice === undefined || formData.unitPrice <= 0) { newErrors.unitPrice = "Unit Price must be a positive number."; isValid = false; }
        if (!formData.batchNumber) { newErrors.batchNumber = "Batch Number is required."; isValid = false; }


        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        const payload = {
            brandName: formData.brandName,
            genericName: formData.genericName,
            dosage: formData.dosage,
            currentStock: formData.currentStock,
            expiryDate: formData.expiryDate ? format(new Date(formData.expiryDate), "yyyy-MM-dd") : "",
            batchNumber: formData.batchNumber,
            unitPrice: formData.unitPrice,
            categoryId: formData.categoryId,
            supplierId: formData.supplierId,
            minStockThreshold: formData.minStockThreshold,
        };

        try {
            await addInventoryItem(payload);

            setMessage("Drug added successfully! Redirecting...");
            // -----Clear form data
            setFormData({
                brandName: "", genericName: "", dosage: "", categoryId: null, supplierId: null,
                currentStock: 0, expiryDate: "", batchNumber: "", unitPrice: 0, minStockThreshold: 50,
            });

            setTimeout(() => navigate("/inventory"), 1500);

        } catch (error) {
            console.error("Failed to add drug:", error);
            const errorMessage =
                error instanceof AxiosError && error.response?.data
                    ? (error.response.data as ApiError).message ||
                    "Please check all fields and ensure supplier/category IDs are valid."
                    : "Network error occurred or server did not respond correctly.";
            setMessage(`Failed to add drug: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/inventory");
    };

    return (
        <MainLayout activePage="Inventory">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Add New Drug</h2>
                    <p className="text-slate-400">Enter the details of the new drug/inventory item</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg border ${message.includes("Failed") ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                        {message}
                    </div>
                )}

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Brand Name Input */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="brandName" className="text-sm font-medium text-slate-300">Brand Name *</label>
                                <Input
                                    id="brandName"
                                    type="text"
                                    value={formData.brandName || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange("brandName", e.target.value)
                                    }
                                    placeholder="e.g., Panadol"
                                    error={errors.brandName}
                                />
                            </div>

                            {/* Generic Name Input */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="genericName" className="text-sm font-medium text-slate-300">Generic Name *</label>
                                <Input
                                    id="genericName"
                                    type="text"
                                    value={formData.genericName || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange("genericName", e.target.value)
                                    }
                                    placeholder="e.g., Paracetamol"
                                    error={errors.genericName}
                                />
                            </div>

                            {/* Dosage Input */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="dosage" className="text-sm font-medium text-slate-300">Dosage *</label>
                                <Input
                                    id="dosage"
                                    type="text"
                                    value={formData.dosage || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange("dosage", e.target.value)
                                    }
                                    placeholder="e.g., 500mg"
                                    error={errors.dosage}
                                />
                            </div>

                            {/* CATEGORY Dropdown (Updated) */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="categoryId" className="text-sm font-medium text-slate-300">Category *</label>
                                <select
                                    id="categoryId"
                                    value={formData.categoryId || ""}
                                    onChange={(e) =>
                                        handleInputChange("categoryId", parseInt(e.target.value) || null)
                                    }
                                    className={`w-full px-4 py-3 rounded-lg border bg-slate-800/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${errors.categoryId ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-700/50 focus:border-cyan-500 focus:ring-cyan-500/20 hover:border-slate-600'}`}
                                    required
                                >
                                    <option value="" disabled className="bg-slate-900 text-slate-400">Select a category</option>
                                    {categories.length === 0 ? (
                                        <option disabled className="bg-slate-900">Loading...</option>
                                    ) : (
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.id} className="bg-slate-900 text-slate-100">
                                                {cat.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {errors.categoryId && (<span className="text-xs text-red-400 mt-1">{errors.categoryId}</span>)}
                            </div>

                            {/* Current Stock Input */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="currentStock" className="text-sm font-medium text-slate-300">Current Stock *</label>
                                <Input
                                    id="currentStock"
                                    type="number"
                                    value={formData.currentStock || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange("currentStock", parseInt(e.target.value) || 0)
                                    }
                                    placeholder="e.g., 100"
                                    error={errors.currentStock}
                                />
                            </div>

                            {/* Unit Price Input */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="unitPrice" className="text-sm font-medium text-slate-300">Unit Price *</label>
                                <Input
                                    id="unitPrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.unitPrice || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange("unitPrice", parseFloat(e.target.value) || 0)
                                    }
                                    placeholder="e.g., 1.50"
                                    error={errors.unitPrice}
                                />
                            </div>

                            {/* Expiry Date Input */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="expiryDate" className="text-sm font-medium text-slate-300">Expiry Date *</label>
                                <Input
                                    id="expiryDate"
                                    type="date"
                                    value={formData.expiryDate || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange("expiryDate", e.target.value)
                                    }
                                    error={errors.expiryDate}
                                />
                            </div>

                            {/* SUPPLIER Dropdown */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="supplierId" className="text-sm font-medium text-slate-300">Supplier *</label>
                                <select
                                    id="supplierId"
                                    value={formData.supplierId || ""}
                                    onChange={(e) =>
                                        handleInputChange("supplierId", parseInt(e.target.value) || null)
                                    }
                                    className={`w-full px-4 py-3 rounded-lg border bg-slate-800/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${errors.supplierId ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-700/50 focus:border-cyan-500 focus:ring-cyan-500/20 hover:border-slate-600'}`}
                                    required
                                >
                                    <option value="" disabled className="bg-slate-900 text-slate-400">Select a supplier</option>
                                    {suppliers.length === 0 ? (
                                        <option disabled className="bg-slate-900">Loading...</option>
                                    ) : (
                                        suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id} className="bg-slate-900 text-slate-100">
                                                {supplier.supplierName}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {errors.supplierId && (<span className="text-xs text-red-400 mt-1">{errors.supplierId}</span>)}
                            </div>

                            {/* Batch Number Input */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="batchNumber" className="text-sm font-medium text-slate-300">Batch Number *</label>
                                <Input
                                    id="batchNumber"
                                    type="text"
                                    value={formData.batchNumber || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange("batchNumber", e.target.value)
                                    }
                                    placeholder="e.g., PAN-2024-001"
                                    error={errors.batchNumber}
                                />
                            </div>

                            <input
                                type="hidden"
                                value={formData.minStockThreshold || 50}
                                onChange={(e) => handleInputChange("minStockThreshold", parseInt(e.target.value))}
                            />

                        </div>

                        <div className="flex items-center justify-end gap-4 mt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting} className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20">
                                {isSubmitting ? "Adding Drug..." : "Add Drug"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </MainLayout>
    );
};

export default AddDrug;