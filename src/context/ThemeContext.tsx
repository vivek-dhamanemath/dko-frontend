"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const stored = localStorage.getItem("dko-theme") as Theme | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = stored || (prefersDark ? "dark" : "light");
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("dko-theme", next);
            document.documentElement.setAttribute("data-theme", next);
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
}
