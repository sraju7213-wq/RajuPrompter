// AI Prompt Generator v2.0 - Working Version for Netlify
console.log('🚀 AI Prompt Generator v2.0 Starting...');

// Global state
let currentPlatform = 'natural_language';
let currentTheme = 'cyberpunk_neon';
let currentPrompt = '';
let promptHistory = [];
let savedPrompts = [];
let textGenerator = null;
let imageCaptioner = null;
let lastImageTags = [];
let lastColorHex = '';
let desiredPromptLength = 300;
let currentAspectRatio = '1:1';
let currentDescriptionMode = 'describe-detail';
let magicEnhanceEnabled = false;
let optimizeTimer = null;
let currentLanguage = 'en';
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const deferredTabCache = new Set();

const DISCLOSURE_BREAKPOINTS = { sm: 480, md: 768, lg: 1024 };
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])';
let lastFocusedElement = null;
let activeModal = null;
let activeDrawer = null;
let disclosureResizeTimer = null;
let notificationTimer = null;

const LANGUAGE_LABELS = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    hi: 'हिन्दी'
};

const DARK_THEMES = new Set([
    'cyberpunk_neon',
    'dark_professional',
    'warm_autumn',
    'ocean_blue',
    'forest_green',
    'sunset_gradient'
]);

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


// Platform configurations
const platformData = {
    midjourney: {
        name: 'Midjourney',
        optimalLength: '20-75 words',
        supportsNegative: false,
        parameters: ['ar', 's', 'q', 'seed']
    },
    stable_diffusion: {
        name: 'Stable Diffusion',
        optimalLength: '10-150 words',
        supportsNegative: true,
        parameters: ['steps', 'cfg_scale', 'seed']
    },
    flux_ai: {
        name: 'Flux AI',
        optimalLength: '15-100 words',
        supportsNegative: false,
        parameters: ['model', 'guidance']
    },
    dall_e: {
        name: 'DALL-E',
        optimalLength: '10-80 words',
        supportsNegative: false,
        parameters: ['size', 'quality', 'style']
    },
    natural_language: {
        name: 'Natural Language',
        optimalLength: '5-200 words',
        supportsNegative: false,
        parameters: []
    }
};

// Theme configurations
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
        primary: '#00ff88',
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

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing app...');
    initializeApp();
    setupResponsiveEnhancements();
});

function initializeApp() {
    console.log('🎯 Initializing AI Prompt Generator...');

    // Load saved data
    const hasStoredData = loadFromStorage();

    // Respect system color preference on first load
    if (!hasStoredData) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark_professional' : 'light_modern';
    }

    // Apply theme
    applyTheme(currentTheme);

    // Apply stored language preference
    setLanguage(currentLanguage, { persist: false });

    // Load shared prompt from URL if present
    const sharedPrompt = new URLSearchParams(window.location.search).get('prompt');
    if (sharedPrompt) {
        setPrompt(sharedPrompt);
    }

    // Setup event listeners
    setupEventListeners();

    // Initialize UI
    initializeWordBank();
    initImageAnalyzer();
    updatePromptPreview();
    updateQualityScore();
    updatePlatformBadge();
    updateActionStates();
    updateFooterYear();

    console.log('🚀 App initialized successfully!');
}

function setupResponsiveEnhancements() {
    setupDrawer();
    setupThemeSwatches();
    setupDisclosures();
    setupModalControls();
    document.querySelectorAll('.tab-content').forEach(content => {
        if (!content.classList.contains('active')) {
            content.setAttribute('hidden', '');
        }
    });
    updateDisclosureStates();
}

function setupEventListeners() {
    console.log('🔗 Setting up event listeners...');

    // Platform selector
    const platformSelect = document.getElementById('platform-select');
    if (platformSelect) {
        platformSelect.addEventListener('change', function(e) {
            currentPlatform = e.target.value;
            updatePlatformBadge();
            updatePromptPreview();
            saveToStorage();
            console.log('🔄 Platform changed to:', currentPlatform);
        });
    }

    const lengthSlider = document.getElementById('prompt-length');
    if (lengthSlider) {
        const updateLength = (val) => {
            desiredPromptLength = parseInt(val);
            const label = document.getElementById('prompt-length-display');
            if (label) {
                label.textContent = val <= 200 ? 'Short' : val <= 400 ? 'Medium' : 'Long';
            }
        };
        updateLength(lengthSlider.value);
        lengthSlider.addEventListener('input', (e) => {
            updateLength(e.target.value);
        });
    }

    // Main prompt textarea
    const promptTextarea = document.getElementById('prompt-textarea');
    if (promptTextarea) {
        promptTextarea.addEventListener('input', function(e) {
            currentPrompt = e.target.value;
            updatePromptPreview();
            updateWordCount();
            updateQualityScore();
            if (magicEnhanceEnabled) {
                debounceOptimize();
            }
        });
    }

    const clearFieldBtn = document.getElementById('clear-field');
    if (clearFieldBtn) {
        clearFieldBtn.addEventListener('click', clearPrompt);
    }

    const magicToggle = document.getElementById('magic-enhance-toggle');
    if (magicToggle) {
        magicToggle.addEventListener('change', (event) => {
            magicEnhanceEnabled = event.target.checked;
            if (magicEnhanceEnabled && currentPrompt) {
                optimizePrompt();
            }
        });
    }

    const aspectGroup = document.getElementById('aspect-ratio-group');
    if (aspectGroup) {
        aspectGroup.addEventListener('click', (event) => {
            const segment = event.target.closest('.segment');
            if (!segment) return;
            currentAspectRatio = segment.dataset.aspect || '1:1';
            aspectGroup.querySelectorAll('.segment').forEach(btn => {
                btn.classList.toggle('is-active', btn === segment);
            });
            updatePromptPreview();
        });
    }

    // Random generator buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.random-btn')) {
            const category = e.target.closest('.random-btn').dataset.category;
            generateRandomPrompt(category);
            console.log('🎲 Generated random prompt for:', category);
        }
    });

    // Word bank items
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('word-item')) {
            addWordToPrompt(e.target.textContent);
            console.log('➕ Added word:', e.target.textContent);
        }
    });

    // Category tabs
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-tab')) {
            switchWordCategory(e.target.dataset.category);
            console.log('📂 Switched to category:', e.target.dataset.category);
        }
    });

    // Main tabs
    document.addEventListener('click', function(e) {
        if (e.target.closest('.tab')) {
            const tabName = e.target.closest('.tab').dataset.tab;
            switchTab(tabName);
            console.log('🗂️ Switched to tab:', tabName);
        }
    });

    // Action buttons
    const copyBtn = document.getElementById('copy-prompt');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyToClipboard);
    }

    const clearBtn = document.getElementById('clear-prompt');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearPrompt);
    }

    const optimizeBtn = document.getElementById('optimize-prompt');
    if (optimizeBtn) {
        optimizeBtn.addEventListener('click', optimizePrompt);
    }

    const saveBtn = document.getElementById('save-prompt');
    if (saveBtn) {
        saveBtn.addEventListener('click', savePrompt);
    }

    const confirmSaveBtn = document.getElementById('confirm-save');
    if (confirmSaveBtn) {
        confirmSaveBtn.addEventListener('click', confirmSavePrompt);
    }

    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }

    const naturalToggle = document.getElementById('natural-language-toggle');
    if (naturalToggle) {
        naturalToggle.addEventListener('change', updateGeneratedPrompt);
    }

    const descriptionGrid = document.getElementById('description-grid');
    if (descriptionGrid) {
        descriptionGrid.addEventListener('click', (event) => {
            const option = event.target.closest('.description-option');
            if (!option) return;
            currentDescriptionMode = option.dataset.description || 'describe-detail';
            descriptionGrid.querySelectorAll('.description-option').forEach(btn => {
                btn.classList.toggle('is-active', btn === option);
            });
            const customField = document.getElementById('custom-question-field');
            if (customField) {
                customField.hidden = currentDescriptionMode !== 'custom-question';
            }
            updateGeneratedPrompt();
        });
    }

    const wordSearchField = document.getElementById('word-search');
    if (wordSearchField) {
        wordSearchField.addEventListener('input', (event) => {
            const query = event.target.value.trim().toLowerCase();
            filterWordBank(query);
        });
    }

    const customQuestionInput = document.getElementById('custom-question-input');
    if (customQuestionInput) {
        customQuestionInput.addEventListener('input', () => {
            if (currentDescriptionMode === 'custom-question') {
                updateGeneratedPrompt();
            }
        });
    }

    const useGeneratedPromptBtn = document.getElementById('use-generated-prompt');
    if (useGeneratedPromptBtn) {
        useGeneratedPromptBtn.addEventListener('click', function() {
            const text = document.getElementById('generated-prompt-text').value;
            if (text) setPrompt(text);
            switchTab('prompt-builder');
        });
    }

    const copyGeneratedBtn = document.getElementById('copy-generated-prompt');
    if (copyGeneratedBtn) {
        copyGeneratedBtn.addEventListener('click', () => {
            const text = document.getElementById('generated-prompt-text')?.value || '';
            if (!text) return;
            copyTextToClipboard(text)
                .then(() => showNotification('Prompt copied to clipboard!', 'success'))
                .catch(() => showNotification('Unable to copy automatically. Please copy manually.', 'warning'));
        });
    }

    const batchBtn = document.getElementById('generate-batch');
    if (batchBtn) {
        batchBtn.addEventListener('click', generateBatch);
    }

    // Listen for messages from the Hugging Face iframe
    window.addEventListener('message', function(e) {
        if (e.origin === 'https://huggingface.co' && typeof e.data === 'string') {
            console.log('HF Image to Prompt:', e.data);
        }
    });

    setupQuickActions();

    console.log('✅ Event listeners configured');
}

function setupDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const menuToggle = document.getElementById('menu-toggle');
    const scrim = document.getElementById('scrim');
    const drawerClose = document.getElementById('drawer-close');

    if (!drawer || !menuToggle || !scrim) {
        return;
    }

    drawer.setAttribute('aria-hidden', 'true');
    scrim.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', (event) => {
        event.preventDefault();
        if (drawer.getAttribute('aria-hidden') === 'false') {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    drawerClose?.addEventListener('click', (event) => {
        event.preventDefault();
        closeDrawer();
    });

    scrim.addEventListener('click', closeDrawer);

    drawer.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeDrawer();
        }
    });
}

function openDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const scrim = document.getElementById('scrim');
    const menuToggle = document.getElementById('menu-toggle');
    if (!drawer || !scrim || !menuToggle) return;

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    drawer.setAttribute('aria-hidden', 'false');
    scrim.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    activeDrawer = drawer;

    const focusTarget = drawer.querySelector(FOCUSABLE_SELECTOR);
    if (focusTarget) {
        focusTarget.focus();
    }
}

function closeDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const scrim = document.getElementById('scrim');
    const menuToggle = document.getElementById('menu-toggle');
    if (!drawer || !scrim || !menuToggle) return;

    drawer.setAttribute('aria-hidden', 'true');
    scrim.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    activeDrawer = null;

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
}

function setupThemeSwatches() {
    const swatches = document.querySelectorAll('.theme-swatch');
    if (!swatches.length) {
        return;
    }

    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const theme = swatch.dataset.theme;
            if (theme) {
                applyTheme(theme);
            }
        });
    });

    updateThemeUI();
}

function setupDisclosures() {
    document.querySelectorAll('details[data-breakpoint]').forEach(detail => {
        detail.dataset.userExpanded = detail.open ? 'true' : 'false';
        detail.addEventListener('toggle', () => {
            detail.dataset.userExpanded = detail.open ? 'true' : 'false';
        });
    });

    window.addEventListener('resize', () => {
        clearTimeout(disclosureResizeTimer);
        disclosureResizeTimer = setTimeout(() => {
            updateDisclosureStates();
            if (window.innerWidth >= DISCLOSURE_BREAKPOINTS.md && activeDrawer) {
                closeDrawer();
            }
        }, 150);
    });
}

function updateDisclosureStates() {
    const width = window.innerWidth;
    document.querySelectorAll('details[data-breakpoint]').forEach(detail => {
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

function setupModalControls() {
    document.querySelectorAll('[data-modal-open]').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = button.getAttribute('data-modal-open');
            if (!targetId) return;
            const modal = document.getElementById(targetId);
            if (modal) {
                openModalElement(modal);
            } else {
                console.warn('Modal target not found:', targetId);
            }
        });
    });

    document.querySelectorAll('[data-modal-close]').forEach(button => {
        button.addEventListener('click', () => {
            if (activeModal) {
                closeModalElement(activeModal);
            }
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModalElement(modal);
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
            if (activeModal) {
                event.preventDefault();
                closeModalElement(activeModal);
            } else if (activeDrawer) {
                event.preventDefault();
                closeDrawer();
            }
        }
    });
}

function openModalElement(modal) {
    if (!modal) return;
    if (activeModal && activeModal !== modal) {
        closeModalElement(activeModal);
    }
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    activeModal = modal;
    const focusTarget = modal.querySelector(FOCUSABLE_SELECTOR);
    if (focusTarget) {
        focusTarget.focus();
    }
}

function closeModalElement(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (activeModal === modal) {
        activeModal = null;
    }
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
}

