import { authStore } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch(
    input: string,
    init: RequestInit = {}
): Promise<Response> {

    const token = authStore.getToken();

    const response = await fetch(`${BASE_URL}${input}`, {
        ...init,
        headers: {
            ...(init.headers || {}),
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
        },
        credentials: "include" // IMPORTANT: sends cookies
    });

    // Access token expired
    if (response.status === 401) {
        const refreshed = await refreshToken();

        if (!refreshed) {
            authStore.clearToken();
            window.location.href = "/login";
            throw new Error("Session expired");
        }

        // Retry original request
        return apiFetch(input, init);
    }

    return response;
}

async function refreshToken(): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include"
    });

    if (!res.ok) return false;

    const data = await res.json();
    authStore.setToken(data.accessToken);
    return true;
}
