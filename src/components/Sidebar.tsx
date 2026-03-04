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
    ChevronDown
} from "lucide-react";
import Collections from "./Collections";
import { User } from "../services/authService";

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
                className={`group flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-all duration-150 text-[13.5px] ${isActive
                    ? "bg-slate-200/80 text-slate-900 font-semibold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium"
                    }`}
            >
                <Icon className={`w-[17px] h-[17px] flex-shrink-0 transition-colors ${isActive ? "text-slate-700" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="flex-1 truncate">{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-60" />}
            </Link>
        );
    };

    return (
        <>
            <aside className="flex flex-col h-screen w-[260px] bg-[#f7f7f5] border-r border-slate-200 shadow-[2px_0_8px_rgba(0,0,0,0.04)] select-none">

                {/* ── User / Workspace header ── */}
                <div className="flex-shrink-0 px-3 pt-3 pb-1">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-100 transition-all duration-150 group"
                    >
                        <div className="w-[22px] h-[22px] rounded-[5px] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-sm">
                            {user?.email?.slice(0, 1).toUpperCase() || "D"}
                        </div>
                        <span className="text-[13.5px] font-semibold text-slate-800 truncate flex-1 text-left">
                            {user?.email?.split("@")[0] || "DKO"}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
                    </button>

                    {/* User dropdown */}
                    {showUserMenu && (
                        <div className="mt-1 mx-1 bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="px-3 py-2.5 border-b border-slate-100">
                                <p className="text-[12px] font-semibold text-slate-800 truncate">{user?.email || "user@email.com"}</p>
                                <p className="text-[10px] text-slate-400 capitalize mt-0.5">{user?.role?.toLowerCase() ?? "user"}</p>
                            </div>
                            <div className="py-1">
                                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors font-medium">
                                    <Settings className="w-[15px] h-[15px]" />
                                    Settings
                                </button>
                                <button
                                    onClick={() => { setShowUserMenu(false); setShowLogoutConfirm(true); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                                >
                                    <LogOut className="w-[15px] h-[15px]" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Scrollable: Nav + Collections ── */}
                <div className="flex-1 overflow-y-auto min-h-0 px-3 pt-1.5 pb-4">

                    {/* Main nav */}
                    <nav className="space-y-0.5">
                        {mainNavItems.map(renderNavItem)}
                    </nav>

                    {/* Divider */}
                    <div className="my-3 mx-1 h-px bg-slate-200/70" />

                    {/* Organize section */}
                    <div className="mb-3">
                        <div className="px-2.5 mb-1.5">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Organize</span>
                        </div>
                        <nav className="space-y-0.5">
                            {organizeNavItems.map(renderNavItem)}
                        </nav>
                    </div>

                    {/* Tools section */}
                    <div className="mb-3">
                        <div className="px-2.5 mb-1.5">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tools</span>
                        </div>
                        <nav className="space-y-0.5">
                            {toolsNavItems.map(renderNavItem)}
                        </nav>
                    </div>

                    {/* Divider */}
                    <div className="my-3 mx-1 h-px bg-slate-200/70" />

                    {/* Collections */}
                    <Collections />
                </div>
            </aside>

            {/* ── Sign Out Confirmation Modal — Cat Edition 🐱 ── */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-modal-backdrop"
                        onClick={() => setShowLogoutConfirm(false)}
                    />
                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 w-[380px] overflow-hidden animate-modal-pop">
                        {/* Cat scene */}
                        <div className="bg-gradient-to-b from-slate-50 to-white pt-8 pb-5 px-6 text-center">
                            {/* Speech bubble */}
                            <div className="animate-speech-bubble mb-3 inline-block">
                                <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm relative">
                                    <p className="text-[13px] font-semibold text-slate-700">&quot;Don&apos;t go!&quot;</p>
                                    {/* Bubble tail */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45" />
                                </div>
                            </div>

                            {/* ASCII Cat */}
                            <pre className="text-slate-600 text-center inline-block leading-tight select-none" style={{ fontFamily: "'Courier New', monospace", fontSize: "16px" }}>
                                {`  /\\_/\\  
 ( o.o ) 
  > ^ <`}
                            </pre>

                            {/* Waving paw */}
                            <div className="mt-1">
                                <span className="animate-paw-wave text-xl">🐾</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6">
                            <p className="text-[12.5px] text-slate-500 text-center mb-5">
                                Your knowledge hub will miss you.<br />
                                <span className="text-slate-400 text-[11px]">// TODO: come back soon</span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 text-[13px] font-semibold hover:bg-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all border border-indigo-100"
                                >
                                    🐱 Pet the cat & stay
                                </button>
                                <button
                                    onClick={() => { setShowLogoutConfirm(false); handleLogout(); }}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-white text-[13px] font-semibold hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                                >
                                    Leave anyway 👋
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}