'use client';

import React from 'react';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  Sparkles,
  MapPin,
  Truck,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { openFitStudio, lockStock, joinWaitlist } = useApp();

  const isSoldOut = product.status === 'sold-out' || product.stockCount <= 0;
  const isVault = product.status === 'local-vault';
  const isLive = product.status === 'live' && !isSoldOut;

  // Format countdown
  const hours = Math.floor(product.countdownSeconds / 3600);
  const minutes = Math.floor((product.countdownSeconds % 3600) / 60);
  const seconds = product.countdownSeconds % 60;
  const countdownFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) {
      joinWaitlist(product.id);
    } else {
      openFitStudio(product);
    }
  };

  return (
    <div
      onClick={() => openFitStudio(product)}
      className="group relative bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-white/20 rounded-[28px] p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Product Image Frame: 20px rounded on pure black stage */}
        <div className="relative w-full aspect-square bg-[#000000] rounded-[20px] overflow-hidden mb-3.5 border border-white/5">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
            {isLive && (
              <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#00d959]/40 text-[#00d959] font-mono text-[10px] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d959] animate-pulse" />
                Live Drop
              </span>
            )}
            {isVault && (
              <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#ff791b]/40 text-[#ff791b] font-mono text-[10px] font-semibold flex items-center gap-1.5">
                <Truck className="w-3 h-3" />
                Local Vault
              </span>
            )}
            {isSoldOut && (
              <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-zinc-700 text-zinc-400 font-mono text-[10px] font-medium">
                Sold Out
              </span>
            )}

            {isLive && product.stockCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-[#311400] text-[#ff791b] font-mono text-[10px] font-semibold">
                Only {product.stockCount} left
              </span>
            )}
            {isVault && product.discount && (
              <span className="px-2.5 py-1 rounded-full bg-[#ff791b] text-white font-mono text-[10px] font-bold">
                -10% Hub Deal
              </span>
            )}
          </div>

          {/* Bottom Countdown Overlay */}
          {isLive && product.countdownSeconds > 0 && (
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#86868b] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#00d959]" />
                Closes in:
              </span>
              <span className="text-[#00d959] font-bold">{countdownFormatted}</span>
            </div>
          )}

          {/* Local Hub Location */}
          {isVault && product.hubLocation && (
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-full bg-black/90 backdrop-blur-md border border-white/10 flex items-center gap-1.5 font-mono text-[10px] text-[#86868b]">
              <MapPin className="w-3 h-3 text-[#ff791b] shrink-0" />
              <span className="truncate text-[#f5f5f7]">{product.hubLocation}</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-[#86868b] uppercase tracking-wider">
            {product.brand}
          </div>

          <h3 className="font-heading font-semibold text-base text-[#f5f5f7] group-hover:text-white transition-colors truncate">
            {product.title}
          </h3>

          <p className="text-xs text-[#86868b] line-clamp-1">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing and Action */}
      <div className="mt-3 pt-2.5 border-t border-white/5 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-lg font-bold text-[#f5f5f7]">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-mono text-[#86868b] line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-[#00d959]">
            {product.availableSizes.slice(0, 3).join(', ')}
            {product.availableSizes.length > 3 ? '+' : ''}
          </span>
        </div>

        {isLive && (
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="w-full py-2 px-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-sans font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Fit &amp; Buy</span>
          </button>
        )}

        {isVault && (
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="w-full py-2 px-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-sans font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>24h Express Dispatch</span>
          </button>
        )}

        {isSoldOut && (
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="w-full py-2 px-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 font-sans font-medium text-xs flex items-center justify-center gap-1.5 transition-all border border-white/10"
          >
            <span>Join Waitlist ({product.waitlistCount || 120}+)</span>
          </button>
        )}
      </div>
    </div>
  );
}
