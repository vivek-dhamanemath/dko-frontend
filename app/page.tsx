"use client";

import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* Refined Navbar */}
            <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="text-lg font-serif font-bold tracking-tight text-gray-900 animate-fade-in-down">
                        DKO
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm font-semibold px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="overflow-hidden">

                {/* Hero Section */}
                <section className="max-w-4xl mx-auto px-6 md:px-8 py-20 md:py-32 text-center">

                    {/* Eyebrow Label */}
                    <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-6">
                            ✨ For Developers
                        </p>
                    </div>

                    {/* Main Headline */}
                    <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] mb-8 text-gray-900">
                            A focused{" "}
                            <span className="relative inline-block">
                                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">approach</span>
                                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 to-pink-200"></span>
                            </span>
                            <br />
                            to knowledge.
                        </h1>
                    </div>

                    {/* Subheading */}
                    <div className="animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: "0.3s" }}>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
                            Save, organize, and instantly retrieve technical knowledge.
                            Built for developers who value clarity and efficiency.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up justify-center" style={{ animationDelay: "0.4s" }}>
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all text-center"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-all text-center"
                        >
                            Learn More
                        </Link>
                    </div>

                </section>

                {/* Feature Highlight - Core Benefits */}
                <section className="max-w-6xl mx-auto px-6 md:px-8 py-20 border-t border-gray-200">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Capture",
                                description: "Save articles, code snippets, and resources from anywhere in seconds",
                                icon: "📝"
                            },
                            {
                                title: "Organize",
                                description: "Intelligent tagging and categorization keeps your knowledge structured",
                                icon: "🗂️"
                            },
                            {
                                title: "Search",
                                description: "Find exactly what you need, instantly, with powerful search",
                                icon: "🔍"
                            }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="group animate-fade-in-up hover:bg-gradient-to-br hover:from-indigo-50 hover:to-pink-50 p-6 rounded-xl transition-all"
                                style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="max-w-6xl mx-auto px-6 md:px-8 py-20 border-t border-gray-200">
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-lg text-gray-600">Get started in three simple steps</p>
                    </div>

                    <div className="space-y-12">
                        {[
                            {
                                step: "01",
                                title: "Create Your Collection",
                                description: "Sign up and start building your personal knowledge base. Organize by topics, projects, or however you prefer.",
                                color: "from-indigo-600 to-indigo-400"
                            },
                            {
                                step: "02",
                                title: "Capture What Matters",
                                description: "Save articles, code snippets, documentation, and ideas. Use our browser extension or manual capture.",
                                color: "from-purple-600 to-indigo-600"
                            },
                            {
                                step: "03",
                                title: "Retrieve Instantly",
                                description: "Search by topic, tag, or keyword. Find the knowledge you need in milliseconds, exactly when you need it.",
                                color: "from-pink-600 to-purple-600"
                            }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex gap-8 animate-fade-in-up"
                                style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                            >
                                <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                                    {item.step}
                                </div>
                                <div className="flex-grow pt-2">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="max-w-6xl mx-auto px-6 md:px-8 py-20 border-t border-gray-200 text-center">
                    <div className="animate-fade-in-up">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                            Ready to organize your knowledge?
                        </h2>
                        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                            Join developers who are reclaiming their time with smarter knowledge management.
                        </p>
                        <Link
                            href="/register"
                            className="inline-block px-10 py-5 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                        >
                            Start Your Free Trial
                        </Link>
                    </div>
                </section>

            </main>

            {/* Enhanced Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 mt-20">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <Link href="/" className="text-lg font-serif font-bold text-gray-900 mb-6 md:mb-0">
                            DKO
                        </Link>
                        <div className="flex gap-8 text-sm text-gray-600">
                            <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                            <a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                            <a href="mailto:hello@dko.dev" className="hover:text-gray-900 transition-colors">Contact</a>
                        </div>
                    </div>
                    <div className="border-t border-gray-300 pt-8">
                        <p className="text-xs text-gray-500 text-center">
                            © 2026 Developer Knowledge Organizer. All rights reserved. Made with care for developers.
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}
