
# PromptSmith — Advanced Image Prompt Generator (Offline)

A fully offline, local‑first web app that helps you craft high‑quality prompts for **Midjourney**, **Stable Diffusion**, **Flux**, and **Natural Language** descriptions.

## Highlights

- **Platform Options**: Midjourney / Stable Diffusion / Flux / Natural Language formatters.
- **Image→Prompt (Heuristic)**: Drop an image to extract a color palette and auto‑suggest descriptive tags.
- **Theme Customization**: Six themes (Light, Dark, Solarized, Midnight, Pastel, High Contrast).
- **Large Content Library**: 3,400+ vocabulary tokens across categories; 500 ready‑to‑use prompts generated via templates.
- **Advanced Rules Engine**: Category templates, aspect‑ratio suggestions, conflict & synergy handling, negative defaults.
- **Random Generators**: One‑click **Portrait**, **Nature**, and **Surprise** generators + Batch x10.
- **Open‑Source Packs (No API)**: Load local JSON packs or attempt a GitHub **raw** JSON URL (subject to CORS); or import/export the full library JSON.
- **History & Versions**: Auto‑saved prompt history with one‑click restore.
- **Accessibility**: High contrast theme, keyboard‑friendly controls.

## Getting Started

1. Unzip and open `index.html` in any modern browser (Chrome, Edge, Firefox). No server needed.
2. Choose a **Theme** and **Platform**.
3. Use the **Portrait / Nature / Surprise** buttons, or paste your own ideas.
4. Optionally upload an image to seed color tags and a heuristic description.
5. Toggle **Platform formatting** / **Rules** / **Negative prompts** as needed.
6. Copy or **Download Prompt (.txt)**.

## Open‑Source Packs (No API)

- Use **Load Sample Pack** to merge a local pack.
- Or paste a **GitHub raw JSON URL**. If your browser blocks CORS, download the JSON and use **Export/Import Library**.

## Data

- Embedded JS file: `js/data.js` defines `WORD_LIBRARY`, `PROMPT_LIBRARY`, and `RULES` (also mirrored under `/data` for reference).
- Prompts include cross‑platform formatting suggestions where applicable.

## License

MIT for app code. The sample pack is CC0. You are responsible for third‑party content you import.
