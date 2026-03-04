"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, Activity, Scale, HeartHandshake, ShieldCheck } from "lucide-react";

interface AnalysisResultsProps {
    data: {
        credibilityScore: number;
        fakeProbability: number;
        bias: string;
        emotionalManipulation: number;
        sourceTrust: number;
        explanation: string;
    };
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
    const getScoreColor = (score: number, inverse = false) => {
        const isBad = inverse ? score > 60 : score < 40;
        const isWarn = inverse ? score > 30 : score < 70;
        if (isBad) return "text-red-500";
        if (isWarn) return "text-yellow-500";
        return "text-green-500";
    };

    const circumference = 2 * Math.PI * 45; // r=45
    const strokeDashoffset = circumference - (data.credibilityScore / 100) * circumference;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Score Card */}
                <div className="glass-card bg-white border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden md:col-span-1">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-brand-blue">
                        <Activity className="w-32 h-32" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-6">Credibility Score</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                                className="text-slate-100"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="45"
                                cx="50"
                                cy="50"
                            />
                            <motion.circle
                                className={getScoreColor(data.credibilityScore)}
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="45"
                                cx="50"
                                cy="50"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className={`text-4xl font-bold ${getScoreColor(data.credibilityScore)}`}>
                                {data.credibilityScore}%
                            </span>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-400 text-center">
                        Based on multi-modal signal analysis and source verification.
                    </p>
                </div>

                {/* Breakdown Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">

                    <div className="glass-card bg-white border border-slate-200 p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-700 font-medium">Fake Probability</span>
                            <AlertTriangle className={`w-5 h-5 ${getScoreColor(data.fakeProbability, true)}`} />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-900">{data.fakeProbability}%</span>
                            <span className="text-sm text-slate-500 mb-1">High Risk</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${data.fakeProbability > 50 ? "bg-red-500" : "bg-green-500"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${data.fakeProbability}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>

                    <div className="glass-card bg-white border border-slate-200 p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-700 font-medium">Political Bias</span>
                            <Scale className="w-5 h-5 text-brand-blue" />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-900">{data.bias}</span>
                            <span className="text-sm text-slate-500 mb-1">Leaning</span>
                        </div>
                        <div className="w-full bg-gradient-to-r from-blue-500 via-slate-300 to-red-500 h-2 mt-4 rounded-full relative">
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-900 rounded-full shadow-md"
                                initial={{ left: "50%" }}
                                animate={{ left: data.bias === "Left" ? "15%" : data.bias === "Right" ? "85%" : "50%" }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>

                    <div className="glass-card bg-white border border-slate-200 p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-700 font-medium">Emotional Manipulation</span>
                            <HeartHandshake className={`w-5 h-5 ${getScoreColor(data.emotionalManipulation, true)}`} />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-900">{data.emotionalManipulation}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-orange-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${data.emotionalManipulation}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>

                    <div className="glass-card bg-white border border-slate-200 p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-700 font-medium">Source Trust</span>
                            <ShieldCheck className={`w-5 h-5 ${getScoreColor(data.sourceTrust)}`} />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-900">{data.sourceTrust}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${data.sourceTrust < 50 ? "bg-red-500" : "bg-green-500"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${data.sourceTrust}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* AI Explanation Panel */}
            <div className="glass-card bg-sky-50 p-6 border-l-4 border-l-brand-blue border-r border-y border-sky-100">
                <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-brand-blue" />
                    AI Transparency Explanation
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    {data.explanation}
                </p>
            </div>

        </div>
    );
}
