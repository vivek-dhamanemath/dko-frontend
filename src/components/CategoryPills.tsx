"use client";

import { cn } from "@/src/lib/utils";

interface CategoryPillsProps {
    categories: string[];
    selectedCategories: string[];
    onSelect: (category: string) => void;
    className?: string;
}

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
                    "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                    selectedCategories.length === 0
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800"
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
                            "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                            isSelected
                                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                        )}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
}
