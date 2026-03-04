"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/Sidebar";
import { getMe, User } from "@/src/services/authService";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        if (!token) {
            router.push("/login");
            setLoading(false);
            return;
        }

        setIsAuthenticated(true);
        getMe()
            .then(setUser)
            .catch(() => {
                // User fetch failed but auth token is valid — keep going
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-700 border-t-indigo-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar - Fixed Left */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
                <Sidebar onLogout={handleLogout} user={user} />
            </div>

            {/* Main Content - With left margin for sidebar */}
            <div className="flex-1 lg:ml-[260px]">
                {children}
            </div>
        </div>
    );
}
