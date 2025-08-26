
window.PLATFORMS = {
  midjourney: {
    name: "Midjourney",
    ar: ["1:1","2:3","3:2","16:9","9:16","4:3"],
    compose: (txt, opt) => {
      const stylize = opt.stylize ?? 100;
      const q = Math.max(0.25, Math.min(2, (opt.quality ?? 50)/25)).toFixed(2);
      const ar = opt.ratio || "1:1";
      const seed = opt.seed ?? Math.floor(Math.random()*2**31);
      return `${txt} --ar ${ar} --stylize ${stylize} --q ${q} --seed ${seed} --v 6`;
    },
    rules: { targetWords: [60, 80] }
  },
  stable_diffusion: {
    name: "Stable Diffusion",
    ar: ["1:1","2:3","3:2","16:9","9:16","4:3"],
    compose: (txt, opt) => {
      const neg = opt.negative || 'lowres, bad anatomy, deformed, text, watermark, extra fingers, worst quality, jpeg artifacts';
      const size = (()=>{
        const map = {"1:1":"1024x1024","2:3":"832x1216","3:2":"1216x832","16:9":"1344x768","9:16":"768x1344","4:3":"1024x768"};
        return map[opt.ratio || "1:1"];
      })();
      const seed = opt.seed ?? Math.floor(Math.random()*2**31);
      return `Positive: ${txt}\nNegative: ${neg}\nSteps: 30 | CFG: 7 | Sampler: DPM++ 2M Karras | Size: ${size} | Seed: ${seed}`;
    },
    rules: { targetWords: [75, 150] }
  },
  flux: {
    name: "Flux AI",
    ar: ["1:1","3:2","2:3","21:9"],
    compose: (txt, opt) => {
      const ar = opt.ratio || '1:1';
      const guidance = (opt.quality ?? 50)/25 + 1.5;
      const seed = opt.seed ?? Math.floor(Math.random()*2**31);
      return `Prompt: ${txt}\nNegative: ${opt.negative || 'lowres, watermark, blurry'}\nGuidance: ${guidance.toFixed(1)} | Steps: 28 | Ratio: ${ar} | Seed: ${seed}`;
    },
    rules: { targetWords: [50, 100] }
  },
  dall_e: {
    name: "DALL·E",
    ar: ["1:1","3:2","2:3","16:9","9:16"],
    compose: (txt, opt) => `${txt}`,
    rules: { targetWords: [40, 80] }
  },
  natural_language: {
    name: "Natural Language",
    ar: ["1:1"],
    compose: (txt) => txt,
    rules: { targetWords: [30, 60] }
  }
};
