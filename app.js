// Application State
const state = {
    currentPlatform: 'midjourney',
    currentTheme: 'dark',
    wordLibrary: [],
    templates: [],
    rules: [],
    history: [],
    favorites: [],
    suggestions: [],
    currentImage: null,
    imageAnalysis: null,
    generatedPrompts: [],
    selectedPrompt: null
};

// Platform configurations
const platforms = {
    midjourney: {
        name: "Midjourney",
        parameters: ["--ar", "--s", "--q", "--niji", "--chaos"],
        optimization: "cinematic, artistic, trending on artstation",
        prefix: "",
        suffix: ""
    },
    stable_diffusion: {
        name: "Stable Diffusion", 
        parameters: ["(keyword:weight)", "((emphasis))", "[de-emphasis]"],
        optimization: "masterpiece, best quality, ultra detailed",
        prefix: "",
        suffix: ""
    },
    flux_ai: {
        name: "Flux AI",
        parameters: ["realistic", "photographic", "natural"],
        optimization: "photorealistic, professional photography",
        prefix: "",
        suffix: ""
    },
    dalle: {
        name: "DALL-E",
        parameters: ["natural language", "descriptive"],
        optimization: "detailed description, clear subject",
        prefix: "",
        suffix: ""
    },
    natural: {
        name: "Natural Language",
        parameters: ["simple", "descriptive", "clear"],
        optimization: "plain English, descriptive",
        prefix: "",
        suffix: ""
    }
};

// Theme configurations
const themes = {
    dark: { name: "Dark Mode", colors: { primary: "#0a0a0a", secondary: "#141414", accent: "#6366f1", text: "#ffffff" }},
    light: { name: "Light Mode", colors: { primary: "#ffffff", secondary: "#f8f9fa", accent: "#2563eb", text: "#1f2937" }},
    cyberpunk: { name: "Cyberpunk", colors: { primary: "#0d1117", secondary: "#161b22", accent: "#00d9ff", text: "#00ff9f" }},
    sunset: { name: "Sunset", colors: { primary: "#1a1a2e", secondary: "#16213e", accent: "#ff6b35", text: "#ffd23f" }},
    nature: { name: "Nature", colors: { primary: "#2d3436", secondary: "#636e72", accent: "#00b894", text: "#ddd" }},
    minimalist: { name: "Minimalist", colors: { primary: "#f8f9fa", secondary: "#e9ecef", accent: "#6c757d", text: "#212529" }}
};

// Random word sets for generators
const randomSets = {
    portrait: {
        subjects: ["elegant woman", "wise old man", "young artist", "mysterious figure", "confident entrepreneur", "ethereal beauty", "rugged adventurer"],
        expressions: ["serene smile", "intense gaze", "thoughtful expression", "mysterious look", "confident stare", "gentle eyes", "dramatic lighting"],
        styles: ["renaissance painting", "modern photography", "oil painting", "watercolor", "digital art", "black and white", "vintage portrait"],
        lighting: ["golden hour", "studio lighting", "dramatic shadows", "soft natural light", "rim lighting", "candlelight", "neon glow"]
    },
    nature: {
        landscapes: ["misty mountain", "serene lake", "ancient forest", "rolling hills", "dramatic coastline", "desert sunset", "snow-capped peaks"],
        weather: ["golden sunrise", "stormy sky", "gentle rainfall", "morning mist", "rainbow after storm", "dramatic clouds", "peaceful evening"],
        elements: ["wildflowers", "rushing waterfall", "ancient trees", "crystal clear water", "rocky cliffs", "meadow grass", "forest path"],
        moods: ["peaceful", "majestic", "mysterious", "vibrant", "serene", "dramatic", "enchanting"]
    },
    fantasy: {
        creatures: ["majestic dragon", "ethereal fairy", "wise wizard", "mystical unicorn", "ancient phoenix", "magical griffin", "enchanted wolf"],
        settings: ["floating castle", "enchanted forest", "crystal cave", "magical library", "ancient temple", "mystical realm", "fairy garden"],
        magic: ["glowing orb", "magical portal", "swirling energy", "ancient runes", "mystical aura", "enchanted weapon", "spell casting"],
        atmosphere: ["ethereal glow", "mysterious fog", "magical sparkles", "ancient power", "mystical energy", "enchanted atmosphere", "otherworldly"]
    },
    scifi: {
        technology: ["futuristic city", "space station", "advanced robot", "quantum computer", "holographic display", "cybernetic implant", "energy weapon"],
        environments: ["alien planet", "space colony", "underwater city", "desert wasteland", "neon-lit streets", "orbital habitat", "research facility"],
        concepts: ["time travel", "artificial intelligence", "genetic engineering", "virtual reality", "dimensional portal", "energy shield", "mind control"],
        aesthetics: ["chrome and glass", "neon lights", "sleek design", "advanced materials", "glowing interfaces", "geometric patterns", "metallic surfaces"]
    },
    abstract: {
        shapes: ["flowing curves", "geometric patterns", "organic forms", "fractal design", "spiral structure", "crystalline formation", "fluid motion"],
        colors: ["vibrant gradients", "monochromatic palette", "complementary colors", "iridescent hues", "bold contrasts", "pastel tones", "metallic sheen"],
        concepts: ["energy flow", "transformation", "infinity", "balance", "chaos and order", "time distortion", "dimensional shift"],
        textures: ["smooth marble", "rough concrete", "liquid metal", "crystalline surface", "organic texture", "digital noise", "fabric weave"]
    }
};

// Quality presets
const qualityPresets = {
    ultra: "masterpiece, award winning, ultra detailed, 8K, professional quality, perfect composition, stunning visual",
    high: "high quality, detailed, well composed, sharp focus, professional photography, excellent lighting",
    medium: "good quality, clear, decent composition, proper exposure, balanced colors",
    basic: "acceptable quality, readable, standard resolution, basic composition"
};

// DOM Elements
let elements = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing application...');
    initializeElements();
    loadLibraryData();
    setupEventListeners();
    initializeInterface();
    loadFromStorage();
});

