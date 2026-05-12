"use client";

import { cn } from "@/src/lib/utils";
import { getCategoryColorClasses, CategoryColorMap } from "@/src/services/categoryColorService";

interface CategoryPillsProps {
    categories: string[];
    selectedCategories: string[];
    onSelect: (category: string) => void;
    className?: string;
    categoryCounts?: Record<string, number>;
    totalCount?: number;
    categoryColors?: CategoryColorMap;
}

export default function CategoryPills({
    categories,
    selectedCategories,
    onSelect,
    className,
    categoryCounts,
    totalCount,
    categoryColors,
}: CategoryPillsProps) {
    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            <button
                onClick={() => onSelect("All")}
                className={cn(
                    "whitespace-nowrap px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all border",
                    selectedCategories.length === 0
                        ? "bg-[#1f1a14] text-white border-[#1f1a14]"
                        : "bg-white text-[#7d6e5c] border-[#ebe4db] hover:bg-[#faf8f5]"
                )}
            >
                All{totalCount !== undefined ? ` ${totalCount}` : ""}
            </button>
            <div className="h-4 w-px bg-[#ebe4db] mx-0.5 flex-shrink-0" />
            {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                const count = categoryCounts?.[category];
                return (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={cn(
                            "whitespace-nowrap px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all border",
                            isSelected
                                ? "bg-[#1f1a14] text-white border-[#1f1a14]"
                                : getCategoryColorClasses(categoryColors?.[category])
                        )}
                    >
                        {category}{count !== undefined ? ` ${count}` : ""}
                    </button>
                );
            })}
        </div>
    );
}
