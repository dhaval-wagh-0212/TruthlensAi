"use client";

import { useState } from "react";
import { Search, Database, Fingerprint, Shield, TrendingUp, Filter } from "lucide-react";

// Mock Data
const MOCK_SOURCES = [
    { id: 1, name: "Global Truth Network", category: "News Outlet", trustScore: 23, bias: "Far-Right", country: "US", ownership: "Private Equity", factChecks: 145 },
    { id: 2, name: "The Daily Consensus", category: "Newspaper", trustScore: 88, bias: "Center-Left", country: "UK", ownership: "Public Trust", factChecks: 12 },
    { id: 3, name: "Health Alternatives Daily", category: "Blog", trustScore: 12, bias: "Unknown", country: "Cyprus", ownership: "Anonymous", factChecks: 890 },
    { id: 4, name: "Tech Chronicle", category: "Magazine", trustScore: 92, bias: "Center", country: "US", ownership: "Public Corporation", factChecks: 4 },
    { id: 5, name: "Freedom Post News", category: "News Outlet", trustScore: 41, bias: "Right", country: "RU", ownership: "State Affiliated", factChecks: 302 },
];

export default function SourcesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSources = MOCK_SOURCES.filter(source =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <Database className="text-brand-purple w-8 h-8" /> Source Intelligence
                    </h1>
                    <p className="text-slate-600 max-w-2xl">
                        A comprehensive database tracking credibility, historical fact-checks, and ownership transparency of over 10,000 publishers worldwide.
                    </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search source name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                        />
                    </div>
                    <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>

            <div className="glass-card bg-white border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                                <th className="px-6 py-4 font-medium">Source Name</th>
                                <th className="px-6 py-4 font-medium">Trust Score</th>
                                <th className="px-6 py-4 font-medium">Bias Rating</th>
                                <th className="px-6 py-4 font-medium">Failed Fact-Checks</th>
                                <th className="px-6 py-4 font-medium">Ownership / Origin</th>
                                <th className="px-6 py-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSources.map((source) => (
                                <tr key={source.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-sky-100 flex items-center justify-center text-brand-blue font-bold">
                                                {source.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{source.name}</div>
                                                <div className="text-xs text-slate-500">{source.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Shield className={`w-4 h-4 ${source.trustScore > 70 ? 'text-green-500' : source.trustScore > 40 ? 'text-yellow-500' : 'text-red-500'}`} />
                                            <span className={`font-bold ${source.trustScore > 70 ? 'text-green-500' : source.trustScore > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                {source.trustScore}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                            {source.bias}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <TrendingUp className="w-4 h-4 text-orange-500" />
                                            {source.factChecks} flags
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Fingerprint className="w-4 h-4 text-slate-400" />
                                            {source.ownership} <span className="text-slate-500">[{source.country}]</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm text-brand-blue hover:text-brand-neon transition-colors">
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSources.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            No sources found matching "{searchTerm}".
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
