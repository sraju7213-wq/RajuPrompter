// AI Prompt Generator v3.0 - modular class-based architecture with advanced UX
console.log('🚀 AI Prompt Generator v3.0 initializing...');

const DISCLOSURE_BREAKPOINTS = { sm: 480, md: 768, lg: 1024 };
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])';
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const colorPaletteDescriptions = {
  monochrome: 'monochrome neutral palette',
  vibrant: 'vibrant complementary colors',
  pastel: 'soft pastel color palette',
  cinematic: 'cinematic teal and orange tones',
  custom: (hex) => `color grading inspired by ${hex}`
};

// Word Library Data - Complete with 1000+ words
const wordLibrary = {
    subjects: {
        people: [
            'portrait', 'woman', 'man', 'child', 'elderly', 'teenager', 'baby', 'couple', 'family', 'crowd',
            'warrior', 'knight', 'princess', 'king', 'queen', 'wizard', 'witch', 'artist', 'musician', 'dancer',
            'athlete', 'doctor', 'teacher', 'scientist', 'engineer', 'chef', 'pilot', 'sailor', 'farmer', 'student',
            'businessperson', 'model', 'actor', 'photographer', 'writer', 'poet', 'philosopher', 'monk', 'nun', 'priest',
            'shaman', 'healer', 'guardian', 'protector', 'leader', 'hero', 'villain', 'rebel', 'outlaw', 'detective',
            'spy', 'assassin', 'mercenary', 'gladiator', 'samurai', 'ninja', 'pirate', 'explorer', 'adventurer', 'nomad',
            'traveler', 'pilgrim', 'wanderer', 'hermit', 'sage', 'oracle', 'prophet', 'mystic', 'alchemist', 'inventor'
        ],
        animals: [
            'cat', 'dog', 'horse', 'lion', 'tiger', 'elephant', 'wolf', 'fox', 'bear', 'eagle',
            'owl', 'hawk', 'raven', 'crow', 'peacock', 'swan', 'dove', 'hummingbird', 'butterfly', 'dragonfly',
            'spider', 'snake', 'lizard', 'turtle', 'frog', 'fish', 'shark', 'whale', 'dolphin', 'octopus',
            'dragon', 'phoenix', 'unicorn', 'griffin', 'pegasus', 'chimera', 'sphinx', 'basilisk', 'hydra', 'kraken',
            'deer', 'rabbit', 'squirrel', 'mouse', 'rat', 'hamster', 'guinea pig', 'ferret', 'hedgehog', 'raccoon',
            'skunk', 'opossum', 'badger', 'otter', 'beaver', 'porcupine', 'armadillo', 'sloth', 'monkey', 'ape',
            'gorilla', 'chimpanzee', 'orangutan', 'lemur', 'koala', 'kangaroo', 'wallaby', 'platypus', 'echidna', 'wombat'
        ],
        objects: [
            'sword', 'shield', 'armor', 'helmet', 'crown', 'jewel', 'ring', 'necklace', 'bracelet', 'pendant',
            'crystal', 'orb', 'staff', 'wand', 'scroll', 'book', 'tome', 'grimoire', 'map', 'compass',
            'lantern', 'torch', 'candle', 'fire', 'flame', 'ember', 'spark', 'smoke', 'ash', 'coal',
            'flower', 'rose', 'lily', 'tulip', 'daisy', 'sunflower', 'orchid', 'lotus', 'cherry blossom', 'lavender',
            'tree', 'oak', 'pine', 'willow', 'maple', 'birch', 'cedar', 'bamboo', 'palm', 'cactus',
            'mountain', 'hill', 'valley', 'canyon', 'cliff', 'cave', 'waterfall', 'river', 'lake', 'ocean',
            'castle', 'tower', 'fortress', 'palace', 'cathedral', 'temple', 'shrine', 'monastery', 'house', 'cottage',
            'ship', 'boat', 'yacht', 'sailboat', 'submarine', 'airplane', 'helicopter', 'rocket', 'spaceship', 'car'
        ]
    },
    styles: {
        art_movements: [
            'impressionist', 'expressionist', 'cubist', 'surreal', 'abstract', 'realist', 'romantic', 'baroque', 'renaissance', 'gothic',
            'art nouveau', 'art deco', 'minimalist', 'maximalist', 'pop art', 'street art', 'graffiti', 'contemporary', 'modern', 'postmodern',
            'dadaist', 'futurist', 'constructivist', 'fauve', 'pointillist', 'neo-classical', 'rococo', 'mannerist', 'byzantine', 'islamic',
            'japanese', 'chinese', 'indian', 'african', 'aboriginal', 'aztec', 'mayan', 'egyptian', 'greek', 'roman'
        ],
        artistic_styles: [
            'photorealistic', 'hyperrealistic', 'stylized', 'cartoon', 'anime', 'manga', 'chibi', 'pixel art', 'vector art', 'digital art',
            'traditional art', 'oil painting', 'watercolor', 'acrylic', 'pastel', 'charcoal', 'pencil', 'ink', 'pen and ink', 'cross-hatch',
            'sketch', 'doodle', 'illustration', 'concept art', 'matte painting', 'speed painting', 'plein air', 'still life', 'portrait', 'landscape'
        ],
        visual_styles: [
            'cinematic', 'dramatic', 'ethereal', 'dreamy', 'whimsical', 'dark', 'moody', 'bright', 'vibrant', 'muted',
            'soft', 'hard', 'sharp', 'blurred', 'focused', 'detailed', 'simple', 'complex', 'ornate', 'elegant'
        ]
    },
    lighting: {
        natural: [
            'sunlight', 'moonlight', 'starlight', 'daylight', 'twilight', 'dawn', 'dusk', 'golden hour', 'blue hour', 'magic hour',
            'overcast', 'cloudy', 'stormy', 'foggy', 'misty', 'hazy', 'clear', 'bright', 'dim', 'shadowy'
        ],
        artificial: [
            'neon', 'fluorescent', 'LED', 'incandescent', 'candlelight', 'firelight', 'torchlight', 'lantern light', 'spotlight', 'floodlight',
            'backlighting', 'rim lighting', 'key lighting', 'fill lighting', 'ambient lighting', 'mood lighting', 'dramatic lighting', 'soft lighting', 'hard lighting', 'directional lighting'
        ],
        qualities: [
            'warm', 'cool', 'soft', 'harsh', 'gentle', 'intense', 'subtle', 'bold', 'glowing', 'shimmering',
            'sparkling', 'twinkling', 'flickering', 'pulsing', 'steady', 'changing', 'colorful', 'monochrome', 'rainbow', 'prismatic'
        ]
    },
    colors: {
        primary: [
            'red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
            'gray', 'grey', 'silver', 'gold', 'bronze', 'copper', 'platinum', 'cream', 'beige', 'tan'
        ],
        warm: [
            'crimson', 'scarlet', 'burgundy', 'maroon', 'coral', 'salmon', 'peach', 'apricot', 'amber', 'honey',
            'mustard', 'ochre', 'sienna', 'rust', 'burnt orange', 'terracotta', 'brick red', 'cherry red', 'wine red', 'rose red'
        ],
        cool: [
            'azure', 'cerulean', 'cobalt', 'navy', 'royal blue', 'sky blue', 'ice blue', 'teal', 'turquoise', 'aqua',
            'mint', 'sage', 'forest green', 'emerald', 'jade', 'lime', 'olive', 'lavender', 'violet', 'indigo'
        ]
    },
    composition: {
        camera_angles: [
            'close-up', 'medium shot', 'long shot', 'extreme close-up', 'extreme long shot', 'bird\'s eye view', 'worm\'s eye view', 'eye level', 'high angle', 'low angle',
            'dutch angle', 'over the shoulder', 'point of view', 'aerial view', 'profile', 'three-quarter view', 'front view', 'back view', 'side view', 'diagonal view'
        ],
        framing: [
            'centered', 'off-center', 'rule of thirds', 'golden ratio', 'symmetrical', 'asymmetrical', 'balanced', 'unbalanced', 'tight framing', 'loose framing',
            'full frame', 'cropped', 'vignette', 'border', 'frame within frame', 'negative space', 'positive space', 'leading lines', 'converging lines', 'diagonal lines'
        ]
    },
    moods: {
        positive: [
            'joyful', 'happy', 'cheerful', 'optimistic', 'peaceful', 'serene', 'calm', 'tranquil', 'relaxed', 'content',
            'blissful', 'euphoric', 'ecstatic', 'elated', 'triumphant', 'victorious', 'confident', 'proud', 'satisfied', 'fulfilled'
        ],
        negative: [
            'sad', 'melancholy', 'somber', 'gloomy', 'dark', 'moody', 'brooding', 'ominous', 'foreboding', 'threatening',
            'angry', 'furious', 'rage', 'hostile', 'aggressive', 'tense', 'anxious', 'worried', 'fearful', 'terrifying'
        ]
    }
};

const platformData = {
    midjourney: {
        name: 'Midjourney',
        optimalLength: '20-75 words',
        supportsNegative: false,
        parameters: ['ar', 's', 'q', 'seed'],
        maxChars: 650
    },
    stable_diffusion: {
        name: 'Stable Diffusion',
        optimalLength: '10-150 words',
        supportsNegative: true,
        parameters: ['steps', 'cfg_scale', 'seed'],
        maxChars: 800
    },
    flux_ai: {
        name: 'Flux AI',
        optimalLength: '15-100 words',
        supportsNegative: false,
        parameters: ['model', 'guidance'],
        maxChars: 700
    },
    dall_e: {
        name: 'DALL-E',
        optimalLength: '10-80 words',
        supportsNegative: false,
        parameters: ['size', 'quality', 'style'],
        maxChars: 600
    },
    natural_language: {
        name: 'Natural Language',
        optimalLength: '5-200 words',
        supportsNegative: false,
        parameters: [],
        maxChars: 2000
    },
    leonardo: {
        name: 'Leonardo AI',
        optimalLength: '10-120 words',
        supportsNegative: true,
        parameters: ['cfg_scale', 'style', 'model'],
        maxChars: 700
    },
    playground: {
        name: 'Playground AI',
        optimalLength: '15-120 words',
        supportsNegative: true,
        parameters: ['cfg_scale', 'style_strength'],
        maxChars: 500
    }
};