function initializeElements() {
    console.log('Initializing DOM elements...');
    elements = {
        // Platform controls
        platformBtns: document.querySelectorAll('.platform-btn'),
        
        // Theme controls  
        themeBtns: document.querySelectorAll('.theme-btn'),
        
        // Generators
        generatorBtns: document.querySelectorAll('.generator-btn'),
        
        // Library
        libraryTabs: document.querySelectorAll('.library-tab'),
        librarySearch: document.getElementById('librarySearch'),
        libraryContent: document.getElementById('libraryContent'),
        
        // Main workspace
        promptInput: document.getElementById('promptInput'),
        negativePrompt: document.getElementById('negativePrompt'),
        negativePromptContainer: document.getElementById('negativePromptContainer'),
        
        // Controls
        qualityPreset: document.getElementById('qualityPreset'),
        styleStrength: document.getElementById('styleStrength'),
        aspectRatio: document.getElementById('aspectRatio'),
        
        // Actions
        enhanceBtn: document.getElementById('enhanceBtn'),
        clearBtn: document.getElementById('clearBtn'),
        copyBtn: document.getElementById('copyBtn'),
        negativePromptBtn: document.getElementById('negativePromptBtn'),
        favoriteBtn: document.getElementById('favoriteBtn'),
        imageToPromptBtn: document.getElementById('imageToPromptBtn'),
        
        // Quick actions
        quickBtns: document.querySelectorAll('.quick-btn'),
        
        // Preview
        previewContent: document.getElementById('previewContent'),
        charCount: document.getElementById('charCount'),
        wordCount: document.getElementById('wordCount'),
        
        // Platform settings
        platformSettings: document.getElementById('platformSettings'),
        
        // History
        historyTabs: document.querySelectorAll('.history-tab'),
        historyContent: document.getElementById('historyContent'),
        
        // Export/Import
        exportJson: document.getElementById('exportJson'),
        exportTxt: document.getElementById('exportTxt'),
        exportCsv: document.getElementById('exportCsv'),
        importBtn: document.getElementById('importBtn'),
        importFile: document.getElementById('importFile'),
        
        // Modal and Image Analysis Elements
        imageModal: document.getElementById('imageModal'),
        modalClose: document.getElementById('modalClose'),
        modalCancel: document.getElementById('modalCancel'),
        analyzeNewBtn: document.getElementById('analyzeNewBtn'),
        usePromptBtn: document.getElementById('usePromptBtn'),
        
        // Suggestions
        suggestionsGrid: document.getElementById('suggestionsGrid'),
        
        // Toast
        toastContainer: document.getElementById('toastContainer')
    };
    
    console.log('DOM elements initialized:', Object.keys(elements).length);
}

function loadLibraryData() {
    console.log('Loading library data...');
    // Initialize with sample data for now
    state.wordLibrary = [
        { category: 'Art Styles', word: 'impressionistic' },
        { category: 'Art Styles', word: 'photorealistic' },
        { category: 'Art Styles', word: 'abstract' },
        { category: 'Lighting', word: 'dramatic lighting' },
        { category: 'Lighting', word: 'soft lighting' },
        { category: 'Quality', word: 'high quality' },
        { category: 'Quality', word: 'masterpiece' }
    ];
    
    state.templates = [
        { template: 'A beautiful portrait of [subject], professional photography, studio lighting' },
        { template: 'Landscape painting of [location], golden hour, serene atmosphere' },
        { template: 'Digital art of [concept], vibrant colors, trending on artstation' }
    ];
    
    updateLibraryDisplay();
    console.log('Library data loaded');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Platform selection
    if (elements.platformBtns) {
        elements.platformBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Platform clicked:', btn.dataset.platform);
                switchPlatform(btn.dataset.platform);
            });
        });
    }
    
    // Theme selection
    if (elements.themeBtns) {
        elements.themeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Theme clicked:', btn.dataset.theme);
                switchTheme(btn.dataset.theme);
            });
        });
    }
    
    // Random generators
    if (elements.generatorBtns) {
        elements.generatorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Generator clicked:', btn.dataset.generator);
                generateRandomPrompt(btn.dataset.generator);
            });
        });
    }
    
    // Library tabs
    if (elements.libraryTabs) {
        elements.libraryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                switchLibraryTab(tab.dataset.tab);
            });
        });
    }
    
    // Library search
    if (elements.librarySearch) {
        elements.librarySearch.addEventListener('input', handleLibrarySearch);
    }
    
    // Prompt input
    if (elements.promptInput) {
        elements.promptInput.addEventListener('input', updatePreview);
        elements.promptInput.addEventListener('keydown', (e) => {
            // Ensure text input works
            e.stopPropagation();
        });
    }
    
    if (elements.negativePrompt) {
        elements.negativePrompt.addEventListener('input', updatePreview);
    }
    
    // Controls
    if (elements.qualityPreset) {
        elements.qualityPreset.addEventListener('change', updatePreview);
    }
    
    if (elements.styleStrength) {
        elements.styleStrength.addEventListener('input', (e) => {
            const valueSpan = document.querySelector('.slider-value');
            if (valueSpan) {
                valueSpan.textContent = e.target.value;
            }
            updatePreview();
        });
    }
    
    if (elements.aspectRatio) {
        elements.aspectRatio.addEventListener('change', updatePreview);
    }
    
    // Action buttons
    if (elements.enhanceBtn) {
        elements.enhanceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            enhancePrompt();
        });
    }
    
    if (elements.clearBtn) {
        elements.clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearPrompt();
        });
    }
    
    if (elements.copyBtn) {
        elements.copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            copyPrompt();
        });
    }
    
    if (elements.negativePromptBtn) {
        elements.negativePromptBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleNegativePrompt();
        });
    }
    
    if (elements.favoriteBtn) {
        elements.favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToFavorites();
        });
    }
    
    if (elements.imageToPromptBtn) {
        elements.imageToPromptBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Image to prompt button clicked');
            openImageModal();
        });
    }
    
    // Quick actions
    if (elements.quickBtns) {
        elements.quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Quick action:', btn.dataset.action);
                handleQuickAction(btn.dataset.action);
            });
        });
    }
    
    // History tabs
    if (elements.historyTabs) {
        elements.historyTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                switchHistoryTab(tab.dataset.history);
            });
        });
    }
    
    // Export buttons
    if (elements.exportJson) {
        elements.exportJson.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            exportData('json');
        });
    }
    
    if (elements.exportTxt) {
        elements.exportTxt.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            exportData('txt');
        });
    }
    
    if (elements.exportCsv) {
        elements.exportCsv.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            exportData('csv');
        });
    }
    
    if (elements.importBtn) {
        elements.importBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (elements.importFile) {
                elements.importFile.click();
            }
        });
    }
    
    if (elements.importFile) {
        elements.importFile.addEventListener('change', importData);
    }
    
    // Modal controls
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeImageModal();
        });
    }
    
    if (elements.modalCancel) {
        elements.modalCancel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeImageModal();
        });
    }
    
    if (elements.analyzeNewBtn) {
        elements.analyzeNewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetImageAnalysis();
        });
    }
    
    if (elements.usePromptBtn) {
        elements.usePromptBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            useSelectedPrompt();
        });
    }
    
    // Setup image upload functionality
    setupImageUploadListeners();
    
    // Click outside modal to close
    if (elements.imageModal) {
        elements.imageModal.addEventListener('click', (e) => {
            if (e.target === elements.imageModal) closeImageModal();
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    console.log('Event listeners set up complete');
}

function setupImageUploadListeners() {
    console.log('Setting up image upload listeners...');
    
    const imageFileInput = document.getElementById('imageFileInput');
    const imageDropZone = document.getElementById('imageDropZone');
    
    if (imageFileInput) {
        imageFileInput.addEventListener('change', handleImageUpload);
    }
    
    if (imageDropZone) {
        // Drag and drop
        imageDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageDropZone.classList.add('drag-over');
        });
        
        imageDropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            imageDropZone.classList.remove('drag-over');
        });
        
        imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageDropZone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageFile(files[0]);
            }
        });
        
        // Click to upload
        imageDropZone.addEventListener('click', (e) => {
            const analysisContainer = document.getElementById('imageAnalysisContainer');
            if (!analysisContainer || analysisContainer.classList.contains('hidden')) {
                if (imageFileInput) imageFileInput.click();
            }
        });
    }
    
    // Analysis tabs
    const analysisTabs = document.querySelectorAll('.analysis-tab');
    if (analysisTabs) {
        analysisTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                switchAnalysisTab(tab.dataset.tab);
            });
        });
    }
    
    // Prompt style change
    const promptStyle = document.getElementById('promptStyle');
    if (promptStyle) {
        promptStyle.addEventListener('change', () => {
            if (state.imageAnalysis) {
                generatePromptsFromAnalysis(state.imageAnalysis);
            }
        });
    }
    
    console.log('Image upload listeners set up complete');
}

