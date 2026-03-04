"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Activity, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleAnalyzeClick = () => {
    router.push("/analyze");
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-24 pb-20 overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-32 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-blue/30 text-brand-blue text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Live Misinformation Interception Active
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-display font-extrabold tracking-tight mb-8 text-slate-900"
        >
          See Beyond the <br className="hidden md:block" />
          <span className="text-brand-blue">Headlines.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-600 max-w-3xl mb-12"
        >
          AI-powered misinformation detection with real-time credibility scoring.
          Identify fake news, bias, and emotional manipulation instantly.
        </motion.p>

        {/* Demo Input Replaced by Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <button
            onClick={handleAnalyzeClick}
            className="flex items-center gap-2 bg-brand-blue hover:bg-sky-600 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-md text-lg"
          >
            Analyze Now <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 flex items-center gap-6"
        >
          <Link href="/map" className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors group">
            <Activity className="w-5 h-5 text-brand-blue group-hover:animate-pulse" />
            View Live Misinformation Trends <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300">
          <div className="p-3 bg-sky-100 rounded-lg border border-sky-200 text-brand-blue">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Source Credibility</h3>
          <p className="text-slate-600">
            Cross-reference publishers against a massive database of trusted sources and historical fact-checks.
          </p>
        </div>

        <div className="glass-card p-8 flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300">
          <div className="p-3 bg-sky-100 rounded-lg border border-sky-200 text-brand-blue">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Deep Contextual AI</h3>
          <p className="text-slate-600">
            Our transformer models analyze tone, emotional manipulation, and political bias to reveal hidden agendas.
          </p>
        </div>

        <div className="glass-card p-8 flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300">
          <div className="p-3 bg-sky-100 rounded-lg border border-sky-200 text-brand-blue">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Real-time Tracing</h3>
          <p className="text-slate-600">
            Track how stories spread across the globe and identify synchronized bot networks pushing narratives.
          </p>
        </div>
      </section>

    </div>
  );
}
