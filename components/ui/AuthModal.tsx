'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { DEMO_USERS } from '@/data/initialProducts';
import { X, Users, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, switchUserRole } = useApp();
  const [selectedRoleType, setSelectedRoleType] = useState<'shopper' | 'merchant'>('shopper');

  if (!isAuthModalOpen) return null;

  const handleSelectUser = (role: UserRole) => {
    switchUserRole(role);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#16161D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Fit&Flash Logo" className="w-6 h-6 object-contain" />
            <h3 className="font-heading text-lg font-semibold text-white">
              Switch User Account
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Role Filter Tabs */}
          <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setSelectedRoleType('shopper')}
              className={`py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedRoleType === 'shopper'
                  ? 'bg-[#FF5A1F] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleType('merchant')}
              className={`py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedRoleType === 'merchant'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Merchant</span>
            </button>
          </div>

          {/* Compact Demo Users List (No photos, clean initials, decent names) */}
          <div className="space-y-2">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
              Select Demo Account:
            </span>

            {/* Shopper A */}
            <button
              type="button"
              onClick={() => handleSelectUser('shopper-a')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                user.role === 'shopper-a'
                  ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FF5A1F]/20 text-[#FF5A1F] flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div>
                  <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                    <span>Aarav Sharma</span>
                    {user.role === 'shopper-a' && (
                      <span className="text-[9px] bg-[#CCFF00] text-black px-1.5 py-0.2 rounded font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Shopper • Bengaluru Hub
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Shopper B */}
            <button
              type="button"
              onClick={() => handleSelectUser('shopper-b')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                user.role === 'shopper-b'
                  ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#721133]/40 text-pink-300 flex items-center justify-center font-bold text-xs">
                  RM
                </div>
                <div>
                  <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                    <span>Rohan Mehta</span>
                    {user.role === 'shopper-b' && (
                      <span className="text-[9px] bg-[#CCFF00] text-black px-1.5 py-0.2 rounded font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Shopper • Mumbai Hub
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Merchant */}
            <button
              type="button"
              onClick={() => handleSelectUser('merchant')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                user.role === 'merchant'
                  ? 'bg-purple-600/20 border-purple-500 text-white'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                    <span>Store Manager</span>
                    {user.role === 'merchant' && (
                      <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.2 rounded font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Merchant Console &amp; Simulator
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {/* Quick simulated Google Login */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => handleSelectUser('shopper-a')}
              className="w-full py-2 px-3 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
