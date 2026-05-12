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
    },
    {
        icon: Tag,
        title: "Tags & Categories",
        description: "Label every resource with tags and categories. Create a personal taxonomy that reflects how your mind works.",
    },
    {
        icon: Search,
        title: "Instant Search",
        description: "Full-text search across titles, URLs, tags, and notes. Find any resource in milliseconds, not minutes.",
    },
    {
        icon: FolderOpen,
        title: "Collections & Views",
        description: "Group resources into collections for projects, clients, or topics. Build a structured knowledge graph.",
    },
    {
        icon: Star,
        title: "Pin & Prioritize",
        description: "Pin your most important resources to keep them front and center. Never lose track of what matters most.",
    },
    {
        icon: Filter,
        title: "Advanced Filters",
        description: "Filter by source domain, date range, category, or tags. Slice and dice your knowledge base any way you need.",
    }
];

const steps = [
    {
        number: "01",
        icon: Link2,
        title: "Paste a URL, We Handle the Rest",
        description: "Drop any link into DKO. We auto-fetch the title, detect the source domain, and store it instantly. No copy-pasting titles, no manual work.",
    },
    {
        number: "02",
        icon: Tag,
        title: "Tag, Categorize & Assign",
        description: "Add tags, pick a category, write a note, and assign to a collection. Structure your knowledge exactly how you think.",
    },
    {
        number: "03",
        icon: Search,
        title: "Find Anything, Instantly",
        description: "Search full-text across everything. Filter by date, source, or category. Retrieve the exact resource you need the moment you need it.",
    }
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#f5f0eb]">

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-[#f5f0eb]/90 backdrop-blur-xl border-b border-[#ebe4db]">
                <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#1f1a14] flex items-center justify-center">
                            <span className="text-[#d9cfc2] font-bold text-sm" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>D</span>
                        </div>
                        <span className="text-lg font-bold text-[#1f1a14] tracking-tight">DKO</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-[#7d6e5c] hover:text-[#1f1a14] transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-[#7d6e5c] hover:text-[#1f1a14] transition-colors">How It Works</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-[#7d6e5c] hover:text-[#1f1a14] transition-colors px-4 py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm font-bold px-5 py-2.5 bg-[#1f1a14] hover:bg-[#3d3429] text-white rounded-lg transition-all flex items-center gap-1.5"
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
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#ebe4db] rounded-full blur-3xl opacity-50" />
                        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#d9cfc2] rounded-full blur-3xl opacity-30" />
                    </div>

                    <div className="relative max-w-6xl mx-auto px-6 md:px-8 pt-20 pb-16 md:pt-28 md:pb-20">

                        <div className="text-center max-w-3xl mx-auto mb-14">
                            {/* Eyebrow */}
                            <p className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-[0.2em] mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {"// developer-knowledge-organizer"}
                            </p>

                            {/* Headline */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl text-[#1f1a14] leading-[1.08] mb-6" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                                Your knowledge base.{" "}
                                <em>Organized.</em>{" "}
                                Always there.
                            </h1>

                            {/* Subtext */}
                            <p className="text-lg md:text-xl text-[#7d6e5c] leading-relaxed mb-10 max-w-2xl mx-auto">
                                Save URLs, articles, and resources from anywhere. Tag, categorize, and search your personal knowledge base — instantly, every time.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="px-8 py-4 bg-[#1f1a14] hover:bg-[#3d3429] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-base"
                                >
                                    Start for Free
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="px-8 py-4 bg-white border border-[#ebe4db] hover:border-[#d9cfc2] text-[#5c4f3f] font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-base hover:bg-[#faf8f5]"
                                >
                                    See How It Works
                                </a>
                            </div>
                        </div>

                        {/* ── Product UI Mockup ── */}
                        <div className="relative max-w-5xl mx-auto">
                            <div className="bg-white rounded-2xl border border-[#ebe4db] shadow-2xl shadow-[#1f1a14]/8 overflow-hidden">
                                {/* Browser chrome */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-[#faf8f5] border-b border-[#ebe4db]">
                                    <div className="w-3 h-3 rounded-full bg-[#d9cfc2]" />
                                    <div className="w-3 h-3 rounded-full bg-[#d9cfc2]" />
                                    <div className="w-3 h-3 rounded-full bg-[#d9cfc2]" />
                                    <div className="flex-1 mx-4">
                                        <div className="h-6 bg-white rounded-md border border-[#ebe4db] flex items-center px-3 gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#ebe4db]" />
                                            <span className="text-[10px] text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>app.dko.dev/dashboard</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dashboard content mock */}
                                <div className="flex bg-[#faf8f5]">
                                    {/* Sidebar mock */}
                                    <div className="w-52 bg-[#1f1a14] p-3 flex flex-col gap-1 min-h-[480px] flex-shrink-0 hidden md:flex">
                                        <div className="flex items-center gap-2 px-2 py-2 mb-2">
                                            <div className="w-6 h-6 rounded-md bg-[#3d3429] flex items-center justify-center">
                                                <span className="text-[#d9cfc2] font-bold text-[10px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>D</span>
                                            </div>
                                            <span className="text-sm font-bold text-[#d9cfc2]">DKO</span>
                                        </div>
                                        {[
                                            { label: "All Resources", active: true },
                                            { label: "Pinned", active: false },
                                            { label: "Archived", active: false },
                                        ].map(item => (
                                            <div key={item.label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${item.active ? 'bg-[#2d2520] text-[#d9cfc2]' : 'text-[#5c4f3f]'}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                                {item.label}
                                            </div>
                                        ))}
                                        <div className="mt-3 px-2">
                                            <p className="text-[9px] font-medium uppercase tracking-widest text-[#5c4f3f] mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Collections</p>
                                            {["Frontend", "Backend", "Design"].map(col => (
                                                <div key={col} className="flex items-center gap-2 px-2 py-1 rounded-md text-[11px] text-[#5c4f3f]">
                                                    <FolderOpen className="w-3 h-3" />
                                                    {col}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main area mock */}
                                    <div className="flex-1 p-3 overflow-hidden">
                                        {/* Search bar */}
                                        <div className="bg-white border border-[#ebe4db] rounded-lg h-9 flex items-center px-3 gap-2 mb-3">
                                            <Search className="w-3.5 h-3.5 text-[#b8aa98]" />
                                            <span className="text-[11px] text-[#b8aa98]">Search resources, tags, or URLs...</span>
                                        </div>

                                        {/* Bento grid */}
                                        <div className="grid grid-cols-12 gap-2.5">
                                            {/* Quick capture */}
                                            <div className="col-span-7 bg-white border border-[#ebe4db] rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 rounded-lg bg-[#1f1a14] flex items-center justify-center">
                                                        <Link2 className="w-3 h-3 text-[#d9cfc2]" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-[#1f1a14]">Quick Capture</span>
                                                </div>
                                                <div className="h-7 bg-[#faf8f5] rounded-lg border border-[#ebe4db] flex items-center px-2.5 gap-2">
                                                    <span className="text-[10px] text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>https://github.com/awesome-...</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                                                    <div className="h-5 bg-[#faf8f5] rounded-md border border-[#ebe4db]" />
                                                    <div className="h-5 bg-[#faf8f5] rounded-md border border-[#ebe4db]" />
                                                </div>
                                            </div>

                                            {/* Stats 2×2 */}
                                            <div className="col-span-5 grid grid-cols-2 gap-2">
                                                {[
                                                    { label: "Saved", value: "247", color: "text-[#1f1a14]" },
                                                    { label: "Pinned", value: "12", color: "text-[#1f1a14]" },
                                                    { label: "Categories", value: "8", color: "text-[#1f1a14]" },
                                                    { label: "Tags", value: "34", color: "text-[#1f1a14]" },
                                                ].map(stat => (
                                                    <div key={stat.label} className="bg-white border border-[#ebe4db] rounded-lg p-2 flex flex-col justify-between">
                                                        <p className="text-[8px] font-medium uppercase tracking-widest text-[#b8aa98]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{stat.label}</p>
                                                        <p className={`text-2xl font-semibold tabular-nums ${stat.color}`} style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{stat.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Category pills */}
                                            <div className="col-span-12 bg-white border border-[#ebe4db] rounded-lg px-3 py-2 flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 rounded-md bg-[#1f1a14] text-white text-[9px] font-bold">All</span>
                                                {["Frontend", "Backend", "DevOps", "Design"].map(cat => (
                                                    <span key={cat} className="px-2 py-0.5 rounded-md bg-white border border-[#ebe4db] text-[#7d6e5c] text-[9px] font-medium">{cat}</span>
                                                ))}
                                            </div>

                                            {/* Resource cards */}
                                            <div className="col-span-8 bg-white border border-[#ebe4db] rounded-lg overflow-hidden">
                                                <div className="flex items-center justify-between px-3 py-2 border-b border-[#ebe4db]">
                                                    <span className="text-[10px] font-bold text-[#1f1a14]">Resources</span>
                                                    <span className="px-1.5 py-0.5 bg-[#f5f0eb] text-[#5c4f3f] text-[8px] font-bold rounded-md border border-[#ebe4db]">247</span>
                                                </div>
                                                {[
                                                    { title: "React Query v5 Migration Guide", source: "tkdodo.eu", cat: "Frontend", tag: "react", pinned: true },
                                                    { title: "PostgreSQL Performance Tips", source: "postgresql.org", cat: "Backend", tag: "database", pinned: false },
                                                    { title: "Tailwind CSS v4 Documentation", source: "tailwindcss.com", cat: "Frontend", tag: "css", pinned: false },
                                                ].map((card, i) => (
                                                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 border-b border-[#f5f0eb] hover:bg-[#faf8f5]">
                                                        <div className="w-5 h-5 rounded-md bg-[#f5f0eb] flex-shrink-0 flex items-center justify-center">
                                                            <Globe className="w-2.5 h-2.5 text-[#b8aa98]" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-semibold text-[#1f1a14] truncate">{card.title}</p>
                                                            <p className="text-[9px] text-[#b8aa98] truncate">{card.source}</p>
                                                        </div>
                                                        {card.pinned && <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                                                        <span className="px-1.5 py-0.5 bg-[#f5f0eb] text-[#5c4f3f] text-[8px] font-bold rounded-md border border-[#ebe4db] flex-shrink-0">{card.cat}</span>
                                                        <span className="px-1.5 py-0.5 bg-[#faf8f5] text-[#9a8b78] text-[8px] rounded-md flex-shrink-0">#{card.tag}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Filter panel mock */}
                                            <div className="col-span-4 bg-white border border-[#ebe4db] rounded-lg p-2.5">
                                                <p className="text-[9px] font-bold text-[#5c4f3f] mb-2">Filters</p>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-[8px] font-medium text-[#9a8b78] uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Source</p>
                                                        {["github.com", "dev.to", "medium.com"].map(s => (
                                                            <div key={s} className="flex items-center gap-1.5 py-0.5">
                                                                <div className="w-2.5 h-2.5 rounded border border-[#d9cfc2]" />
                                                                <span className="text-[9px] text-[#7d6e5c]">{s}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-medium text-[#9a8b78] uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tags</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {["react", "api", "css", "node"].map(tag => (
                                                                <span key={tag} className="px-1.5 py-0.5 bg-[#faf8f5] border border-[#ebe4db] text-[#9a8b78] text-[8px] rounded-md">#{tag}</span>
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
                            <div className="absolute -left-4 top-1/3 bg-white border border-[#ebe4db] rounded-xl px-3.5 py-2.5 shadow-lg shadow-[#1f1a14]/5 hidden lg:flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#1f1a14]">Saved to DKO</p>
                                    <p className="text-[10px] text-[#b8aa98]">React Query v5 Guide</p>
                                </div>
                            </div>

                            <div className="absolute -right-4 top-1/4 bg-white border border-[#ebe4db] rounded-xl px-3.5 py-2.5 shadow-lg shadow-[#1f1a14]/5 hidden lg:flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#f5f0eb] border border-[#ebe4db] flex items-center justify-center">
                                    <Search className="w-4 h-4 text-[#5c4f3f]" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#1f1a14]">247 resources</p>
                                    <p className="text-[10px] text-[#b8aa98]">Instantly searchable</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Stats Bar ── */}
                <section className="border-y border-[#ebe4db] bg-white">
                    <div className="max-w-6xl mx-auto px-6 md:px-8 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: "< 2s", label: "Average save time", icon: Zap },
                                { value: "\u221E", label: "Resources, no limits", icon: BookOpen },
                                { value: "100%", label: "Private & yours alone", icon: Archive },
                                { value: "1 place", label: "For all your knowledge", icon: LayoutGrid },
                            ].map((stat) => (
                                <div key={stat.label} className="flex flex-col items-center text-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#f5f0eb] border border-[#ebe4db] flex items-center justify-center">
                                        <stat.icon className="w-5 h-5 text-[#5c4f3f]" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-semibold tabular-nums text-[#1f1a14]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{stat.value}</p>
                                        <p className="text-sm text-[#9a8b78] mt-0.5">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Features Section ── */}
                <section id="features" className="max-w-6xl mx-auto px-6 md:px-8 py-24">
                    <div className="text-center mb-16">
                        <p className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {"// everything you need"}
                        </p>
                        <h2 className="text-4xl md:text-5xl text-[#1f1a14] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                            Built for how developers <em>think.</em>
                        </h2>
                        <p className="text-lg text-[#7d6e5c] max-w-2xl mx-auto">
                            Every feature in DKO is designed to reduce friction and make your knowledge base feel like an extension of your brain.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group bg-white border border-[#ebe4db] rounded-lg p-6 hover:border-[#d9cfc2] hover:shadow-md hover:shadow-[#1f1a14]/5 transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#f5f0eb] border border-[#ebe4db] flex items-center justify-center mb-4 group-hover:bg-[#1f1a14] group-hover:border-[#1f1a14] transition-colors">
                                    <feature.icon className="w-5 h-5 text-[#5c4f3f] group-hover:text-[#d9cfc2] transition-colors" />
                                </div>
                                <h3 className="text-base font-bold text-[#1f1a14] mb-2">{feature.title}</h3>
                                <p className="text-sm text-[#7d6e5c] leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── How It Works ── */}
                <section id="how-it-works" className="bg-white border-y border-[#ebe4db]">
                    <div className="max-w-6xl mx-auto px-6 md:px-8 py-24">
                        <div className="text-center mb-16">
                            <p className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {"// simple by design"}
                            </p>
                            <h2 className="text-4xl md:text-5xl text-[#1f1a14] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                                How it <em>works.</em>
                            </h2>
                            <p className="text-lg text-[#7d6e5c] max-w-2xl mx-auto">
                                From zero to organized in three steps.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {steps.map((step, idx) => (
                                <div key={idx} className="relative">
                                    {idx < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-5 left-[calc(100%_-_12px)] w-8 h-px bg-[#d9cfc2] z-10" />
                                    )}
                                    <div className="bg-[#faf8f5] border border-[#ebe4db] rounded-lg p-6 h-full">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#1f1a14] flex items-center justify-center">
                                                <step.icon className="w-5 h-5 text-[#d9cfc2]" />
                                            </div>
                                            <span className="text-2xl text-[#ebe4db] tabular-nums" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{step.number}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-[#1f1a14] mb-2">{step.title}</h3>
                                        <p className="text-sm text-[#7d6e5c] leading-relaxed">{step.description}</p>
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
                            <p className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {"// capture"}
                            </p>
                            <h2 className="text-3xl md:text-4xl text-[#1f1a14] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                                Save anything from the web. <em>Instantly.</em>
                            </h2>
                            <p className="text-[#7d6e5c] leading-relaxed mb-6">
                                Paste a URL and DKO auto-fetches the title and source domain. Add a note, pick a category, drop some tags — or just save it raw. Your call, zero friction.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Auto-fetches page title on URL paste",
                                    "Detects source domain automatically",
                                    "Supports articles, docs, repos, tools — anything with a URL",
                                    "Add notes to capture context, not just the link"
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#5c4f3f]">
                                        <div className="w-1 h-1 rounded-full bg-[#1f1a14] flex-shrink-0 mt-2" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick capture visual */}
                        <div className="bg-white border border-[#ebe4db] rounded-lg shadow-lg shadow-[#1f1a14]/5 p-5">
                            <div className="mb-4 pb-4 border-b border-[#ebe4db]">
                                <h3 className="text-sm font-bold text-[#1f1a14]">Quick Capture</h3>
                                <p className="text-xs text-[#b8aa98] mt-0.5">Save a new resource with intelligent auto-fetching</p>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider block mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>URL</label>
                                    <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#ebe4db] rounded-lg px-4 py-2.5">
                                        <Link2 className="w-3.5 h-3.5 text-[#9a8b78]" />
                                        <span className="text-xs text-[#9a8b78]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>https://react.dev/learn/...</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider block mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Title</label>
                                    <div className="bg-white border border-[#1f1a14] rounded-lg px-4 py-2.5 ring-2 ring-[#1f1a14]/10">
                                        <span className="text-xs font-semibold text-[#1f1a14]">Thinking in React — React Docs</span>
                                        <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold border border-emerald-200">
                                            <Zap className="w-2.5 h-2.5" /> Auto-fetched
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider block mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Category</label>
                                        <div className="bg-white border border-[#ebe4db] rounded-lg px-4 py-2.5">
                                            <span className="text-xs text-[#5c4f3f]">Frontend</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-wider block mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tags</label>
                                        <div className="bg-white border border-[#ebe4db] rounded-lg px-4 py-2.5">
                                            <span className="text-xs text-[#9a8b78]">react, hooks, patterns</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-2.5 bg-[#1f1a14] hover:bg-[#3d3429] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                                    <Check className="w-3.5 h-3.5" />
                                    Save to Knowledge Base
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Feature Spotlight 2: Search & Filter ── */}
                <section className="bg-white border-y border-[#ebe4db]">
                    <div className="max-w-6xl mx-auto px-6 md:px-8 py-24">
                        <div className="grid md:grid-cols-2 gap-12 items-center">

                            {/* Filter panel visual */}
                            <div className="bg-[#faf8f5] border border-[#ebe4db] rounded-lg shadow-lg shadow-[#1f1a14]/5 overflow-hidden order-2 md:order-1">
                                {/* Search header */}
                                <div className="px-4 py-3 border-b border-[#ebe4db] bg-white">
                                    <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#ebe4db] rounded-lg px-3 py-2">
                                        <Search className="w-3.5 h-3.5 text-[#9a8b78]" />
                                        <span className="text-xs text-[#9a8b78]">postgresql performance</span>
                                        <span className="ml-auto text-[9px] text-[#d9cfc2]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ESC</span>
                                    </div>
                                </div>
                                {/* Results */}
                                <div className="divide-y divide-[#ebe4db]">
                                    {[
                                        { title: "PostgreSQL Performance Tips", source: "postgresql.org", cat: "Backend", pinned: true },
                                        { title: "pg_stat_statements Guide", source: "pganalyze.com", cat: "Backend", pinned: false },
                                        { title: "Indexing Strategy in Postgres", source: "use-the-index-luke.com", cat: "Backend", pinned: false },
                                    ].map((r, i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-white">
                                            <div className="w-7 h-7 rounded-lg bg-[#f5f0eb] flex-shrink-0 flex items-center justify-center">
                                                <Globe className="w-3.5 h-3.5 text-[#b8aa98]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-[#1f1a14] truncate">{r.title}</p>
                                                <p className="text-[10px] text-[#b8aa98]">{r.source}</p>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {r.pinned && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                                                <span className="px-1.5 py-0.5 bg-[#f5f0eb] text-[#5c4f3f] text-[8px] font-bold rounded-md border border-[#ebe4db]">{r.cat}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-3 bg-white border-t border-[#ebe4db] flex items-center gap-2">
                                    <span className="text-[10px] text-[#b8aa98]">Filtered by:</span>
                                    <span className="px-2 py-0.5 bg-[#f5f0eb] text-[#5c4f3f] text-[9px] font-bold rounded-md border border-[#ebe4db]">Backend</span>
                                    <span className="px-2 py-0.5 bg-[#faf8f5] text-[#9a8b78] text-[9px] rounded-md border border-[#ebe4db]">#database</span>
                                </div>
                            </div>

                            <div className="order-1 md:order-2">
                                <p className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {"// search & filter"}
                                </p>
                                <h2 className="text-3xl md:text-4xl text-[#1f1a14] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                                    Find exactly what you saved. <em>Every time.</em>
                                </h2>
                                <p className="text-[#7d6e5c] leading-relaxed mb-6">
                                    Search across titles, URLs, tags, and notes simultaneously. Layer on filters for source domain, date range, and category to cut through the noise instantly.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Full-text search across all resource fields",
                                        "Filter by source domain, date range, and category",
                                        "Multi-tag filtering with additive logic",
                                        "Sort by newest, oldest, or A\u2013Z"
                                    ].map(item => (
                                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#5c4f3f]">
                                            <div className="w-1 h-1 rounded-full bg-[#1f1a14] flex-shrink-0 mt-2" />
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
                    <div className="bg-[#1f1a14] rounded-2xl px-8 md:px-16 py-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-10 left-10 w-64 h-64 bg-[#3d3429] rounded-full blur-3xl opacity-40" />
                            <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#5c4f3f] rounded-full blur-3xl opacity-20" />
                        </div>
                        <div className="relative">
                            <p className="text-[10px] font-medium text-[#5c4f3f] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {"// get started today"}
                            </p>
                            <h2 className="text-4xl md:text-5xl text-[#d9cfc2] mb-5" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                                Stop losing your best <em>finds.</em>
                            </h2>
                            <p className="text-lg text-[#8a7e72] mb-10 max-w-xl mx-auto">
                                Every developer has lost a resource they really needed. DKO makes sure that never happens again.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="px-8 py-4 bg-white text-[#1f1a14] font-bold rounded-lg hover:bg-[#f5f0eb] transition-all flex items-center justify-center gap-2 text-base"
                                >
                                    Start for Free
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-8 py-4 bg-[#3d3429] hover:bg-[#5c4f3f] text-[#d9cfc2] font-bold rounded-lg transition-all border border-[#5c4f3f] text-base flex items-center justify-center"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-[#ebe4db] bg-white">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-10">
                        <div className="md:col-span-2">
                            <Link href="/" className="flex items-center gap-2.5 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-[#1f1a14] flex items-center justify-center">
                                    <span className="text-[#d9cfc2] font-bold text-sm" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>D</span>
                                </div>
                                <span className="text-lg font-bold text-[#1f1a14]">DKO</span>
                            </Link>
                            <p className="text-sm text-[#9a8b78] max-w-xs leading-relaxed">
                                Developer Knowledge Organizer — save, organize, and retrieve technical resources instantly.
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Product</p>
                            <ul className="space-y-2">
                                {[
                                    { label: "Features", href: "#features" },
                                    { label: "How It Works", href: "#how-it-works" },
                                    { label: "Sign In", href: "/login" },
                                    { label: "Get Started", href: "/register" },
                                ].map(link => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-[#7d6e5c] hover:text-[#1f1a14] transition-colors">{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-[#9a8b78] uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Legal</p>
                            <ul className="space-y-2">
                                {[
                                    { label: "Privacy Policy", href: "/privacy" },
                                    { label: "Terms of Service", href: "/terms" },
                                    { label: "Contact", href: "mailto:hello@dko.dev" },
                                ].map(link => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-sm text-[#7d6e5c] hover:text-[#1f1a14] transition-colors">{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-[#ebe4db] pt-6">
                        <p className="text-xs text-[#b8aa98] text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            © 2026 Developer Knowledge Organizer. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}
