"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
    Plus,
    Search,
    Loader2,
    Check,
    Sparkles,
    SlidersHorizontal,
    ArrowDownUp,
    Grid3X3,
    List,
    X,
    AlertTriangle,
    Trash2,
    Archive,
    FolderPlus,
    RotateCcw
} from "lucide-react";
import ResourceCard from "@/src/components/ResourceCard";
import CategoryPills from "@/src/components/CategoryPills";
import FilterPanel, { FilterState } from "@/src/components/FilterPanel";
import EditResourceModal from "@/src/components/EditResourceModal";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import ResourceDetailPanel from "@/src/components/ResourceDetailPanel";
import { Resource, resourceService, CreateResourceRequest } from "@/src/services/resourceService";
import IconPicker from "@/src/components/IconPicker";
import { useResources } from "@/src/hooks/useResources";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useCategoryColors } from "@/src/hooks/useCategoryColors";
import { getCategoryColorClasses, CATEGORY_COLOR_DOTS } from "@/src/services/categoryColorService";
import CategoryColorPicker from "@/src/components/CategoryColorPicker";
import { getSource, SOURCES } from "@/src/utils/sourceUtils";

interface DashboardProps {
    pinnedOnly?: boolean;
    archivedOnly?: boolean;
    trashOnly?: boolean;
}

const PAGE_SIZE = 20;

const PAGE_CONFIG = {
    default: {
        breadcrumb: "ALL RESOURCES",
        heading: "All ",
        headingItalic: "resources.",
        subtext: (count: number, tagCount: number, colCount: number) =>
            `// ${count} RESOURCES · ${tagCount} TAGS · ${colCount} COLLECTIONS`,
    },
    pinned: {
        breadcrumb: "PINNED",
        heading: "Front and ",
        headingItalic: "centre.",
        subtext: (count: number) => `// ${count} PINNED RESOURCES`,
    },
    archived: {
        breadcrumb: "ARCHIVED",
        heading: "The cold ",
        headingItalic: "storage.",
        subtext: (count: number) => `// ${count} ARCHIVED RESOURCES`,
    },
    trash: {
        breadcrumb: "TRASH",
        heading: "Recoverable, ",
        headingItalic: "for now.",
        subtext: (count: number) => `// ${count} DELETED RESOURCES`,
    },
};

