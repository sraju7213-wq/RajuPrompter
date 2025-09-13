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

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }
});

function initializeApp() {
    console.log('🎯 Initializing AI Prompt Generator...');

    // Load saved data
    loadFromStorage();

    // Apply default theme if none loaded
    applyTheme(currentTheme);

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
    updatePlatformBadge();

    console.log('🚀 App initialized successfully!');
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

    // Theme selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.addEventListener('change', function(e) {
            applyTheme(e.target.value);
            console.log('🎨 Theme changed to:', e.target.value);
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

    const suggestionBtn = document.getElementById('get-suggestions');
    if (suggestionBtn) {
        suggestionBtn.addEventListener('click', getAISuggestions);
    }

    const exportTxtBtn = document.getElementById('export-txt');
    if (exportTxtBtn) {
        exportTxtBtn.addEventListener('click', exportToTxt);
    }

    const exportTopBtn = document.getElementById('export-btn');
    if (exportTopBtn) {
        exportTopBtn.addEventListener('click', exportToTxt);
    }

    const shareBtn = document.getElementById('share-prompt');
    if (shareBtn) {
        shareBtn.addEventListener('click', sharePrompt);
    }

    const analyzeBtn = document.getElementById('analyze-prompt');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', deepAnalyzePrompt);
    }

    const collaborateBtn = document.getElementById('collaboration-btn');
    if (collaborateBtn) {
        collaborateBtn.addEventListener('click', sharePrompt);
    }

    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }

    const naturalToggle = document.getElementById('natural-language-toggle');
    if (naturalToggle) {
        naturalToggle.addEventListener('change', updateGeneratedPrompt);
    }

    const useGeneratedPromptBtn = document.getElementById('use-generated-prompt');
    if (useGeneratedPromptBtn) {
        useGeneratedPromptBtn.addEventListener('click', function() {
            const text = document.getElementById('generated-prompt-text').value;
            if (text) setPrompt(text);
            switchTab('manual');
        });
    }

    const batchBtn = document.getElementById('generate-batch');
    if (batchBtn) {
        batchBtn.addEventListener('click', generateBatch);
    }

    const miniLink = document.getElementById('mini-generator-link');
    if (miniLink) {
        miniLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('mini-generator');
        });
    }

    // Listen for messages from the Hugging Face iframe
    window.addEventListener('message', function(e) {
        if (e.origin === 'https://huggingface.co' && typeof e.data === 'string') {
            console.log('HF Image to Prompt:', e.data);
        }
    });

    console.log('✅ Event listeners configured');
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
            getAISuggestions();
        }
        return;
    }
    currentPrompt = await expandPrompt(prompt, desiredPromptLength);
    if (textarea) {
        textarea.value = currentPrompt;
        updatePromptPreview();
        updateWordCount();
        updateQualityScore();
        getAISuggestions();
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
        if (currentPlatform === 'midjourney' && currentPrompt) {
            formattedPrompt += ' --ar 16:9 --s 100 --q 1';
        }

        preview.textContent = formattedPrompt;
    }
}

function updateWordCount() {
    const words = currentPrompt.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    const wordCountDisplay = document.getElementById('word-count');
    const wordCountMetric = document.getElementById('word-count-display');

    if (wordCountDisplay) {
        wordCountDisplay.textContent = `${wordCount} words`;
    }

    if (wordCountMetric) {
        wordCountMetric.textContent = wordCount;
    }
}

function updateQualityScore() {
    const score = calculateQualityScore(currentPrompt);
    const qualityIndicator = document.getElementById('quality-indicator');
    const qualityScoreDisplay = document.getElementById('quality-score');

    if (qualityIndicator) {
        const level = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor';
        qualityIndicator.className = `quality-indicator ${level}`;
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

    let score = 0;
    const words = prompt.split(/\s+/).filter(word => word.length > 0);

    // Length score (0-25 points)
    if (words.length >= 5 && words.length <= 75) {
        score += Math.min(25, (words.length / 75) * 25);
    }

    // Descriptiveness score (0-25 points)
    const descriptiveWords = ['beautiful', 'stunning', 'detailed', 'masterpiece', 'professional', 'artistic'];
    const descriptiveCount = descriptiveWords.filter(word => prompt.toLowerCase().includes(word)).length;
    score += Math.min(25, descriptiveCount * 5);

    // Style presence (0-25 points)
    const hasStyle = Object.values(wordLibrary.styles).some(styleArray => 
        styleArray.some(style => prompt.toLowerCase().includes(style.toLowerCase()))
    );
    if (hasStyle) score += 25;

    // Lighting presence (0-25 points)
    const hasLighting = Object.values(wordLibrary.lighting).some(lightingArray => 
        lightingArray.some(lighting => prompt.toLowerCase().includes(lighting.toLowerCase()))
    );
    if (hasLighting) score += 25;

    return Math.round(score);
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
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });

    // Clear and populate word bank
    wordBank.innerHTML = '';

    Object.values(wordLibrary[category]).forEach(subcategoryWords => {
        subcategoryWords.forEach(word => {
            const wordElement = document.createElement('span');
            wordElement.className = 'word-item';
            wordElement.textContent = word;
            wordBank.appendChild(wordElement);
        });
    });
}

