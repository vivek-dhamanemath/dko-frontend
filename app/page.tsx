"use client";

import Link from "next/link";
import {
    Search, Tag, FolderOpen, Star, Link2, Filter,
    ArrowRight, Check, Zap, Globe, BookOpen, Archive,
    Pin, LayoutGrid, ChevronRight
} from "lucide-react";

const features = [
    {
        icon: Link2,
        title: "One-Click URL Capture",
        description: "Paste any URL and DKO instantly auto-fetches the title, metadata, and source. Save anything from the web in seconds.",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-100"
    },
    {
        icon: Tag,
        title: "Tags & Categories",
        description: "Label every resource with tags and categories. Create a personal taxonomy that reflects how your mind works.",
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100"
    },
    {
        icon: Search,
        title: "Instant Search",
        description: "Full-text search across titles, URLs, tags, and notes. Find any resource in milliseconds, not minutes.",
        color: "text-sky-600",
        bg: "bg-sky-50",
        border: "border-sky-100"
    },
    {
        icon: FolderOpen,
        title: "Collections & Views",
        description: "Group resources into collections for projects, clients, or topics. Build a structured knowledge graph.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
    },
    {
        icon: Star,
        title: "Pin & Prioritize",
        description: "Pin your most important resources to keep them front and center. Never lose track of what matters most.",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100"
    },
    {
        icon: Filter,
        title: "Advanced Filters",
        description: "Filter by source domain, date range, category, or tags. Slice and dice your knowledge base any way you need.",
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-100"
    }
];

