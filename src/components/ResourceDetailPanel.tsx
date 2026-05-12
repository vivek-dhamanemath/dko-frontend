"use client";

import { useEffect, useRef, useState } from "react";
import {
    X,
    ExternalLink,
    Pin,
    Edit3,
    Archive,
    Trash2,
    Copy,
    Check,
    FileText,
    Folder
} from "lucide-react";
import { Resource } from "../services/resourceService";
import { getSource } from "../utils/sourceUtils";
import { getIconComponent } from "./IconPicker";
import { getCategoryColorClasses, CategoryColorMap } from "../services/categoryColorService";

interface ResourceDetailPanelProps {
    resource: Resource | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (resource: Resource) => void;
    onDelete?: (id: string) => void;
    onArchive?: (id: string, isArchived: boolean) => void;
    onPin?: (id: string) => void;
    categoryColors?: CategoryColorMap;
}

const ensureProtocol = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
};

const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return `${date} at ${time}`;
};

export default function ResourceDetailPanel({
    resource,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    onArchive,
    onPin,
    categoryColors
}: ResourceDetailPanelProps) {
    const [isCopied, setIsCopied] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => { setIsCopied(false); }, [resource?.id]);

    if (!resource) return null;

    const sourceInfo = getSource(resource.url);
    const CustomIcon = getIconComponent(resource.icon);
    const DisplayIcon = CustomIcon || sourceInfo.icon;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(resource.url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />
            <div
                ref={panelRef}
                className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-[#ebe4db] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Top section */}
                    <div className="px-6 pt-6 pb-5">
                        {/* Title row with close button */}
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-[22px] font-semibold text-[#1f1a14] leading-tight flex-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                {resource.title}
                            </h2>
                            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#f5f0eb] flex items-center justify-center transition-colors shrink-0 mt-0.5">
                                <X className="w-4 h-4 text-[#9a8b78]" />
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2.5 mt-5">
                            <a
                                href={ensureProtocol(resource.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1f1a14] hover:bg-[#3d3429] text-white text-[13px] font-semibold rounded-lg transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open Link
                            </a>
                            <button
                                onClick={handleCopy}
                                className={`flex items-center justify-center gap-2 px-4 py-2.5 border text-[13px] font-semibold rounded-lg transition-all ${isCopied
                                    ? "bg-[#f5f0eb] border-[#d9cfc2] text-[#1f1a14]"
                                    : "bg-white border-[#ebe4db] text-[#5c4f3f] hover:bg-[#faf8f5]"
                                    }`}
                            >
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {isCopied ? "Copied!" : "Copy Link"}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#ebe4db]" />

                    {/* Metadata section */}
                    <div className="px-6 py-5">
                        {/* 2-column grid: Status + Last Modified */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                            {/* Status */}
                            <div>
                                <div className="text-[11px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Status
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {resource.isPinned ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1f1a14] bg-[#f5f0eb] border border-[#ebe4db] px-2 py-0.5 rounded-md">
                                            <Pin className="w-3 h-3 fill-current" /> PINNED
                                        </span>
                                    ) : resource.isArchived ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                            <Archive className="w-3 h-3" /> ARCHIVED
                                        </span>
                                    ) : (
                                        <span className="text-[14px] text-[#3d3429] font-medium">Active</span>
                                    )}
                                </div>
                            </div>

                            {/* Last Modified */}
                            <div>
                                <div className="text-[11px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Last Modified
                                </div>
                                <div className="text-[14px] text-[#3d3429] font-medium">
                                    {formatDateTime(resource.updatedAt || resource.createdAt)}
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <div className="text-[11px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Category
                                </div>
                                {resource.category ? (
                                    <span className={`inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md border ${getCategoryColorClasses(categoryColors?.[resource.category])}`}>
                                        {resource.category}
                                    </span>
                                ) : (
                                    <span className="text-[13px] text-[#d9cfc2]">—</span>
                                )}
                            </div>

                            {/* Collections */}
                            <div>
                                <div className="text-[11px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Collections
                                </div>
                                {resource.collections && resource.collections.length > 0 ? (
                                    <div className="space-y-1">
                                        {resource.collections.map(col => (
                                            <div key={col.id} className="flex items-center gap-1.5 text-[14px] text-[#3d3429] font-medium">
                                                <Folder className="w-3.5 h-3.5 text-[#9a8b78]" />
                                                {col.name}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-[13px] text-[#d9cfc2]">—</span>
                                )}
                            </div>
                        </div>

                        {/* Tags — full width */}
                        <div className="mt-5">
                            <div className="text-[11px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Tags
                            </div>
                            {resource.tags && resource.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {resource.tags.map(tag => (
                                        <span key={tag} className="text-[12px] text-[#5c4f3f] bg-[#f5f0eb] border border-[#ebe4db] px-2.5 py-1 rounded-md font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-[13px] text-[#d9cfc2]">—</span>
                            )}
                        </div>

                        {/* URL — full width */}
                        <div className="mt-5">
                            <div className="text-[11px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                URL
                            </div>
                            <div className="text-[13px] text-[#7d6e5c] break-all leading-relaxed">
                                {resource.url}
                            </div>
                        </div>
                    </div>

                    {/* Notes section */}
                    {resource.note && (
                        <>
                            <div className="border-t border-[#ebe4db]" />
                            <div className="px-6 py-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-[#9a8b78]" />
                                    <span className="text-[11px] font-semibold text-[#9a8b78] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Notes</span>
                                </div>
                                <div className="bg-[#faf8f5] border border-[#ebe4db] rounded-lg px-4 py-3 overflow-hidden">
                                    <p className="text-[14px] text-[#3d3429] leading-relaxed whitespace-pre-wrap break-words" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                                        {resource.note}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#ebe4db] bg-[#faf8f5] shrink-0">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPin?.(resource.id)}
                            className={`flex items-center gap-1.5 px-3 h-9 rounded-lg text-[12px] font-semibold transition-colors ${resource.isPinned
                                ? "bg-[#1f1a14] text-white"
                                : "bg-white border border-[#ebe4db] text-[#5c4f3f] hover:bg-[#f5f0eb]"
                                }`}
                        >
                            <Pin className={`w-3.5 h-3.5 ${resource.isPinned ? "fill-current" : ""}`} />
                            {resource.isPinned ? "Unpin" : "Pin"}
                        </button>
                        <button
                            onClick={() => { onEdit?.(resource); onClose(); }}
                            className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-white border border-[#ebe4db] text-[#5c4f3f] hover:bg-[#f5f0eb] text-[12px] font-semibold transition-colors"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                        </button>
                        <button
                            onClick={() => onArchive?.(resource.id, resource.isArchived)}
                            className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-white border border-[#ebe4db] text-[#5c4f3f] hover:bg-[#f5f0eb] text-[12px] font-semibold transition-colors"
                        >
                            <Archive className="w-3.5 h-3.5" />
                            {resource.isArchived ? "Unarchive" : "Archive"}
                        </button>
                        <button
                            onClick={() => { onDelete?.(resource.id); onClose(); }}
                            className="ml-auto flex items-center gap-1.5 px-3 h-9 rounded-lg bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:text-red-600 text-[12px] font-semibold transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
