# Technical Blueprint & Architecture: Fit&Flash

## 1. System Overview
Fit&Flash is structured as a monolithic Next.js (App Router) application utilizing React, TypeScript, and Tailwind CSS. State management is handled through React Context combined with robust localStorage persistence to simulate concurrent multi-user interactions (Shopper A, Shopper B, Merchant) and real-time background traffic simulation.

```
[ Public Storefront / Local Vault ] <---> [ React Context / LocalStorage State Store ] <---> [ Merchant Ops Console ]
               ^                                            ^                                       ^
               |                                            |                                       |
     [ 3D Fit Studio (R3F/Three.js) ]             [ 10-Min Atomic Locks ]                [ Live Traffic Simulator ]
```

## 2. Technology Stack
- **Framework:** Next.js 14+ (App Router) with React 18 & TypeScript.
- **Styling:** Tailwind CSS with custom color tokens and font overrides.
- **3D Graphics:** Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei` or Three.js canvas) for interactive garment wireframes.
- **Icons:** `lucide-react`.
- **State & Persistence:** React Context + `localStorage` / IndexedDB simulation layer.

## 3. Project Structure
```text
fit-and-flash/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── storefront/
│   ├── local-vault/
│   ├── orders/
│   └── merchant/
├── components/
│   ├── 3d/
│   │   └── FitStudioCanvas.tsx
│   ├── storefront/
│   │   ├── ProductCard.tsx
│   │   ├── HeroBanner.tsx
│   │   └── BrandStory.tsx
│   ├── checkout/
│   │   ├── CheckoutDrawer.tsx
│   │   └── WhatsAppNotification.tsx
│   ├── orders/
│   │   ├── ReturnModal.tsx
│   │   └── WebcamScanner.tsx
│   ├── merchant/
│   │   ├── TrafficSimulatorToggle.tsx
│   │   ├── TelemetryCards.tsx
│   │   ├── LiveEventTerminal.tsx
│   │   └── ReturnApprovalQueue.tsx
│   └── ui/
│       ├── Header.tsx
│       ├── AuthModal.tsx
│       └── Toast.tsx
├── context/
│   └── AppContext.tsx
├── data/
│   └── initialProducts.ts
├── types/
│   └── index.ts
└── docs/
    ├── PRD.md
    ├── DESIGN_SYSTEM.md
    └── ARCHITECTURE.md
```

## 4. Data Model
- **Product:** `id`, `title`, `category`, `price`, `stockCount`, `status` ('live' | 'sold-out' | 'local-vault'), `discount`, `hubLocation`, `images`, `description`, `dimensions`, `dropEndTime`.
- **Order:** `id`, `items`, `totalAmount`, `paymentMethod`, `status`, `timestamp`, `trackingId`, `hubLocation`, `returnStatus`.
- **StockLock:** `id`, `productId`, `userId`, `expiresAt`, `size`, `timerSeconds`.
- **UserSession:** `role` ('shopper-a' | 'shopper-b' | 'merchant'), `name`, `email`, `activeLocks`.

## 5. APIs and Internal Interfaces
- Simulated via custom React hooks (`useStore`, `useTrafficSimulator`) managing state transitions and atomic inventory locking.

## 6. Internal Data Flows
1. Shopper selects item -> clicks **"Lock Stock"** -> 10-minute timer initializes in global state.
2. User completes payment simulation -> stock count decrements permanently -> order record created -> WhatsApp notification triggered.
3. Merchant toggles Traffic Simulator ON -> setInterval background hook spawns simulated shopper transactions updating KPI metrics live.

## 7. Authentication and Security
- Role switcher modal simulates secure authentication between Shopper (A and B) and Merchant views with instant state persistence.

## 8. External Integrations
- None required (fully self-contained mock environment).

## 9. Configuration and Deployment
- Zero-config setup: `npm install && npm run dev`. Deployable on Vercel or any static/SSR Next.js hosting provider.

## 10. Testing & Reliability
- Verified via TypeScript compiler checks (`tsc`) and local end-to-end browser testing of core user journeys.

