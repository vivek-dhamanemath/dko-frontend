import { api } from "@/src/lib/api";

export interface User {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    lifetimeResourcesCount: number;
}

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        if (response.data.accessToken) {
            localStorage.setItem("accessToken", response.data.accessToken);
        }
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

export const getMe = async (): Promise<User> => {
    const response = await api.get<User>("/user/me");
    return response.data;
};
