'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Camera,
  CheckCircle2,
  Scan,
  RefreshCw,
  Building2,
  Zap,
} from 'lucide-react';

export default function ReturnTagScanModal() {
  const {
    isReturnModalOpen,
    setIsReturnModalOpen,
    orderToReturn,
    submitReturnScan,
  } = useApp();

  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [scannedTag, setScannedTag] = useState('');

  if (!isReturnModalOpen || !orderToReturn) return null;

  const order = orderToReturn;
  const targetHub = order.hubLocation || 'Bengaluru Hub - Indiranagar';
  const tagCode = order.rfidTag || `TAG-9842-${order.size}`;

  const handleSimulateScan = () => {
    setScanStep('scanning');
    setTimeout(() => {
      setScannedTag(tagCode);
      setScanStep('verified');
      setTimeout(() => {
        submitReturnScan(order.id, tagCode);
        setScanStep('idle');
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#161620] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-[#FF5A1F]" />
            <h3 className="font-heading text-base font-semibold text-white">
              Scan Garment Return Tag
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsReturnModalOpen(false);
              setScanStep('idle');
            }}
            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Item details */}
          <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center gap-3">
            <img
              src={order.productImage}
              alt={order.productTitle}
              className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-semibold text-sm text-white truncate">
                {order.productTitle}
              </h4>
              <span className="text-[#CCFF00] font-bold">
                Size {order.size} • ₹{order.price}
              </span>
            </div>
            <div className="text-right text-[10px] text-zinc-400">
              <span className="block text-zinc-300 font-bold">Return Hub:</span>
              <span className="text-[#FF5A1F]">{targetHub.split(' - ')[0]}</span>
            </div>
          </div>

          {/* Camera Viewport Simulation */}
          <div className="relative w-full h-48 bg-black/80 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
            {/* Reticle */}
            <div className="relative z-10 w-36 h-36 border border-dashed border-[#FF5A1F]/60 rounded-xl flex flex-col items-center justify-center p-3">
              {scanStep === 'idle' && (
                <div className="text-center space-y-1.5">
                  <Camera className="w-6 h-6 text-zinc-400 mx-auto" />
                  <p className="text-[10px] text-zinc-400">
                    Point camera at original garment tag
                  </p>
                </div>
              )}

              {scanStep === 'scanning' && (
                <div className="text-center space-y-1.5">
                  <RefreshCw className="w-6 h-6 text-[#CCFF00] mx-auto animate-spin" />
                  <p className="text-[10px] text-[#CCFF00] font-bold">
                    Verifying authentic tag code...
                  </p>
                </div>
              )}

              {scanStep === 'verified' && (
                <div className="text-center space-y-1.5">
                  <CheckCircle2 className="w-8 h-8 text-[#CCFF00] mx-auto" />
                  <p className="text-[10px] text-[#CCFF00] font-bold">
                    Tag Verified Genuine!
                  </p>
                </div>
              )}
            </div>

            <div className="absolute bottom-2 right-2 text-[9px] text-zinc-400 bg-black/60 px-2 py-0.5 rounded">
              Camera Simulator
            </div>
          </div>

          {/* Hub routing note */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#FF5A1F]" />
              <div>
                <span className="text-zinc-400 block text-[10px]">Local Hub Routing:</span>
                <span className="text-white font-bold">{targetHub}</span>
              </div>
            </div>
            <span className="text-[#CCFF00] font-bold text-[11px]">Instant 100% Refund</span>
          </div>

          {/* Action button */}
          <button
            type="button"
            disabled={scanStep !== 'idle'}
            onClick={handleSimulateScan}
            className="w-full py-3 px-4 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 disabled:opacity-50 text-white font-heading font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>
              {scanStep === 'idle'
                ? '[Simulate Tag Scan]'
                : scanStep === 'scanning'
                ? 'Verifying Tag Authenticity...'
                : 'Verified! Routing to Hub...'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
