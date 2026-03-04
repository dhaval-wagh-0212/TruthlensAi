"use client";

import { useEffect, useState } from "react";
import { User, Download, History, Bookmark, Settings, Eye, PieChart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const data = [
    { name: "Mon", fakes: 12, verified: 34 },
    { name: "Tue", fakes: 19, verified: 45 },
    { name: "Wed", fakes: 15, verified: 32 },
    { name: "Thu", fakes: 25, verified: 50 },
    { name: "Fri", fakes: 22, verified: 60 },
    { name: "Sat", fakes: 30, verified: 42 },
    { name: "Sun", fakes: 18, verified: 38 },
];

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetch("/api/history")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setHistory(data);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [status, router]);

    if (status === "loading" || loading) {
        return <div className="min-h-screen flex items-center justify-center text-brand-neon">Loading Dashboard...</div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
                <div className="glass-card p-6 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-sky-200 p-1 mb-4">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center border border-sky-100">
                            <span className="text-2xl font-bold text-brand-blue uppercase">{session?.user?.name?.charAt(0) || "U"}</span>
                        </div>
                    </div>
                    <h2 className="text-slate-900 font-medium text-lg">{session?.user?.name || "User"}</h2>
                    <p className="text-sm text-brand-blue mb-4">Member</p>
                </div>

                <nav className="glass-card p-4 flex flex-col gap-2">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sky-100 text-brand-blue text-sm font-medium transition-colors border border-sky-200">
                        <PieChart className="w-4 h-4" /> Overview
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sky-50 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                        <History className="w-4 h-4" /> Analysis History
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sky-50 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                        <Bookmark className="w-4 h-4" /> Saved Reports
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sky-50 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                        <Settings className="w-4 h-4" /> Account Settings
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="glass-card p-6 border-brand-blue border">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">Total Analyses</h3>
                        <div className="text-4xl font-bold text-slate-900">{history.length}</div>
                    </div>
                    <div className="glass-card p-6 border-sky-300 border">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">High Risk Hits</h3>
                        <div className="text-4xl font-bold text-sky-600">{history.filter(h => h.credibilityScore < 40).length}</div>
                    </div>
                    <div className="glass-card p-6 border border-sky-200">
                        <h3 className="text-slate-500 text-sm font-medium mb-2">API Calls Used</h3>
                        <div className="text-4xl font-bold text-slate-900">{history.length} <span className="text-sm text-slate-500 font-normal">/ 10,000</span></div>
                    </div>
                </div>

                {/* Charts */}
                <div className="glass-card p-6 h-96">
                    <h3 className="text-slate-900 font-medium mb-6">Activity Trends</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorFakes" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} vertical={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                                itemStyle={{ color: '#0f172a' }}
                            />
                            <Area type="monotone" dataKey="verified" stroke="#0284c7" fillOpacity={1} fill="url(#colorVerified)" />
                            <Area type="monotone" dataKey="fakes" stroke="#38bdf8" fillOpacity={1} fill="url(#colorFakes)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent History */}
                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-slate-900 font-medium">Recent Analyses</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-sm border-b border-slate-200">
                                    <th className="pb-3 font-medium">Target</th>
                                    <th className="pb-3 font-medium">Type</th>
                                    <th className="pb-3 font-medium">Credibility</th>
                                    <th className="pb-3 font-medium">Bias</th>
                                    <th className="pb-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">No analyses found. Run a check to see it here.</td>
                                    </tr>
                                ) : history.slice(0, 10).map((item) => (
                                    <tr key={item._id} className="text-sm text-slate-700">
                                        <td className="py-4 font-medium flex items-center gap-2 max-w-[200px] truncate text-slate-900">
                                            <Eye className="w-4 h-4 text-slate-400 shrink-0" /> {item.url || 'Provided Text'}
                                        </td>
                                        <td className="py-4">{item.url ? 'URL' : 'Text'}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-xs border font-medium ${item.credibilityScore >= 70 ? 'bg-sky-100 text-brand-blue border-sky-200' :
                                                item.credibilityScore >= 40 ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                                    'bg-slate-200 text-slate-800 border-slate-300'
                                                }`}>
                                                {item.credibilityScore}%
                                            </span>
                                        </td>
                                        <td className="py-4">{item.bias}</td>
                                        <td className="py-4 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
