"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2, Sparkles, Plus } from "lucide-react";
import { Resource, UpdateResourceRequest } from "../services/resourceService";
import IconPicker from "./IconPicker";
import CategoryColorPicker from "./CategoryColorPicker";
import { getCategoryColorClasses, CATEGORY_COLOR_DOTS, CategoryColorMap } from "../services/categoryColorService";

interface EditResourceModalProps {
    resource: Resource;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, data: UpdateResourceRequest) => Promise<void>;
    availableCategories: string[];
    categoryColors?: CategoryColorMap;
    onSetCategoryColor?: (category: string, color: string) => void;
}

export default function EditResourceModal({
    resource,
    isOpen,
    onClose,
    onSave,
    availableCategories,
    categoryColors,
    onSetCategoryColor
}: EditResourceModalProps) {
    const [title, setTitle] = useState(resource.title);
    const [url, setUrl] = useState(resource.url);
    const [category, setCategory] = useState(resource.category);
    const [note, setNote] = useState(resource.note || "");
    const [tags, setTags] = useState<string>(resource.tags?.join(", ") || "");
    const [icon, setIcon] = useState<string | null>(resource.icon || null);
    const [isSaving, setIsSaving] = useState(false);
    const [showCustomCat, setShowCustomCat] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle(resource.title);
            setUrl(resource.url);
            setCategory(resource.category);
            setNote(resource.note || "");
            setTags(resource.tags?.join(", ") || "");
            setIcon(resource.icon || null);
            setShowCustomCat(false);
        }
    }, [isOpen, resource]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!title.trim() || !url.trim() || !category.trim()) return;

        const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);

        try {
            setIsSaving(true);
            await onSave(resource.id, { title, url, category, note, tags: parsedTags, icon });
            onClose();
        } catch (error) {
            console.error("Failed to update resource", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white border border-[#ebe4db] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-modal-pop max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-5 pt-5 pb-4 border-b border-[#ebe4db] flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-[17px] font-semibold text-[#1f1a14]" style={{ fontFamily: "'DM Serif Display', serif" }}>Edit Resource</h3>
                        <p className="text-[11px] text-[#9a8b78] mt-0.5">Update your saved resource details</p>
                    </div>
                    <button onClick={onClose} className="icon-btn">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto">
                    {/* Resource Details */}
                    <div className="px-5 py-4 space-y-3">
                        <div>
                            <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-1 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>URL</label>
                            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="input-professional" />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-1 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" className="input-professional font-medium" />
                            </div>
                            <div>
                                <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-1 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Icon</label>
                                <IconPicker value={icon} onChange={setIcon} size="sm" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-1 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tags</label>
                            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, tutorial" className="input-professional" />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-1 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Notes</label>
                            <textarea value={note} onChange={(e) => { if (e.target.value.length <= 1000) setNote(e.target.value); }} placeholder="Why did you save this?" rows={2} className="input-professional resize-none" maxLength={1000} />
                            <div className="flex justify-end mt-1">
                                <span className={`text-[10px] ${note.length > 900 ? "text-red-500" : "text-[#b8aa98]"}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {note.length}/1000
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Category Section */}
                    <div className="px-5 py-4 border-t border-[#ebe4db] bg-[#fdfcfb]">
                        <label className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest mb-2.5 block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Category</label>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {availableCategories.map((cat) => {
                                const isActive = category === cat;
                                const colorVal = categoryColors?.[cat];
                                const dotClass = colorVal ? CATEGORY_COLOR_DOTS[colorVal] : null;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
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
                            <button
                                onClick={() => setShowCustomCat(!showCustomCat)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-md transition-colors border border-dashed border-[#d9cfc2] text-[#9a8b78] hover:border-[#9a8b78] hover:text-[#5c4f3f] hover:bg-[#f5f0eb]"
                            >
                                <Plus className="w-3 h-3" />
                                New
                            </button>
                        </div>
                        {showCustomCat && (
                            <div className="mt-2.5 animate-fade-in">
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Type a custom category name..."
                                    className="input-professional text-[12px]"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    {/* Color Picker Section */}
                    {category && onSetCategoryColor && (
                        <div className="px-5 py-4 border-t border-[#ebe4db]">
                            <CategoryColorPicker
                                category={category}
                                currentColor={categoryColors?.[category]}
                                onSelect={(color) => onSetCategoryColor(category, color)}
                                standalone
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-[#ebe4db] bg-[#fdfcfb] shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <Sparkles className="w-3 h-3" />
                        <span>// editing resource</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="text-[13px] font-medium text-[#9a8b78] hover:text-[#5c4f3f] transition-colors" disabled={isSaving}>
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !title.trim() || !url.trim() || !category.trim()}
                            className="btn-primary disabled:bg-[#d9cfc2] disabled:text-[#9a8b78]"
                        >
                            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