function handleImageUpload() {
    console.log('Image upload triggered');
    const imageFileInput = document.getElementById('imageFileInput');
    if (imageFileInput && imageFileInput.files && imageFileInput.files[0]) {
        handleImageFile(imageFileInput.files[0]);
    }
}

function handleImageFile(file) {
    console.log('Handling image file:', file.name);
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast('Image too large. Please select a file under 10MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log('Image loaded, analyzing...');
        analyzeImage(e.target.result, file);
    };
    reader.readAsDataURL(file);
}

function analyzeImage(imageSrc, file) {
    console.log('Analyzing image...');
    
    const img = new Image();
    img.onload = () => {
        console.log('Image loaded successfully');
        
        // Store image data
        state.currentImage = { src: imageSrc, file, element: img };
        
        // Show image preview
        const imagePreview = document.getElementById('imagePreview');
        const imageAnalysisContainer = document.getElementById('imageAnalysisContainer');
        
        if (imagePreview) {
            imagePreview.src = imageSrc;
        }
        
        if (imageAnalysisContainer) {
            imageAnalysisContainer.classList.remove('hidden');
        }
        
        // Update image details
        updateImageDetails(file, img);
        
        // Perform analysis
        performImageAnalysis(img);
        
        // Update modal buttons
        if (elements.analyzeNewBtn) elements.analyzeNewBtn.classList.remove('hidden');
        if (elements.usePromptBtn) elements.usePromptBtn.classList.remove('hidden');
        
        showToast('Image uploaded and analyzed successfully!', 'success');
    };
    
    img.onerror = () => {
        console.error('Failed to load image');
        showToast('Failed to load image', 'error');
    };
    
    img.src = imageSrc;
}

