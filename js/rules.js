
window.RULES = {
  platforms: {
    midjourney: { ar:["1:1","3:4","2:3","16:9"], compose: (txt, ar, chaos=5)=>`${txt} --ar ${ar} --v 6 --stylize 100 --chaos ${chaos} --seed ${Math.floor(Math.random()*2**31)}` },
    stablediffusion: { ar:["1:1","3:4","2:3","3:2","16:9"], compose: (txt, ar)=>{
      const size = {"1:1":"1024x1024","3:4":"768x1024","2:3":"832x1216","3:2":"1216x832","16:9":"1344x768"}[ar]||"1024x1024";
      return `Positive: ${txt}\nNegative: ${ADV_LIBRARY.negatives.slice(0,12).join(', ')}\nSteps: 30 | CFG: 7 | Sampler: DPM++ 2M Karras | Size: ${size} | Seed: ${Math.floor(Math.random()*2**31)}`;
    }},
    flux: { ar:["1:1","3:2","21:9"], compose: (txt, ar)=>`Prompt: ${txt}\nNegative: ${ADV_LIBRARY.negatives.slice(0,10).join(', ')}\nGuidance: 3.5 | Steps: 28 | Ratio: ${ar} | Seed: ${Math.floor(Math.random()*2**31)}` },
    naturallanguage: { ar:["1:1"], compose: (txt)=>`Describe in one sentence: ${txt}` }
  },
  template: ({style, mood, subject, action, lighting, lens, env, colors}) =>
    `${style} ${mood} portrait of a ${subject} ${action}, ${lighting}, ${lens}, in a ${env}, ${colors} palette`,
};
