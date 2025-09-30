// AI Prompt Generator v2.0 - Working Version for Netlify
console.log('🚀 AI Prompt Generator v2.0 Starting...');

// Global state
const DEFAULT_THEME = 'dark_professional';
let currentPlatform = 'natural_language';
let currentTheme = DEFAULT_THEME;
let currentPrompt = '';
let promptHistory = [];
let savedPrompts = [];
let desiredPromptLength = 300;
let currentAspectRatio = '1:1';
let currentDescriptionMode = 'describe-detail';
let magicEnhanceEnabled = false;
let optimizeTimer = null;
const deferredTabCache = new Set();

const DISCLOSURE_BREAKPOINTS = { sm: 480, md: 768, lg: 1024 };
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])';
let lastFocusedElement = null;
let activeModal = null;
let activeDrawer = null;
let disclosureResizeTimer = null;
let notificationTimer = null;


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

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing app...');
    initializeApp();
    setupResponsiveEnhancements();
});

function initializeApp() {
    console.log('🎯 Initializing AI Prompt Generator...');

    // Load saved data and apply default theme
    loadFromStorage();
    applyTheme(currentTheme || DEFAULT_THEME);


    // Load shared prompt from URL if present
    const sharedPrompt = new URLSearchParams(window.location.search).get('prompt');
    if (sharedPrompt) {
        setPrompt(sharedPrompt);
    }

    // Setup event listeners
    setupEventListeners();

    // Initialize UI
    initializeWordBank();
    updatePromptPreview();
    updateQualityScore();
    updatePlatformBadge();
    updateActionStates();
    updateFooterYear();

    console.log('🚀 App initialized successfully!');
}

