import { axiosInstance } from './client';
import type { AuthResponse, ApiResponse } from '../types';

// ----------AUTHENTICATION ENDPOINTS----------

export const login = async (email: string, password: string): Promise<boolean> => {
    try {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
        console.log('[DEBUG] Login Response:', response.data);

        const token = response.data.token;
        if (token) {
            console.log('[DEBUG] Saving User to LS:', response.data.fullName);
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

export const signUp = async (
    fullName: string, 
    email: string, 
    password: string, 
    confirmPassword: string
): 
Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.post('/auth/signup', { fullName, email, password, confirmPassword });
    return response.data;
};
