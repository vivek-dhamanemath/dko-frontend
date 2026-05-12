"use client";

import { Check } from "lucide-react";
import {
    CATEGORY_COLORS,
    CATEGORY_COLOR_DOTS,
    CATEGORY_COLOR_GROUPS,
    getCategoryColorClasses,
} from "@/src/services/categoryColorService";

interface CategoryColorPickerProps {
    category: string;
    currentColor?: string;
    onSelect: (color: string) => void;
    /** When true, removes the top border/margin (for use inside a pre-bordered container) */
    standalone?: boolean;
}

export default function CategoryColorPicker({ category, currentColor, onSelect, standalone }: CategoryColorPickerProps) {
    const previewClasses = getCategoryColorClasses(currentColor);

    return (
        <div className={standalone ? "animate-fade-in" : "mt-3 pt-3 border-t border-[#ebe4db] animate-fade-in"}>
            {/* Heading + live preview */}
            <div className="flex items-center justify-between mb-3">
                <p
                    className="text-[10px] font-semibold text-[#9a8b78] uppercase tracking-widest"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    Choose color for &ldquo;{category}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                    <span
                        className="text-[9px] text-[#b8aa98] uppercase tracking-wider"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        Preview
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-md border ${previewClasses}`}>
                        {category}
                    </span>
                </div>
            </div>

            {/* Color groups */}
            {CATEGORY_COLOR_GROUPS.map((group) => (
                <div key={group.label} className="mb-2.5 last:mb-0">
                    <p
                        className="text-[9px] font-medium text-[#b8aa98] tracking-widest mb-1.5"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        {group.label}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {group.colors.map((colorValue) => {
                            const isSelected = currentColor === colorValue;
                            const colorEntry = CATEGORY_COLORS.find(c => c.value === colorValue);
                            const dotClass = CATEGORY_COLOR_DOTS[colorValue] || "bg-gray-400";

                            return (
                                <button
                                    key={colorValue}
                                    type="button"
                                    onClick={() => onSelect(colorValue)}
                                    className={`w-7 h-7 rounded-md ${dotClass} flex items-center justify-center transition-all hover:scale-110 hover:shadow-md ${
                                        isSelected ? "ring-2 ring-offset-1 ring-[#1f1a14]" : ""
                                    }`}
                                    title={colorEntry?.name || colorValue}
                                >
                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
