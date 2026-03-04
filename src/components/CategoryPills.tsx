"use client";

import { cn } from "@/src/lib/utils";

interface CategoryPillsProps {
    categories: string[];
    selectedCategories: string[];
    onSelect: (category: string) => void;
    className?: string;
}

const getCategoryColors = (category: string, isSelected: boolean) => {
    const key = category.toLowerCase();

    if (isSelected) {
        const styles: Record<string, string> = {
            'frontend': 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-500/25',
            'backend': 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/25',
            'devops': 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/25',
            'react': 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25',
            'design': 'bg-pink-600 text-white border-pink-600 shadow-sm shadow-pink-500/25',
            'tutorial': 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-500/25',
            'documentation': 'bg-slate-600 text-white border-slate-600 shadow-sm shadow-slate-500/25',
            'ai': 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/25',
            'api document': 'bg-cyan-600 text-white border-cyan-600 shadow-sm shadow-cyan-500/25',
            'document': 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25',
            'security': 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-500/25',
        };
        return styles[key] || 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25';
    } else {
        const styles: Record<string, string> = {
            'frontend': 'bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100',
            'backend': 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
            'devops': 'bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100',
            'react': 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
            'design': 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
            'tutorial': 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100',
            'documentation': 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
            'ai': 'bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100',
            'api document': 'bg-cyan-50 text-cyan-600 border-cyan-200 hover:bg-cyan-100',
            'document': 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100',
            'security': 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
        };
        return styles[key] || 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
    }
};

export default function CategoryPills({
    categories,
    selectedCategories,
    onSelect,
    className
}: CategoryPillsProps) {
    return (
        <div className={cn("flex flex-wrap items-center gap-2 pb-1", className)}>
            <button
                onClick={() => onSelect("All")}
                className={cn(
                    "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
                    selectedCategories.length === 0
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                )}
            >
                All
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1 flex-shrink-0" />
            {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={cn(
                            "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
                            getCategoryColors(category, isSelected)
                        )}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
}
