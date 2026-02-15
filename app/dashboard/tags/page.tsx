"use client";

import { useState, useEffect } from "react";
import { Tag, Hash, Loader2 } from "lucide-react";
import ResourceCard from "@/src/components/ResourceCard";
import { Resource, resourceService } from "@/src/services/resourceService";

export default function TagsPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            const data = await resourceService.getAll();
            setResources(data);
        } catch (error) {
            console.error("Failed to load resources:", error);
        } finally {
            setLoading(false);
        }
    };

    // Extract all unique tags and count them
    const tagCounts = resources.flatMap(r => r.tags || []).reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Sort tags by count (descending)
    const sortedTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([tag]) => tag);

    const filteredResources = selectedTag
        ? resources.filter(r => r.tags?.includes(selectedTag))
        : resources;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    <Tag className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tags</h1>
                    <p className="text-slate-500">Manage and explore your resources by tags</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Tags Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-500" />
                            All Tags
                        </h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTag === null
                                    ? "bg-indigo-50 text-indigo-700 font-medium"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                All Resources
                            </button>
                            {sortedTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedTag === tag
                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <span>#{tag}</span>
                                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">
                                        {tagCounts[tag]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 gap-4">
                        {filteredResources.length > 0 ? (
                            filteredResources.map(resource => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-500">No resources found for this tag.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
