"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 flex-grow">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 rounded-2xl glass-card relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 -ml-20 -mt-20 w-40 h-40 rounded-full bg-sky-100 blur-3xl pointers-events-none"></div>
                <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-40 h-40 rounded-full bg-sky-50 blur-3xl pointers-events-none"></div>

                <h1 className="text-3xl font-bold font-outfit mb-2 text-brand-blue">
                    Create an Account
                </h1>
                <p className="text-slate-600 mb-8 font-inter">
                    Join TruthLens AI to save and track your intelligence reports.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="font-inter text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 font-inter">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all"
                            placeholder="Elon Musk"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 font-inter">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 font-inter">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-sky-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-blue hover:bg-sky-600 text-white rounded-xl py-3 font-medium font-inter transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm font-inter text-slate-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-brand-blue hover:text-sky-600 hover:underline">
                        Sign In here
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