function updateImageDetails(file, img) {
    const details = [
        { label: 'Filename', value: file.name },
        { label: 'Size', value: formatFileSize(file.size) },
        { label: 'Dimensions', value: `${img.width} × ${img.height}` },
        { label: 'Aspect Ratio', value: getAspectRatio(img.width, img.height) },
        { label: 'Type', value: file.type }
    ];
    
    const imageDetails = document.getElementById('imageDetails');
    if (imageDetails) {
        imageDetails.innerHTML = details.map(detail => 
            `<div class="image-detail-item">
                <span class="image-detail-label">${detail.label}:</span>
                <span class="image-detail-value">${detail.value}</span>
            </div>`
        ).join('');
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getAspectRatio(width, height) {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    const ratioWidth = width / divisor;
    const ratioHeight = height / divisor;
    
    // Common aspect ratios
    if (Math.abs(ratioWidth / ratioHeight - 16/9) < 0.1) return '16:9';
    if (Math.abs(ratioWidth / ratioHeight - 4/3) < 0.1) return '4:3';
    if (Math.abs(ratioWidth / ratioHeight - 3/2) < 0.1) return '3:2';
    if (Math.abs(ratioWidth / ratioHeight - 1) < 0.1) return '1:1';
    if (Math.abs(ratioWidth / ratioHeight - 9/16) < 0.1) return '9:16';
    
    return `${ratioWidth}:${ratioHeight}`;
}

function performImageAnalysis(img) {
    console.log('Performing image analysis...');
    
    // Create canvas for analysis
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = Math.min(img.width, 400); // Limit size for performance
    canvas.height = Math.min(img.height, 400);
    
    // Draw image to canvas for analysis
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Perform various analyses
    const colorAnalysis = analyzeColors(imageData);
    const compositionAnalysis = analyzeComposition(img, imageData);
    const styleAnalysis = analyzeStyle(imageData);
    
    // Combine analysis results
    state.imageAnalysis = {
        colors: colorAnalysis,
        composition: compositionAnalysis,
        style: styleAnalysis,
        metadata: {
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height
        }
    };
    
    console.log('Analysis complete:', state.imageAnalysis);
    
    // Update UI
    updateAnalysisDisplay(state.imageAnalysis);
    generatePromptsFromAnalysis(state.imageAnalysis);
}

function analyzeColors(imageData) {
    const pixels = imageData.data;
    const colors = [];
    
    // Sample colors every 10th pixel for performance
    for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        if (a > 128) { // Skip mostly transparent pixels
            colors.push([r, g, b]);
        }
    }
    
    // Find dominant colors
    const dominantColors = findDominantColors(colors, 5);
    
    // Analyze color characteristics
    const temperature = analyzeColorTemperature(dominantColors);
    const saturation = analyzeColorSaturation(dominantColors);
    const brightness = analyzeColorBrightness(dominantColors);
    
    return {
        dominantColors,
        temperature,
        saturation,
        brightness,
        palette: dominantColors.map(color => `rgb(${color.join(',')})`)
    };
}

function findDominantColors(colors, k) {
    if (colors.length === 0) return [[128, 128, 128], [64, 64, 64], [192, 192, 192]];
    
    // Simple approach: find most frequent colors by grouping similar ones
    const colorGroups = {};
    
    colors.forEach(color => {
        // Round to nearest 32 to group similar colors
        const key = color.map(c => Math.round(c / 32) * 32).join(',');
        if (!colorGroups[key]) {
            colorGroups[key] = { count: 0, color: color.map(c => Math.round(c / 32) * 32) };
        }
        colorGroups[key].count++;
    });
    
    // Sort by frequency and take top k
    const sortedGroups = Object.values(colorGroups)
        .sort((a, b) => b.count - a.count)
        .slice(0, k);
    
    return sortedGroups.map(group => group.color);
}

function analyzeColorTemperature(colors) {
    let warmCount = 0;
    let coolCount = 0;
    
    colors.forEach(([r, g, b]) => {
        if (r > b && r > g * 0.8) warmCount++;
        else if (b > r && b > g * 0.8) coolCount++;
    });
    
    if (warmCount > coolCount) return 'warm';
    if (coolCount > warmCount) return 'cool';
    return 'neutral';
}

function analyzeColorSaturation(colors) {
    const saturations = colors.map(([r, g, b]) => {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        return max === 0 ? 0 : (max - min) / max;
    });
    
    const avgSaturation = saturations.reduce((a, b) => a + b, 0) / saturations.length;
    
    if (avgSaturation > 0.5) return 'vibrant';
    if (avgSaturation < 0.2) return 'muted';
    return 'moderate';
}

function analyzeColorBrightness(colors) {
    const brightness = colors.map(([r, g, b]) => 
        (0.299 * r + 0.587 * g + 0.114 * b) / 255
    );
    
    const avgBrightness = brightness.reduce((a, b) => a + b, 0) / brightness.length;
    
    if (avgBrightness > 0.7) return 'bright';
    if (avgBrightness < 0.3) return 'dark';
    return 'balanced';
}

function analyzeComposition(img, imageData) {
    const width = img.width;
    const height = img.height;
    const aspectRatio = width / height;
    
    // Determine orientation
    let orientation = 'square';
    if (aspectRatio > 1.3) orientation = 'landscape';
    else if (aspectRatio < 0.8) orientation = 'portrait';
    else if (aspectRatio > 2) orientation = 'panoramic';
    
    // Analyze lighting (brightness distribution)
    const lighting = analyzeLighting(imageData);
    
    // Basic subject detection
    const subjectType = detectSubjectType(aspectRatio);
    
    return {
        orientation,
        aspectRatio: Math.round(aspectRatio * 100) / 100,
        lighting,
        subjectType
    };
}

function analyzeLighting(imageData) {
    const pixels = imageData.data;
    let totalBrightness = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
        totalBrightness += brightness;
        pixelCount++;
    }
    
    const avgBrightness = totalBrightness / pixelCount;
    
    if (avgBrightness > 180) return 'bright';
    if (avgBrightness < 80) return 'dramatic';
    return 'natural';
}

function detectSubjectType(aspectRatio) {
    // Simple heuristic based on aspect ratio
    if (aspectRatio > 1.5) return 'landscape';
    if (aspectRatio < 0.9) return 'person';
    return 'object';
}

function analyzeStyle(imageData) {
    return {
        technique: 'photography',
        category: 'realistic',
        noiseLevel: 10
    };
}

function updateAnalysisDisplay(analysis) {
    console.log('Updating analysis display...');
    
    // Update color analysis
    updateColorAnalysisDisplay(analysis.colors);
    
    // Update composition analysis
    updateCompositionAnalysisDisplay(analysis.composition);
    
    // Update style analysis
    updateStyleAnalysisDisplay(analysis.style);
}

function updateColorAnalysisDisplay(colorAnalysis) {
    const colorPalette = document.getElementById('colorPalette');
    if (colorPalette) {
        colorPalette.innerHTML = colorAnalysis.dominantColors.map(color => {
            const rgb = `rgb(${color.join(',')})`;
            return `<div class="color-swatch" style="background-color: ${rgb}" title="${rgb}"></div>`;
        }).join('');
    }
    
    const colorAnalysisEl = document.getElementById('colorAnalysis');
    if (colorAnalysisEl) {
        const analysisItems = [
            { label: 'Temperature', value: colorAnalysis.temperature },
            { label: 'Saturation', value: colorAnalysis.saturation },
            { label: 'Brightness', value: colorAnalysis.brightness }
        ];
        
        colorAnalysisEl.innerHTML = analysisItems.map(item =>
            `<div class="analysis-item">
                <span class="analysis-label">${item.label}</span>
                <span class="analysis-value">${item.value}</span>
            </div>`
        ).join('');
    }
}

function updateCompositionAnalysisDisplay(compositionAnalysis) {
    const compositionAnalysisEl = document.getElementById('compositionAnalysis');
    if (compositionAnalysisEl) {
        const analysisItems = [
            { label: 'Orientation', value: compositionAnalysis.orientation },
            { label: 'Aspect Ratio', value: compositionAnalysis.aspectRatio },
            { label: 'Lighting', value: compositionAnalysis.lighting },
            { label: 'Subject Type', value: compositionAnalysis.subjectType }
        ];
        
        compositionAnalysisEl.innerHTML = analysisItems.map(item =>
            `<div class="analysis-item">
                <span class="analysis-label">${item.label}</span>
                <span class="analysis-value">${item.value}</span>
            </div>`
        ).join('');
    }
}

function updateStyleAnalysisDisplay(styleAnalysis) {
    const styleAnalysisEl = document.getElementById('styleAnalysis');
    if (styleAnalysisEl) {
        const analysisItems = [
            { label: 'Technique', value: styleAnalysis.technique },
            { label: 'Category', value: styleAnalysis.category },
            { label: 'Texture Level', value: styleAnalysis.noiseLevel }
        ];
        
        styleAnalysisEl.innerHTML = analysisItems.map(item =>
            `<div class="analysis-item">
                <span class="analysis-label">${item.label}</span>
                <span class="analysis-value">${item.value}</span>
            </div>`
        ).join('');
    }
}

