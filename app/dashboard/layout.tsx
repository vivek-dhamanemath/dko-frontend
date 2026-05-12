"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/Sidebar";
import CommandPalette from "@/src/components/CommandPalette";
import { getMe, User } from "@/src/services/authService";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            router.push("/login");
            return;
        }

        getMe()
            .then((userData) => {
                setUser(userData);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem("accessToken");
                router.push("/login");
            });
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#f5f0eb]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#d9cfc2] border-t-[#1f1a14] rounded-full animate-spin" />
                    <p className="text-[12px] text-[#9a8b78]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>// loading workspace</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f5f0eb] overflow-hidden">
            {/* Sidebar — hidden on mobile */}
            <div className="hidden lg:block flex-shrink-0">
                <Sidebar onLogout={handleLogout} user={user} />
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>

            {/* Command Palette */}
            <CommandPalette />
        </div>
    );
}
