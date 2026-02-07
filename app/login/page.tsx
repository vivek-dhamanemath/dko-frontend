"use client";

import { useState } from "react";
import { login } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleLogin() {
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (error: any) {
            alert(error.message || "Login failed");
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Welcome Back</h1>
                <p className="subtitle">Please enter your credentials to continue</p>

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

                <button className="auth-button" onClick={handleLogin} suppressHydrationWarning>
                    Sign In
                </button>

                <div className="auth-footer">
                    Don’t have an account?{" "}
                    <a href="/register" className="auth-link">
                        Create one now
                    </a>
                </div>
            </div>
        </div>
    );
}
