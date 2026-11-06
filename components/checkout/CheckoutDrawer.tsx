'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  ShieldCheck,
  QrCode,
  CreditCard,
  Truck,
  Zap,
} from 'lucide-react';
import { PaymentMethod } from '@/types';

export default function CheckoutDrawer() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutProduct,
    activeLock,
    releaseLock,
    completeCheckout,
    user,
  } = useApp();

  const [activeTab, setActiveTab] = useState<PaymentMethod>('upi');

  // Tokenized Card form state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');
  const [cardName, setCardName] = useState(user.name.toUpperCase());

  // COD OTP State
  const [demoOtp, setDemoOtp] = useState('4829');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  useEffect(() => {
    if (isCheckoutOpen) {
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setDemoOtp(randomOtp);
      setEnteredOtp('');
      setOtpError(false);
      setCardName(user.name.toUpperCase());
    }
  }, [isCheckoutOpen, user.name]);

  if (!isCheckoutOpen || !checkoutProduct) return null;

  const { product, size } = checkoutProduct;
  const remainingSecs = activeLock ? activeLock.remainingSeconds : 600;
  const minutes = Math.floor(remainingSecs / 60);
  const seconds = remainingSecs % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = Math.max(0, Math.min(100, (remainingSecs / 600) * 100));

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5A1F', '#CCFF00', '#721133', '#FFFFFF'],
      });
    } catch {}
  };

  const handleUpiPay = () => {
    triggerCelebration();
    completeCheckout('upi', `UPI ID: ${user.email.split('@')[0]}@okaxis`);
  };

  const handleCardPay = () => {
    triggerCelebration();
    completeCheckout('card', `Card Ending in 4242 • Exp: ${cardExpiry}`);
  };

  const handleCodPay = () => {
    if (enteredOtp.trim() !== demoOtp) {
      setOtpError(true);
      return;
    }
    setOtpError(false);
    triggerCelebration();
    completeCheckout('cod', `Verified via OTP [${demoOtp}] • Cash on Delivery`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg h-full bg-[#15151D] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden">
        {/* Sticky 10-Minute Countdown Banner */}
        <div className="sticky top-0 z-20 bg-[#1C1C26] border-b border-white/10 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#CCFF00]" />
              </span>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                  Cart Lock Reserved For You:
                </span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#CCFF00]" />
                  <span className="font-mono text-xl font-bold text-[#CCFF00]">
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (activeLock) releaseLock(activeLock.id);
                  else setIsCheckoutOpen(false);
                }}
                className="text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                Release
              </button>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mt-2.5">
            <div
              className="h-full bg-gradient-to-r from-[#CCFF00] to-[#FF5A1F] transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Drawer Body Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Item Summary */}
          <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 flex gap-3.5 items-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {product.brand}
              </span>
              <h4 className="font-heading font-semibold text-base text-white truncate">
                {product.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5 text-xs font-mono">
                <span className="px-1.5 py-0.2 rounded bg-white/10 text-[#CCFF00] font-bold">
                  Size: {size}
                </span>
                <span className="text-zinc-400">Qty: 1</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-heading text-xl font-bold text-white">
                ₹{product.price}
              </span>
              <div className="text-[10px] font-mono text-[#CCFF00]">Free Delivery</div>
            </div>
          </div>

          {/* Guarantee Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-xs font-mono text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-[#CCFF00] shrink-0" />
            <span>
              Zero-Oversell: Locked strictly in your session. Won't sell out while you pay.
            </span>
          </div>

          {/* Payment Tabs */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold mb-2">
              Choose Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'upi'
                    ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-[#FF5A1F] shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span className="text-xs font-mono">UPI QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'card'
                    ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-[#FF5A1F] shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-mono">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cod')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'cod'
                    ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-[#FF5A1F] shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-xs font-mono">Cash on Delivery</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Dynamic UPI QR */}
          {activeTab === 'upi' && (
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center space-y-3">
              <div className="p-2.5 bg-white rounded-xl shadow-lg flex items-center justify-center">
                <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="#FFFFFF" />
                  <rect x="10" y="10" width="25" height="25" fill="#0E0E12" />
                  <rect x="14" y="14" width="17" height="17" fill="#FFFFFF" />
                  <rect x="18" y="18" width="9" height="9" fill="#0E0E12" />

                  <rect x="65" y="10" width="25" height="25" fill="#0E0E12" />
                  <rect x="69" y="14" width="17" height="17" fill="#FFFFFF" />
                  <rect x="73" y="18" width="9" height="9" fill="#0E0E12" />

                  <rect x="10" y="65" width="25" height="25" fill="#0E0E12" />
                  <rect x="14" y="69" width="17" height="17" fill="#FFFFFF" />
                  <rect x="18" y="73" width="9" height="9" fill="#0E0E12" />

                  <rect x="40" y="14" width="6" height="6" fill="#0E0E12" />
                  <rect x="52" y="14" width="6" height="6" fill="#0E0E12" />
                  <rect x="40" y="26" width="6" height="6" fill="#0E0E12" />
                  <rect x="52" y="26" width="6" height="6" fill="#0E0E12" />
                  <rect x="14" y="44" width="6" height="6" fill="#0E0E12" />
                  <rect x="26" y="44" width="6" height="6" fill="#0E0E12" />
                  <rect x="38" y="44" width="6" height="6" fill="#0E0E12" />
                  <rect x="50" y="44" width="6" height="6" fill="#0E0E12" />
                  <rect x="62" y="44" width="6" height="6" fill="#0E0E12" />
                  <rect x="74" y="44" width="6" height="6" fill="#0E0E12" />

                  <rect x="40" y="62" width="6" height="6" fill="#0E0E12" />
                  <rect x="52" y="62" width="6" height="6" fill="#0E0E12" />
                  <rect x="64" y="62" width="6" height="6" fill="#0E0E12" />
                  <rect x="52" y="74" width="6" height="6" fill="#0E0E12" />
                  <rect x="74" y="74" width="6" height="6" fill="#0E0E12" />

                  <circle cx="50" cy="50" r="9" fill="#FF5A1F" />
                  <rect x="47" y="47" width="6" height="6" fill="#FFFFFF" />
                </svg>
              </div>

              <div>
                <span className="text-[11px] font-mono text-zinc-400">
                  Scan with GPay, PhonePe, Paytm, or BHIM
                </span>
                <div className="font-mono text-xs text-white font-bold mt-0.5">
                  fitandflash@okhdfcbank
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpiPay}
                className="w-full py-3 px-4 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-heading font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20 transition-all transform hover:scale-[1.01]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>[Demo: Simulate UPI Payment Success]</span>
              </button>
            </div>
          )}

          {/* TAB 2: Tokenized Card */}
          {activeTab === 'card' && (
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-3 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">CVV</label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white uppercase"
                />
              </div>

              <button
                type="button"
                onClick={handleCardPay}
                className="w-full py-3 px-4 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-heading font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20 transition-all mt-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{product.price} via Card</span>
              </button>
            </div>
          )}

          {/* TAB 3: OTP-Verified COD */}
          {activeTab === 'cod' && (
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-xl border border-white/10">
                <span className="text-zinc-400">Demo OTP code:</span>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(demoOtp)}
                  className="px-2.5 py-1 rounded bg-[#FF5A1F] text-white font-bold tracking-widest text-xs"
                >
                  {demoOtp}
                </button>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Enter 4-Digit Verification OTP:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 4829"
                    value={enteredOtp}
                    onChange={(e) => {
                      setEnteredOtp(e.target.value);
                      setOtpError(false);
                    }}
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-center text-lg font-bold tracking-widest text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setEnteredOtp(demoOtp)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300"
                  >
                    Auto-fill
                  </button>
                </div>
                {otpError && (
                  <p className="text-red-400 text-[11px] mt-1">Please enter {demoOtp}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleCodPay}
                className="w-full py-3 px-4 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-heading font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20 transition-all mt-2"
              >
                <Truck className="w-4 h-4" />
                <span>Confirm Cash on Delivery (₹{product.price})</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#121217] px-5 py-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Zero-Oversell Protection Active</span>
          <span>Fit&amp;Flash Secured</span>
        </div>
      </div>
    </div>
  );
}
