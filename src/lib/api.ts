import axios from "axios";

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081"}/api`,
    withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage if it exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token expired or invalid, redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
