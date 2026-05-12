import { useState, useCallback, useEffect } from "react";
import { categoryColorService, CategoryColorMap } from "@/src/services/categoryColorService";

export function useCategoryColors() {
    const [categoryColors, setCategoryColors] = useState<CategoryColorMap>({});

    const loadCategoryColors = useCallback(async () => {
        try {
            const data = await categoryColorService.getAll();
            setCategoryColors(data);
        } catch (err) {
            console.error("Failed to load category colors:", err);
        }
    }, []);

    useEffect(() => { loadCategoryColors(); }, [loadCategoryColors]);

    const setCategoryColor = useCallback(async (category: string, color: string) => {
        try {
            const updated = await categoryColorService.setColor(category, color);
            setCategoryColors(updated);
        } catch (err) {
            console.error("Failed to set category color:", err);
        }
    }, []);

    return { categoryColors, setCategoryColor, loadCategoryColors };
}
