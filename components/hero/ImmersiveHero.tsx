'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import AnimatedMascot from '@/components/mascot/AnimatedMascot';
import { ArrowDown } from 'lucide-react';

// Client-only dynamic import of Three.js 3D grid floor (ssr: false)
const HeroGridBackground = dynamic(
  () => import('@/components/hero/HeroGridBackground'),
  { ssr: false }
);

interface ImmersiveHeroProps {
  onExplore: () => void;
}

export default function ImmersiveHero({ onExplore }: ImmersiveHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0, isInside: false });
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track pointer movements across the hero section for 3D liquid grid bending
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointerPos({ x, y, isInside: true });
  };

  const handlePointerLeave = () => {
    setPointerPos((prev) => ({ ...prev, isInside: false }));
  };

  // Parallax calculations for Apple-style scrollytelling
  const headlineOpacity = Math.max(0, 1 - scrollY / 320);
  const headlineTranslate = scrollY * 0.2;
  const purchaseStackOpacity = Math.max(0, 1 - scrollY / 280);

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between items-center bg-[#000000] text-white overflow-hidden px-4 select-none pt-4 pb-8 sm:pb-12"
    >
      {/* 0. INTERACTIVE "SYNTHWAVE-LITE" 3D GRID FLOOR BACKGROUND (z-0, pointer-events: none) */}
      <HeroGridBackground scrollY={scrollY} pointerPos={pointerPos} />

      {/* 1. TOP DISPLAY HEADLINE (Apple Watch Ultra Style) */}
      <div
        className="w-full text-center pt-2 sm:pt-4 z-20 transition-all duration-75 relative"
        style={{
          opacity: headlineOpacity,
          transform: `translate3d(0, -${headlineTranslate}px, 0)`,
        }}
      >
        {/* Soft dark radial vignette behind headline for guaranteed AA contrast */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-[90%] max-w-2xl h-44 -z-10 pointer-events-none rounded-full blur-2xl opacity-90"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 55%, transparent 85%)',
          }}
          aria-hidden="true"
        />

        {/* Small Brand Lockup */}
        <div className="inline-flex items-center gap-1.5 mb-2 text-zinc-400 font-mono text-xs tracking-widest uppercase">
          <img src="/logo.png" alt="Fit&Flash Logo" className="w-4 h-4 object-contain inline-block" />
          <span className="font-semibold text-white tracking-wider">FIT<span className="text-[#FF5A1F]">&amp;</span>FLASH</span>
        </div>

        {/* Big Display Headline */}
        <h1 className="font-heading font-semibold text-3xl sm:text-5xl lg:text-6xl text-[#f5f5f7] tracking-tight leading-[1.08] max-w-3xl mx-auto uppercase">
          A DROP YOU CAN'T OUTRUN.
        </h1>
      </div>

      {/* 2. CENTER STAGE: FULL PAGE COVERAGE WITH JUMPING MASCOT (Nothing on left or right) */}
      <div className="w-full flex-1 flex items-center justify-center relative my-auto py-2 z-10">
        <AnimatedMascot size={380} scrollY={scrollY} />
      </div>

      {/* 3. BOTTOM CENTERED PURCHASE STACK (Apple Style Reference) */}
      <div
        className="w-full flex flex-col items-center justify-center text-center space-y-3 z-20"
        style={{
          opacity: purchaseStackOpacity,
        }}
      >
        {/* Purchase Blue Pill Button */}
        <button
          type="button"
          onClick={onExplore}
          className="bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 text-white font-sans text-sm font-semibold rounded-full px-7 py-2.5 shadow-md transition-all flex items-center gap-2 group"
        >
          <span>Explore Drops</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Pricing & Guarantee Stack */}
        <div className="space-y-0.5 text-xs font-sans">
          <p className="text-[#f5f5f7] font-semibold text-sm">
            From ₹2,199 or ₹183/mo. for 12 mo.*
          </p>
          <p className="text-[#86868b] text-[11px] font-mono">
            10-Minute Zero-Oversell Cart Lock • 24hr Local City Hub Returns
          </p>
        </div>
      </div>
    </section>
  );
}
