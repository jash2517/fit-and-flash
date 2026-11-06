'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Clock, Sparkles, ArrowDown, Search, ShieldCheck, Flame } from 'lucide-react';

interface HeroBannerProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 't-shirts', label: 'T-Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'shirts', label: 'Shirts' },
  { id: 'denim', label: 'Denim' },
  { id: 'sneakers', label: 'Sneakers' },
];

export default function HeroBanner({
  selectedCategory,
  onSelectCategory,
  statusFilter,
  onSelectStatus,
  searchQuery,
  onSearchChange,
}: HeroBannerProps) {
  const { openFitStudio, products } = useApp();

  const featuredDrop = products.find((p) => p.status === 'live') || products[0];
  const [heroSeconds, setHeroSeconds] = useState(featuredDrop ? featuredDrop.countdownSeconds : 9912);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(heroSeconds / 3600);
  const minutes = Math.floor((heroSeconds % 3600) / 60);
  const seconds = heroSeconds % 60;

  return (
    <section className="relative w-full pt-8 pb-10 overflow-hidden">
      {/* Soft warm background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-r from-[#721133]/20 via-[#FF5A1F]/15 to-transparent blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Tagline Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
            <span>FLASH DROP 01 IS LIVE • STRICTLY LIMITED PIECES</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          {/* Left Text (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h1 className="font-heading font-semibold text-3xl sm:text-4xl lg:text-[46px] text-white leading-tight">
              Exclusive Streetwear Drops with{' '}
              <span className="text-[#FF5A1F]">10-Minute Cart Lock</span> &amp; 3D Fit.
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg max-w-xl leading-relaxed font-sans">
              No bots, no cart sniping. When you lock an item, it’s 100% held for you for 10 minutes. Check your real-time sizing with the <strong>3D Fit Studio</strong>, pay easily with UPI, and return to nearby local city hubs in 24 hours.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono text-zinc-300">
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00]" />
                Zero-Oversell Guarantee
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
                3D Interactive Sizing
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                ⚡ Instant UPI &amp; Cash on Delivery
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById('products-grid');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-heading font-semibold text-base flex items-center gap-2 shadow-lg shadow-[#FF5A1F]/20 transition-all transform hover:scale-[1.02]"
              >
                <span>Browse Streetwear Drops</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              {featuredDrop && (
                <button
                  type="button"
                  onClick={() => openFitStudio(featuredDrop)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-heading font-semibold text-base flex items-center gap-2 border border-white/15 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                  <span>Try 3D Fit Studio</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Featured Card with Live Drop Countdown (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#181822] p-5 sm:p-6 rounded-2xl border border-white/10 relative shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF5A1F] fill-[#FF5A1F]" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Drop Closes In:
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] text-[11px] font-mono font-bold">
                  LIVE NOW
                </span>
              </div>

              {/* Countdown Clocks */}
              <div className="flex items-center justify-center gap-2 font-mono text-center">
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 min-w-[65px]">
                  <span className="text-2xl font-bold text-[#CCFF00]">{hours.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-zinc-400 block uppercase">Hours</span>
                </div>
                <span className="text-xl font-bold text-zinc-500">:</span>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 min-w-[65px]">
                  <span className="text-2xl font-bold text-[#CCFF00]">{minutes.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-zinc-400 block uppercase">Mins</span>
                </div>
                <span className="text-xl font-bold text-zinc-500">:</span>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 min-w-[65px]">
                  <span className="text-2xl font-bold text-[#FF5A1F]">{seconds.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-zinc-400 block uppercase">Secs</span>
                </div>
              </div>

              {/* Featured Item Preview */}
              {featuredDrop && (
                <div className="flex items-center gap-3.5 bg-black/40 p-3 rounded-xl border border-white/10">
                  <img
                    src={featuredDrop.image}
                    alt={featuredDrop.title}
                    className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      {featuredDrop.brand}
                    </span>
                    <h4 className="font-heading text-sm font-semibold text-white truncate">
                      {featuredDrop.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                      <span className="text-[#CCFF00] font-bold">₹{featuredDrop.price}</span>
                      <span className="text-[#FF5A1F] font-bold">
                        Only {featuredDrop.stockCount} left
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFitStudio(featuredDrop)}
                    className="px-3 py-1.5 rounded-lg bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-mono text-xs font-bold shrink-0 transition-transform hover:scale-105"
                  >
                    View Fit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clean Filter Controls Bar */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search t-shirts, hoodies, sneakers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A1F] transition-colors"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'live', label: 'Live Drops' },
                { id: 'local-vault', label: 'Local Vault (10% Off)' },
                { id: 'sold-out', label: 'Sold Out' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectStatus(s.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all shrink-0 border ${
                    statusFilter === s.id
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-medium transition-all shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-sm font-semibold'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