function generatePromptsFromAnalysis(analysis) {
    console.log('Generating prompts from analysis...');
    
    const prompts = [];
    const { colors, composition, style } = analysis;
    
    // Generate descriptive prompt
    let descriptivePrompt = '';
    if (composition.subjectType === 'person') {
        descriptivePrompt = 'professional portrait photography';
    } else if (composition.subjectType === 'landscape') {
        descriptivePrompt = 'scenic landscape photography';
    } else {
        descriptivePrompt = 'detailed photography';
    }
    
    if (colors.temperature === 'warm') {
        descriptivePrompt += ', warm color palette';
    } else if (colors.temperature === 'cool') {
        descriptivePrompt += ', cool color tones';
    }
    
    descriptivePrompt += `, ${composition.lighting} lighting, ${colors.brightness} exposure`;
    
    prompts.push({
        text: descriptivePrompt,
        style: 'descriptive',
        type: 'base',
        confidence: 0.8
    });
    
    // Generate artistic prompt
    let artisticPrompt = 'artistic composition';
    if (colors.saturation === 'vibrant') {
        artisticPrompt += ', vibrant colors';
    } else if (colors.saturation === 'muted') {
        artisticPrompt += ', muted tones';
    }
    
    artisticPrompt += `, ${composition.orientation} format, creative visual style`;
    
    prompts.push({
        text: artisticPrompt,
        style: 'artistic',
        type: 'interpretation',
        confidence: 0.7
    });
    
    // Generate technical prompt
    let technicalPrompt = 'professional photography, high resolution';
    if (composition.subjectType === 'person') {
        technicalPrompt += ', portrait lens, shallow depth of field';
    } else if (composition.subjectType === 'landscape') {
        technicalPrompt += ', wide angle lens, sharp focus';
    }
    
    prompts.push({
        text: technicalPrompt,
        style: 'technical',
        type: 'photography',
        confidence: 0.9
    });
    
    // Generate creative prompt
    let creativePrompt = 'creative visual composition';
    if (colors.temperature === 'warm' && colors.brightness === 'bright') {
        creativePrompt += ', sunny and optimistic mood';
    } else if (colors.temperature === 'cool' && colors.brightness === 'dark') {
        creativePrompt += ', moody and atmospheric';
    }
    
    prompts.push({
        text: creativePrompt,
        style: 'creative',
        type: 'interpretation',
        confidence: 0.6
    });
    
    // Store generated prompts
    state.generatedPrompts = prompts;
    
    // Update display
    updateGeneratedPromptsDisplay();
}

