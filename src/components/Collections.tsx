"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Plus,
    Trash2,
    Check,
    Loader2,
    ChevronDown,
    Folder
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
    const [isExpanded, setIsExpanded] = useState(true);

    const currentCollectionId = searchParams.get("collectionId");

    useEffect(() => { loadCollections(); }, []);

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
            if (currentCollectionId === id) router.push("/dashboard");
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
        <div>
            {/* Header */}
            <div className="flex items-center justify-between px-2.5 mb-1">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1.5 text-[10px] font-medium text-[#5c4f3f] uppercase tracking-wider hover:text-[#8a7e72] transition-colors"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`} />
                    <span>Collections</span>
                </button>
                <button
                    onClick={() => setShowSaveModal(true)}
                    className="p-1 rounded-md text-[#5c4f3f] hover:text-[#d9cfc2] hover:bg-[#2d2520] transition-all"
                    title="New Collection"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* List */}
            {isExpanded && (
                <>
                    {loading ? (
                        <div className="flex justify-center py-3">
                            <Loader2 className="w-3.5 h-3.5 text-[#5c4f3f] animate-spin" />
                        </div>
                    ) : collections.length > 0 ? (
                        <div className="space-y-px">
                            {collections.map((collection) => {
                                const isActive = currentCollectionId === collection.id;
                                return (
                                    <div
                                        key={collection.id}
                                        onMouseEnter={() => setHoveredId(collection.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        className="group/item relative flex items-center"
                                    >
                                        <button
                                            onClick={() => handleSelect(collection.id)}
                                            className={`flex-1 flex items-center gap-2.5 pl-3 pr-8 py-[7px] rounded-lg transition-all duration-150 text-[13px] ${isActive
                                                ? "bg-[#2d2520] text-white font-medium"
                                                : "text-[#8a7e72] hover:bg-[#2d2520]/50 hover:text-[#d9cfc2] font-normal"
                                                }`}
                                        >
                                            <Folder className={`w-[16px] h-[16px] flex-shrink-0 transition-colors ${isActive ? "text-[#d9cfc2]" : "text-[#5c4f3f]"}`} />
                                            <span className="truncate">{collection.name}</span>
                                        </button>
                                        {hoveredId === collection.id && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(collection.id); }}
                                                className="absolute right-1.5 p-1 text-[#5c4f3f] hover:text-red-400 hover:bg-red-950/20 rounded-md transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#5c4f3f] hover:text-[#d9cfc2] hover:bg-[#2d2520]/50 rounded-lg transition-colors font-medium"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add a collection</span>
                        </button>
                    )}
                </>
            )}

            {/* Create Modal */}
            {showSaveModal && (
                <div className="modal-overlay z-[100]">
                    <div className="modal-content bg-white border border-[#ebe4db] text-[#1f1a14]">
                        <h3 className="text-[15px] font-semibold mb-0.5">New Collection</h3>
                        <p className="text-[12px] text-[#9a8b78] mb-4">Create a folder to group resources manually.</p>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g., Backend Roadmap"
                            className="input-professional mb-4"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowSaveModal(false); setNewName(""); }}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={!newName.trim() || isSaving}
                                className="btn-primary flex-1 disabled:bg-[#d9cfc2] disabled:text-[#9a8b78]"
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
