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
    ArrowUpRight
} from "lucide-react";
import { Resource } from "../services/resourceService";
import { getSource } from "../utils/sourceUtils";

interface ResourceDetailPanelProps {
    resource: Resource | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (resource: Resource) => void;
    onDelete?: (id: string) => void;
    onArchive?: (id: string, isArchived: boolean) => void;
    onPin?: (id: string) => void;
}

const getHostname = (url: string): string => {
    try { return new URL(url).hostname.replace('www.', ''); }
    catch { return 'link'; }
};

const getCategoryStyle = (category: string): string => {
    const styles: Record<string, string> = {
        'frontend': 'bg-sky-50 text-sky-600 border-sky-200',
        'backend': 'bg-emerald-50 text-emerald-600 border-emerald-200',
        'devops': 'bg-violet-50 text-violet-600 border-violet-200',
        'react': 'bg-blue-50 text-blue-600 border-blue-200',
        'design': 'bg-pink-50 text-pink-600 border-pink-200',
        'tutorial': 'bg-amber-50 text-amber-600 border-amber-200',
        'documentation': 'bg-slate-50 text-slate-600 border-slate-200',
        'ai': 'bg-violet-50 text-violet-600 border-violet-200',
        'api document': 'bg-cyan-50 text-cyan-600 border-cyan-200',
        'document': 'bg-indigo-50 text-indigo-600 border-indigo-200',
        'security': 'bg-red-50 text-red-600 border-red-200',
    };
    return styles[category?.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-200';
};

const ensureProtocol = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
};

export default function ResourceDetailPanel({
    resource,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    onArchive,
    onPin
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
    const SourceIcon = sourceInfo.icon;
    const hostname = getHostname(resource.url);

    const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(resource.url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl shadow-slate-900/10 transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header — source icon + name + close */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${sourceInfo.bgColor} flex items-center justify-center`}>
                            <SourceIcon className={`w-3.5 h-3.5 ${sourceInfo.color}`} />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{sourceInfo.name}</span>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {/* Title + status badges */}
                    <h2 className="text-lg font-bold text-slate-900 leading-snug">{resource.title}</h2>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[13px] text-slate-400">{hostname}</span>
                        {resource.isPinned && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                                <Pin className="w-2.5 h-2.5 fill-current" /> Pinned
                            </span>
                        )}
                        {resource.isArchived && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                <Archive className="w-2.5 h-2.5" /> Archived
                            </span>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-4">
                        <a
                            href={ensureProtocol(resource.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open Link
                        </a>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 border text-sm font-medium rounded-xl transition-all ${isCopied
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {isCopied ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    {/* Details — compact rows */}
                    <div className="mt-4 divide-y divide-slate-100">
                        {/* Category + Date row */}
                        <div className="flex items-center justify-between py-2.5">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Category</span>
                            {resource.category ? (
                                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${getCategoryStyle(resource.category)}`}>
                                    {resource.category}
                                </span>
                            ) : (
                                <span className="text-xs text-slate-300">—</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Saved</span>
                            <span className="text-xs text-slate-600 font-medium">{formattedDate}</span>
                        </div>

                        {/* Tags row */}
                        {resource.tags && resource.tags.length > 0 && (
                            <div className="py-2.5">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tags</span>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {resource.tags.map(tag => (
                                        <span key={tag} className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Collections */}
                        {resource.collections && resource.collections.length > 0 && (
                            <div className="py-2.5">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Collections</span>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {resource.collections.map(col => (
                                        <span key={col.id} className="text-[11px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-medium">
                                            {col.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {resource.note && (
                            <div className="py-2.5">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Notes</span>
                                <p className="text-[13px] text-slate-700 leading-relaxed mt-1.5 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                    {resource.note}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer — sticky at bottom */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onPin?.(resource.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${resource.isPinned
                                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Pin className={`w-3.5 h-3.5 ${resource.isPinned ? 'fill-current' : ''}`} />
                            {resource.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                            onClick={() => { onEdit?.(resource); onClose(); }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                        </button>
                        <button
                            onClick={() => onArchive?.(resource.id, resource.isArchived)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Archive className="w-3.5 h-3.5" />
                            {resource.isArchived ? 'Unarchive' : 'Archive'}
                        </button>
                        <button
                            onClick={() => { onDelete?.(resource.id); onClose(); }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors ml-auto"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
