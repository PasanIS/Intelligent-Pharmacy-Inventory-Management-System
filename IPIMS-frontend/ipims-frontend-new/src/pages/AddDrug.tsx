import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import MainLayout from "../components/layouts/MainLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import type { InventoryItem, Category, Supplier, ApiError } from "../types"; 
import "../styles/pages/add-drug.css";

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
            // Clear form data
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
            <div className="add-drug-page">
                <Card title="Add New Drug">
                    {message && <p className={`form-message ${message.includes("Failed") ? 'error' : 'success'}`}>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            {/* Brand Name Input */}
                            <div className="form-group">
                                <label htmlFor="brandName">Brand Name *</label>
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
                            <div className="form-group">
                                <label htmlFor="genericName">Generic Name *</label>
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
                            <div className="form-group">
                                <label htmlFor="dosage">Dosage *</label>
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
                            <div className="form-group">
                                <label htmlFor="categoryId">Category *</label>
                                <select
                                    id="categoryId"
                                    value={formData.categoryId || ""} 
                                    onChange={(e) =>
                                        handleInputChange("categoryId", parseInt(e.target.value) || null) 
                                    }
                                    className={errors.categoryId ? 'input-error' : ''}
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.length === 0 ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}> 
                                                {cat.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {errors.categoryId && (<span className="error-message">{errors.categoryId}</span>)}
                            </div>

                            {/* Current Stock Input */}
                            <div className="form-group">
                                <label htmlFor="currentStock">Current Stock *</label>
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
                            <div className="form-group">
                                <label htmlFor="unitPrice">Unit Price *</label>
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
                            <div className="form-group">
                                <label htmlFor="expiryDate">Expiry Date *</label>
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
                            <div className="form-group">
                                <label htmlFor="supplierId">Supplier *</label>
                                <select
                                    id="supplierId"
                                    value={formData.supplierId || ""}
                                    onChange={(e) =>
                                        handleInputChange("supplierId", parseInt(e.target.value) || null)
                                    }
                                    className={errors.supplierId ? 'input-error' : ''}
                                    required
                                >
                                    <option value="" disabled>Select a supplier</option>
                                    {suppliers.length === 0 ? (
                                        <option disabled>Loading...</option>
                                    ) : (
                                        suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.supplierName} 
                                            </option>
                                        ))
                                    )}
                                </select>
                                {errors.supplierId && (<span className="error-message">{errors.supplierId}</span>)}
                            </div>

                            {/* Batch Number Input */}
                            <div className="form-group">
                                <label htmlFor="batchNumber">Batch Number *</label>
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

                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
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