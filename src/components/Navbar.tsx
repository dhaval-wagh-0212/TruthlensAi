"use client";

import Link from "next/link";
import { ShieldCheck, Activity, Map as MapIcon, Aperture, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 w-full z-50 glass-card px-6 py-4 rounded-none border-t-0 border-x-0">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <ShieldCheck className="w-8 h-8 text-brand-blue group-hover:drop-shadow-sm transition-all" />
                    <span className="text-xl font-display font-bold tracking-wider text-slate-900">
                        TRUTH<span className="text-sky-500">LENS</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="/analyze" className="hover:text-brand-blue flex items-center gap-2 transition-colors">
                        <Activity className="w-4 h-4" /> Analyze
                    </Link>
                    <Link href="/sources" className="hover:text-brand-blue flex items-center gap-2 transition-colors">
                        <Aperture className="w-4 h-4" /> Sources
                    </Link>
                    <Link href="/map" className="hover:text-brand-blue flex items-center gap-2 transition-colors">
                        <MapIcon className="w-4 h-4" /> Intel Map
                    </Link>
                    <Link href="/deepfake" className="hover:text-brand-blue flex items-center gap-2 transition-colors">
                        Deepfake Scanner
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 bg-sky-100 border border-sky-200 px-4 py-2 rounded-lg text-sm font-medium text-brand-blue hover:bg-sky-200 transition-all"
                            >
                                <User className="w-4 h-4" /> {session.user?.name || "Dashboard"}
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 hover:bg-slate-100 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 transition-all"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 bg-brand-blue hover:bg-sky-600 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all shadow-md"
                        >
                            <User className="w-4 h-4" /> Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav >
    );
}
