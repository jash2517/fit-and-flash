'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import FitStudioCanvas from '@/components/3d/FitStudioCanvas';
import { X, Lock, Flame, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

export default function FitStudioModal() {
  const {
    isFitStudioOpen,
    setIsFitStudioOpen,
    selectedFitProduct,
    userDimensions,
    setUserDimensions,
    calculateFitMatch,
    lockStock,
    joinWaitlist,
  } = useApp();

  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!isFitStudioOpen || !selectedFitProduct) return null;

  const product = selectedFitProduct;
  const currentSize = selectedSize || product.availableSizes[0] || 'L';

  const fitResult = calculateFitMatch(product, currentSize, userDimensions);
  const isSneaker = product.modelType === 'sneaker';
  const isSoldOut = product.status === 'sold-out' || product.stockCount <= 0;

  const handleLockAndBuy = () => {
    const res = lockStock(product, currentSize);
    if (res.success) {
      setIsFitStudioOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#15151D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Fit&Flash Logo" className="w-6 h-6 object-contain" />
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                {product.brand}
              </span>
              <h2 className="text-base sm:text-lg font-heading font-semibold text-white">
                3D Smart Fit Studio
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFitStudioOpen(false)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5">
          {/* 3D Viewport (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <FitStudioCanvas
              product={product}
              selectedSize={currentSize}
              dimensions={userDimensions}
              fitResult={fitResult}
            />

            <div className="bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">
                Fabric: <strong className="text-zinc-200">{product.fabricSpec || '100% Combed Heavy Cotton'}</strong>
              </span>
              <span className="text-zinc-400">
                Batch: <strong className="text-[#CCFF00]">{product.batchCode || 'DROP-01'}</strong>
              </span>
            </div>
          </div>

          {/* Sizing & Controls (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {/* Product Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF5A1F]/15 text-[#FF5A1F] border border-[#FF5A1F]/30 uppercase">
                    {product.status.replace('-', ' ')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs font-mono text-zinc-500 line-through">
                      MSRP: ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-white">
                  {product.title}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-heading text-[#CCFF00] font-bold">
                    ₹{product.price}
                  </span>
                  {product.discount && (
                    <span className="text-[10px] font-mono text-[#FF5A1F] font-bold px-1.5 py-0.5 rounded bg-[#FF5A1F]/15">
                      -{product.discount}% Local Hub Discount
                    </span>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1.5">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.availableSizes.map((size) => {
                    const isSelected = size === currentSize;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[42px] py-1.5 px-2.5 rounded-lg font-mono text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-sm'
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body Sliders */}
              <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-white">
                    <Sliders className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    <span>Your Measurements</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#CCFF00]">
                    Mesh Updates Live
                  </span>
                </div>

                {!isSneaker ? (
                  <>
                    <div>
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-zinc-400">Chest Size:</span>
                        <span className="text-[#CCFF00] font-bold">{userDimensions.chest} cm</span>
                      </div>
                      <input
                        type="range"
                        min="84"
                        max="126"
                        value={userDimensions.chest}
                        onChange={(e) =>
                          setUserDimensions((prev) => ({
                            ...prev,
                            chest: parseInt(e.target.value),
                          }))
                        }
                        className="w-full accent-[#FF5A1F] cursor-pointer h-1 bg-zinc-800 rounded appearance-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-zinc-400">Waist Size:</span>
                        <span className="text-[#CCFF00] font-bold">{userDimensions.waist} cm</span>
                      </div>
                      <input
                        type="range"
                        min="64"
                        max="108"
                        value={userDimensions.waist}
                        onChange={(e) =>
                          setUserDimensions((prev) => ({
                            ...prev,
                            waist: parseInt(e.target.value),
                          }))
                        }
                        className="w-full accent-[#FF5A1F] cursor-pointer h-1 bg-zinc-800 rounded appearance-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-zinc-400">Height:</span>
                        <span className="text-[#CCFF00] font-bold">{userDimensions.height} cm</span>
                      </div>
                      <input
                        type="range"
                        min="155"
                        max="205"
                        value={userDimensions.height}
                        onChange={(e) =>
                          setUserDimensions((prev) => ({
                            ...prev,
                            height: parseInt(e.target.value),
                          }))
                        }
                        className="w-full accent-[#FF5A1F] cursor-pointer h-1 bg-zinc-800 rounded appearance-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-zinc-400">Foot Length:</span>
                        <span className="text-[#CCFF00] font-bold">{userDimensions.footLength} cm</span>
                      </div>
                      <input
                        type="range"
                        min="23"
                        max="31"
                        step="0.5"
                        value={userDimensions.footLength || 27.5}
                        onChange={(e) =>
                          setUserDimensions((prev) => ({
                            ...prev,
                            footLength: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-[#FF5A1F] cursor-pointer h-1 bg-zinc-800 rounded appearance-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-zinc-400">Foot Width:</span>
                        <span className="text-[#CCFF00] font-bold">{userDimensions.footWidth} cm</span>
                      </div>
                      <input
                        type="range"
                        min="8.5"
                        max="12"
                        step="0.2"
                        value={userDimensions.footWidth || 10.2}
                        onChange={(e) =>
                          setUserDimensions((prev) => ({
                            ...prev,
                            footWidth: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-[#FF5A1F] cursor-pointer h-1 bg-zinc-800 rounded appearance-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#FF5A1F] font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {isSoldOut ? 'Sold Out' : `Only ${product.stockCount} left in stock`}
                </span>
                <span className="text-zinc-400">
                  Cart Lock Time: <strong>10:00 mins</strong>
                </span>
              </div>

              {!isSoldOut ? (
                <button
                  type="button"
                  onClick={handleLockAndBuy}
                  className="w-full py-3 px-4 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-heading font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20 transition-all transform hover:scale-[1.01]"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock Item for 10:00 &amp; Buy (₹{product.price})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => joinWaitlist(product.id)}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-semibold text-base flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                  <span>Join Waitlist ({product.waitlistCount || 100}+ waiting)</span>
                </button>
              )}

              <p className="text-[10px] font-mono text-zinc-400 text-center">
                Locking reserves this physical piece for 10 minutes so no one else can purchase it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
