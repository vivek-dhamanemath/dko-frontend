"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2, Sparkles } from "lucide-react";
import { Resource, UpdateResourceRequest } from "../services/resourceService";

interface EditResourceModalProps {
    resource: Resource;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, data: UpdateResourceRequest) => Promise<void>;
    availableCategories: string[];
}

export default function EditResourceModal({
    resource,
    isOpen,
    onClose,
    onSave,
    availableCategories
}: EditResourceModalProps) {
    const [title, setTitle] = useState(resource.title);
    const [url, setUrl] = useState(resource.url);
    const [category, setCategory] = useState(resource.category);
    const [note, setNote] = useState(resource.note || "");
    const [tags, setTags] = useState<string>(resource.tags?.join(", ") || "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle(resource.title);
            setUrl(resource.url);
            setCategory(resource.category);
            setNote(resource.note || "");
            setTags(resource.tags?.join(", ") || "");
        }
    }, [isOpen, resource]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!title.trim() || !url.trim() || !category.trim()) return;

        const parsedTags = tags
            .split(",")
            .map(t => t.trim())
            .filter(Boolean);

        try {
            setIsSaving(true);
            await onSave(resource.id, {
                title,
                url,
                category,
                note,
                tags: parsedTags
            });
            onClose();
        } catch (error) {
            console.error("Failed to update resource", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white border border-indigo-400 rounded-2xl w-full max-w-lg shadow-lg shadow-indigo-500/8 overflow-hidden">
                {/* Header — matches Quick Capture expanded header */}
                <div className="p-5 pb-0">
                    <div className="mb-4 pb-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Edit Resource</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Update your saved resource details</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body — same input styles as Quick Capture */}
                <div className="px-5 pb-5 border-t border-slate-100">
                    <div className="pt-4 space-y-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">URL</label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Resource title"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g., Frontend"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tags</label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="react, tutorial"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>
                        </div>
                        {/* Suggested categories */}
                        {availableCategories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {availableCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${category === cat
                                            ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                            : "bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100 hover:text-slate-700"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Notes</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Why did you save this?"
                                rows={2}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                            />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                <span>Editing resource</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !title.trim() || !url.trim() || !category.trim()}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-indigo-500/20"
                                >
                                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
