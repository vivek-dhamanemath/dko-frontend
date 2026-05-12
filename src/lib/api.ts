import axios from "axios";
import { supabase } from "./supabase";

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081"}/api`,
    withCredentials: true
});

// Request interceptor — attach Supabase access token
api.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Try refreshing the session
            const { data: { session } } = await supabase.auth.refreshSession();
            if (!session) {
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);
