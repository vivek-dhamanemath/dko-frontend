"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) { setError("Passwords do not match"); return; }
        if (password.length < 8) { setError("Password must be at least 8 characters"); return; }

        setIsLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Registration failed");
            }
            router.push("/login?registered=true");
        } catch (error: any) {
            setError(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1f1a14] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-40 left-10 w-80 h-80 bg-[#5c4f3f] rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#3d3429] rounded-full blur-3xl" />
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
                            Start your<br />
                            <em>knowledge journey.</em>
                        </h1>
                        <p className="text-[#8a7e72] text-lg max-w-md">
                            Join developers who organize their learning resources with DKO.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[#8a7e72] text-[13px]">
                                <div className="w-1 h-1 rounded-full bg-[#5c4f3f]" />
                                Secure & private
                            </div>
                            <div className="flex items-center gap-3 text-[#8a7e72] text-[13px]">
                                <div className="w-1 h-1 rounded-full bg-[#5c4f3f]" />
                                Get started in seconds
                            </div>
                            <div className="flex items-center gap-3 text-[#8a7e72] text-[13px]">
                                <div className="w-1 h-1 rounded-full bg-[#5c4f3f]" />
                                Free forever for personal use
                            </div>
                        </div>
                    </div>
                    <p className="text-[12px] text-[#5c4f3f]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {"// developer-knowledge-organizer"}
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#f5f0eb]">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-lg bg-[#1f1a14] flex items-center justify-center text-[#d9cfc2] font-bold text-lg" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                            D
                        </div>
                        <span className="text-xl font-semibold text-[#1f1a14]">DKO</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl text-[#1f1a14]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Create your account</h2>
                        <p className="text-[#9a8b78] mt-2 text-[14px]">Start organizing your knowledge today</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8aa98]" />
                                <input type="text" className="input-professional pl-10 py-3" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8aa98]" />
                                <input type="email" className="input-professional pl-10 py-3" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8aa98]" />
                                <input type="password" className="input-professional pl-10 py-3" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8aa98]" />
                                <input type="password" className="input-professional pl-10 py-3" placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            </div>
                        </div>
                        <div className="flex items-start gap-3 pt-1">
                            <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-[#d9cfc2] text-[#1f1a14] focus:ring-[#1f1a14]/20" required />
                            <label htmlFor="terms" className="text-[13px] text-[#7d6e5c]">
                                I agree to the <Link href="/terms" className="text-[#1f1a14] hover:underline font-medium">Terms</Link> and <Link href="/privacy" className="text-[#1f1a14] hover:underline font-medium">Privacy Policy</Link>
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#1f1a14] hover:bg-[#3d3429] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-[14px]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-[#5c4f3f] border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-[13px] text-[#9a8b78] mt-8">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#1f1a14] hover:text-[#3d3429] font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
