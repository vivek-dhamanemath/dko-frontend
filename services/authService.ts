const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid credentials");
    }

    const data = await res.json();
    // Store token in localStorage for persistence
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
    }
}

export async function logout() {
    await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    // Clear token from localStorage
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
    }
}