function setupQuickActions() {
    const quickActionButtons = document.querySelectorAll('.quick-action');
    quickActionButtons.forEach(button => {
        if (button.dataset.action) {
            return;
        }
        if (button.dataset.tabTarget || button.dataset.openModal || button.dataset.openUrl) {
            button.addEventListener('click', () => {
                activateQuickAction(button);
            });
        }
    });

    const languageButton = document.querySelector('[data-action="open-language"]');
    const languagePanel = document.getElementById('language-preferences-panel');
    if (languageButton && languagePanel) {
        languageButton.addEventListener('click', () => {
            const isExpanded = languageButton.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeLanguagePanel(languageButton, languagePanel);
            } else {
                languageButton.setAttribute('aria-expanded', 'true');
                languagePanel.hidden = false;
                languagePanel.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(() => {
                    const select = languagePanel.querySelector('select');
                    if (select) {
                        select.focus();
                    }
                });
            }
        });

        document.addEventListener('click', (event) => {
            if (!languagePanel.contains(event.target) && !languageButton.contains(event.target)) {
                closeLanguagePanel(languageButton, languagePanel);
            }
        });

        languagePanel.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeLanguagePanel(languageButton, languagePanel);
                languageButton.focus();
            }
        });
    }

    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', (event) => {
            setLanguage(event.target.value);
            showNotification(`Language updated to ${LANGUAGE_LABELS[currentLanguage] || 'English'}`, 'success');
            if (languageButton && languagePanel) {
                closeLanguagePanel(languageButton, languagePanel);
                languageButton.focus();
            }
        });
    }

    updateThemeUI();
    setLanguage(currentLanguage, { persist: false });
}

function activateQuickAction(button) {
    if (!button) return;
    const tabName = button.dataset.tabTarget;
    const focusSelector = button.dataset.focusTarget;
    const scrollSelector = button.dataset.scrollTarget;
    const modalTarget = button.dataset.openModal;
    const externalUrl = button.dataset.openUrl;
    const openTarget = button.dataset.openTarget || '_self';

    setQuickActionLoading(button, true);

    let actionPromise = Promise.resolve();

    if (tabName) {
        switchTab(tabName);
        actionPromise = new Promise(resolve => {
            setTimeout(() => {
                let handled = false;
                if (scrollSelector) {
                    const scrollTarget = document.querySelector(scrollSelector);
                    if (scrollTarget && typeof scrollTarget.scrollIntoView === 'function') {
                        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        handled = true;
                    }
                }

                if (focusSelector) {
                    const focusTarget = document.querySelector(focusSelector);
                    if (focusTarget && typeof focusTarget.focus === 'function') {
                        if (!handled && typeof focusTarget.scrollIntoView === 'function') {
                            focusTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        focusTarget.focus({ preventScroll: true });
                        handled = true;
                    }
                }

                if (!handled) {
                    console.warn('Quick action target not found for', tabName);
                    showNotification('Section loaded. Scroll to view the updated workspace.', 'info');
                }

                resolve();
            }, 220);
        });
    } else if (modalTarget) {
        actionPromise = new Promise(resolve => {
            const modal = document.getElementById(modalTarget);
            if (modal) {
                openModalElement(modal);
            } else {
                console.warn('Quick action modal not found for', modalTarget);
            }
            resolve();
        });
    } else if (externalUrl) {
        actionPromise = new Promise(resolve => {
            window.open(externalUrl, openTarget);
            resolve();
        });
    }

    actionPromise.finally(() => setQuickActionLoading(button, false));
}

function setQuickActionLoading(button, isLoading) {
    if (!button) return;
    if (isLoading) {
        button.classList.add('is-loading');
        button.setAttribute('aria-busy', 'true');
        button.disabled = true;
    } else {
        button.classList.remove('is-loading');
        button.removeAttribute('aria-busy');
        button.disabled = false;
    }
}

function closeLanguagePanel(trigger, panel) {
    if (!trigger || !panel) return;
    if (panel.hidden) return;
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
}

function loadDeferredEmbeds(tabName) {
    if (!tabName || deferredTabCache.has(tabName)) return;
    const frames = document.querySelectorAll(`iframe[data-deferred-tab='${tabName}']`);
    if (frames.length === 0) {
        return;
    }

    frames.forEach(frame => {
        if (frame.dataset.src && !frame.src) {
            frame.src = frame.dataset.src;
        }
    });

    deferredTabCache.add(tabName);
}

function setLanguage(languageCode, { persist = true } = {}) {
    const normalized = LANGUAGE_LABELS[languageCode] ? languageCode : 'en';
    currentLanguage = normalized;
    document.documentElement.setAttribute('lang', normalized);

    const languageStatus = document.querySelector('[data-language-label]');
    if (languageStatus) {
        languageStatus.textContent = LANGUAGE_LABELS[normalized] || LANGUAGE_LABELS.en;
    }

    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = normalized;
    }

    const languageButton = document.querySelector('[data-action="open-language"]');
    if (languageButton) {
        const label = LANGUAGE_LABELS[normalized] || LANGUAGE_LABELS.en;
        languageButton.setAttribute('aria-label', `Language preferences (current: ${label})`);
    }

    if (persist) {
        saveToStorage();
    }
}

function updateThemeUI() {
    const swatches = document.querySelectorAll('.theme-swatch');
    let activeSwatch = null;

    swatches.forEach(swatch => {
        const isActive = swatch.dataset.theme === currentTheme;
        swatch.classList.toggle('is-active', isActive);
        swatch.setAttribute('aria-checked', isActive ? 'true' : 'false');
        if (isActive) {
            activeSwatch = swatch;
        }
    });

    const indicator = document.getElementById('theme-mode-indicator');
    if (indicator) {
        if (activeSwatch) {
            const mode = activeSwatch.dataset.themeMode === 'light' ? 'Light mode' : 'Dark mode';
            const themeLabel = activeSwatch.dataset.themeLabel || activeSwatch.getAttribute('aria-label') || '';
            indicator.textContent = [mode, themeLabel.replace(/apply\s*/i, '').trim()].filter(Boolean).join(' • ');
        } else {
            indicator.textContent = DARK_THEMES.has(currentTheme) ? 'Dark mode active' : 'Light mode active';
        }
    }
}

function initImageAnalyzer() {
    if (typeof window.transformers === 'undefined') {
        console.warn('Transformers.js not loaded; image analysis disabled');
        return;
    }
    window.transformers.pipeline('image-to-text', 'Xenova/blip-image-captioning-large')
        .then(model => {
            imageCaptioner = model;
            console.log('📸 Image captioner ready');
        })
        .catch(err => console.error('Image captioner load error', err));
    window.transformers.pipeline('text-generation', 'Xenova/gpt2')
        .then(model => {
            textGenerator = model;
            console.log('📝 Text generator ready');
        })
        .catch(err => console.error('Text generator load error', err));
}

// Random prompt generators
function generateRandomPrompt(category) {
    let prompt = '';

    switch(category) {
        case 'portrait':
            prompt = generatePortraitPrompt();
            break;
        case 'landscape':
            prompt = generateLandscapePrompt();
            break;
        case 'digital_art':
            prompt = generateDigitalArtPrompt();
            break;
        case 'photography':
            prompt = generatePhotographyPrompt();
            break;
        case 'fantasy':
            prompt = generateFantasyPrompt();
            break;
        case 'surprise':
            prompt = generateSurprisePrompt();
            break;
        default:
            prompt = generateSurprisePrompt();
    }

    setPrompt(prompt).then(() => addToHistory(currentPrompt));
}

function generatePortraitPrompt() {
    const subject = getRandomWord('subjects', 'people');
    const style = getRandomWord('styles', 'artistic_styles');
    const lighting = getRandomWord('lighting', 'natural');
    const mood = getRandomWord('moods', 'positive');
    const composition = getRandomWord('composition', 'camera_angles');

    return `${style} ${composition} portrait of ${subject}, ${mood} expression, ${lighting}, professional photography, highly detailed`;
}

