
(() => {
  const $ = (id)=>document.getElementById(id);
  const els = {
    theme: $('theme'), platform: $('platform'), ratio: $('ratio'),
    quality: $('quality'), stylize: $('stylize'),
    promptIn: $('prompt'), finalOut: $('final'), negOut: $('negOut'),
    copy: $('copyBtn'), save: $('saveBtn'), hist: $('history'),
    file: $('file'), preview: $('preview'), tags: $('tags'), analyze: $('analyzeBtn'),
    score: $('score'), share: $('shareBtn'), importBtn: $('importBtn'), importFile: $('importFile'),
    randomPortrait:$('randPortrait'), randomNature:$('randNature'), randomSurprise:$('randSurprise')
  };

  // State
  const state = { negativeEnabled: true };

  // Theme setup (6 themes)
  (function initTheme(){
    const saved = localStorage.getItem('pf_theme') || 'theme-neon';
    document.documentElement.className = saved;
    els.theme.value = saved;
    els.theme.addEventListener('change', () => {
      document.documentElement.className = els.theme.value;
      localStorage.setItem('pf_theme', els.theme.value);
    });
  })();

  // Populate platforms + ratios
  (function initPlatforms(){
    Object.entries(PLATFORMS).forEach(([k,v]) => {
      const o = document.createElement('option'); o.value=k; o.textContent=v.name; els.platform.appendChild(o);
    });
    function loadAR(){
      const p = PLATFORMS[els.platform.value]; els.ratio.innerHTML='';
      p.ar.forEach(ar => { const o = document.createElement('option'); o.textContent = ar; els.ratio.appendChild(o); });
    }
    loadAR();
    els.platform.addEventListener('change', () => { loadAR(); render(); });
  })();

  // Random buttons
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function genBase(kind){
    const subject = kind==='nature' ? pick(WORLD.subjects || ["landscape","forest","glacier","desert"]) : pick(["woman","man","dancer","astronaut","samurai","chef","photographer","wizard","robot"]);
    const style = pick(["photorealistic","cinematic","painterly","digital painting","anime","watercolor","hyperrealistic"]);
    const env = pick(["bamboo forest","neon alley","ancient temple","floating island","orbital station","misty valley","sunlit studio"]);
    const mood = pick(["serene","dramatic","mysterious","whimsical","epic","romantic","noir mood","vibrant"]);
    const color = pick(["crimson","sapphire","emerald","gold","turquoise","magenta","pastel tones","monochrome"]);
    const frame = pick(["close-up","medium shot","full body","extreme close-up"]);
    const angle = pick(["eye level","low angle","high angle","bird's-eye"]);
    const camera = pick(["full-frame DSLR","mirrorless camera","medium format camera","cinema camera"]);
    const lens = pick(["50mm f/1.4","85mm f/1.8","35mm f/1.4","105mm macro","24mm wide","70-200mm f/2.8"]);
    const light = pick(["golden hour","neon glow","softbox lighting","rim light","overcast diffuse"]);
    return [ "masterpiece, best quality, high resolution",
      `${style} ${frame} of a ${subject}`, `in a ${env}`, `${mood} atmosphere`, `${color} palette`,
      `${angle}`, `${camera}, ${lens}`, `${light}` ].join(', ');
  }
  els.randomPortrait.addEventListener('click', ()=>{ els.promptIn.value=genBase('portrait'); pushHistory(els.promptIn.value); render(); });
  els.randomNature.addEventListener('click', ()=>{ els.promptIn.value=genBase('nature'); pushHistory(els.promptIn.value); render(); });
  els.randomSurprise.addEventListener('click', ()=>{ els.promptIn.value=pick(PROMPT_PACK); pushHistory(els.promptIn.value); render(); });

  // Negative toggle
  $('negToggle').addEventListener('change', (e)=>{ state.negativeEnabled = e.target.checked; render(); });

  // Sliders
  ['quality','stylize'].forEach(id => $(id).addEventListener('input', render));
  els.ratio.addEventListener('change', render);
  els.promptIn.addEventListener('input', render);

  // Copy/save/share
  els.copy.addEventListener('click', ()=> navigator.clipboard.writeText(els.finalOut.innerText.trim()));
  els.save.addEventListener('click', ()=> {
    const blob = new Blob([els.finalOut.innerText.trim()], {type:'text/plain'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='prompt.txt'; a.click();
  });
  els.share.addEventListener('click', ()=>{
    const data = encodeURIComponent(JSON.stringify({
      p: els.platform.value, r: els.ratio.value, q: els.quality.value, s: els.stylize.value,
      t: els.promptIn.value
    }));
    const url = location.origin + location.pathname + `#share=${data}`;
    navigator.clipboard.writeText(url);
    alert('Sharable link copied to clipboard!');
  });

  // Import library (local JSON)
  els.importBtn.addEventListener('click', ()=> els.importFile.click());
  els.importFile.addEventListener('change', (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data.words)) window.WORD_LIBRARY = window.WORD_LIBRARY.concat(data.words);
        if (Array.isArray(data.prompts)) window.PROMPT_PACK = window.PROMPT_PACK.concat(data.prompts);
        alert('Imported successfully.');
      } catch(err){ alert('Invalid JSON. Expect {words:[], prompts:[]}.'); }
    };
    reader.readAsText(f);
  });

  // History
  function pushHistory(text){
    let list = JSON.parse(localStorage.getItem('pf_hist')||'[]');
    list.unshift({t: Date.now(), text}); list = list.slice(0,300);
    localStorage.setItem('pf_hist', JSON.stringify(list));
    renderHistory();
  }
  function renderHistory(){
    const list = JSON.parse(localStorage.getItem('pf_hist')||'[]');
    els.hist.innerHTML = list.map((it,i)=>{
      const d=new Date(it.t).toLocaleString();
      return `<div class="small"><span>${d}</span> — <em>${it.text.slice(0,120)}</em> <a href="#" data-i="${i}" class="restore">restore</a></div>`;
    }).join('');
    els.hist.querySelectorAll('.restore').forEach(a=>a.addEventListener('click',(e)=>{
      e.preventDefault(); const i=+e.target.dataset.i; const list=JSON.parse(localStorage.getItem('pf_hist')||'[]'); if(list[i]){ els.promptIn.value=list[i].text; render(); }
    }));
  }
  renderHistory();

  // TensorFlow analyzer
  const tfState = { mobilenet:null, cocossd:null, ready:false };
  async function ensureTF(){
    if (tfState.ready) return;
    try {
      const [mn, det] = await Promise.all([ mobilenet.load(), cocoSsd.load() ]);
      tfState.mobilenet = mn; tfState.cocossd = det; tfState.ready = true;
      $('status').textContent = 'Models ready.';
    } catch(err){
      $('status').textContent = 'Failed to load TF models.';
      console.error(err);
    }
  }
  function extractPalette(img){
    const c = document.createElement('canvas');
    const w=160; const h=Math.max(1, Math.round(img.naturalHeight*160/img.naturalWidth));
    c.width=w; c.height=h; const ctx=c.getContext('2d'); ctx.drawImage(img,0,0,w,h);
    const data=ctx.getImageData(0,0,w,h).data; const buckets={};
    for (let i=0;i<data.length;i+=4){ const r=data[i],g=data[i+1],b=data[i+2]; const key=`${(r>>4)<<4},${(g>>4)<<4},${(b>>4)<<4}`; buckets[key]=(buckets[key]||0)+1; }
    const entries=Object.entries(buckets).sort((a,b)=>b[1]-a[1]).slice(0,8);
    return entries.map(([k])=>{ const [r,g,b]=k.split(',').map(Number); return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join(''); });
  }

  $('file').addEventListener('change', async (e)=>{
    const file = e.target.files[0]; if (!file) return;
    const url = URL.createObjectURL(file); els.preview.src = url;
    els.preview.onload = async ()=>{
      $('status').textContent = 'Analyzing…'; await ensureTF(); if (!tfState.ready) return;
      const tags = new Set();
      const preds = await tfState.mobilenet.classify(els.preview, 5).catch(()=>[]);
      preds.forEach(p=> tags.add(p.className.split(',')[0].trim()));
      const dets = await tfState.cocossd.detect(els.preview).catch(()=>[]);
      dets.forEach(d=> tags.add(d.class));
      const palette = extractPalette(els.preview);
      palette.slice(0,3).forEach(hex=> tags.add(hex));
      els.tags.innerHTML='';
      Array.from(tags).slice(0,24).forEach(t=>{ const s=document.createElement('span'); s.className='tag'; s.textContent=t; els.tags.appendChild(s); });

      // Build hint
      const subject = Array.from(tags).find(t=>!/[^a-z]/i.test(t)) || 'subject';
      const style = 'photorealistic';
      const env = 'natural setting';
      const mood = 'serene';
      const color = palette.slice(0,2).join(' and ');
      const hint = [ "masterpiece, best quality, high resolution",
        `${style} close-up of a ${subject}`, `in a ${env}`, `${mood} atmosphere`, `${color} palette`,
        `eye level`, `full-frame DSLR, 50mm f/1.4`, `golden hour` ].join(', ');
      els.promptIn.value = hint; pushHistory(hint); render();
      $('status').textContent = 'Done.';
    };
  });

  // Render output
  function render(){
    const platform = EL.platform(); const ratio = els.ratio.value;
    const opt = { ratio, quality:+els.quality.value, stylize:+els.stylize.value };
    opt.negative = state.negativeEnabled ? WORD_LIBRARY.slice(0,0).join(', ') : ''; // placeholder; negatives handled in platform compose

    const textRaw = els.promptIn.value.trim() || 'photorealistic portrait, elegant lighting';
    const cleaned = RULES.grammarCleanup(textRaw);
    const final = platform.compose(cleaned, opt);
    els.finalOut.textContent = final;

    const score = RULES.scorePrompt(cleaned, platform.rules.targetWords);
    els.score.textContent = score.toFixed(2);
    els.negOut.textContent = state.negativeEnabled ? 'lowres, bad anatomy, deformed, text, watermark, extra fingers, worst quality, jpeg artifacts' : '';
  }

  // platform helper
  const EL = {
    platform: () => PLATFORMS[els.platform.value]
  };

  // Deep link restore
  (function restoreShare(){
    const m = location.hash.match(/#share=(.+)$/); if(!m) return;
    try{
      const data = JSON.parse(decodeURIComponent(m[1]));
      els.platform.value=data.p; els.promptIn.value=data.t; els.quality.value=data.q; els.stylize.value=data.s;
      setTimeout(()=>{ els.ratio.value=data.r; render(); }, 0);
    }catch(_){}
  })();

  // Initial fill
  if (!els.promptIn.value) { els.promptIn.value = 'masterpiece, best quality, high resolution, cinematic close-up of a woman gazing at the horizon, in a bamboo forest, serene atmosphere, emerald and gold palette, eye level, full-frame DSLR, 85mm f/1.8, golden hour'; }
  render();
})();
