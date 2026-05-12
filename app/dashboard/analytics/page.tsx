"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { Resource, resourceService } from "@/src/services/resourceService";
import {
    BarChart3,
    TrendingUp,
    Activity,
    Globe,
    Loader2,
    Archive,
    Trash2
} from "lucide-react";

interface Stats {
    lifetime: number;
    active: number;
    archived: number;
    deleted: number;
}

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [serverStats, setServerStats] = useState<Stats>({ lifetime: 0, active: 0, archived: 0, deleted: 0 });
    const [stats, setStats] = useState({
        thisMonth: 0,
        categories: [] as { name: string; count: number; percentage: number }[],
        sources: [] as { name: string; count: number; color: string }[],
        topTags: [] as { name: string; count: number }[],
        weeklyActivity: [] as { week: string; count: number }[],
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const statsData = await resourceService.getStats();
            setServerStats(statsData);

            const response = await api.get("/resources");
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
        const now = new Date();

        const thisMonth = resources.filter(r => {
            const d = new Date(r.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        // Categories
        const catCounts: Record<string, number> = {};
        resources.forEach(r => {
            const cat = r.category?.trim() ? r.category.trim() : "Uncategorized";
            catCounts[cat] = (catCounts[cat] || 0) + 1;
        });
        const categories = Object.entries(catCounts)
            .map(([name, count]) => ({ name, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        // Sources
        const sourceCounts: Record<string, number> = {};
        resources.forEach(r => {
            const url = r.url.toLowerCase();
            let source = "Other";
            if (url.includes("github.com")) source = "GitHub";
            else if (url.includes("youtube.com") || url.includes("youtu.be")) source = "YouTube";
            else if (url.includes("medium.com") || url.includes("dev.to")) source = "Articles";
            else if (url.includes("docs") || url.includes("documentation")) source = "Docs";
            sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });
        const sources = Object.entries(sourceCounts)
            .map(([name, count]) => ({ name, count, color: name === "GitHub" ? "bg-[#1f1a14]" : name === "YouTube" ? "bg-red-600" : name === "Articles" ? "bg-emerald-600" : "bg-[#9a8b78]" }))
            .filter(s => s.count > 0)
            .sort((a, b) => b.count - a.count);

        // Tags
        const tagCounts: Record<string, number> = {};
        resources.flatMap(r => r.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
        const topTags = Object.entries(tagCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);

        // Weekly activity (last 12 weeks)
        const weeklyActivity: { week: string; count: number }[] = [];
        for (let i = 11; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - i * 7);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);
            const count = resources.filter(r => {
                const d = new Date(r.createdAt);
                return d >= weekStart && d < weekEnd;
            }).length;
            weeklyActivity.push({
                week: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                count,
            });
        }

        setStats({ thisMonth, categories, sources, topTags, weeklyActivity });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-6 h-6 text-[#9a8b78] animate-spin" />
            </div>
        );
    }

    const maxWeekly = Math.max(...stats.weeklyActivity.map(w => w.count), 1);

    return (
        <div className="px-6 lg:px-8 py-5 max-w-[1600px] mx-auto w-full space-y-6">

            {/* Breadcrumb */}
            <div>
                <span className="text-[10px] text-[#b8aa98] tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    DASHBOARD / ANALYTICS
                </span>
            </div>

            {/* Heading */}
            <div>
                <h1 className="text-[2rem] leading-tight text-[#1f1a14] mb-1" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    What you&apos;re actually <em>saving.</em>
                </h1>
                <span className="text-[11px] text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    // INSIGHTS INTO YOUR KNOWLEDGE BASE
                </span>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "LIFETIME", value: serverStats.lifetime, sub: "Total created", icon: BarChart3, color: "text-[#1f1a14]" },
                    { label: "ACTIVE", value: serverStats.active, sub: "In knowledge base", icon: Activity, color: "text-emerald-600" },
                    { label: "ARCHIVED", value: serverStats.archived, sub: "Cold storage", icon: Archive, color: "text-amber-600" },
                    { label: "TRASH", value: serverStats.deleted, sub: "Recoverable", icon: Trash2, color: "text-red-500" },
                ].map((card) => (
                    <div key={card.label} className="bg-white border border-[#ebe4db] rounded-lg p-5">
                        <p className="text-[10px] text-[#b8aa98] tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{card.label}</p>
                        <h3 className="text-3xl font-semibold text-[#1f1a14]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{card.value}</h3>
                        <div className={`flex items-center gap-1 mt-1.5 text-[11px] font-medium ${card.color}`}>
                            <card.icon className="w-3.5 h-3.5" />
                            <span>{card.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#1f1a14] p-6 rounded-lg text-white">
                    <p className="text-[10px] text-[#8a7e72] tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>MOST ACTIVE CATEGORY</p>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-semibold" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{stats.categories[0]?.name || "N/A"}</span>
                        <span className="mb-1 text-[#8a7e72] text-[13px]">{stats.categories[0]?.count || 0} resources</span>
                    </div>
                </div>
                <div className="bg-[#1f1a14] p-6 rounded-lg text-white">
                    <p className="text-[10px] text-[#8a7e72] tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ADDED THIS MONTH</p>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-semibold" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{stats.thisMonth}</span>
                        <span className="mb-1 text-[#8a7e72] text-[13px]">new resources</span>
                    </div>
                </div>
            </div>

            {/* Activity chart */}
            <div className="bg-white border border-[#ebe4db] rounded-lg p-5">
                <h3 className="text-[13px] font-semibold text-[#1f1a14] mb-4">Activity — Last 12 Weeks</h3>
                <div className="flex items-end gap-1.5 h-32">
                    {stats.weeklyActivity.map((week, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className="w-full bg-[#1f1a14] rounded-sm transition-all hover:bg-[#3d3429] min-h-[2px]"
                                style={{ height: `${(week.count / maxWeekly) * 100}%` }}
                                title={`${week.week}: ${week.count} resources`}
                            />
                            {i % 3 === 0 && (
                                <span className="text-[8px] text-[#b8aa98] whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{week.week}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <div className="bg-white border border-[#ebe4db] rounded-lg p-5">
                    <h3 className="text-[13px] font-semibold text-[#1f1a14] mb-4">Category Distribution</h3>
                    <div className="space-y-3">
                        {stats.categories.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-[12px] mb-1">
                                    <span className="font-medium text-[#5c4f3f]">{cat.name}</span>
                                    <span className="text-[#9a8b78]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{cat.count} ({cat.percentage}%)</span>
                                </div>
                                <div className="w-full h-2 bg-[#f5f0eb] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#1f1a14] rounded-full transition-all" style={{ width: `${cat.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Sources */}
                <div className="bg-white border border-[#ebe4db] rounded-lg p-5">
                    <h3 className="text-[13px] font-semibold text-[#1f1a14] mb-4">Top Sources</h3>
                    <div className="space-y-3">
                        {stats.sources.map((source) => (
                            <div key={source.name} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold ${source.color}`}>
                                    {source.name.slice(0, 2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium text-[#1f1a14]">{source.name}</p>
                                    <div className="w-full h-1.5 bg-[#f5f0eb] rounded-full overflow-hidden mt-1">
                                        <div className={`h-full rounded-full ${source.color}`} style={{ width: `${(source.count / (stats.sources[0]?.count || 1)) * 100}%` }} />
                                    </div>
                                </div>
                                <span className="text-[12px] text-[#9a8b78] font-medium tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{source.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white border border-[#ebe4db] rounded-lg p-5">
                <h3 className="text-[13px] font-semibold text-[#1f1a14] mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {stats.topTags.map((tag) => (
                        <div key={tag.name} className="px-3 py-1.5 bg-[#f5f0eb] hover:bg-[#ebe4db] rounded-md text-[12px] font-medium text-[#5c4f3f] transition-colors cursor-default border border-[#ebe4db]">
                            #{tag.name}
                            <span className="ml-2 text-[#b8aa98] text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{tag.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
