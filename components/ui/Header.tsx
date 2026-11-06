'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  ChevronDown,
  Activity,
} from 'lucide-react';

export default function Header() {
  const {
    user,
    setIsAuthModalOpen,
    activeLock,
    setIsCheckoutOpen,
    activeSection,
    setActiveSection,
    trafficSimulatorRunning,
    products,
  } = useApp();

  const vaultCount = products.filter((p) => p.status === 'local-vault').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111111]/95 backdrop-blur-md border-b border-white/10 select-none">
      {/* Top 32px Apple Announcement Bar */}
      <div className="bg-[#000000] border-b border-white/5 text-[#f5f5f7] py-1 px-4 text-[11px] font-mono flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d959] animate-ping" />
            <span className="text-white font-bold">10-MIN CART LOCK:</span> Zero Oversell Guarantee
          </span>
          <span className="text-[#6e6e73]">•</span>
          <span className="hidden sm:inline text-[#86868b]">
            Express Local Hubs: Bengaluru, Mumbai &amp; Delhi NCR
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {trafficSimulatorRunning && (
            <span className="text-[10px] bg-[#1d1d1f] border border-[#00d959]/30 px-2 py-0.5 rounded-full text-[#00d959] font-bold flex items-center gap-1">
              <Activity className="w-2.5 h-2.5" />
              Traffic Sim Active
            </span>
          )}
          <span className="hidden md:inline text-[#86868b]">
            24hr Neighborhood Returns
          </span>
        </div>
      </div>

      {/* Global 44px-50px Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4">
        {/* Brand Logo with Mascot */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setActiveSection('storefront')}
        >
          <img
            src="/logo.png"
            alt="Fit&Flash Mascot"
            className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center">
            <span className="font-heading text-lg font-bold tracking-tight text-white group-hover:text-[#0071e3] transition-colors">
              fit<span className="text-[#0071e3]">&amp;</span>flash
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-sans text-[12px] text-[#86868b]">
          <button
            type="button"
            onClick={() => setActiveSection('storefront')}
            className={`transition-colors hover:text-white ${
              activeSection === 'storefront' ? 'text-white font-semibold' : ''
            }`}
          >
            Live Drops
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('vault')}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              activeSection === 'vault' ? 'text-white font-semibold' : ''
            }`}
          >
            <span>Local Vault</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#333336] text-[#f5f5f7] text-[10px] font-mono">
              {vaultCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('orders')}
            className={`transition-colors hover:text-white ${
              activeSection === 'orders' ? 'text-white font-semibold' : ''
            }`}
          >
            My Orders
          </button>

          {user.role === 'merchant' && (
            <button
              type="button"
              onClick={() => setActiveSection('merchant')}
              className={`transition-colors hover:text-purple-300 flex items-center gap-1 ${
                activeSection === 'merchant' ? 'text-purple-400 font-semibold' : 'text-purple-400'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Merchant Console</span>
            </button>
          )}
        </nav>

        {/* Right Section: Active Lock & Profile */}
        <div className="flex items-center gap-2">
          {activeLock && (
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="px-2.5 py-1 rounded-full bg-[#00d959]/15 border border-[#00d959] text-[#00d959] font-mono text-[11px] font-bold flex items-center gap-1.5 animate-pulse"
            >
              <Clock className="w-3 h-3" />
              <span>
                Lock: {Math.floor(activeLock.remainingSeconds / 60)}:
                {(activeLock.remainingSeconds % 60).toString().padStart(2, '0')}
              </span>
            </button>
          )}

          {user.role !== 'merchant' && (
            <button
              type="button"
              onClick={() => setActiveSection('merchant')}
              className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-[#86868b] hover:text-white px-2 py-1 rounded-lg bg-white/5 transition-colors"
            >
              <span>Merchant View</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1d1d1f] hover:bg-[#333336] text-[#f5f5f7] text-[11px] font-mono transition-colors"
            title="Switch demo account"
          >
            <span className="w-4 h-4 rounded-full bg-[#0071e3] text-white flex items-center justify-center font-bold text-[9px]">
              {user.name.charAt(0)}
            </span>
            <span className="hidden sm:inline font-medium">
              {user.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-[#86868b]" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Subbar */}
      <div className="md:hidden flex items-center justify-around bg-[#000000] border-t border-white/5 py-1.5 text-xs font-sans text-[#86868b]">
        <button
          type="button"
          onClick={() => setActiveSection('storefront')}
          className={`px-2 py-0.5 ${
            activeSection === 'storefront' ? 'text-white font-semibold' : ''
          }`}
        >
          Drops
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('vault')}
          className={`px-2 py-0.5 flex items-center gap-1 ${
            activeSection === 'vault' ? 'text-white font-semibold' : ''
          }`}
        >
          <span>Vault</span>
          <span className="bg-[#333336] text-white text-[9px] px-1 rounded-full">
            {vaultCount}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('orders')}
          className={`px-2 py-0.5 ${
            activeSection === 'orders' ? 'text-white font-semibold' : ''
          }`}
        >
          Orders
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('merchant')}
          className={`px-2 py-0.5 ${
            activeSection === 'merchant' ? 'text-purple-400 font-semibold' : ''
          }`}
        >
          Merchant
        </button>
      </div>
    </header>
  );
}
