'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-white/10';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-neonAcid/40 shadow-[0_0_20px_rgba(204,255,0,0.2)]';
          icon = <CheckCircle2 className="w-5 h-5 text-neonAcid shrink-0" />;
        } else if (toast.type === 'warn') {
          borderClass = 'border-cyberOrange/40 shadow-[0_0_20px_rgba(255,77,0,0.2)]';
          icon = <AlertTriangle className="w-5 h-5 text-cyberOrange shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-red-500/40';
          icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto liquid-glass px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-xs font-mono text-white ${borderClass} animate-fadeIn transition-all`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icon}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

