
/* PromptSmith App */
(function(){
  const el = (id)=>document.getElementById(id);
  const promptInput = el('promptInput');
  const out = el('formattedOutput');
  const platformSelect = el('platformSelect');
  const aspectSelect = el('aspectSelect');
  const includeNegative = el('includeNegative');
  const useRules = el('useRules');
  const smartFormat = el('smartFormat');
  const creativity = el('creativity');
  const chaos = el('chaos');

  const historyEl = el('history');
  const wordCountEl = el('wordCount');
  const promptCountEl = el('promptCount');
  const themeSelect = el('themeSelect');

  // Theme handling
  themeSelect.addEventListener('change', ()=>{
    document.documentElement.className = themeSelect.value;
    localStorage.setItem('ps_theme', themeSelect.value);
  });
  const storedTheme = localStorage.getItem('ps_theme');
  if (storedTheme) { themeSelect.value = storedTheme; document.documentElement.className = storedTheme; }

  // Populate aspect ratios per category defaults
  const ASPECTS = ["1:1","3:4","4:5","2:3","3:2","16:9","21:9"];
  function fillAspects(){
    aspectSelect.innerHTML = "";
    ASPECTS.forEach(ar=>{
      const opt = document.createElement('option');
      opt.value = ar; opt.textContent = ar; aspectSelect.appendChild(opt);
    });
    aspectSelect.value = RULES.platforms.midjourney.defaults["--ar"]; // default 1:1
  }
  fillAspects();

  // Library table
  function renderLibrary(){
    const tbody = document.querySelector('#libraryTable tbody');
    tbody.innerHTML = "";
    const entries = Object.entries(WORD_LIBRARY).filter(([k])=>k!=='count');
    wordCountEl.textContent = WORD_LIBRARY.count;
    promptCountEl.textContent = PROMPT_LIBRARY.count;
    entries.forEach(([k,v])=>{
      if (!Array.isArray(v)) return;
      const tr = document.createElement('tr');
      const samp = v.slice(0, 8).join(', ') + (v.length>8?'…':'');
      tr.innerHTML = `<td>${k}</td><td>${samp}</td><td>${v.length}</td>`;
      tbody.appendChild(tr);
    });
  }
  renderLibrary();

  // Search word live filter (simple demo)
  el('searchWord').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase();
    const tbody = document.querySelector('#libraryTable tbody');
    tbody.querySelectorAll('tr').forEach(tr=>{
      const show = tr.children[0].textContent.toLowerCase().includes(q) || tr.children[1].textContent.toLowerCase().includes(q);
      tr.style.display = show ? '' : 'none';
    });
  });

  // Export/Import library
  el('btnExportLib').addEventListener('click', ()=>{
    const payload = { WORD_LIBRARY, PROMPT_LIBRARY, RULES };
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'promptsmith-library.json';
    a.click();
  });
  el('importLib').addEventListener('change', async (e)=>{
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.WORD_LIBRARY) Object.assign(WORD_LIBRARY, data.WORD_LIBRARY);
      if (data.PROMPT_LIBRARY) Object.assign(PROMPT_LIBRARY, data.PROMPT_LIBRARY);
      if (data.RULES) Object.assign(RULES, data.RULES);
      renderLibrary();
      alert('Library imported successfully.');
    } catch(err) {
      alert('Import failed: ' + err.message);
    }
  });

  // Open-source pack loader (no API required)
  el('btnLoadSample').addEventListener('click', async ()=>{
    const res = await fetch('data/packs/sample-pack.json').catch(()=>null);
    if (!res) { el('packStatus').textContent='Failed to load sample pack.'; return; }
    const pack = await res.json();
    applyPack(pack);
  });
  el('btnLoadUrl').addEventListener('click', async ()=>{
    const url = el('packUrl').value.trim();
    if (!url) return;
    el('packStatus').textContent = 'Attempting to load… (CORS must allow it)';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status+' '+res.statusText);
      const pack = await res.json();
      applyPack(pack);
      el('packStatus').textContent = 'Loaded pack from URL.';
    } catch(err) {
      el('packStatus').textContent = 'Could not fetch URL (CORS?). As a fallback, download JSON then import using "Export/Import Library".';
    }
  });

  function applyPack(pack){
    const pv = [];
    if (pack.words) for (const [k,v] of Object.entries(pack.words)) {
      if (!Array.isArray(WORD_LIBRARY[k])) WORD_LIBRARY[k] = [];
      WORD_LIBRARY[k].push(...v);
      pv.push(`${k}: +${v.length}`);
    }
    if (pack.prompts) {
      PROMPT_LIBRARY.prompts.push(...pack.prompts.map((p,i)=>({id:`PACK-${Date.now()}-${i}`, category:p.category||'misc', text:p.text, negative:'', meta:{}})));
      PROMPT_LIBRARY.count = PROMPT_LIBRARY.prompts.length;
      pv.push(`prompts: +${pack.prompts.length}`);
    }
    renderLibrary();
    el('packPreview').textContent = `Applied pack "${pack.name||'unknown'}" (${pv.join(', ')})`;
  }

  // Category buttons
  el('btnPortrait').addEventListener('click', ()=>generateByCategory('portrait'));
  el('btnNature').addEventListener('click', ()=>generateByCategory('nature'));
  el('btnSurprise').addEventListener('click', ()=>generateByCategory('surprise'));
  el('btnBatch').addEventListener('click', ()=>batchGenerate(10));
  el('btnClear').addEventListener('click', ()=>{ promptInput.value=''; renderOutput(); });

  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function pickDistinct(arr, n){
    const a = [...arr]; const out = [];
    while (out.length < Math.min(n, a.length)){
      const i = Math.floor(Math.random()*a.length);
      out.push(a.splice(i,1)[0]);
    }
    return out;
  }

  function colorHint() {
    return `${rand(WORD_LIBRARY.colors)} and ${rand(WORD_LIBRARY.colors)}`;
  }
  function styleHint(){
    return rand(WORD_LIBRARY.photography_styles.concat(WORD_LIBRARY.art_styles));
  }

  // Rules enforcement
  function applyRules(category, base){
    if (!useRules.checked) return { text: base, ar: aspectSelect.value || "1:1", negative: WORD_LIBRARY.negatives_common.slice(0,12).join(', ') };

    const R = RULES.categories[category] || RULES.categories['surprise'];
    let ar = aspectSelect.value || rand(R.recommended_ar);

    // Conflict resolution demo: avoid known conflicting terms
    RULES.conflicts.forEach(([a,b])=>{
      if (base.includes(a) && base.includes(b)){
        // drop one randomly
        base = base.replace(Math.random()<0.5?a:b, '');
      }
    });

    // Add negative defaults
    const negative = pickDistinct(RULES.negative_defaults, 12).join(', ');
    return { text: base.replace(/\s{2,}/g,' ').trim(), ar, negative };
  }

  // Generate prompt by category using templates
  function generateByCategory(category){
    let text = "";
    if (category === 'portrait'){
      text = `${rand(WORD_LIBRARY.adjectives_visual)} ${rand(WORD_LIBRARY.adjectives_mood)} portrait of a ${rand(WORD_LIBRARY.subjects_people)} ${rand(WORD_LIBRARY.verbs)}, ${rand(WORD_LIBRARY.lighting)} lighting, ${rand(WORD_LIBRARY.lenses)}, in a ${rand(WORD_LIBRARY.environments)}, ${styleHint()}, ${colorHint()} palette.`;
    } else if (category === 'nature'){
      text = `${rand(WORD_LIBRARY.adjectives_visual)} ${rand(WORD_LIBRARY.adjectives_mood)} ${rand(WORD_LIBRARY.environments)} with ${colorHint()} tones, ${styleHint()}, captured with ${rand(WORD_LIBRARY.lenses)}, ${rand(WORD_LIBRARY.lighting)}.`;
    } else if (category === 'surprise'){
      text = `${rand(WORD_LIBRARY.adjectives_visual)} ${rand(WORD_LIBRARY.adjectives_mood)} depiction of ${rand(WORD_LIBRARY.subjects_people.concat(WORD_LIBRARY.subjects_objects))} and ${rand(WORD_LIBRARY.subjects_animals)} within ${rand(WORD_LIBRARY.environments)}, unexpected palette of ${colorHint()}, ${styleHint()}, ${rand(WORD_LIBRARY.lighting)}.`;
    }
    const enforced = applyRules(category, text);
    promptInput.value = enforced.text;
    aspectSelect.value = enforced.ar;
    renderOutput(enforced.negative);
    pushHistory(enforced.text);
  }

  function batchGenerate(n){
    const list = [];
    for (let i=0;i<n;i++){
      generateByCategory(rand(['portrait','nature','surprise']));
      list.push(promptInput.value);
    }
    alert(`Generated ${n} prompts into History.`);
  }

  // Platform formatters
  function formatForPlatform(platform, positive, negative, ar){
    if (!smartFormat.checked) return { positive, negative, final: positive };

    const seed = Math.floor(Math.random()*2**31);
    if (platform === 'midjourney'){
      const stylize = [50,100,250,500][Math.floor(Math.random()*4)];
      const chaosVal = Math.floor(chaos.value)||0;
      const final = `${positive} --ar ${ar} --v 6 --stylize ${stylize} --chaos ${chaosVal} --seed ${seed}`;
      return {positive, negative, final };
    }
    if (platform === 'stablediffusion'){
      const steps = 30;
      const cfg = 7;
      const sizeMap = {"1:1":"1024x1024","3:4":"768x1024","2:3":"832x1216","3:2":"1216x832","4:5":"896x1120","16:9":"1344x768","21:9":"1536x640"};
      const size = sizeMap[ar] || "1024x1024";
      const final = `Positive: ${positive}\nNegative: ${negative}\nSteps: ${steps} | CFG: ${cfg} | Sampler: DPM++ 2M Karras | Size: ${size} | Seed: ${seed}`;
      return {positive, negative, final};
    }
    if (platform === 'flux'){
      const guidance = 3.5;
      const steps = 28;
      const final = `Prompt: ${positive}\nNegative: ${negative}\nGuidance: ${guidance} | Steps: ${steps} | Ratio: ${ar} | Seed: ${seed}`;
      return {positive, negative, final};
    }
    // natural language
    const tone = RULES.platforms.naturallanguage.defaults.tone;
    const final = `Describe the following concept in one concise sentence with a ${tone} tone: ${positive}`;
    return {positive, negative, final};
  }

  function renderOutput(presetNegative){
    const platform = platformSelect.value;
    const base = promptInput.value.trim();
    const enforced = applyRules('surprise', base); // generic enforcement
    const ar = aspectSelect.value || enforced.ar || "1:1";
    const negative = includeNegative.checked ? (presetNegative || enforced.negative) : "";
    const fmt = formatForPlatform(platform, enforced.text, negative, ar);

    const html = `
      <div class="kv"><label>Platform</label><div class="tag">${platform}</div></div>
      <div class="kv"><label>Aspect</label><div class="tag">${ar}</div><label>Strength</label><div class="tag">${creativity.value}</div><label>Chaos</label><div class="tag">${chaos.value}</div></div>
      <hr/>
      <div><strong>Final</strong><br/><pre>${fmt.final}</pre></div>
      ${negative?`<div><strong>Negative</strong><br/><pre>${negative}</pre></div>`:''}
    `;
    out.innerHTML = html;
  }
  [platformSelect, aspectSelect, includeNegative, useRules, smartFormat, creativity, chaos].forEach(x=>x.addEventListener('input', ()=>renderOutput()));
  promptInput.addEventListener('input', ()=>renderOutput());

  // History
  const maxHistory = 200;
  function pushHistory(text){
    let list = JSON.parse(localStorage.getItem('ps_history')||'[]');
    list.unshift({ t: Date.now(), text });
    list = list.slice(0, maxHistory);
    localStorage.setItem('ps_history', JSON.stringify(list));
    renderHistory();
  }
  function renderHistory(){
    const list = JSON.parse(localStorage.getItem('ps_history')||'[]');
    historyEl.innerHTML = list.map((item,i)=>{
      const d = new Date(item.t);
      return `<div><span class="small">${d.toLocaleString()}</span> — ${item.text.substring(0,180)} <a href="#" data-i="${i}" class="restore">(restore)</a></div>`;
    }).join('');
    historyEl.querySelectorAll('.restore').forEach(a=>{
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        const i = +e.target.dataset.i;
        const list = JSON.parse(localStorage.getItem('ps_history')||'[]');
        if (list[i]) { promptInput.value = list[i].text; renderOutput(); }
      });
    });
  }
  renderHistory();

  // Copy helpers
  function copy(text){ navigator.clipboard.writeText(text); }
  el('copyPositive').addEventListener('click', ()=>{
    const base = promptInput.value.trim(); copy(base);
  });
  el('copyNegative').addEventListener('click', ()=>{
    const negative = includeNegative.checked ? WORD_LIBRARY.negatives_common.slice(0,12).join(', ') : '';
    copy(negative);
  });
  el('copyAll').addEventListener('click', ()=>{
    copy(out.innerText.trim());
  });

  // Image→Prompt: palette-based tags
  const imgInput = el('imgInput');
  const imgCanvas = el('imgCanvas');
  const imgInfo = el('imgInfo');
  const imgTags = el('imgTags');
  imgInput.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if (!file) return;
    const fr = new FileReader();
    fr.onload = ()=>{
      const img = new Image();
      img.onload = ()=>{
        const w = 256, h = Math.round(img.height*256/img.width);
        imgCanvas.width = w; imgCanvas.height = h;
        const ctx = imgCanvas.getContext('2d');
        ctx.drawImage(img,0,0,w,h);
        const {palette, stats} = extractPalette(ctx, w, h, 8);
        imgInfo.textContent = `${file.name} • ${img.type} • ${Math.round(file.size/1024)} KB • ${img.width||img.naturalWidth}×${img.height||img.naturalHeight}`;
        imgTags.innerHTML = "";
        palette.forEach(hex=>{
          const span = document.createElement('span'); span.className='tag';
          span.style.background = hex; span.style.color = '#000'; span.textContent = hex;
          imgTags.appendChild(span);
        });
        // Heuristic tags
        const ar = (img.width||img.naturalWidth)/(img.height||img.naturalHeight);
        const arTag = ar>1.35 ? 'landscape' : (ar<0.75?'portrait':'square-ish');
        const mood = rand(WORD_LIBRARY.moods);
        const env = rand(WORD_LIBRARY.environments);
        const adj = rand(WORD_LIBRARY.adjectives_visual);
        const hint = `${adj} ${mood} ${env}, palette ${palette.slice(0,3).join(', ')}`;
        promptInput.value = hint;
        renderOutput();
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });

  function extractPalette(ctx, w, h, n){
    const data = ctx.getImageData(0,0,w,h).data;
    const buckets = {};
    for (let i=0;i<data.length;i+=4){
      const r = data[i], g = data[i+1], b = data[i+2];
      // quantize to 16 levels per channel
      const qr = (r>>4)<<4, qg = (g>>4)<<4, qb = (b>>4)<<4;
      const key = `${qr},${qg},${qb}`;
      buckets[key] = (buckets[key]||0)+1;
    }
    const entries = Object.entries(buckets).sort((a,b)=>b[1]-a[1]).slice(0,n);
    const palette = entries.map(([k])=>{
      const [r,g,b] = k.split(',').map(Number);
      return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
    });
    return { palette, stats: entries };
  }

  // Save prompt to file
  el('btnSave').addEventListener('click', ()=>{
    const txt = out.textContent.trim() || promptInput.value.trim();
    const blob = new Blob([txt], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'prompt.txt';
    a.click();
  });

  // Theme init
  document.documentElement.className = themeSelect.value;

})(); 