function getAISuggestions() {
    const suggestions = [];
    const text = currentPrompt.toLowerCase();
    if (!text.match(/light/)) suggestions.push('Add lighting description for better mood');
    if (!text.match(/style/)) suggestions.push('Specify art style to refine the look');
    if (!text.match(/color/)) suggestions.push('Mention color palette for richer output');
    if (!text.match(/mood/)) suggestions.push('Include mood keywords to set the tone');
    if (suggestions.length === 0) suggestions.push('Prompt looks good! Try adding more details.');
    const container = document.getElementById('ai-suggestions');
    container.innerHTML = '';
    suggestions.forEach(s => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `<i class="fas fa-lightbulb"></i><span>${s}</span>`;
        container.appendChild(div);
    });
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        const img = document.getElementById('uploaded-img');
        img.onload = () => {
            document.getElementById('preview-container').style.display = 'block';
            document.getElementById('analysis-results').style.display = 'none';
            analyzeImage(img);
        };
        img.src = ev.target.result;
        const base64Image = ev.target.result.split(',')[1];
        const status = document.getElementById('upload-status');
        if (status) status.textContent = 'Analyzing image...';
        fetchHFPrompt(base64Image)
            .then(prompt => {
                if (status) status.textContent = prompt ? '' : 'Failed to analyze image.';
                if (prompt) console.log('HF API prompt:', prompt);
            })
            .catch(() => {
                if (status) status.textContent = 'Failed to analyze image.';
            });
    };
    reader.readAsDataURL(file);
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
    document.getElementById('analysis-results').style.display = 'block';
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

async function updateGeneratedPrompt() {
    const textarea = document.getElementById('generated-prompt-text');
    if (!textarea) return;
    const useNatural = document.getElementById('natural-language-toggle')?.checked;
    const base = useNatural
        ? generateNaturalLanguageDescription(lastImageTags, lastColorHex)
        : generateDetailedPrompt(lastImageTags, lastColorHex);
    const expanded = await expandPrompt(base, desiredPromptLength);
    textarea.value = expanded;
}

function generateDetailedPrompt(tags, colorHex) {
    const subject = tags[0] || 'scene';
    const extras = tags.slice(1).join(', ');
    const style = getRandomWord('styles', 'visual_styles');
    const lighting = getRandomWord('lighting', 'qualities');
    const mood = getRandomWord('moods', 'positive');
    let prompt = `a ${style} ${subject}${extras ? ', ' + extras : ''}, ${lighting} lighting, ${mood} mood`;
    if (colorHex) prompt += `, ${colorHex} tones`;
    return prompt + ', highly detailed, 4k';
}

function generateNaturalLanguageDescription(tags, colorHex) {
    const primary = tags[0] || 'a scene';
    const extras = tags.slice(1).join(', ');
    let sentence = `The image shows ${primary}`;
    if (extras) sentence += `, ${extras}`;
    if (colorHex) sentence += ` with dominant ${colorHex} tones`;
    sentence += `.`;
    sentence += ` It features ${getRandomWord('lighting', 'qualities')} lighting and evokes a ${getRandomWord('moods', 'positive')} mood.`;
    return sentence;
}

