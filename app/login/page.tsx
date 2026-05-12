"use client";

import { useState } from "react";
import { login } from "@/src/services/authService";
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
