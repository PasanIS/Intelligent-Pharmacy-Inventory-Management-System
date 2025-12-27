import axios from 'axios';
import type { AxiosInstance } from 'axios';

const BASE_URL = 'http://localhost:8080/api';

//----------Create a reusable Axios instance
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//----------Add a request interceptor to include the JWT token in all requests
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