function updateGeneratedPromptsDisplay() {
    const generatedPrompts = document.getElementById('generatedPrompts');
    if (!generatedPrompts) return;
    
    generatedPrompts.innerHTML = state.generatedPrompts.map((prompt, index) => {
        const confidencePercent = Math.round(prompt.confidence * 100);
        return `
            <div class="prompt-option" data-index="${index}">
                <div class="prompt-text">${prompt.text}</div>
                <div class="prompt-meta">
                    <span>${prompt.type}</span>
                    <div class="confidence-score">
                        <span>${confidencePercent}%</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${confidencePercent}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers
    generatedPrompts.querySelectorAll('.prompt-option').forEach((option, index) => {
        option.addEventListener('click', () => selectPrompt(index));
    });
    
    // Auto-select first prompt
    if (state.generatedPrompts.length > 0) {
        selectPrompt(0);
    }
}

function selectPrompt(index) {
    const generatedPrompts = document.getElementById('generatedPrompts');
    if (!generatedPrompts) return;
    
    // Update selection UI
    generatedPrompts.querySelectorAll('.prompt-option').forEach((option, i) => {
        option.classList.toggle('selected', i === index);
    });
    
    // Store selected prompt
    state.selectedPrompt = state.generatedPrompts[index];
}

function switchAnalysisTab(tab) {
    const analysisTabs = document.querySelectorAll('.analysis-tab');
    if (analysisTabs) {
        analysisTabs.forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
    }
    
    // Update panel visibility
    document.querySelectorAll('.analysis-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const targetPanel = document.getElementById(`${tab}Panel`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
}

function resetImageAnalysis() {
    console.log('Resetting image analysis...');
    
    // Reset state
    state.currentImage = null;
    state.imageAnalysis = null;
    state.generatedPrompts = [];
    state.selectedPrompt = null;
    
    // Reset UI
    const imageAnalysisContainer = document.getElementById('imageAnalysisContainer');
    if (imageAnalysisContainer) {
        imageAnalysisContainer.classList.add('hidden');
    }
    
    if (elements.analyzeNewBtn) elements.analyzeNewBtn.classList.add('hidden');
    if (elements.usePromptBtn) elements.usePromptBtn.classList.add('hidden');
    
    const imageFileInput = document.getElementById('imageFileInput');
    if (imageFileInput) imageFileInput.value = '';
    
    // Clear displays
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.src = '';
    
    const imageDetails = document.getElementById('imageDetails');
    if (imageDetails) imageDetails.innerHTML = '';
    
    const colorPalette = document.getElementById('colorPalette');
    if (colorPalette) colorPalette.innerHTML = '';
    
    const colorAnalysis = document.getElementById('colorAnalysis');
    if (colorAnalysis) colorAnalysis.innerHTML = '';
    
    const compositionAnalysis = document.getElementById('compositionAnalysis');
    if (compositionAnalysis) compositionAnalysis.innerHTML = '';
    
    const styleAnalysis = document.getElementById('styleAnalysis');
    if (styleAnalysis) styleAnalysis.innerHTML = '';
    
    const generatedPrompts = document.getElementById('generatedPrompts');
    if (generatedPrompts) generatedPrompts.innerHTML = '';
}

function useSelectedPrompt() {
    if (!state.selectedPrompt) {
        showToast('Please select a prompt first', 'error');
        return;
    }
    
    console.log('Using selected prompt:', state.selectedPrompt.text);
    
    // Apply platform optimization
    let finalPrompt = state.selectedPrompt.text;
    const platform = platforms[state.currentPlatform];
    if (platform.optimization) {
        finalPrompt += `, ${platform.optimization}`;
    }
    
    // Set the prompt
    if (elements.promptInput) {
        elements.promptInput.value = finalPrompt;
        updatePreview();
        addToHistory(finalPrompt);
    }
    
    // Close modal
    closeImageModal();
    
    showToast('Prompt applied successfully!', 'success');
}

function openImageModal() {
    console.log('Opening image modal...');
    
    if (elements.imageModal) {
        elements.imageModal.classList.remove('hidden');
        resetImageAnalysis();
        showToast('Upload an image to generate prompts', 'success');
    }
}

function closeImageModal() {
    console.log('Closing image modal...');
    
    if (elements.imageModal) {
        elements.imageModal.classList.add('hidden');
    }
    resetImageAnalysis();
}

// Rest of the existing functions...
function initializeInterface() {
    updatePlatformSettings();
    updateLibraryDisplay();
    updateHistoryDisplay();
    updatePreview();
    generateSuggestions();
}

function switchPlatform(platformId) {
    console.log('Switching to platform:', platformId);
    state.currentPlatform = platformId;
    
    // Update button states
    elements.platformBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.platform === platformId);
    });
    
    updatePlatformSettings();
    updatePreview();
    saveToStorage();
}

function switchTheme(themeId) {
    console.log('Switching to theme:', themeId);
    state.currentTheme = themeId;
    document.body.setAttribute('data-theme', themeId);
    
    // Update button states
    elements.themeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === themeId);
    });
    
    saveToStorage();
}

function generateRandomPrompt(category) {
    console.log('Generating random prompt for:', category);
    const sets = randomSets[category];
    if (!sets) return;
    
    let prompt = '';
    
    // Generate based on category
    switch (category) {
        case 'portrait':
            prompt = `${getRandomItem(sets.subjects)}, ${getRandomItem(sets.expressions)}, ${getRandomItem(sets.styles)}, ${getRandomItem(sets.lighting)}`;
            break;
        case 'nature':
            prompt = `${getRandomItem(sets.landscapes)}, ${getRandomItem(sets.weather)}, ${getRandomItem(sets.elements)}, ${getRandomItem(sets.moods)} atmosphere`;
            break;
        case 'fantasy':
            prompt = `${getRandomItem(sets.creatures)} in ${getRandomItem(sets.settings)}, ${getRandomItem(sets.magic)}, ${getRandomItem(sets.atmosphere)}`;
            break;
        case 'scifi':
            prompt = `${getRandomItem(sets.technology)}, ${getRandomItem(sets.environments)}, ${getRandomItem(sets.concepts)}, ${getRandomItem(sets.aesthetics)}`;
            break;
        case 'abstract':
            prompt = `${getRandomItem(sets.shapes)}, ${getRandomItem(sets.colors)}, ${getRandomItem(sets.concepts)}, ${getRandomItem(sets.textures)}`;
            break;
        case 'surprise':
            // Mix elements from all categories
            const allCategories = Object.keys(randomSets).filter(k => k !== 'surprise');
            const randomCategory1 = getRandomItem(allCategories);
            const randomCategory2 = getRandomItem(allCategories);
            const set1 = randomSets[randomCategory1];
            const set2 = randomSets[randomCategory2];
            const key1 = getRandomItem(Object.keys(set1));
            const key2 = getRandomItem(Object.keys(set2));
            prompt = `${getRandomItem(set1[key1])}, ${getRandomItem(set2[key2])}`;
            break;
    }
    
    // Add platform optimization
    const platform = platforms[state.currentPlatform];
    if (platform.optimization) {
        prompt += `, ${platform.optimization}`;
    }
    
    if (elements.promptInput) {
        elements.promptInput.value = prompt;
        updatePreview();
        addToHistory(prompt);
    }
    
    showToast(`Generated ${category} prompt!`, 'success');
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function switchLibraryTab(tab) {
    elements.libraryTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    updateLibraryDisplay(tab);
}

function updateLibraryDisplay(activeTab = 'words') {
    let content = '';
    
    if (activeTab === 'words' && state.wordLibrary.length > 0) {
        const categories = [...new Set(state.wordLibrary.map(item => item.category || 'General'))];
        
        categories.forEach(category => {
            const words = state.wordLibrary.filter(item => 
                (item.category || 'General') === category
            );
            
            if (words.length > 0) {
                content += `<div class="library-category">
                    <h4 style="font-size: 12px; color: var(--color-text-secondary); margin: 8px 0 4px 0; text-transform: uppercase;">${category}</h4>`;
                
                words.forEach(word => {
                    const wordText = word.word;
                    if (wordText) {
                        content += `<div class="library-item">
                            <span class="library-item-text">${wordText}</span>
                            <button class="library-item-action" onclick="addToPrompt('${wordText}')">+</button>
                        </div>`;
                    }
                });
                
                content += '</div>';
            }
        });
    } else if (activeTab === 'templates' && state.templates.length > 0) {
        state.templates.forEach(template => {
            const templateText = template.template;
            if (templateText) {
                const shortText = templateText.length > 50 ? templateText.substring(0, 50) + '...' : templateText;
                content += `<div class="library-item">
                    <span class="library-item-text" title="${templateText}">${shortText}</span>
                    <button class="library-item-action" onclick="setPrompt('${templateText.replace(/'/g, "\\'")}')">Use</button>
                </div>`;
            }
        });
    }
    
    if (!content) {
        content = '<div style="padding: 16px; text-align: center; color: var(--color-text-secondary);">Library loaded</div>';
    }
    
    if (elements.libraryContent) {
        elements.libraryContent.innerHTML = content;
    }
}

function handleLibrarySearch() {
    const query = elements.librarySearch.value.toLowerCase();
    const activeTab = document.querySelector('.library-tab.active').dataset.tab;
    
    if (!query) {
        updateLibraryDisplay(activeTab);
        return;
    }
    
    let content = '';
    
    if (activeTab === 'words') {
        const filteredWords = state.wordLibrary.filter(item => {
            return item.word && item.word.toLowerCase().includes(query);
        });
        
        filteredWords.slice(0, 20).forEach(word => {
            content += `<div class="library-item">
                <span class="library-item-text">${word.word}</span>
                <button class="library-item-action" onclick="addToPrompt('${word.word}')">+</button>
            </div>`;
        });
    } else {
        const filteredTemplates = state.templates.filter(item => {
            return item.template && item.template.toLowerCase().includes(query);
        });
        
        filteredTemplates.slice(0, 10).forEach(template => {
            const templateText = template.template;
            const shortText = templateText.length > 50 ? templateText.substring(0, 50) + '...' : templateText;
            content += `<div class="library-item">
                <span class="library-item-text" title="${templateText}">${shortText}</span>
                <button class="library-item-action" onclick="setPrompt('${templateText.replace(/'/g, "\\'")}')">Use</button>
            </div>`;
        });
    }
    
    elements.libraryContent.innerHTML = content || '<div style="padding: 16px; text-align: center; color: var(--color-text-secondary);">No results found</div>';
}

// Global functions for library interactions
window.addToPrompt = function(text) {
    console.log('Adding to prompt:', text);
    if (elements.promptInput) {
        const current = elements.promptInput.value;
        const newValue = current ? `${current}, ${text}` : text;
        elements.promptInput.value = newValue;
        updatePreview();
        showToast('Added to prompt', 'success');
    }
};

window.setPrompt = function(text) {
    console.log('Setting prompt:', text);
    if (elements.promptInput) {
        elements.promptInput.value = text;
        updatePreview();
        addToHistory(text);
        showToast('Template applied', 'success');
    }
};

function updatePreview() {
    if (!elements.promptInput || !elements.previewContent) return;
    
    const prompt = elements.promptInput.value;
    const negativePrompt = elements.negativePrompt ? elements.negativePrompt.value : '';
    const quality = qualityPresets[elements.qualityPreset ? elements.qualityPreset.value : 'medium'];
    const platform = platforms[state.currentPlatform];
    
    let finalPrompt = prompt;
    
    // Add quality preset
    if (quality && finalPrompt) {
        finalPrompt = `${finalPrompt}, ${quality}`;
    }
    
    // Add platform optimization
    if (platform.optimization && finalPrompt) {
        finalPrompt = `${finalPrompt}, ${platform.optimization}`;
    }
    
    // Add aspect ratio for Midjourney
    if (state.currentPlatform === 'midjourney' && finalPrompt && elements.aspectRatio) {
        const aspectRatio = elements.aspectRatio.value;
        finalPrompt += ` --ar ${aspectRatio}`;
    }
    
    // Display preview
    elements.previewContent.innerHTML = finalPrompt || 
        '<div class="preview-placeholder">Your enhanced prompt will appear here...</div>';
    
    // Update stats
    if (elements.charCount) {
        elements.charCount.textContent = finalPrompt.length;
    }
    if (elements.wordCount) {
        elements.wordCount.textContent = finalPrompt.split(/\s+/).filter(w => w.length > 0).length;
    }
    
    // Update negative prompt display
    if (negativePrompt) {
        elements.previewContent.innerHTML += `<br><br><strong>Negative:</strong> ${negativePrompt}`;
    }
}

function updatePlatformSettings() {
    if (!elements.platformSettings) return;
    
    let html = '';
    
    if (state.currentPlatform === 'midjourney') {
        html = `
            <div class="setting-item">
                <label class="setting-label">Stylize (--s)</label>
                <input type="range" min="0" max="1000" value="100" class="setting-input" onchange="updatePreview()">
            </div>
            <div class="setting-item">
                <label class="setting-label">Quality (--q)</label>
                <select class="setting-input" onchange="updatePreview()">
                    <option value="1">Standard (1)</option>
                    <option value="2">High (2)</option>
                </select>
            </div>
        `;
    } else if (state.currentPlatform === 'stable_diffusion') {
        html = `
            <div class="setting-item">
                <label class="setting-label">CFG Scale</label>
                <input type="range" min="1" max="30" value="7" class="setting-input" onchange="updatePreview()">
            </div>
            <div class="setting-item">
                <label class="setting-label">Steps</label>
                <input type="range" min="10" max="150" value="20" class="setting-input" onchange="updatePreview()">
            </div>
        `;
    }
    
    elements.platformSettings.innerHTML = html;
}

function enhancePrompt() {
    if (!elements.promptInput) return;
    
    const currentPrompt = elements.promptInput.value;
    if (!currentPrompt) {
        showToast('Enter a prompt to enhance', 'error');
        return;
    }
    
    console.log('Enhancing prompt:', currentPrompt);
    
    // Simple enhancement by adding quality and style terms
    const enhancements = [
        'highly detailed',
        'professional quality',
        'perfect composition',
        'stunning visual',
        'masterpiece'
    ];
    
    const randomEnhancement = getRandomItem(enhancements);
    const enhanced = `${currentPrompt}, ${randomEnhancement}`;
    
    elements.promptInput.value = enhanced;
    updatePreview();
    addToHistory(enhanced);
    
    showToast('Prompt enhanced!', 'success');
}

function clearPrompt() {
    console.log('Clearing prompt');
    
    if (elements.promptInput) elements.promptInput.value = '';
    if (elements.negativePrompt) elements.negativePrompt.value = '';
    updatePreview();
    showToast('Prompt cleared', 'success');
}

function copyPrompt() {
    if (!elements.previewContent) return;
    
    const previewText = elements.previewContent.textContent;
    if (!previewText || previewText.includes('Your enhanced prompt')) {
        showToast('Nothing to copy', 'error');
        return;
    }
    
    navigator.clipboard.writeText(previewText).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

function toggleNegativePrompt() {
    if (!elements.negativePromptContainer || !elements.negativePromptBtn) return;
    
    elements.negativePromptContainer.classList.toggle('active');
    const isActive = elements.negativePromptContainer.classList.contains('active');
    elements.negativePromptBtn.textContent = isActive ? '➕ Hide Negative' : '➖ Add Negative';
}

function addToFavorites() {
    if (!elements.promptInput) return;
    
    const prompt = elements.promptInput.value;
    if (!prompt) {
        showToast('No prompt to save', 'error');
        return;
    }
    
    const favorite = {
        prompt,
        platform: state.currentPlatform,
        timestamp: Date.now()
    };
    
    state.favorites.unshift(favorite);
    state.favorites = state.favorites.slice(0, 50); // Keep only 50 favorites
    
    updateHistoryDisplay();
    saveToStorage();
    showToast('Added to favorites!', 'success');
}

function addToHistory(prompt) {
    const historyItem = {
        prompt,
        platform: state.currentPlatform,
        timestamp: Date.now()
    };
    
    state.history.unshift(historyItem);
    state.history = state.history.slice(0, 100); // Keep only 100 history items
    
    updateHistoryDisplay();
    saveToStorage();
}

function switchHistoryTab(tab) {
    elements.historyTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.history === tab);
    });
    updateHistoryDisplay(tab);
}

function updateHistoryDisplay(activeTab = 'recent') {
    if (!elements.historyContent) return;
    
    const items = activeTab === 'recent' ? state.history : state.favorites;
    let content = '';
    
    items.slice(0, 10).forEach((item, index) => {
        const shortPrompt = item.prompt.length > 60 ? item.prompt.substring(0, 60) + '...' : item.prompt;
        const timeAgo = getTimeAgo(item.timestamp);
        
        content += `<div class="history-item" onclick="loadHistoryItem(${activeTab === 'recent' ? 'state.history' : 'state.favorites'}, ${index})">
            <div style="font-size: 12px; margin-bottom: 4px;">${shortPrompt}</div>
            <div style="font-size: 10px; color: var(--color-text-secondary);">${timeAgo} • ${item.platform}</div>
        </div>`;
    });
    
    elements.historyContent.innerHTML = content || 
        `<div style="padding: 16px; text-align: center; color: var(--color-text-secondary);">No ${activeTab} items</div>`;
}

window.loadHistoryItem = function(items, index) {
    const item = items[index];
    if (elements.promptInput) {
        elements.promptInput.value = item.prompt;
        switchPlatform(item.platform);
        updatePreview();
        showToast('Loaded from history', 'success');
    }
};

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function handleQuickAction(action) {
    console.log('Handling quick action:', action);
    
    const additions = {
        'add-lighting': 'dramatic lighting, golden hour, professional photography',
        'add-style': 'artistic style, masterpiece, trending on artstation',
        'add-mood': 'atmospheric, moody, cinematic',
        'add-camera': 'shot with professional camera, 85mm lens, shallow depth of field',
        'add-composition': 'perfect composition, rule of thirds, balanced'
    };
    
    const addition = additions[action];
    if (addition && elements.promptInput) {
        const current = elements.promptInput.value;
        elements.promptInput.value = current ? `${current}, ${addition}` : addition;
        updatePreview();
        showToast(`Added ${action.replace('add-', '')}`, 'success');
    }
}

function generateSuggestions() {
    if (!elements.suggestionsGrid) return;
    
    // Generate contextual suggestions based on current input
    const suggestions = [
        'Portrait photography, studio lighting',
        'Landscape painting, golden hour',
        'Digital art, cyberpunk style',
        'Watercolor illustration, soft colors',
        'Black and white photography',
        'Fantasy art, magical atmosphere'
    ];
    
    let html = '';
    suggestions.forEach(suggestion => {
        html += `<div class="suggestion-item" onclick="applySuggestion('${suggestion}')">
            <div class="suggestion-text">${suggestion}</div>
        </div>`;
    });
    
    elements.suggestionsGrid.innerHTML = html;
}

window.applySuggestion = function(suggestion) {
    console.log('Applying suggestion:', suggestion);
    if (elements.promptInput) {
        elements.promptInput.value = suggestion;
        updatePreview();
        addToHistory(suggestion);
        showToast('Applied suggestion', 'success');
    }
};

function exportData(format) {
    const data = {
        platform: state.currentPlatform,
        prompt: elements.promptInput ? elements.promptInput.value : '',
        negativePrompt: elements.negativePrompt ? elements.negativePrompt.value : '',
        settings: {
            quality: elements.qualityPreset ? elements.qualityPreset.value : 'medium',
            aspectRatio: elements.aspectRatio ? elements.aspectRatio.value : '16:9',
            styleStrength: elements.styleStrength ? elements.styleStrength.value : '5'
        },
        timestamp: new Date().toISOString()
    };
    
    let content, filename, mimeType;
    
    switch (format) {
        case 'json':
            content = JSON.stringify(data, null, 2);
            filename = 'ai-prompt.json';
            mimeType = 'application/json';
            break;
        case 'txt':
            content = `Platform: ${data.platform}\n\nPrompt:\n${data.prompt}\n\nNegative Prompt:\n${data.negativePrompt}\n\nSettings:\n${JSON.stringify(data.settings, null, 2)}`;
            filename = 'ai-prompt.txt';
            mimeType = 'text/plain';
            break;
        case 'csv':
            content = 'Platform,Prompt,Negative Prompt,Quality,Aspect Ratio,Style Strength\n';
            content += `"${data.platform}","${data.prompt}","${data.negativePrompt}","${data.settings.quality}","${data.settings.aspectRatio}","${data.settings.styleStrength}"`;
            filename = 'ai-prompt.csv';
            mimeType = 'text/csv';
            break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast(`Exported as ${format.toUpperCase()}`, 'success');
}

function importData() {
    if (!elements.importFile || !elements.importFile.files) return;
    
    const file = elements.importFile.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                data = JSON.parse(e.target.result);
                if (elements.promptInput) elements.promptInput.value = data.prompt || '';
                if (elements.negativePrompt) elements.negativePrompt.value = data.negativePrompt || '';
                if (data.platform) switchPlatform(data.platform);
                if (data.settings) {
                    if (data.settings.quality && elements.qualityPreset) elements.qualityPreset.value = data.settings.quality;
                    if (data.settings.aspectRatio && elements.aspectRatio) elements.aspectRatio.value = data.settings.aspectRatio;
                    if (data.settings.styleStrength && elements.styleStrength) elements.styleStrength.value = data.settings.styleStrength;
                }
            } else {
                // Plain text import
                if (elements.promptInput) elements.promptInput.value = e.target.result;
            }
            
            updatePreview();
            showToast('Imported successfully!', 'success');
        } catch (error) {
            showToast('Import failed', 'error');
        }
    };
    
    reader.readAsText(file);
}

function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                enhancePrompt();
                break;
            case 'k':
                e.preventDefault();
                clearPrompt();
                break;
            case 'c':
                if (e.shiftKey) {
                    e.preventDefault();
                    copyPrompt();
                }
                break;
            case 's':
                e.preventDefault();
                addToFavorites();
                break;
        }
    }
}

function showToast(message, type = 'success') {
    console.log('Toast:', message, type);
    
    if (!elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

function saveToStorage() {
    const saveData = {
        currentPlatform: state.currentPlatform,
        currentTheme: state.currentTheme,
        history: state.history.slice(0, 50),
        favorites: state.favorites.slice(0, 50)
    };
    
    try {
        window.appState = saveData;
    } catch (error) {
        console.log('Storage not available');
    }
}

function loadFromStorage() {
    try {
        const saved = window.appState;
        if (saved) {
            if (saved.currentPlatform) switchPlatform(saved.currentPlatform);
            if (saved.currentTheme) switchTheme(saved.currentTheme);
            if (saved.history) state.history = saved.history;
            if (saved.favorites) state.favorites = saved.favorites;
            updateHistoryDisplay();
        }
    } catch (error) {
        console.log('No saved state available');
    }
}