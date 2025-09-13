// Chota Dhamakaa Prompt Generator - JavaScript

let currentTheme = 'cyberpunk_neon';
const themes = {
    dark_professional: { primary: '#3b82f6', background: '#0f172a' },
    light_modern: { primary: '#0ea5e9', background: '#ffffff' },
    cyberpunk_neon: { primary: '#00ff88', background: '#000000' },
    warm_autumn: { primary: '#d97706', background: '#1c1917' },
    ocean_blue: { primary: '#0284c7', background: '#082f49' },
    pastel_dreams: { primary: '#a855f7', background: '#fefce8' },
    forest_green: { primary: '#059669', background: '#022c22' },
    sunset_gradient: { primary: '#f59e0b', background: '#431407' }
};

function applyTheme(themeName) {
    currentTheme = themeName;
    document.body.setAttribute('data-theme', themeName);
    if (themes[themeName]) {
        document.documentElement.style.setProperty('--theme-primary', themes[themeName].primary);
        document.documentElement.style.setProperty('--theme-background', themes[themeName].background);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');

    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.addEventListener('change', e => applyTheme(e.target.value));
        applyTheme(themeSelect.value);
    }
    
    // Data templates and settings
    const promptData = {
        promptTemplates: {
            portrait: [
                "Professional headshot of a beautiful Latina woman with black hair, elegant makeup, studio lighting, high-end fashion photography style",
                "Artistic portrait of a stunning Latina woman with black hair, dramatic lighting, cinematic composition, professional photography",
                "Beauty portrait of a gorgeous Latina woman with black hair, soft natural lighting, minimal makeup, clean background"
            ],
            illustration: [
                "Digital illustration of a beautiful Latina woman with black hair, vibrant colors, modern art style, detailed artwork",
                "Watercolor painting of an elegant Latina woman with black hair, soft brushstrokes, artistic interpretation",
                "Oil painting portrait of a stunning Latina woman with black hair, classical art style, rich textures"
            ],
            anime: [
                "Anime style illustration of a beautiful Latina woman with black hair, large expressive eyes, colorful art style",
                "Manga character design of a stunning Latina woman with black hair, detailed anime artwork, Japanese art style"
            ],
            cinematic: [
                "Cinematic portrait of a beautiful Latina woman with black hair, movie poster style, dramatic lighting, Hollywood glamour",
                "Film noir style portrait of an elegant Latina woman with black hair, black and white photography, vintage aesthetics"
            ]
        },
        qualityTags: [
            "masterpiece", "best quality", "high resolution", "photorealistic", "intricate", 
            "rich background", "wallpaper", "official art", "raw photo", "8K", "UHD", "ultra high res"
        ],
        emphasizeTags: [
            "(masterpiece:1.4)", "(best quality:1.3)", "(photorealistic:1.2)", 
            "(beautiful Latina woman:1.3)", "(black hair:1.2)", "(close up portrait:1.2)"
        ],
        cameraSettings: [
            "Shot with a Nikon D850, a 50mm lens at f/2.8",
            "Shot with a Canon EOS R5, an 85mm lens at f/1.4",
            "Shot with a Sony A7R IV, a 35mm lens at f/2.0",
            "Shot with a Fujifilm X-T4, a 56mm lens at f/1.2",
            "Shot with a Nikon Z9, a 70-200mm lens at f/2.8"
        ],
        lightingTypes: [
            "studio lighting", "natural lighting", "dramatic lighting", "soft lighting",
            "golden hour lighting", "cinematic lighting", "rim lighting", "volumetric lighting"
        ],
        backgroundOptions: [
            "clean white background", "urban cityscape", "natural outdoor setting",
            "elegant indoor studio", "artistic bokeh background", "minimalist background", "textured background"
        ],
        styleModifiers: [
            "professional photography", "fashion photography", "portrait photography",
            "artistic photography", "commercial photography", "editorial photography", "beauty photography"
        ]
    };
    
    // Global state
    let history = [];
    let favorites = [];
    let lastPrompt = null;
    let isGenerating = false;
    
    // Utility functions
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    function getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Core prompt generation functions
    function processUserInput(input) {
        let processed = input;
        
        // Replace celebrity names with "Latina babe"
        processed = processed.replace(/\b(taylor swift|selena gomez|jennifer aniston|emma stone|scarlett johansson)\b/gi, 'Latina babe');
        
        // Replace regional features
        processed = processed.replace(/\b(blonde|blond)\b/gi, 'black');
        processed = processed.replace(/\b(blue eyes|green eyes)\b/gi, 'brown eyes');
        processed = processed.replace(/\b(caucasian|asian|european|american)\b/gi, 'Latina');
        
        // Remove expression words
        processed = processed.replace(/\b(smil(e|es|ing)|grin(ning)?|laugh(ing)?)\b/gi, '');
        
        // Add close up portrait if not present
        if (!processed.toLowerCase().includes('portrait')) {
            processed = 'close up portrait, ' + processed;
        }
        
        // Ensure it mentions Latina woman
        if (!processed.toLowerCase().includes('latina')) {
            processed = processed.replace(/woman/gi, 'Latina woman');
        }
        
        return processed.trim().replace(/\s+/g, ' ');
    }
    
    function createSimplePrompt(base, type) {
        const qualityTag = getRandomItem(promptData.emphasizeTags.slice(0, 3));
        const subjectTag = "(beautiful Latina woman:1.3), (black hair:1.2), (close up portrait:1.2)";
        const lighting = getRandomItem(promptData.lightingTypes);
        const camera = getRandomItem(promptData.cameraSettings);
        
        let prompt = `${qualityTag}, ${subjectTag}, ${base}, ${lighting}. ${camera}`;
        
        // Ensure word count is around 50-70 words
        const words = prompt.split(/\s+/);
        if (words.length < 50) {
            prompt += `, professional quality, detailed composition, artistic excellence, high-end production values`;
        } else if (words.length > 70) {
            prompt = words.slice(0, 68).join(' ') + '...';
        }
        
        return prompt;
    }
    
    function createDetailedPrompt(base, type) {
        const qualityTags = getRandomItems(promptData.qualityTags, 3).map(tag => `(${tag}:1.2)`).join(', ');
        const subjectDetails = "(stunning beautiful Latina woman:1.4), (gorgeous black hair:1.3), (close up portrait:1.3), (brown eyes:1.2), (olive skin:1.1), (natural makeup:1.1)";
        const lighting = getRandomItem(promptData.lightingTypes);
        const background = getRandomItem(promptData.backgroundOptions);
        const style = getRandomItem(promptData.styleModifiers);
        const camera = getRandomItem(promptData.cameraSettings);
        
        let detailedDescription = expandPromptDetails(base, type);
        
        let prompt = `${qualityTags}, ${subjectDetails}, ${detailedDescription}, ${lighting}, ${background}, ${style}. Composition features elegant framing with perfect focus and depth of field, creating a masterful representation of Latina beauty and grace. Professional color grading and post-processing enhance the natural skin tones and hair texture. The overall aesthetic captures both contemporary fashion sensibilities and timeless portrait elegance, showcasing cultural heritage with modern artistic vision. Advanced photography techniques ensure optimal lighting distribution and sophisticated visual storytelling. High-end professional photography equipment ensures exceptional image quality with precise color reproduction and sharp detail rendering. The artistic direction emphasizes authentic representation while maintaining commercial appeal and artistic integrity throughout the composition. ${camera}`;
        
        return prompt;
    }
    
    function expandPromptDetails(base, type) {
        const additions = {
            portrait: "Professional studio setup with controlled lighting creating soft shadows and highlights. Elegant posture showcasing confidence and natural beauty with sophisticated styling.",
            illustration: "Artistic interpretation with rich color palette and detailed brushwork. Creative composition emphasizing artistic vision and cultural heritage with contemporary flair.",
            anime: "Japanese animation style with large expressive eyes and stylized features. Vibrant colors and dynamic composition typical of high-quality manga artwork.",
            cinematic: "Hollywood-style glamour photography with dramatic lighting and sophisticated composition. Movie poster aesthetic with professional styling and cinematic depth.",
            landscape: "Environmental portrait integration with natural scenery. Harmonious balance between subject and natural landscape elements creating compelling visual narrative.",
            drawing: "Traditional art techniques with careful attention to line work and shading. Realistic representation using professional graphite or charcoal medium with artistic mastery.",
            wildlife: "Nature photography elements with environmental context. Documentary style composition showcasing connection with natural world and wildlife conservation themes."
        };
        
        return base + '. ' + (additions[type] || additions.portrait);
    }
    
    function generatePromptsByCommand(command) {
        let basePrompt;
        let type;
        
        switch (command.toLowerCase().trim()) {
            case 'n':
                const templates = Object.values(promptData.promptTemplates).flat();
                basePrompt = getRandomItem(templates);
                type = 'random';
                break;
            case 'v':
                if (lastPrompt) {
                    basePrompt = lastPrompt.simple.replace(/\b\w+ lighting\b/i, getRandomItem(promptData.lightingTypes));
                    type = 'variant';
                } else {
                    const templates = Object.values(promptData.promptTemplates).flat();
                    basePrompt = getRandomItem(templates);
                    type = 'random';
                }
                break;
            case 'np':
                basePrompt = getRandomItem(promptData.promptTemplates.portrait);
                type = 'portrait';
                break;
            case 'nl':
                basePrompt = "Beautiful Latina woman with black hair in natural landscape setting, outdoor photography, scenic background, environmental portrait";
                type = 'landscape';
                break;
            case 'ni':
                basePrompt = getRandomItem(promptData.promptTemplates.illustration);
                type = 'illustration';
                break;
            case 'nd':
                basePrompt = "Pencil drawing of a beautiful Latina woman with black hair, detailed sketch artwork, graphite illustration, artistic portrait";
                type = 'drawing';
                break;
            case 'nc':
                basePrompt = "Beautiful Latina woman with black hair in wildlife photography setting, nature documentary style, environmental portrait with animals";
                type = 'wildlife';
                break;
            case 'i':
                basePrompt = getRandomItem(promptData.promptTemplates.illustration);
                type = 'illustration-art';
                break;
            case 'a':
                basePrompt = getRandomItem(promptData.promptTemplates.anime);
                type = 'anime';
                break;
            default:
                basePrompt = processUserInput(command);
                type = 'custom';
        }
        
        return {
            simple: createSimplePrompt(basePrompt, type),
            detailed: createDetailedPrompt(basePrompt, type),
            type: type
        };
    }
    
    // DOM manipulation functions
    function showToast(message) {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toastMessage');
        
        if (toast && messageEl) {
            messageEl.textContent = message;
            toast.classList.remove('hidden');
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 250);
            }, 3000);
        }
    }
    
    function setLoading(loading) {
        const btn = document.getElementById('generateBtn');
        const spinner = btn?.querySelector('.loading-spinner');
        const text = btn?.querySelector('.btn-text');
        
        isGenerating = loading;
        
        if (btn) {
            if (loading) {
                btn.classList.add('loading');
                btn.disabled = true;
                if (spinner) spinner.classList.remove('hidden');
                if (text) text.style.opacity = '0';
            } else {
                btn.classList.remove('loading');
                btn.disabled = false;
                if (spinner) spinner.classList.add('hidden');
                if (text) text.style.opacity = '1';
            }
        }
    }
    
    function displayPrompts(prompts) {
        const simpleElement = document.getElementById('simplePrompt');
        const detailedElement = document.getElementById('detailedPrompt');
        const outputSection = document.getElementById('outputSection');
        
        console.log('Displaying prompts:', prompts);
        
        if (simpleElement && detailedElement && outputSection) {
            simpleElement.textContent = prompts.simple;
            detailedElement.textContent = prompts.detailed;
            outputSection.style.display = 'block';
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function addToHistory(input, prompts) {
        const historyItem = {
            id: Date.now(),
            input: input,
            prompts: prompts,
            timestamp: new Date().toLocaleString()
        };
        
        history.unshift(historyItem);
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        const container = document.getElementById('historyContainer');
        const section = document.getElementById('historySection');
        
        if (!container || !section) return;
        
        if (history.length === 0) {
            section.style.display = 'none';
            return;
        }
        
        section.style.display = 'block';
        container.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-item-content">
                    <div class="history-item-title">Input: "${item.input}" - ${item.timestamp}</div>
                    <div class="history-item-preview">${item.prompts.simple.substring(0, 100)}...</div>
                </div>
                <div class="history-item-actions">
                    <button class="action-btn" data-action="reuse" data-id="${item.id}" title="Reuse">🔄</button>
                    <button class="action-btn" data-action="favorite" data-id="${item.id}" title="Add to Favorites">⭐</button>
                    <button class="action-btn" data-action="delete" data-id="${item.id}" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Main generation function
    async function generatePrompts() {
        if (isGenerating) return;
        
        const input = document.getElementById('promptInput')?.value?.trim();
        if (!input) {
            showToast('Please enter a prompt or command');
            return;
        }
        
        console.log('Generating prompts for input:', input);
        
        setLoading(true);
        
        try {
            await delay(500); // Show loading state
            
            const prompts = generatePromptsByCommand(input);
            console.log('Generated prompts:', prompts);
            
            displayPrompts(prompts);
            addToHistory(input, prompts);
            lastPrompt = prompts;
            showToast('Prompts generated successfully!');
            
        } catch (error) {
            console.error('Error generating prompts:', error);
            showToast('Error generating prompts');
        } finally {
            setLoading(false);
        }
    }
    
    // Copy function
    function copyToClipboard(targetId) {
        const element = document.getElementById(targetId);
        if (!element) return;
        
        const text = element.textContent;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Copied to clipboard!');
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }
    
    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('Copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy');
        }
        
        document.body.removeChild(textArea);
    }
    
    // Event listeners
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const randomBtn = document.getElementById('randomBtn');
    const promptInput = document.getElementById('promptInput');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Generate button clicked');
            generatePrompts();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (promptInput) {
                promptInput.value = '';
                promptInput.focus();
            }
        });
    }
    
    if (randomBtn) {
        randomBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (promptInput) {
                promptInput.value = 'n';
                generatePrompts();
            }
        });
    }
    
    if (promptInput) {
        promptInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                generatePrompts();
            }
        });
    }
    
    // Copy button event listener
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn')) {
            e.preventDefault();
            const target = e.target.dataset.target;
            copyToClipboard(target);
        }
    });
    
    console.log('App initialization complete');
});
