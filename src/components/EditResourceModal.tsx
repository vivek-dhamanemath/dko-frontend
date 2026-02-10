"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
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
    const [tags, setTags] = useState<string[]>(resource.tags || []);
    const [tagInput, setTagInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle(resource.title);
            setUrl(resource.url);
            setCategory(resource.category);
            setNote(resource.note || "");
            setTags(resource.tags || []);
            setTagInput("");
        }
    }, [isOpen, resource]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!title.trim() || !url.trim() || !category.trim()) return;

        try {
            setIsSaving(true);
            await onSave(resource.id, {
                title,
                url,
                category,
                note,
                tags
            });
            onClose();
        } catch (error) {
            console.error("Failed to update resource", error);
        } finally {
            setIsSaving(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-900">Edit Resource</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="Resource Title"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="https://example.com"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="Frontend, Backend, etc."
                        />
                        {/* Suggested Categories */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {availableCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-2 py-1 text-xs rounded-md transition-colors ${category === cat
                                        ? "bg-indigo-100 text-indigo-700 font-medium"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addTag()}
                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                placeholder="Add a tag..."
                            />
                            <button
                                onClick={addTag}
                                className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium text-sm transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                                    #{tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-indigo-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
                            placeholder="Add a personal note..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 font-medium text-sm transition-colors"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !title.trim() || !url.trim() || !category.trim()}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
