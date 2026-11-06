# Design and User Experience: Fit&Flash

## 1. Design Direction
Fit&Flash merges **Streetwear Hype / Dark Industrial** foundations with the playful, vibrant neo-brutalist aesthetic inspired by modern D2C brand design (as seen in the reference "fizz" UI style). 
- **Personality:** Bold, high-energy, confident, interactive, and crisp.
- **Visual Vocabulary:** Rounded pill badges, bold geometric typography, polaroid-style product frames, vibrant berry/plum palettes contrasted with neon acid-green and cyber-orange telemetry highlights.

## 2. Design Tokens
- **Colors:**
  - Background Base: `#0A0A0A` (Deep Carbon Black)
  - Surface Elevated: `#141414` / `#1A1A1A` (Dark Slate Cards)
  - Brand Primary / Berry: `#721133` (Deep Berry Accent)
  - Brand Dark Plum: `#3B091C` (Dark Plum Containers)
  - Cream / Soft Backgrounds: `#FDF8F9` / `#F5F5F5` (Crisp Typography / Soft Contrast Cards)
  - Neon Acid-Green: `#CCFF00` (Active stock locks, 96% match success badges)
  - Cyber-Orange: `#FF4D00` (Urgency timers, low stock alerts)
- **Typography (Strict User Override):**
  - Headings: `Fredoka` 66px semibold (scaled responsively down to 36-48px on mobile, font-semibold)
  - Normal Text: `Nunito` 21px regular (scaled responsively 18-21px, font-normal)
  - Monospaced Elements: `font-mono` for timers, telemetry codes, transaction hashes
- **Spacing & Radii:**
  - Container Border Radius: `rounded-2xl` / `rounded-3xl` for friendly polaroid cards.
  - Padding: Generous internal padding (`p-6`, `p-8`) to maintain high-end D2C spacing.
- **Elevation & Borders:**
  - Subtle borders: `border border-white/10` with soft glassmorphism (`backdrop-blur-md bg-black/40`).

## 3. Layout and Responsiveness
- Fully responsive grid layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) across mobile, tablet, and desktop viewports.
- Sticky top navigation bar with quick category pills and role switcher.
- Slide-over drawers for 3D fit studio, checkout, and WhatsApp notifications.

## 4. Reusable Components
- **Buttons:** Primary neon action buttons (`bg-[#CCFF00] text-black font-bold hover:opacity-90`), secondary dark buttons (`bg-[#1A1A1A] text-white border border-white/20`).
- **Badges:** Pill-shaped tags (`rounded-full px-3 py-1 text-xs font-bold`) for stock urgency (`"Only 3 left"`), Local Vault (`"Express 24h"`), and Fit Match (`"96% Match"`).
- **Polaroid Cards:** Product cards styled with white/light image frames, rounded corners, and bold title typography.

## 5. Interaction States
- **Hover:** Smooth scale-up (`hover:scale-[1.02]`) and border glow.
- **Focus:** High-contrast outline rings (`focus:ring-2 focus:ring-[#CCFF00]`).
- **Loading:** Pulsing skeleton loaders and live rotating 3D wireframes.
- **Success / Error:** Neon green toast notifications for successful checkout/locks; cyber-orange alerts for expired locks.

## 6. Motion & Feedback
- Smooth framer-motion style CSS transitions for drawers, modals, and tab switches.
- Immediate visual feedback on slider adjustments (real-time mesh tension color shifting).

## 7. Accessibility
- Semantic HTML structure (`<header>`, `<main>`, `<section>`, `<article>`).
- High contrast text (`#F5F5F5` on `#0A0A0A` and `#FDF8F9` on `#721133`).
- Keyboard navigable tabs and modals with clear focus indicators.

## 8. AI Interaction Patterns
- Real-time Fit Match calculation based on body slider parameters.
- Simulated conversational WhatsApp receipt dispatch upon payment completion.

