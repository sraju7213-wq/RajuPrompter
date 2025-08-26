
(() => {
  const $ = (id)=>document.getElementById(id);
  const themeSel = $('theme');
  const platformSel = $('platform');
  const aspectSel = $('aspect');
  const promptIn = $('prompt');
  const finalOut = $('final');
  const tagsEl = $('tags');
  const fileIn = $('file');
  const imgEl = $('preview');
  const analyzeBtn = $('analyzeBtn');
  const copyBtn = $('copyBtn');
  const saveBtn = $('saveBtn');
  const negToggle = $('negToggle');
  const negOut = $('negOut');
  const statusEl = $('status');
  const historyEl = $('history');

  // Theme
  themeSel.addEventListener('change', ()=>{ document.documentElement.className = themeSel.value; localStorage.setItem('ps_theme', themeSel.value); });
  (function(){ const t = localStorage.getItem('ps_theme') || 'theme-dark'; themeSel.value=t; document.documentElement.className=t; })();

  // Platform + AR
  platformSel.addEventListener('change', ()=>render());
  aspectSel.innerHTML = RULES.platforms.midjourney.ar.map(ar=>`<option>${ar}</option>`).join('');
  aspectSel.addEventListener('change', ()=>render());
  negToggle.addEventListener('change', ()=>render());
  promptIn.addEventListener('input', ()=>render());

  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function genBase(kind){
    const style = pick(ADV_LIBRARY.styles);
    const mood = pick(["serene","dramatic","mysterious","whimsical","epic","romantic","noir","vibrant","pastel"]);
    const subject = kind==='nature' ? pick(["landscape","seascape","waterfall","glacier","canyon","forest","desert"]) : pick(ADV_LIBRARY.subjects);
    const action = pick(["gazing","dancing","forging","floating","running","conjuring","exploring"]);
    const lighting = pick(ADV_LIBRARY.lighting);
    const lens = pick(ADV_LIBRARY.lenses);
    const env = pick(ADV_LIBRARY.environments);
    const colors = pick(ADV_LIBRARY.colors) + " and " + pick(ADV_LIBRARY.colors);
    return RULES.template({style, mood, subject, action, lighting, lens, env, colors});
  }

  document.querySelectorAll('[data-gen]').forEach(b=>b.addEventListener('click', ()=>{ promptIn.value = genBase(b.dataset.gen); pushHistory(promptIn.value); render(); }));

  function render(){
    const platform = platformSel.value;
    const ar = aspectSel.value;
    const txt = promptIn.value.trim();
    const comp = RULES.platforms[platform].compose;
    const final = comp(txt, ar);
    finalOut.textContent = final;
    if (negToggle.checked){
      negOut.textContent = ADV_LIBRARY.negatives.slice(0,12).join(', ');
      negOut.parentElement.classList.remove('hidden');
    } else {
      negOut.parentElement.classList.add('hidden');
    }
  }

  // Copy/Save
  copyBtn.addEventListener('click', ()=>navigator.clipboard.writeText(finalOut.innerText.trim()));
  saveBtn.addEventListener('click', ()=>{ const blob=new Blob([finalOut.innerText.trim()],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='prompt.txt'; a.click(); });

  // History
  function pushHistory(text){
    let list = JSON.parse(localStorage.getItem('ps_history2')||'[]');
    list.unshift({t: Date.now(), text}); list = list.slice(0,200);
    localStorage.setItem('ps_history2', JSON.stringify(list)); renderHistory();
  }
  function renderHistory(){
    const list = JSON.parse(localStorage.getItem('ps_history2')||'[]');
    historyEl.innerHTML = list.map((it,i)=>{
      const d = new Date(it.t).toLocaleString();
      return `<div class="small"><span>${d}</span> — <em>${it.text.slice(0,120)}</em> <a href="#" data-i="${i}" class="restore">restore</a></div>`;
    }).join('');
    historyEl.querySelectorAll('.restore').forEach(a=>a.addEventListener('click',(e)=>{
      e.preventDefault();
      const i=+e.target.dataset.i; const list=JSON.parse(localStorage.getItem('ps_history2')||'[]');
      if (list[i]){{ promptIn.value=list[i].text; render(); }}
    }));
  }
  renderHistory();

  // TensorFlow.js
  const tfState = { mobilenet:null, cocossd:null, ready:false };
  async function ensureTF(){
    if (tfState.ready) return;
    setStatus('Loading TensorFlow.js models…');
    try {
      const [mn, det] = await Promise.all([ mobilenet.load(), cocoSsd.load() ]);
      tfState.mobilenet = mn; tfState.cocossd = det; tfState.ready = true;
      setStatus('Models ready.');
    } catch (err){ console.error(err); setStatus('Failed to load TF models (check internet or use local).', true); }
  }
  function setStatus(msg, error=false){ statusEl.textContent = msg; statusEl.style.color = error ? '#ff6b6b' : ''; }

  fileIn.addEventListener('change', async (e)=>{
    const file = e.target.files[0]; if (!file) return;
    const url = URL.createObjectURL(file); imgEl.src = url;
    imgEl.onload = async ()=>{
      await ensureTF(); if (!tfState.ready) return;
      const tags = new Set();
      const preds = await tfState.mobilenet.classify(imgEl, 5).catch(()=>[]);
      preds.forEach(p=> tags.add(p.className.split(',')[0].trim()));
      const dets = await tfState.cocossd.detect(imgEl).catch(()=>[]);
      dets.forEach(d=> tags.add(d.class));
      const {palette} = extractPalette(imgEl);
      palette.slice(0,3).forEach(hex=> tags.add(hex));
      tagsEl.innerHTML='';
      Array.from(tags).slice(0,24).forEach(t=>{ const s=document.createElement('span'); s.className='tag'; s.textContent=t; tagsEl.appendChild(s); });
      const style = pick(ADV_LIBRARY.styles);
      const lighting = pick(ADV_LIBRARY.lighting);
      const lens = pick(ADV_LIBRARY.lenses);
      const colors = palette.slice(0,2).join(' and ');
      const subject = Array.from(tags).find(t=>!/^#/.test(t)) || 'subject';
      const hint = `${style} ${subject}, ${lighting}, ${lens}, ${colors} palette`;
      promptIn.value = hint; pushHistory(hint); render();
    };
  });

  function extractPalette(img){
    const c = document.createElement('canvas');
    const w=160; const h=Math.round(img.naturalHeight*160/img.naturalWidth);
    c.width=w; c.height=h; const ctx=c.getContext('2d'); ctx.drawImage(img,0,0,w,h);
    const data=ctx.getImageData(0,0,w,h).data; const buckets={};
    for (let i=0;i<data.length;i+=4){ const r=data[i],g=data[i+1],b=data[i+2]; const key=`${(r>>4)<<4},${(g>>4)<<4},${(b>>4)<<4}`; buckets[key]=(buckets[key]||0)+1; }
    const entries=Object.entries(buckets).sort((a,b)=>b[1]-a[1]).slice(0,8);
    const palette=entries.map(([k])=>{ const [r,g,b]=k.split(',').map(Number); return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join(''); });
    return {{palette}};
  }

  // Initial
  promptIn.value = genBase('portrait');
  render();
})();
