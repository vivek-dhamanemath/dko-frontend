import { api } from "@/src/lib/api";

export type CategoryColorMap = Record<string, string>;

export const categoryColorService = {
    getAll: async (): Promise<CategoryColorMap> => {
        const response = await api.get<CategoryColorMap>("/category-colors");
        return response.data;
    },

    setColor: async (category: string, color: string): Promise<CategoryColorMap> => {
        const response = await api.put<CategoryColorMap>("/category-colors", { category, color });
        return response.data;
    },
};

// Full palette of 20 Tailwind-compatible colors
export const CATEGORY_COLORS = [
    // Warm
    { name: "Red", value: "red", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    { name: "Orange", value: "orange", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    { name: "Amber", value: "amber", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    { name: "Yellow", value: "yellow", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    { name: "Rose", value: "rose", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    { name: "Pink", value: "pink", bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
    { name: "Lime", value: "lime", bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-200" },
    // Cool
    { name: "Sky", value: "sky", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
    { name: "Blue", value: "blue", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    { name: "Indigo", value: "indigo", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    { name: "Teal", value: "teal", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
    { name: "Cyan", value: "cyan", bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
    { name: "Emerald", value: "emerald", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    { name: "Green", value: "green", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    // Accent
    { name: "Violet", value: "violet", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
    { name: "Purple", value: "purple", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    { name: "Fuchsia", value: "fuchsia", bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-200" },
    { name: "Slate", value: "slate", bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
    { name: "Stone", value: "stone", bg: "bg-stone-50", text: "text-stone-700", border: "border-stone-200" },
    { name: "Gray", value: "gray", bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
];

// Swatch dot colors for the picker (centralized)
export const CATEGORY_COLOR_DOTS: Record<string, string> = {
    red: "bg-red-400",
    orange: "bg-orange-400",
    amber: "bg-amber-400",
    yellow: "bg-yellow-400",
    rose: "bg-rose-400",
    pink: "bg-pink-400",
    lime: "bg-lime-400",
    sky: "bg-sky-400",
    blue: "bg-blue-400",
    indigo: "bg-indigo-400",
    teal: "bg-teal-400",
    cyan: "bg-cyan-400",
    emerald: "bg-emerald-400",
    green: "bg-green-400",
    violet: "bg-violet-400",
    purple: "bg-purple-400",
    fuchsia: "bg-fuchsia-400",
    slate: "bg-slate-400",
    stone: "bg-stone-400",
    gray: "bg-gray-400",
};

// Grouped colors for the inline picker display
export const CATEGORY_COLOR_GROUPS = [
    { label: "WARM", colors: ["red", "orange", "amber", "yellow", "rose", "pink", "lime"] },
    { label: "COOL", colors: ["sky", "blue", "indigo", "teal", "cyan", "emerald", "green"] },
    { label: "ACCENT", colors: ["violet", "purple", "fuchsia", "slate", "stone", "gray"] },
];

export function getCategoryColorClasses(colorValue: string | undefined) {
    const found = CATEGORY_COLORS.find(c => c.value === colorValue);
    if (found) return `${found.bg} ${found.text} ${found.border}`;
    return "bg-[#f5f0eb] text-[#5c4f3f] border-[#ebe4db]";
}
