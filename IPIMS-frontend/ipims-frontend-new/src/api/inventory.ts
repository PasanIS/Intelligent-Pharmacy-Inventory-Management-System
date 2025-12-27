import { axiosInstance } from './client';
import type { InventoryItem } from '../types';


// ----------INVENTORY CRUD----------

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
    const response = await axiosInstance.get('/inventory');
    return response.data;
};

export const getInventoryItemById = async (id: number): Promise<InventoryItem> => {
    const response = await axiosInstance.get(`/inventory/${id}`);
    return response.data;
};

export const addInventoryItem = async (itemData: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await axiosInstance.post('/inventory', itemData);
    return response.data;
};

export const updateInventoryItem = async (id: number, itemData: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await axiosInstance.put(`/inventory/${id}`, itemData);
    return response.data;
};

export const restockInventoryItem = async (id: number, quantity: number): Promise<InventoryItem> => {
    const response = await axiosInstance.post(`/inventory/${id}/restock`, null, {
        params: { quantity }
    });
    return response.data;
};

export const deleteInventoryItem = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/inventory/${id}`);
};
