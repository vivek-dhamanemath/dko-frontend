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
    Pin,
    Archive,
    Trash2,
    ChevronDown,
    Moon,
    Sun,
    Command
} from "lucide-react";
import Collections from "./Collections";
import { User } from "../services/authService";
import { useTheme } from "../context/ThemeContext";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

interface SidebarProps {
    onLogout?: () => void;
    user?: User | null;
}

const mainNavItems: NavItem[] = [
    { name: "All Resources", href: "/dashboard", icon: LayoutGrid },
];

const organizeNavItems: NavItem[] = [
    { name: "Pinned", href: "/dashboard/pinned", icon: Pin },
    { name: "Archived", href: "/dashboard/archived", icon: Archive },
    { name: "Tags", href: "/dashboard/tags", icon: Tag },
    { name: "Trash", href: "/dashboard/trash", icon: Trash2 },
];

const toolsNavItems: NavItem[] = [
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export default function Sidebar({ onLogout, user }: SidebarProps) {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { toggleTheme, isDark } = useTheme();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    const renderNavItem = (item: NavItem) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
            <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-all duration-150 text-[13px] ${isActive
                    ? "bg-[#2d2520] text-white font-medium"
                    : "text-[#8a7e72] hover:bg-[#2d2520]/50 hover:text-[#d9cfc2] font-normal"
                    }`}
            >
                <Icon className={`w-[16px] h-[16px] flex-shrink-0 transition-colors ${isActive ? "text-[#d9cfc2]" : "text-[#5c4f3f] group-hover:text-[#8a7e72]"}`} />
                <span className="flex-1 truncate">{item.name}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-[#5c4f3f]" />}
            </Link>
        );
    };

    return (
        <>
            <aside className="sidebar-dark flex flex-col h-screen w-[260px] bg-[#1f1a14] border-r border-[#2d2520] select-none">

                {/* User / Workspace header */}
                <div className="flex-shrink-0 px-3 pt-3 pb-1">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#2d2520]/60 transition-all duration-150 group"
                    >
                        <div className="w-[22px] h-[22px] rounded-[5px] bg-gradient-to-br from-[#b8aa98] to-[#7d6e5c] flex items-center justify-center text-[10px] font-bold text-[#1f1a14] flex-shrink-0">
                            {user?.email?.slice(0, 1).toUpperCase() || "D"}
                        </div>
                        <span className="text-[13px] font-medium text-[#d9cfc2] truncate flex-1 text-left">
                            {user?.email?.split("@")[0] || "DKO"}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-[#5c4f3f] transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
                    </button>

                    {/* User dropdown */}
                    {showUserMenu && (
                        <div className="mt-1 mx-1 bg-[#2d2520] rounded-lg border border-[#3d3429] overflow-hidden animate-fade-in">
                            <div className="px-3 py-2.5 border-b border-[#3d3429]">
                                <p className="text-[12px] font-medium text-[#d9cfc2] truncate">{user?.email || "user@email.com"}</p>
                                <p className="text-[10px] text-[#5c4f3f] capitalize mt-0.5">{user?.role?.toLowerCase() ?? "user"}</p>
                            </div>
                            <div className="py-1">
                                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#8a7e72] hover:bg-[#3d3429] hover:text-[#d9cfc2] transition-colors font-medium">
                                    <Settings className="w-[14px] h-[14px]" />
                                    Settings
                                </button>
                                <button
                                    onClick={() => { setShowUserMenu(false); setShowLogoutConfirm(true); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#8a7e72] hover:bg-red-950/30 hover:text-red-400 transition-colors font-medium"
                                >
                                    <LogOut className="w-[14px] h-[14px]" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scrollable: Nav + Collections */}
                <div className="flex-1 overflow-y-auto min-h-0 px-3 pt-1.5 pb-4">

                    {/* Main nav */}
                    <nav className="space-y-0.5">
                        {mainNavItems.map(renderNavItem)}
                    </nav>

                    {/* Divider */}
                    <div className="my-3 mx-1 h-px bg-[#2d2520]" />

                    {/* Organize section */}
                    <div className="mb-3">
                        <div className="px-2.5 mb-1.5">
                            <span className="text-[10px] font-medium text-[#5c4f3f] uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Organize</span>
                        </div>
                        <nav className="space-y-0.5">
                            {organizeNavItems.map(renderNavItem)}
                        </nav>
                    </div>

                    {/* Tools section */}
                    <div className="mb-3">
                        <div className="px-2.5 mb-1.5">
                            <span className="text-[10px] font-medium text-[#5c4f3f] uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tools</span>
                        </div>
                        <nav className="space-y-0.5">
                            {toolsNavItems.map(renderNavItem)}
                        </nav>
                    </div>

                    {/* Divider */}
                    <div className="my-3 mx-1 h-px bg-[#2d2520]" />

                    {/* Collections */}
                    <Collections />
                </div>

                {/* Bottom bar: Theme toggle + Cmd+K hint */}
                <div className="flex-shrink-0 px-3 py-2.5 border-t border-[#2d2520]">
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[12px] text-[#8a7e72] hover:bg-[#2d2520]/60 hover:text-[#d9cfc2] transition-all font-medium flex-1"
                            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {isDark ? <Sun className="w-[15px] h-[15px]" /> : <Moon className="w-[15px] h-[15px]" />}
                            <span>{isDark ? "Light" : "Dark"}</span>
                        </button>
                        <div className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-[#2d2520] text-[10px] text-[#5c4f3f] border border-[#3d3429]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            <Command className="w-3 h-3" />K
                        </div>
                    </div>
                </div>
            </aside>

            {/* Sign Out Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-modal-backdrop"
                        onClick={() => setShowLogoutConfirm(false)}
                    />
                    <div className="relative bg-white rounded-xl border border-[#ebe4db] shadow-2xl w-[380px] overflow-hidden animate-modal-pop">
                        <div className="bg-[#faf8f5] pt-8 pb-5 px-6 text-center">
                            <div className="animate-speech-bubble mb-3 inline-block">
                                <div className="bg-white border border-[#ebe4db] rounded-lg px-4 py-2 shadow-sm relative">
                                    <p className="text-[13px] font-semibold text-[#3d3429]">&quot;Don&apos;t go!&quot;</p>
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#ebe4db] rotate-45" />
                                </div>
                            </div>
                            <pre className="text-[#5c4f3f] text-center inline-block leading-tight select-none" style={{ fontFamily: "'Courier New', monospace", fontSize: "16px" }}>
                                {`  /\\_/\\
 ( o.o )
  > ^ <`}
                            </pre>
                            <div className="mt-1">
                                <span className="animate-paw-wave text-xl">🐾</span>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <p className="text-[12px] text-[#7d6e5c] text-center mb-5">
                                Your knowledge hub will miss you.<br />
                                <span className="text-[#b8aa98] text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>// TODO: come back soon</span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-[#f5f0eb] text-[#5c4f3f] text-[13px] font-semibold hover:bg-[#ebe4db] active:scale-[0.98] transition-all border border-[#ebe4db]"
                                >
                                    Pet the cat & stay
                                </button>
                                <button
                                    onClick={() => { setShowLogoutConfirm(false); handleLogout(); }}
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-[#1f1a14] text-white text-[13px] font-semibold hover:bg-[#3d3429] active:scale-[0.98] transition-all"
                                >
                                    Leave anyway
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
