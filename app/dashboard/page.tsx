"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    Plus,
    Link2,
    X,
    Check,
    Loader2,
    Sparkles,
    LayoutGrid,
    List,
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
    const router = useRouter();

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
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [showArchived, setShowArchived] = useState(archivedOnly);
    const [showTrash, setShowTrash] = useState(trashOnly);
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

        // Use replaceState to sync URL without bloating history stack
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

    // Stats
    const [stats, setStats] = useState({ total: 0, topTags: [] as string[] });
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        loadResources();
    }, [archivedOnly, trashOnly, filters, currentCollectionId]);

    // Independent effect for collections to ensure they are always available
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
        const allTags = resources.flatMap(r => r.tags || []);
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([tag]) => tag);

        setStats({
            total: resources.length,
            topTags
        });
    }, [resources]);

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
                // Always use filtered endpoint to support collectionId and other filters
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
        if (!urlToFetch || title) return; // Don't overwrite if title exists

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

        // Optimistic update
        const previousResources = [...resources];
        setResources(prev => prev.filter(r => r.id !== id));

        try {
            await resourceService.delete(id);
        } catch (error) {
            console.error("Failed to delete resource", error);
            // Revert on failure
            setResources(previousResources);
            setError("Failed to delete resource");
        }
    };

    const handleArchive = async (id: string, isCurrentlyArchived: boolean) => {
        // Optimistic update - remove from current view
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

        // Optimistic update
        setResources(prev => prev.map(r =>
            r.id === id ? { ...r, isPinned: !r.isPinned } : r
        ));

        try {
            await resourceService.togglePin(id);
        } catch (error) {
            console.error("Failed to toggle pin", error);
            // Revert
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

    const handleEmptyTrash = () => {
        setShowEmptyTrashConfirm(true);
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

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredResources.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredResources.map(r => r.id)));
        }
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

        // Pinned only filter
        if (pinnedOnly && !resource.isPinned) return false;

        return matchesSearch && matchesCategory && matchesTags && matchesDateRange && matchesSource;
    }).sort((a, b) => {
        // Pinned items always come first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Then apply chosen sort
        if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "az") {
            return a.title.localeCompare(b.title);
        }
        // Default: Newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="flex flex-col min-h-screen">
            {/* Top Header Bar */}
            <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-sm">
                <div className="px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search resources, tags, or URLs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="xl:col-span-8 space-y-8">

                    {/* Quick Capture */}
                    {!pinnedOnly && !archivedOnly && !trashOnly && (
                        <div
                            ref={formRef}
                            className={`capture-card transition-all duration-300 ${isExpanded ? 'expanded bg-slate-900 border-slate-800 shadow-2xl ring-1 ring-white/10' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        >
                            <div className="p-4">
                                {isExpanded && (
                                    <div className="mb-6 pb-4 border-b border-slate-800/50">
                                        <h3 className="text-lg font-bold text-white">Quick Capture</h3>
                                        <p className="text-sm text-slate-400">Save a new resource with intelligent auto-fetching</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isExpanded
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 rotate-90'
                                        : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Add a URL or resource..."
                                        value={url}
                                        onChange={(e) => {
                                            const newVal = e.target.value;
                                            setUrl(newVal);
                                            if (!newVal) setTitle("");
                                        }}
                                        onPaste={handleUrlPaste}
                                        onFocus={() => setIsExpanded(true)}
                                        className={`flex-1 text-base font-medium bg-transparent border-none focus:outline-none focus:ring-0 ${isExpanded ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
                                    />
                                    {!isExpanded && (
                                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                            Ctrl+K
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="px-4 pb-5 border-t border-slate-800/50 animate-fade-in">
                                    <div className="pt-4 space-y-4">
                                        <div className="form-group">
                                            <label className="form-label text-slate-400">URL</label>
                                            <input
                                                type="url"
                                                value={url}
                                                onChange={(e) => {
                                                    const newVal = e.target.value;
                                                    setUrl(newVal);
                                                    if (!newVal) setTitle("");
                                                }}
                                                onPaste={handleUrlPaste}
                                                onBlur={handleUrlBlur}
                                                placeholder="https://example.com"
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label text-slate-400">Title</label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Fetching title..."
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-group">
                                                <label className="form-label text-slate-400">Category</label>
                                                <input
                                                    type="text"
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    placeholder="e.g., Frontend"
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label text-slate-400">Tags</label>
                                                <input
                                                    type="text"
                                                    value={tags}
                                                    onChange={(e) => setTags(e.target.value)}
                                                    placeholder="react, tutorial"
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label text-slate-400">Notes</label>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Why are you saving this? What should you remember?"
                                                rows={3}
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                                <span>Intelligent extraction active</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setIsExpanded(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                                    Cancel
                                                </button>
                                                <button onClick={save} disabled={loading || !url} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
                                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    Save Resource
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(error || successMessage) && (
                                <div className={`px-4 py-3 border-t flex items-center gap-2 text-sm font-medium ${error
                                    ? 'bg-red-50 text-red-600 border-red-100'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    }`}>
                                    {error ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                    {error || successMessage}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Category Pills */}
                    <div className="pb-2">
                        <CategoryPills
                            categories={availableCategories}
                            selectedCategories={filters.categories}
                            onSelect={(category) => {
                                setFilters(prev => {
                                    if (category === "All") return { ...prev, categories: [] };
                                    const isSelected = prev.categories.includes(category);
                                    return {
                                        ...prev,
                                        categories: isSelected
                                            ? prev.categories.filter(c => c !== category)
                                            : [...prev.categories, category]
                                    };
                                });
                            }}
                        />
                    </div>

                    {/* Trash Info Banner */}
                    {trashOnly && (
                        <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4 animate-fade-in shadow-sm">
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-900">The Safety Net (Trash)</h4>
                                <p className="text-sm text-amber-700/80 leading-relaxed">
                                    Resources in Trash will be **permanently deleted after 7 days**. You can restore them anytime before that or delete them manually.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Resources Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/60">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {pinnedOnly ? "Pinned Resources" : archivedOnly ? "Archived Resources" : trashOnly ? "Trash" : "Resources"}
                            </h2>
                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold border border-indigo-100/50 shadow-sm">
                                {filteredResources.length}
                            </span>
                            <button
                                onClick={() => setSelectedIds(new Set(selectedIds.size === filteredResources.length ? [] : filteredResources.map(r => r.id)))}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
                            >
                                {selectedIds.size === filteredResources.length ? "Deselect All" : "Select All"}
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border border-slate-200 bg-white text-slate-600 font-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
                            >
                                <option value="newest">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                                <option value="az">A-Z</option>
                            </select>

                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md transition-all ${viewMode === "grid" ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md transition-all ${viewMode === "list" ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {trashOnly && filteredResources.length > 0 && (
                            <button
                                onClick={handleEmptyTrash}
                                className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all ml-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Empty Trash
                            </button>
                        )}
                    </div>

                    {/* Resources Area with Stable Height */}
                    <div className="min-h-[600px]">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                                        <div className="flex gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-slate-100 flex-shrink-0"></div>
                                            <div className="flex-1 space-y-3">
                                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                                <div className="h-3 bg-slate-50 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                        <div className="mt-6 space-y-2">
                                            <div className="h-3 bg-slate-50 rounded w-full"></div>
                                            <div className="h-3 bg-slate-50 rounded w-5/6"></div>
                                        </div>
                                        <div className="mt-8 flex gap-2 pt-3 border-t border-slate-50">
                                            <div className="h-5 bg-slate-100 rounded-md w-16"></div>
                                            <div className="h-5 bg-slate-100 rounded-md w-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredResources.length === 0 ? (
                            <div className="empty-state bg-white rounded-2xl border border-dashed border-slate-300 py-12">
                                <div className="empty-state-icon mb-4">
                                    <Link2 className="w-6 h-6 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    {searchQuery ? "No search results" : "This View is Empty"}
                                </h3>

                                {filters.categories.length > 0 || filters.tags.length > 0 ? (
                                    <div className="max-w-md mx-auto mb-8 px-6">
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            This is a "Smart View". To see resources here, simply tag any existing resource with:
                                        </p>
                                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                                            {filters.categories.map(c => (
                                                <span key={c} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100 uppercase">
                                                    {c}
                                                </span>
                                            ))}
                                            {filters.tags.map(t => (
                                                <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 lowercase">
                                                    #{t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
                                        {searchQuery
                                            ? "Try adjusting your search terms"
                                            : "Start building your knowledge base by adding your first resource"}
                                    </p>
                                )}

                                {!searchQuery && filters.categories.length === 0 && filters.tags.length === 0 && (
                                    <button onClick={() => setIsExpanded(true)} className="btn-primary">
                                        <Plus className="w-4 h-4" />
                                        Add Resource
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === "grid" ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                {filteredResources.map((resource, idx) => (
                                    <div key={resource.id} className="animate-fade-in" style={{ animationDelay: idx < 2 ? '0ms' : `${idx * 50}ms` }}>
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
                </div>

                {/* Right Column */}
                <div className="hidden xl:block xl:col-span-4 space-y-6">
                    <div className="sticky top-28 space-y-6">



                        {/* Filter Panel */}
                        <FilterPanel
                            onFiltersChange={setFilters}
                            availableCategories={availableCategories}
                            availableTags={availableTags}
                        />

                        {/* Footer */}
                        <div className="text-center pt-4">
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                KnowHub v1.0
                            </p>
                        </div>
                    </div>
                </div>
            </main>

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
                title="Delete Resource"
                message={`Are you sure you want to delete ${selectedIds.size} resources? This action cannot be undone.`}
                confirmLabel={`Delete ${selectedIds.size} Items`}
            />

            <ConfirmationModal
                isOpen={showEmptyTrashConfirm}
                onClose={() => setShowEmptyTrashConfirm(false)}
                onConfirm={confirmEmptyTrash}
                title="Empty Trash"
                message="Are you sure you want to empty the trash? All resources will be permanently deleted. This action cannot be undone."
                confirmLabel="Empty Trash"
            />

            {/* Bulk Action Bar */}
            {
                selectedIds.size > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-indigo-500/20 border border-slate-800 flex items-center gap-6 min-w-[400px]">
                            <div className="flex items-center gap-3 pr-6 border-r border-slate-800">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
                                    {selectedIds.size}
                                </div>
                                <span className="text-sm font-medium text-slate-300">Items Selected</span>
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
                                        onClick={() => {
                                            if (!showBulkFolderMenu) loadCollections();
                                            setShowBulkFolderMenu(!showBulkFolderMenu);
                                        }}
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

                            <div className="ml-auto pl-6 border-l border-slate-800">
                                <button
                                    onClick={() => setSelectedIds(new Set())}
                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}