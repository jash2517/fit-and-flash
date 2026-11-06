'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, ArrowRight, MessageCircle } from 'lucide-react';

export default function WhatsAppNotification() {
  const { isWhatsAppOpen, setIsWhatsAppOpen, latestOrder, user, setActiveSection } = useApp();

  if (!isWhatsAppOpen || !latestOrder) return null;

  const order = latestOrder;
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleGoToOrders = () => {
    setIsWhatsAppOpen(false);
    setActiveSection('orders');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#0c1317] border border-[#25d366]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* WhatsApp App Header */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-md">
              <MessageCircle className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white tracking-wide">
                  Fit&amp;Flash Concierge
                </span>
                <span className="w-3 h-3 rounded-full bg-[#00a884] flex items-center justify-center text-[8px] text-white">
                  ✓
                </span>
              </div>
              <span className="text-[10px] text-[#00a884] font-mono">
                Official WhatsApp Channel
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWhatsAppOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0b141a] text-xs">
          <div className="text-center">
            <span className="bg-[#182229] text-zinc-400 text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase">
              Today • Order Confirmed
            </span>
          </div>

          {/* Incoming Message Bubble */}
          <div className="bg-[#202c33] rounded-xl rounded-tl-sm p-3.5 text-zinc-200 shadow-md space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-white/10 pb-1.5">
              <span className="text-[#CCFF00] font-bold">STOCK LOCK CONFIRMED</span>
              <span className="text-zinc-400">{timeString}</span>
            </div>

            <p className="text-white text-xs leading-relaxed">
              Hi <strong className="text-[#CCFF00]">{user.name}</strong>! Your order for{' '}
              <strong className="text-white">"{order.productTitle}"</strong> [Size {order.size}] has been confirmed and reserved.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#111b21] p-2.5 rounded-lg border border-white/10 space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">Tracking ID:</span>
                <span className="text-[#CCFF00] font-bold">{order.trackingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Hub Dispatch:</span>
                <span className="text-white font-medium">{order.hubLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Delivery:</span>
                <span className="text-[#25d366] font-bold">Express 24h</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-1.5 text-xs">
                <span className="text-zinc-300">Total Paid:</span>
                <span className="text-[#CCFF00] font-bold font-heading text-sm">₹{order.price}</span>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Payment:</span>
                <span className="text-white uppercase">{order.paymentMethod}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-normal">
              If the size doesn’t fit, you can easily exchange or return it to your nearest city hub in 24 hours.
            </p>

            <div className="text-right flex items-center justify-end gap-1 text-[9px] text-zinc-400">
              <span>{timeString}</span>
              <span className="text-[#53bdeb] font-bold">✓✓</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#202c33] p-3 border-t border-white/5 space-y-1.5">
          <button
            type="button"
            onClick={handleGoToOrders}
            className="w-full py-2.5 px-3 rounded-xl bg-[#25d366] hover:bg-[#25d366]/90 text-black font-heading font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>View My Orders &amp; Returns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsWhatsAppOpen(false)}
            className="w-full py-1 text-[11px] font-mono text-zinc-400 hover:text-white text-center"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
