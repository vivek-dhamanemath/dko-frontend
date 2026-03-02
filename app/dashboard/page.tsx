"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
    Search,
    Plus,
    Link2,
    X,
    Check,
    Loader2,
    Sparkles,
    Archive,
    Trash2,
    AlertTriangle,
    Folder
} from "lucide-react";
import FilterPanel, { FilterState } from "@/src/components/FilterPanel";
import CategoryPills from "@/src/components/CategoryPills";
import ResourceCard from "@/src/components/ResourceCard";
import EditResourceModal from "@/src/components/EditResourceModal";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import { resourceService, Resource } from "@/src/services/resourceService";
import collectionService, { Collection } from "@/src/services/collectionService";
import { api } from "@/src/lib/api";
import { getSource } from "@/src/utils/sourceUtils";



export default function Dashboard({ pinnedOnly = false, archivedOnly = false, trashOnly = false }: { pinnedOnly?: boolean; archivedOnly?: boolean; trashOnly?: boolean }) {

    // Form State
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    // Data State
    const searchParams = useSearchParams();

    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const showArchived = archivedOnly;
    const showTrash = trashOnly;
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [collections, setCollections] = useState<Collection[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
    const [showEmptyTrashConfirm, setShowEmptyTrashConfirm] = useState(false);
    const [showBulkFolderMenu, setShowBulkFolderMenu] = useState(false);

    // Filter State
    const currentCollectionId = searchParams.get("collectionId") || "";

    const [filters, setFilters] = useState<FilterState>({
        categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
        tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
        dateRange: searchParams.get("dateRange") || "",
        sources: searchParams.get("sources")?.split(",").filter(Boolean) || []
    });

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.categories.length > 0) params.set("categories", filters.categories.join(","));
        if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
        if (filters.dateRange) params.set("dateRange", filters.dateRange);
        if (filters.sources.length > 0) params.set("sources", filters.sources.join(","));

        const query = params.toString();
        const currentPath = window.location.pathname;
        const newUrl = query ? `${currentPath}?${query}` : currentPath;

        window.history.replaceState(null, '', newUrl);
    }, [filters]);

    // React to external URL changes (e.g. from Sidebar)
    useEffect(() => {
        const urlCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
        const urlTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
        const urlDateRange = searchParams.get("dateRange") || "";
        const urlSources = searchParams.get("sources")?.split(",").filter(Boolean) || [];

        const hasChanged =
            JSON.stringify(urlCategories) !== JSON.stringify(filters.categories) ||
            JSON.stringify(urlTags) !== JSON.stringify(filters.tags) ||
            urlDateRange !== filters.dateRange ||
            JSON.stringify(urlSources) !== JSON.stringify(filters.sources);

        if (hasChanged) {
            setFilters({
                categories: urlCategories,
                tags: urlTags,
                dateRange: urlDateRange,
                sources: urlSources
            });
        }
    }, [searchParams]);

    const [sortBy, setSortBy] = useState("newest");

    // Pagination
    const PAGE_SIZE = 20;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadResources();
    }, [archivedOnly, trashOnly, filters, currentCollectionId]);

    useEffect(() => {
        loadCollections();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (formRef.current && !formRef.current.contains(event.target as Node) && !url && !title) {
                setIsExpanded(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [url, title]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters, currentCollectionId, archivedOnly, trashOnly]);


    const loadCollections = async () => {
        try {
            const data = await collectionService.getCollections();
            setCollections(data);
        } catch (err) {
            console.error("Failed to load collections:", err);
        }
    };

    const loadResources = async () => {
        try {
            setLoading(true);
            let data: Resource[];

            if (showTrash) {
                data = await resourceService.getTrash();
            } else {
                data = await resourceService.getFiltered({
                    categories: filters.categories,
                    tags: filters.tags,
                    dateRange: filters.dateRange,
                    sources: filters.sources,
                    isArchived: showArchived,
                    collectionId: currentCollectionId || undefined
                });
            }

            setResources(data);
        } catch (err: any) {
            console.error("Failed to load resources:", err);
            setError("Failed to load resources");
        } finally {
            setLoading(false);
        }
    };

    const handleUrlPaste = async (e: React.ClipboardEvent) => {
        const pastedUrl = e.clipboardData.getData('text');
        if (pastedUrl && (pastedUrl.startsWith('http') || pastedUrl.includes('.'))) {
            fetchMetadata(pastedUrl);
        }
    };

    const fetchMetadata = async (urlToFetch: string) => {
        if (!urlToFetch || title) return;

        try {
            const metadata = await resourceService.fetchMetadata(urlToFetch);
            if (metadata.title) {
                setTitle(metadata.title);
            }
        } catch (err) {
            console.error("Failed to fetch metadata:", err);
        }
    };

    const handleUrlBlur = () => {
        if (url && (url.startsWith('http') || url.includes('.')) && !title) {
            fetchMetadata(url);
        }
    };

    const save = async () => {
        if (!url) {
            setError("URL is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            let finalTitle = title;
            if (!finalTitle) {
                try {
                    const urlToParse = url.match(/^https?:\/\//) ? url : `https://${url}`;
                    finalTitle = new URL(urlToParse).hostname;
                } catch (e) {
                    finalTitle = url;
                }
            }

            await api.post("/resources", {
                url,
                title: finalTitle,
                note,
                category,
                tags: tags.split(",").map(t => t.trim()).filter(t => t)
            });

            setSuccessMessage("Saved to Knowledge Hub");
            setTimeout(() => setSuccessMessage(""), 3000);

            setUrl("");
            setTitle("");
            setNote("");
            setCategory("");
            setTags("");
            setIsExpanded(false);

            await loadResources();
        } catch (err: any) {
            console.error("Failed to save:", err);
            setError(err.response?.data?.message || "Failed to save resource");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        const id = deletingId;

        const previousResources = [...resources];
        setResources(prev => prev.filter(r => r.id !== id));

        try {
            await resourceService.delete(id);
        } catch (error) {
            console.error("Failed to delete resource", error);
            setResources(previousResources);
            setError("Failed to delete resource");
        }
    };

    const handleArchive = async (id: string, isCurrentlyArchived: boolean) => {
        const previousResources = [...resources];
        setResources(prev => prev.filter(r => r.id !== id));

        try {
            await resourceService.toggleArchive(id);
            setSuccessMessage(isCurrentlyArchived ? "Resource unarchived" : "Resource archived");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Failed to toggle archive", error);
            setResources(previousResources);
            setError("Failed to update archive status");
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {
            await resourceService.update(id, data);
            setResources(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
        } catch (error) {
            console.error("Failed to update resource", error);
            setError("Failed to update resource");
            throw error;
        }
    };

    const handleTogglePin = async (id: string) => {
        const resource = resources.find(r => r.id === id);
        if (!resource) return;

        setResources(prev => prev.map(r =>
            r.id === id ? { ...r, isPinned: !r.isPinned } : r
        ));

        try {
            await resourceService.togglePin(id);
        } catch (error) {
            console.error("Failed to toggle pin", error);
            setResources(prev => prev.map(r =>
                r.id === id ? { ...r, isPinned: resource.isPinned } : r
            ));
            setError("Failed to update pin status");
        }
    };

    const handleRestore = async (id: string) => {
        try {
            setLoading(true);
            await resourceService.restore(id);
            setSuccessMessage("Resource restored successfully");
            await loadResources();
        } catch (err) {
            console.error("Restore failed", err);
            setError("Failed to restore resource");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handlePermanentDelete = async (id: string) => {
        try {
            setLoading(true);
            await resourceService.permanentDelete(id);
            setSuccessMessage("Resource permanently deleted");
            await loadResources();
        } catch (err) {
            console.error("Permanent delete failed", err);
            setError("Failed to permanently delete resource");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const confirmEmptyTrash = async () => {
        try {
            setLoading(true);
            await resourceService.emptyTrash();
            setSuccessMessage("Trash emptied successfully");
            await loadResources();
        } catch (err) {
            console.error("Empty trash failed", err);
            setError("Failed to empty trash");
        } finally {
            setLoading(false);
            setShowEmptyTrashConfirm(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const toggleSelection = (id: string, selected: boolean) => {
        const next = new Set(selectedIds);
        if (selected) next.add(id);
        else next.delete(id);
        setSelectedIds(next);
    };

    const handleBulkArchive = async () => {
        try {
            setLoading(true);
            const ids = Array.from(selectedIds);
            await resourceService.bulkArchive(ids, !showArchived);
            setSuccessMessage(`${ids.length} resources ${showArchived ? 'restored' : 'archived'}`);
            setSelectedIds(new Set());
            await loadResources();
        } catch (err) {
            console.error("Bulk archive failed", err);
            setError("Bulk action failed");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;
        setShowBulkDeleteConfirm(true);
    };

    const confirmBulkDelete = async () => {
        try {
            setLoading(true);
            const ids = Array.from(selectedIds);
            await resourceService.bulkDelete(ids);
            setSuccessMessage(`${ids.length} resources deleted`);
            setSelectedIds(new Set());
            await loadResources();
        } catch (err) {
            console.error("Bulk delete failed", err);
            setError("Bulk action failed");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handleAddToCollection = async (collectionId: string, resourceId: string) => {
        try {
            await collectionService.addResourceToCollection(collectionId, resourceId);
            await loadResources();
        } catch (err) {
            console.error("Failed to add to collection", err);
            setError("Failed to add to folder");
        }
    };

    const handleBulkAddToCollection = async (collectionId: string) => {
        try {
            setLoading(true);
            const ids = Array.from(selectedIds);
            await collectionService.addResourcesToCollection(collectionId, ids);
            setSuccessMessage(`${ids.length} resources added to folder`);
            setSelectedIds(new Set());
            setShowBulkFolderMenu(false);
            await loadResources();
        } catch (err) {
            console.error("Bulk add to collection failed", err);
            setError("Bulk action failed");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handleRemoveFromCollection = async (collectionId: string, resourceId: string) => {
        try {
            await collectionService.removeResourceFromCollection(collectionId, resourceId);
            await loadResources();
        } catch (err) {
            console.error("Failed to remove from collection", err);
            setError("Failed to remove from folder");
        }
    };

    const availableCategories = Array.from(new Set(resources.map(r => r.category).filter(Boolean)));
    const availableTags = Array.from(new Set(resources.flatMap(r => r.tags || [])));

    const filteredResources = resources.filter(resource => {
        const matchesSearch = !searchQuery ||
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = filters.categories.length === 0 ||
            filters.categories.includes(resource.category);

        const matchesTags = filters.tags.length === 0 ||
            resource.tags?.some(tag => filters.tags.includes(tag));

        let matchesDateRange = true;
        if (filters.dateRange) {
            const resourceDate = new Date(resource.createdAt);
            const now = new Date();
            const daysAgo = parseInt(filters.dateRange);
            const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            matchesDateRange = resourceDate >= cutoffDate;
        }

        let matchesSource = true;
        if (filters.sources.length > 0) {
            const sourceInfo = getSource(resource.url);
            matchesSource = filters.sources.includes(sourceInfo.id);
        }

        if (pinnedOnly && !resource.isPinned) return false;

        return matchesSearch && matchesCategory && matchesTags && matchesDateRange && matchesSource;
    }).sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "az") {
            return a.title.localeCompare(b.title);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const totalPages = Math.ceil(filteredResources.length / PAGE_SIZE);
    const paginatedResources = filteredResources.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">

            {/* ── Sticky Top Header ── */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="px-6 lg:px-8 h-14 flex items-center gap-6">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search resources, tags, or URLs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Bento Grid Layout ── */}
            <main className="flex-1 px-6 lg:px-8 py-5 max-w-[1600px] mx-auto w-full">
                <div className="grid grid-cols-12 gap-4">

                    {/* ── ROW 1: Quick Capture (7 cols) + Stats 2×2 (5 cols) ── */}

                    {/* Quick Capture Tile */}
                    {!pinnedOnly && !archivedOnly && !trashOnly ? (
                        <div
                            ref={formRef}
                            className={`col-span-12 xl:col-span-7 bg-white border rounded-2xl transition-all duration-300 overflow-hidden shadow-sm ${isExpanded
                                ? 'border-indigo-400 shadow-lg shadow-indigo-500/8'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className="p-5">
                                {isExpanded && (
                                    <div className="mb-4 pb-4 border-b border-slate-100">
                                        <h3 className="text-base font-bold text-slate-900">Quick Capture</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Save a new resource with intelligent auto-fetching</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isExpanded
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 rotate-90'
                                        : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Add a URL or resource..."
                                        value={url}
                                        onChange={(e) => { const v = e.target.value; setUrl(v); if (!v) setTitle(""); }}
                                        onPaste={handleUrlPaste}
                                        onFocus={() => setIsExpanded(true)}
                                        className={`flex-1 text-sm font-medium bg-transparent border-none focus:outline-none ${isExpanded ? 'text-slate-900 placeholder-slate-400' : 'text-slate-600 placeholder-slate-400'}`}
                                    />
                                    {!isExpanded && (
                                        <kbd className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md font-mono border border-slate-200">Ctrl+K</kbd>
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="px-5 pb-5 border-t border-slate-100 animate-fade-in">
                                    <div className="pt-4 space-y-3">
                                        <div className="form-group">
                                            <label className="form-label">URL</label>
                                            <input
                                                type="url"
                                                value={url}
                                                onChange={(e) => { const v = e.target.value; setUrl(v); if (!v) setTitle(""); }}
                                                onPaste={handleUrlPaste}
                                                onBlur={handleUrlBlur}
                                                placeholder="https://example.com"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Title</label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Auto-fetching title..."
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="form-group">
                                                <label className="form-label">Category</label>
                                                <input
                                                    type="text"
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    placeholder="e.g., Frontend"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Tags</label>
                                                <input
                                                    type="text"
                                                    value={tags}
                                                    onChange={(e) => setTags(e.target.value)}
                                                    placeholder="react, tutorial"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Notes</label>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Why are you saving this?"
                                                rows={2}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                                <span>Intelligent extraction active</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setIsExpanded(false)}
                                                    className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={save}
                                                    disabled={loading || !url}
                                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-indigo-500/20"
                                                >
                                                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(error || successMessage) && (
                                <div className={`px-5 py-3 border-t flex items-center gap-2 text-xs font-semibold ${error
                                    ? 'bg-red-50 text-red-600 border-red-100'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    }`}>
                                    {error ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                                    {error || successMessage}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Mode Header Tile */
                        <div className="col-span-12 xl:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                {pinnedOnly ? "Pinned Resources" : archivedOnly ? "Archived" : "Trash"}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1.5">
                                {pinnedOnly
                                    ? "Your most important resources, always at the top"
                                    : archivedOnly
                                        ? "Resources you've set aside for later"
                                        : "Items waiting to be permanently deleted"}
                            </p>
                            {trashOnly && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Items are permanently deleted after 7 days</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stats 2×2 Bento Tiles */}
                    <div className="col-span-12 xl:col-span-5 grid grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saved</p>
                            <div>
                                <p className="text-4xl font-black text-slate-900 tabular-nums leading-none">{resources.length}</p>
                                <p className="text-[10px] text-slate-400 mt-1">total resources</p>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pinned</p>
                            <div>
                                <p className="text-4xl font-black text-indigo-600 tabular-nums leading-none">{resources.filter(r => r.isPinned).length}</p>
                                <p className="text-[10px] text-slate-400 mt-1">important items</p>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categories</p>
                            <div>
                                <p className="text-4xl font-black text-emerald-600 tabular-nums leading-none">{availableCategories.length}</p>
                                <p className="text-[10px] text-slate-400 mt-1">unique types</p>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tags</p>
                            <div>
                                <p className="text-4xl font-black text-violet-600 tabular-nums leading-none">{availableTags.length}</p>
                                <p className="text-[10px] text-slate-400 mt-1">unique labels</p>
                            </div>
                        </div>
                    </div>

                    {/* ── ROW 2: Category Pills ── */}
                    <div className="col-span-12 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                        <CategoryPills
                            categories={availableCategories}
                            selectedCategories={filters.categories}
                            onSelect={(cat) => {
                                setFilters(prev => {
                                    if (cat === "All") return { ...prev, categories: [] };
                                    const isSelected = prev.categories.includes(cat);
                                    return {
                                        ...prev,
                                        categories: isSelected
                                            ? prev.categories.filter(c => c !== cat)
                                            : [...prev.categories, cat]
                                    };
                                });
                            }}
                        />
                    </div>

                    {/* ── ROW 3: Resources List (8 cols) + Filter Panel (4 cols) ── */}

                    {/* Resources Tile */}
                    <div className="col-span-12 xl:col-span-8">
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

                            {/* Tile Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <h2 className="text-sm font-black text-slate-900 tracking-tight">
                                        {pinnedOnly ? "Pinned" : archivedOnly ? "Archived" : trashOnly ? "Trash" : "Resources"}
                                    </h2>
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold border border-indigo-100 tabular-nums">
                                        {filteredResources.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedIds(new Set(
                                            selectedIds.size === filteredResources.length && filteredResources.length > 0
                                                ? []
                                                : filteredResources.map(r => r.id)
                                        ))}
                                        className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors px-2 py-1"
                                    >
                                        {selectedIds.size === filteredResources.length && filteredResources.length > 0
                                            ? "Deselect All"
                                            : "Select All"}
                                    </button>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="text-xs bg-white border border-slate-200 text-slate-600 font-medium rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer transition-all outline-none"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                        <option value="az">A–Z</option>
                                    </select>
                                </div>
                            </div>

                            {/* Column Headers */}
                            <div className="hidden md:flex items-center px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 border-b border-slate-100/80">
                                <div className="w-[60px] shrink-0">Status</div>
                                <div className="w-[260px] md:w-[300px] shrink-0">Resource</div>
                                <div className="flex-1 px-6 hidden xl:block">Notes</div>
                                <div className="w-[140px] shrink-0 px-4">Category</div>
                                <div className="w-[90px] shrink-0 px-2 hidden lg:block text-right">Timeline</div>
                                <div className="w-[80px] shrink-0 text-right">Actions</div>
                            </div>

                            {/* Resource Items */}
                            <div className="min-h-[420px] p-3">
                                {loading ? (
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="bg-slate-100 rounded-xl h-14 animate-pulse" />
                                        ))}
                                    </div>
                                ) : filteredResources.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                            <Link2 className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700 mb-1">
                                            {searchQuery ? "No search results" : "This View is Empty"}
                                        </h3>
                                        {filters.categories.length > 0 || filters.tags.length > 0 ? (
                                            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                                                {filters.categories.map(c => (
                                                    <span key={c} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100 uppercase">{c}</span>
                                                ))}
                                                {filters.tags.map(t => (
                                                    <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium border border-slate-200">#{t}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 max-w-xs mt-1">
                                                {searchQuery
                                                    ? "Try adjusting your search"
                                                    : "Start building your knowledge base by adding your first resource"}
                                            </p>
                                        )}
                                        {!searchQuery && filters.categories.length === 0 && filters.tags.length === 0 && !pinnedOnly && !archivedOnly && !trashOnly && (
                                            <button
                                                onClick={() => setIsExpanded(true)}
                                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Add Resource
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1.5">
                                        {paginatedResources.map((resource, idx) => (
                                            <div
                                                key={resource.id}
                                                className="animate-fade-in"
                                                style={{ animationDelay: idx < 3 ? '0ms' : `${idx * 30}ms` }}
                                            >
                                                <ResourceCard
                                                    resource={resource}
                                                    onEdit={setEditingResource}
                                                    onDelete={handleDelete}
                                                    onArchive={handleArchive}
                                                    onPin={handleTogglePin}
                                                    isSelected={selectedIds.has(resource.id)}
                                                    onSelect={toggleSelection}
                                                    isSelectionMode={selectedIds.size > 0}
                                                    isTrashMode={trashOnly}
                                                    onRestore={handleRestore}
                                                    onPermanentDelete={handlePermanentDelete}
                                                    availableCollections={collections}
                                                    onAddToCollection={handleAddToCollection}
                                                    onRemoveFromCollection={handleRemoveFromCollection}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                                    <p className="text-xs text-slate-500 tabular-nums">
                                        {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredResources.length)} of {filteredResources.length}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-xs font-bold text-slate-500 px-1 tabular-nums">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filter Panel Tile */}
                    <div className="hidden xl:block xl:col-span-4">
                        <div className="sticky top-20">
                            <FilterPanel
                                onFiltersChange={setFilters}
                                availableCategories={availableCategories}
                                availableTags={availableTags}
                            />
                        </div>
                    </div>

                </div>
            </main>

            {/* ── Modals ── */}
            {editingResource && (
                <EditResourceModal
                    resource={editingResource}
                    isOpen={!!editingResource}
                    onClose={() => setEditingResource(null)}
                    onSave={handleUpdate}
                    availableCategories={availableCategories}
                />
            )}

            <ConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Delete Resource"
                message="Are you sure you want to delete this resource? This action cannot be undone."
                confirmLabel="Delete Resource"
            />

            <ConfirmationModal
                isOpen={showBulkDeleteConfirm}
                onClose={() => setShowBulkDeleteConfirm(false)}
                onConfirm={confirmBulkDelete}
                title="Delete Resources"
                message={`Are you sure you want to delete ${selectedIds.size} resources? This action cannot be undone.`}
                confirmLabel={`Delete ${selectedIds.size} Items`}
            />

            <ConfirmationModal
                isOpen={showEmptyTrashConfirm}
                onClose={() => setShowEmptyTrashConfirm(false)}
                onConfirm={confirmEmptyTrash}
                title="Empty Trash"
                message="Are you sure you want to empty the trash? All resources will be permanently deleted."
                confirmLabel="Empty Trash"
            />

            {/* ── Bulk Action Bar (stays dark — contrast on white bg) ── */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                    <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-black/20 border border-slate-800 flex items-center gap-6 min-w-[400px]">
                        <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm tabular-nums">
                                {selectedIds.size}
                            </div>
                            <span className="text-sm font-medium text-slate-300">Selected</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBulkArchive}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-800 text-sm font-semibold transition-all text-slate-200"
                            >
                                <Archive className="w-4 h-4" />
                                {showArchived ? "Restore" : "Archive"}
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-500/10 text-red-400 text-sm font-semibold transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => { if (!showBulkFolderMenu) loadCollections(); setShowBulkFolderMenu(!showBulkFolderMenu); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold ${showBulkFolderMenu ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-200'}`}
                                >
                                    <Folder className="w-4 h-4" />
                                    Add to View
                                </button>
                                {showBulkFolderMenu && (
                                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 animate-fade-in divide-y divide-slate-800">
                                        <div className="px-3 py-2">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select View</p>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {collections.map(col => (
                                                <button
                                                    key={col.id}
                                                    onClick={() => handleBulkAddToCollection(col.id)}
                                                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                                >
                                                    {col.name}
                                                </button>
                                            ))}
                                            {collections.length === 0 && (
                                                <div className="px-3 py-2 text-xs text-slate-500 italic">No views created</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="ml-auto pl-6 border-l border-slate-700">
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