function generateLandscapePrompt() {
    const location = getRandomWord('subjects', 'objects');
    const lighting = getRandomWord('lighting', 'natural');
    const style = getRandomWord('styles', 'art_movements');
    const mood = getRandomWord('moods', 'positive');

    return `${style} landscape painting of ${location}, ${lighting}, ${mood} atmosphere, masterpiece quality`;
}

function generateDigitalArtPrompt() {
    const subject = getRandomWord('subjects', 'animals');
    const style = getRandomWord('styles', 'visual_styles');
    const lighting = getRandomWord('lighting', 'artificial');
    const color = getRandomWord('colors', 'warm');

    return `${style} digital art of ${subject}, ${lighting}, ${color} color palette, concept art, trending on artstation`;
}

function generatePhotographyPrompt() {
    const subject = getRandomWord('subjects', 'people');
    const composition = getRandomWord('composition', 'framing');
    const lighting = getRandomWord('lighting', 'natural');
    const style = 'professional photography';

    return `${style} of ${subject}, ${composition}, ${lighting}, shot with professional camera, high resolution`;
}

function generateFantasyPrompt() {
    const character = getRandomWord('subjects', 'people');
    const creature = getRandomWord('subjects', 'animals');
    const style = getRandomWord('styles', 'art_movements');
    const lighting = getRandomWord('lighting', 'qualities');

    return `Epic fantasy scene with ${character} and mythical ${creature}, ${style} art style, ${lighting} lighting, magical atmosphere`;
}

function generateSurprisePrompt() {
    const categories = Object.keys(wordLibrary);
    const randomElements = [];

    for (let i = 0; i < 4; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const subcategories = Object.keys(wordLibrary[category]);
        const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
        randomElements.push(getRandomWord(category, subcategory));
    }

    return randomElements.join(', ') + ', creative composition, unique perspective, highly detailed';
}

function getRandomWord(category, subcategory) {
    const words = wordLibrary[category][subcategory];
    return words[Math.floor(Math.random() * words.length)];
}

// UI Update Functions
async function setPrompt(prompt) {
    const textarea = document.getElementById('prompt-textarea');
    if (!prompt) {
        currentPrompt = '';
        if (textarea) {
            textarea.value = '';
            updatePromptPreview();
            updateWordCount();
            updateQualityScore();
        }
        return;
    }
    currentPrompt = await expandPrompt(prompt, desiredPromptLength);
    if (textarea) {
        textarea.value = currentPrompt;
        updatePromptPreview();
        updateWordCount();
        updateQualityScore();
    }
}

function addWordToPrompt(word) {
    const textarea = document.getElementById('prompt-textarea');
    if (textarea) {
        const currentText = textarea.value;
        const newText = currentText ? currentText + ', ' + word : word;
        setPrompt(newText);
    }
}

function updatePromptPreview() {
    const preview = document.getElementById('preview-content');
    if (preview) {
        let formattedPrompt = currentPrompt || 'Start building your prompt...';

        // Add platform-specific formatting
        if (currentPrompt) {
            if (currentPlatform === 'midjourney') {
                formattedPrompt += ` --ar ${currentAspectRatio} --s 100 --q 1`;
            } else if (currentPlatform === 'stable_diffusion') {
                formattedPrompt += ` | aspect ratio ${currentAspectRatio}`;
            }
        }

        preview.textContent = formattedPrompt;
    }
}

function updateWordCount() {
    const words = currentPrompt.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    const wordCountDisplay = document.getElementById('word-count');
    const wordCountMetric = document.getElementById('word-count-display');
    const charCounter = document.getElementById('char-count');
    const textarea = document.getElementById('prompt-textarea');

    if (wordCountDisplay) {
        wordCountDisplay.textContent = `${wordCount} words`;
    }

    if (wordCountMetric) {
        wordCountMetric.textContent = wordCount;
    }

    if (charCounter && textarea) {
        const length = textarea.value.length;
        charCounter.textContent = `${length}/2000`;
    }

    updateActionStates();
}

function updateActionStates() {
    const hasPrompt = Boolean(currentPrompt && currentPrompt.trim().length);
    const saveBtn = document.getElementById('save-prompt');
    const copyBtn = document.getElementById('copy-prompt');

    if (saveBtn) {
        if (hasPrompt) {
            saveBtn.removeAttribute('disabled');
        } else {
            saveBtn.setAttribute('disabled', 'disabled');
        }
    }

    if (copyBtn) {
        if (hasPrompt) {
            copyBtn.removeAttribute('disabled');
        } else {
            copyBtn.setAttribute('disabled', 'disabled');
        }
    }

    if (!hasPrompt) {
        setActionFeedback('');
    }
}

function updateQualityScore() {
    const score = calculateQualityScore(currentPrompt);
    const qualityIndicator = document.getElementById('quality-indicator');
    const qualityScoreDisplay = document.getElementById('quality-score');

    if (qualityIndicator) {
        const level = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor';
        qualityIndicator.className = `status-pill quality-indicator ${level}`;
        qualityIndicator.textContent = `Quality: ${level.toUpperCase()} (${score}%)`;
    }

    if (qualityScoreDisplay) {
        qualityScoreDisplay.textContent = `${score}%`;
        const level = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor';
        qualityScoreDisplay.className = `metric-value quality-score ${level}`;
    }
}

function calculateQualityScore(prompt) {
    if (!prompt) return 0;

    const normalized = prompt.trim();
    if (!normalized) return 0;

    const words = normalized.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    if (!wordCount) return 0;

    const cleanedWords = words.map(word => word.replace(/[^a-z0-9-]/gi, '').toLowerCase()).filter(Boolean);
    const uniqueWordCount = new Set(cleanedWords).size;
    const promptLower = normalized.toLowerCase();

    const targetWords = Math.max(8, Math.round(desiredPromptLength / 6));
    const lengthDifference = Math.abs(wordCount - targetWords);
    const lengthScore = Math.max(0, 30 - Math.min(30, (lengthDifference / targetWords) * 30));

    const diversityRatio = wordCount ? Math.min(1, uniqueWordCount / wordCount) : 0;
    const diversityScore = Math.round(diversityRatio * 18);

    const descriptiveWords = ['beautiful', 'stunning', 'detailed', 'masterpiece', 'professional', 'artistic', 'cinematic', 'hyperrealistic', 'vibrant', 'dramatic', 'immersive', 'ornate', 'photorealistic'];
    const descriptorMatches = descriptiveWords.filter(word => promptLower.includes(word)).length;
    const descriptorScore = Math.min(14, descriptorMatches * 2);

    const punctuationCount = (normalized.match(/[,;:]/g) || []).length;
    const structureScore = Math.min(8, punctuationCount * 2);

    const styleMatches = Object.values(wordLibrary.styles).reduce((total, group) => {
        return total + (group.some(style => promptLower.includes(style.toLowerCase())) ? 1 : 0);
    }, 0);
    const styleScore = Math.min(12, styleMatches * 4);

    const lightingMatches = Object.values(wordLibrary.lighting).reduce((total, group) => {
        return total + (group.some(light => promptLower.includes(light.toLowerCase())) ? 1 : 0);
    }, 0);
    const lightingScore = Math.min(8, lightingMatches * 4);

    let platformScore = 0;
    if (/\b(--ar|aspect\s+ratio)\b/i.test(normalized)) platformScore += 4;
    if (/\b(--stylize|--s|--q|cfg\s*scale|guidance|seed)\b/i.test(normalized)) platformScore += 3;
    if (/(4k|8k|high\s+resolution|ultra\s+detail|hdr)/i.test(normalized)) platformScore += 3;
    platformScore = Math.min(10, platformScore);

    const rawScore = lengthScore + diversityScore + descriptorScore + structureScore + styleScore + lightingScore + platformScore;
    return Math.max(0, Math.min(100, Math.round(rawScore)));
}

