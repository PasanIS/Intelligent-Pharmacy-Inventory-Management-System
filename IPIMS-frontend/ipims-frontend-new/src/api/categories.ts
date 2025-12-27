import { axiosInstance } from './client';
import type { Category } from '../types';

// ----------CATEGORY ENDPOINTS----------

export const getAllCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    return response.data;
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
};

export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
};
