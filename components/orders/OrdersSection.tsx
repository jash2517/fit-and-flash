'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Package,
  CheckCircle2,
  RefreshCw,
  MessageCircle,
  Building2,
  Tag,
} from 'lucide-react';
import ReturnTagScanModal from './ReturnTagScanModal';

export default function OrdersSection() {
  const {
    orders,
    user,
    openReturnModal,
    setLatestOrder,
    setIsWhatsAppOpen,
    setActiveSection,
  } = useApp();

  const userOrders = orders.filter((o) => o.userRole === user.role || o.userRole === 'shopper-a');

  const handleOpenReceipt = (order: typeof orders[0]) => {
    setLatestOrder(order);
    setIsWhatsAppOpen(true);
  };

  return (
    <section className="relative w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <ReturnTagScanModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-white">
            My Orders &amp; Local Returns
          </h2>
        </div>

        <div className="text-xs font-mono text-zinc-400">
          Logged in as: <strong className="text-white">{user.name}</strong>
        </div>
      </div>

      {/* Orders List */}
      {userOrders.length > 0 ? (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const isDelivered = order.status === 'Delivered';
            const isReturnRequested = order.status === 'Return Requested';
            const isReturned = order.status === 'Returned to Vault';

            return (
              <div
                key={order.id}
                className="bg-[#171720] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all"
              >
                {/* Order Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-3 text-zinc-400">
                    <span>Order: <strong className="text-white">{order.id}</strong></span>
                    <span>•</span>
                    <span>Tracking: <strong className="text-[#CCFF00]">{order.trackingId}</strong></span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border ${
                      isDelivered
                        ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30'
                        : isReturnRequested
                        ? 'bg-[#FF5A1F]/15 text-[#FF5A1F] border-[#FF5A1F]/40'
                        : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {order.status}
                  </span>
                </div>

                {/* Product Detail Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={order.productImage}
                      alt={order.productTitle}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="font-heading font-semibold text-base text-white truncate">
                        {order.productTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <span className="px-1.5 py-0.2 rounded bg-white/10 text-white font-bold">
                          Size: {order.size}
                        </span>
                        <span>Paid: <strong className="text-[#CCFF00]">₹{order.price}</strong></span>
                        <span>•</span>
                        <span className="uppercase">{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenReceipt(order)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono flex items-center gap-1.5 border border-white/10"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" />
                      <span>WhatsApp Receipt</span>
                    </button>

                    {isDelivered && order.canReturn && (
                      <button
                        type="button"
                        onClick={() => openReturnModal(order)}
                        className="px-4 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-heading font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Request Return to Local Store</span>
                      </button>
                    )}

                    {isReturnRequested && (
                      <span className="text-xs font-mono text-[#FF5A1F] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping" />
                        Tag Verified • Awaiting Hub Restock
                      </span>
                    )}

                    {isReturned && (
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        Restocked to Local Vault (10% Off)
                      </span>
                    )}
                  </div>
                </div>

                {/* Hub Information */}
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    <span>Fulfillment Hub: <strong className="text-white">{order.hubLocation}</strong></span>
                  </div>
                  <div>
                    <span>Garment Tag: <strong className="text-zinc-200">{order.rfidTag || 'TAG-9842-TEE-L'}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#171720] p-12 rounded-2xl border border-white/10 text-center space-y-3">
          <Package className="w-12 h-12 text-zinc-500 mx-auto" />
          <h3 className="font-heading text-lg text-white">No orders placed yet in this session</h3>
          <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto">
            Choose any item from the Live Drops to experience the 10-minute cart lock and 3D fit!
          </p>
          <button
            type="button"
            onClick={() => setActiveSection('storefront')}
            className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white font-heading font-semibold text-xs inline-flex items-center gap-1.5"
          >
            Browse Drops
          </button>
        </div>
      )}
    </section>
  );
}
