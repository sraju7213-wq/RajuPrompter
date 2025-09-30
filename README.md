# AI Prompt Generator v2.0 – Responsive Front-End

This refactor delivers a fully responsive, mobile-first experience for the AI Prompt Generator. The UI gracefully adapts from 320px wide phones to large desktop displays while keeping every workflow accessible: manual prompt creation, AI-assisted editing, image analysis, and creative toolkit support.

## 📐 Layout Breakpoints

| Breakpoint | Width | Layout Summary |
| ---------- | ----- | -------------- |
| **XS** | ≤ 360px | Single-column stack. Sticky header with hamburger menu, horizontal chip carousels with scroll snap. Collapsible panels default to closed. |
| **SM** | 361–480px | Single-column layout with persistent primary actions (Build, AI Suggestions, Toolkit). Tabs and chip carousels remain horizontally scrollable. |
| **MD** | 481–768px | Tall single column with selective two-column groupings where space allows. Live Preview and AI Suggestions remain collapsible and opt-in for screen space. |
| **LG** | 769–1024px | Two-column grid: sidebar + main content on the left, analysis/actions on the right. Collapsible panels stay open by default. |
| **XL** | ≥ 1025px | Desktop layout with constrained max-width for readability (≈72ch). Sticky sidebars on both sides keep assistive tools visible during scrolling. |

## 🧩 Component Behaviors

- **Header & Drawer**
  - Sticky top app bar with brand title always visible.
  - On ≤768px, navigation and tertiary actions move into an accessible drawer triggered by the hamburger button (`Esc` closes the drawer).
  - On ≥864px (`54rem`), quick actions reappear inline in the header.

- **Controls Strip**
  - Houses the “Advanced” label, platform selector, and desktop-only Collaborate/Chota actions.
  - Layout adapts from stacked sections on small screens to multi-column groupings on larger displays.

- **AI Suggestions Panel**
  - Rendered as a `<details>` disclosure. Closed by default on mobile, automatically open on ≥768px.
  - Action button remains inside the panel and always full-width on small screens.

- **Smart Word Library**
  - Horizontal segmented control for category tabs with `aria-selected` updates.
  - Word bank uses a vertical scroll list constrained to 420px height.

- **Recent Prompts**
  - Renders as cards with timestamp, snippet, and explicit **Use**/**Copy** buttons. Copy uses clipboard API with fallback and toast feedback.

- **Build Your Prompt**
  - Voice/Clear/Optimize actions wrap when space is tight.
  - Textarea minimum height is `36vh` on mobile and remains resizable. Counters are grouped inside a status bar beneath the editor.

- **AI-Powered Image Analysis**
  - Text-first workflow that refines pasted descriptions with accessible contrast across all themes.
  - Embedded Hugging Face assistant loads on demand to keep initial render light.

- **Creative Toolkit**
  - Random prompt shortcuts and recent prompt access live inside collapsible disclosures.
  - Controls inherit elevated-surface theming for consistent readability.

- **Live Preview**
  - Collapsible `<details>` component. Closed by default on ≤768px, open on larger screens.
  - Preview metrics display inline pill badges.

- **Actions Toolbar**
  - Primary buttons (**Copy**, **Save**) always visible.
  - “More” menu groups Export, Share, and Deep Analysis inside a `details` overflow with keyboard support.

- **Save Prompt Modal**
  - Full-screen on ≤768px with sticky header/footer.
  - `Esc`, backdrop click, and Cancel button all close the modal while returning focus to the trigger.

## ♿ Accessibility & Performance Highlights

- All interactive targets meet the 44×44px guideline with visible `:focus-visible` outlines.
- Skip link, tab-order controls, and keyboard-close behaviors for modals/drawers are provided.
- `prefers-reduced-motion` and `prefers-color-scheme` settings are respected.
- Non-critical scripts load with `defer`, images/iframe use `loading="lazy"`, and collapsible sections prevent layout shifts.

Happy prompting! 🚀
