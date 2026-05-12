"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
    Code, Terminal, Database, Server, GitBranch, Cpu, Bug, Wrench,
    FileText, BookOpen, Video, Image, Headphones, Newspaper, PenTool,
    Globe, Link, Wifi, Cloud, Shield, Lock, Zap,
    Folder, Star, Heart, Flag, Bookmark, Lightbulb, Rocket, Target,
    RotateCcw, type LucideIcon
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
    Code, Terminal, Database, Server, GitBranch, Cpu, Bug, Wrench,
    FileText, BookOpen, Video, Image, Headphones, Newspaper, PenTool,
    Globe, Link, Wifi, Cloud, Shield, Lock, Zap,
    Folder, Star, Heart, Flag, Bookmark, Lightbulb, Rocket, Target,
};

const ICON_GROUPS = [
    { label: "DEV", icons: ["Code", "Terminal", "Database", "Server", "GitBranch", "Cpu", "Bug", "Wrench"] },
    { label: "CONTENT", icons: ["FileText", "BookOpen", "Video", "Image", "Headphones", "Newspaper", "PenTool"] },
    { label: "WEB", icons: ["Globe", "Link", "Wifi", "Cloud", "Shield", "Lock", "Zap"] },
    { label: "ORG", icons: ["Folder", "Star", "Heart", "Flag", "Bookmark", "Lightbulb", "Rocket", "Target"] },
];

interface IconPickerProps {
    value: string | null;
    onChange: (icon: string | null) => void;
    size?: "sm" | "md";
}

export function getIconComponent(name: string | null | undefined): LucideIcon | null {
    if (!name) return null;
    return ICON_MAP[name] || null;
}

export default function IconPicker({ value, onChange, size = "md" }: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const POPOVER_WIDTH = 280;
    const POPOVER_HEIGHT = 320;

    const calcPosition = useCallback(() => {
        if (!btnRef.current) return null;
        const rect = btnRef.current.getBoundingClientRect();

        // Horizontal: prefer right-aligned to button, but clamp to viewport
        let left = rect.right - POPOVER_WIDTH;
        if (left < 8) left = 8;
        if (left + POPOVER_WIDTH > window.innerWidth - 8) {
            left = window.innerWidth - POPOVER_WIDTH - 8;
        }

        // Vertical: prefer below, flip above if no space
        const spaceBelow = window.innerHeight - rect.bottom;
        let top: number;
        if (spaceBelow >= POPOVER_HEIGHT + 8) {
            top = rect.bottom + 6;
        } else {
            top = rect.top - POPOVER_HEIGHT - 6;
            if (top < 8) top = 8;
        }

        return { top, left };
    }, []);

    const openPopover = useCallback(() => {
        const pos = calcPosition();
        if (pos) {
            setPopoverPos(pos);
            setOpen(true);
        }
    }, [calcPosition]);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                popoverRef.current && !popoverRef.current.contains(target) &&
                btnRef.current && !btnRef.current.contains(target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Reposition on scroll/resize
    useEffect(() => {
        if (!open) return;
        const reposition = () => {
            const pos = calcPosition();
            if (pos) setPopoverPos(pos);
        };
        window.addEventListener("scroll", reposition, true);
        window.addEventListener("resize", reposition);
        return () => {
            window.removeEventListener("scroll", reposition, true);
            window.removeEventListener("resize", reposition);
        };
    }, [open, calcPosition]);

    const SelectedIcon = value ? ICON_MAP[value] : null;
    const btnSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";
    const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={() => open ? setOpen(false) : openPopover()}
                className={`${btnSize} rounded-lg border border-[#ebe4db] bg-white hover:bg-[#faf8f5] flex items-center justify-center transition-all ${open ? "border-[#1f1a14] ring-2 ring-[#1f1a14]/10" : ""}`}
                title={value ? `Icon: ${value}` : "Choose icon (auto)"}
            >
                {SelectedIcon ? (
                    <SelectedIcon className={`${iconSize} text-[#1f1a14]`} />
                ) : (
                    <span className="text-[9px] text-[#b8aa98] font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>auto</span>
                )}
            </button>

            {open && popoverPos && createPortal(
                <div
                    ref={popoverRef}
                    className="fixed bg-white border border-[#ebe4db] rounded-lg shadow-elevated p-3 animate-fade-in"
                    style={{ top: popoverPos.top, left: popoverPos.left, width: POPOVER_WIDTH, zIndex: 9999 }}
                >
                    {/* Reset to auto */}
                    <button
                        type="button"
                        onClick={() => { onChange(null); setOpen(false); }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium mb-2 transition-colors ${
                            !value
                                ? "bg-[#1f1a14] text-white"
                                : "text-[#5c4f3f] hover:bg-[#faf8f5]"
                        }`}
                    >
                        <RotateCcw className="w-3 h-3" />
                        Auto-detect from URL
                    </button>

                    {/* Icon groups */}
                    {ICON_GROUPS.map((group) => (
                        <div key={group.label} className="mb-2 last:mb-0">
                            <p className="text-[9px] font-medium text-[#b8aa98] tracking-widest mb-1.5 px-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {group.label}
                            </p>
                            <div className="grid grid-cols-8 gap-0.5">
                                {group.icons.map((name) => {
                                    const Icon = ICON_MAP[name];
                                    const isActive = value === name;
                                    return (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => { onChange(name); setOpen(false); }}
                                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                                                isActive
                                                    ? "bg-[#1f1a14] text-white"
                                                    : "text-[#5c4f3f] hover:bg-[#f5f0eb]"
                                            }`}
                                            title={name}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </>
    );
}
