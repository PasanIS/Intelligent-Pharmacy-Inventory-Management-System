import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import type { Supplier, ApiError } from '../types';
import '../../src/styles/pages/add-supplier.css';

import { addSupplier } from '../api/apiService'; 

interface FormFields {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
}

const AddSupplierPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<FormFields>>({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(''); 


    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormFields, string>> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Supplier name is required';
        }

        if (!formData.contactPerson?.trim()) {
            newErrors.contactPerson = 'Contact person is required';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (!formData.phone?.trim()) {
            newErrors.phone = 'Phone number is required';
        } else {
            const phoneRegex = /^[\d\s\-+()]{10,}$/; 
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = 'Please enter a valid phone number (min 10 digits)';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormFields, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        const supplierPayload: Omit<Supplier, 'id'> = {
            supplierName: formData.name!, 
            contactPerson: formData.contactPerson!,
            email: formData.email!,
            phone: formData.phone!, 
        };

        try {
            await addSupplier(supplierPayload);

            setMessage('Supplier added successfully! Redirecting...');
            
            setFormData({ name: '', contactPerson: '', email: '', phone: '' });


            setTimeout(() => navigate('/suppliers'), 1500);

        } catch (error) {
            console.error('Error adding supplier:', error);

            const errorMessage =
                error instanceof AxiosError && error.response?.data
                    ? (error.response.data as ApiError).message ||
                      'A supplier with this name or email might already exist.'
                    : 'Network error or server failed to process request.';

            setMessage(`Failed to add supplier: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/suppliers');
    };

    return (
        <MainLayout activePage="Suppliers">
            <div className="add-supplier-content">
                <div className="add-supplier-header">
                    <h2 className="page-title">Add New Supplier</h2>
                    <p className="page-subtitle">Enter the details of the new supplier to add to the system</p>
                </div>
                
                {/* Display Messages */}
                {message && (
                    <p className={`form-message ${message.includes("Failed") ? 'error' : 'success'}`}>
                        {message}
                    </p>
                )}

                <Card className="add-supplier-form-container">
                    <form onSubmit={handleSubmit} className="add-supplier-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Supplier Name *</label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                                    placeholder="e.g., ABC Pharma Ltd"
                                    error={errors.name}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="contactPerson">Contact Person *</label>
                                <Input
                                    id="contactPerson"
                                    type="text"
                                    value={formData.contactPerson || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('contactPerson', e.target.value)}
                                    placeholder="e.g., John Doe"
                                    error={errors.contactPerson}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                                    placeholder="e.g., john.doe@abcpharma.com"
                                    error={errors.email}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                                    placeholder="e.g., +1-234-567-8900"
                                    error={errors.phone}
                                />
                            </div>
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
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Adding Supplier...' : 'Add Supplier'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </MainLayout>
    );
};

export default AddSupplierPage;