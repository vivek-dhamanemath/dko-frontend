import { api } from "@/src/lib/api";

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