function updatePlatformBadge() {
    const badge = document.getElementById('platform-badge');
    if (badge && platformData[currentPlatform]) {
        badge.textContent = platformData[currentPlatform].name;
    }
}

// Word bank initialization
function initializeWordBank() {
    switchWordCategory('subjects');
}

function switchWordCategory(category) {
    const wordBank = document.getElementById('word-bank');
    if (!wordBank || !wordLibrary[category]) return;

    // Update tab states
    document.querySelectorAll('.category-tab').forEach(tab => {
        const isActive = tab.dataset.category === category;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Clear and populate word bank
    wordBank.innerHTML = '';

    Object.values(wordLibrary[category]).forEach(subcategoryWords => {
        subcategoryWords.forEach(word => {
            const wordElement = document.createElement('span');
            wordElement.className = 'word-item';
            wordElement.textContent = word;
            wordElement.dataset.length = word.length;
            wordElement.style.setProperty('--char-length', word.length);
            wordBank.appendChild(wordElement);
        });
    });

    const searchField = document.getElementById('word-search');
    if (searchField && searchField.value.trim()) {
        filterWordBank(searchField.value.trim().toLowerCase());
    } else {
        filterWordBank('');
    }
}

function filterWordBank(query = '') {
    const wordBank = document.getElementById('word-bank');
    if (!wordBank) {
        return;
    }

    const normalized = query.trim().toLowerCase();
    const items = wordBank.querySelectorAll('.word-item');
    let visibleCount = 0;

    items.forEach(item => {
        const matches = !normalized || item.textContent.toLowerCase().includes(normalized);
        item.toggleAttribute('hidden', !matches);
        if (matches) {
            visibleCount += 1;
        }
    });

    let emptyState = wordBank.querySelector('.word-bank__empty');
    if (!visibleCount && normalized) {
        if (!emptyState) {
            emptyState = document.createElement('p');
            emptyState.className = 'word-bank__empty';
            wordBank.appendChild(emptyState);
        }
        emptyState.textContent = 'No words found for that search.';
    } else if (emptyState) {
        emptyState.remove();
    }
}

async function handleImageUpload(event) {
    const file = event.target?.files ? event.target.files[0] : null;
    if (!file) {
        return;
    }

    resetImageAnalysis(true);
    displayUploadStatus('');

    const validation = validateUploadFile(file);
    if (!validation.valid) {
        displayUploadStatus(validation.message, 'error');
        event.target.value = '';
        return;
    }

    displayUploadStatus('Validating upload...', 'info');

    try {
        setLoadingOverlay(true, 'Analyzing your image…');
        const dataUrl = await readFileAsDataURL(file);
        const base64Image = dataUrl.split(',')[1];

        const serverValidation = await validateUploadOnServer(file, base64Image);
        if (serverValidation && serverValidation.valid === false) {
            displayUploadStatus(serverValidation.message || 'Upload blocked for security reasons.', 'error');
            event.target.value = '';
            return;
        }

        const validationWarning = serverValidation && serverValidation.warning;
        if (validationWarning) {
            displayUploadStatus(`${serverValidation.message} Preparing preview…`, 'warning');
        } else {
            displayUploadStatus('Upload validated. Preparing preview…', 'info');
        }

        const previewImage = await loadPreviewImage(dataUrl);

        displayUploadStatus(validationWarning ? 'Analyzing image locally…' : 'Analyzing image…', validationWarning ? 'warning' : 'info');

        const [hfPrompt] = await Promise.all([
            fetchHFPrompt(base64Image),
            analyzeImage(previewImage)
        ]);

        if (hfPrompt) {
            const textarea = document.getElementById('generated-prompt-text');
            if (textarea && !textarea.value.trim()) {
                textarea.value = hfPrompt;
            }
        }

        displayUploadStatus('Image processed successfully.', 'success');
    } catch (error) {
        console.error('Image upload error', error);
        const message = error?.message || 'We could not process that image. Please try a different file.';
        displayUploadStatus(message, 'error');
        resetImageAnalysis(true);
        event.target.value = '';
    } finally {
        setLoadingOverlay(false);
    }
}

function validateUploadFile(file) {
    const extension = file.name ? file.name.split('.').pop().toLowerCase() : '';
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type) && !allowedExtensions.includes(extension)) {
        return { valid: false, message: 'Unsupported file type. Use JPG, PNG, or WebP images.' };
    }

    if (file.size > MAX_UPLOAD_SIZE) {
        return { valid: false, message: 'File size too large. Please choose an image under 10MB.' };
    }

    return { valid: true };
}

function displayUploadStatus(message, type = 'info') {
    const status = document.getElementById('upload-status');
    if (!status) {
        return;
    }

    status.textContent = message || '';
    status.className = 'upload-status';
    if (!message) {
        status.style.display = 'none';
        return;
    }

    status.style.display = '';
    if (type === 'success') {
        status.classList.add('upload-status--success');
    } else if (type === 'error') {
        status.classList.add('upload-status--error');
    } else if (type === 'warning') {
        status.classList.add('upload-status--warning');
    }
}

function updateBatchFeedback(message, type = 'info') {
    const feedback = document.getElementById('batch-feedback');
    if (!feedback) {
        return;
    }

    feedback.textContent = message || '';
    feedback.className = 'status-message';

    if (!message) {
        feedback.style.display = 'none';
        return;
    }

    feedback.style.display = '';
    if (type === 'success') {
        feedback.classList.add('status-message--success');
    } else if (type === 'error') {
        feedback.classList.add('status-message--error');
    } else if (type === 'warning') {
        feedback.classList.add('status-message--warning');
    }
}

function setActionFeedback(message = '', type = 'info') {
    const feedback = document.getElementById('action-feedback');
    if (!feedback) {
        return;
    }

    feedback.textContent = message || '';
    feedback.className = 'status-message';

    if (!message) {
        feedback.style.display = 'none';
        return;
    }

    feedback.style.display = '';
    if (type === 'success') {
        feedback.classList.add('status-message--success');
    } else if (type === 'error') {
        feedback.classList.add('status-message--error');
    } else if (type === 'warning') {
        feedback.classList.add('status-message--warning');
    }
}

