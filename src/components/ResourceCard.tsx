"use client";

import { useState } from "react";
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
    Check
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
        'frontend': 'bg-sky-100 text-sky-700',
        'backend': 'bg-emerald-100 text-emerald-700',
        'devops': 'bg-violet-100 text-violet-700',
        'react': 'bg-blue-100 text-blue-700',
        'design': 'bg-pink-100 text-pink-700',
        'tutorial': 'bg-amber-100 text-amber-700',
        'documentation': 'bg-slate-100 text-slate-700',
    };
    return styles[category?.toLowerCase()] || 'bg-slate-100 text-slate-600';
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
        // Prevent action if clicking on buttons, links, or the selection area directly
        if (target.closest('button') ||
            target.closest('a') ||
            target.closest('.selection-checkbox-area')) {
            return;
        }

        // Card body click now toggles selection (Big Tech Pattern)
        onSelect?.(resource.id, !isSelected);
    };

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(ensureProtocol(resource.url), '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="resource-card group border border-slate-200 bg-white rounded-2xl p-4 transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-start gap-4">
                {/* Checkbox Area - Isolated from card click */}
                <div
                    className="selection-checkbox-area pt-2 pb-2 pr-1 flex-shrink-0 cursor-pointer z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onSelect?.(resource.id, !isSelected);
                    }}
                >
                    <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all cursor-pointer pointer-events-none"
                    />
                </div>

                {/* Main Clickable Area - Handles selection toggling */}
                <div
                    onClick={handleCardClick}
                    className="flex-1 flex items-start gap-4 min-w-0 cursor-pointer"
                >
                    {/* Source Icon - Primary Redirect Action */}
                    <div
                        onClick={handleIconClick}
                        className={`w-11 h-11 rounded-xl ${sourceInfo.bgColor} flex items-center justify-center flex-shrink-0 shadow-sm transition-all group-hover:scale-105 active:scale-95 hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2 relative`}
                        title="Click to open link"
                    >
                        <SourceIcon className={`w-5 h-5 ${sourceInfo.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold text-slate-900 line-clamp-2 leading-snug">
                            {resource.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-xs">
                            <span className="truncate max-w-[120px]">{hostname}</span>
                            <span>•</span>
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>

                {/* Actions Area - Isolated from card click */}
                <div className="flex items-center gap-1 flex-shrink-0 relative z-10">
                    {!isTrashMode && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onPin?.(resource.id);
                            }}
                            className={`p-1.5 rounded-lg transition-all ${resource.isPinned ? 'text-indigo-500 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                            title={resource.isPinned ? "Unpin from top" : "Pin to top"}
                        >
                            <Pin className={`w-4 h-4 transition-transform duration-300 ${resource.isPinned ? 'fill-current' : '-rotate-45'}`} />
                        </button>
                    )}

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowActions(!showActions);
                            }}
                            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all ${showActions ? 'bg-slate-100 text-slate-600' : ''}`}
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {showActions && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1 animate-fade-in">
                                {isTrashMode ? (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowActions(false);
                                                onRestore?.(resource.id);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                                        >
                                            <RefreshCcw className="w-3.5 h-3.5" />
                                            Restore
                                        </button>
                                        <div className="h-px bg-slate-100 my-1" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowActions(false);
                                                onPermanentDelete?.(resource.id);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete Forever
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowActions(false);
                                                onEdit?.(resource);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowActions(false);
                                                onArchive?.(resource.id, resource.isArchived);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                        >
                                            <Archive className="w-3.5 h-3.5" />
                                            {resource.isArchived ? "Unarchive" : "Archive"}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowFolderMenu(!showFolderMenu);
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Folder className="w-3.5 h-3.5" />
                                                Add to Folder
                                            </div>
                                            <ChevronRight className="w-3 h-3" />
                                        </button>

                                        {showFolderMenu && (
                                            <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-[30] py-1 animate-fade-in max-h-60 overflow-y-auto">
                                                {availableCollections.length > 0 ? (
                                                    availableCollections.map(folder => {
                                                        const isMember = resource.collections?.some(c => c.id === folder.id);
                                                        return (
                                                            <button
                                                                key={folder.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (isMember) {
                                                                        onRemoveFromCollection?.(folder.id, resource.id);
                                                                    } else {
                                                                        onAddToCollection?.(folder.id, resource.id);
                                                                    }
                                                                    setShowFolderMenu(false);
                                                                    setShowActions(false);
                                                                }}
                                                                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                                            >
                                                                <span className="truncate pr-2">{folder.name}</span>
                                                                {isMember && <Check className="w-3 h-3 text-indigo-500" />}
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="px-3 py-2 text-xs text-slate-400 italic">No folders found</div>
                                                )}
                                            </div>
                                        )}
                                        <div className="h-px bg-slate-100 my-1" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowActions(false);
                                                onDelete?.(resource.id);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Note/Description */}
            {resource.note && (
                <p
                    onClick={handleCardClick}
                    className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2 cursor-pointer"
                >
                    {resource.note}
                </p>
            )}

            {/* Tags Footer */}
            <div className="flex items-center flex-wrap gap-1.5 mt-4 pt-3.5 border-t border-slate-100 italic">
                {/* Source Badge */}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${sourceInfo.bgColor} ${sourceInfo.color}`}>
                    {sourceInfo.name}
                </span>

                {/* Category Badge */}
                {resource.category && (
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${getCategoryStyle(resource.category)}`}>
                        {resource.category}
                    </span>
                )}

                {/* Tags */}
                <div onClick={handleCardClick} className="flex items-center gap-1.5 cursor-pointer">
                    {resource.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors">
                            #{tag}
                        </span>
                    ))}
                    {resource.tags && resource.tags.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                            +{resource.tags.length - 2}
                        </span>
                    )}
                </div>

                {/* Collections Badge */}
                {resource.collections && resource.collections.length > 0 && (
                    <div className="ml-auto flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Folder className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] text-slate-500 font-bold max-w-[80px] truncate">
                            {resource.collections[0].name}
                            {resource.collections.length > 1 && ` +${resource.collections.length - 1}`}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
