"use client";

import { useState, useEffect } from "react";
import {
    SlidersHorizontal,
    ChevronDown,
    Calendar,
    FolderOpen,
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
    availableCategories = [],
    availableTags = []
}: FilterPanelProps) {
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        tags: [],
        dateRange: "",
        sources: [],
    });

    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        tags: true,
        dateRange: false,
        sources: false,
    });

    // Notify parent when filters change (using useEffect to avoid setState during render)
    useEffect(() => {
        onFiltersChange?.(filters);
    }, [filters, onFiltersChange]);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
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
        setFilters(prev => ({ ...prev, dateRange: value }));
    };

    const clearFilters = () => {
        setFilters({ categories: [], tags: [], dateRange: "", sources: [] });
    };

    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.tags.length > 0 ||
        filters.dateRange ||
        filters.sources.length > 0;

    return (
        <div className="filter-panel">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Clear all
                    </button>
                )}
            </div>



            {/* Tags */}
            <div className="filter-section">
                <button
                    onClick={() => toggleSection('tags')}
                    className="w-full flex items-center justify-between py-1 mb-2"
                >
                    <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Tags</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.tags ? '' : '-rotate-90'}`} />
                </button>

                {expandedSections.tags && (
                    <div className="flex flex-wrap gap-1.5 pl-6">
                        {availableTags.length > 0 ? (
                            availableTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleFilter('tags', tag)}
                                    className={`text-xs px-2.5 py-1 rounded-md border transition-all ${filters.tags.includes(tag)
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    #{tag}
                                </button>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400">No tags yet</p>
                        )}
                    </div>
                )}
            </div>

            {/* Date Range */}
            <div className="filter-section">
                <button
                    onClick={() => toggleSection('dateRange')}
                    className="w-full flex items-center justify-between py-1 mb-2"
                >
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Date Range</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.dateRange ? '' : '-rotate-90'}`} />
                </button>

                {expandedSections.dateRange && (
                    <div className="space-y-1 pl-6">
                        {dateRanges.map((range) => (
                            <label
                                key={range.value}
                                className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="dateRange"
                                    checked={filters.dateRange === range.value}
                                    onChange={() => setDateRange(range.value)}
                                    className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-slate-600">{range.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Sources */}
            <div>
                <button
                    onClick={() => toggleSection('sources')}
                    className="w-full flex items-center justify-between py-1 mb-2"
                >
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Sources</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.sources ? '' : '-rotate-90'}`} />
                </button>

                {expandedSections.sources && (
                    <div className="space-y-1 pl-6">
                        {sourceOptions.map((source) => (
                            <label
                                key={source.value}
                                className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.sources.includes(source.value)}
                                    onChange={() => toggleFilter('sources', source.value)}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm">{source.icon}</span>
                                <span className="text-sm text-slate-600">{source.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}