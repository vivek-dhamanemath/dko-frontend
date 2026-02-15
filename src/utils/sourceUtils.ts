import React from 'react';
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
    RedditIcon,
    TwitterIcon,
    NotionIcon,
    FigmaIcon,
    SubstackIcon,
    ProductHuntIcon,
    WikipediaIcon,
    GlobeIcon
} from '../components/icons/BrandIcons';

export interface SourceConfig {
    id: string;
    name: string;
    domains: string[];
    color: string;
    bgColor: string;
    icon: React.ElementType<{ className?: string }>;
    labelIcon: string; // Emoji for filter panel
}

export const SOURCES: SourceConfig[] = [
    {
        id: 'github',
        name: 'GitHub',
        domains: ['github.com'],
        color: 'text-white',
        bgColor: 'bg-[#24292e]',
        icon: GitHubIcon,
        labelIcon: '🐙'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        domains: ['youtube.com', 'youtu.be'],
        color: 'text-white',
        bgColor: 'bg-[#FF0000]',
        icon: YouTubeIcon,
        labelIcon: '📺'
    },
    {
        id: 'reddit',
        name: 'Reddit',
        domains: ['reddit.com'],
        color: 'text-white',
        bgColor: 'bg-[#FF4500]',
        icon: RedditIcon,
        labelIcon: '🤖'
    },
    {
        id: 'notion',
        name: 'Notion',
        domains: ['notion.so', 'notion.site'],
        color: 'text-white',
        bgColor: 'bg-[#000000]',
        icon: NotionIcon,
        labelIcon: '🗒️'
    },
    {
        id: 'figma',
        name: 'Figma',
        domains: ['figma.com'],
        color: 'text-white',
        bgColor: 'bg-[#F24E1E]',
        icon: FigmaIcon,
        labelIcon: '🎨'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        domains: ['linkedin.com'],
        color: 'text-white',
        bgColor: 'bg-[#0A66C2]',
        icon: LinkedInIcon,
        labelIcon: '💼'
    },
    {
        id: 'twitter',
        name: 'Twitter', // or X
        domains: ['twitter.com', 'x.com'],
        color: 'text-white',
        bgColor: 'bg-[#000000]',
        icon: TwitterIcon,
        labelIcon: '🐦'
    },
    {
        id: 'stackoverflow',
        name: 'Stack Overflow',
        domains: ['stackoverflow.com'],
        color: 'text-white',
        bgColor: 'bg-[#F48024]',
        icon: StackOverflowIcon,
        labelIcon: '🥞'
    },
    {
        id: 'medium',
        name: 'Medium',
        domains: ['medium.com'],
        color: 'text-white',
        bgColor: 'bg-[#000000]',
        icon: MediumIcon,
        labelIcon: '✍️'
    },
    {
        id: 'devto',
        name: 'Dev.to',
        domains: ['dev.to'],
        color: 'text-white',
        bgColor: 'bg-[#0A0A0A]',
        icon: DevToIcon,
        labelIcon: '👨‍💻'
    },
    {
        id: 'googledocs',
        name: 'Google Docs',
        domains: ['docs.google.com', 'drive.google.com'],
        color: 'text-white',
        bgColor: 'bg-[#4285F4]',
        icon: GoogleDocsIcon,
        labelIcon: '📄'
    },
    {
        id: 'substack',
        name: 'Substack',
        domains: ['substack.com'],
        color: 'text-white',
        bgColor: 'bg-[#FF6719]',
        icon: SubstackIcon,
        labelIcon: '📧'
    },
    {
        id: 'producthunt',
        name: 'Product Hunt',
        domains: ['producthunt.com'],
        color: 'text-white',
        bgColor: 'bg-[#DA552F]',
        icon: ProductHuntIcon,
        labelIcon: '😸'
    },
    {
        id: 'wikipedia',
        name: 'Wikipedia',
        domains: ['wikipedia.org'],
        color: 'text-slate-900',
        bgColor: 'bg-[#FFFFFF]',
        icon: WikipediaIcon,
        labelIcon: '🌐'
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        domains: ['perplexity.ai'],
        color: 'text-white',
        bgColor: 'bg-[#1FB8CD]',
        icon: PerplexityIcon,
        labelIcon: '🧠'
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        domains: ['whatsapp.com', 'wa.me'],
        color: 'text-white',
        bgColor: 'bg-[#25D366]',
        icon: WhatsAppIcon,
        labelIcon: '💬'
    }
];

export const OTHER_SOURCE: SourceConfig = {
    id: 'other',
    name: 'Other',
    domains: [],
    color: 'text-white',
    bgColor: 'bg-indigo-500',
    icon: GlobeIcon,
    labelIcon: '🌐'
};

export const getSource = (url: string): SourceConfig => {
    const lowerUrl = url.toLowerCase();
    const source = SOURCES.find(s => s.domains.some(domain => lowerUrl.includes(domain)));
    return source || OTHER_SOURCE;
};
