"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/Sidebar";
import CommandPalette from "@/src/components/CommandPalette";
import { getMe, logout, User } from "@/src/services/authService";
import { supabase } from "@/src/lib/supabase";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check Supabase session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push("/login");
                return;
            }

            // Fetch app user data from backend
            getMe()
                .then((userData) => {
                    setUser(userData);
                    setLoading(false);
                })
                .catch(() => {
                    router.push("/login");
                });
        });

        // Listen for auth state changes (e.g. token refresh, sign out)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                router.push("/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await logout();
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
