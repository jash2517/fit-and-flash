'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Activity,
  Lock,
  DollarSign,
  TrendingUp,
  Truck,
  Plus,
  Play,
  Square,
  Clock,
  Terminal,
  CheckCircle2,
  Trash2,
  Package,
} from 'lucide-react';

export default function MerchantConsole() {
  const {
    products,
    updateProductStock,
    triggerFlashDrop,
    addNewProduct,
    trafficSimulatorRunning,
    toggleTrafficSimulator,
    events,
    clearEvents,
    stats,
    returns,
    merchantApproveReturn,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(1499);
  const [newCategory, setNewCategory] = useState<'t-shirts' | 'hoodies' | 'shirts' | 'denim' | 'sneakers'>('t-shirts');
  const [newStock, setNewStock] = useState(15);
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addNewProduct({
      title: newTitle,
      brand: 'Fit&Flash Studio',
      category: newCategory,
      price: newPrice,
      originalPrice: newPrice + 500,
      stockCount: newStock,
      initialStock: newStock,
      status: 'live',
      image: newImage,
      gallery: [newImage],
      countdownSeconds: 7200,
      dropEndTime: Date.now() + 7200 * 1000,
      description: 'Exclusive streetwear piece. Heavy combed cotton with true relaxed fit.',
      details: ['300 GSM Heavy cotton', 'Double-needle seams', 'Pre-shrunk wash'],
      modelType: newCategory === 'sneakers' ? 'sneaker' : newCategory === 'denim' ? 'denim' : 'apparel',
      availableSizes: newCategory === 'sneakers' ? ['UK 8', 'UK 9', 'UK 10'] : ['S', 'M', 'L', 'XL'],
      batchCode: `DROP-${Math.floor(10 + Math.random() * 90)}-BLR`,
    });

    setIsAddModalOpen(false);
    setNewTitle('');
  };

  const pendingReturns = returns.filter((r) => r.status === 'scanned_and_routed');

  return (
    <section className="relative w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Merchant Control Bar */}
      <div className="bg-[#171720] p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping" />
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Store Operations Dashboard
            </span>
          </div>
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-white">
            Merchant Ops &amp; Live Simulator
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Monitor real-time cart reservations, background traffic, and local returns.
          </p>
        </div>

        {/* Live Traffic Simulator Toggle */}
        <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/10 shrink-0">
          <div>
            <span className="text-xs font-mono font-bold text-white block">
              Traffic Simulator
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {trafficSimulatorRunning ? 'Simulating 500+ shoppers' : 'Simulator Standby'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTrafficSimulator}
            className={`px-4 py-2 rounded-lg font-heading font-semibold text-xs flex items-center gap-2 transition-all shadow-md ${
              trafficSimulatorRunning
                ? 'bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white animate-pulse'
                : 'bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-black'
            }`}
          >
            {trafficSimulatorRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Simulator</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Simulator</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#171720] p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>ACTIVE 10-MIN LOCKS</span>
            <Lock className="w-4 h-4 text-[#CCFF00]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-semibold text-3xl text-[#CCFF00]">
              {stats.activeLocksCount}
            </span>
            <span className="text-xs font-mono text-zinc-400">carts holding stock</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            Zero-oversell memory reserves
          </div>
        </div>

        <div className="bg-[#171720] p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>TOTAL REVENUE</span>
            <span className="text-sm font-bold text-white">₹</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-semibold text-3xl text-white">
              ₹{stats.totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-[#CCFF00] font-bold">+24%</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            Simulated UPI, Card &amp; COD
          </div>
        </div>

        <div className="bg-[#171720] p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>CHECKOUT RATE</span>
            <TrendingUp className="w-4 h-4 text-[#FF5A1F]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-semibold text-3xl text-[#FF5A1F]">
              {stats.conversionRate}%
            </span>
            <span className="text-xs font-mono text-zinc-400">conversion</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            No cart drop-offs from stock race
          </div>
        </div>

        <div className="bg-[#171720] p-4 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>LOCAL VAULT STOCK</span>
            <Truck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-semibold text-3xl text-purple-400">
              {stats.vaultItemsCount}
            </span>
            <span className="text-xs font-mono text-zinc-400">items in city hubs</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            24hr neighborhood re-orders
          </div>
        </div>
      </div>

      {/* Return Approval Queue */}
      <div className="bg-[#171720] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-[#FF5A1F]" />
            <div>
              <h3 className="font-heading font-semibold text-lg text-white">
                Incoming Local Returns Approval Queue
              </h3>
              <span className="text-xs font-mono text-zinc-400">
                Customer tag-verified returns ready to be restocked in the Local Vault at 10% off.
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F] text-xs font-mono font-bold">
            {pendingReturns.length} Pending
          </span>
        </div>

        {pendingReturns.length > 0 ? (
          <div className="space-y-3">
            {pendingReturns.map((item) => (
              <div
                key={item.id}
                className="bg-black/40 p-3.5 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <h4 className="font-heading font-semibold text-base text-white">
                      {item.productTitle}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                      <span>Size: <strong className="text-white">{item.size}</strong></span>
                      <span>•</span>
                      <span>Original: <strong className="text-white">₹{item.price}</strong></span>
                      <span>•</span>
                      <span>Hub: <strong className="text-[#CCFF00]">{item.hubLocation}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => merchantApproveReturn(item.id)}
                  className="px-4 py-2 rounded-xl bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-black font-heading font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm self-start sm:self-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify &amp; Publish to Local Vault (10% Off)</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs font-mono text-zinc-500">
            All customer returns are currently processed &amp; published to the local vault.
          </div>
        )}
      </div>

      {/* Terminal Live Event Stream + Inventory Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Terminal */}
        <div className="lg:col-span-7 bg-[#171720] p-5 rounded-2xl border border-white/10 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#CCFF00]" />
              <h3 className="font-heading font-semibold text-base text-white">
                Live Activity Stream
              </h3>
            </div>
            <button
              type="button"
              onClick={clearEvents}
              className="text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <div className="flex-1 bg-black/60 rounded-xl p-3 font-mono text-xs overflow-y-auto max-h-[340px] space-y-2">
            {events.length > 0 ? (
              events.map((evt) => {
                let badgeColor = 'text-blue-400 bg-blue-500/10';
                if (evt.status === 'success') badgeColor = 'text-[#CCFF00] bg-[#CCFF00]/10';
                if (evt.status === 'warn') badgeColor = 'text-[#FF5A1F] bg-[#FF5A1F]/10';

                return (
                  <div key={evt.id} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-zinc-500 shrink-0">[{evt.timestamp}]</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${badgeColor}`}>
                      {evt.action}
                    </span>
                    <span className="text-white font-semibold shrink-0">{evt.user}:</span>
                    <span className="text-zinc-400 truncate">{evt.details}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-zinc-600 text-center py-8">
                Listening for shopper actions...
              </div>
            )}
          </div>
        </div>

        {/* Drop Inventory Controls */}
        <div className="lg:col-span-5 bg-[#171720] p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FF5A1F]" />
                <h3 className="font-heading font-semibold text-base text-white">
                  Quick Restock &amp; Timer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-[#FF5A1F] text-white font-mono text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>New Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {products.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-2 text-xs font-mono"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-semibold truncate">{p.title}</h4>
                    <span className="text-zinc-400 text-[11px]">
                      Stock: <strong className="text-[#CCFF00]">{p.stockCount}</strong> • ₹{p.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateProductStock(p.id, p.stockCount + 5)}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      title="Restock +5 units"
                    >
                      +5
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerFlashDrop(p.id, 30)}
                      className="px-2 py-0.5 rounded bg-[#FF5A1F]/20 text-[#FF5A1F] font-bold text-xs flex items-center gap-1"
                      title="Set 30-min countdown"
                    >
                      <Clock className="w-3 h-3" />
                      30m
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-zinc-500 text-center">
            Changes sync instantly to customer storefront
          </div>
        </div>
      </div>

      {/* Add New Drop Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#161620] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="font-heading font-semibold text-lg text-white">
                Add Streetwear Drop
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Item Title</label>
                <input
                  type="text"
                  placeholder="e.g. Acid Wash Oversized Hoodie"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="t-shirts">T-Shirts</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="shirts">Shirts</option>
                    <option value="denim">Denim</option>
                    <option value="sneakers">Sneakers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value))}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Initial Stock Units</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-heading font-semibold text-sm mt-2"
              >
                Publish Live Drop
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
