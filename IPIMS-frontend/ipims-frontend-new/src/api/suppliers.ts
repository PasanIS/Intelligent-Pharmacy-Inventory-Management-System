import { axiosInstance } from './client';
import type { Supplier } from '../types';

// ----------SUPPLIERS CRUD----------

export const getSuppliers = async (): Promise<Supplier[]> => {
    const response = await axiosInstance.get('/suppliers');
    return response.data;
};

export const getSupplierById = async (id: number): Promise<Supplier> => {
    const response = await axiosInstance.get(`/suppliers/${id}`);
    return response.data;
};

export const addSupplier = async (supplierData: Partial<Supplier>): Promise<Supplier> => {
    const response = await axiosInstance.post('/suppliers', supplierData);
    return response.data;
};

export const updateSupplier = async (id: number, supplierData: Partial<Supplier>): Promise<Supplier> => {
    const response = await axiosInstance.put(`/suppliers/${id}`, supplierData);
    return response.data;
};

export const deleteSupplier = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/suppliers/${id}`);
};
