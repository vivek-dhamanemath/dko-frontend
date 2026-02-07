"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleRegister() {
        console.log("BASE_URL:", BASE_URL);
        const targetUrl = `${BASE_URL}/api/auth/register`;
        console.log("Fetching from:", targetUrl);

        try {
            const res = await fetch(targetUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                alert(errorData.message || "Registration failed");
                return;
            }

            alert("Registration successful. Please login.");
            router.push("/login");
        } catch (error) {
            console.error("Fetch error details:", error);
            alert("Network error: Failed to connect to " + targetUrl + ". Is the backend running?");
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Join the Platform</h1>
                <p className="subtitle">Create your account to get started</p>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        className="auth-input"
                        placeholder="name@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        suppressHydrationWarning
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        suppressHydrationWarning
                    />
                </div>

                <button className="auth-button" onClick={handleRegister} suppressHydrationWarning>
                    Create Account
                </button>

                <div className="auth-footer">
                    Already have an account?{" "}
                    <a href="/login" className="auth-link">
                        Sign In
                    </a>
                </div>
            </div>
        </div>
    );
}
