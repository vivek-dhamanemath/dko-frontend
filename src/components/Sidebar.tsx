"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutGrid,
    Tag,
    BarChart3,
    Settings,
    LogOut,
    ChevronRight,
    Sparkles
} from "lucide-react";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

interface SidebarProps {
    onLogout?: () => void;
}

const navItems: NavItem[] = [
    { name: "All Resources", href: "/dashboard", icon: LayoutGrid },
    { name: "Tags", href: "/dashboard/tags", icon: Tag },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export default function Sidebar({ onLogout }: SidebarProps) {
    const pathname = usePathname();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <aside className="flex flex-col h-screen w-64 bg-[#0f172a]">
            {/* Brand */}
            <div className="p-5 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-semibold text-sm tracking-tight">KnowHub</h1>
                        <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Resource Manager</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                }`}
                        >
                            <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                            <span className="text-sm font-medium flex-1">{item.name}</span>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-slate-800/50 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all duration-200">
                    <Settings className="w-[18px] h-[18px] flex-shrink-0" />
                    <span className="text-sm font-medium">Settings</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>

                {/* User Profile */}
                <div className="mt-3 pt-3 border-t border-slate-800/50">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-800/30 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-semibold text-white">
                            VD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">Vivek Dhamane</p>
                            <p className="text-[10px] text-slate-500">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}