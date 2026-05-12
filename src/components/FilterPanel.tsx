"use client";

import { useState, useEffect } from "react";
import {
    SlidersHorizontal,
    ChevronDown,
    Calendar,
    Hash,
    Globe
} from "lucide-react";

export interface FilterState {
    categories: string[];
    tags: string[];
    dateRange: string;
    sources: string[];
}

interface FilterPanelProps {
    onFiltersChange?: (filters: FilterState) => void;
    availableCategories?: string[];
    availableTags?: string[];
}

const dateRanges = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
    { value: "365", label: "Last year" },
];

import { SOURCES, OTHER_SOURCE } from "../utils/sourceUtils";

const sourceOptions = [
    ...SOURCES.map(s => ({ value: s.id, label: s.name, icon: s.labelIcon })),
    { value: OTHER_SOURCE.id, label: OTHER_SOURCE.name, icon: OTHER_SOURCE.labelIcon }
];

export default function FilterPanel({
    onFiltersChange,
    availableTags = []
}: FilterPanelProps) {
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        tags: [],
        dateRange: "",
        sources: [],
    });

    const [expandedSections, setExpandedSections] = useState({
        tags: true,
        dateRange: false,
        sources: false,
    });

    useEffect(() => {
        onFiltersChange?.(filters);
    }, [filters, onFiltersChange]);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const toggleFilter = (type: keyof FilterState, value: string) => {
        setFilters(prev => {
            const current = prev[type] as string[];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    const setDateRange = (value: string) => {
        setFilters(prev => ({ ...prev, dateRange: prev.dateRange === value ? "" : value }));
    };

    const clearFilters = () => {
        setFilters({ categories: [], tags: [], dateRange: "", sources: [] });
    };

    const hasActiveFilters =
        filters.tags.length > 0 ||
        filters.dateRange ||
        filters.sources.length > 0;

    return (
        <div className="filter-panel">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#9a8b78]" />
                    <h3 className="text-[13px] font-semibold text-[#1f1a14]">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-[11px] text-[#9a8b78] hover:text-[#5c4f3f] font-medium transition-colors">
                        Clear all
                    </button>
                )}
            </div>

            {/* Tags */}
            <div className="filter-section">
                <button onClick={() => toggleSection("tags")} className="w-full flex items-center justify-between py-1 mb-2">
                    <div className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-[#b8aa98]" />
                        <span className="text-[12px] font-medium text-[#5c4f3f]">Tags</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#b8aa98] transition-transform ${expandedSections.tags ? "" : "-rotate-90"}`} />
                </button>
                {expandedSections.tags && (
                    <div className="flex flex-wrap gap-1.5 pl-5">
                        {availableTags.length > 0 ? (
                            availableTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleFilter("tags", tag)}
                                    className={`text-[11px] px-2 py-1 rounded-md border transition-all ${filters.tags.includes(tag)
                                        ? "bg-[#1f1a14] border-[#1f1a14] text-white"
                                        : "bg-white border-[#ebe4db] text-[#7d6e5c] hover:border-[#d9cfc2]"
                                        }`}
                                >
                                    #{tag}
                                </button>
                            ))
                        ) : (
                            <p className="text-[11px] text-[#b8aa98]">No tags yet</p>
                        )}
                    </div>
                )}
            </div>

            {/* Date Range */}
            <div className="filter-section">
                <button onClick={() => toggleSection("dateRange")} className="w-full flex items-center justify-between py-1 mb-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#b8aa98]" />
                        <span className="text-[12px] font-medium text-[#5c4f3f]">Date Range</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#b8aa98] transition-transform ${expandedSections.dateRange ? "" : "-rotate-90"}`} />
                </button>
                {expandedSections.dateRange && (
                    <div className="space-y-1 pl-5">
                        {dateRanges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => setDateRange(range.value)}
                                className={`w-full text-left px-2.5 py-1.5 rounded-md text-[12px] transition-colors ${filters.dateRange === range.value
                                    ? "bg-[#1f1a14] text-white font-medium"
                                    : "text-[#7d6e5c] hover:bg-[#faf8f5]"
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Sources */}
            <div>
                <button onClick={() => toggleSection("sources")} className="w-full flex items-center justify-between py-1 mb-2">
                    <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-[#b8aa98]" />
                        <span className="text-[12px] font-medium text-[#5c4f3f]">Sources</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#b8aa98] transition-transform ${expandedSections.sources ? "" : "-rotate-90"}`} />
                </button>
                {expandedSections.sources && (
                    <div className="space-y-0.5 pl-5">
                        {sourceOptions.map((source) => (
                            <button
                                key={source.value}
                                onClick={() => toggleFilter("sources", source.value)}
                                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-colors ${filters.sources.includes(source.value)
                                    ? "bg-[#1f1a14] text-white font-medium"
                                    : "text-[#7d6e5c] hover:bg-[#faf8f5]"
                                    }`}
                            >
                                <span className="text-sm">{source.icon}</span>
                                <span>{source.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
