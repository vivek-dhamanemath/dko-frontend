"use client";

import { useState, useRef, useEffect } from "react";
import {
    ExternalLink,
    Pin,
    MoreHorizontal,
    Trash2,
    Edit3,
    Archive,
    RefreshCcw,
    Folder,
    ChevronRight,
    Check,
    Copy,
    ArrowUpRight
} from "lucide-react";
import { getSource } from "../utils/sourceUtils";
import { Resource } from "../services/resourceService";

interface ResourceCardProps {
    resource: Resource;
    onEdit?: (resource: Resource) => void;
    onDelete?: (id: string) => void;
    onArchive?: (id: string, isArchived: boolean) => void;
    onPin?: (id: string) => void;
    isSelected?: boolean;
    onSelect?: (id: string, selected: boolean) => void;
    isSelectionMode?: boolean;
    isTrashMode?: boolean;
    onRestore?: (id: string) => void;
    onPermanentDelete?: (id: string) => void;
    availableCollections?: { id: string; name: string }[];
    onAddToCollection?: (collectionId: string, resourceId: string) => void;
    onRemoveFromCollection?: (collectionId: string, resourceId: string) => void;
    onView?: (resource: Resource) => void;
}

const getHostname = (url: string): string => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return 'link';
    }
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
    };
    return styles[category?.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-200';
};

