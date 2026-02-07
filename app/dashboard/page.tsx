"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Resource {
    id: number;
    url: string;
    title: string;
    note: string;
    category: string;
    tags: string[];
    createdAt: string;
}

export default function Dashboard() {
    const router = useRouter();

    // Form State
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    // Data State
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Stats
    const [stats, setStats] = useState({ total: 0, topTags: [] as string[] });

    useEffect(() => {
        loadResources();

        // Click outside to collapse
        function handleClickOutside(event: MouseEvent) {
            if (formRef.current && !formRef.current.contains(event.target as Node) && !url && !title) {
                setIsExpanded(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [url, title]);

    // Calculate stats when resources change
    useEffect(() => {
        const allTags = resources.flatMap(r => r.tags || []);
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([tag]) => tag);

        setStats({
            total: resources.length,
            topTags
        });
    }, [resources]);

    const loadResources = async () => {
        try {
            setLoading(true);
            const response = await api.get("/resources");
            setResources(response.data);
        } catch (err: any) {
            console.error("Failed to load resources:", err);
            setError("Failed to load resources");
        } finally {
            setLoading(false);
        }
    };

    const save = async () => {
        if (!url) {
            setError("URL is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Auto-generate title if missing
            const finalTitle = title || new URL(url).hostname;

            await api.post("/resources", {
                url,
                title: finalTitle,
                note,
                category,
                tags: tags.split(",").map(t => t.trim()).filter(t => t)
            });

            setSuccessMessage("Saved to Knowledge Hub");
            setTimeout(() => setSuccessMessage(""), 3000);

            // Reset form
            setUrl("");
            setTitle("");
            setNote("");
            setCategory("");
            setTags("");
            setIsExpanded(false);

            await loadResources();
        } catch (err: any) {
            console.error("Failed to save:", err);
            setError(err.response?.data?.message || "Failed to save resource");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/login');
    };

    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return null;
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'react': 'bg-blue-100/50 text-blue-700 border-blue-200',
            'backend': 'bg-emerald-100/50 text-emerald-700 border-emerald-200',
            'devops': 'bg-violet-100/50 text-violet-700 border-violet-200',
            'frontend': 'bg-sky-100/50 text-sky-700 border-sky-200',
            'design': 'bg-pink-100/50 text-pink-700 border-pink-200',
        };
        const key = category?.toLowerCase() || '';
        return colors[key] || 'bg-gray-100 text-gray-600 border-gray-200';
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans">
            {/* 
        TOP NAVIGATION 
        - Enterprise feel: Neutral background, subtle borders, focus on search 
      */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-12 flex-1">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">DK</div>
                        <span className="font-semibold text-gray-900 tracking-tight">KnowHub</span>
                    </div>

                    {/* Search Bar - Center Aligned */}
                    <div className="relative max-w-md w-full hidden md:block group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</span>
                        <span className="text-sm font-bold text-gray-900">{resources.length}</span>
                    </div>

                    <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors" onClick={handleLogout}>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                            ME
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* CENTER COLUMN - Quick Capture & Feed */}
                <div className="lg:col-span-8 space-y-8">

                    {/* QUICK CAPTURE CARD - The "Workspace" Feel */}
                    <div
                        ref={formRef}
                        className={`bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'ring-2 ring-indigo-500/10 shadow-md' : 'hover:border-gray-300'}`}
                    >
                        <div className="p-1">
                            <input
                                type="text"
                                placeholder="Paste link here to capture..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onFocus={() => setIsExpanded(true)}
                                className="w-full px-5 py-4 text-lg font-medium text-gray-900 placeholder-gray-400 bg-transparent border-none focus:ring-0 focus:outline-none"
                            />
                        </div>

                        {/* Expandable Section */}
                        <div className={`px-6 pb-6 space-y-5 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 hidden'}`}>
                            <div className="h-px bg-gray-100 -mx-6 mb-4"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Resource title (optional)"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="e.g. Design, Dev"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tags</label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="comma, separated"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add context..."
                                        rows={2}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-gray-400">Press ⌘+Enter to save</span>
                                <button
                                    onClick={save}
                                    disabled={loading || !url}
                                    className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
                                >
                                    {loading ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : null}
                                    Save Resource
                                </button>
                            </div>
                        </div>

                        {/* Error/Success Feedback Inline */}
                        {(error || successMessage) && (
                            <div className={`px-6 py-3 text-sm font-medium ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {error || successMessage}
                            </div>
                        )}
                    </div>

                    {/* RESOURCE FEED - Improved Scan-ability */}
                    <div className="space-y-4">
                        {filteredResources.length === 0 && !loading ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                                <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900">No resources found</h3>
                                <p className="text-sm text-gray-500 mt-1">Try a different search or add a new one.</p>
                            </div>
                        ) : (
                            filteredResources.map((resource, idx) => (
                                <div
                                    key={resource.id}
                                    className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-5 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    {/* Icon Column */}
                                    <div className="hidden md:flex flex-col items-center pt-1">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={getFaviconUrl(resource.url) || ''}
                                                onError={(e) => (e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMiAxMmgyMCIvPjxwYXRoIGQ9Ik0xMiAyYTE1LjMgMTUuMyAwIDAgMSA0IDEwIDE1LjMgMTUuMyAwIDAgMS00IDEwIDE1LjMgMTUuMyAwIDAgMS00LTEwIDE1LjMgMTUuMyAwIDAgMSA0LTEweiIvPjwvc3ZnPg==')}
                                                alt="icon"
                                                className="w-5 h-5 opacity-80"
                                            />
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {resource.title}
                                                    </a>
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                    <span className="truncate max-w-[200px] hover:text-gray-700">{new URL(resource.url).hostname}</span>
                                                    {resource.category && (
                                                        <>
                                                            <span>•</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryColor(resource.category)}`}>
                                                                {resource.category}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Top Right Actions / Date */}
                                            <div className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap pt-1">
                                                {new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>

                                        {resource.note && (
                                            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-3xl">
                                                {resource.note}
                                            </p>
                                        )}

                                        {/* Tags Footer */}
                                        {resource.tags && resource.tags.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {resource.tags.map(tag => (
                                                    <span key={tag} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT SIDEBAR - Stats & Info */}
                <div className="hidden lg:block lg:col-span-4 space-y-8">

                    <div className="sticky top-24 space-y-8">
                        {/* Stats Widget */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Overview</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Total Resources</span>
                                    <span className="text-sm font-semibold text-gray-900">{stats.total}</span>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div>
                                    <span className="text-xs text-gray-400 mb-2 block">Top Tags</span>
                                    <div className="flex flex-wrap gap-2">
                                        {stats.topTags.length > 0 ? (
                                            stats.topTags.map(tag => (
                                                <span key={tag} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No tags yet</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="bg-gradient-to-br from-indigo-900 to-gray-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                            <h4 className="text-sm font-bold mb-2 relative z-10">Pro Tip</h4>
                            <p className="text-sm text-gray-300 relative z-10 leading-relaxed">
                                Use tags to organize resources by project or technology.
                                Search works across titles, URLs, and tags instantly.
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400">
                                © 2026 KnowHub Workspace
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