function resetImageAnalysis(clearPreview = false) {
    const analysisResults = document.getElementById('analysis-results');
    const tagContainer = document.getElementById('analysis-tags');
    const textarea = document.getElementById('generated-prompt-text');
    const previewContainer = document.getElementById('preview-container');
    const uploadImg = document.getElementById('uploaded-img');

    if (analysisResults) analysisResults.hidden = true;
    if (tagContainer) tagContainer.innerHTML = '';
    if (textarea) textarea.value = '';
    if (previewContainer && clearPreview) previewContainer.hidden = true;
    if (uploadImg && clearPreview) uploadImg.removeAttribute('src');

    lastImageTags = [];
    lastColorHex = '';
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Could not read file contents.'));
            }
        };
        reader.onerror = () => reject(new Error('Could not read file contents.'));
        reader.readAsDataURL(file);
    });
}

function loadPreviewImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = document.getElementById('uploaded-img');
        const previewContainer = document.getElementById('preview-container');
        const analysisResults = document.getElementById('analysis-results');
        if (!img) {
            reject(new Error('Preview element missing.'));
            return;
        }

        img.onload = () => {
            if (previewContainer) previewContainer.hidden = false;
            if (analysisResults) analysisResults.hidden = true;
            resolve(img);
        };

        img.onerror = () => reject(new Error('We could not display this image. Try a different file.'));
        img.src = dataUrl;
    });
}

async function validateUploadOnServer(file, base64Image) {
    try {
        const response = await fetch('/.netlify/functions/validate-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64Image
            })
        });

        if (!response.ok) {
            throw new Error('Server validation failed. Using local checks.');
        }

        const payload = await response.json();
        if (typeof payload.valid === 'boolean') {
            return payload;
        }

        return { valid: true, warning: true, message: 'Continuing with local validation.' };
    } catch (error) {
        console.warn('Server-side validation unavailable', error);
        return { valid: true, warning: true, message: 'Server validation unavailable. Continuing with local checks.' };
    }
}

async function fetchHFPrompt(imageBase64) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const res = await fetch('https://hf.space/embed/ovi054/image-to-prompt/+/api/predict/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ data: [imageBase64] }),
            mode: 'cors',
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('Network response was not ok');
        const result = await res.json();
        return result.data ? result.data[0] : '';
    } catch (err) {
        console.error('HF API error', err);
        return '';
    }
}

async function analyzeImage(img) {
    const tags = [];
    const tagContainer = document.getElementById('analysis-tags');
    tagContainer.innerHTML = '';

    if (imageCaptioner) {
        try {
            const result = await imageCaptioner(img);
            const caption = result[0].generated_text || '';
            caption.split(/[,\s]+/).forEach(t => { if (t) tags.push(t); });
        } catch (err) {
            console.error('captioning error', err);
        }
    }
    addColorTags(img, tags);
}

function addColorTags(img, tags) {
    let colorHex = '';
    try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        if (color) {
            colorHex = rgbToHex(color[0], color[1], color[2]);
            tags.push(`dominant color ${colorHex}`);
        }
    } catch (err) {
        console.warn('Color extraction failed', err);
    }
    const tagContainer = document.getElementById('analysis-tags');
    tagContainer.innerHTML = '';
    tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        tagContainer.appendChild(span);
    });
    lastImageTags = tags.filter(t => !t.startsWith('dominant color'));
    lastColorHex = colorHex;
    updateGeneratedPrompt();
    const analysisResults = document.getElementById('analysis-results');
    if (analysisResults) {
        analysisResults.hidden = false;
    }
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

async function updateGeneratedPrompt() {
    const textarea = document.getElementById('generated-prompt-text');
    if (!textarea) return;
    const useNatural = document.getElementById('natural-language-toggle')?.checked;
    const customQuestion = document.getElementById('custom-question-input')?.value.trim() || '';
    const base = useNatural
        ? generateNaturalLanguageDescription(lastImageTags, lastColorHex, currentDescriptionMode, customQuestion)
        : generateDetailedPrompt(lastImageTags, lastColorHex, currentDescriptionMode, customQuestion);
    const shouldExpand = !['text-extraction', 'custom-question'].includes(currentDescriptionMode);
    const output = shouldExpand ? await expandPrompt(base, desiredPromptLength) : base;
    textarea.value = output;
}

function generateDetailedPrompt(tags, colorHex, mode = 'describe-detail', customQuestion = '') {
    const subject = tags[0] || 'scene';
    const extras = tags.slice(1).join(', ');
    const style = getRandomWord('styles', 'visual_styles');
    const lighting = getRandomWord('lighting', 'qualities');
    const mood = getRandomWord('moods', 'positive');
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
            prompt += ` --ar ${currentAspectRatio} --stylize 100`;
            break;
        case 'stable-diffusion':
            prompt += `, aspect ratio ${currentAspectRatio}, DSLR sharp focus`;
            break;
        case 'custom-question':
            return customQuestion || `Describe the key elements of ${subject}.`;
        default:
            break;
    }

    return suffix ? `${prompt}${suffix}` : prompt;
}

function generateNaturalLanguageDescription(tags, colorHex, mode = 'describe-detail', customQuestion = '') {
    const primary = tags[0] || 'a scene';
    const extras = tags.slice(1).join(', ');
    let sentence = `The image shows ${primary}`;
    if (extras) sentence += `, ${extras}`;
    if (colorHex) sentence += ` with dominant ${colorHex} tones`;
    sentence += `.`;
    sentence += ` It features ${getRandomWord('lighting', 'qualities')} lighting and evokes a ${getRandomWord('moods', 'positive')} mood.`;

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
            return `${sentence} Provide a Midjourney-ready prompt emphasizing ${currentAspectRatio} composition.`;
        case 'stable-diffusion':
            return `${sentence} Craft a Stable Diffusion prompt mentioning aspect ratio ${currentAspectRatio}.`;
        case 'custom-question':
            return customQuestion || sentence;
        default:
            break;
    }

    return sentence;
}