const steps = [
    {
        number: "01",
        icon: Link2,
        title: "Paste a URL, We Handle the Rest",
        description: "Drop any link into DKO. We auto-fetch the title, detect the source domain, and store it instantly. No copy-pasting titles, no manual work.",
        color: "bg-indigo-600"
    },
    {
        number: "02",
        icon: Tag,
        title: "Tag, Categorize & Assign",
        description: "Add tags, pick a category, write a note, and assign to a collection. Structure your knowledge exactly how you think.",
        color: "bg-violet-600"
    },
    {
        number: "03",
        icon: Search,
        title: "Find Anything, Instantly",
        description: "Search full-text across everything. Filter by date, source, or category. Retrieve the exact resource you need the moment you need it.",
        color: "bg-emerald-600"
    }
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans">

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
                <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-black text-slate-900 tracking-tight">DKO</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm font-bold px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-sm shadow-indigo-500/20 flex items-center gap-1.5"
                        >
                            Get Started
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </nav>

            <main>

                {/* ── Hero Section ── */}
                <section className="relative overflow-hidden">
                    {/* Subtle background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative max-w-6xl mx-auto px-6 md:px-8 pt-20 pb-16 md:pt-28 md:pb-20">

                        <div className="text-center max-w-3xl mx-auto mb-14">
                            {/* Eyebrow */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Developer Knowledge Organizer</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.08] tracking-tight mb-6">
                                Your knowledge base.{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">
                                    Organized.
                                </span>{" "}
                                Always there.
                            </h1>

                            {/* Subtext */}
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
                                Save URLs, articles, and resources from anywhere. Tag, categorize, and search your personal knowledge base — instantly, every time.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-base"
                                >
                                    Start for Free
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-base hover:bg-slate-50"
                                >
                                    See How It Works
                                </a>
                            </div>
                        </div>

                        {/* ── Product UI Mockup ── */}
                        <div className="relative max-w-5xl mx-auto">
                            {/* Browser frame */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 overflow-hidden">
                                {/* Browser chrome */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                    <div className="flex-1 mx-4">
                                        <div className="h-6 bg-white rounded-md border border-slate-200 flex items-center px-3 gap-2">
                                            <div className="w-3 h-3 rounded-full bg-slate-200" />
                                            <span className="text-[10px] text-slate-400 font-mono">app.dko.dev/dashboard</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dashboard content mock */}
                                <div className="flex bg-slate-50">
                                    {/* Sidebar mock */}
                                    <div className="w-52 bg-slate-900 p-3 flex flex-col gap-1 min-h-[480px] flex-shrink-0 hidden md:flex">
                                        <div className="flex items-center gap-2 px-2 py-2 mb-2">
                                            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                                                <BookOpen className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="text-sm font-black text-white">DKO</span>
                                        </div>
                                        {[
                                            { label: "All Resources", active: true },
                                            { label: "Pinned", active: false },
                                            { label: "Archived", active: false },
                                        ].map(item => (
                                            <div key={item.label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${item.active ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-500'}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                                {item.label}
                                            </div>
                                        ))}
                                        <div className="mt-3 px-2">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1.5">Collections</p>
                                            {["Frontend", "Backend", "Design"].map(col => (
                                                <div key={col} className="flex items-center gap-2 px-2 py-1 rounded-md text-[11px] text-slate-500">
                                                    <FolderOpen className="w-3 h-3" />
                                                    {col}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main area mock */}
                                    <div className="flex-1 p-3 overflow-hidden">
                                        {/* Search bar */}
                                        <div className="bg-white border border-slate-200 rounded-xl h-9 flex items-center px-3 gap-2 mb-3">
                                            <Search className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-[11px] text-slate-400">Search resources, tags, or URLs...</span>
                                        </div>

                                        {/* Bento grid */}
                                        <div className="grid grid-cols-12 gap-2.5">
                                            {/* Quick capture */}
                                            <div className="col-span-7 bg-white border border-slate-200 rounded-xl p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                                                        <Link2 className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-900">Quick Capture</span>
                                                </div>
                                                <div className="h-7 bg-slate-100 rounded-lg border border-slate-200 flex items-center px-2.5 gap-2">
                                                    <span className="text-[10px] text-slate-400">https://github.com/awesome-...</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                                                    <div className="h-5 bg-slate-100 rounded-md border border-slate-200" />
                                                    <div className="h-5 bg-slate-100 rounded-md border border-slate-200" />
                                                </div>
                                            </div>

                                            {/* Stats 2×2 */}
                                            <div className="col-span-5 grid grid-cols-2 gap-2">
                                                {[
                                                    { label: "Saved", value: "247", color: "text-slate-900" },
                                                    { label: "Pinned", value: "12", color: "text-indigo-600" },
                                                    { label: "Categories", value: "8", color: "text-emerald-600" },
                                                    { label: "Tags", value: "34", color: "text-violet-600" },
                                                ].map(stat => (
                                                    <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col justify-between">
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                                        <p className={`text-2xl font-black tabular-nums ${stat.color}`}>{stat.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Category pills */}
                                            <div className="col-span-12 bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-bold">All</span>
                                                {["Frontend", "Backend", "DevOps", "Design"].map(cat => (
                                                    <span key={cat} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[9px] font-medium">{cat}</span>
                                                ))}
                                            </div>

                                            {/* Resource cards */}
                                            <div className="col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
                                                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                                                    <span className="text-[10px] font-black text-slate-900">Resources</span>
                                                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-bold rounded-full border border-indigo-100">247</span>
                                                </div>
                                                {[
                                                    { title: "React Query v5 Migration Guide", source: "tkdodo.eu", cat: "Frontend", tag: "react", pinned: true },
                                                    { title: "PostgreSQL Performance Tips", source: "postgresql.org", cat: "Backend", tag: "database", pinned: false },
                                                    { title: "Tailwind CSS v4 Documentation", source: "tailwindcss.com", cat: "Frontend", tag: "css", pinned: false },
                                                ].map((card, i) => (
                                                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 border-b border-slate-50 hover:bg-slate-50">
                                                        <div className="w-5 h-5 rounded-md bg-slate-100 flex-shrink-0 flex items-center justify-center">
                                                            <Globe className="w-2.5 h-2.5 text-slate-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-semibold text-slate-800 truncate">{card.title}</p>
                                                            <p className="text-[9px] text-slate-400 truncate">{card.source}</p>
                                                        </div>
                                                        {card.pinned && <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                                                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-bold rounded-md border border-indigo-100 flex-shrink-0">{card.cat}</span>
                                                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] rounded-md flex-shrink-0">#{card.tag}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Filter panel mock */}
                                            <div className="col-span-4 bg-white border border-slate-200 rounded-xl p-2.5">
                                                <p className="text-[9px] font-black text-slate-700 mb-2">Filters</p>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Source</p>
                                                        {["github.com", "dev.to", "medium.com"].map(s => (
                                                            <div key={s} className="flex items-center gap-1.5 py-0.5">
                                                                <div className="w-2.5 h-2.5 rounded border border-slate-300" />
                                                                <span className="text-[9px] text-slate-600">{s}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Tags</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {["react", "api", "css", "node"].map(tag => (
                                                                <span key={tag} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 text-[8px] rounded-md">#{tag}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badges */}
                            <div className="absolute -left-4 top-1/3 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-lg shadow-slate-900/8 hidden lg:flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900">Saved to DKO</p>
                                    <p className="text-[10px] text-slate-400">React Query v5 Guide</p>
                                </div>
                            </div>

                            <div className="absolute -right-4 top-1/4 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-lg shadow-slate-900/8 hidden lg:flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                                    <Search className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900">247 resources</p>
                                    <p className="text-[10px] text-slate-400">Instantly searchable</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Stats Bar ── */}
                <section className="border-y border-slate-200 bg-slate-50">
                    <div className="max-w-6xl mx-auto px-6 md:px-8 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: "< 2s", label: "Average save time", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
                                { value: "∞", label: "Resources, no limits", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
                                { value: "100%", label: "Private & yours alone", icon: Archive, color: "text-emerald-600", bg: "bg-emerald-50" },
                                { value: "1 place", label: "For all your knowledge", icon: LayoutGrid, color: "text-violet-600", bg: "bg-violet-50" },
                            ].map((stat) => (
                                <div key={stat.label} className="flex flex-col items-center text-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className={`text-3xl font-black tabular-nums ${stat.color}`}>{stat.value}</p>
                                        <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Features Section ── */}
                <section id="features" className="max-w-6xl mx-auto px-6 md:px-8 py-24">
                    <div className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Everything you need</p>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            Built for how developers think
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Every feature in DKO is designed to reduce friction and make your knowledge base feel like an extension of your brain.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className={`w-10 h-10 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4`}>
                                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                                </div>
                                <h3 className="text-base font-black text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── How It Works ── */}
                <section id="how-it-works" className="bg-slate-50 border-y border-slate-200">
                    <div className="max-w-6xl mx-auto px-6 md:px-8 py-24">
                        <div className="text-center mb-16">
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Simple by design</p>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                                How It Works
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                From zero to organized in three steps.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {steps.map((step, idx) => (
                                <div key={idx} className="relative">
                                    {idx < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-5 left-[calc(100%_-_12px)] w-8 h-px bg-slate-300 z-10" />
                                    )}
                                    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center shadow-sm`}>
                                                <step.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-2xl font-black text-slate-200 tabular-nums">{step.number}</span>
                                        </div>
                                        <h3 className="text-base font-black text-slate-900 mb-2">{step.title}</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Feature Spotlight 1: Quick Capture ── */}
                <section className="max-w-6xl mx-auto px-6 md:px-8 py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Capture</p>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                                Save anything from the web. Instantly.
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Paste a URL and DKO auto-fetches the title and source domain. Add a note, pick a category, drop some tags — or just save it raw. Your call, zero friction.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Auto-fetches page title on URL paste",
                                    "Detects source domain automatically",
                                    "Supports articles, docs, repos, tools — anything with a URL",
                                    "Add notes to capture context, not just the link"
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                                        <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-2.5 h-2.5 text-indigo-600" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick capture visual */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/5 p-5">
                            <div className="mb-4 pb-4 border-b border-slate-100">
                                <h3 className="text-sm font-black text-slate-900">Quick Capture</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Save a new resource with intelligent auto-fetching</p>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">URL</label>
                                    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5">
                                        <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                                        <span className="text-xs text-slate-500 font-mono">https://react.dev/learn/...</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Title</label>
                                    <div className="bg-white border border-indigo-400 rounded-xl px-4 py-2.5 ring-2 ring-indigo-500/10">
                                        <span className="text-xs font-semibold text-slate-900">Thinking in React — React Docs</span>
                                        <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold border border-emerald-200">
                                            <Zap className="w-2.5 h-2.5" /> Auto-fetched
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Category</label>
                                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                                            <span className="text-xs text-slate-700">Frontend</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Tags</label>
                                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                                            <span className="text-xs text-slate-500">react, hooks, patterns</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                    <Check className="w-3.5 h-3.5" />
                                    Save to Knowledge Base
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Feature Spotlight 2: Search & Filter ── */}
                <section className="bg-slate-50 border-y border-slate-200">
                    <div className="max-w-6xl mx-auto px-6 md:px-8 py-24">
                        <div className="grid md:grid-cols-2 gap-12 items-center">

                            {/* Filter panel visual */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/5 overflow-hidden order-2 md:order-1">
                                {/* Search header */}
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                                        <Search className="w-3.5 h-3.5 text-indigo-500" />
                                        <span className="text-xs text-slate-400">postgresql performance</span>
                                        <span className="ml-auto text-[9px] text-slate-300">⌘K</span>
                                    </div>
                                </div>
                                {/* Results */}
                                <div className="divide-y divide-slate-50">
                                    {[
                                        { title: "PostgreSQL Performance Tips", source: "postgresql.org", tags: ["database", "sql"], cat: "Backend", pinned: true },
                                        { title: "pg_stat_statements Guide", source: "pganalyze.com", tags: ["postgres", "monitoring"], cat: "Backend", pinned: false },
                                        { title: "Indexing Strategy in Postgres", source: "use-the-index-luke.com", tags: ["database", "index"], cat: "Backend", pinned: false },
                                    ].map((r, i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
                                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-800 truncate">{r.title}</p>
                                                <p className="text-[10px] text-slate-400">{r.source}</p>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {r.pinned && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold rounded-md border border-emerald-100">{r.cat}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400">Filtered by:</span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-full border border-emerald-200">Backend</span>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] rounded-full border border-slate-200">#database</span>
                                </div>
                            </div>

                            <div className="order-1 md:order-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Search & Filter</p>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                                    Find exactly what you saved. Every time.
                                </h2>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Search across titles, URLs, tags, and notes simultaneously. Layer on filters for source domain, date range, and category to cut through the noise instantly.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Full-text search across all resource fields",
                                        "Filter by source domain, date range, and category",
                                        "Multi-tag filtering with additive logic",
                                        "Sort by newest, oldest, or A–Z"
                                    ].map(item => (
                                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                                            <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-2.5 h-2.5 text-indigo-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Final CTA ── */}
                <section className="max-w-6xl mx-auto px-6 md:px-8 py-24">
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 rounded-3xl px-8 md:px-16 py-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <div className="relative">
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-4">Get started today</p>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">
                                Stop losing your best finds.
                            </h2>
                            <p className="text-lg text-indigo-200 mb-10 max-w-xl mx-auto">
                                Every developer has lost a resource they really needed. DKO makes sure that never happens again.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="px-8 py-4 bg-white text-indigo-600 font-black rounded-xl hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 text-base"
                                >
                                    Start for Free
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 text-base flex items-center justify-center"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-200 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-10">
                        <div className="md:col-span-2">
                            <Link href="/" className="flex items-center gap-2.5 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-black text-slate-900">DKO</span>
                            </Link>
                            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                                Developer Knowledge Organizer — save, organize, and retrieve technical resources instantly.
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Product</p>
                            <ul className="space-y-2">
                                {[
                                    { label: "Features", href: "#features" },
                                    { label: "How It Works", href: "#how-it-works" },
                                    { label: "Sign In", href: "/login" },
                                    { label: "Get Started", href: "/register" },
                                ].map(link => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Legal</p>
                            <ul className="space-y-2">
                                {[
                                    { label: "Privacy Policy", href: "/privacy" },
                                    { label: "Terms of Service", href: "/terms" },
                                    { label: "Contact", href: "mailto:hello@dko.dev" },
                                ].map(link => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 pt-6">
                        <p className="text-xs text-slate-400 text-center">
                            © 2026 Developer Knowledge Organizer. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}
