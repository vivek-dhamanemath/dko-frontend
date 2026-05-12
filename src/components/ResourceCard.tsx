"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
    Pin,
    Copy,
    ExternalLink,
    MoreHorizontal,
    Edit3,
    Archive,
    Trash2,
    RotateCcw,
    FolderPlus,
    Check,
    X
} from "lucide-react";
import { Resource } from "../services/resourceService";
import { Collection } from "../services/collectionService";
import { getSource } from "../utils/sourceUtils";
import { getIconComponent } from "./IconPicker";
import { getCategoryColorClasses, CategoryColorMap } from "../services/categoryColorService";

interface ResourceCardProps {
    resource: Resource;
    onEdit?: (resource: Resource) => void;
    onDelete?: (id: string) => void;
    onArchive?: (id: string, isArchived: boolean) => void;
    onPin?: (id: string) => void;
    onView?: (resource: Resource) => void;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    showCheckbox?: boolean;
    isTrash?: boolean;
    onRestore?: (id: string) => void;
    onPermanentDelete?: (id: string) => void;
    availableCollections?: Collection[];
    onAddToCollection?: (collectionId: string, resourceId: string) => void;
    onRemoveFromCollection?: (collectionId: string, resourceId: string) => void;
    categoryColors?: CategoryColorMap;
}

const getHostname = (url: string): string => {
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return "link";
    }
};


const ensureProtocol = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
};

const formatRelativeDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function ResourceCard({
    resource,
    onEdit,
    onDelete,
    onArchive,
    onPin,
    onView,
    isSelected,
    onSelect,
    showCheckbox,
    isTrash,
    onRestore,
    onPermanentDelete,
    availableCollections = [],
    onAddToCollection,
    onRemoveFromCollection,
    categoryColors,
}: ResourceCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [collectionsSubmenu, setCollectionsSubmenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuBtnRef = useRef<HTMLButtonElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);

    const sourceInfo = getSource(resource.url);
    const CustomIcon = getIconComponent(resource.icon);
    const DisplayIcon = CustomIcon || sourceInfo.icon;
    const hostname = getHostname(resource.url);

    const resourceCollectionIds = new Set(
        resource.collections?.map((c) => c.id) || []
    );

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                menuRef.current && !menuRef.current.contains(target) &&
                menuBtnRef.current && !menuBtnRef.current.contains(target)
            ) {
                setMenuOpen(false);
                setCollectionsSubmenu(false);
            }
        };
        if (menuOpen) {
            document.addEventListener("mousedown", handler);
        }
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    const toggleMenu = useCallback(() => {
        if (menuOpen) {
            setMenuOpen(false);
            setCollectionsSubmenu(false);
            return;
        }
        if (menuBtnRef.current) {
            const rect = menuBtnRef.current.getBoundingClientRect();
            const menuHeight = 200; // approximate menu height
            const spaceBelow = window.innerHeight - rect.bottom;
            const flipUp = spaceBelow < menuHeight;

            setMenuPos({
                top: flipUp ? rect.top - 4 : rect.bottom + 4,
                left: rect.right - 192, // w-48 = 192px, align right edge
            });
            setMenuOpen(true);
        }
    }, [menuOpen]);

    // Reposition on scroll while menu is open
    useEffect(() => {
        if (!menuOpen) return;
        const reposition = () => {
            if (menuBtnRef.current) {
                const rect = menuBtnRef.current.getBoundingClientRect();
                const menuHeight = 200;
                const spaceBelow = window.innerHeight - rect.bottom;
                const flipUp = spaceBelow < menuHeight;
                setMenuPos({
                    top: flipUp ? rect.top - 4 : rect.bottom + 4,
                    left: rect.right - 192,
                });
            }
        };
        window.addEventListener("scroll", reposition, true);
        window.addEventListener("resize", reposition);
        return () => {
            window.removeEventListener("scroll", reposition, true);
            window.removeEventListener("resize", reposition);
        };
    }, [menuOpen]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(resource.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { }
    };

    const isSelectMode = !!showCheckbox;

    const handleContentClick = () => {
        if (isSelectMode) {
            onSelect?.(resource.id);
        } else if (!isTrash) {
            onView?.(resource);
        }
    };

    return (
        <div
            className={`resource-card group relative transition-all duration-200 ${
                isSelected
                    ? "bg-[#f0ebe5] border-[#1f1a14]/20"
                    : isSelectMode
                        ? "hover:bg-[#faf8f5]"
                        : ""
            } ${isTrash ? "opacity-80" : ""}`}
        >
            {/* Left accent bar — appears when selected */}
            {isSelected && (
                <div className="absolute left-0 top-[1px] bottom-[1px] w-[3px] bg-[#1f1a14] rounded-full" />
            )}

            {/* Top row: source icon + title + actions */}
            <div className="flex items-start gap-3">

                {/* Source icon — transforms into check when selected */}
                {isSelectMode ? (
                    <div
                        onClick={handleContentClick}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200 ${
                            isSelected
                                ? "bg-[#1f1a14]"
                                : "bg-[#ebe4db] group-hover:bg-[#d9cfc2]"
                        }`}
                    >
                        {isSelected
                            ? <Check className="w-4 h-4 text-white" />
                            : <DisplayIcon className="w-4 h-4 text-[#9a8b78]" />
                        }
                    </div>
                ) : (
                    <a
                        href={ensureProtocol(resource.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-8 h-8 rounded-lg ${CustomIcon ? "bg-[#f5f0eb]" : sourceInfo.bgColor} flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105`}
                    >
                        <DisplayIcon className={`w-4 h-4 ${CustomIcon ? "text-[#1f1a14]" : sourceInfo.color}`} />
                    </a>
                )}

                {/* Title + hostname — clickable area for detail view */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={handleContentClick}>
                    <h3 className={`text-[13.5px] font-semibold text-[#1f1a14] leading-snug line-clamp-1 ${isTrash ? "line-through opacity-70" : ""}`}>
                        {resource.title}
                    </h3>
                    <p className="text-[11px] text-[#9a8b78] mt-0.5 truncate">{hostname}</p>
                </div>

                {/* Quick actions — always visible, own click handlers, NOT inside the content click zone */}
                {!isSelectMode && (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                        {!isTrash && (
                            <>
                                <button
                                    onClick={() => onPin?.(resource.id)}
                                    className={`icon-btn ${resource.isPinned ? "text-[#1f1a14]" : "text-[#d9cfc2] hover:text-[#5c4f3f]"}`}
                                    title={resource.isPinned ? "Unpin" : "Pin"}
                                >
                                    <Pin className={`w-3.5 h-3.5 pointer-events-none ${resource.isPinned ? "fill-current" : ""}`} />
                                </button>
                                <button
                                    onClick={() => handleCopy()}
                                    className={`icon-btn ${copied ? "" : "text-[#d9cfc2] hover:text-[#5c4f3f]"}`}
                                    title="Copy link"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 pointer-events-none" /> : <Copy className="w-3.5 h-3.5 pointer-events-none" />}
                                </button>
                                <a
                                    href={ensureProtocol(resource.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="icon-btn text-[#d9cfc2] hover:text-[#5c4f3f]"
                                    title="Open link"
                                >
                                    <ExternalLink className="w-3.5 h-3.5 pointer-events-none" />
                                </a>
                                <button
                                    onClick={() => onEdit?.(resource)}
                                    className="icon-btn text-[#d9cfc2] hover:text-[#5c4f3f]"
                                    title="Edit"
                                >
                                    <Edit3 className="w-3.5 h-3.5 pointer-events-none" />
                                </button>
                            </>
                        )}

                        {/* More menu trigger */}
                        <button
                            ref={menuBtnRef}
                            onClick={() => toggleMenu()}
                            className="icon-btn text-[#d9cfc2] hover:text-[#5c4f3f]"
                        >
                            <MoreHorizontal className="w-3.5 h-3.5 pointer-events-none" />
                        </button>
                    </div>
                )}

                {/* Portal dropdown menu */}
                {menuOpen && menuPos && createPortal(
                    <div
                        ref={menuRef}
                        className="fixed w-48 bg-white border border-[#ebe4db] rounded-lg shadow-elevated py-1 animate-fade-in"
                        style={{ top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
                    >
                        {isTrash ? (
                            <>
                                <button
                                    onClick={() => { onRestore?.(resource.id); setMenuOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#5c4f3f] hover:bg-[#faf8f5] transition-colors font-medium"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Restore
                                </button>
                                <button
                                    onClick={() => { onPermanentDelete?.(resource.id); setMenuOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 transition-colors font-medium"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete Forever
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { onArchive?.(resource.id, resource.isArchived); setMenuOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#5c4f3f] hover:bg-[#faf8f5] transition-colors font-medium"
                                >
                                    <Archive className="w-3.5 h-3.5" />
                                    {resource.isArchived ? "Unarchive" : "Archive"}
                                </button>
                                {/* Collections submenu */}
                                <button
                                    onClick={() => setCollectionsSubmenu(!collectionsSubmenu)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#5c4f3f] hover:bg-[#faf8f5] transition-colors font-medium"
                                >
                                    <FolderPlus className="w-3.5 h-3.5" />
                                    Organize
                                </button>
                                {collectionsSubmenu && availableCollections.length > 0 && (
                                    <div className="border-t border-[#ebe4db] mt-1 pt-1 mx-2">
                                        {availableCollections.map((col) => {
                                            const isIn = resourceCollectionIds.has(col.id);
                                            return (
                                                <button
                                                    key={col.id}
                                                    onClick={() => {
                                                        if (isIn) onRemoveFromCollection?.(col.id, resource.id);
                                                        else onAddToCollection?.(col.id, resource.id);
                                                        setMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] text-[#5c4f3f] hover:bg-[#faf8f5] rounded transition-colors"
                                                >
                                                    {isIn ? <Check className="w-3 h-3 text-emerald-600" /> : <div className="w-3 h-3" />}
                                                    <span className="truncate">{col.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                <div className="border-t border-[#ebe4db] mt-1 pt-1">
                                    <button
                                        onClick={() => { onDelete?.(resource.id); setMenuOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 transition-colors font-medium"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>,
                    document.body
                )}
            </div>

            {/* Notes preview */}
            {resource.note && !isTrash && (
                <p className="text-[11.5px] text-[#9a8b78] mt-2 line-clamp-2 leading-relaxed pl-11 cursor-pointer" onClick={handleContentClick}>
                    {resource.note}
                </p>
            )}

            {/* Bottom row: category + date + tags */}
            <div className="flex items-center gap-2 mt-2.5 pl-11 flex-wrap cursor-pointer" onClick={handleContentClick}>
                {resource.category && (
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${getCategoryColorClasses(categoryColors?.[resource.category])}`}>
                        {resource.category}
                    </span>
                )}
                <span className="text-[10px] text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatRelativeDate(resource.createdAt)}
                </span>
                {resource.tags && resource.tags.length > 0 && (
                    <div className="flex items-center gap-1 ml-auto">
                        {resource.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[10px] text-[#7d6e5c] bg-[#f5f0eb] px-1.5 py-0.5 rounded">
                                #{tag}
                            </span>
                        ))}
                        {resource.tags.length > 2 && (
                            <span className="text-[10px] text-[#b8aa98]">+{resource.tags.length - 2}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