const themes = {
    dark_professional: {
        name: 'Dark Professional',
        primary: '#3b82f6',
        background: '#0f172a'
    },
    light_modern: {
        name: 'Light Modern',
        primary: '#0ea5e9',
        background: '#ffffff'
    },
    cyberpunk_neon: {
        name: 'Cyberpunk Neon',
        primary: '#1db954',
        background: '#000000'
    },
    warm_autumn: {
        name: 'Warm Autumn',
        primary: '#d97706',
        background: '#1c1917'
    },
    ocean_blue: {
        name: 'Ocean Blue',
        primary: '#0284c7',
        background: '#082f49'
    },
    pastel_dreams: {
        name: 'Pastel Dreams',
        primary: '#a855f7',
        background: '#fefce8'
    },
    forest_green: {
        name: 'Forest Green',
        primary: '#059669',
        background: '#022c22'
    },
    sunset_gradient: {
        name: 'Sunset Gradient',
        primary: '#f59e0b',
        background: '#431407'
    }
};

function ensureDirective(text, directive) {
  return text.includes(directive) ? text : `${text.trim()} ${directive}`.trim();
}

function truncatePrompt(text, maxLength) {
  if (!maxLength || text.length <= maxLength) {
    return text;
  }
  const truncated = text.slice(0, maxLength - 1);
  const lastComma = truncated.lastIndexOf(',');
  if (lastComma > 120) {
    return `${truncated.slice(0, lastComma)}…`;
  }
  return `${truncated}…`;
}

const platformOptimizations = {
  midjourney: {
    label: 'Midjourney',
    maxChars: 650,
    apply(text, context) {
      let updated = text.trim();
      const aspect = context.aspect || '1:1';
      if (!/--ar\s*\d+:\d+/i.test(updated)) {
        updated = ensureDirective(updated, `--ar ${aspect}`);
      }
      updated = ensureDirective(updated, '--stylize 100');
      updated = ensureDirective(updated, '--quality 1');
      const warnings = [];
      if (updated.length > this.maxChars) {
        warnings.push(`Midjourney prefers prompts under ${this.maxChars} characters.`);
      }
      return { text: updated, warnings };
    }
  },
  stable_diffusion: {
    label: 'Stable Diffusion',
    maxChars: 800,
    apply(text, context) {
      let updated = text.trim();
      const aspect = context.aspect || '1:1';
      if (!updated.toLowerCase().includes('aspect ratio')) {
        updated = `${updated}, aspect ratio ${aspect}`;
      }
      if (!updated.toLowerCase().includes('cfg')) {
        updated = `${updated}, cfg scale 7`;
      }
      if (!updated.toLowerCase().includes('steps')) {
        updated = `${updated}, steps 40`;
      }
      if (!updated.toLowerCase().includes('negative prompts')) {
        updated = `${updated} | negative prompts: blurry, low detail, artifacts`;
      }
      const warnings = [];
      if (updated.length > this.maxChars) {
        warnings.push(`Stable Diffusion prompts work best under ${this.maxChars} characters.`);
      }
      return { text: updated, warnings };
    }
  },
  dall_e: {
    label: 'DALL-E',
    maxChars: 600,
    apply(text) {
      let updated = text.trim();
      if (!updated.toLowerCase().includes('digital') && !updated.toLowerCase().includes('illustration')) {
        updated = `Detailed digital illustration of ${updated}`;
      }
      updated = truncatePrompt(updated, this.maxChars - 20);
      updated = ensureDirective(updated, 'high fidelity, rich details');
      const warnings = [];
      if (updated.length > this.maxChars) {
        warnings.push(`DALL-E enforces ${this.maxChars} character limit. Prompt truncated.`);
      }
      return { text: updated.slice(0, this.maxChars), warnings };
    }
  },
  leonardo: {
    label: 'Leonardo AI',
    maxChars: 700,
    apply(text) {
      let updated = text.trim();
      if (!updated.toLowerCase().includes('cinematic')) {
        updated = `${updated}, cinematic lighting`;
      }
      updated = ensureDirective(updated, 'ultra detailed, volumetric lighting');
      const warnings = [];
      if (updated.length > this.maxChars) {
        warnings.push(`Leonardo AI prompts should be below ${this.maxChars} characters.`);
      }
      return { text: truncatePrompt(updated, this.maxChars), warnings };
    }
  },
  playground: {
    label: 'Playground AI',
    maxChars: 500,
    apply(text) {
      let updated = text.trim();
      updated = ensureDirective(updated, 'dreamlike, concept art, imaginative storytelling');
      const warnings = [];
      if (updated.length > this.maxChars) {
        warnings.push(`Playground AI works best with prompts under ${this.maxChars} characters.`);
      }
      return { text: truncatePrompt(updated, this.maxChars), warnings };
    }
  }
};

class PromptGenerator {
  constructor() {
    this.currentPlatform = 'natural_language';
    this.currentTheme = 'cyberpunk_neon';
    this.currentPrompt = '';
    this.promptHistory = [];
    this.savedPrompts = [];
    this.textGenerator = null;
    this.imageCaptioner = null;
    this.lastImageTags = [];
    this.lastColorHex = '';
    this.desiredPromptLength = 300;
    this.currentAspectRatio = '1:1';
    this.currentDescriptionMode = 'describe-detail';
    this.magicEnhanceEnabled = false;
    this.optimizeTimer = null;
    this.activeModal = null;
    this.activeDrawer = null;
    this.lastFocusedElement = null;
    this.disclosureResizeTimer = null;
    this.dragCounter = 0;
    this.platformToggles = new Set();
    this.builderState = {
      subject: '',
      artStyle: '',
      lighting: '',
      colorPalette: 'monochrome',
      customColor: '#1db954',
      composition: '',
      camera: '',
      mood: ''
    };
    this.builderPrompt = '';
    this.selectedBatchPrompts = new Set();
    this.abTesting = { A: '', B: '' };
    this.cachedElements = {};
  }