async function generateBatch(event) {
    const baseField = document.getElementById('batch-base-prompt');
    const count = parseInt(document.getElementById('batch-count').value, 10);
    const type = document.getElementById('variation-type').value;
    const resultsContainer = document.getElementById('batch-results');
    const resultsList = document.getElementById('batch-results-list');
    const emptyState = document.getElementById('batch-results-empty');
    const trigger = event?.currentTarget instanceof HTMLElement ? event.currentTarget : document.getElementById('generate-batch');

    if (!baseField || !resultsContainer || !resultsList || !emptyState) {
        console.warn('Batch generator UI is incomplete.');
        return;
    }

    const base = baseField.value.trim();
    resultsContainer.setAttribute('aria-busy', 'true');
    resultsList.innerHTML = '';
    updateBatchFeedback('');

    if (!base) {
        emptyState.hidden = false;
        resultsContainer.removeAttribute('aria-busy');
        updateBatchFeedback('Add a base prompt to generate variations.', 'error');
        showNotification('Add a base prompt to generate variations.', 'error');
        setButtonLoading(trigger, false);
        return;
    }

    emptyState.hidden = true;
    updateBatchFeedback('Generating variations…', 'info');
    setButtonLoading(trigger, true, 'Generating…');

    const variations = new Set();
    const maxAttempts = count * 6;
    let attempts = 0;

    while (variations.size < count && attempts < maxAttempts) {
        const variation = buildPromptVariation(base, type, variations.size + 1);
        variations.add(variation);
        attempts += 1;
        if (attempts % 5 === 0) {
            await waitForFrame();
        }
    }

    await waitForFrame();

    if (variations.size === 0) {
        updateBatchFeedback('No variations could be generated. Try expanding your base prompt.', 'error');
        resultsContainer.removeAttribute('aria-busy');
        setButtonLoading(trigger, false);
        return;
    }

    const fragment = document.createDocumentFragment();
    variations.forEach(variation => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'batch-item';
        item.textContent = variation;
        item.addEventListener('click', () => {
            setPrompt(variation);
            switchTab('prompt-builder');
        });
        fragment.appendChild(item);
    });

    resultsList.appendChild(fragment);
    resultsContainer.removeAttribute('aria-busy');
    if (typeof resultsContainer.focus === 'function') {
        resultsContainer.focus({ preventScroll: true });
    }

    const difference = count - variations.size;
    if (difference > 0) {
        updateBatchFeedback(`Generated ${variations.size} unique prompt ${variations.size === 1 ? 'variation' : 'variations'}. Some duplicates were filtered out.`, 'warning');
    } else {
        updateBatchFeedback(`Generated ${variations.size} unique prompt ${variations.size === 1 ? 'variation' : 'variations'}.`, 'success');
    }
    showNotification(`Generated ${variations.size} prompt ${variations.size === 1 ? 'variation' : 'variations'}.`, 'success');

    setButtonLoading(trigger, false);
}

function buildPromptVariation(basePrompt, type, index = 1) {
    const trimmedBase = basePrompt.replace(/\s+/g, ' ').trim();
    const styleMovement = getRandomWord('styles', 'art_movements');
    const artisticStyle = getRandomWord('styles', 'artistic_styles');
    const visualStyle = getRandomWord('styles', 'visual_styles');
    const lightingQuality = getRandomWord('lighting', 'qualities');
    const naturalLighting = getRandomWord('lighting', 'natural');
    const compositionAngle = getRandomWord('composition', 'camera_angles');
    const compositionFrame = getRandomWord('composition', 'framing');
    const warmColor = getRandomWord('colors', 'warm');
    const coolColor = getRandomWord('colors', 'cool');
    const moodCategory = index % 2 === 0 ? 'positive' : 'negative';
    const moodWord = getRandomWord('moods', moodCategory);

    const lensDescriptors = [
        'captured with a 35mm lens',
        'macro focus with shallow depth of field',
        'ultra-wide cinematic perspective',
        'telephoto compression for dramatic scale',
        'tilt-shift depth cues'
    ];
    const timeOfDay = ['at golden hour', 'during blue hour', 'beneath neon night lights', 'at dawn', 'under stormy skies'];
    const textureDetails = ['rich texture mapping', 'soft gradient background', 'volumetric lighting', 'high contrast shadows', 'cinematic atmosphere'];
    const detailFinish = ['ultra detailed', 'studio quality', 'hyper realistic finish', 'painterly rendering', 'illustrative detail'];

    const lens = lensDescriptors[Math.floor(Math.random() * lensDescriptors.length)];
    const time = timeOfDay[Math.floor(Math.random() * timeOfDay.length)];
    const texture = textureDetails[Math.floor(Math.random() * textureDetails.length)];
    const finish = detailFinish[Math.floor(Math.random() * detailFinish.length)];

    switch (type) {
        case 'style':
            return `${trimmedBase}, ${artisticStyle} style, ${styleMovement} influence, ${finish}`;
        case 'lighting':
            return `${trimmedBase}, ${lightingQuality} lighting, ${naturalLighting} ambiance, ${time}, ${texture}`;
        case 'composition':
            return `${trimmedBase}, ${compositionAngle} perspective, ${compositionFrame} framing, ${lens}`;
        case 'color':
            return `${trimmedBase}, ${warmColor} and ${coolColor} palette, ${moodWord} mood, color graded for ${finish}`;
        default:
            return `${trimmedBase}, ${visualStyle} aesthetic, ${lightingQuality} lighting, ${compositionAngle} composition, ${warmColor} accents, ${moodWord} mood, ${lens}`;
    }
}

async function expandPrompt(base, minLength) {
    let result = base || '';
    if (textGenerator) {
        const needed = Math.max(0, Math.ceil((minLength - result.length) / 4));
        if (needed > 0) {
            try {
                const gen = await textGenerator(result, { max_new_tokens: needed });
                result = gen[0].generated_text;
            } catch (e) {
                console.error('text generation error', e);
            }
        }
    }
    let guard = 0;
    while (result.length < minLength) {
        result += `, ${getRandomWord('styles', 'visual_styles')} ${getRandomWord('lighting', 'qualities')} lighting`;
        guard += 1;
        if (guard % 3 === 0) {
            await waitForFrame();
        }
    }
    return result;
}

function debounceOptimize() {
    clearTimeout(optimizeTimer);
    optimizeTimer = setTimeout(() => {
        if (magicEnhanceEnabled) {
            optimizePrompt();
        }
    }, 600);
}

async function optimizePrompt() {
    const textarea = document.getElementById('prompt-textarea');
    if (!textarea) return;
    const base = textarea.value.trim();
    if (!base) return;
    const optimized = await expandPrompt(base, desiredPromptLength);
    textarea.value = optimized;
    currentPrompt = optimized;
    updatePromptPreview();
    updateWordCount();
    updateQualityScore();
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        const isActive = tab.dataset.tab === tabName;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        const isActive = content.id === `${tabName}-tab`;
        content.classList.toggle('active', isActive);
        content.toggleAttribute('hidden', !isActive);
    });

    loadDeferredEmbeds(tabName);
}

// Theme system
function applyTheme(themeName) {
    if (!themeName) {
        return;
    }

    currentTheme = themeName;
    document.body.setAttribute('data-theme', themeName);

    if (themes[themeName]) {
        document.documentElement.style.setProperty('--theme-primary', themes[themeName].primary);
        document.documentElement.style.setProperty('--theme-background', themes[themeName].background);
    }

    updateThemeUI();
    saveToStorage();
}

