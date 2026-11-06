# Product Requirements Document (PRD): Fit&Flash

## 1. Product Overview
**Fit&Flash** is a high-concurrency D2C streetwear flash-sale and e-commerce platform combining interactive 3D garment/sneaker fit visualization, atomic zero-oversell stock locks, simulated real-time payments (UPI/COD/Cards), automated WhatsApp notifications, local vendor return routing (Local Vault), and a live Merchant Ops Console featuring a built-in High-Concurrency Traffic Simulator. 
The brand aesthetic merges high-energy streetwear hype with playful, rounded neo-brutalism inspired by modern D2C beverage brands (vibrant berry/plum palettes, polaroid frames, and friendly bold typography).

## 2. Problem & Target Users
- **Problem:** Flash-sale platforms suffer from high cart abandonment, overselling due to concurrency races, high return rates caused by poor sizing, and lack of transparency in local return logistics.
- **Target Users:** 
  - **Shoppers (Customer A & B):** Hypebeasts, streetwear enthusiasts, and fashion consumers seeking limited drops with accurate sizing confidence and lightning-fast local fulfillment.
  - **Merchants:** Brand operators and warehouse managers controlling flash drop inventories, monitoring live telemetry, and managing local vendor hub return verification.

## 3. Goals and Non-Goals
### Goals
- Deliver an immersive 3D fit studio where users can adjust body dimensions and view real-time mesh tension.
- Implement robust 10-minute atomic stock locking to prevent overselling during high-concurrency drops.
- Provide a dual-role experience allowing seamless switching between Shopper and Merchant modes with real-time state synchronization.
- Feature a Local Vault for verified local returns with express 24h delivery and discount badges.
- Include a fully functional Merchant Ops Console with a live traffic simulator.

### Non-Goals
- Production banking integrations (payments are fully simulated via interactive QR codes and tokenized inputs).
- Enterprise multi-tenant database clusters (persistence is handled via LocalStorage / IndexedDB mock layers).

## 4. Feature Specifications
- **F-01: Public Storefront & Live Drops Feed**
  - Displays 15–20 luxury streetwear items (T-shirts, hoodies, shirts, denim, sneakers).
  - 12–14 active Live Drops with live countdown timers (`02:45:12`) and stock urgency tags (`"Only 3 left"`).
  - 2–3 Sold Out items with `"Join Waitlist"` buttons.
  - 2–3 Local Vault items with express delivery badges and local hub discount tags.
- **F-02: Interactive 3D Fit Studio**
  - Three.js / React Three Fiber viewport rendering rotating wireframe garments/sneakers.
  - Body dimension sliders (Chest, Waist, Height / Foot Length, Width, Arch) that trigger real-time mesh morphing and color-coded tension zones (Green = Ideal, Red = Tight, Blue = Relaxed).
  - Live Fit Match Score badge (e.g., `"96% Match — True to Size"`).
- **F-03: 10-Minute Atomic Checkout Drawer**
  - Sticky countdown banner reserving inventory.
  - Payment tabs: Dynamic UPI QR with `[Demo: Simulate UPI Payment Success]`, Tokenized Card inputs, and OTP-Verified COD with on-screen demo OTP badge.
  - Automated WhatsApp notification slide-in drawer showing receipt and tracking details upon payment success.
- **F-04: Local Vault & Returns Portal**
  - Dedicated tab showcasing verified local returns with 10% local hub discounts.
  - Return request flow featuring a webcam simulation and `[Simulate Tag Scan]` to route items back to nearby vendor hubs.
- **F-05: Merchant Ops Console & Traffic Simulator**
  - Live Traffic Simulator toggle (ON/OFF) that auto-spawns concurrent shoppers, locking inventory and placing orders live.
  - Real-time KPI telemetry (Active Locks, Conversion Drop-off, Revenue, Local Vault Count).
  - Product management modals to add/edit drops, trigger countdowns, and approve incoming local vendor returns.

## 5. User Journeys
1. **The Hype Shopper Journey:** Arrives at storefront -> Browses Live Drops -> Clicks item -> Adjusts body sliders in 3D Fit Studio -> Locks stock for 10 minutes -> Completes checkout via UPI simulation -> Receives WhatsApp receipt -> Tracks order in "My Orders".
2. **The Local Vault Shopper Journey:** Navigates to Local Vault tab -> Views nearby verified returns with 10% discount -> Instant checkout with 24h express delivery.
3. **The Merchant Operator Journey:** Logs in as Merchant -> Toggles Live Traffic Simulator ON -> Observes real-time telemetry updates and event stream -> Restocks items or approves incoming local returns.

## 6. Screen-by-Screen Specifications
- **Screen 1 (Storefront):** Header with logo (`Fit&Flash`), category pills, hero countdown banner, responsive product grid, role switcher.
- **Screen 2 (Auth Modal):** Role toggle (Shopper vs. Merchant), quick-fill demo buttons, simulated Google auth.
- **Screen 3 (3D Fit Studio):** 3D canvas viewport, size selector, body sliders, tension indicators, Fit Match score, stock action button.
- **Screen 4 (Checkout Drawer):** 10-min countdown bar, payment tabs (UPI QR, Card, COD OTP), success trigger opening WhatsApp notification popup.
- **Screen 5 (Local Vault):** Filtered product grid with local vendor tags, hub distance indicators, express discount badges.
- **Screen 6 (My Orders & Returns):** Order history list, WhatsApp receipt view, return request modal with webcam simulation and tag scan.
- **Screen 7 (Merchant Console):** Traffic simulator toggle, KPI telemetry cards, live event terminal feed, product CRUD modal, return approval queue.

## 7. Acceptance Criteria
- 3D Fit Studio correctly morphs mesh and updates tension zones when sliders are manipulated.
- Stock locks expire precisely after 10 minutes if checkout is incomplete.
- Switching between Shopper and Merchant roles retains state across page refreshes via localStorage.
- Traffic simulator successfully simulates concurrent shopper actions and updates merchant charts in real time.

## 8. Future Scope
- Real multi-vendor marketplace onboarding.
- Integration with live shipping provider APIs (Shiprocket/Delhivery).
- Advanced AI-powered body scanning via mobile camera photogrammetry.