const getCategoryCardStyle = (category: string): { bg: string; hoverBg: string; border: string } => {
    const styles: Record<string, { bg: string; hoverBg: string; border: string }> = {
        'frontend': { bg: 'bg-sky-50', hoverBg: 'hover:bg-sky-100/70', border: 'border-sky-200' },
        'backend': { bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100/70', border: 'border-emerald-200' },
        'devops': { bg: 'bg-violet-50', hoverBg: 'hover:bg-violet-100/70', border: 'border-violet-200' },
        'react': { bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100/70', border: 'border-blue-200' },
        'design': { bg: 'bg-pink-50', hoverBg: 'hover:bg-pink-100/70', border: 'border-pink-200' },
        'tutorial': { bg: 'bg-amber-50', hoverBg: 'hover:bg-amber-100/70', border: 'border-amber-200' },
        'documentation': { bg: 'bg-slate-50', hoverBg: 'hover:bg-slate-100', border: 'border-slate-200' },
        'ai': { bg: 'bg-violet-50', hoverBg: 'hover:bg-violet-100/70', border: 'border-violet-200' },
        'api document': { bg: 'bg-cyan-50', hoverBg: 'hover:bg-cyan-100/70', border: 'border-cyan-200' },
        'document': { bg: 'bg-indigo-50', hoverBg: 'hover:bg-indigo-100/70', border: 'border-indigo-200' },
        'security': { bg: 'bg-red-50', hoverBg: 'hover:bg-red-100/70', border: 'border-red-200' },
    };
    return styles[category?.toLowerCase()] || { bg: 'bg-slate-50', hoverBg: 'hover:bg-slate-100', border: 'border-slate-200' };
};

export default function ResourceCard({
    resource,
    onEdit,
    onDelete,
    onArchive,
    onPin,
    isSelected,
    onSelect,
    isSelectionMode,
    isTrashMode = false,
    onRestore,
    onPermanentDelete,
    availableCollections = [],
    onAddToCollection,
    onRemoveFromCollection,
    onView
}: ResourceCardProps) {
    const [showActions, setShowActions] = useState(false);
    const [showFolderMenu, setShowFolderMenu] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowActions(false);
                setShowFolderMenu(false);
            }
        };
        if (showActions) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showActions]);

    const hostname = getHostname(resource.url);
    const sourceInfo = getSource(resource.url);
    const SourceIcon = sourceInfo.icon;

    const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    const ensureProtocol = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('a') || target.closest('.selection-checkbox-area')) {
            return;
        }
        if (onView) {
            onView(resource);
        } else {
            onSelect?.(resource.id, !isSelected);
        }
    };

    const handleOpenLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(ensureProtocol(resource.url), '_blank', 'noopener,noreferrer');
    };

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(resource.url);
            setIsCopying(true);
            setTimeout(() => setIsCopying(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const cardStyle = getCategoryCardStyle(resource.category);

    return (
        <div
            onClick={handleCardClick}
            className={`group relative rounded-xl p-3 transition-all duration-150 hover:shadow-sm cursor-default border ${showActions ? 'z-50' : 'z-10'} ${isSelected ? 'ring-1 ring-indigo-500/40 bg-indigo-50/50 border-indigo-200' : `${cardStyle.bg} ${cardStyle.hoverBg} ${cardStyle.border}`}`}
        >
            {/* Top row: Icon + Title + Actions */}
            <div className="flex items-start gap-2.5">
                {/* Checkbox */}
                <div
                    className="selection-checkbox-area cursor-pointer z-10 pt-1 shrink-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(resource.id, !isSelected);
                    }}
                >
                    <div className={`w-[18px] h-[18px] rounded border transition-all flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
                    </div>
                </div>

                {/* Source Icon */}
                <div
                    onClick={handleOpenLink}
                    className={`w-10 h-10 rounded-lg ${sourceInfo.bgColor} flex items-center justify-center shrink-0 cursor-pointer transition-transform group-hover:scale-105`}
                >
                    <SourceIcon className={`w-5 h-5 ${sourceInfo.color}`} />
                </div>

                {/* Title + Hostname */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="text-[13px] font-semibold text-slate-800 truncate leading-snug group-hover:text-slate-900 transition-colors">
                        {resource.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 truncate block leading-tight mt-px">
                        {hostname}
                    </span>
                </div>

                {/* Pin + Actions on hover */}
                <div className="flex items-center gap-1 shrink-0">
                    {!isTrashMode && resource.isPinned && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onPin?.(resource.id); }}
                            className="text-indigo-600 p-1"
                        >
                            <Pin className="w-4 h-4 fill-current" />
                        </button>
                    )}
                    <div className="flex items-center gap-0.5">
                        {!isTrashMode && !resource.isPinned && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onPin?.(resource.id); }}
                                className="p-1.5 rounded-md text-slate-400 hover:text-indigo-500 transition-colors"
                                title="Pin"
                            >
                                <Pin className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={handleCopyLink}
                            className={`p-1.5 rounded-md transition-all ${isCopying ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                            title="Copy Link"
                        >
                            {isCopying ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleOpenLink}
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                            title="Open"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
                                className={`p-1.5 rounded-md transition-all ${showActions ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {showActions && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-[100] py-1 overflow-visible">
                                    <div className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-0.5">
                                        Actions
                                    </div>
                                    {isTrashMode ? (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowActions(false); onRestore?.(resource.id); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] font-medium text-emerald-600 hover:bg-emerald-50 transition-colors text-left"
                                            >
                                                <RefreshCcw className="w-3.5 h-3.5" /> Restore
                                            </button>
                                            <div className="h-px bg-slate-100 mx-2.5" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowActions(false); onPermanentDelete?.(resource.id); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowActions(false); onEdit?.(resource); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowActions(false); onArchive?.(resource.id, resource.isArchived); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                                            >
                                                <Archive className="w-3.5 h-3.5" /> {resource.isArchived ? "Unarchive" : "Archive"}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowFolderMenu(!showFolderMenu); }}
                                                className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Folder className="w-3.5 h-3.5" /> Organize
                                                </div>
                                                <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showFolderMenu ? 'rotate-90 text-indigo-500' : ''}`} />
                                            </button>

                                            {showFolderMenu && (
                                                <div className="mx-1.5 mb-1 bg-slate-50 rounded-lg border border-slate-100 py-1 max-h-48 overflow-y-auto">
                                                    <div className="px-2.5 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                        Collections
                                                    </div>
                                                    {availableCollections.length > 0 ? (
                                                        availableCollections.map(folder => {
                                                            const isMember = resource.collections?.some(c => c.id === folder.id);
                                                            return (
                                                                <button
                                                                    key={folder.id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (isMember) onRemoveFromCollection?.(folder.id, resource.id);
                                                                        else onAddToCollection?.(folder.id, resource.id);
                                                                        setShowFolderMenu(false);
                                                                        setShowActions(false);
                                                                    }}
                                                                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left rounded-md"
                                                                >
                                                                    <span className="truncate pr-2">{folder.name}</span>
                                                                    {isMember && <Check className="w-3 h-3 text-indigo-500" />}
                                                                </button>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="px-2.5 py-2 text-[11px] text-slate-400 italic">No collections yet</div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="h-px bg-slate-100 mx-2.5" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowActions(false); onDelete?.(resource.id); }}
                                                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Move to Trash
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom row: Category + Date + Tags — aligned under title */}
            <div className="flex items-center gap-1.5 mt-2 ml-[62px] flex-wrap">
                {resource.category && (
                    <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border leading-none ${getCategoryStyle(resource.category)}`}>
                        {resource.category}
                    </span>
                )}
                <span className="text-[10px] text-slate-400 tabular-nums">{formattedDate}</span>
                {resource.tags && resource.tags.length > 0 && (
                    <>
                        <span className="text-slate-200">·</span>
                        {resource.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-px rounded">
                                #{tag}
                            </span>
                        ))}
                        {resource.tags.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{resource.tags.length - 2}</span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