// Action functions
function copyTextToClipboard(text) {
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

function copyToClipboard() {
    if (!currentPrompt || !currentPrompt.trim()) {
        setActionFeedback('Enter or generate a prompt before copying.', 'error');
        return;
    }

    copyTextToClipboard(currentPrompt)
        .then(() => {
            setActionFeedback('Prompt copied to clipboard.', 'success');
            showNotification('Prompt copied to clipboard!', 'success');
        })
        .catch(() => {
            setActionFeedback('Unable to copy automatically. Please copy manually.', 'warning');
        });
}

function clearPrompt() {
    setPrompt('');
}

function savePrompt() {
    if (!currentPrompt || !currentPrompt.trim()) {
        setActionFeedback('Add some prompt text before saving.', 'error');
        return;
    }
    const modal = document.getElementById('save-modal');
    if (!modal) return;

    const nameInput = document.getElementById('prompt-name');
    const descriptionInput = document.getElementById('prompt-description');
    const tagsInput = document.getElementById('prompt-tags');

    const defaultName = currentPrompt.split(/\s+/).slice(0, 6).join(' ');
    if (nameInput) {
        nameInput.value = defaultName ? defaultName : `Prompt ${savedPrompts.length + 1}`;
    }
    if (descriptionInput) {
        descriptionInput.value = '';
    }
    if (tagsInput) {
        tagsInput.value = '';
    }

    openModalElement(modal);
    if (nameInput) {
        requestAnimationFrame(() => nameInput.focus());
    }
}

function confirmSavePrompt() {
    if (!currentPrompt || !currentPrompt.trim()) {
        setActionFeedback('Add some prompt text before saving.', 'error');
        return;
    }

    const nameInput = document.getElementById('prompt-name');
    const descriptionInput = document.getElementById('prompt-description');
    const tagsInput = document.getElementById('prompt-tags');
    const modal = document.getElementById('save-modal');

    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : `Prompt ${savedPrompts.length + 1}`;
    const description = descriptionInput ? descriptionInput.value.trim() : '';
    const tags = tagsInput && tagsInput.value
        ? tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

    const savedPrompt = {
        name,
        description,
        tags,
        prompt: currentPrompt,
        platform: currentPlatform,
        timestamp: Date.now()
    };

    savedPrompts.unshift(savedPrompt);
    if (savedPrompts.length > 50) {
        savedPrompts = savedPrompts.slice(0, 50);
    }

    saveToStorage();
    updateSavedPromptsDisplay();
    showNotification('Prompt saved successfully!', 'success');
    setActionFeedback('Prompt saved to your library.', 'success');

    if (modal) {
        closeModalElement(modal);
    }
}

function addToHistory(prompt) {
    const historyItem = {
        prompt: prompt,
        timestamp: Date.now(),
        platform: currentPlatform
    };

    promptHistory.unshift(historyItem);
    if (promptHistory.length > 20) {
        promptHistory = promptHistory.slice(0, 20);
    }

    saveToStorage();
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyContainer = document.getElementById('prompt-history');
    if (!historyContainer) return;

    historyContainer.innerHTML = '';

    if (!promptHistory.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-state';
        empty.textContent = 'Generated prompts will appear here.';
        historyContainer.appendChild(empty);
        return;
    }

    promptHistory.slice(0, 5).forEach(item => {
        const card = document.createElement('article');
        card.className = 'prompt-card';

        const meta = document.createElement('div');
        meta.className = 'prompt-card__meta';
        const time = document.createElement('span');
        time.textContent = formatTimestamp(item.timestamp);
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
            setPrompt(item.prompt).then(() => switchTab('prompt-builder'));
        });

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn--sm btn--outline';
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', () => {
            copyTextToClipboard(item.prompt)
                .then(() => showNotification('Prompt copied to clipboard!', 'success'))
                .catch(() => showNotification('Unable to copy automatically. Please copy manually.', 'warning'));
        });

        actions.append(useBtn, copyBtn);
        card.append(meta, text, actions);
        historyContainer.appendChild(card);
    });
}

function updateSavedPromptsDisplay() {
    const savedContainer = document.getElementById('saved-prompts');
    if (!savedContainer) return;

    savedContainer.innerHTML = '';

    if (!savedPrompts.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-state';
        empty.textContent = 'Save prompts to build your personal library.';
        savedContainer.appendChild(empty);
        return;
    }

    savedPrompts.slice(0, 5).forEach(item => {
        const card = document.createElement('article');
        card.className = 'saved-prompt';

        const meta = document.createElement('div');
        meta.className = 'saved-prompt__meta';
        const name = document.createElement('span');
        name.textContent = item.name || 'Untitled Prompt';
        const timestamp = document.createElement('span');
        timestamp.textContent = formatTimestamp(item.timestamp);
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
            setPrompt(item.prompt).then(() => switchTab('prompt-builder'));
        });

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn--sm btn--outline';
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', () => {
            copyTextToClipboard(item.prompt)
                .then(() => showNotification('Prompt copied to clipboard!', 'success'))
                .catch(() => showNotification('Unable to copy automatically. Please copy manually.', 'warning'));
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
            item.tags.forEach(tag => {
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

// Utility functions
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
}

function setButtonLoading(button, isLoading, label = 'Loading…') {
    if (!button) return;
    if (isLoading) {
        if (!button.dataset.originalContent) {
            button.dataset.originalContent = button.innerHTML;
        }
        button.classList.add('is-loading');
        button.setAttribute('aria-busy', 'true');
        button.disabled = true;
        button.innerHTML = `<span class="btn__spinner"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>${label}</span></span>`;
    } else {
        button.classList.remove('is-loading');
        button.removeAttribute('aria-busy');
        button.disabled = false;
        if (button.dataset.originalContent) {
            button.innerHTML = button.dataset.originalContent;
            delete button.dataset.originalContent;
        }
    }
}

function setLoadingOverlay(isVisible, message = 'Processing your request...') {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    const text = overlay.querySelector('p');
    if (text && message) {
        text.textContent = message;
    }
    overlay.classList.toggle('hidden', !isVisible);
    overlay.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
    overlay.setAttribute('aria-busy', isVisible ? 'true' : 'false');
}

function updateFooterYear() {
    const yearElement = document.getElementById('footer-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function showNotification(message, type = 'info') {
    if (!message) {
        return;
    }

    let toast = document.querySelector('.app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.dataset.type = type;
    toast.classList.add('is-visible');

    clearTimeout(notificationTimer);
    notificationTimer = window.setTimeout(() => {
        toast.classList.remove('is-visible');
        notificationTimer = window.setTimeout(() => {
            if (toast && toast.parentNode && !toast.classList.contains('is-visible')) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3200);
}

function waitForFrame() {
    return new Promise(resolve => {
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => resolve());
        } else {
            setTimeout(resolve, 0);
        }
    });
}

// Storage functions
function saveToStorage() {
    const data = {
        currentPlatform,
        currentTheme,
        currentLanguage,
        promptHistory,
        savedPrompts
    };

    try {
        localStorage.setItem('aiPromptGenerator', JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

function loadFromStorage() {
    try {
        const stored = localStorage.getItem('aiPromptGenerator');
        if (!stored) {
            return false;
        }

        const data = JSON.parse(stored);
        currentPlatform = data.currentPlatform || 'natural_language';
        currentTheme = data.currentTheme || 'cyberpunk_neon';
        currentLanguage = data.currentLanguage || 'en';
        promptHistory = data.promptHistory || [];
        savedPrompts = data.savedPrompts || [];

        const platformSelect = document.getElementById('platform-select');
    if (platformSelect) platformSelect.value = currentPlatform;

    updateHistoryDisplay();
        updateSavedPromptsDisplay();
        return true;
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
        return false;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

console.log('🎉 AI Prompt Generator v2.0 Ready!');
