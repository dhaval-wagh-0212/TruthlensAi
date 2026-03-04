import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-24 py-12 bg-white border-t border-slate-200 relative z-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-brand-blue flex-shrink-0" />
                        <span className="text-lg font-display font-bold tracking-widest text-slate-900">
                            TRUTH<span className="text-brand-blue">LENS</span> AI
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">
                        Real-Time Misinformation Intelligence Platform. See beyond the headlines.
                    </p>
                </div>

                <div>
                    <h3 className="font-medium text-slate-900 mb-4">Platform</h3>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><Link href="/analyze" className="hover:text-brand-blue transition-colors">Live Analyzer</Link></li>
                        <li><Link href="/sources" className="hover:text-brand-blue transition-colors">Source Intel</Link></li>
                        <li><Link href="/map" className="hover:text-brand-blue transition-colors">Global Map</Link></li>
                        <li><Link href="/deepfake" className="hover:text-brand-blue transition-colors">Deepfake Detector</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-medium text-slate-900 mb-4">Developers</h3>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><Link href="#" className="hover:text-brand-blue transition-colors">API Docs</Link></li>
                        <li><Link href="#" className="hover:text-brand-blue transition-colors">NLP Models</Link></li>
                        <li><Link href="#" className="hover:text-brand-blue transition-colors">Enterprise Data</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-medium text-slate-900 mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><Link href="#" className="hover:text-brand-blue transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-brand-blue transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-brand-blue transition-colors">GDPR Compliance</Link></li>
                        <li><Link href="#" className="hover:text-brand-blue transition-colors">Contact Us</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
                &copy; {new Date().getFullYear()} TruthLens AI. All rights reserved.
            </div>
        </footer>
    );
}
