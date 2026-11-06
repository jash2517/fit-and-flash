'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Truck, RefreshCw, Cpu } from 'lucide-react';

export default function Footer() {
  const { setActiveSection, setIsAuthModalOpen } = useApp();

  return (
    <footer className="w-full bg-[#0A0A0E] border-t border-white/10 pt-12 pb-10 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Fit&Flash Logo" className="w-8 h-8 object-contain" />
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                fit<span className="text-[#FF5A1F]">&amp;</span>flash
              </span>
            </div>

            <p className="text-zinc-400 text-xs max-w-sm leading-relaxed font-sans">
              Streetwear drops with 10-minute cart locks, interactive 3D fit visualization, and 24-hour local city hub returns.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                Bengaluru Hub
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                Mumbai Hub
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                Delhi NCR Hub
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-white font-semibold block text-xs">
              Explore
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveSection('storefront')}
                  className="hover:text-[#FF5A1F] transition-colors"
                >
                  Live Drops Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveSection('vault')}
                  className="hover:text-[#FF5A1F] transition-colors"
                >
                  Nearby Local Vault (10% Off)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveSection('orders')}
                  className="hover:text-[#FF5A1F] transition-colors"
                >
                  My Orders &amp; Tag Scan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveSection('merchant')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Merchant Ops &amp; Traffic Sim
                </button>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="md:col-span-4 space-y-2 text-zinc-400 text-xs">
            <span className="text-white font-semibold block">
              Core Guarantees
            </span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                <span>10-minute cart lock prevents cart sniping</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                <span>24-hour local city hub returns &amp; exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Instant UPI &amp; Cash on Delivery verification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Fit&amp;Flash Inc. All rights reserved.
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="text-zinc-400 hover:text-white underline"
          >
            Switch Account / Role
          </button>
        </div>
      </div>
    </footer>
  );
}
