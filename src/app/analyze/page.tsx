"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, FileText, Globe, Search, ArrowRight, ShieldAlert, Cpu } from "lucide-react";
import AnalysisResults from "./AnalysisResults";

function AnalyzeContent() {
    const searchParams = useSearchParams();
    const initUrl = searchParams.get("url") || "";

    const [inputType, setInputType] = useState<"url" | "text">("url");
    const [input, setInput] = useState(initUrl);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setResults(null);
        setError("");

        if (inputType === "url") {
            try {
                new URL(input);
            } catch (_) {
                setError("Please enter a valid URL.");
                setLoading(false);
                return;
            }
        }

        try {
            const payload = inputType === "url" ? { url: input } : { text: input };

            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to analyze content");
            }

            const data = await res.json();
            setResults(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong during analysis.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initUrl) {
            setInputType("url");
            handleAnalyze();
        }
    }, [initUrl]);

    return (
        <>
            <div className="mb-12 text-center md:text-left">
                <h1 className="text-4xl font-display font-bold text-slate-900 mb-4 flex items-center justify-center md:justify-start gap-3">
                    <Brain className="text-brand-blue w-8 h-8" /> Live Analyzer
                </h1>
                <p className="text-slate-600 max-w-2xl">
                    Paste text, a URL, or upload an image/PDF. Our NLP transformer models will immediately begin extracting signals, comparing claims, and evaluating source integrity.
                </p>
            </div>

            {/* Input Section */}
            <div className="glass-card p-6 md:p-8 mb-12">
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => setInputType("url")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${inputType === "url"
                            ? "bg-sky-50 border border-brand-blue/30 text-brand-blue"
                            : "bg-white border border-sky-200 hover:border-sky-300 text-slate-600"
                            }`}
                    >
                        <Globe className="w-4 h-4" /> URL
                    </button>
                    <button
                        onClick={() => setInputType("text")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${inputType === "text"
                            ? "bg-sky-50 border border-brand-blue/30 text-brand-blue"
                            : "bg-white border border-sky-200 hover:border-sky-300 text-slate-600"
                            }`}
                    >
                        <FileText className="w-4 h-4" /> Text
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-sky-200 hover:border-sky-300 text-slate-600 text-sm transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
                        <ShieldAlert className="w-4 h-4" /> Screenshot/PDF
                    </button>
                </div>

                <form onSubmit={handleAnalyze} className="relative">
                    {error && (
                        <div className="mb-4 text-red-400 text-sm bg-red-400/10 border border-red-400/20 p-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAnalyze(e as unknown as React.FormEvent);
                            }
                        }}
                        placeholder={inputType === "url" ? "Paste a news article URL here..." : "Paste your text content here..."}
                        className="w-full bg-white border border-sky-200 rounded-xl p-4 pb-16 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 min-h-[120px] resize-y"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute bottom-4 right-4 flex items-center gap-2 bg-brand-blue hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Cpu className="w-5 h-5 animate-pulse" /> Processing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Analyze <ArrowRight className="w-4 h-4" />
                            </span>
                        )}
                    </button>
                </form>
            </div>

            {/* Loading State or Results */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 space-y-6"
                >
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-t-4 border-brand-blue animate-spin opacity-70"></div>
                        <div className="absolute inset-2 rounded-full border-r-4 border-sky-400 animate-spin animation-delay-150 opacity-70"></div>
                        <div className="absolute inset-4 rounded-full border-b-4 border-sky-200 animate-spin animation-delay-300 opacity-70"></div>
                        <Search className="w-8 h-8 text-brand-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <p className="text-brand-blue font-medium animate-pulse tracking-widest">ANALYZING SIGNALS THROUGH GEMINI...</p>
                </motion.div>
            )}

            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <AnalysisResults data={results} />
                </motion.div>
            )}
        </>
    );
}

export default function AnalyzePage() {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <Suspense fallback={<div className="text-slate-600 text-center py-20">Loading Analyzer...</div>}>
                <AnalyzeContent />
            </Suspense>
        </div>
    );
}
