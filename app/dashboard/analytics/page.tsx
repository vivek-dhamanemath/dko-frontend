"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Activity,
    Globe,
    Github,
    Youtube,
    BookOpen,
    Loader2
} from "lucide-react";

interface Resource {
    id: string; // Changed to string to match UUID
    url: string;
    title: string;
    category: string;
    tags: string[];
    createdAt: string;
}

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        thisMonth: 0,
        categories: [] as { name: string; count: number; percentage: number }[],
        sources: [] as { name: string; count: number; icon: any; color: string }[],
        topTags: [] as { name: string; count: number }[]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await api.get("/resources");
            console.log("Analytics Data:", response.data); // Debug logging
            const resources: Resource[] = Array.isArray(response.data) ? response.data : [];
            processStats(resources);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const processStats = (resources: Resource[]) => {
        const total = resources.length;

        // This Month
        const now = new Date();
        const thisMonth = resources.filter(r => {
            const d = new Date(r.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        // Categories
        const catCounts: Record<string, number> = {};
        resources.forEach(r => {
            // Normalize category: trim whitespace and handle empty/null
            const cat = r.category?.trim() ? r.category.trim() : 'Uncategorized';
            catCounts[cat] = (catCounts[cat] || 0) + 1;
        });

        const categories = Object.entries(catCounts)
            .map(([name, count]) => ({
                name,
                count,
                percentage: Math.round((count / total) * 100)
            }))
            .sort((a, b) => b.count - a.count)
            // Show top 8 categories instead of 5 to include more user data
            .slice(0, 8);

        // Sources
        const sourceCounts: Record<string, number> = {};
        resources.forEach(r => {
            const url = r.url.toLowerCase();
            let source = 'Other';
            if (url.includes('github.com')) source = 'GitHub';
            else if (url.includes('youtube.com') || url.includes('youtu.be')) source = 'YouTube';
            else if (url.includes('medium.com') || url.includes('dev.to')) source = 'Articles';
            else if (url.includes('docs') || url.includes('documentation')) source = 'Documentation';

            sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });

        const sources = [
            { name: 'GitHub', count: sourceCounts['GitHub'] || 0, icon: Github, color: 'bg-slate-900 text-white' },
            { name: 'YouTube', count: sourceCounts['YouTube'] || 0, icon: Youtube, color: 'bg-red-600 text-white' },
            { name: 'Articles', count: sourceCounts['Articles'] || 0, icon: BookOpen, color: 'bg-emerald-500 text-white' },
            { name: 'Other', count: sourceCounts['Other'] || 0, icon: Globe, color: 'bg-blue-500 text-white' },
        ].filter(s => s.count > 0).sort((a, b) => b.count - a.count);

        // Tags
        const tagCounts: Record<string, number> = {};
        resources.flatMap(r => r.tags || []).forEach(t => {
            tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
        const topTags = Object.entries(tagCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        setStats({ total, thisMonth, categories, sources, topTags });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Analytics Overview</h1>
                <p className="text-slate-500">Insights into your knowledge base growth and distribution</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Resources</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</h3>
                        <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm font-medium">
                            <TrendingUp className="w-4 h-4" />
                            <span>Lifetime</span>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 p-6 opacity-5">
                        <BarChart3 className="w-24 h-24" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Added This Month</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.thisMonth}</h3>
                        <div className="flex items-center gap-1 mt-2 text-indigo-600 text-sm font-medium">
                            <Activity className="w-4 h-4" />
                            <span>Active Growth</span>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 p-6 opacity-5">
                        <PieChart className="w-24 h-24" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden col-span-1 md:col-span-2">
                    <div className="relative z-10">
                        <h3 className="text-lg font-semibold opacity-90">Most Active Category</h3>
                        <div className="mt-4 flex items-end gap-3">
                            <span className="text-4xl font-bold">{stats.categories[0]?.name || 'N/A'}</span>
                            <span className="mb-1 opacity-75">{stats.categories[0]?.count || 0} resources</span>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <Activity className="w-48 h-48 -mr-10 -mb-10" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-6">Category Distribution</h3>
                    <div className="space-y-4">
                        {stats.categories.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-medium text-slate-700">{cat.name}</span>
                                    <span className="text-slate-500">{cat.count} ({cat.percentage}%)</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full"
                                        style={{ width: `${cat.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Sources */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-6">Top Sources</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stats.sources.map((source) => {
                            const Icon = source.icon;
                            return (
                                <div key={source.name} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${source.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{source.name}</p>
                                        <p className="text-sm text-slate-500">{source.count} resources</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tag Cloud */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-6">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {stats.topTags.map((tag) => (
                        <div key={tag.name} className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm font-medium text-slate-600 transition-colors cursor-default">
                            #{tag.name}
                            <span className="ml-2 opacity-50 text-xs">{tag.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
