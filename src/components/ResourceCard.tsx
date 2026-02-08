"use client";

import { useState } from "react";
import {
    ExternalLink,
    Bookmark,
    MoreHorizontal,
    Trash2,
    Edit3,
    Archive
} from "lucide-react";
import {
    GitHubIcon,
    YouTubeIcon,
    LinkedInIcon,
    WhatsAppIcon,
    MediumIcon,
    StackOverflowIcon,
    PerplexityIcon,
    DevToIcon,
    GoogleDocsIcon,
    GlobeIcon
} from "./icons/BrandIcons";

interface Resource {
    id: number;
    url: string;
    title: string;
    note: string;
    category: string;
    tags: string[];
    createdAt: string;
}

interface ResourceCardProps {
    resource: Resource;
}

const getSourceInfo = (url: string): { name: string; color: string; bgColor: string; icon: React.ElementType<{ className?: string }> } => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('github.com')) return {
        name: 'GitHub',
        color: 'text-white',
        bgColor: 'bg-[#24292e]',
        icon: GitHubIcon
    };
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return {
        name: 'YouTube',
        color: 'text-white',
        bgColor: 'bg-[#FF0000]',
        icon: YouTubeIcon
    };
    if (lowerUrl.includes('linkedin.com')) return {
        name: 'LinkedIn',
        color: 'text-white',
        bgColor: 'bg-[#0A66C2]',
        icon: LinkedInIcon
    };
    if (lowerUrl.includes('whatsapp.com') || lowerUrl.includes('wa.me') || lowerUrl.includes('web.whatsapp')) return {
        name: 'WhatsApp',
        color: 'text-white',
        bgColor: 'bg-[#25D366]',
        icon: WhatsAppIcon
    };
    if (lowerUrl.includes('medium.com')) return {
        name: 'Medium',
        color: 'text-white',
        bgColor: 'bg-[#000000]',
        icon: MediumIcon
    };
    if (lowerUrl.includes('stackoverflow.com')) return {
        name: 'Stack Overflow',
        color: 'text-white',
        bgColor: 'bg-[#F48024]',
        icon: StackOverflowIcon
    };
    if (lowerUrl.includes('docs.google.com')) return {
        name: 'Google Docs',
        color: 'text-white',
        bgColor: 'bg-[#4285F4]',
        icon: GoogleDocsIcon
    };
    if (lowerUrl.includes('dev.to')) return {
        name: 'Dev.to',
        color: 'text-white',
        bgColor: 'bg-[#0A0A0A]',
        icon: DevToIcon
    };
    if (lowerUrl.includes('perplexity.ai')) return {
        name: 'Perplexity',
        color: 'text-white',
        bgColor: 'bg-[#1FB8CD]',
        icon: PerplexityIcon
    };
    return {
        name: 'Article',
        color: 'text-white',
        bgColor: 'bg-indigo-500',
        icon: GlobeIcon
    };
};

const getHostname = (url: string): string => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return 'link';
    }
};

const getCategoryStyle = (category: string): string => {
    const styles: Record<string, string> = {
        'frontend': 'bg-sky-100 text-sky-700',
        'backend': 'bg-emerald-100 text-emerald-700',
        'devops': 'bg-violet-100 text-violet-700',
        'react': 'bg-blue-100 text-blue-700',
        'design': 'bg-pink-100 text-pink-700',
        'tutorial': 'bg-amber-100 text-amber-700',
        'documentation': 'bg-slate-100 text-slate-700',
    };
    return styles[category?.toLowerCase()] || 'bg-slate-100 text-slate-600';
};

export default function ResourceCard({ resource }: ResourceCardProps) {
    const [showActions, setShowActions] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const hostname = getHostname(resource.url);
    const sourceInfo = getSourceInfo(resource.url);
    const SourceIcon = sourceInfo.icon;

    const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    const ensureProtocol = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent redirect if clicking on buttons or their children, or anchor tags
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
            return;
        }
        window.open(ensureProtocol(resource.url), '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            onClick={handleCardClick}
            className="resource-card group cursor-pointer"
        >
            {/* Header Row */}
            <div className="flex items-start gap-3.5">
                {/* Source Icon */}
                <div className={`w-11 h-11 rounded-xl ${sourceInfo.bgColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <SourceIcon className={`w-5 h-5 ${sourceInfo.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <a
                        href={ensureProtocol(resource.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[15px] font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {resource.title}
                    </a>
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-xs">
                        <span className="truncate max-w-[120px]">{hostname}</span>
                        <span>•</span>
                        <span>{formattedDate}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`p-1.5 rounded-lg transition-all ${isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowActions(!showActions)}
                            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all ${showActions ? 'bg-slate-100 text-slate-600' : ''}`}
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {showActions && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1 animate-fade-in">
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                    <Archive className="w-3.5 h-3.5" />
                                    Archive
                                </button>
                                <div className="h-px bg-slate-100 my-1" />
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Note/Description */}
            {resource.note && (
                <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {resource.note}
                </p>
            )}

            {/* Tags Footer */}
            <div className="flex items-center flex-wrap gap-1.5 mt-4 pt-3.5 border-t border-slate-100">
                {/* Source Badge */}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${sourceInfo.bgColor} ${sourceInfo.color}`}>
                    {sourceInfo.name}
                </span>

                {/* Category Badge */}
                {resource.category && (
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${getCategoryStyle(resource.category)}`}>
                        {resource.category}
                    </span>
                )}

                {/* Tags */}
                {resource.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer">
                        #{tag}
                    </span>
                ))}

                {resource.tags && resource.tags.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                        +{resource.tags.length - 2}
                    </span>
                )}

                {/* External Link - Right Side */}
                <a
                    href={ensureProtocol(resource.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 transition-colors" />
                </a>
            </div>
        </div>
    );
}