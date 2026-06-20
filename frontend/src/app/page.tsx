'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check for auth token on mount (prevents Next.js hydration mismatch errors)
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* --- AMBIENT BACKGROUND ANIMATIONS --- */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-700/20 rounded-full blur-[150px] pointer-events-none animate-pulse duration-1000" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-700/20 rounded-full blur-[150px] pointer-events-none animate-pulse duration-1000 delay-700" />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="text-2xl font-extrabold tracking-tighter text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
            <span className="animate-bounce">✈️</span> AI Travel Planner
          </div>
          <div className="flex gap-4 items-center">
            {mounted && isLoggedIn ? (
              <Link href="/dashboard" className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                Go to Dashboard
              </Link>
            ) : mounted ? (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors">
                  Sign In
                </Link>
                <Link href="/login" className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 flex flex-col justify-center items-center text-center px-4 pt-48 pb-24 min-h-[90vh]">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-widest hover:bg-indigo-500/20 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Powered by Google Gemini 2.5 +
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-5xl text-white leading-tight">
          Design your perfect trip in <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:from-indigo-400 hover:to-blue-400 transition-all duration-500">seconds.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
          Stop spending hours researching. Tell our AI agent where you want to go, and get a hyper-personalized, day-by-day itinerary, budget projection, and climate-aware packing list instantly.
        </p>

        {mounted && (
          <Link href={isLoggedIn ? "/dashboard" : "/login"} className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-950 font-extrabold text-lg px-8 py-4 rounded-xl hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/20">
            <span>{isLoggedIn ? "Return to Dashboard" : "Generate Your First Trip"}</span>
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        )}
      </main>

      {/* --- FEATURE MICRO-GRID --- */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl hover:bg-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">🧠</div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Itineraries</h3>
            <p className="text-slate-400 leading-relaxed">Context-aware daily scheduling optimized for your exact interests and budget tier.</p>
          </div>

          {/* Card 2 */}
          <div className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl hover:bg-slate-800 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">⛈️</div>
            <h3 className="text-xl font-bold text-white mb-3">Climate Packing</h3>
            <p className="text-slate-400 leading-relaxed">Never pack the wrong gear. Our AI analyzes local weather to build your custom checklist.</p>
          </div>

          {/* Card 3 */}
          <div className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl hover:bg-slate-800 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">🔒</div>
            <h3 className="text-xl font-bold text-white mb-3">Secure Vault</h3>
            <p className="text-slate-400 leading-relaxed">Strict zero-trust data isolation ensures your travel plans and data remain completely private.</p>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Scrolling Section) --- */}
      <section className="relative z-10 w-full bg-slate-900/30 border-y border-slate-800/50 py-24 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-16">From Prompt to Plane in 3 Steps</h2>

          <div className="space-y-12 text-left">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl font-bold border border-indigo-500/30">
                1
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Set Your Parameters</h4>
                <p className="text-slate-400">Tell us where you are going, how long you are staying, and what your budget looks like. Add specific interests like "street food" or "hiking".</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center text-2xl font-bold border border-blue-500/30">
                2
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">AI Generation Engine</h4>
                <p className="text-slate-400">Our integrated Gemini LLM parallel-processes your request, building a structural timeline and a weather-aware checklist simultaneously.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex-shrink-0 w-16 h-16 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl font-bold border border-emerald-500/30">
                3
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Customize & Explore</h4>
                <p className="text-slate-400">Review your dashboard. Check off packing items, delete activities you don't want, and prepare for your journey.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA & FOOTER --- */}
      <footer className="relative z-10 w-full py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          {mounted && isLoggedIn ? "Ready to plan your next adventure?" : "Ready to start building your itinerary?"}
        </h2>
        {mounted && (
          <Link href={isLoggedIn ? "/dashboard" : "/login"} className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 mb-12">
            {isLoggedIn ? "Go to Dashboard" : "Access the Dashboard"}
          </Link>
        )}
        <p className="text-sm text-slate-600 font-mono">
          © {new Date().getFullYear()} AI Travel Planner. Engineering Assessment Build.
        </p>
      </footer>

    </div>
  );
}