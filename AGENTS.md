# AGENTS.md — Coding Agent Instructions for Fit&Flash

## 1. Mandatory Reading
Before writing, modifying, or reviewing any code in this repository, you **MUST** thoroughly read and understand:
- `/docs/PRD.md` (Product Requirements Document)
- `/docs/DESIGN_SYSTEM.md` (Design & User Experience Guidelines)
- `/docs/ARCHITECTURE.md` (Technical Blueprint & Architecture)

## 2. Repository Inspection
Before implementing any feature or bug fix:
- Inspect existing files, directory structures, package configurations (`package.json`), and styling setups (`tailwind.config.ts`).
- Review existing component libraries, utility functions, and state management hooks.
- Adhere strictly to existing project conventions. Do not introduce unauthorized libraries or alternative frameworks.

## 3. Implementation Workflow
1. **Understand Requirements:** Cross-reference tasks with `docs/PRD.md` to ensure complete feature alignment.
2. **Identify Blockers:** Check for missing dependencies, unhandled edge cases, or type mismatches.
3. **Prepare Concise Plan:** Outline the step-by-step implementation strategy for the requested ticket or task.
4. **Implement in Logical Stages:** Build functionality incrementally, ensuring code compiles and passes type checks at each stage.
5. **Verify Interactivity:** Confirm that simulated background processes (e.g., traffic simulator, 10-minute stock locks, local returns) persist correctly via client storage mechanisms.

## 4. Coding Principles
- **Functional Over Mock:** Build fully interactive components with working state transitions, local storage persistence, and dynamic updates rather than static, disconnected mockups.
- **Component Reuse:** Utilize established design tokens, button variants, and layout primitives defined in `docs/DESIGN_SYSTEM.md`.
- **Clean Architecture:** Maintain clear separation of concerns between UI components, state management stores, and simulated backend logic.
- **Minimal Dependencies:** Avoid adding unnecessary third-party packages. Rely on React, Tailwind CSS, Lucide icons, and Three.js / React Three Fiber as specified.

## 5. Decision-Making & Assumptions
- Make reasonable, low-risk technical decisions that align with the specification when minor details are unspecified.
- Document any assumptions directly in code comments or PR summaries.
- Ask the user for clarification *only* when an ambiguity materially impacts security, data integrity, or core user experience.

## 6. Security & Data Protection
- Protect simulated credentials and local storage tokens.
- Validate all user inputs (e.g., body dimension sliders, checkout forms, return tag scans).
- Ensure role-based separation between Shoppers and Merchants is strictly maintained across views and route navigation.

## 7. Testing & Verification
- Verify that builds (`npm run build`) and type checks (`tsc`) pass cleanly without errors.
- Test all core user journeys end-to-end:
  - Public browsing & countdown timers.
  - 3D Fit Studio interaction & mesh morphing.
  - 10-minute atomic stock lock and checkout simulation (UPI/Card/COD).
  - Local Vault return routing and express delivery badge verification.
  - Merchant live traffic simulator and return approval queue.

## 8. Change Management
- Do not silently alter approved requirements, expand project scope, or introduce major architectural shifts without explicit user consent.

## 9. Completion Report
Upon completing a task or milestone, provide a concise summary covering:
- Implemented functionality and screens.
- Verification results (build status, feature check).
- Known limitations, edge cases handled, or external prerequisites.

