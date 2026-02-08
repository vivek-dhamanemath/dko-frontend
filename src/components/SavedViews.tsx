"use client";

import { useState } from "react";
import {
    Bookmark,
    Plus,
    Eye,
    Trash2,
    Check
} from "lucide-react";

interface FilterState {
    categories: string[];
    tags: string[];
    dateRange: string;
    sources: string[];
}

interface SavedView {
    id: number;
    name: string;
    filters: FilterState;
    createdAt: string;
}

interface SavedViewsProps {
    currentFilters?: FilterState;
    onLoadView?: (filters: FilterState) => void;
}

const mockSavedViews: SavedView[] = [
    {
        id: 1,
        name: "React Resources",
        filters: { categories: ["react"], tags: [], dateRange: "", sources: [] },
        createdAt: "2024-01-15",
    },
    {
        id: 2,
        name: "This Week",
        filters: { categories: [], tags: [], dateRange: "7", sources: [] },
        createdAt: "2024-01-20",
    },
];

export default function SavedViews({
    currentFilters,
    onLoadView
}: SavedViewsProps) {
    const [savedViews, setSavedViews] = useState<SavedView[]>(mockSavedViews);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [viewName, setViewName] = useState("");
    const [hoveredView, setHoveredView] = useState<number | null>(null);

    const hasActiveFilters =
        currentFilters && (
            currentFilters.categories.length > 0 ||
            currentFilters.tags.length > 0 ||
            currentFilters.dateRange ||
            currentFilters.sources.length > 0
        );

    const saveView = () => {
        if (!viewName.trim() || !currentFilters) return;

        const newView: SavedView = {
            id: Date.now(),
            name: viewName,
            filters: currentFilters,
            createdAt: new Date().toISOString(),
        };

        setSavedViews([...savedViews, newView]);
        setViewName("");
        setShowSaveModal(false);
    };

    const deleteView = (id: number) => {
        setSavedViews(savedViews.filter(v => v.id !== id));
    };

    const loadView = (view: SavedView) => {
        onLoadView?.(view.filters);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-semibold text-slate-900">Saved Views</h3>
                </div>
                <button
                    onClick={() => setShowSaveModal(true)}
                    disabled={!hasActiveFilters}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Save
                </button>
            </div>

            {/* Views List */}
            {savedViews.length === 0 ? (
                <div className="text-center py-6">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Eye className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="text-xs text-slate-400">No saved views yet</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">Save filter combinations</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {savedViews.map((view) => (
                        <div
                            key={view.id}
                            onMouseEnter={() => setHoveredView(view.id)}
                            onMouseLeave={() => setHoveredView(null)}
                            className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            <button
                                onClick={() => loadView(view)}
                                className="flex-1 text-left"
                            >
                                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                                    {view.name}
                                </span>
                            </button>

                            {hoveredView === view.id && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteView(view.id);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Save Modal */}
            {showSaveModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Save View</h3>
                        <p className="text-sm text-slate-500 mb-4">Save your current filter settings</p>

                        <input
                            type="text"
                            value={viewName}
                            onChange={(e) => setViewName(e.target.value)}
                            placeholder="e.g., React Tutorials"
                            className="input-professional mb-4"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && saveView()}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowSaveModal(false); setViewName(""); }}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveView}
                                disabled={!viewName.trim()}
                                className="btn-primary flex-1"
                            >
                                <Check className="w-4 h-4" />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}