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
    onRemoveFromCollection
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
        onSelect?.(resource.id, !isSelected);
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

    return (
        <div
            onClick={handleCardClick}
            className={`group flex items-center bg-white border rounded-xl py-2.5 px-3 md:px-4 transition-all duration-150 hover:bg-slate-50 hover:border-slate-300 relative ${showActions ? 'z-50' : 'z-10'} ${isSelected ? 'ring-1 ring-indigo-500/40 bg-indigo-50/50 border-indigo-200' : 'border-slate-200'}`}
        >
            {/* 1. Selection & Pin */}
            <div className="flex items-center gap-2 w-12 md:w-16 shrink-0">
                <div
                    className="selection-checkbox-area cursor-pointer z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(resource.id, !isSelected);
                    }}
                >
                    <div className={`w-4.5 h-4.5 rounded border motion-safe:transition-all flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
                    </div>
                </div>

                {!isTrashMode && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPin?.(resource.id);
                        }}
                        className={`transition-all duration-300 ${resource.isPinned ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-400 opacity-0 group-hover:opacity-100'}`}
                        title={resource.isPinned ? "Unpin" : "Pin"}
                    >
                        <Pin className={`w-3.5 h-3.5 ${resource.isPinned ? 'fill-current' : ''}`} />
                    </button>
                )}
            </div>

            {/* 2. Resource Identity */}
            <div className="flex items-center gap-3 w-[260px] md:w-[300px] shrink-0 min-w-0">
                <div
                    onClick={handleOpenLink}
                    className={`w-9 h-9 rounded-lg ${sourceInfo.bgColor} flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 cursor-pointer group-hover:scale-110`}
                >
                    <SourceIcon className={`w-4.5 h-4.5 ${sourceInfo.color}`} />
                </div>

                <div className="flex flex-col min-w-0 overflow-hidden">
                    <h3 className="text-sm font-semibold text-slate-800 truncate tracking-tight group-hover:text-slate-900 transition-colors leading-tight">
                        {resource.title}
                    </h3>
                    <div className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5 truncate">
                        {hostname}
                    </div>
                </div>
            </div>

            {/* 3. Notes Column */}
            <div className="flex-1 px-6 min-w-0 hidden xl:block overflow-hidden">
                {resource.note && (
                    <p className="text-[12px] text-slate-400 italic font-medium truncate">
                        "{resource.note}"
                    </p>
                )}
            </div>

            {/* 4. Category */}
            <div className="w-[140px] shrink-0 px-4 hidden sm:flex items-center justify-start">
                {resource.category && (
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${getCategoryStyle(resource.category)}`}>
                        {resource.category}
                    </span>
                )}
            </div>

            {/* 5. Date */}
            <div className="w-[90px] shrink-0 px-2 hidden lg:flex items-center justify-end">
                <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                    {formattedDate}
                </span>
            </div>

            {/* 6. Actions */}
            <div className="flex items-center justify-end w-16 md:w-20 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                    onClick={handleCopyLink}
                    className={`p-1.5 rounded-lg transition-all ${isCopying ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                    title="Copy Link"
                >
                    {isCopying ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowActions(!showActions);
                        }}
                        className={`p-1.5 rounded-lg transition-all ${showActions ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {showActions && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl z-[100] py-1.5 overflow-visible">
                            <div className="px-4 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">
                                Actions
                            </div>
                            {isTrashMode ? (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowActions(false); onRestore?.(resource.id); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors text-left"
                                    >
                                        <RefreshCcw className="w-4 h-4" /> Restore
                                    </button>
                                    <div className="h-px bg-slate-100 my-1 mx-3" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowActions(false); onPermanentDelete?.(resource.id); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete Forever
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowActions(false); onEdit?.(resource); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowActions(false); onArchive?.(resource.id, resource.isArchived); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                                    >
                                        <Archive className="w-4 h-4" /> {resource.isArchived ? "Unarchive" : "Archive"}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowFolderMenu(!showFolderMenu); }}
                                        className="w-full flex items-center justify-between px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Folder className="w-4 h-4" /> Organize
                                        </div>
                                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showFolderMenu ? 'rotate-90 text-indigo-500' : ''}`} />
                                    </button>

                                    {showFolderMenu && (
                                        <div className="absolute left-full top-0 ml-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-[110] py-1.5 max-h-72 overflow-y-auto">
                                            <div className="px-4 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">
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
                                                            className="w-full flex items-center justify-between px-4 py-2 text-[12px] font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
                                                        >
                                                            <span className="truncate pr-2">{folder.name}</span>
                                                            {isMember && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div className="px-4 py-3 text-[11px] text-slate-400 italic">No collections yet</div>
                                            )}
                                        </div>
                                    )}
                                    <div className="h-px bg-slate-100 my-1 mx-3" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowActions(false); onDelete?.(resource.id); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <Trash2 className="w-4 h-4" /> Move to Trash
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
