
# PromptForge Pro (TFJS)

- Client‑side prompt generator inspired by your provided UI and libraries.
- **Platforms**: Midjourney, Stable Diffusion, Flux, DALL·E, Natural Language.
- **TensorFlow.js** Mobilenet + COCO‑SSD for Image→Prompt (subject + objects + palette extraction).
- **Themes**: Light, Dark, Neon, Autumn, Ocean, Pastel.
- **Library**: 3200 unique words/phrases, 500 ready prompts.
- **Extras**: Prompt scoring, history & restore, shareable permalink, import extra library JSON, export as .txt.

## Offline
Swap the TFJS CDN scripts in `index.html` with local files if you need full offline usage.

## Import JSON format
```json
{ "words": ["foo","bar"], "prompts": ["..."] }
```