  initialize() {
    this.cacheDom();
    const hasStored = this.loadFromStorage();
    if (!hasStored) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark_professional' : 'cyberpunk_neon';
    }
    this.applyTheme(this.currentTheme);
    this.registerServiceWorker();
    this.setupEventListeners();
    this.setupResponsiveEnhancements();
    this.initializeWordBank();
    this.initImageAnalyzer();
    this.updatePlatformBadge();
    this.updatePlatformGuidelines();
    this.updateBuilderPreview();
    this.updatePromptPreview();
    this.updateWordCount();
    this.updateQualityScore();
    this.updateActionStates();
    this.getAISuggestions();
    console.log('✅ App initialized');
  }

  cacheDom() {
    this.cachedElements = {
      promptTextarea: document.getElementById('prompt-textarea'),
      charCounter: document.getElementById('char-count'),
      wordCountPill: document.getElementById('word-count'),
      wordCountMetric: document.getElementById('word-count-display'),
      qualityIndicator: document.getElementById('quality-indicator'),
      qualityScoreDisplay: document.getElementById('quality-score'),
      platformCompatibility: document.getElementById('platform-compatibility'),
      previewContent: document.getElementById('preview-content'),
      platformBadge: document.getElementById('platform-badge'),
      platformSelect: document.getElementById('platform-select'),
      platformAlert: document.getElementById('platform-alert'),
      platformGuidelinesList: document.getElementById('platform-guidelines-list'),
      themeSelect: document.getElementById('theme-select'),
      themeModeToggle: document.getElementById('theme-mode-toggle'),
      promptLength: document.getElementById('prompt-length'),
      aspectRatioGroup: document.getElementById('aspect-ratio-group'),
      uploadZone: document.getElementById('upload-zone'),
      imageUploadInput: document.getElementById('image-upload'),
      uploadStatus: document.getElementById('upload-status'),
      uploadFeedback: document.getElementById('upload-feedback'),
      uploadProgress: document.getElementById('upload-progress'),
      uploadProgressValue: document.getElementById('upload-progress-value'),
      uploadProgressPercent: document.getElementById('upload-progress-percent'),
      analysisLoading: document.getElementById('analysis-loading'),
      previewContainer: document.getElementById('preview-container'),
      uploadedImg: document.getElementById('uploaded-img'),
      analysisCard: document.getElementById('analysis-results'),
      analysisTags: document.getElementById('analysis-tags'),
      descriptionGrid: document.getElementById('description-grid'),
      customQuestionField: document.getElementById('custom-question-field'),
      customQuestionInput: document.getElementById('custom-question-input'),
      naturalLanguageToggle: document.getElementById('natural-language-toggle'),
      generatedVariations: document.getElementById('generated-variations'),
      generatedSummary: document.getElementById('generated-summary'),
      batchBasePrompt: document.getElementById('batch-base-prompt'),
      batchCount: document.getElementById('batch-count'),
      variationType: document.getElementById('variation-type'),
      batchResults: document.getElementById('batch-results'),
      abSlotA: document.getElementById('ab-slot-a'),
      abSlotB: document.getElementById('ab-slot-b'),
      abSlotAMetrics: document.getElementById('ab-slot-a-metrics'),
      abSlotBMetrics: document.getElementById('ab-slot-b-metrics'),
      abSummary: document.getElementById('ab-summary'),
      builderPreview: document.getElementById('builder-preview-text'),
      builderCounter: document.getElementById('builder-counter'),
      builderWarning: document.getElementById('builder-warning'),
      builderColorPalette: document.getElementById('builder-color-palette'),
      builderColorCustom: document.getElementById('builder-color-custom'),
      promptHistory: document.getElementById('prompt-history'),
      savedPrompts: document.getElementById('saved-prompts'),
      platformToggleGrid: document.getElementById('platform-toggle-grid'),
      themeChips: document.querySelectorAll('.theme-chip')
    };
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch((err) => {
        console.warn('Service worker registration failed', err);
      });
    }
  }

  setupEventListeners() {
    const {
      platformSelect,
      themeSelect,
      themeModeToggle,
      promptLength,
      promptTextarea,
      aspectRatioGroup,
      imageUploadInput,
      naturalLanguageToggle,
      builderColorPalette,
      builderColorCustom,
      platformToggleGrid
    } = this.cachedElements;

    this.setupUploadZone();

    this.cachedElements.descriptionGrid?.addEventListener('click', (event) => this.handleDescriptionClick(event));

    platformSelect?.addEventListener('change', (event) => {
      this.handlePlatformChange(event.target.value);
    });

    themeSelect?.addEventListener('change', (event) => {
      this.applyTheme(event.target.value);
    });

    themeModeToggle?.addEventListener('click', () => {
      this.toggleThemeMode();
    });

    promptLength?.addEventListener('input', (event) => {
      this.handlePromptLengthChange(parseInt(event.target.value, 10));
    });

    if (promptTextarea) {
      promptTextarea.addEventListener('input', (event) => {
        this.currentPrompt = event.target.value;
        this.updatePromptPreview();
        this.updateWordCount();
        this.updateQualityScore();
        if (this.magicEnhanceEnabled) {
          this.debounceOptimize();
        }
      });
    }

    document.getElementById('clear-field')?.addEventListener('click', () => this.clearPrompt());
    document.getElementById('clear-prompt')?.addEventListener('click', () => this.clearPrompt());
    document.getElementById('optimize-prompt')?.addEventListener('click', () => this.optimizePrompt());
    document.getElementById('magic-enhance-toggle')?.addEventListener('change', (event) => {
      this.magicEnhanceEnabled = event.target.checked;
      if (this.magicEnhanceEnabled && this.currentPrompt) {
        this.optimizePrompt();
      }
    });

    aspectRatioGroup?.addEventListener('click', (event) => {
      const segment = event.target.closest('.segment');
      if (!segment) return;
      this.currentAspectRatio = segment.dataset.aspect || '1:1';
      Array.from(aspectRatioGroup.querySelectorAll('.segment')).forEach((btn) => {
        btn.classList.toggle('is-active', btn === segment);
      });
      this.updatePromptPreview();
      this.updateGeneratedPrompt();
    });

    imageUploadInput?.addEventListener('change', (event) => {
      const files = event.target.files;
      if (files && files[0]) {
        this.processImageFile(files[0]);
      }
    });

    naturalLanguageToggle?.addEventListener('change', () => this.updateGeneratedPrompt());

    builderColorPalette?.addEventListener('click', (event) => this.handleColorPaletteClick(event));
    builderColorCustom?.addEventListener('input', (event) => this.handleBuilderColorCustom(event.target.value));

    platformToggleGrid?.addEventListener('change', (event) => {
      const checkbox = event.target.closest('[data-platform-toggle]');
      if (!checkbox) return;
      if (checkbox.checked) {
        this.platformToggles.add(checkbox.value);
      } else {
        this.platformToggles.delete(checkbox.value);
      }
      this.updatePromptPreview();
    });

    document.getElementById('copy-prompt')?.addEventListener('click', () => this.copyToClipboard());
    document.getElementById('save-prompt')?.addEventListener('click', () => this.savePrompt());
    document.getElementById('confirm-save')?.addEventListener('click', () => this.confirmSavePrompt());
    document.getElementById('get-suggestions')?.addEventListener('click', () => this.getAISuggestions());
    document.getElementById('export-txt')?.addEventListener('click', () => this.exportToTxt());
    document.getElementById('share-prompt')?.addEventListener('click', () => this.sharePrompt());
    document.getElementById('analyze-prompt')?.addEventListener('click', () => this.deepAnalyzePrompt());
    document.getElementById('collaboration-btn')?.addEventListener('click', () => this.sharePrompt());
    document.getElementById('generate-batch')?.addEventListener('click', () => this.generateBatch());
    document.getElementById('mix-selected-prompts')?.addEventListener('click', () => this.mixSelectedPrompts());
    document.getElementById('export-json')?.addEventListener('click', () => this.exportBatchPrompts('json'));
    document.getElementById('export-csv')?.addEventListener('click', () => this.exportBatchPrompts('csv'));
    document.getElementById('mini-generator-link')?.addEventListener('click', (event) => {
      event.preventDefault();
      this.switchTab('image-generator');
    });

    document.getElementById('builder-subject')?.addEventListener('input', (event) => this.handleBuilderInput('subject', event.target.value));
    document.getElementById('builder-art-style')?.addEventListener('change', (event) => this.handleBuilderInput('artStyle', event.target.value));
    document.getElementById('builder-lighting')?.addEventListener('change', (event) => this.handleBuilderInput('lighting', event.target.value));
    document.getElementById('builder-composition')?.addEventListener('change', (event) => this.handleBuilderInput('composition', event.target.value));
    document.getElementById('builder-camera')?.addEventListener('change', (event) => this.handleBuilderInput('camera', event.target.value));
    document.getElementById('builder-mood')?.addEventListener('change', (event) => this.handleBuilderInput('mood', event.target.value));
    document.getElementById('apply-builder')?.addEventListener('click', () => this.applyBuilderToPrompt());
    document.getElementById('clear-builder')?.addEventListener('click', () => this.clearBuilder());

    document.addEventListener('click', (event) => this.handleGlobalClick(event));

    this.cachedElements.generatedVariations?.addEventListener('click', (event) => this.handleVariationClick(event));
    this.cachedElements.batchResults?.addEventListener('click', (event) => this.handleBatchClick(event));
    this.cachedElements.customQuestionInput?.addEventListener('input', () => this.updateGeneratedPrompt());
  }

  setupResponsiveEnhancements() {
    this.setupDrawer();
    this.setupThemeChips();
    this.setupDisclosures();
    this.setupHeaderShortcuts();
    this.setupModalControls();
    document.querySelectorAll('.tab-content').forEach((content) => {
      if (!content.classList.contains('active')) {
        content.setAttribute('hidden', '');
      }
    });
    this.updateDisclosureStates();
    window.addEventListener('resize', () => {
      clearTimeout(this.disclosureResizeTimer);
      this.disclosureResizeTimer = setTimeout(() => this.updateDisclosureStates(), 150);
    });
  }

  handleGlobalClick(event) {
    const randomBtn = event.target.closest('.random-btn');
    if (randomBtn) {
      this.generateRandomPrompt(randomBtn.dataset.category);
      return;
    }

    const wordItem = event.target.classList.contains('word-item') ? event.target : null;
    if (wordItem) {
      this.addWordToPrompt(wordItem.textContent);
      return;
    }

    const categoryTab = event.target.closest('.category-tab');
    if (categoryTab) {
      this.switchWordCategory(categoryTab.dataset.category);
      return;
    }

    const tab = event.target.closest('.tab');
    if (tab) {
      this.switchTab(tab.dataset.tab);
      return;
    }

    const descriptionOption = event.target.closest('.description-option');
    if (descriptionOption && this.cachedElements.descriptionGrid?.contains(descriptionOption)) {
      this.handleDescriptionClick(event);
    }

    if (event.target.matches('[data-modal-close]')) {
      if (this.activeModal) {
        this.closeModal(this.activeModal);
      }
    }
  }

  setupDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const menuToggle = document.getElementById('menu-toggle');
    const scrim = document.getElementById('scrim');
    const drawerClose = document.getElementById('drawer-close');
    if (!drawer || !menuToggle || !scrim) return;

    drawer.setAttribute('aria-hidden', 'true');
    scrim.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', (event) => {
      event.preventDefault();
      if (drawer.getAttribute('aria-hidden') === 'false') {
        this.closeDrawer();
      } else {
        this.openDrawer();
      }
    });

    drawerClose?.addEventListener('click', (event) => {
      event.preventDefault();
      this.closeDrawer();
    });

    scrim.addEventListener('click', () => this.closeDrawer());

    drawer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.closeDrawer();
      }
    });
  }

  openDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const scrim = document.getElementById('scrim');
    const menuToggle = document.getElementById('menu-toggle');
    if (!drawer || !scrim || !menuToggle) return;

    this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    drawer.setAttribute('aria-hidden', 'false');
    scrim.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    this.activeDrawer = drawer;

    const focusTarget = drawer.querySelector(FOCUSABLE_SELECTOR);
    focusTarget?.focus();
  }

  closeDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const scrim = document.getElementById('scrim');
    const menuToggle = document.getElementById('menu-toggle');
    if (!drawer || !scrim || !menuToggle) return;

    drawer.setAttribute('aria-hidden', 'true');
    scrim.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    this.activeDrawer = null;

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }

  setupThemeChips() {
    this.cachedElements.themeChips?.forEach((chip) => {
      chip.addEventListener('click', () => {
        const theme = chip.dataset.theme;
        if (theme) {
          this.applyTheme(theme);
        }
      });
    });
  }

  setupDisclosures() {
    document.querySelectorAll('details[data-breakpoint]').forEach((detail) => {
      detail.dataset.userExpanded = detail.open ? 'true' : 'false';
      detail.addEventListener('toggle', () => {
        detail.dataset.userExpanded = detail.open ? 'true' : 'false';
      });
    });
  }

  updateDisclosureStates() {
    const width = window.innerWidth;
    document.querySelectorAll('details[data-breakpoint]').forEach((detail) => {
      const breakpoint = detail.dataset.breakpoint;
      const threshold = DISCLOSURE_BREAKPOINTS[breakpoint] || 0;
      if (width >= threshold) {
        if (!detail.open) {
          detail.open = true;
        }
        detail.dataset.userExpanded = 'true';
      } else {
        if (detail.dataset.userExpanded !== 'true') {
          detail.open = false;
        }
        if (!detail.open) {
          detail.dataset.userExpanded = 'false';
        }
      }
    });
  }

  setupHeaderShortcuts() {
    document.querySelectorAll('[data-header-collaborate], [data-drawer-collaborate]').forEach((button) => {
      button.addEventListener('click', () => {
        this.sharePrompt();
        this.closeDrawer();
      });
    });

    document.querySelectorAll('[data-header-mini], [data-drawer-mini]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.switchTab('image-generator');
        this.closeDrawer();
      });
    });

    document.querySelectorAll('[data-drawer-tab]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const tabName = event.currentTarget.dataset.drawerTab;
        if (tabName) {
          this.switchTab(tabName);
        }
        this.closeDrawer();
      });
    });
  }

  setupModalControls() {
    document.querySelectorAll('[data-modal-close]').forEach((button) => {
      button.addEventListener('click', () => {
        if (this.activeModal) {
          this.closeModal(this.activeModal);
        }
      });
    });

    document.querySelectorAll('.modal').forEach((modal) => {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          this.closeModal(modal);
        }
      });

      modal.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          const focusable = modal.querySelectorAll(FOCUSABLE_SELECTOR);
          if (focusable.length === 0) {
            return;
          }
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.activeModal) {
          event.preventDefault();
          this.closeModal(this.activeModal);
        } else if (this.activeDrawer) {
          event.preventDefault();
          this.closeDrawer();
        }
      }
    });
  }

  openModal(modal) {
    if (!modal) return;
    this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.classList.remove('hidden');
    this.activeModal = modal;
    const focusTarget = modal.querySelector(FOCUSABLE_SELECTOR);
    focusTarget?.focus();
  }

  closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    if (this.activeModal === modal) {
      this.activeModal = null;
    }
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }

  handlePlatformChange(value) {
    this.currentPlatform = value;
    const platformSelect = this.cachedElements.platformSelect;
    if (platformSelect && platformSelect.value !== value) {
      platformSelect.value = value;
    }
    this.updatePlatformBadge();
    this.updatePromptPreview();
    this.updatePlatformGuidelines();
    this.saveToStorage();
  }

  handlePromptLengthChange(length) {
    this.desiredPromptLength = length;
    const label = document.getElementById('prompt-length-display');
    if (label) {
      label.textContent = length <= 200 ? 'Short' : length <= 400 ? 'Medium' : 'Long';
    }
  }

  toggleThemeMode() {
    const nextTheme = this.currentTheme === 'light_modern' ? 'dark_professional' : 'light_modern';
    this.applyTheme(nextTheme);
  }

  applyTheme(themeName) {
    this.currentTheme = themeName;
    document.body.setAttribute('data-theme', themeName);
    if (themes[themeName]) {
      document.documentElement.style.setProperty('--theme-primary', themes[themeName].primary);
      document.documentElement.style.setProperty('--theme-background', themes[themeName].background);
    }

    if (this.cachedElements.themeSelect) {
      this.cachedElements.themeSelect.value = themeName;
    }

    this.cachedElements.themeChips?.forEach((chip) => {
      const isActive = chip.dataset.theme === themeName;
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    this.updateThemeToggleUI();
    this.saveToStorage();
  }

  updateThemeToggleUI() {
    const { themeModeToggle } = this.cachedElements;
    if (!themeModeToggle) return;
    const isLight = this.currentTheme === 'light_modern';
    themeModeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    const icon = themeModeToggle.querySelector('i');
    if (icon) {
      icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  updatePlatformBadge() {
    const badge = this.cachedElements.platformBadge;
    if (badge && platformData[this.currentPlatform]) {
      badge.textContent = platformData[this.currentPlatform].name;
    }
  }

  updatePlatformGuidelines() {
    const list = this.cachedElements.platformGuidelinesList;
    if (!list) return;
    list.innerHTML = '';
    Object.entries(platformData).forEach(([key, data]) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = data.name;
      const meta = document.createElement('span');
      const maxText = data.maxChars ? `${data.maxChars} chars` : 'no limit';
      meta.textContent = `${data.optimalLength} • ${maxText}`;
      item.append(name, meta);
      if (key === this.currentPlatform) {
        item.classList.add('is-active');
      }
      list.appendChild(item);
    });
  }

  updatePromptPreview() {
    const preview = this.cachedElements.previewContent;
    if (!preview) return;
    const base = this.currentPrompt.trim();
    if (!base) {
      preview.textContent = 'Start building your prompt...';
      this.updatePlatformAlert([]);
      this.updatePlatformCompatibility(true);
      return;
    }

    const { text: optimizedText, warnings } = this.getOptimizedPrompt(base);
    preview.textContent = optimizedText;
    this.updatePlatformAlert(warnings, optimizedText);
    this.updatePlatformCompatibility(warnings.length === 0);
  }

  getOptimizedPrompt(prompt) {
    let working = prompt.trim();
    const warnings = [];

    // Apply selected platform formatting
    if (this.currentPlatform === 'midjourney') {
      if (!/--ar\s*\d+:\d+/i.test(working)) {
        working = ensureDirective(working, `--ar ${this.currentAspectRatio}`);
      }
      working = ensureDirective(working, '--stylize 100');
    } else if (this.currentPlatform === 'stable_diffusion') {
      if (!working.toLowerCase().includes('aspect ratio')) {
        working = `${working}, aspect ratio ${this.currentAspectRatio}`;
      }
    }

    // Apply active toggles
    this.platformToggles.forEach((toggle) => {
      const config = platformOptimizations[toggle];
      if (config && typeof config.apply === 'function') {
        const result = config.apply(working, { aspect: this.currentAspectRatio });
        working = result.text;
        if (Array.isArray(result.warnings)) {
          warnings.push(...result.warnings);
        }
      }
    });

    const platformInfo = platformData[this.currentPlatform];
    if (platformInfo?.maxChars && working.length > platformInfo.maxChars) {
      warnings.push(`${platformInfo.name} prefers prompts under ${platformInfo.maxChars} characters.`);
    }

    return { text: working, warnings };
  }

  updatePlatformAlert(warnings = [], previewText = this.currentPrompt) {
    const alert = this.cachedElements.platformAlert;
    if (!alert) return;
    const extraWarnings = [];
    this.platformToggles.forEach((toggle) => {
      const config = platformOptimizations[toggle];
      if (config?.maxChars && previewText.length > config.maxChars) {
        extraWarnings.push(`${config.label} limit is ${config.maxChars} characters.`);
      }
    });
    const messages = [...warnings, ...extraWarnings];
    alert.textContent = messages.join(' ');
    if (messages.length) {
      const hasError = messages.some((msg) => msg.toLowerCase().includes('limit'));
      alert.classList.toggle('is-error', hasError);
    } else {
      alert.classList.remove('is-error');
    }
  }

  updatePlatformCompatibility(isCompatible) {
    const pill = this.cachedElements.platformCompatibility;
    if (!pill) return;
    pill.classList.toggle('status-pill--accent', isCompatible);
    pill.classList.toggle('status-pill--warning', !isCompatible);
    pill.innerHTML = isCompatible
      ? '<i class="fas fa-check-circle" aria-hidden="true"></i> Platform Optimized'
      : '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Needs adjustments';
  }

  updateWordCount() {
    const words = this.currentPrompt.trim().split(/\s+/).filter((word) => word.length > 0);
    const wordCount = this.currentPrompt.trim() ? words.length : 0;

    if (this.cachedElements.wordCountPill) {
      this.cachedElements.wordCountPill.textContent = `${wordCount} words`;
    }

    if (this.cachedElements.wordCountMetric) {
      this.cachedElements.wordCountMetric.textContent = wordCount;
    }

    if (this.cachedElements.charCounter && this.cachedElements.promptTextarea) {
      const length = this.cachedElements.promptTextarea.value.length;
      this.cachedElements.charCounter.textContent = `${length}/2000`;
    }

    this.updateActionStates();
  }

  updateActionStates() {
    const hasPrompt = Boolean(this.currentPrompt && this.currentPrompt.trim().length);
    const saveBtn = document.getElementById('save-prompt');
    const copyBtn = document.getElementById('copy-prompt');

    if (saveBtn) {
      saveBtn.toggleAttribute('disabled', !hasPrompt);
    }

    if (copyBtn) {
      copyBtn.toggleAttribute('disabled', !hasPrompt);
    }
  }

  updateQualityScore() {
    const score = this.calculateQualityScore(this.currentPrompt);
    const indicator = this.cachedElements.qualityIndicator;
    const metric = this.cachedElements.qualityScoreDisplay;

    const level = score >= 85 ? 'excellent' : score >= 65 ? 'good' : score >= 45 ? 'fair' : 'poor';
    const label = `Quality: ${level.toUpperCase()} (${score}%)`;

    if (indicator) {
      indicator.className = `quality-indicator ${level}`;
      indicator.textContent = label;
    }

    if (metric) {
      metric.textContent = `${score}%`;
      metric.className = `metric-value quality-score ${level}`;
    }
  }

  calculateQualityScore(prompt) {
    if (!prompt || !prompt.trim()) return 0;
    const text = prompt.toLowerCase();
    const words = prompt.split(/\s+/).filter((word) => word.length > 0);

    let score = 0;

    // Length (25 points)
    if (words.length >= 8 && words.length <= 120) {
      score += 25;
    } else {
      score += Math.max(10 - Math.abs(words.length - 64) * 0.3, 0);
    }

    // Subject presence (15 points)
    const hasSubject = this.builderState.subject || /portrait|scene|landscape|character/.test(text);
    if (hasSubject) score += 15;

    // Style presence (15 points)
    const hasStyle = Object.values(wordLibrary.styles).some((styleArray) =>
      styleArray.some((style) => text.includes(style.toLowerCase()))
    );
    if (hasStyle || this.builderState.artStyle) score += 15;

    // Lighting presence (15 points)
    const hasLighting = Object.values(wordLibrary.lighting).some((lightingArray) =>
      lightingArray.some((lighting) => text.includes(lighting.toLowerCase()))
    );
    if (hasLighting || this.builderState.lighting) score += 15;

    // Composition and mood (15 points)
    const hasComposition = Object.values(wordLibrary.composition).some((compositionArray) =>
      compositionArray.some((comp) => text.includes(comp.toLowerCase()))
    );
    const hasMood = Object.values(wordLibrary.moods).some((moodArray) =>
      moodArray.some((mood) => text.includes(mood.toLowerCase()))
    );
    if (hasComposition) score += 8;
    if (hasMood) score += 7;

    // Color or palette (10 points)
    const hasColor = Object.values(wordLibrary.colors).some((colorArray) =>
      colorArray.some((color) => text.includes(color.toLowerCase()))
    );
    if (hasColor || this.builderState.colorPalette !== 'monochrome') score += 10;

    // Camera or technical (10 points)
    if (/\b(f\/|iso|mm|aperture|render|octane|unreal)\b/.test(text) || this.builderState.camera) {
      score += 10;
    }

    return Math.min(100, Math.round(score));
  }

  handleBuilderInput(field, value) {
    this.builderState = { ...this.builderState, [field]: value.trim() };
    this.updateBuilderPreview();
  }

  handleColorPaletteClick(event) {
    const chip = event.target.closest('.color-chip');
    if (!chip) return;
    const palette = chip.dataset.color || 'monochrome';
    this.builderState = { ...this.builderState, colorPalette: palette };
    this.cachedElements.builderColorPalette?.querySelectorAll('.color-chip').forEach((btn) => {
      btn.classList.toggle('is-active', btn === chip);
      btn.setAttribute('aria-pressed', btn === chip ? 'true' : 'false');
    });
    this.updateBuilderPreview();
  }

  handleBuilderColorCustom(value) {
    this.builderState = { ...this.builderState, colorPalette: 'custom', customColor: value };
    this.cachedElements.builderColorPalette?.querySelectorAll('.color-chip').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.color === 'custom');
    });
    this.updateBuilderPreview();
  }

  generateBuilderPrompt() {
    const {
      subject,
      artStyle,
      lighting,
      colorPalette,
      customColor,
      composition,
      camera,
      mood
    } = this.builderState;

    if (!subject && !artStyle && !lighting && !mood) {
      return '';
    }

    const parts = [];
    if (artStyle) parts.push(artStyle);
    parts.push(subject || 'scene');
    if (mood) parts.push(mood);
    if (lighting) parts.push(lighting);
    if (composition) parts.push(composition);

    if (colorPalette) {
      const descriptor = colorPalette === 'custom'
        ? colorPaletteDescriptions.custom(customColor)
        : colorPaletteDescriptions[colorPalette];
      if (descriptor) parts.push(descriptor);
    }

    if (camera) parts.push(camera);

    const prompt = `${parts.filter(Boolean).join(', ')}, ultra detailed, 4k, sharp focus`;
    return prompt.replace(/\s+,/g, ',');
  }

  updateBuilderPreview() {
    const preview = this.cachedElements.builderPreview;
    const counter = this.cachedElements.builderCounter;
    const warning = this.cachedElements.builderWarning;
    const prompt = this.generateBuilderPrompt();
    this.builderPrompt = prompt;

    if (preview) {
      preview.textContent = prompt ? prompt : 'Start entering details to build a prompt.';
    }

    if (counter) {
      counter.textContent = `${prompt.length} characters`;
    }

    if (warning) {
      const platformLimits = Array.from(this.platformToggles).map((toggle) => {
        const config = platformOptimizations[toggle];
        if (config?.maxChars && prompt.length > config.maxChars) {
          return `${config.label} limit ${config.maxChars}`;
        }
        return null;
      }).filter(Boolean);
      if (platformLimits.length) {
        warning.textContent = `Trim prompt for ${platformLimits.join(', ')}.`;
        warning.classList.add('is-error');
      } else {
        warning.textContent = '';
        warning.classList.remove('is-error');
      }
    }
  }

  async applyBuilderToPrompt() {
    const prompt = this.generateBuilderPrompt();
    if (!prompt) {
      this.showNotification('Add at least a subject or style to use the builder.');
      return;
    }
    await this.setPrompt(prompt, { expand: true, addToHistory: true });
    this.switchTab('prompt-builder');
    this.showNotification('Builder prompt applied.');
  }

  clearBuilder() {
    this.builderState = {
      subject: '',
      artStyle: '',
      lighting: '',
      colorPalette: 'monochrome',
      customColor: '#1db954',
      composition: '',
      camera: '',
      mood: ''
    };
    ['builder-subject', 'builder-art-style', 'builder-lighting', 'builder-composition', 'builder-camera', 'builder-mood'].forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        if (input.tagName === 'SELECT') {
          input.selectedIndex = 0;
        } else {
          input.value = '';
        }
      }
    });
    if (this.cachedElements.builderColorPalette) {
      this.cachedElements.builderColorPalette.querySelectorAll('.color-chip').forEach((chip) => {
        const isDefault = chip.dataset.color === 'monochrome';
        chip.classList.toggle('is-active', isDefault);
        chip.setAttribute('aria-pressed', isDefault ? 'true' : 'false');
      });
    }
    if (this.cachedElements.builderColorCustom) {
      this.cachedElements.builderColorCustom.value = '#1db954';
    }
    this.updateBuilderPreview();
  }

  async setPrompt(prompt, options = {}) {
    const { expand = false, addToHistory = false } = options;
    let value = prompt || '';
    if (expand && value) {
      value = await this.expandPrompt(value, this.desiredPromptLength);
    }
    this.currentPrompt = value;
    if (this.cachedElements.promptTextarea) {
      this.cachedElements.promptTextarea.value = value;
    }
    this.updatePromptPreview();
    this.updateWordCount();
    this.updateQualityScore();
    this.getAISuggestions();
    this.updateActionStates();
    if (value && addToHistory) {
      this.addToHistory(value);
    }
    return value;
  }

  addWordToPrompt(word) {
    const textarea = this.cachedElements.promptTextarea;
    if (!textarea) return;
    const currentText = textarea.value;
    const newText = currentText ? `${currentText}, ${word}` : word;
    this.setPrompt(newText, { addToHistory: false });
  }

  generateRandomPrompt(category) {
    let prompt = '';
    switch (category) {
      case 'portrait':
        prompt = this.generatePortraitPrompt();
        break;
      case 'landscape':
        prompt = this.generateLandscapePrompt();
        break;
      case 'digital_art':
        prompt = this.generateDigitalArtPrompt();
        break;
      case 'photography':
        prompt = this.generatePhotographyPrompt();
        break;
      case 'fantasy':
        prompt = this.generateFantasyPrompt();
        break;
      case 'surprise':
      default:
        prompt = this.generateSurprisePrompt();
    }
    this.setPrompt(prompt, { expand: true, addToHistory: true });
  }

  generatePortraitPrompt() {
    const subject = this.getRandomWord('subjects', 'people');
    const style = this.getRandomWord('styles', 'artistic_styles');
    const lighting = this.getRandomWord('lighting', 'natural');
    const mood = this.getRandomWord('moods', 'positive');
    const composition = this.getRandomWord('composition', 'camera_angles');
    return `${style} ${composition} portrait of ${subject}, ${mood} expression, ${lighting}, professional photography, highly detailed`;
  }

  generateLandscapePrompt() {
    const location = this.getRandomWord('subjects', 'objects');
    const lighting = this.getRandomWord('lighting', 'natural');
    const style = this.getRandomWord('styles', 'art_movements');
    const mood = this.getRandomWord('moods', 'positive');
    return `${style} landscape painting of ${location}, ${lighting}, ${mood} atmosphere, masterpiece quality`;
  }

  generateDigitalArtPrompt() {
    const subject = this.getRandomWord('subjects', 'animals');
    const style = this.getRandomWord('styles', 'visual_styles');
    const lighting = this.getRandomWord('lighting', 'artificial');
    const color = this.getRandomWord('colors', 'warm');
    return `${style} digital art of ${subject}, ${lighting}, ${color} color palette, concept art, trending on artstation`;
  }

  generatePhotographyPrompt() {
    const subject = this.getRandomWord('subjects', 'people');
    const composition = this.getRandomWord('composition', 'framing');
    const lighting = this.getRandomWord('lighting', 'natural');
    return `Professional photography of ${subject}, ${composition}, ${lighting}, shot with full-frame camera, high resolution`;
  }

  generateFantasyPrompt() {
    const character = this.getRandomWord('subjects', 'people');
    const creature = this.getRandomWord('subjects', 'animals');
    const style = this.getRandomWord('styles', 'art_movements');
    const lighting = this.getRandomWord('lighting', 'qualities');
    return `Epic fantasy scene featuring ${character} and mythical ${creature}, ${style} art style, ${lighting} lighting, magical atmosphere`;
  }

  generateSurprisePrompt() {
    const categories = Object.keys(wordLibrary);
    const randomElements = [];
    for (let i = 0; i < 4; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const subcategories = Object.keys(wordLibrary[category]);
      const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
      randomElements.push(this.getRandomWord(category, subcategory));
    }
    return `${randomElements.join(', ')}, creative composition, unique perspective, highly detailed`;
  }

  getRandomWord(category, subcategory) {
    const words = wordLibrary[category][subcategory];
    return words[Math.floor(Math.random() * words.length)];
  }

  initializeWordBank() {
    this.switchWordCategory('subjects');
  }

  switchWordCategory(category) {
    const wordBank = document.getElementById('word-bank');
    if (!wordBank || !wordLibrary[category]) return;

    document.querySelectorAll('.category-tab').forEach((tab) => {
      const isActive = tab.dataset.category === category;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    wordBank.innerHTML = '';
    Object.values(wordLibrary[category]).forEach((subcategoryWords) => {
      subcategoryWords.forEach((word) => {
        const wordElement = document.createElement('span');
        wordElement.className = 'word-item';
        wordElement.textContent = word;
        wordBank.appendChild(wordElement);
      });
    });
  }

  getAISuggestions() {
    const suggestions = [];
    const text = (this.currentPrompt || '').toLowerCase();
    if (!text.match(/light/)) suggestions.push('Add lighting description for better mood');
    if (!text.match(/style/)) suggestions.push('Specify art style to refine the look');
    if (!text.match(/color/)) suggestions.push('Mention color palette for richer output');
    if (!text.match(/mood/)) suggestions.push('Include mood keywords to set the tone');
    if (suggestions.length === 0) suggestions.push('Prompt looks strong! Consider platform tweaks for best results.');
    const container = document.getElementById('ai-suggestions');
    if (!container) return;
    container.innerHTML = '';
    suggestions.forEach((s) => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.innerHTML = `<i class="fas fa-lightbulb"></i><span>${s}</span>`;
      container.appendChild(div);
    });
  }

  debounceOptimize() {
    clearTimeout(this.optimizeTimer);
    this.optimizeTimer = setTimeout(() => {
      if (this.magicEnhanceEnabled) {
        this.optimizePrompt();
      }
    }, 600);
  }

  async optimizePrompt() {
    const textarea = this.cachedElements.promptTextarea;
    if (!textarea) return;
    const base = textarea.value.trim();
    if (!base) return;
    const optimized = await this.expandPrompt(base, this.desiredPromptLength);
    textarea.value = optimized;
    this.currentPrompt = optimized;
    this.updatePromptPreview();
    this.updateWordCount();
    this.updateQualityScore();
    this.getAISuggestions();
  }

  async expandPrompt(base, minLength) {
    let result = base || '';
    if (this.textGenerator) {
      const needed = Math.max(0, Math.ceil((minLength - result.length) / 4));
      if (needed > 0) {
        try {
          const gen = await this.textGenerator(result, { max_new_tokens: needed });
          result = gen[0].generated_text;
        } catch (error) {
          console.warn('Text generation error', error);
        }
      }
    }
    while (result.length < minLength) {
      result += `, ${this.getRandomWord('styles', 'visual_styles')} ${this.getRandomWord('lighting', 'qualities')} lighting`;
    }
    return result;
  }

  copyToClipboard() {
    if (!this.currentPrompt || !this.currentPrompt.trim()) {
      alert('No prompt to copy!');
      return;
    }
    const feedback = document.getElementById('copy-feedback');
    const showCopied = () => {
      if (feedback) {
        feedback.textContent = 'Copied!';
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 2000);
      }
    };
    this.copyTextToClipboard(this.currentPrompt).then(showCopied).catch(() => {
      alert('Unable to copy prompt automatically. Please copy manually.');
    });
  }

  copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  clearPrompt() {
    this.setPrompt('', { addToHistory: false });
  }

  savePrompt() {
    if (!this.currentPrompt || !this.currentPrompt.trim()) {
      alert('No prompt to save!');
      return;
    }
    const modal = document.getElementById('save-modal');
    if (!modal) return;

    const nameInput = document.getElementById('prompt-name');
    const descriptionInput = document.getElementById('prompt-description');
    const tagsInput = document.getElementById('prompt-tags');

    const defaultName = this.currentPrompt.split(/\s+/).slice(0, 6).join(' ');
    if (nameInput) {
      nameInput.value = defaultName ? defaultName : `Prompt ${this.savedPrompts.length + 1}`;
    }
    if (descriptionInput) {
      descriptionInput.value = '';
    }
    if (tagsInput) {
      tagsInput.value = '';
    }

    this.openModal(modal);
    if (nameInput) {
      requestAnimationFrame(() => nameInput.focus());
    }
  }

  confirmSavePrompt() {
    if (!this.currentPrompt || !this.currentPrompt.trim()) {
      alert('No prompt to save!');
      return;
    }

    const nameInput = document.getElementById('prompt-name');
    const descriptionInput = document.getElementById('prompt-description');
    const tagsInput = document.getElementById('prompt-tags');
    const modal = document.getElementById('save-modal');

    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : `Prompt ${this.savedPrompts.length + 1}`;
    const description = descriptionInput ? descriptionInput.value.trim() : '';
    const tags = tagsInput && tagsInput.value
      ? tagsInput.value.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

    const savedPrompt = {
      name,
      description,
      tags,
      prompt: this.currentPrompt,
      platform: this.currentPlatform,
      timestamp: Date.now()
    };

    this.savedPrompts.unshift(savedPrompt);
    if (this.savedPrompts.length > 50) {
      this.savedPrompts = this.savedPrompts.slice(0, 50);
    }

    this.saveToStorage();
    this.updateSavedPromptsDisplay();
    this.showNotification('Prompt saved successfully!');

    if (modal) {
      this.closeModal(modal);
    }
  }

  addToHistory(prompt) {
    const historyItem = {
      prompt,
      timestamp: Date.now(),
      platform: this.currentPlatform
    };
    this.promptHistory.unshift(historyItem);
    if (this.promptHistory.length > 20) {
      this.promptHistory = this.promptHistory.slice(0, 20);
    }
    this.saveToStorage();
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    const historyContainer = this.cachedElements.promptHistory;
    if (!historyContainer) return;

    historyContainer.innerHTML = '';

    if (!this.promptHistory.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'Generated prompts will appear here.';
      historyContainer.appendChild(empty);
      return;
    }

    this.promptHistory.slice(0, 5).forEach((item) => {
      const card = document.createElement('article');
      card.className = 'prompt-card';

      const meta = document.createElement('div');
      meta.className = 'prompt-card__meta';
      const time = document.createElement('span');
      time.textContent = this.formatTimestamp(item.timestamp);
      const platformLabel = document.createElement('span');
      platformLabel.textContent = platformData[item.platform]?.name || 'Manual';
      meta.append(time, platformLabel);

      const text = document.createElement('p');
      text.className = 'prompt-card__text';
      const snippet = item.prompt.length > 140 ? `${item.prompt.slice(0, 140)}…` : item.prompt;
      text.textContent = snippet;

      const actions = document.createElement('div');
      actions.className = 'prompt-card__actions';

      const useBtn = document.createElement('button');
      useBtn.type = 'button';
      useBtn.className = 'btn btn--sm btn--secondary';
      useBtn.textContent = 'Use';
      useBtn.addEventListener('click', () => {
        this.setPrompt(item.prompt, { expand: false, addToHistory: true }).then(() => this.switchTab('prompt-builder'));
      });

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn btn--sm btn--outline';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', () => {
        this.copyTextToClipboard(item.prompt)
          .then(() => this.showNotification('Prompt copied to clipboard!'))
          .catch(() => alert('Unable to copy prompt automatically.'));
      });

      actions.append(useBtn, copyBtn);
      card.append(meta, text, actions);
      historyContainer.appendChild(card);
    });
  }

  savePromptToLibrary(prompt, meta = {}) {
    const savedPrompt = {
      name: meta.name || `Prompt ${this.savedPrompts.length + 1}`,
      description: meta.description || '',
      tags: meta.tags || [],
      prompt,
      platform: meta.platform || this.currentPlatform,
      timestamp: Date.now()
    };
    this.savedPrompts.unshift(savedPrompt);
    if (this.savedPrompts.length > 50) {
      this.savedPrompts = this.savedPrompts.slice(0, 50);
    }
    this.saveToStorage();
    this.updateSavedPromptsDisplay();
  }

  updateSavedPromptsDisplay() {
    const savedContainer = this.cachedElements.savedPrompts;
    if (!savedContainer) return;

    savedContainer.innerHTML = '';

    if (!this.savedPrompts.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'Save prompts to build your personal library.';
      savedContainer.appendChild(empty);
      return;
    }

    this.savedPrompts.slice(0, 5).forEach((item) => {
      const card = document.createElement('article');
      card.className = 'saved-prompt';

      const meta = document.createElement('div');
      meta.className = 'saved-prompt__meta';
      const name = document.createElement('span');
      name.textContent = item.name || 'Untitled Prompt';
      const timestamp = document.createElement('span');
      timestamp.textContent = this.formatTimestamp(item.timestamp);
      meta.append(name, timestamp);

      const text = document.createElement('p');
      text.className = 'saved-prompt__text';
      const snippet = item.prompt.length > 160 ? `${item.prompt.slice(0, 160)}…` : item.prompt;
      text.textContent = snippet;

      const actions = document.createElement('div');
      actions.className = 'prompt-card__actions';

      const useBtn = document.createElement('button');
      useBtn.type = 'button';
      useBtn.className = 'btn btn--sm btn--secondary';
      useBtn.textContent = 'Use';
      useBtn.addEventListener('click', () => {
        this.setPrompt(item.prompt, { expand: false, addToHistory: true }).then(() => this.switchTab('prompt-builder'));
      });

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn btn--sm btn--outline';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', () => {
        this.copyTextToClipboard(item.prompt)
          .then(() => this.showNotification('Prompt copied to clipboard!'))
          .catch(() => alert('Unable to copy prompt automatically.'));
      });

      actions.append(useBtn, copyBtn);
      card.append(meta);

      if (item.description) {
        const description = document.createElement('p');
        description.className = 'saved-prompt__text';
        description.textContent = item.description;
        card.append(description);
      }

      card.append(text);

      if (Array.isArray(item.tags) && item.tags.length) {
        const tagList = document.createElement('div');
        tagList.className = 'analysis-tags';
        item.tags.forEach((tag) => {
          const span = document.createElement('span');
          span.className = 'tag';
          span.textContent = tag;
          tagList.appendChild(span);
        });
        card.append(tagList);
      }

      card.append(actions);
      savedContainer.appendChild(card);
    });
  }

  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--theme-primary, #3b82f6);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        notification.parentNode?.removeChild(notification);
      }, 300);
    }, 3000);
  }

  sharePrompt() {
    if (!this.currentPrompt) {
      alert('No prompt to share!');
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}?prompt=${encodeURIComponent(this.currentPrompt)}`;
    if (navigator.share) {
      navigator.share({ text: this.currentPrompt, url }).catch(() => {
        this.copyTextToClipboard(url).then(() => this.showNotification('Share link copied to clipboard!'));
      });
    } else {
      this.copyTextToClipboard(url).then(() => this.showNotification('Share link copied to clipboard!'));
    }
  }

  exportToTxt() {
    if (!this.currentPrompt) {
      alert('No prompt to export!');
      return;
    }
    const blob = new Blob([this.currentPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generateBatch() {
    const base = (this.cachedElements.batchBasePrompt?.value || '').trim();
    const count = parseInt(this.cachedElements.batchCount?.value || '5', 10);
    const type = this.cachedElements.variationType?.value || 'style';
    const resultsContainer = this.cachedElements.batchResults;
    if (!resultsContainer) return;

    const sourcePrompt = base || this.currentPrompt;
    if (!sourcePrompt) {
      this.showNotification('Enter a base prompt or build one first.');
      return;
    }

    const variations = [];
    for (let i = 0; i < count; i++) {
      let variation = sourcePrompt;
      switch (type) {
        case 'style':
          variation += `, ${this.getRandomWord('styles', 'artistic_styles')}`;
          break;
        case 'lighting':
          variation += `, ${this.getRandomWord('lighting', 'qualities')} lighting`;
          break;
        case 'composition':
          variation += `, ${this.getRandomWord('composition', 'framing')}`;
          break;
        case 'color':
          variation += `, ${this.getRandomWord('colors', 'warm')} palette`;
          break;
        default:
          variation += `, ${this.getRandomWord('styles', 'visual_styles')}, ${this.getRandomWord('lighting', 'artificial')}`;
      }
      variations.push({
        text: variation,
        quality: this.calculateQualityScore(variation),
        wordCount: variation.split(/\s+/).filter(Boolean).length
      });
    }

    this.renderBatchResults(variations);
    this.showNotification(`${variations.length} batch prompts generated.`);
  }

  renderBatchResults(variations) {
    const container = this.cachedElements.batchResults;
    if (!container) return;
    container.innerHTML = '';
    this.selectedBatchPrompts.clear();
    this.updateMixButtonState();

    variations.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'batch-item';
      card.dataset.prompt = item.text;

      const favorite = document.createElement('button');
      favorite.type = 'button';
      favorite.className = 'icon-button batch-favorite';
      favorite.setAttribute('aria-label', 'Save prompt to favorites');
      favorite.dataset.batchAction = 'favorite';
      favorite.innerHTML = '<i class="fas fa-star"></i>';
      card.appendChild(favorite);

      const text = document.createElement('p');
      text.className = 'batch-item__text';
      text.textContent = item.text;

      const meta = document.createElement('div');
      meta.className = 'batch-item__meta';
      meta.innerHTML = `<span>${item.wordCount} words</span><span>${item.quality}% quality</span>`;

      const actions = document.createElement('div');
      actions.className = 'batch-item__actions';

      const useBtn = document.createElement('button');
      useBtn.className = 'btn btn--sm btn--secondary';
      useBtn.type = 'button';
      useBtn.dataset.batchAction = 'use';
      useBtn.textContent = 'Use';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn--sm btn--outline';
      copyBtn.type = 'button';
      copyBtn.dataset.batchAction = 'copy';
      copyBtn.textContent = 'Copy';

      const selectBtn = document.createElement('button');
      selectBtn.className = 'btn btn--sm btn--outline';
      selectBtn.type = 'button';
      selectBtn.dataset.batchAction = 'select';
      selectBtn.textContent = 'Select';

      const abABtn = document.createElement('button');
      abABtn.className = 'btn btn--sm btn--outline';
      abABtn.type = 'button';
      abABtn.dataset.batchAction = 'ab';
      abABtn.dataset.abSlot = 'A';
      abABtn.textContent = 'Set A';

      const abBBtn = document.createElement('button');
      abBBtn.className = 'btn btn--sm btn--outline';
      abBBtn.type = 'button';
      abBBtn.dataset.batchAction = 'ab';
      abBBtn.dataset.abSlot = 'B';
      abBBtn.textContent = 'Set B';

      actions.append(useBtn, copyBtn, selectBtn, abABtn, abBBtn);

      card.append(text, meta, actions);
      container.appendChild(card);
    });
  }

  handleBatchClick(event) {
    const button = event.target.closest('[data-batch-action]');
    if (!button) return;
    const item = event.target.closest('.batch-item');
    if (!item) return;
    const prompt = item.dataset.prompt || item.querySelector('.batch-item__text')?.textContent || '';
    if (!prompt) return;

    const action = button.dataset.batchAction;
    switch (action) {
      case 'use':
        this.setPrompt(prompt, { expand: false, addToHistory: true }).then(() => this.switchTab('prompt-builder'));
        break;
      case 'copy':
        this.copyTextToClipboard(prompt)
          .then(() => this.showNotification('Prompt copied to clipboard!'))
          .catch(() => alert('Unable to copy prompt automatically.'));
        break;
      case 'select':
        this.toggleBatchSelection(item, prompt, button);
        break;
      case 'ab':
        this.updateABSlot(button.dataset.abSlot, prompt);
        break;
      case 'favorite':
        this.savePromptToLibrary(prompt, { name: 'Batch Favorite' });
        button.classList.add('is-active');
        this.showNotification('Saved to favorites');
        break;
      default:
        break;
    }
  }

  toggleBatchSelection(item, prompt, button) {
    if (this.selectedBatchPrompts.has(prompt)) {
      this.selectedBatchPrompts.delete(prompt);
      item.classList.remove('is-selected');
      if (button) button.textContent = 'Select';
    } else {
      this.selectedBatchPrompts.add(prompt);
      item.classList.add('is-selected');
      if (button) button.textContent = 'Selected';
    }
    this.updateMixButtonState();
  }

  updateMixButtonState() {
    const mixButton = document.getElementById('mix-selected-prompts');
    if (!mixButton) return;
    mixButton.toggleAttribute('disabled', this.selectedBatchPrompts.size < 2);
  }

  updateABSlot(slot, prompt) {
    if (!slot || !prompt) return;
    this.abTesting[slot] = prompt;
    const textarea = slot === 'A' ? this.cachedElements.abSlotA : this.cachedElements.abSlotB;
    const metrics = slot === 'A' ? this.cachedElements.abSlotAMetrics : this.cachedElements.abSlotBMetrics;
    if (textarea) {
      textarea.value = prompt;
    }
    if (metrics) {
      const wordCount = prompt.split(/\s+/).filter(Boolean).length;
      metrics.textContent = `${wordCount} words • ${prompt.length} chars`;
    }
    this.updateABSummary();
  }

  updateABSummary() {
    const summary = this.cachedElements.abSummary;
    if (!summary) return;
    const { A, B } = this.abTesting;
    if (!A && !B) {
      summary.textContent = 'Select prompts for slots A and B to compare performance metrics.';
      return;
    }
    const buildMetrics = (prompt) => {
      if (!prompt) return '—';
      const wordCount = prompt.split(/\s+/).filter(Boolean).length;
      const quality = this.calculateQualityScore(prompt);
      return `${wordCount} words • ${prompt.length} chars • ${quality}% quality`;
    };
    summary.textContent = `A: ${buildMetrics(A)} | B: ${buildMetrics(B)}`;
  }

  mixSelectedPrompts() {
    if (this.selectedBatchPrompts.size < 2) {
      this.showNotification('Select at least two prompts to mix.');
      return;
    }
    const segments = new Set();
    Array.from(this.selectedBatchPrompts).forEach((prompt) => {
      prompt.split(/[.,;]|\band\b/).forEach((segment) => {
        const clean = segment.trim();
        if (clean.length > 2) {
          segments.add(clean);
        }
      });
    });
    const mixed = Array.from(segments).join(', ');
    this.setPrompt(mixed, { expand: true, addToHistory: true });
    this.showNotification('Mixed prompt applied.');
  }

  exportBatchPrompts(format) {
    const items = Array.from(this.cachedElements.batchResults?.querySelectorAll('.batch-item') || []);
    if (!items.length) {
      this.showNotification('No batch prompts to export.');
      return;
    }
    const data = items.map((item) => {
      const text = item.dataset.prompt || item.querySelector('.batch-item__text')?.textContent || '';
      return {
        prompt: text,
        words: text.split(/\s+/).filter(Boolean).length,
        quality: this.calculateQualityScore(text)
      };
    });

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      this.downloadBlob(blob, 'batch-prompts.json');
    } else if (format === 'csv') {
      const header = 'prompt,words,quality\n';
      const rows = data.map((item) => {
        const escaped = item.prompt.replace(/"/g, '""');
        return `"${escaped}",${item.words},${item.quality}`;
      }).join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv' });
      this.downloadBlob(blob, 'batch-prompts.csv');
    }
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  setupUploadZone() {
    const { uploadZone } = this.cachedElements;
    if (!uploadZone) return;

    uploadZone.addEventListener('dragenter', (event) => {
      event.preventDefault();
      this.dragCounter += 1;
      uploadZone.classList.add('is-dragover');
    });

    uploadZone.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    uploadZone.addEventListener('dragleave', (event) => {
      event.preventDefault();
      this.dragCounter = Math.max(this.dragCounter - 1, 0);
      if (this.dragCounter === 0) {
        uploadZone.classList.remove('is-dragover');
      }
    });

    uploadZone.addEventListener('drop', (event) => {
      event.preventDefault();
      uploadZone.classList.remove('is-dragover');
      this.dragCounter = 0;
      const files = event.dataTransfer?.files;
      if (files && files[0]) {
        this.processImageFile(files[0]);
      }
    });
  }

  processImageFile(file) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.showUploadFeedback('Unsupported format. Use JPG, PNG, or WebP.', true);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      this.showUploadFeedback('File is too large. Max size is 10MB.', true);
      return;
    }

    this.showUploadFeedback('Loading image...', false);
    this.showAnalysisLoading(true);
    this.updateUploadProgress(0);

    const reader = new FileReader();
    reader.onloadstart = () => {
      this.updateUploadProgress(0);
    };
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        this.updateUploadProgress(percent);
      }
    };
    reader.onerror = () => {
      this.showUploadFeedback('Failed to read the file.', true);
      this.showAnalysisLoading(false);
    };
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) {
        this.showUploadFeedback('Could not load image data.', true);
        this.showAnalysisLoading(false);
        return;
      }
      const img = this.cachedElements.uploadedImg;
      if (img) {
        img.onload = () => {
          this.cachedElements.previewContainer?.removeAttribute('hidden');
          this.cachedElements.analysisCard?.setAttribute('hidden', '');
          this.analyzeImage(img);
        };
        img.src = dataUrl;
      }

      const base64Image = typeof dataUrl === 'string' ? dataUrl.split(',')[1] : '';
      this.fetchHFPrompt(base64Image).catch(() => {
        console.warn('Remote image analysis failed.');
      });
    };
    reader.readAsDataURL(file);
  }

  updateUploadProgress(percent) {
    if (!this.cachedElements.uploadProgress) return;
    this.cachedElements.uploadProgress.hidden = false;
    if (this.cachedElements.uploadProgressValue) {
      this.cachedElements.uploadProgressValue.style.width = `${percent}%`;
    }
    if (this.cachedElements.uploadProgressPercent) {
      this.cachedElements.uploadProgressPercent.textContent = `${percent}%`;
    }
    if (percent >= 100) {
      setTimeout(() => {
        if (this.cachedElements.uploadProgress) {
          this.cachedElements.uploadProgress.hidden = true;
        }
      }, 400);
    }
  }

  showUploadFeedback(message, isError = false) {
    const feedback = this.cachedElements.uploadFeedback;
    if (!feedback) return;
    feedback.textContent = message;
    feedback.style.color = isError ? 'var(--theme-error)' : 'var(--theme-text-muted)';
  }

  showAnalysisLoading(isLoading) {
    if (!this.cachedElements.analysisLoading) return;
    this.cachedElements.analysisLoading.hidden = !isLoading;
    if (!isLoading) {
      this.showUploadFeedback('', false);
    }
  }

  async analyzeImage(img) {
    const tags = [];
    const tagContainer = this.cachedElements.analysisTags;
    if (tagContainer) {
      tagContainer.innerHTML = '';
    }

    if (this.imageCaptioner) {
      try {
        const result = await this.imageCaptioner(img);
        const caption = result[0].generated_text || '';
        caption.split(/[\s,]+/).forEach((t) => {
          if (t) tags.push(t);
        });
      } catch (error) {
        console.error('Captioning error', error);
      }
    }

    this.addColorTags(img, tags);
  }

  addColorTags(img, tags) {
    let colorHex = '';
    try {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      if (color) {
        colorHex = `#${color.map((x) => x.toString(16).padStart(2, '0')).join('')}`;
        tags.push(`dominant color ${colorHex}`);
      }
    } catch (error) {
      console.warn('Color extraction failed', error);
    }

    const tagContainer = this.cachedElements.analysisTags;
    if (tagContainer) {
      tagContainer.innerHTML = '';
      tags.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        tagContainer.appendChild(span);
      });
    }

    this.lastImageTags = tags.filter((t) => !t.startsWith('dominant color'));
    this.lastColorHex = colorHex;
    this.updateGeneratedPrompt();
    this.cachedElements.analysisCard?.removeAttribute('hidden');
    this.showAnalysisLoading(false);
  }

  async fetchHFPrompt(imageBase64) {
    if (!imageBase64) return '';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch('https://hf.space/embed/ovi054/image-to-prompt/+/api/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ data: [imageBase64] }),
        mode: 'cors',
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Network response was not ok');
      const result = await res.json();
      return result.data ? result.data[0] : '';
    } catch (error) {
      console.warn('HF API error', error);
      return '';
    }
  }

  async updateGeneratedPrompt() {
    const variationsContainer = this.cachedElements.generatedVariations;
    if (!variationsContainer) return;
    const useNatural = this.cachedElements.naturalLanguageToggle?.checked;
    const customQuestion = this.cachedElements.customQuestionInput?.value.trim() || '';
    const base = useNatural
      ? this.generateNaturalLanguageDescription(this.lastImageTags, this.lastColorHex, this.currentDescriptionMode, customQuestion)
      : this.generateDetailedPrompt(this.lastImageTags, this.lastColorHex, this.currentDescriptionMode, customQuestion);
    const shouldExpand = !['text-extraction', 'custom-question'].includes(this.currentDescriptionMode);
    const detailed = shouldExpand ? await this.expandPrompt(base, this.desiredPromptLength) : base;
    const variations = this.createPromptVariations(detailed, base);
    this.renderGeneratedVariations(variations);
    this.cachedElements.generatedSummary.textContent = `${variations.length} variations ready based on detected tags.`;
  }

  generateDetailedPrompt(tags, colorHex, mode = 'describe-detail', customQuestion = '') {
    const subject = tags[0] || 'scene';
    const extras = tags.slice(1).join(', ');
    const style = this.getRandomWord('styles', 'visual_styles');
    const lighting = this.getRandomWord('lighting', 'qualities');
    const mood = this.getRandomWord('moods', 'positive');
    let prompt = `a ${style} ${subject}${extras ? ', ' + extras : ''}, ${lighting} lighting, ${mood} mood`;
    if (colorHex) prompt += `, ${colorHex} tones`;
    let suffix = ', highly detailed, 4k';

    switch (mode) {
      case 'describe-brief':
        prompt = `${subject}${extras ? ', ' + extras : ''}, ${style}, ${lighting}`;
        suffix = '';
        break;
      case 'person-description':
        prompt = `portrait of ${subject}${extras ? ', ' + extras : ''}, ${style} style, ${lighting} lighting, ${mood} atmosphere`;
        break;
      case 'object-recognition':
        prompt = `detailed product shot of ${subject}${extras ? ', ' + extras : ''}, ${lighting}, studio background`;
        suffix = ', ultra sharp, product photography';
        break;
      case 'art-style':
        prompt = `${style} illustration of ${subject}${extras ? ', ' + extras : ''}, ${mood} tone, ${lighting} lighting`;
        break;
      case 'text-extraction':
        return `Identify and transcribe any visible text from ${subject}${extras ? ', ' + extras : ''} with clear formatting.`;
      case 'midjourney':
        prompt += ` --ar ${this.currentAspectRatio} --stylize 100`;
        break;
      case 'stable-diffusion':
        prompt += `, aspect ratio ${this.currentAspectRatio}, DSLR sharp focus`;
        break;
      case 'custom-question':
        return customQuestion || `Describe the key elements of ${subject}.`;
      default:
        break;
    }

    return suffix ? `${prompt}${suffix}` : prompt;
  }

  generateNaturalLanguageDescription(tags, colorHex, mode = 'describe-detail', customQuestion = '') {
    const primary = tags[0] || 'a scene';
    const extras = tags.slice(1).join(', ');
    let sentence = `The image shows ${primary}`;
    if (extras) sentence += `, ${extras}`;
    if (colorHex) sentence += ` with dominant ${colorHex} tones`;
    sentence += '.';
    sentence += ` It features ${this.getRandomWord('lighting', 'qualities')} lighting and evokes a ${this.getRandomWord('moods', 'positive')} mood.`;

    switch (mode) {
      case 'describe-brief':
        return `A quick look at ${primary}${extras ? ' with ' + extras : ''}.`;
      case 'person-description':
        return `Portrait of ${primary}${extras ? ', ' + extras : ''}, highlighting facial features, clothing, and mood.`;
      case 'object-recognition':
        return `Focus on the main objects: ${primary}${extras ? ', ' + extras : ''}. Describe materials, shapes, and placement.`;
      case 'art-style':
        return `${sentence} Describe the artistic style, medium, and techniques apparent in the composition.`;
      case 'text-extraction':
        return `Extract and transcribe any legible text found in the image of ${primary}.`;
      case 'midjourney':
        return `${sentence} Provide a Midjourney-ready prompt emphasizing ${this.currentAspectRatio} composition.`;
      case 'stable-diffusion':
        return `${sentence} Craft a Stable Diffusion prompt mentioning aspect ratio ${this.currentAspectRatio}.`;
      case 'custom-question':
        return customQuestion || sentence;
      default:
        break;
    }

    return sentence;
  }

  handleDescriptionClick(event) {
    const option = event.target.closest('.description-option');
    if (!option || !this.cachedElements.descriptionGrid?.contains(option)) return;
    this.currentDescriptionMode = option.dataset.description || 'describe-detail';
    this.cachedElements.descriptionGrid.querySelectorAll('.description-option').forEach((btn) => {
      btn.classList.toggle('is-active', btn === option);
    });
    if (this.cachedElements.customQuestionField) {
      this.cachedElements.customQuestionField.hidden = this.currentDescriptionMode !== 'custom-question';
    }
    this.updateGeneratedPrompt();
  }

  createPromptVariations(detailed, base) {
    const shortPrompt = truncatePrompt(base, 200);
    const mediumPrompt = truncatePrompt(detailed, 450);
    const variations = [
      { id: 'short', label: 'Short', text: shortPrompt },
      { id: 'medium', label: 'Medium', text: mediumPrompt },
      { id: 'detailed', label: 'Detailed', text: detailed }
    ];
    return variations.map((variation) => ({
      ...variation,
      quality: this.calculateQualityScore(variation.text),
      words: variation.text.split(/\s+/).filter(Boolean).length,
      chars: variation.text.length
    }));
  }

  renderGeneratedVariations(variations) {
    const container = this.cachedElements.generatedVariations;
    if (!container) return;
    container.innerHTML = '';
    variations.forEach((variation) => {
      const card = document.createElement('div');
      card.className = 'variation-card';
      card.dataset.variationId = variation.id;

      const header = document.createElement('div');
      header.className = 'variation-card__header';
      const title = document.createElement('span');
      title.className = 'variation-card__title';
      title.textContent = variation.label;
      const metrics = document.createElement('div');
      metrics.className = 'variation-card__metrics';
      metrics.textContent = `${variation.words} words • ${variation.chars} chars`;
      header.append(title, metrics);

      const textarea = document.createElement('textarea');
      textarea.value = variation.text;
      textarea.readOnly = true;

      const quality = document.createElement('span');
      quality.className = 'variation-quality';
      if (variation.quality >= 80) {
        quality.classList.add('is-good');
      } else if (variation.quality >= 60) {
        quality.classList.add('is-warning');
      } else {
        quality.classList.add('is-poor');
      }
      quality.innerHTML = `<i class="fas fa-gauge-high"></i> ${variation.quality}% quality`;

      const actions = document.createElement('div');
      actions.className = 'variation-actions';
      const useBtn = document.createElement('button');
      useBtn.className = 'btn btn--secondary btn--sm';
      useBtn.type = 'button';
      useBtn.dataset.variationAction = 'use';
      useBtn.dataset.variationId = variation.id;
      useBtn.textContent = 'Use Prompt';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn--outline btn--sm';
      copyBtn.type = 'button';
      copyBtn.dataset.variationAction = 'copy';
      copyBtn.dataset.variationId = variation.id;
      copyBtn.textContent = 'Copy';

      actions.append(useBtn, copyBtn);
      card.append(header, textarea, quality, actions);
      container.appendChild(card);
    });
  }

  handleVariationClick(event) {
    const button = event.target.closest('[data-variation-action]');
    if (!button) return;
    const variationId = button.dataset.variationId;
    const card = this.cachedElements.generatedVariations?.querySelector(`[data-variation-id="${variationId}"]`);
    const text = card?.querySelector('textarea')?.value || '';
    if (!text) return;
    const action = button.dataset.variationAction;
    if (action === 'use') {
      this.setPrompt(text, { expand: false, addToHistory: true }).then(() => this.switchTab('prompt-builder'));
    } else if (action === 'copy') {
      this.copyTextToClipboard(text)
        .then(() => this.showNotification('Prompt copied to clipboard!'))
        .catch(() => alert('Unable to copy prompt automatically.'));
    }
  }

  async deepAnalyzePrompt() {
    if (!this.currentPrompt) {
      alert('No prompt to analyze!');
      return;
    }
    let analysis = '';
    if (this.textGenerator) {
      try {
        const res = await this.textGenerator(`Provide improvements for this image generation prompt: ${this.currentPrompt}`, { max_new_tokens: 100 });
        analysis = res[0].generated_text;
      } catch (error) {
        analysis = 'Analysis failed. Try again later.';
      }
    } else {
      analysis = 'Consider adding more details about lighting, style, color, mood, and composition.';
    }
    alert(analysis);
  }

  initImageAnalyzer() {
    if (typeof window.transformers === 'undefined') {
      console.warn('Transformers.js not loaded; image analysis disabled');
      return;
    }
    window.transformers.pipeline('image-to-text', 'Xenova/blip-image-captioning-large')
      .then((model) => {
        this.imageCaptioner = model;
        console.log('📸 Image captioner ready');
      })
      .catch((err) => console.error('Image captioner load error', err));
    window.transformers.pipeline('text-generation', 'Xenova/gpt2')
      .then((model) => {
        this.textGenerator = model;
        console.log('📝 Text generator ready');
      })
      .catch((err) => console.error('Text generator load error', err));
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('aiPromptGenerator');
      if (!stored) {
        return false;
      }
      const data = JSON.parse(stored);
      this.currentPlatform = data.currentPlatform || 'natural_language';
      this.currentTheme = data.currentTheme || 'cyberpunk_neon';
      this.promptHistory = data.promptHistory || [];
      this.savedPrompts = data.savedPrompts || [];
      this.platformToggles = new Set(data.platformToggles || []);
      if (data.builderState) {
        this.builderState = { ...this.builderState, ...data.builderState };
      }
      if (this.cachedElements.platformSelect) {
        this.cachedElements.platformSelect.value = this.currentPlatform;
      }
      if (this.cachedElements.themeSelect) {
        this.cachedElements.themeSelect.value = this.currentTheme;
      }
      if (this.cachedElements.platformToggleGrid) {
        this.cachedElements.platformToggleGrid.querySelectorAll('[data-platform-toggle]').forEach((checkbox) => {
          checkbox.checked = this.platformToggles.has(checkbox.value);
        });
      }
      this.updateHistoryDisplay();
      this.updateSavedPromptsDisplay();
      return true;
    } catch (error) {
      console.warn('Could not load from localStorage:', error);
      return false;
    }
  }

  saveToStorage() {
    const data = {
      currentPlatform: this.currentPlatform,
      currentTheme: this.currentTheme,
      promptHistory: this.promptHistory,
      savedPrompts: this.savedPrompts,
      platformToggles: Array.from(this.platformToggles),
      builderState: this.builderState
    };
    try {
      localStorage.setItem('aiPromptGenerator', JSON.stringify(data));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab').forEach((tab) => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.tab-content').forEach((content) => {
      const isActive = content.id === `${tabName}-tab`;
      content.classList.toggle('active', isActive);
      if (isActive) {
        content.removeAttribute('hidden');
      } else {
        content.setAttribute('hidden', '');
      }
    });
  }
}

const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
`;
document.head.appendChild(notificationStyle);

const promptApp = new PromptGenerator();
document.addEventListener('DOMContentLoaded', () => {
  promptApp.initialize();
});
