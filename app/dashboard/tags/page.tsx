"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Tag, Hash, Loader2, Search, X, ArrowLeft } from "lucide-react";
import ResourceCard from "@/src/components/ResourceCard";
import EditResourceModal from "@/src/components/EditResourceModal";
import ResourceDetailPanel from "@/src/components/ResourceDetailPanel";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import CategoryPills from "@/src/components/CategoryPills";
import { Resource, resourceService } from "@/src/services/resourceService";
import collectionService, { Collection } from "@/src/services/collectionService";
import { useDebounce } from "@/src/hooks/useDebounce";

const TAG_COLORS = [
    { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
    { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
    { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
    { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
    { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
];

function getTagColor(tag: string) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function TagsPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [tagSearch, setTagSearch] = useState("");
    const debouncedTagSearch = useDebounce(tagSearch, 200);

    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [viewingResource, setViewingResource] = useState<Resource | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const showMessage = useCallback((msg: string, type: "success" | "error" = "success") => {
        if (type === "error") { setError(msg); setTimeout(() => setError(""), 3000); }
        else { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(""), 3000); }
    }, []);

    const loadResources = useCallback(async () => {
        try { setLoading(true); const data = await resourceService.getAll(); setResources(data); }
        catch { showMessage("Failed to load resources", "error"); }
        finally { setLoading(false); }
    }, [showMessage]);

    const loadCollections = useCallback(async () => {
        try { const data = await collectionService.getCollections(); setCollections(data); }
        catch { }
    }, []);

    useEffect(() => { loadResources(); }, [loadResources]);
    useEffect(() => { loadCollections(); }, [loadCollections]);

    const tagData = useMemo(() => {
        const counts: Record<string, number> = {};
        resources.forEach(r => (r.tags || []).forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; }));
        return Object.entries(counts).sort(([, a], [, b]) => b - a).map(([tag, count]) => ({ tag, count, color: getTagColor(tag) }));
    }, [resources]);

    const filteredTags = useMemo(() => {
        if (!debouncedTagSearch) return tagData;
        const q = debouncedTagSearch.toLowerCase();
        return tagData.filter(t => t.tag.toLowerCase().includes(q));
    }, [tagData, debouncedTagSearch]);

    const tagResources = useMemo(() => {
        if (!selectedTag) return [];
        return resources.filter(r => r.tags?.includes(selectedTag));
    }, [resources, selectedTag]);

    const availableCategories = useMemo(() => Array.from(new Set(resources.map(r => r.category).filter(Boolean))), [resources]);

    const handleDelete = useCallback(async (id: string) => {
        try { await resourceService.delete(id); setResources(prev => prev.filter(r => r.id !== id)); setDeletingId(null); showMessage("Resource deleted"); }
        catch { showMessage("Failed to delete resource", "error"); }
    }, [showMessage]);

    const handleArchive = useCallback(async (id: string, isArchived: boolean) => {
        try { await resourceService.toggleArchive(id); setResources(prev => prev.filter(r => r.id !== id)); showMessage(isArchived ? "Resource unarchived" : "Resource archived"); }
        catch { showMessage("Failed to update archive status", "error"); }
    }, [showMessage]);

    const handleTogglePin = useCallback(async (id: string) => {
        const resource = resources.find(r => r.id === id);
        if (!resource) return;
        setResources(prev => prev.map(r => r.id === id ? { ...r, isPinned: !r.isPinned } : r));
        try { await resourceService.togglePin(id); }
        catch { setResources(prev => prev.map(r => r.id === id ? { ...r, isPinned: resource.isPinned } : r)); showMessage("Failed to update pin status", "error"); }
    }, [resources, showMessage]);

    const handleUpdate = useCallback(async (id: string, data: any) => {
        try { await resourceService.update(id, data); setResources(prev => prev.map(r => r.id === id ? { ...r, ...data } : r)); }
        catch { showMessage("Failed to update resource", "error"); throw new Error("Update failed"); }
    }, [showMessage]);

    const handleAddToCollection = useCallback(async (collId: string, resourceId: string) => {
        try { await collectionService.addResourceToCollection(collId, resourceId); await loadResources(); }
        catch { showMessage("Failed to add to collection", "error"); }
    }, [loadResources, showMessage]);

    const handleRemoveFromCollection = useCallback(async (collId: string, resourceId: string) => {
        try { await collectionService.removeResourceFromCollection(collId, resourceId); await loadResources(); }
        catch { showMessage("Failed to remove from collection", "error"); }
    }, [loadResources, showMessage]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 text-[#9a8b78] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 px-6 lg:px-8 py-5 max-w-[1600px] mx-auto w-full">

                {/* Breadcrumb */}
                <div className="mb-1">
                    <span className="text-[10px] text-[#b8aa98] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        DASHBOARD / {selectedTag ? `TAGS / #${selectedTag.toUpperCase()}` : "TAGS"}
                    </span>
                </div>

                {/* Heading */}
                <div className="mb-1">
                    <h1 className="text-[2rem] leading-tight text-[#1f1a14]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                        {selectedTag ? (
                            <>The cross-<em>cuts.</em></>
                        ) : (
                            <>The cross-<em>cuts.</em></>
                        )}
                    </h1>
                </div>

                {/* Stats */}
                <div className="mb-5">
                    <span className="text-[11px] text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        // {tagData.length} TAGS ACROSS {resources.length} RESOURCES
                    </span>
                </div>

                {/* Toast */}
                {(error || successMessage) && (
                    <div className={`mb-4 px-4 py-2.5 rounded-lg flex items-center gap-2 text-[12px] font-medium ${error ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                        {error || successMessage}
                    </div>
                )}

                {selectedTag ? (
                    <div>
                        <button onClick={() => setSelectedTag(null)} className="flex items-center gap-2 text-[13px] font-medium text-[#9a8b78] hover:text-[#1f1a14] transition-colors mb-4 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Back to all tags
                        </button>

                        <div className="mb-5">
                            <h2 className="text-[1.5rem] text-[#1f1a14] font-semibold" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                                #{selectedTag}
                            </h2>
                            <span className="text-[11px] text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                // {tagResources.length} RESOURCES
                            </span>
                        </div>

                        {tagResources.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {tagResources.map(resource => (
                                    <ResourceCard
                                        key={resource.id}
                                        resource={resource}
                                        onEdit={setEditingResource}
                                        onDelete={(id) => setDeletingId(id)}
                                        onArchive={handleArchive}
                                        onPin={handleTogglePin}
                                        availableCollections={collections}
                                        onAddToCollection={handleAddToCollection}
                                        onRemoveFromCollection={handleRemoveFromCollection}
                                        onView={setViewingResource}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-[13px] text-[#9a8b78]">No resources with this tag</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {/* Search */}
                        <div className="mb-5 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8aa98]" />
                                <input
                                    type="text" placeholder="Search tags..." value={tagSearch}
                                    onChange={(e) => setTagSearch(e.target.value)}
                                    className="input-professional pl-9 pr-8"
                                />
                                {tagSearch && (
                                    <button onClick={() => setTagSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#b8aa98] hover:text-[#5c4f3f]">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {filteredTags.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                {filteredTags.map(({ tag, count, color }) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`group flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-150 hover:shadow-sm text-left ${color.bg} ${color.border} hover:ring-2 hover:ring-offset-1`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <Hash className={`w-4 h-4 flex-shrink-0 ${color.text}`} />
                                            <span className={`text-[13px] font-semibold truncate ${color.text}`}>{tag}</span>
                                        </div>
                                        <span className="text-[11px] font-semibold text-[#b8aa98] tabular-nums ml-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            {count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : tagData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="text-6xl mb-6 text-[#d9cfc2]">#</div>
                                <h3 className="text-[17px] text-[#1f1a14] mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>No tags yet</h3>
                                <p className="text-[13px] text-[#9a8b78] max-w-xs">
                                    Tags help you organize and find resources quickly. Add tags when saving a resource.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <h3 className="text-[17px] text-[#1f1a14] mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>No matching tags</h3>
                                <p className="text-[13px] text-[#9a8b78]">No tags match &quot;{debouncedTagSearch}&quot;</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {editingResource && (
                <EditResourceModal resource={editingResource} isOpen={!!editingResource} onClose={() => setEditingResource(null)} onSave={handleUpdate} availableCategories={availableCategories} />
            )}
            <ConfirmationModal isOpen={!!deletingId} onClose={() => setDeletingId(null)} onConfirm={() => deletingId && handleDelete(deletingId)} title="Delete Resource" message="Are you sure you want to delete this resource? This action cannot be undone." confirmLabel="Delete Resource" />
            <ResourceDetailPanel resource={viewingResource} isOpen={!!viewingResource} onClose={() => setViewingResource(null)} onEdit={(r) => { setViewingResource(null); setEditingResource(r); }} onDelete={(id) => { setViewingResource(null); setDeletingId(id); }} onArchive={handleArchive} onPin={handleTogglePin} />
        </div>
    );
}