function setupResponsiveEnhancements() {
    setupDrawer();
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

    const naturalToggle = document.getElementById('natural-language-toggle');
    if (naturalToggle) {
        naturalToggle.addEventListener('change', () => {
            updateStatusMessage('describe-ai-status', '');
        });
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
            updateStatusMessage('describe-ai-status', '');
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
                updateStatusMessage('describe-ai-status', '');
            }
        });
    }

    const descriptionInput = document.getElementById('image-description-input');
    if (descriptionInput) {
        descriptionInput.addEventListener('input', () => {
            updateStatusMessage('describe-ai-status', '');
            syncGenerateButtonState();
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

    const describeAiBtn = document.getElementById('describe-image-ai');
    if (describeAiBtn) {
        describeAiBtn.addEventListener('click', describeImageWithGemini);
    }

    const generateAiBtn = document.getElementById('generate-ai-variations');
    if (generateAiBtn) {
        generateAiBtn.addEventListener('click', generatePromptVariations);
    }

    const aiVariationsList = document.getElementById('ai-variations-list');
    if (aiVariationsList) {
        aiVariationsList.addEventListener('click', handleVariationAction);
    }

    const generatedPromptTextarea = document.getElementById('generated-prompt-text');
    if (generatedPromptTextarea) {
        generatedPromptTextarea.addEventListener('input', syncGenerateButtonState);
    }

    syncGenerateButtonState();

    // Listen for messages from the Hugging Face iframe
    window.addEventListener('message', function(e) {
        if (e.origin === 'https://huggingface.co' && typeof e.data === 'string') {
            const incoming = e.data.trim();
            if (incoming) {
                const descriptionInput = document.getElementById('image-description-input');
                if (descriptionInput) {
                    descriptionInput.value = incoming;
                    descriptionInput.dispatchEvent(new Event('input'));
                }
            }
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

function updateStatusMessage(elementId, message = '', type = 'info') {
    const el = document.getElementById(elementId);
    if (!el) {
        return;
    }

    el.textContent = message || '';
    el.className = 'status-message';

    if (!message) {
        el.style.display = 'none';
        return;
    }

    el.style.display = '';
    if (type === 'success') {
        el.classList.add('status-message--success');
    } else if (type === 'error') {
        el.classList.add('status-message--error');
    } else if (type === 'warning') {
        el.classList.add('status-message--warning');
    }
}

function clearAIVariations() {
    const container = document.getElementById('ai-variations');
    const list = document.getElementById('ai-variations-list');
    if (list) {
        list.innerHTML = '';
    }
    if (container) {
        container.hidden = true;
    }
}

function renderAIVariations(variations = []) {
    const container = document.getElementById('ai-variations');
    const list = document.getElementById('ai-variations-list');
    clearAIVariations();

    if (!container || !list || !Array.isArray(variations) || variations.length === 0) {
        return;
    }

    const fragment = document.createDocumentFragment();

    variations.forEach((variation, index) => {
        const prompt = (variation?.prompt || '').trim();
        if (!prompt) {
            return;
        }

        const card = document.createElement('article');
        card.className = 'ai-variation';
        card.dataset.prompt = prompt;

        const title = document.createElement('h5');
        title.className = 'ai-variation__title';
        title.textContent = variation?.title || `Variation ${index + 1}`;
        card.appendChild(title);

        const body = document.createElement('p');
        body.className = 'ai-variation__body';
        body.textContent = prompt;
        card.appendChild(body);

        const actions = document.createElement('div');
        actions.className = 'ai-variation__actions';

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn--outline';
        copyBtn.dataset.action = 'copy';
        copyBtn.textContent = 'Copy';
        actions.appendChild(copyBtn);

        const useBtn = document.createElement('button');
        useBtn.type = 'button';
        useBtn.className = 'btn btn--primary';
        useBtn.dataset.action = 'use';
        useBtn.textContent = 'Use in Builder';
        actions.appendChild(useBtn);

        card.appendChild(actions);
        fragment.appendChild(card);
    });

    if (!fragment.childNodes.length) {
        return;
    }

    list.appendChild(fragment);
    container.hidden = false;
}

function syncGenerateButtonState() {
    const generateBtn = document.getElementById('generate-ai-variations');
    if (generateBtn) {
        const generatedPrompt = document.getElementById('generated-prompt-text')?.value.trim();
        const manualPrompt = document.getElementById('prompt-textarea')?.value.trim();
        generateBtn.disabled = !(generatedPrompt || manualPrompt);
    }

    const describeBtn = document.getElementById('describe-image-ai');
    if (describeBtn) {
        const sourceText = document.getElementById('image-description-input')?.value.trim();
        describeBtn.disabled = !sourceText;
    }
}

async function callGeminiEndpoint(payload) {
    const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    let data;
    try {
        data = await response.json();
    } catch (error) {
        if (!response.ok) {
            throw new Error(`Gemini proxy error (${response.status}).`);
        }
        throw new Error('Unexpected response from Gemini proxy.');
    }

    if (!response.ok) {
        throw new Error(data?.message || `Gemini proxy error (${response.status}).`);
    }

    if (data?.success !== true) {
        throw new Error(data?.message || 'Gemini proxy returned an error.');
    }

    return data.data || {};
}

function getDescriptionPreferences() {
    const naturalToggle = document.getElementById('natural-language-toggle');
    const naturalLanguage = naturalToggle ? naturalToggle.checked : true;
    const customInput = document.getElementById('custom-question-input');
    const customQuestion = customInput ? customInput.value.trim() : '';
    if (currentDescriptionMode === 'custom-question' && !customQuestion) {
        throw new Error('Add a custom question before enhancing the description.');
    }
    return { naturalLanguage, customQuestion };
}

async function describeImageWithGemini() {
    const describeBtn = document.getElementById('describe-image-ai');
    if (!describeBtn) {
        return;
    }

    const sourceInput = document.getElementById('image-description-input');
    const sourceText = sourceInput?.value.trim() || '';

    if (!sourceText) {
        updateStatusMessage('describe-ai-status', 'Paste an image description first.', 'error');
        return;
    }

    let prefs;
    try {
        prefs = getDescriptionPreferences();
    } catch (error) {
        updateStatusMessage('describe-ai-status', error.message, 'error');
        return;
    }

    setButtonLoading(describeBtn, true, 'Enhancing...');
    updateStatusMessage('describe-ai-status', 'Enhancing description with Gemini...', 'info');

    try {
        const result = await callGeminiEndpoint({
            mode: 'refine-description',
            source: sourceText,
            descriptionMode: currentDescriptionMode,
            naturalLanguage: prefs.naturalLanguage,
            customQuestion: prefs.customQuestion,
            aspectRatio: currentAspectRatio
        });

        const description = (result?.description || result?.text || '').trim();
        if (!description) {
            throw new Error('Gemini did not return a description.');
        }

        const textarea = document.getElementById('generated-prompt-text');
        if (textarea) {
            textarea.value = description;
        }

        updateStatusMessage('describe-ai-status', 'Description generated.', 'success');
        clearAIVariations();
        syncGenerateButtonState();
    } catch (error) {
        console.error('Gemini describe error', error);
        updateStatusMessage(
            'describe-ai-status',
            error.message || 'Unable to enhance the description right now.',
            'error'
        );
    } finally {
        setButtonLoading(describeBtn, false);
    }
}

async function generatePromptVariations() {
    const generateBtn = document.getElementById('generate-ai-variations');
    if (!generateBtn) {
        return;
    }

    const generatedText = document.getElementById('generated-prompt-text')?.value.trim();
    const manualText = document.getElementById('prompt-textarea')?.value.trim();
    const basePrompt = generatedText || manualText || '';

    if (!basePrompt) {
        updateStatusMessage('ai-generate-status', 'Add a prompt before generating variations.', 'error');
        return;
    }

    setButtonLoading(generateBtn, true, 'Generating...');
    updateStatusMessage('ai-generate-status', 'Crafting variations with Gemini...', 'info');
    clearAIVariations();

    try {
        const data = await callGeminiEndpoint({
            mode: 'prompt-variations',
            prompt: basePrompt,
            platform: currentPlatform,
            platformLabel: platformData[currentPlatform]?.name || currentPlatform,
            aspectRatio: currentAspectRatio,
            desiredLength: desiredPromptLength,
            magicEnhance: magicEnhanceEnabled,
            naturalLanguage: document.getElementById('natural-language-toggle')?.checked === true
        });

        const variations = Array.isArray(data?.variations) ? data.variations : [];
        if (!variations.length) {
            updateStatusMessage('ai-generate-status', 'Gemini did not return any variations.', 'warning');
            return;
        }

        renderAIVariations(variations);
        updateStatusMessage('ai-generate-status', `Generated ${variations.length} variation${variations.length === 1 ? '' : 's'}.`, 'success');
    } catch (error) {
        console.error('Gemini variation error', error);
        updateStatusMessage('ai-generate-status', error.message || 'Unable to generate variations right now.', 'error');
    } finally {
        setButtonLoading(generateBtn, false);
        syncGenerateButtonState();
    }
}

async function handleVariationAction(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) {
        return;
    }

    const card = button.closest('.ai-variation');
    if (!card) {
        return;
    }

    const prompt = (card.dataset.prompt || '').trim();
    if (!prompt) {
        showNotification('Prompt unavailable for this variation.', 'error');
        return;
    }

    const action = button.dataset.action;

    if (action === 'copy') {
        const originalLabel = button.textContent;
        try {
            await copyTextToClipboard(prompt);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalLabel;
            }, 1500);
            showNotification('Prompt copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy variation error', error);
            showNotification('Unable to copy automatically. Please copy manually.', 'warning');
        }
        return;
    }

    if (action === 'use') {
        await setPrompt(prompt);
        switchTab('prompt-builder');
        showNotification('Variation loaded into the builder.', 'success');
    }
}


async function expandPrompt(base, minLength) {
    let result = base || '';
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
    const theme = themeName || DEFAULT_THEME;
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
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
        currentTheme = data.currentTheme || DEFAULT_THEME;
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

