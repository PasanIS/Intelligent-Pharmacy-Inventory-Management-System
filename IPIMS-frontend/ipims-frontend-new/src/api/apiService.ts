import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { InventoryItem, Supplier, Category } from '../types';

// --- TYPE DEFINITIONS ---
interface DashboardSummary {
    totalInventoryValue: string; // Use string for BigDecimal from Java
    lowStockItemCount: number;
    expiringSoonCount: number;
    stockLevelsByCategory: Array<{ categoryName: string; currentStock: number }>; // Matches backend query output
    recentTransactions: string[]; // List of formatted transaction strings
}

interface AuthResponse {
    token: string;
    type: string;
    id: number;
    email: string;
    fullName: string;
}

interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
}

interface CategoryBreakdownData {
    name: string;
    value: number;
    color: string;
}

interface InventoryValueData {
    date: string;
    value: number;
    category: string;
}

interface StockLevelData {
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
}


const BASE_URL = 'http://localhost:8080/api';

// Create a reusable Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token in all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ====================================================================
// AUTHENTICATION ENDPOINTS
// ====================================================================
export const login = async (email: string, password: string): Promise<boolean> => {
    try {
        // The DTO field is 'email'
        const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password }); 
        
        const token = response.data.token;
        if (token) {
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('userFullName', response.data.fullName); 
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

export const signUp = async (fullName: string, email: string, password: string, confirmPassword: string): Promise<ApiResponse<{ message: string }>> => {
    // The backend requires 'confirmPassword' for validation
    const response = await axiosInstance.post('/auth/signup', { fullName, email, password, confirmPassword }); 
    return response.data;
};

// ====================================================================
// DASHBOARD & REPORTS ENDPOINTS
// ====================================================================


export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    // Matches the backend's ReportingController endpoint
    const response = await axiosInstance.get('/reports/summary');
    return response.data;
};

// ====================================================================
// CHART DATA ENDPOINTS
// ====================================================================

export const getCategoryBreakdownData = async (): Promise<{ data: CategoryBreakdownData[] }> => {
    try {
        // Get data from dashboard summary and transform it for the chart
        const dashboardData = await getDashboardSummary();
        const categoryColors = [
            '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
            '#d084d0', '#87ceeb', '#ffb347', '#98fb98', '#f0e68c'
        ];

        const chartData: CategoryBreakdownData[] = dashboardData.stockLevelsByCategory.map((item, index) => ({
            name: item.categoryName,
            value: item.currentStock,
            color: categoryColors[index % categoryColors.length]
        }));

        return { data: chartData };
    } catch (error) {
        console.error('Error fetching category breakdown data:', error);
        throw error;
    }
};

export const getInventoryValueData = async (): Promise<{ data: InventoryValueData[] }> => {
    try {
        // Mock data for inventory value over time (chart)
        const mockData: InventoryValueData[] = [
            { date: '2024-01', value: 150000, category: 'Total' },
            { date: '2024-02', value: 165000, category: 'Total' },
            { date: '2024-03', value: 158000, category: 'Total' },
            { date: '2024-04', value: 175000, category: 'Total' },
            { date: '2024-05', value: 182000, category: 'Total' },
            { date: '2024-06', value: 195000, category: 'Total' },
            { date: '2024-07', value: 188000, category: 'Total' },
            { date: '2024-08', value: 205000, category: 'Total' },
            { date: '2024-09', value: 212000, category: 'Total' },
            { date: '2024-10', value: 220000, category: 'Total' },
            { date: '2024-11', value: 235000, category: 'Total' },
            { date: '2024-12', value: 245000, category: 'Total' }
        ];

        return { data: mockData };
    } catch (error) {
        console.error('Error fetching inventory value data:', error);
        throw error;
    }
};

export const getStockLevelData = async (): Promise<{ data: StockLevelData[] }> => {
    try {
        // Get data from dashboard summary and transform it for the chart
        const dashboardData = await getDashboardSummary();

        const chartData: StockLevelData[] = dashboardData.stockLevelsByCategory.map((item) => ({
            category: item.categoryName,
            currentStock: item.currentStock,
            minStock: Math.floor(item.currentStock * 0.1), // Mock minimum stock level
            maxStock: Math.floor(item.currentStock * 1.5)  // Mock maximum stock level
        }));

        return { data: chartData };
    } catch (error) {
        console.error('Error fetching stock level data:', error);
        throw error;
    }
};

// ====================================================================
// INVENTORY CRUD
// ====================================================================

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
    const response = await axiosInstance.get('/inventory'); 
    return response.data;
};

export const getInventoryItemById = async (id: number): Promise<InventoryItem> => {
    const response = await axiosInstance.get(`/inventory/${id}`); 
    return response.data;
};

// Uses the InventoryRequest DTO structure
export const addInventoryItem = async (itemData: Partial<InventoryItem>): Promise<InventoryItem> => { 
    const response = await axiosInstance.post('/inventory', itemData);
    return response.data;
};

export const updateInventoryItem = async (id: number, itemData: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await axiosInstance.put(`/inventory/${id}`, itemData);
    return response.data;
};

export const deleteInventoryItem = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/inventory/${id}`);
};

// ====================================================================
// SUPPLIERS CRUD
// ====================================================================

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

// ====================================================================
// ALERTS & REPORTS
// ====================================================================

export const getExpiringItems = async (days: number = 90): Promise<InventoryItem[]> => {
    // Matches the new ReportingController endpoint
    const response = await axiosInstance.get(`/reports/alerts/expiring?days=${days}`);
    return response.data;
};

export const getReorderSuggestions = async (): Promise<InventoryItem[]> => {
    // Matches the new ReportingController endpoint
    const response = await axiosInstance.get('/reports/alerts/reorder');
    return response.data;
};

// ====================================================================
// CATEGORY ENDPOINTS
// ====================================================================

export const getAllCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    return response.data;
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
    // Changed parameter to object to match backend DTO
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