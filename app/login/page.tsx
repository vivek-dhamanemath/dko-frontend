"use client";

import { useState } from "react";
import { login, signInWithGoogle, signInWithGitHub } from "@/src/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (error: any) {
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleOAuth(provider: "google" | "github") {
        setError("");
        try {
            if (provider === "google") await signInWithGoogle();
            else await signInWithGitHub();
            // Supabase redirects the browser to the provider, so no further code needed
        } catch (err: any) {
            setError(err.message || `Could not sign in with ${provider}.`);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel — warm branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1f1a14] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-[#5c4f3f] rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#3d3429] rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#3d3429] flex items-center justify-center text-[#d9cfc2] font-bold text-lg" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                            D
                        </div>
                        <span className="text-xl font-semibold text-[#d9cfc2]">DKO</span>
                    </div>
                    <div className="space-y-6">
                        <h1 className="text-4xl lg:text-5xl text-[#d9cfc2] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                            Organize your<br />
                            <em>developer knowledge.</em>
                        </h1>
                        <p className="text-[#8a7e72] text-lg max-w-md">
                            Save, organize, and rediscover your learning resources. Your personal knowledge base.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[#8a7e72] text-[13px]">
                                <div className="w-1 h-1 rounded-full bg-[#5c4f3f]" />
                                Save resources from anywhere
                            </div>
                            <div className="flex items-center gap-3 text-[#8a7e72] text-[13px]">
                                <div className="w-1 h-1 rounded-full bg-[#5c4f3f]" />
                                Quick capture & smart tagging
                            </div>
                            <div className="flex items-center gap-3 text-[#8a7e72] text-[13px]">
                                <div className="w-1 h-1 rounded-full bg-[#5c4f3f]" />
                                Search & filter instantly
                            </div>
                        </div>
                    </div>
                    <p className="text-[12px] text-[#5c4f3f]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {"// developer-knowledge-organizer"}
                    </p>
                </div>
            </div>

            {/* Right Panel — form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#f5f0eb]">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-lg bg-[#1f1a14] flex items-center justify-center text-[#d9cfc2] font-bold text-lg" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                            D
                        </div>
                        <span className="text-xl font-semibold text-[#1f1a14]">DKO</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl text-[#1f1a14]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Welcome back</h2>
                        <p className="text-[#9a8b78] mt-2 text-[14px]">Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8aa98]" />
                                <input
                                    type="email"
                                    className="input-professional pl-10 py-3"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Password</label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8aa98]" />
                                <input
                                    type="password"
                                    className="input-professional pl-10 py-3"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#1f1a14] hover:bg-[#3d3429] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-[14px]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-[#5c4f3f] border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#d9cfc2]" />
                            </div>
                            <div className="relative flex justify-center text-[12px]">
                                <span className="bg-[#f5f0eb] px-3 text-[#9a8b78]">or continue with</span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => signInWithGoogle()}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-[#d9cfc2] rounded-lg hover:bg-[#ebe5de] transition-colors text-[13px] font-medium text-[#3d3429]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={() => signInWithGitHub()}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-[#d9cfc2] rounded-lg hover:bg-[#ebe5de] transition-colors text-[13px] font-medium text-[#3d3429]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-[13px] text-[#9a8b78] mt-8">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-[#1f1a14] hover:text-[#3d3429] font-semibold">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