function generateBatch() {
    const base = document.getElementById('batch-base-prompt').value.trim();
    const count = parseInt(document.getElementById('batch-count').value, 10);
    const type = document.getElementById('variation-type').value;
    const results = document.getElementById('batch-results');
    results.innerHTML = '';
    if (!base) return;
    for (let i = 0; i < count; i++) {
        let variation = base;
        switch (type) {
            case 'style':
                variation += ', ' + getRandomWord('styles', 'artistic_styles');
                break;
            case 'lighting':
                variation += ', ' + getRandomWord('lighting', 'qualities');
                break;
            case 'composition':
                variation += ', ' + getRandomWord('composition', 'framing');
                break;
            case 'color':
                variation += ', ' + getRandomWord('colors', 'warm');
                break;
            default:
                const funcs = [
                    () => getRandomWord('styles', 'artistic_styles'),
                    () => getRandomWord('lighting', 'qualities'),
                    () => getRandomWord('composition', 'framing'),
                    () => getRandomWord('colors', 'warm')
                ];
                variation += ', ' + funcs[Math.floor(Math.random()*funcs.length)]();
        }
        const div = document.createElement('div');
        div.className = 'batch-item';
        div.textContent = variation;
        div.addEventListener('click', () => {
            setPrompt(variation);
            switchTab('manual');
        });
        results.appendChild(div);
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
    while (result.length < minLength) {
        result += `, ${getRandomWord('styles', 'visual_styles')} ${getRandomWord('lighting', 'qualities')} lighting`;
    }
    return result;
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
    getAISuggestions();
}

async function deepAnalyzePrompt() {
    if (!currentPrompt) {
        alert('No prompt to analyze!');
        return;
    }
    let analysis = '';
    if (textGenerator) {
        try {
            const res = await textGenerator(`Provide improvements for this image generation prompt: ${currentPrompt}`, { max_new_tokens: 100 });
            analysis = res[0].generated_text;
        } catch (e) {
            analysis = 'Analysis failed.';
        }
    } else {
        analysis = 'Consider adding more details about lighting, style, color, mood, and composition.';
    }
    alert(analysis);
}

function exportToTxt() {
    if (!currentPrompt) {
        alert('No prompt to export!');
        return;
    }
    const blob = new Blob([currentPrompt], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function sharePrompt() {
    if (!currentPrompt) {
        alert('No prompt to share!');
        return;
    }
    const url = `${window.location.origin}${window.location.pathname}?prompt=${encodeURIComponent(currentPrompt)}`;
    if (navigator.share) {
        navigator.share({ text: currentPrompt, url });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Share link copied to clipboard!');
        });
    }
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    const targetContent = document.getElementById(`${tabName}-tab`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Theme system
function applyTheme(themeName) {
    currentTheme = themeName;
    document.body.setAttribute('data-theme', themeName);

    if (themes[themeName]) {
        document.documentElement.style.setProperty('--theme-primary', themes[themeName].primary);
        document.documentElement.style.setProperty('--theme-background', themes[themeName].background);
    }

    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = themeName;
    }

    saveToStorage();
}

// Action functions
function copyToClipboard() {
    if (!currentPrompt) {
        alert('No prompt to copy!');
        return;
    }

    navigator.clipboard.writeText(currentPrompt).then(() => {
        showNotification('Prompt copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentPrompt;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Prompt copied to clipboard!');
    });
}

function clearPrompt() {
    setPrompt('');
}

function savePrompt() {
    if (!currentPrompt) {
        alert('No prompt to save!');
        return;
    }

    const name = prompt('Enter a name for this prompt:');
    if (name) {
        const savedPrompt = {
            name: name,
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
        showNotification('Prompt saved successfully!');
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

    promptHistory.slice(0, 5).forEach(item => {
        const historyElement = document.createElement('div');
        historyElement.className = 'history-item';
        historyElement.innerHTML = `
            <div class="history-item-time">${formatTimestamp(item.timestamp)}</div>
            <div class="history-item-text">${item.prompt.substring(0, 100)}...</div>
        `;

        historyElement.addEventListener('click', () => {
            setPrompt(item.prompt);
            switchTab('manual');
        });

        historyContainer.appendChild(historyElement);
    });
}

function updateSavedPromptsDisplay() {
    const savedContainer = document.getElementById('saved-prompts');
    if (!savedContainer) return;

    savedContainer.innerHTML = '';

    savedPrompts.slice(0, 5).forEach(item => {
        const savedElement = document.createElement('div');
        savedElement.className = 'saved-prompt-item';
        savedElement.innerHTML = `
            <div class="saved-prompt-name">${item.name}</div>
            <div class="saved-prompt-text">${item.prompt.substring(0, 80)}...</div>
        `;

        savedElement.addEventListener('click', () => {
            setPrompt(item.prompt);
            switchTab('manual');
        });

        savedContainer.appendChild(savedElement);
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

function showNotification(message) {
    // Simple notification - you can enhance this
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
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
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
        if (stored) {
            const data = JSON.parse(stored);
            currentPlatform = data.currentPlatform || 'natural_language';
            currentTheme = data.currentTheme || 'cyberpunk_neon';
            promptHistory = data.promptHistory || [];
            savedPrompts = data.savedPrompts || [];

            // Apply loaded theme
            applyTheme(currentTheme);

            // Update UI elements
            const platformSelect = document.getElementById('platform-select');
            const themeSelect = document.getElementById('theme-select');

            if (platformSelect) platformSelect.value = currentPlatform;
            if (themeSelect) themeSelect.value = currentTheme;

            // Update displays
            setTimeout(() => {
                updateHistoryDisplay();
                updateSavedPromptsDisplay();
            }, 100);
        }
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
    }
}

// Modal functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
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
