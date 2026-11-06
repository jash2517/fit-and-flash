'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Header from '@/components/ui/Header';
import ImmersiveHero from '@/components/hero/ImmersiveHero';
import ProductCard from '@/components/storefront/ProductCard';
import BrandStory from '@/components/storefront/BrandStory';
import FitStudioModal from '@/components/storefront/FitStudioModal';
import CheckoutDrawer from '@/components/checkout/CheckoutDrawer';
import WhatsAppNotification from '@/components/checkout/WhatsAppNotification';
import AuthModal from '@/components/ui/AuthModal';
import LocalVaultSection from '@/components/vault/LocalVaultSection';
import OrdersSection from '@/components/orders/OrdersSection';
import MerchantConsole from '@/components/merchant/MerchantConsole';
import Footer from '@/components/ui/Footer';
import { Search, Layers } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Drops' },
  { id: 't-shirts', label: 'T-Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'shirts', label: 'Shirts' },
  { id: 'denim', label: 'Denim' },
  { id: 'sneakers', label: 'Sneakers' },
];

export default function HomePage() {
  const { products, activeSection, setActiveSection } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleScrollToProducts = () => {
    const el = document.getElementById('products-catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter products for storefront view
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'live' && (p.status !== 'live' || p.stockCount <= 0)) return false;
      if (statusFilter === 'sold-out' && (p.status !== 'sold-out' && p.stockCount > 0)) return false;
      if (statusFilter === 'local-vault' && p.status !== 'local-vault') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchDesc) return false;
    }
    return true;
  });

  return (
    <main className="min-h-screen flex flex-col bg-[#000000] text-[#f5f5f7] selection:bg-[#0071e3] selection:text-white">
      {/* Global Apple Commerce Navigation */}
      <Header />

      {/* Screen Routing */}
      <div className="flex-1">
        {/* SCREEN 1: Storefront with Full-Screen Immersive Scrollytelling Hero */}
        {activeSection === 'storefront' && (
          <>
            {/* 100vh Full-Bleed Immersive Hero: Jumping Mascot on Minimalist Pure Black Stage */}
            <ImmersiveHero onExplore={handleScrollToProducts} />

            {/* Products Exhibition Bays Section with Parallax Transition */}
            <section
              id="products-catalog-section"
              className="w-full bg-[#111111] border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8 space-y-8"
            >
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Section Title & Parallax Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#86868b] uppercase tracking-widest block mb-1">
                      Architectural Drops • Curated Exhibition
                    </span>
                    <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-[#f5f5f7] tracking-tight">
                      Flash Drops &amp; Archival Collection
                    </h2>
                  </div>

                  <div className="text-xs font-mono text-[#86868b]">
                    Showing <strong className="text-white">{filteredProducts.length}</strong> limited pieces (₹2,199 - ₹4,799)
                  </div>
                </div>

                {/* Apple-Style Pill Filters & Search Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#1d1d1f] p-3 sm:p-4 rounded-[28px] border border-white/5">
                  {/* Pill Search Input with 980px Radius */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                    <input
                      type="text"
                      placeholder="Search drops, denim, sneakers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs font-mono text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-all shrink-0 border ${
                          selectedCategory === cat.id
                            ? 'bg-[#0071e3] text-white border-[#0071e3] font-semibold'
                            : 'bg-white/5 text-[#86868b] border-white/10 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center gap-1 shrink-0">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'live', label: 'Live Drops' },
                      { id: 'local-vault', label: 'Vault (10% Off)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStatusFilter(s.id)}
                        className={`px-3 py-1.5 rounded-full font-mono text-xs border ${
                          statusFilter === s.id
                            ? 'bg-white text-black border-white font-semibold'
                            : 'bg-white/5 text-[#86868b] border-white/10'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 28px Rounded Media Tiles Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#161616] rounded-[28px] p-12 text-center space-y-3 border border-white/10">
                    <Layers className="w-10 h-10 text-zinc-500 mx-auto" />
                    <h3 className="font-heading text-lg text-white">No drops match your filters</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('all');
                        setStatusFilter('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 rounded-full bg-[#0071e3] text-white font-sans text-xs font-semibold"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Apple-Style Exhibition Storytelling Section */}
            <BrandStory />
          </>
        )}

        {/* SCREEN 5: Local Vault */}
        {activeSection === 'vault' && <LocalVaultSection />}

        {/* SCREEN 6: My Orders */}
        {activeSection === 'orders' && <OrdersSection />}

        {/* SCREEN 7: Merchant Console */}
        {activeSection === 'merchant' && <MerchantConsole />}
      </div>

      {/* Global Modals & Drawers */}
      <FitStudioModal />
      <CheckoutDrawer />
      <WhatsAppNotification />
      <AuthModal />

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
