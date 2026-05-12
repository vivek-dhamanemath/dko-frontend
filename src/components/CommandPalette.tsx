"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    LayoutGrid,
    Pin,
    Archive,
    Tag,
    Trash2,
    BarChart3,
    Plus,
    Moon,
    Sun,
    ArrowRight
} from "lucide-react";
import { useTheme } from "@/src/context/ThemeContext";

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: React.ElementType;
    action: () => void;
    keywords?: string[];
    section: string;
}

interface CommandPaletteProps {
    onAddResource?: () => void;
}

export default function CommandPalette({ onAddResource }: CommandPaletteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { toggleTheme, isDark } = useTheme();

    const commands: CommandItem[] = useMemo(() => [
        {
            id: "add", label: "Add Resource",
            description: "Save a new URL to your knowledge base",
            icon: Plus, action: () => { onAddResource?.(); setIsOpen(false); },
            keywords: ["new", "create", "save", "url", "add"], section: "Actions"
        },
        {
            id: "dashboard", label: "All Resources",
            description: "View all your saved resources",
            icon: LayoutGrid, action: () => { router.push("/dashboard"); setIsOpen(false); },
            keywords: ["home", "resources", "all", "dashboard"], section: "Navigate"
        },
        {
            id: "pinned", label: "Pinned",
            description: "View pinned resources",
            icon: Pin, action: () => { router.push("/dashboard/pinned"); setIsOpen(false); },
            keywords: ["pinned", "favorite", "starred"], section: "Navigate"
        },
        {
            id: "archived", label: "Archived",
            description: "View archived resources",
            icon: Archive, action: () => { router.push("/dashboard/archived"); setIsOpen(false); },
            keywords: ["archived", "old", "hidden"], section: "Navigate"
        },
        {
            id: "tags", label: "Tags",
            description: "Browse resources by tags",
            icon: Tag, action: () => { router.push("/dashboard/tags"); setIsOpen(false); },
            keywords: ["tags", "labels", "categories"], section: "Navigate"
        },
        {
            id: "trash", label: "Trash",
            description: "View deleted resources",
            icon: Trash2, action: () => { router.push("/dashboard/trash"); setIsOpen(false); },
            keywords: ["trash", "deleted", "removed"], section: "Navigate"
        },
        {
            id: "analytics", label: "Analytics",
            description: "View your stats and insights",
            icon: BarChart3, action: () => { router.push("/dashboard/analytics"); setIsOpen(false); },
            keywords: ["analytics", "stats", "insights", "chart"], section: "Navigate"
        },
        {
            id: "theme", label: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
            description: "Toggle between light and dark themes",
            icon: isDark ? Sun : Moon, action: () => { toggleTheme(); setIsOpen(false); },
            keywords: ["theme", "dark", "light", "mode", "toggle"], section: "Settings"
        },
    ], [isDark, onAddResource, router, toggleTheme]);

    const filteredCommands = useMemo(() => {
        if (!query) return commands;
        const lower = query.toLowerCase();
        return commands.filter(cmd =>
            cmd.label.toLowerCase().includes(lower) ||
            cmd.description?.toLowerCase().includes(lower) ||
            cmd.keywords?.some(k => k.includes(lower))
        );
    }, [commands, query]);

    const sections = useMemo(() => {
        const map = new Map<string, CommandItem[]>();
        filteredCommands.forEach(cmd => {
            const existing = map.get(cmd.section) || [];
            existing.push(cmd);
            map.set(cmd.section, existing);
        });
        return map;
    }, [filteredCommands]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => { setSelectedIndex(0); }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            filteredCommands[selectedIndex]?.action();
        }
    };

    useEffect(() => {
        if (listRef.current) {
            const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            selected?.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    if (!isOpen) return null;

    let flatIndex = -1;

    return (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh]">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-modal-backdrop" onClick={() => setIsOpen(false)} />

            <div className="relative w-full max-w-[560px] mx-4 bg-white rounded-xl border border-[#ebe4db] shadow-2xl overflow-hidden animate-modal-pop">
                {/* Search */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#ebe4db]">
                    <Search className="w-5 h-5 text-[#b8aa98] flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none text-[13px] text-[#1f1a14] placeholder-[#b8aa98] focus:outline-none"
                    />
                    <kbd className="text-[10px] text-[#b8aa98] bg-[#f5f0eb] px-1.5 py-0.5 rounded border border-[#ebe4db]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ESC</kbd>
                </div>

                {/* Commands */}
                <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
                    {filteredCommands.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <p className="text-[13px] text-[#9a8b78]">No results found</p>
                        </div>
                    ) : (
                        Array.from(sections.entries()).map(([section, items]) => (
                            <div key={section}>
                                <div className="px-4 pt-2 pb-1">
                                    <span className="text-[10px] font-medium text-[#b8aa98] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{section}</span>
                                </div>
                                {items.map((cmd) => {
                                    flatIndex++;
                                    const currentIndex = flatIndex;
                                    const Icon = cmd.icon;
                                    return (
                                        <button
                                            key={cmd.id}
                                            data-index={currentIndex}
                                            onClick={cmd.action}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${selectedIndex === currentIndex
                                                ? "bg-[#faf8f5]"
                                                : "hover:bg-[#faf8f5]"
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedIndex === currentIndex
                                                ? "bg-[#1f1a14] text-white"
                                                : "bg-[#f5f0eb] text-[#7d6e5c]"
                                                }`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[13px] font-medium ${selectedIndex === currentIndex ? "text-[#1f1a14]" : "text-[#5c4f3f]"}`}>{cmd.label}</p>
                                                {cmd.description && (
                                                    <p className="text-[11px] text-[#b8aa98] truncate">{cmd.description}</p>
                                                )}
                                            </div>
                                            {selectedIndex === currentIndex && (
                                                <ArrowRight className="w-4 h-4 text-[#b8aa98] flex-shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#ebe4db] bg-[#faf8f5]">
                    {[
                        { keys: "↑↓", label: "navigate" },
                        { keys: "↵", label: "select" },
                        { keys: "esc", label: "close" },
                    ].map((hint) => (
                        <div key={hint.label} className="flex items-center gap-1.5 text-[10px] text-[#b8aa98]">
                            <kbd className="px-1 py-0.5 bg-white rounded border border-[#ebe4db]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{hint.keys}</kbd>
                            <span>{hint.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
