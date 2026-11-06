'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  Truck,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import ProductCard from '@/components/storefront/ProductCard';

export default function LocalVaultSection() {
  const { products, user } = useApp();
  const [selectedHub, setSelectedHub] = useState<string>('all');

  const vaultItems = products.filter((p) => p.status === 'local-vault');

  const hubs = [
    { id: 'all', name: 'All City Hubs', count: vaultItems.length },
    { id: 'Bengaluru Hub - Indiranagar', name: 'Bengaluru (Indiranagar)', count: vaultItems.filter(v => v.hubLocation?.includes('Bengaluru')).length },
    { id: 'Mumbai Hub - Bandra West', name: 'Mumbai (Bandra West)', count: vaultItems.filter(v => v.hubLocation?.includes('Mumbai')).length },
  ];

  const filteredItems = selectedHub === 'all'
    ? vaultItems
    : vaultItems.filter((item) => item.hubLocation === selectedHub);

  return (
    <section className="relative w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Vault Header Banner */}
      <div className="bg-gradient-to-r from-[#721133]/40 via-[#1C1C26] to-[#FF5A1F]/20 p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs font-mono font-bold uppercase">
            <Truck className="w-3.5 h-3.5" />
            Nearby Local Vault • 24hr Delivery
          </div>

          <div className="text-xs font-mono text-zinc-400">
            Your Local Hub: <strong className="text-white bg-black/40 px-2 py-0.5 rounded">{user.hub}</strong>
          </div>
        </div>

        <div className="max-w-2xl space-y-2">
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-white">
            Verified Local Returns • 10% Off Instant Deal
          </h2>
          <p className="text-sm text-zinc-300 font-sans leading-relaxed">
            When another customer returns an unworn piece due to sizing, it is inspected, sanitized, and stored at your nearby city hub. You get a <strong>10% instant discount</strong> and fast 24-hour delivery.
          </p>
        </div>

        {/* 3 Value Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#FF5A1F]" />
            <span className="text-zinc-200">24-Hour Express Courier</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-[#CCFF00]" />
            <span className="text-zinc-200">10% Hub Discount Applied</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-zinc-200">100% Mint Unworn Guarantee</span>
          </div>
        </div>
      </div>

      {/* Hub Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {hubs.map((hub) => (
            <button
              key={hub.id}
              type="button"
              onClick={() => setSelectedHub(hub.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
                selectedHub === hub.id
                  ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-sm font-semibold'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
              }`}
            >
              <span>{hub.name}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                {hub.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-zinc-400">
          {filteredItems.length} verified pieces ready in your city
        </span>
      </div>

      {/* Vault Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#171720] p-10 rounded-2xl border border-white/10 text-center space-y-3">
          <Building2 className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="font-heading text-lg text-white">No items in this local hub currently</h3>
          <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto">
            When a customer returns an item in this area, it appears right here at 10% off.
          </p>
        </div>
      )}
    </section>
  );
}
