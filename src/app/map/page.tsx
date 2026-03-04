"use client";

import { useState, useEffect } from "react";
import { Globe2, Crosshair, AlertOctagon, Activity, Radio, ChevronDown, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const FILTERS = ["Politics", "Health", "Finance", "Technology", "Global Conflicts"];

export default function MapPage() {
    const [activeFilter, setActiveFilter] = useState("Global Conflicts");
    const [spikesData, setSpikesData] = useState<Record<string, { region: string, severity: string, topic: string, trend: string }[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLiveMapData() {
            try {
                const res = await fetch("/api/map");
                if (res.ok) {
                    const data = await res.json();
                    setSpikesData(data);
                } else {
                    console.error("Failed to fetch map data");
                }
            } catch (error) {
                console.error("Error fetching live map data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchLiveMapData();
    }, []);

    const activeSpikes = spikesData[activeFilter] || [];

    return (
        <div className="w-full h-[calc(100vh-6rem)] relative overflow-hidden flex flex-col pt-4">

            {/* Background Map Placeholder */}
            <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                {/* We use a large SVG icon to simulate the world map since actual geographic components require heavy dependencies */}
                <div className="relative w-[150%] md:w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 1000 500" className="w-[120%] h-auto text-brand-blue opacity-30 stroke-current drop-shadow-2xl">
                        <path fill="none" strokeWidth="2" strokeDasharray="4 4" d="M 0,250 Q 250,100 500,250 T 1000,250" />
                        <path fill="none" strokeWidth="1" strokeDasharray="2 6" d="M 0,150 Q 250,50 500,150 T 1000,150" />
                        <path fill="none" strokeWidth="1" strokeDasharray="2 6" d="M 0,350 Q 250,250 500,350 T 1000,350" />
                    </svg>
                    <div className="absolute w-[800px] h-[400px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-contain bg-center opacity-40"></div>

                    {/* Blinking Nodes */}
                    <div className="absolute top-[30%] left-[25%] w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute top-[40%] right-[35%] w-4 h-4 bg-orange-500 rounded-full animate-ping animation-delay-300"></div>
                    <div className="absolute bottom-[20%] right-[20%] w-2 h-2 bg-brand-neon rounded-full animate-ping animation-delay-700"></div>
                    <div className="absolute top-[35%] left-[50%] w-5 h-5 bg-red-600 rounded-full animate-pulse blur-[2px]"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full flex-grow relative z-10 flex flex-col">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 drop-shadow-lg">
                            <Globe2 className="text-brand-blue w-8 h-8 animate-pulse" /> Real-Time Misinformation Map
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${activeFilter === f
                                    ? "bg-brand-blue/10 border-brand-blue text-brand-blue shadow-[0_0_10px_rgba(14,165,233,0.3)]"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Floating Panes */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-6 pb-6">

                    {/* Left Panel: Regional Spikes */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="glass-card p-5 bg-white border border-slate-200">
                            <h3 className="text-slate-800 font-medium mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-brand-blue" /> Live Threat Heatmap
                            </h3>
                            <div className="space-y-3">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-6 text-slate-500 gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-brand-blue" />
                                        <p className="text-sm font-medium">Tracing live global anomalies...</p>
                                    </div>
                                ) : activeSpikes.length === 0 ? (
                                    <div className="text-sm text-slate-500 text-center py-4">No data currently available.</div>
                                ) : (
                                    activeSpikes.map((spike, idx) => (
                                        <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-slate-900 text-sm font-medium">{spike.region}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${spike.severity === 'Critical' ? 'bg-red-50 text-red-600 border border-red-200' : spike.severity === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-yellow-50 text-yellow-600 border border-yellow-200'}`}>
                                                    {spike.severity}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-600 mb-2 truncate">{spike.topic}</div>
                                            <div className="flex items-center gap-2 text-xs text-brand-blue font-medium">
                                                <TrendingUp className="w-3 h-3" /> {spike.trend} past 1h
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="glass-card p-5 bg-white border border-slate-200">
                            <h3 className="text-slate-800 font-medium mb-2 flex items-center gap-2">
                                <Radio className="w-4 h-4 text-brand-blue" /> Active Tracing
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-blue"></span>
                                </span>
                                Tracking 1,402 bot networks
                            </div>
                        </div>
                    </div>

                    {/* Center Target overlay (invisible container, visuals handle the map) */}
                    <div className="lg:col-span-2 h-[400px] lg:h-full flex items-center justify-center relative pointer-events-none">
                        <div className="absolute inset-0 border border-brand-blue/20 rounded-3xl overflow-hidden backdrop-blur-[2px]">
                            {/* Scanline effect */}
                            <div className="w-full h-[2px] bg-brand-blue/40 absolute top-0 left-0 shadow-[0_0_8px_#0ea5e9] animate-[scan_3s_linear_infinite]"></div>
                        </div>
                    </div>

                    {/* Right Panel: Intelligence Stream */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="glass-card p-4 h-full flex flex-col bg-white border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-800 font-medium flex items-center gap-2">
                                    <AlertOctagon className="w-4 h-4 text-red-500" /> Incoming Alerts
                                </h3>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>

                            <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.2 }}
                                        key={i}
                                        className="border-l-2 border-brand-blue/50 pl-3 py-1 relative"
                                    >
                                        <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-brand-blue"></div>
                                        <p className="text-xs text-brand-blue font-medium mb-1">Just now</p>
                                        <p className="text-sm text-slate-700 line-clamp-2">Suspicious coordinated narrative injection detected across 45 domains.</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(51, 65, 85, 0.5);
          border-radius: 4px;
        }
      `}} />
        </div>
    );
}
