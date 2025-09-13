// Kazimir-ai Prompt Dataset Integration
// Loads dataset, builds weighted pools, generates prompts with anti-repetition logic.

let kazimirPools = {
  qualityEnhancers: [],
  subjectTags: [],
  styleKeywords: [],
  technicalTerms: []
};

const recentKeywords = [];
const recentPrompts = [];
const RECENT_KEYWORD_LIMIT = 50;
const RECENT_PROMPT_LIMIT = 20;

/**
 * Load and parse the Kazimir-ai CSV dataset using PapaParse
 * @param {string} url - URL/path to the CSV file
 * @returns {Promise<Array<{name: string, count: number}>>}
 */
async function loadKazimirDataset(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: results => {
        const rows = (results.data || [])
          .filter(r => r.name && r.count)
          .map(r => ({ name: String(r.name).trim(), count: Number(r.count) }));
        resolve(rows);
      },
      error: err => reject(err)
    });
  });
}

/**
 * Categorize keywords into weighted pools
 * @param {Array<{name: string, count: number}>} rows
 */
function buildKeywordPools(rows) {
  const pools = {
    qualityEnhancers: [],
    subjectTags: [],
    styleKeywords: [],
    technicalTerms: []
  };

  const qualitySet = new Set([
    'photorealistic', 'ultra detailed', '8k', 'hdr', 'cinematic',
    'award winning', 'high detail', 'masterpiece', 'sharp focus'
  ]);
  const subjectSet = new Set([
    'portrait', 'landscape', 'cityscape', 'animal', 'robot', 'celebrity',
    'fantasy character', 'architecture', 'vehicle'
  ]);
  const styleSet = new Set([
    'digital painting', 'watercolor', 'oil painting', 'cyberpunk',
    'anime', 'impressionism', 'surrealism', 'minimalism'
  ]);
  const technicalSet = new Set([
    'bokeh', 'depth of field', 'wide angle', 'macro',
    'volumetric lighting', 'octane render', 'overhead shot',
    'long exposure'
  ]);

  rows.forEach(r => {
    const kw = r.name.toLowerCase();
    const weight = r.count;
    if (qualitySet.has(kw)) pools.qualityEnhancers.push({ keyword: kw, weight });
    else if (subjectSet.has(kw)) pools.subjectTags.push({ keyword: kw, weight });
    else if (styleSet.has(kw)) pools.styleKeywords.push({ keyword: kw, weight });
    else if (technicalSet.has(kw)) pools.technicalTerms.push({ keyword: kw, weight });
  });

  kazimirPools = pools;
  return pools;
}

/**
 * Weighted random sampling without replacement
 * @param {Array<{keyword: string, weight: number}>} pool
 * @param {number} count
 */
function weightedSample(pool, count = 1) {
  const items = [...pool];
  const selected = [];

  for (let i = 0; i < count && items.length; i++) {
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * total;
    let index = 0;
    while (rand >= items[index].weight) {
      rand -= items[index].weight;
      index++;
    }
    const [item] = items.splice(index, 1);
    selected.push(item.keyword);
  }

  return selected;
}

/**
 * Filter pool to avoid recently used keywords
 */
function filterRecent(pool) {
  return pool.filter(item => !recentKeywords.includes(item.keyword));
}

function updateRecentKeywords(words) {
  recentKeywords.push(...words);
  if (recentKeywords.length > RECENT_KEYWORD_LIMIT) {
    recentKeywords.splice(0, recentKeywords.length - RECENT_KEYWORD_LIMIT);
  }
}

function updateRecentPrompts(prompt) {
  recentPrompts.push(prompt);
  if (recentPrompts.length > RECENT_PROMPT_LIMIT) {
    recentPrompts.shift();
  }
}

/**
 * Generate a human-readable AI image prompt
 * @param {Object} opts
 * @param {string} opts.subject - Core subject (e.g., celebrity name)
 * @param {string} [opts.style] - User-selected style or theme
 * @param {string[]} [opts.extras] - Additional user parameters
 */
function generateKazimirPrompt({ subject, style = '', extras = [] }) {
  if (!subject) throw new Error('Subject name is required');
  const pools = kazimirPools;
  const quality = weightedSample(filterRecent(pools.qualityEnhancers), 1);
  const subjectTag = weightedSample(filterRecent(pools.subjectTags), 1);
  const styleTag = weightedSample(filterRecent(pools.styleKeywords), 1);
  const technical = weightedSample(filterRecent(pools.technicalTerms), 1);

  const keywords = [...quality, ...subjectTag, ...styleTag, ...technical];
  updateRecentKeywords(keywords);

  const parts = [subject, style, keywords.join(', '), extras.join(', ')].filter(Boolean);
  const prompt = parts.join(', ');

  if (recentPrompts.includes(prompt)) {
    return generateKazimirPrompt({ subject, style, extras });
  }
  updateRecentPrompts(prompt);
  return prompt;
}

/**
 * Initialize system: load dataset and build pools
 * @param {string} csvUrl
 */
async function initKazimirPrompts(csvUrl) {
  const rows = await loadKazimirDataset(csvUrl);
  buildKeywordPools(rows);
}

// Expose functions globally for integration
window.initKazimirPrompts = initKazimirPrompts;
window.generateKazimirPrompt = generateKazimirPrompt;

// Example usage:
// initKazimirPrompts('kazimir_dataset.csv').then(() => {
//   const prompt = generateKazimirPrompt({
//     subject: 'Emma Watson',
//     style: 'ethereal cyberpunk',
//     extras: ['soft lighting']
//   });
//   console.log('Generated Prompt:', prompt);
// });
