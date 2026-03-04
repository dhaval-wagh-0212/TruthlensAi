"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Camera, ScanFace, FileSearch, ShieldAlert, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DeepfakeScannerPage() {
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAnalyzing(true);
        setResults(null);
        setError("");

        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("/api/deepfake", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to analyze image");
            }

            const data = await res.json();
            setResults(data);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during deepfake scanning.");
        } finally {
            setAnalyzing(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-6rem)] bg-gradient-to-br from-white via-sky-50 to-blue-100 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-12">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-4 flex items-center justify-center md:justify-start gap-3">
                        <ScanFace className="text-brand-blue w-8 h-8" /> Deepfake & Image Scanner
                    </h1>
                    <p className="text-slate-600 max-w-2xl">
                        Upload an image to run a multi-layered forensic analysis. We analyze pixel inconsistency, GAN artifacts, hidden metadata, and cross-reference against verified image databases.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Upload Panel */}
                    <div className="glass-card p-8 flex flex-col items-center justify-center border-dashed border-2 border-slate-300 hover:border-brand-blue/50 transition-colors group relative min-h-[400px]">
                        {/* Active Scanning Overlay */}
                        {analyzing && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
                                <div className="relative w-24 h-24 mb-6">
                                    <div className="absolute inset-0 border-4 border-transparent border-t-brand-blue rounded-full animate-spin"></div>
                                    <div className="absolute inset-2 border-4 border-transparent border-t-sky-400 rounded-full animate-spin animation-delay-150"></div>
                                    <ScanFace className="w-10 h-10 text-brand-blue absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] animate-pulse" />
                                </div>
                                <p className="text-brand-blue font-medium tracking-widest animate-pulse">EXTRACTING PIXEL FEATURES...</p>
                            </div>
                        )}

                        {!results && !analyzing && (
                            <div className="flex flex-col items-center w-full">
                                {error && (
                                    <div className="mb-6 flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                                        <AlertCircle className="w-4 h-4" /> {error}
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/jpeg, image/png, image/webp"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />

                                <div
                                    className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center mb-6 group-hover:bg-brand-blue/10 transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-brand-blue transition-colors" />
                                </div>
                                <h3 className="text-xl font-medium text-slate-900 mb-2">Select Image to Scan</h3>
                                <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">
                                    Supports JPG, PNG, WEBP formats. Max size 20MB.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-brand-blue text-sm text-slate-700 hover:text-brand-blue transition-colors"
                                    >
                                        <ImageIcon className="w-4 h-4" /> Browse Files
                                    </button>
                                    <button
                                        onClick={() => setError("URL Image Scanning is currently only available for Pro accounts. Please upload a file locally instead.")}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        <Camera className="w-4 h-4" /> URL Link
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Sample Image displayed if results exist */}
                        {results && !analyzing && (
                            <div className="w-full h-full relative p-4 flex flex-col items-center">
                                <div className="w-full h-64 bg-slate-100 rounded-lg overflow-hidden relative mb-6 border border-brand-blue/30 flex items-center justify-center">
                                    <div className="text-slate-400 font-medium flex flex-col items-center gap-2">
                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                        <span>{results.filename}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setResults(null)}
                                    className="text-sm text-brand-blue hover:text-sky-600 underline underline-offset-4 font-medium"
                                >
                                    Scan Another Image
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Results Panel */}
                    <div className="flex flex-col gap-6">
                        {(!results && !analyzing) ? (
                            <div className="glass-card p-12 h-full flex flex-col items-center justify-center text-center text-slate-400 border border-slate-200">
                                <FileSearch className="w-16 h-16 mb-4 opacity-50" />
                                <p>Upload an image to view forensic AI analysis results.</p>
                            </div>
                        ) : results ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Primary Scores */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass-card p-5 border border-red-200 bg-red-50/30 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                        <h4 className="text-slate-600 text-sm font-medium mb-2">Deepfake Probability</h4>
                                        <div className="text-4xl font-bold text-red-500">{results.deepfakeProbability}%</div>
                                    </div>
                                    <div className="glass-card p-5 border border-orange-200 bg-orange-50/30 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                        <h4 className="text-slate-600 text-sm font-medium mb-2">AI-Generated Score</h4>
                                        <div className="text-4xl font-bold text-orange-500">{results.aiGenerated}%</div>
                                    </div>
                                </div>

                                {/* Forensic Details */}
                                <div className="glass-card p-6 bg-white border border-slate-200">
                                    <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-100 pb-2">Forensic Report</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm text-brand-blue font-medium mb-1">Visual Inconsistencies Detected</h4>
                                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mt-2">
                                                {results.issues && results.issues.length > 0 ? results.issues.map((i: string, idx: number) => (
                                                    <li key={idx}>{i}</li>
                                                )) : <li>No significant structural anomalies detected by the AI.</li>}
                                            </ul>
                                        </div>

                                        <div className="pt-2">
                                            <h4 className="text-sm text-orange-500 font-medium mb-1">Reverse Image Search</h4>
                                            <p className="text-sm text-slate-600 flex items-start gap-2 mt-2 bg-slate-50 p-3 rounded border border-slate-100">
                                                <ShieldAlert className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                                {results.reverseImageMatch}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="glass-card p-6 bg-white border border-slate-200">
                                    <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-100 pb-2">Extracted Metadata (EXIF)</h3>
                                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                                        <div className="text-slate-500">Camera / Device</div>
                                        <div className="text-slate-800 text-right font-medium">{results.metadata?.camera || "Unknown"}</div>

                                        <div className="text-slate-500">Software Signatures</div>
                                        <div className="text-red-500 text-right font-mono text-xs">{results.metadata?.software || "None"}</div>

                                        <div className="text-slate-500">Original Date</div>
                                        <div className="text-slate-800 text-right font-medium">{results.metadata?.date || "Unknown"}</div>
                                    </div>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="glass-card p-12 h-full flex flex-col items-center justify-center border border-slate-200">
                                <div className="space-y-4 w-full max-w-xs">
                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6"></div>
                                    <div className="h-20 bg-slate-100 rounded animate-pulse w-full mt-8"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
