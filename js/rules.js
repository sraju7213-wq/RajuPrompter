
window.RULES = (function(){
  const qualityTags = ["masterpiece","best quality","high resolution","photorealistic","8k","ultra detailed","official art","studio quality","intricate"];
  const envTags = ["in a bamboo forest","on a windswept cliff","under neon lights","inside an ancient temple","on a floating island","in a misty valley","in a sunlit studio","on a rainy street","in a crystal cavern"];
  const camera = {
    lenses:["50mm f/1.4","85mm f/1.8","35mm f/1.4","105mm macro","24mm wide","70-200mm f/2.8"],
    bodies:["full-frame DSLR","mirrorless","medium format","cinema camera"],
    angles:["eye level","low angle","high angle","bird's-eye","worm's-eye","Dutch angle"],
    framing:["close-up","medium shot","wide shot","extreme close-up","full body"],
    lighting:["softbox key light","rim light","golden hour","overcast diffuse","neon glow","hard sunlight","studio three-point"]
  };

  function ensureSections(tokens){
    // Ensure: quality (front) / subject (middle) / environment (end)
    const q = qualityTags.filter(t => tokens.join(' ').toLowerCase().includes(t));
    const hasQ = q.length>0;
    if(!hasQ) tokens.unshift(qualityTags[0]);
    // Add environment if missing a preposition "in/on/under/inside"
    if(!/\b(in|on|under|inside|at)\b/.test(tokens.join(' '))) tokens.push(envTags[Math.floor(Math.random()*envTags.length)]);
    return tokens;
  }

  function grammarCleanup(text){
    return text
      .replace(/\s+,/g, ',')
      .replace(/,+/g, ',')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s*--/g, ' --')
      .trim();
  }

  function scorePrompt(text, targetRange){
    const wc = text.split(/\s+/).filter(Boolean).length;
    const lenScore = Math.max(0, 1 - Math.abs(((targetRange[0]+targetRange[1])/2) - wc)/targetRange[1]);
    const hasCamera = /\bmm\b|DSLR|mirrorless|medium format|cinema camera/i.test(text) ? 0.2 : 0;
    const hasLighting = /(hour|light|studio|neon|overcast|rim)/i.test(text) ? 0.2 : 0;
    const structure = /,/.test(text) ? 0.2 : 0;
    return +(lenScore + hasCamera + hasLighting + structure).toFixed(2);
  }

  function build({style, subject, action, env, color, mood}){
    const parts = [
      style, subject, action,
      camera.framing[Math.floor(Math.random()*camera.framing.length)],
      env, camera.lighting[Math.floor(Math.random()*camera.lighting.length)],
      camera.angles[Math.floor(Math.random()*camera.angles.length)],
      camera.bodies[Math.floor(Math.random()*camera.bodies.length)] + ', ' + camera.lenses[Math.floor(Math.random()*camera.lenses.length)],
      color, mood
    ].filter(Boolean);
    return ensureSections(parts).join(', ');
  }

  return { build, scorePrompt, grammarCleanup };
})();