export default function Dashboard({ pinnedOnly, archivedOnly, trashOnly }: DashboardProps) {
    const searchParams = useSearchParams();
    const collectionIdParam = searchParams.get("collectionId");

    const {
        resources,
        loading,
        error,
        successMessage,
        collections,
        loadResources,
        loadCollections,
        handleDelete,
        handleArchive,
        handleUpdate,
        handleTogglePin,
        handleRestore,
        handlePermanentDelete,
        handleEmptyTrash,
        handleBulkArchive,
        handleBulkDelete,
        handleAddToCollection,
        handleBulkAddToCollection,
        handleRemoveFromCollection,
    } = useResources({ archivedOnly, trashOnly });

    const { categoryColors, setCategoryColor } = useCategoryColors();

    // UI state
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az">("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [panelFilters, setPanelFilters] = useState<FilterState>({ categories: [], tags: [], dateRange: "", sources: [] });
    const [currentPage, setCurrentPage] = useState(0);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Capture form
    const [showCapture, setShowCapture] = useState(false);
    const [captureUrl, setCaptureUrl] = useState("");
    const [captureTitle, setCaptureTitle] = useState("");
    const [captureCategory, setCaptureCategory] = useState("");
    const [captureTags, setCaptureTags] = useState("");
    const [captureNotes, setCaptureNotes] = useState("");
    const [captureIcon, setCaptureIcon] = useState<string | null>(null);
    const [captureCustomCat, setCaptureCustomCat] = useState(false);
    const [isFetchingMeta, setIsFetchingMeta] = useState(false);
    const [metaFetched, setMetaFetched] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Selection / bulk
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showBulkSelect, setShowBulkSelect] = useState(false);

    // Modals
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [viewingResource, setViewingResource] = useState<Resource | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showEmptyTrash, setShowEmptyTrash] = useState(false);
    const [sortMenuOpen, setSortMenuOpen] = useState(false);

    // Keep viewingResource in sync with resources array
    useEffect(() => {
        if (viewingResource) {
            const updated = resources.find(r => r.id === viewingResource.id);
            if (updated && updated !== viewingResource) {
                setViewingResource(updated);
            }
        }
    }, [resources, viewingResource]);

    // Page config
    const pageKey = trashOnly ? "trash" : archivedOnly ? "archived" : pinnedOnly ? "pinned" : "default";
    const config = PAGE_CONFIG[pageKey];

    // Load data
    useEffect(() => { loadResources(); }, [loadResources]);
    useEffect(() => { loadCollections(); }, [loadCollections]);
    useEffect(() => { setCurrentPage(0); }, [debouncedSearch, selectedCategories, panelFilters, sortOrder]);

    // Auto-fetch metadata on URL paste
    useEffect(() => {
        if (!captureUrl || captureUrl.length < 10) return;
        const fetchMeta = async () => {
            try {
                setIsFetchingMeta(true);
                const meta = await resourceService.fetchMetadata(captureUrl);
                if (meta.title) setCaptureTitle(meta.title);
                setMetaFetched(true);
            } catch { }
            finally { setIsFetchingMeta(false); }
        };
        const timeout = setTimeout(fetchMeta, 500);
        return () => clearTimeout(timeout);
    }, [captureUrl]);

    // All unique categories / tags
    const allCategories = useMemo(
        () => Array.from(new Set(resources.map((r) => r.category).filter(Boolean))),
        [resources]
    );
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        resources.forEach((r) => r.tags?.forEach((t) => tags.add(t)));
        return Array.from(tags);
    }, [resources]);

    // Category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        resources.forEach((r) => {
            if (r.category) counts[r.category] = (counts[r.category] || 0) + 1;
        });
        return counts;
    }, [resources]);

    // Active filter count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (panelFilters.tags.length) count++;
        if (panelFilters.dateRange) count++;
        if (panelFilters.sources.length) count++;
        return count;
    }, [panelFilters]);

    // Filter & sort
    const filteredResources = useMemo(() => {
        let results = [...resources];

        // Pinned only
        if (pinnedOnly) results = results.filter((r) => r.isPinned);

        // Collection filter
        if (collectionIdParam) {
            results = results.filter((r) =>
                r.collections?.some((c) => c.id === collectionIdParam)
            );
        }

        // Search
        if (debouncedSearch) {
            const q = debouncedSearch.toLowerCase();
            results = results.filter(
                (r) =>
                    r.title.toLowerCase().includes(q) ||
                    r.url.toLowerCase().includes(q) ||
                    r.tags?.some((t) => t.toLowerCase().includes(q))
            );
        }

        // Categories
        if (selectedCategories.length > 0) {
            results = results.filter((r) => selectedCategories.includes(r.category));
        }

        // Panel filters
        if (panelFilters.tags.length > 0) {
            results = results.filter((r) =>
                panelFilters.tags.some((t) => r.tags?.includes(t))
            );
        }
        if (panelFilters.dateRange) {
            const days = parseInt(panelFilters.dateRange);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            results = results.filter((r) => new Date(r.createdAt) >= cutoff);
        }
        if (panelFilters.sources.length > 0) {
            results = results.filter((r) => {
                const source = getSource(r.url);
                return panelFilters.sources.includes(source.id);
            });
        }

        // Sort
        results.sort((a, b) => {
            if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            return a.title.localeCompare(b.title);
        });

        return results;
    }, [resources, debouncedSearch, selectedCategories, panelFilters, sortOrder, pinnedOnly, collectionIdParam]);

    // Pagination
    const totalPages = Math.ceil(filteredResources.length / PAGE_SIZE);
    const paginatedResources = filteredResources.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    const handleCategorySelect = useCallback((category: string) => {
        if (category === "All") {
            setSelectedCategories([]);
        } else {
            setSelectedCategories((prev) =>
                prev.includes(category)
                    ? prev.filter((c) => c !== category)
                    : [category]
            );
        }
    }, []);

    const handleSaveResource = async () => {
        if (!captureUrl.trim() || !captureTitle.trim()) return;
        try {
            setIsSaving(true);
            const data: CreateResourceRequest = {
                url: captureUrl,
                title: captureTitle,
                category: captureCategory || "Uncategorized",
                note: captureNotes,
                tags: captureTags.split(",").map((t) => t.trim()).filter(Boolean),
                icon: captureIcon,
            };
            await resourceService.create(data);
            setCaptureUrl(""); setCaptureTitle(""); setCaptureCategory("");
            setCaptureTags(""); setCaptureNotes(""); setCaptureIcon(null); setCaptureCustomCat(false); setMetaFetched(false);
            setShowCapture(false);
            loadResources();
        } catch { }
        finally { setIsSaving(false); }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 px-6 lg:px-8 py-5 max-w-[1600px] mx-auto w-full">

                {/* Breadcrumb */}
                <div className="mb-1">
                    <span className="text-[10px] text-[#b8aa98] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        DASHBOARD / {config.breadcrumb}
                    </span>
                </div>

                {/* Heading */}
                <div className="mb-1">
                    <h1 className="text-[2rem] leading-tight text-[#1f1a14]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                        {config.heading}<em>{config.headingItalic}</em>
                    </h1>
                </div>

                {/* Stats line */}
                <div className="mb-5">
                    <span className="text-[11px] text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {pageKey === "default"
                            ? config.subtext(filteredResources.length, allTags.length, collections.length)
                            : (config.subtext as (count: number) => string)(filteredResources.length)
                        }
                    </span>
                </div>

                {/* Toast messages */}
                {(error || successMessage) && (
                    <div className={`mb-4 px-4 py-2.5 rounded-lg flex items-center gap-2 text-[12px] font-medium ${error
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                        {error || successMessage}
                    </div>
                )}

                {/* Trash warning */}
                {trashOnly && filteredResources.length > 0 && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="text-[12px] text-amber-800 font-medium">
                                Items in trash will be permanently deleted after 7 days.
                            </span>
                        </div>
                        <button
                            onClick={() => setShowEmptyTrash(true)}
                            className="text-[12px] font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                            Empty Trash
                        </button>
                    </div>
                )}

                {/* Quick Capture */}
                {!trashOnly && !archivedOnly && (
                    <div className={`capture-card mb-5 ${showCapture ? "expanded" : ""}`}>
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="flex items-center gap-2 text-[#b8aa98]">
                                <Plus className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Paste a URL to save..."
                                value={captureUrl}
                                onChange={(e) => { setCaptureUrl(e.target.value); if (e.target.value) setShowCapture(true); }}
                                onFocus={() => captureUrl && setShowCapture(true)}
                                className="flex-1 bg-transparent text-[13px] text-[#1f1a14] placeholder-[#b8aa98] focus:outline-none"
                            />
                            {isFetchingMeta && <Loader2 className="w-4 h-4 text-[#9a8b78] animate-spin" />}
                            {metaFetched && !isFetchingMeta && <Check className="w-4 h-4 text-emerald-600" />}
                            {showCapture ? (
                                <button
                                    onClick={() => setShowCapture(false)}
                                    className="p-1 rounded text-[#9a8b78] hover:text-[#5c4f3f] transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowCapture(true)}
                                    className="text-[12px] font-semibold text-[#1f1a14] bg-[#f5f0eb] border border-[#ebe4db] px-3 py-1.5 rounded-md hover:bg-[#ebe4db] transition-colors"
                                >
                                    + Save
                                </button>
                            )}
                        </div>

                        {/* Expanded capture form */}
                        {showCapture && (
                            <div className="border-t border-[#ebe4db] animate-fade-in">
                                {/* ── Section 1: Resource Details ── */}
                                <div className="px-5 pt-5 pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[17px] font-semibold text-[#1f1a14]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                            Save Resource
                                        </h3>
                                        <span className="text-[10px] text-[#b8aa98] flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            <Sparkles className="w-3 h-3" /> auto-extract
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-1.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                Title {metaFetched && <span className="text-emerald-600 ml-1">AUTO</span>}
                                            </label>
                                            <input type="text" value={captureTitle} onChange={(e) => setCaptureTitle(e.target.value)} placeholder="Resource title" className="input-professional" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-1.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tags</label>
                                            <input type="text" value={captureTags} onChange={(e) => setCaptureTags(e.target.value)} placeholder="react, tutorial, ..." className="input-professional" />
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-1.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Notes</label>
                                        <textarea value={captureNotes} onChange={(e) => { if (e.target.value.length <= 1000) setCaptureNotes(e.target.value); }} placeholder="Why are you saving this?" rows={2} className="input-professional resize-none" maxLength={1000} />
                                        <div className="flex justify-end mt-1">
                                            <span className={`text-[10px] ${captureNotes.length > 900 ? "text-red-500" : "text-[#b8aa98]"}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                {captureNotes.length}/1000
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Section 2: Category ── */}
                                <div className="px-5 py-4 border-t border-[#ebe4db] bg-[#fdfcfb]">
                                    <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-2.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        Category
                                    </label>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {Array.from(new Set([
                                            ...["Frontend", "Backend", "DevOps", "Design", "AI", "Security", "Document"],
                                            ...allCategories
                                        ])).map((cat) => {
                                            const isActive = captureCategory === cat;
                                            const colorVal = categoryColors[cat];
                                            const dotClass = colorVal ? CATEGORY_COLOR_DOTS[colorVal] : null;
                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() => setCaptureCategory(isActive ? "" : cat)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-md transition-colors border ${isActive
                                                        ? "bg-[#1f1a14] text-white border-[#1f1a14]"
                                                        : getCategoryColorClasses(colorVal)
                                                        }`}
                                                >
                                                    {dotClass && !isActive && (
                                                        <span className={`w-2 h-2 rounded-full ${dotClass} flex-shrink-0`} />
                                                    )}
                                                    {cat}
                                                </button>
                                            );
                                        })}

                                        {/* + Create New Category */}
                                        <button
                                            onClick={() => setCaptureCustomCat(!captureCustomCat)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-md transition-colors border border-dashed border-[#d9cfc2] text-[#9a8b78] hover:border-[#9a8b78] hover:text-[#5c4f3f] hover:bg-[#f5f0eb]"
                                        >
                                            <Plus className="w-3 h-3" />
                                            New
                                        </button>
                                    </div>

                                    {/* Custom category input — toggled by + New button */}
                                    {captureCustomCat && (
                                        <div className="mt-2.5 animate-fade-in">
                                            <input
                                                type="text"
                                                value={captureCategory}
                                                onChange={(e) => setCaptureCategory(e.target.value)}
                                                placeholder="Type a custom category name..."
                                                className="input-professional text-[12px]"
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* ── Section 3: Category Color ── */}
                                {captureCategory && (
                                    <div className="px-5 py-4 border-t border-[#ebe4db]">
                                        <CategoryColorPicker
                                            category={captureCategory}
                                            currentColor={categoryColors[captureCategory]}
                                            onSelect={(color) => setCategoryColor(captureCategory, color)}
                                            standalone
                                        />
                                    </div>
                                )}

                                {/* ── Section 4: Icon ── */}
                                <div className="px-5 py-4 border-t border-[#ebe4db] bg-[#fdfcfb]">
                                    <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-2 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Icon</label>
                                    <IconPicker value={captureIcon} onChange={setCaptureIcon} size="sm" />
                                </div>

                                {/* ── Footer: Save button ── */}
                                <div className="px-5 py-4 border-t border-[#ebe4db] flex items-center justify-between">
                                    <span className="text-[10px] text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        {captureCategory ? `// ${captureCategory.toLowerCase()}` : "// no category"}
                                    </span>
                                    <button
                                        onClick={handleSaveResource}
                                        disabled={isSaving || !captureUrl.trim() || !captureTitle.trim()}
                                        className="btn-primary disabled:bg-[#d9cfc2] disabled:text-[#9a8b78]"
                                    >
                                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                        Save Resource
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Search + Controls bar */}
                <div className="flex items-center gap-3 mb-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8aa98]" />
                        <input
                            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search resources..."
                            className="input-professional"
                            style={{ paddingLeft: "2.25rem", paddingRight: "2rem" }}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#b8aa98] hover:text-[#5c4f3f]">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* View mode toggle */}
                    <div className="flex items-center bg-white border border-[#ebe4db] rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-[#1f1a14] text-white" : "text-[#9a8b78] hover:text-[#5c4f3f]"}`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-[#1f1a14] text-white" : "text-[#9a8b78] hover:text-[#5c4f3f]"}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Filter button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`btn-secondary text-[12px] ${showFilters ? "border-[#1f1a14] text-[#1f1a14]" : ""}`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-[#1f1a14] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Sort */}
                    <div className="relative">
                        <button
                            onClick={() => setSortMenuOpen(!sortMenuOpen)}
                            className="btn-secondary text-[12px]"
                        >
                            <ArrowDownUp className="w-3.5 h-3.5" />
                            {sortOrder === "newest" ? "Newest" : sortOrder === "oldest" ? "Oldest" : "A-Z"}
                        </button>
                        {sortMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#ebe4db] rounded-lg shadow-elevated z-30 py-1 animate-fade-in">
                                {(["newest", "oldest", "az"] as const).map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSortOrder(opt); setSortMenuOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-[12px] font-medium transition-colors ${sortOrder === opt ? "text-[#1f1a14] bg-[#faf8f5]" : "text-[#7d6e5c] hover:bg-[#faf8f5]"}`}
                                    >
                                        {opt === "newest" ? "Newest First" : opt === "oldest" ? "Oldest First" : "Alphabetical"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bulk select */}
                    {!trashOnly && (
                        <button
                            onClick={() => { setShowBulkSelect(!showBulkSelect); setSelectedIds(new Set()); }}
                            className={`btn-ghost text-[12px] ${showBulkSelect ? "bg-[#ebe4db]" : ""}`}
                        >
                            {showBulkSelect ? "Cancel" : "Select"}
                        </button>
                    )}
                </div>

                {/* Category pills */}
                <div className="mb-4">
                    <CategoryPills
                        categories={allCategories}
                        selectedCategories={selectedCategories}
                        onSelect={handleCategorySelect}
                        categoryCounts={categoryCounts}
                        totalCount={resources.length}
                        categoryColors={categoryColors}
                    />
                </div>

                {/* Main content area */}
                <div className="flex gap-5">
                    {/* Filter panel */}
                    {showFilters && (
                        <div className="w-64 flex-shrink-0 animate-fade-in">
                            <FilterPanel
                                onFiltersChange={setPanelFilters}
                                availableTags={allTags}
                            />
                        </div>
                    )}

                    {/* Resources */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-6 h-6 text-[#9a8b78] animate-spin" />
                            </div>
                        ) : paginatedResources.length > 0 ? (
                            <>
                                <div className={viewMode === "grid"
                                    ? "grid grid-cols-1 md:grid-cols-2 gap-3"
                                    : "flex flex-col gap-2"
                                }>
                                    {paginatedResources.map((resource) => (
                                        <ResourceCard
                                            key={resource.id}
                                            resource={resource}
                                            onEdit={setEditingResource}
                                            onDelete={(id) => setDeletingId(id)}
                                            onArchive={handleArchive}
                                            onPin={handleTogglePin}
                                            onView={setViewingResource}
                                            isSelected={selectedIds.has(resource.id)}
                                            onSelect={toggleSelect}
                                            showCheckbox={showBulkSelect}
                                            isTrash={trashOnly}
                                            onRestore={handleRestore}
                                            onPermanentDelete={handlePermanentDelete}
                                            availableCollections={collections}
                                            onAddToCollection={handleAddToCollection}
                                            onRemoveFromCollection={handleRemoveFromCollection}
                                            categoryColors={categoryColors}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-6">
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i)}
                                                className={`w-8 h-8 rounded-md text-[12px] font-medium transition-colors ${currentPage === i
                                                    ? "bg-[#1f1a14] text-white"
                                                    : "text-[#7d6e5c] hover:bg-[#ebe4db]"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty state */
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="text-6xl mb-6 text-[#d9cfc2]">&ldquo;</div>
                                <h2 className="text-xl text-[#1f1a14] mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                                    {trashOnly ? "Trash is empty." : debouncedSearch ? "No matches found." : "Your second brain awaits."}
                                </h2>
                                <p className="text-[13px] text-[#9a8b78] max-w-sm mb-6">
                                    {trashOnly
                                        ? "Deleted resources will appear here."
                                        : debouncedSearch
                                            ? `No resources match "${debouncedSearch}". Try different keywords.`
                                            : "Save your first resource using the capture bar above, or press Cmd+K from anywhere."
                                    }
                                </p>
                                {!trashOnly && !debouncedSearch && (
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={() => setShowCapture(true)}
                                            className="btn-primary"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Paste a URL
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bulk action bar */}
            {showBulkSelect && selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
                    <div className="flex items-center gap-3 bg-[#1f1a14] text-white px-5 py-3 rounded-xl shadow-elevated">
                        <span className="text-[12px] font-medium">
                            {selectedIds.size} selected
                        </span>
                        <div className="w-px h-4 bg-[#3d3429]" />
                        {archivedOnly ? (
                            <button
                                onClick={() => { handleBulkArchive(new Set(selectedIds), false); setSelectedIds(new Set()); }}
                                className="flex items-center gap-1.5 text-[12px] font-medium hover:text-[#b8aa98] transition-colors"
                            >
                                <RotateCcw className="w-3.5 h-3.5" /> Unarchive
                            </button>
                        ) : (
                            <button
                                onClick={() => { handleBulkArchive(new Set(selectedIds), true); setSelectedIds(new Set()); }}
                                className="flex items-center gap-1.5 text-[12px] font-medium hover:text-[#b8aa98] transition-colors"
                            >
                                <Archive className="w-3.5 h-3.5" /> Archive
                            </button>
                        )}
                        <button
                            onClick={() => { handleBulkDelete(new Set(selectedIds)); setSelectedIds(new Set()); }}
                            className="flex items-center gap-1.5 text-[12px] font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                        {collections.length > 0 && (
                            <button
                                onClick={() => { handleBulkAddToCollection(collections[0].id, new Set(selectedIds)); setSelectedIds(new Set()); }}
                                className="flex items-center gap-1.5 text-[12px] font-medium hover:text-[#b8aa98] transition-colors"
                            >
                                <FolderPlus className="w-3.5 h-3.5" /> Collection
                            </button>
                        )}
                        <div className="w-px h-4 bg-[#3d3429]" />
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="text-[12px] text-[#9a8b78] hover:text-white transition-colors"
                        >
                            Deselect
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {editingResource && (
                <EditResourceModal
                    resource={editingResource}
                    isOpen={!!editingResource}
                    onClose={() => setEditingResource(null)}
                    onSave={handleUpdate}
                    availableCategories={allCategories}
                    categoryColors={categoryColors}
                    onSetCategoryColor={setCategoryColor}
                />
            )}

            <ConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={() => deletingId && handleDelete(deletingId)}
                title="Move to Trash"
                message="This resource will be moved to trash. You can restore it within 7 days."
                confirmLabel="Move to Trash"
            />

            <ConfirmationModal
                isOpen={showEmptyTrash}
                onClose={() => setShowEmptyTrash(false)}
                onConfirm={() => { handleEmptyTrash(); setShowEmptyTrash(false); }}
                title="Empty Trash"
                message="This will permanently delete all items in trash. This action cannot be undone."
                confirmLabel="Empty Trash"
            />

            <ResourceDetailPanel
                resource={viewingResource}
                isOpen={!!viewingResource}
                onClose={() => setViewingResource(null)}
                onEdit={(r) => { setViewingResource(null); setEditingResource(r); }}
                onDelete={(id) => { setViewingResource(null); setDeletingId(id); }}
                onArchive={handleArchive}
                onPin={handleTogglePin}
                categoryColors={categoryColors}
            />
        </div>
    );
}
