"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Plus,
    Link2,
    X,
    Check,
    Loader2,
    Sparkles,
    LayoutGrid,
    List
} from "lucide-react";
import FilterPanel, { FilterState } from "@/src/components/FilterPanel";
import CategoryPills from "@/src/components/CategoryPills";
import SavedViews from "@/src/components/SavedViews";
import ResourceCard from "@/src/components/ResourceCard";
import EditResourceModal from "@/src/components/EditResourceModal";
import { resourceService, Resource } from "@/src/services/resourceService";
import { api } from "@/src/lib/api";



export default function Dashboard() {
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
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [showArchived, setShowArchived] = useState(false);

    // Filter State
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        tags: [],
        dateRange: "",
        sources: [],
    });

    // Stats
    const [stats, setStats] = useState({ total: 0, topTags: [] as string[] });
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        loadResources();

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

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await resourceService.getAll(showArchived);
            setResources(data);
        } catch (err: any) {
            console.error("Failed to load resources:", err);
            setError("Failed to load resources");
        } finally {
            setLoading(false);
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;

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
            // Need to map frontend Resource to UpdatedResourceRequest or just use data if compatible? 
            // UpdateResourceRequest expects: url, title, note, category, tags.
            // data passed from Modal is UpdateResourceRequest.
            // But state resources array elements have extra fields like id, createdAt.

            await resourceService.update(id, data);

            // Refresh local state
            setResources(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));

        } catch (error) {
            console.error("Failed to update resource", error);
            setError("Failed to update resource");
            throw error;
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
            const lowerUrl = resource.url.toLowerCase();
            matchesSource = filters.sources.some(source => {
                const s = source.toLowerCase();
                if (s === 'github') return lowerUrl.includes('github.com');
                if (s === 'youtube') return lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be');
                if (s === 'linkedin') return lowerUrl.includes('linkedin.com');
                if (s === 'medium') return lowerUrl.includes('medium.com');
                if (s === 'stackoverflow') return lowerUrl.includes('stackoverflow.com');
                if (s === 'google docs' || s === 'docs') return lowerUrl.includes('docs.google.com');
                if (s === 'dev.to') return lowerUrl.includes('dev.to');
                if (s === 'articles') return lowerUrl.includes('medium.com') || lowerUrl.includes('dev.to');
                return lowerUrl.includes(s.replace(/\s+/g, ''));
            });
        }

        return matchesSearch && matchesCategory && matchesTags && matchesDateRange && matchesSource;
    }).sort((a, b) => {
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
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
                <div className="px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>
                    </div>


                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="xl:col-span-8 space-y-8">

                    {/* Quick Capture */}
                    <div
                        ref={formRef}
                        className={`capture-card ${isExpanded ? 'expanded' : ''}`}
                    >
                        <div className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isExpanded
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    <Plus className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Add a URL or resource..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onFocus={() => setIsExpanded(true)}
                                    className="flex-1 text-base font-medium text-slate-900 placeholder-slate-400 bg-transparent border-none focus:outline-none focus:ring-0"
                                />
                                {!isExpanded && (
                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                        Ctrl+K
                                    </span>
                                )}
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="px-4 pb-5 border-t border-slate-100 animate-fade-in">
                                <div className="pt-4 space-y-4">
                                    <div className="form-group">
                                        <label className="form-label">URL</label>
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className="input-professional"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Give it a memorable title"
                                            className="input-professional"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <input
                                                type="text"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                placeholder="e.g., Frontend"
                                                className="input-professional"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Tags</label>
                                            <input
                                                type="text"
                                                value={tags}
                                                onChange={(e) => setTags(e.target.value)}
                                                placeholder="react, tutorial"
                                                className="input-professional"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Notes</label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Why are you saving this? What should you remember?"
                                            rows={3}
                                            className="input-professional resize-none"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Auto-suggest enabled</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setIsExpanded(false)} className="btn-ghost">
                                                Cancel
                                            </button>
                                            <button onClick={save} disabled={loading || !url} className="btn-primary">
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

                    {/* Resources Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-title text-slate-900">{showArchived ? "Archived Resources" : "Resources"}</h2>
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                                {filteredResources.length}
                            </span>
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

                            <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                <button
                                    onClick={() => setShowArchived(!showArchived)}
                                    className={`p-2 rounded-md transition-all text-xs font-medium px-3 ${showArchived ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {showArchived ? "Show Active" : "Archived"}
                                </button>
                                <div className="w-px h-4 bg-slate-200 mx-1"></div>
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
                        </div>
                    </div>

                    {/* Resources Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                            <div className="h-3 bg-slate-50 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredResources.length === 0 ? (
                        <div className="empty-state bg-white rounded-2xl border border-dashed border-slate-300">
                            <div className="empty-state-icon">
                                <Link2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">No resources found</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                                {searchQuery || filters.categories.length > 0
                                    ? "Try adjusting your search or filters"
                                    : "Start building your knowledge base by adding your first resource"}
                            </p>
                            {!searchQuery && filters.categories.length === 0 && (
                                <button onClick={() => setIsExpanded(true)} className="btn-primary">
                                    <Plus className="w-4 h-4" />
                                    Add Resource
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === "grid" ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {filteredResources.map((resource, idx) => (
                                <div key={resource.id} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <ResourceCard
                                        resource={resource}
                                        onEdit={setEditingResource}
                                        onDelete={handleDelete}
                                        onArchive={handleArchive}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
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

                        {/* Saved Views */}
                        <SavedViews
                            currentFilters={filters}
                            onLoadView={setFilters}
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
            )
            }
        </div >
    );
}