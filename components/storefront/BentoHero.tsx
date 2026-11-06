'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import AnimatedMascot from '@/components/mascot/AnimatedMascot';
import {
  Clock,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
  ArrowDown,
  Activity,
  Layers,
  MapPin,
  Lock,
  ChevronRight,
} from 'lucide-react';

interface BentoHeroProps {
  onScrollToProducts: () => void;
}

export default function BentoHero({ onScrollToProducts }: BentoHeroProps) {
  const { products, openFitStudio, user, setActiveSection } = useApp();

  const featuredDrop = products.find((p) => p.status === 'live') || products[0];
  const [countdownSeconds, setCountdownSeconds] = useState(
    featuredDrop ? featuredDrop.countdownSeconds : 9912
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(countdownSeconds / 3600);
  const minutes = Math.floor((countdownSeconds % 3600) / 60);
  const seconds = countdownSeconds % 60;

  return (
    <section className="relative w-full pt-4 pb-10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#721133]/25 via-[#FF5A1F]/20 to-[#CCFF00]/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        {/* Top Mini Pill Indicator */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181822] border border-white/10 text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
            <span>DROP #01 IS LIVE • HIGH-CONCURRENCY ZERO-OVERSELL ENGINE</span>
          </div>

          <span className="hidden sm:inline text-xs font-mono text-zinc-400">
            Interactive Bento Hub • Click mascot to trigger moves
          </span>
        </div>

        {/* ================= APPLE-STYLE BENTO GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* LEFT COLUMN (3 Cols on desktop) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            {/* Tile 1: 10-Minute Cart Lock */}
            <div className="fizz-card p-5 flex flex-col justify-between hover:border-[#CCFF00]/40 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                  Zero Oversell
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="my-3">
                <span className="text-2xl font-heading font-bold text-white block leading-tight">
                  10-Min Cart Lock
                </span>
                <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
                  Locked directly in database memory while you complete payment.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#CCFF00] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                <span>100% RESERVATION</span>
              </div>
            </div>

            {/* Tile 2: Live Drop Timer */}
            <div className="fizz-card p-5 flex flex-col justify-between hover:border-[#FF5A1F]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                  Drop Countdown
                </span>
                <Clock className="w-4 h-4 text-[#FF5A1F]" />
              </div>

              <div className="my-2">
                <div className="flex items-center gap-1.5 font-mono">
                  <div className="bg-black/50 px-2 py-1.5 rounded-lg border border-white/10 text-center">
                    <span className="text-xl font-bold text-[#CCFF00]">
                      {hours.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-zinc-400 block uppercase">Hrs</span>
                  </div>
                  <span className="text-zinc-500 font-bold">:</span>
                  <div className="bg-black/50 px-2 py-1.5 rounded-lg border border-white/10 text-center">
                    <span className="text-xl font-bold text-[#CCFF00]">
                      {minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-zinc-400 block uppercase">Min</span>
                  </div>
                  <span className="text-zinc-500 font-bold">:</span>
                  <div className="bg-black/50 px-2 py-1.5 rounded-lg border border-white/10 text-center">
                    <span className="text-xl font-bold text-[#FF5A1F]">
                      {seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-zinc-400 block uppercase">Sec</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono text-zinc-400">
                Current drop closing soon
              </span>
            </div>
          </div>

          {/* ================= CENTER BIG SHOWCASE TILE (6 Cols on desktop) ================= */}
          <div className="md:col-span-6 fizz-card p-6 sm:p-8 flex flex-col items-center justify-between relative overflow-hidden bg-gradient-to-b from-[#1C1C28] via-[#161622] to-[#111118] border border-white/15 shadow-2xl">
            {/* Ambient Background Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-[#721133]/40 via-[#FF5A1F]/30 to-[#CCFF00]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Tag */}
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] text-[11px] font-mono font-bold">
                  OFFICIAL MASCOT
                </span>
                <span className="text-xs font-mono text-zinc-400">"FLIPPY THE FIT"</span>
              </div>
              <span className="text-xs font-mono text-[#CCFF00] font-bold">
                INTERACTIVE RIG v2.0
              </span>
            </div>

            {/* Center Animated Mascot Character */}
            <div className="my-4 relative z-10">
              <AnimatedMascot size={260} />
            </div>

            {/* Bottom Subtitle & Primary CTA */}
            <div className="w-full text-center space-y-3 relative z-10 border-t border-white/10 pt-4">
              <div>
                <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-white tracking-tight">
                  High-Concurrency Streetwear Atelier
                </h2>
                <p className="text-xs text-zinc-300 font-sans mt-0.5 max-w-md mx-auto">
                  Zero oversell. Interactive 3D fit visualization. 24-hour local city hub returns.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onScrollToProducts}
                  className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-heading font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#FF5A1F]/25 transition-all transform hover:scale-105"
                >
                  <span>Explore Drops Below</span>
                  <ArrowDown className="w-4 h-4" />
                </button>

                {featuredDrop && (
                  <button
                    type="button"
                    onClick={() => openFitStudio(featuredDrop)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-heading font-semibold text-sm flex items-center gap-2 border border-white/10 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                    <span>Launch 3D Studio</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (3 Cols on desktop) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            {/* Tile 3: 3D Smart Fit Studio */}
            <div
              onClick={() => featuredDrop && openFitStudio(featuredDrop)}
              className="fizz-card p-5 flex flex-col justify-between hover:border-[#CCFF00]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                  3D Studio
                </span>
                <Sparkles className="w-4 h-4 text-[#CCFF00]" />
              </div>

              <div className="my-3">
                <span className="text-2xl font-heading font-bold text-white block leading-tight group-hover:text-[#CCFF00] transition-colors">
                  Smart 3D Fit
                </span>
                <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
                  Real-time mesh strain test before buying. 96% sizing accuracy.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#CCFF00]">
                <span>Click to try size</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Tile 4: Local City Hubs */}
            <div
              onClick={() => setActiveSection('vault')}
              className="fizz-card p-5 flex flex-col justify-between hover:border-purple-400/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                  City Dispatch
                </span>
                <Truck className="w-4 h-4 text-purple-400" />
              </div>

              <div className="my-3">
                <span className="text-2xl font-heading font-bold text-white block leading-tight group-hover:text-purple-300 transition-colors">
                  Local Vault
                </span>
                <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
                  Returns re-routed to Bengaluru, Mumbai &amp; Delhi hubs at 10% off.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-300 font-bold">
                <MapPin className="w-3 h-3 text-[#FF5A1F]" />
                <span>24H EXPRESS DELIVERY</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: 2 Sleek Wide Bento Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tile 5: Instant Indian Payments (UPI & COD) */}
          <div className="fizz-card p-5 flex items-center justify-between gap-4 hover:border-[#FF5A1F]/30 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF5A1F]" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Instant UPI &amp; Cash on Delivery
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Scan with Google Pay, PhonePe, Paytm or verify COD with instant on-screen OTP.
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono font-bold text-white">
              <span>GPay</span> • <span>PhonePe</span> • <span>COD</span>
            </div>
          </div>

          {/* Tile 6: RFID Tag Verification & 24h Return */}
          <div
            onClick={() => setActiveSection('orders')}
            className="fizz-card p-5 flex items-center justify-between gap-4 hover:border-[#CCFF00]/30 transition-all cursor-pointer group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                <span className="text-xs font-mono font-bold text-white uppercase group-hover:text-[#CCFF00] transition-colors">
                  RFID Tag Scanner &amp; 1-Tap Returns
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Camera scan verifies unworn garment authenticity for instant exchange.
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-xs font-mono text-[#CCFF00] font-bold">
              <span>View Orders</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

