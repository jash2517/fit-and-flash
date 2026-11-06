'use client';

import React from 'react';
import { ShieldCheck, Box, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function BrandStory() {
  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#CCFF00]" />,
      title: '10-Minute Cart Lock',
      subtitle: 'Zero Oversell Guarantee',
      description:
        'When you select an item, it is locked in your cart for 10 minutes. No other shopper can buy it out from under you while you enter your UPI PIN or card details.',
      tag: 'No Rush, No Sniping',
    },
    {
      icon: <Box className="w-6 h-6 text-[#FF5A1F]" />,
      title: '3D Smart Fit Studio',
      subtitle: 'Interactive Size Testing',
      description:
        'Adjust your chest, waist, and height on our real-time 3D model. The color indicators show exactly where the garment fits snug, ideal, or loose before you purchase.',
      tag: '85% Fewer Returns',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-purple-400" />,
      title: 'Local Hub Returns',
      subtitle: 'Fast 24-Hour Exchange',
      description:
        'Exchanged items go directly to our neighborhood city hubs (Bengaluru Indiranagar, Mumbai Bandra, Delhi NCR) for quick 24h delivery or a 10% discounted local deal for nearby shoppers.',
      tag: 'Express Same-Day Dispatch',
    },
  ];

  return (
    <section className="relative w-full py-14 border-t border-white/10 bg-[#121217] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FF5A1F] text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            HOW FIT&amp;FLASH WORKS
          </div>
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-white">
            Built for Real Streetwear Lovers
          </h2>
          <p className="text-sm text-zinc-400 font-sans">
            Fair drops, interactive 3D sizing, and lightning-fast local city fulfillment.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#181822] p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-[#FF5A1F]/30 transition-all shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 border border-white/10 px-2 py-0.5 rounded-full">
                    {pillar.tag}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                    {pillar.subtitle}
                  </span>
                  <h3 className="font-heading font-semibold text-xl text-white mt-0.5">
                    {pillar.title}
                  </h3>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Step 0{idx + 1}</span>
                <span className="text-[#CCFF00] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
