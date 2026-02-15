"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Bookmark,
    Plus,
    Trash2,
    Check,
    ChevronRight,
    Loader2
} from "lucide-react";
import collectionService, { Collection } from "../services/collectionService";

export default function Collections() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const currentCollectionId = searchParams.get("collectionId");

    useEffect(() => {
        loadCollections();
    }, []);

    const loadCollections = async () => {
        try {
            setLoading(true);
            const data = await collectionService.getCollections();
            setCollections(data);
        } catch (error) {
            console.error("Failed to load collections", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newName.trim() || isSaving) return;

        try {
            setIsSaving(true);
            const created = await collectionService.createCollection(newName);
            setCollections([...collections, created]);
            setNewName("");
            setShowSaveModal(false);
        } catch (error) {
            console.error("Failed to create collection", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await collectionService.deleteCollection(id);
            setCollections(collections.filter(c => c.id !== id));
            if (currentCollectionId === id) {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Failed to delete collection", error);
        }
    };

    const handleSelect = (id: string) => {
        const params = new URLSearchParams();
        params.set("collectionId", id);
        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-2 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                    <Bookmark className="w-3 h-3" />
                    <span>Collections</span>
                </div>
                <button
                    onClick={() => setShowSaveModal(true)}
                    className="p-1 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800/50 transition-all"
                    title="New Collection"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
                </div>
            ) : collections.length > 0 ? (
                <div className="space-y-0.5">
                    {collections.map((collection) => {
                        const isActive = currentCollectionId === collection.id;
                        return (
                            <div
                                key={collection.id}
                                onMouseEnter={() => setHoveredId(collection.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="group relative flex items-center"
                            >
                                <button
                                    onClick={() => handleSelect(collection.id)}
                                    className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group-active:scale-[0.98] ${isActive
                                        ? "bg-indigo-600/10 text-indigo-400"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                                        }`}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? "bg-indigo-400" : "bg-slate-600 group-hover:bg-indigo-500"
                                        }`} />
                                    <span className="text-sm font-medium truncate">
                                        {collection.name}
                                    </span>
                                </button>

                                {hoveredId === collection.id && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(collection.id);
                                        }}
                                        className="absolute right-2 p-1 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="px-3 py-2 text-[10px] text-slate-600 font-medium italic">
                    No folders created
                </div>
            )}

            {/* Create Modal */}
            {showSaveModal && (
                <div className="modal-overlay z-[100]">
                    <div className="modal-content bg-slate-900 border border-slate-800 text-white shadow-2xl">
                        <h3 className="text-lg font-bold mb-1">New Collection</h3>
                        <p className="text-sm text-slate-400 mb-4">Create a folder to group resources manually.</p>

                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g., Backend Roadmap"
                            className="w-full bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all mb-4"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowSaveModal(false); setNewName(""); }}
                                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 transition-all border border-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={!newName.trim() || isSaving}
                                className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
