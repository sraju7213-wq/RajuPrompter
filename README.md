# AI Prompt Generator v2.0 – Responsive Front-End

This refactor delivers a fully responsive, mobile-first experience for the AI Prompt Generator. The UI gracefully adapts from 320px wide phones to large desktop displays while keeping every workflow accessible: manual prompt creation, AI-assisted editing, image analysis, and batch generation.

## 🔐 Environment Variables

Netlify Functions rely on the following runtime configuration values:

- `OPENROUTER_API_KEY` – required. Set this to your OpenRouter API key (e.g. `sk-or-...`).
- `OPENROUTER_API_URL` – optional override for the OpenRouter endpoint. Defaults to `https://openrouter.ai/qwen/qwen3-coder:free/api`.
- `OPENROUTER_APP_NAME` – optional label passed to OpenRouter for analytics. Defaults to `AI Prompt Generator`.
- `SITE_URL` – optional. Used as the HTTP referer header when contacting OpenRouter.

## 📐 Layout Breakpoints

| Breakpoint | Width | Layout Summary |
| ---------- | ----- | -------------- |
| **XS** | ≤ 360px | Single-column stack. Sticky header with hamburger menu, horizontal chip carousels with scroll snap. Collapsible panels default to closed. |
| **SM** | 361–480px | Single-column layout with persistent primary actions (Build, AI Suggestions, Upload). Tabs and chip carousels remain horizontally scrollable. |
| **MD** | 481–768px | Tall single column with selective two-column groupings where space allows. Live Preview and AI Suggestions remain collapsible and opt-in for screen space. |
| **LG** | 769–1024px | Two-column grid: sidebar + main content on the left, analysis/actions on the right. Collapsible panels stay open by default. |
| **XL** | ≥ 1025px | Desktop layout with constrained max-width for readability (≈72ch). Sticky sidebars on both sides keep assistive tools visible during scrolling. |

## 🧩 Component Behaviors

- **Header & Drawer**
  - Sticky top app bar with brand title always visible.
  - On ≤768px, navigation and tertiary actions move into an accessible drawer triggered by the hamburger button (`Esc` closes the drawer).
  - On ≥864px (`54rem`), quick actions reappear inline in the header.

- **Controls Strip**
  - Houses the “Advanced” label, platform selector, theme chips, and desktop-only Collaborate/Chota actions.
  - Chip rows use horizontal scrolling with snap on mobile and wrap on larger screens.

- **Theme Chips**
  - Touch targets are ≥44×44px and expose `aria-selected` state changes.
  - Hidden `<select>` remains available for assistive tech.

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
  - Full-width drop zone that doubles as a label for the file input on touch devices.
  - Preview area and analysis results share consistent `hidden` toggling to avoid layout jumps.

- **Batch Prompt Generator**
  - Vertical form by default, split into two columns from 30rem upward.
  - Generate button becomes full-width on narrow viewports.

- **Live Preview**
  - Collapsible `<details>` component. Closed by default on ≤768px, open on larger screens.
  - Preview metrics display inline pill badges.

- **Actions Toolbar**
  - Primary buttons (**Copy**, **Save**) always visible.
  - “More” menu groups Export, Share, and Deep Analysis inside a `details` overflow with keyboard support.

- **Save Prompt Modal**
  - Full-screen on ≤768px with sticky header/footer.
  - `Esc`, backdrop click, and Cancel button all close the modal while returning focus to the trigger.

## 🌈 Adding a New Theme Chip

1. **Update the Theme Catalog**
   - Open `app.js` and extend the `themes` object with the new key, primary color, and background.

2. **Add the Chip**
   - In `index.html`, add a button within the `.chip-carousel` container:
     ```html
     <button class="chip theme-chip" type="button" role="option" data-theme="your_theme">Label</button>
     ```
   - Add a matching option to the hidden `<select id="theme-select">` for assistive technologies.

3. **Styling**
   - If the theme needs custom accents, append CSS variables to `styles/base.css` under a `[data-theme='your_theme']` block.

4. **Optional Platform Mapping**
   - If the theme requires bespoke platform behavior, adjust `applyTheme` or supporting logic in `app.js`.

The JS initialization automatically wires new chips: `setupThemeChips()` binds click handlers and `applyTheme()` handles `aria-selected` state updates plus persistence.

## ♿ Accessibility & Performance Highlights

- All interactive targets meet the 44×44px guideline with visible `:focus-visible` outlines.
- Skip link, tab-order controls, and keyboard-close behaviors for modals/drawers are provided.
- `prefers-reduced-motion` and `prefers-color-scheme` settings are respected.
- Non-critical scripts load with `defer`, images/iframe use `loading="lazy"`, and collapsible sections prevent layout shifts.

Happy prompting! 🚀
