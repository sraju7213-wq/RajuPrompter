// Advanced AI Prompt Generator Pro - Extended Library and Features
// This file contains the comprehensive library system and advanced functionality

// Extended Prompt Library with comprehensive categories and templates
const EXTENDED_PROMPT_LIBRARY = {
    photography: {
        portrait: [
            {
                id: "port_001",
                title: "Professional Headshot",
                description: "Corporate professional headshot with clean background",
                category: "portrait",
                style: "professional",
                template: "professional headshot of {subject}, {background}, sharp focus, {lighting}, confident expression, {camera_settings}, corporate photography style",
                tags: ["professional", "corporate", "headshot", "clean"],
                quality: "high",
                complexity: "medium"
            },
            {
                id: "port_002",
                title: "Environmental Portrait",
                description: "Subject in their natural environment or workplace",
                category: "portrait",
                style: "documentary",
                template: "environmental portrait of {subject} in {environment}, {lighting}, authentic moment, {camera_settings}, documentary style",
                tags: ["environmental", "documentary", "workplace", "authentic"],
                quality: "high",
                complexity: "high"
            },
            {
                id: "port_003",
                title: "Fashion Portrait",
                description: "High-fashion portrait with dramatic styling",
                category: "portrait",
                style: "fashion",
                template: "fashion portrait of {subject}, {outfit}, {makeup}, {lighting}, {pose}, high fashion, editorial style, {camera_settings}",
                tags: ["fashion", "editorial", "dramatic", "styling"],
                quality: "premium",
                complexity: "high"
            }
        ],
        landscape: [
            {
                id: "land_001",
                title: "Mountain Landscape",
                description: "Majestic mountain scenery with atmospheric conditions",
                category: "landscape",
                style: "natural",
                template: "mountain landscape photograph, {mountain_range}, {time_of_day}, {weather_conditions}, {foreground_elements}, wide angle lens, {quality}",
                tags: ["mountain", "scenic", "nature", "wide-angle"],
                quality: "high",
                complexity: "medium"
            },
            {
                id: "land_002",
                title: "Seascape",
                description: "Ocean and coastal photography with dynamic water",
                category: "landscape",
                style: "seascape",
                template: "seascape photograph, {coastline}, {wave_conditions}, {sky_conditions}, long exposure, {foreground}, dramatic lighting",
                tags: ["ocean", "coast", "waves", "long-exposure"],
                quality: "high",
                complexity: "high"
            },
            {
                id: "land_003",
                title: "Urban Landscape",
                description: "City skylines and urban architecture",
                category: "landscape",
                style: "urban",
                template: "urban landscape, {city_skyline}, {time_of_day}, {weather}, architectural details, {perspective}, modern cityscape",
                tags: ["urban", "skyline", "architecture", "modern"],
                quality: "high",
                complexity: "medium"
            }
        ],
        macro: [
            {
                id: "macro_001",
                title: "Flower Macro",
                description: "Extreme close-up of flowers with intricate details",
                category: "macro",
                style: "natural",
                template: "macro photography of {flower_type}, extreme close-up, {lighting}, water droplets, shallow depth of field, {background}",
                tags: ["macro", "flower", "close-up", "nature"],
                quality: "ultra",
                complexity: "high"
            },
            {
                id: "macro_002",
                title: "Insect Macro",
                description: "Detailed insect photography with precision focus",
                category: "macro",
                style: "scientific",
                template: "macro photograph of {insect_type}, {pose}, {environment}, precision focus, {lighting}, scientific detail, {magnification}",
                tags: ["macro", "insect", "scientific", "detail"],
                quality: "ultra",
                complexity: "expert"
            }
        ]
    },
    
    illustration: {
        digital: [
            {
                id: "dig_001",
                title: "Concept Art Character",
                description: "Game or film character concept art",
                category: "digital",
                style: "concept",
                template: "digital concept art of {character}, {pose}, {outfit}, {environment}, {mood}, detailed character design, professional concept art style",
                tags: ["concept-art", "character", "game", "film"],
                quality: "premium",
                complexity: "expert"
            },
            {
                id: "dig_002",
                title: "Environment Concept",
                description: "Fantasy or sci-fi environment concept art",
                category: "digital",
                style: "environment",
                template: "environment concept art, {setting}, {mood}, {lighting}, {atmosphere}, {architectural_elements}, matte painting style",
                tags: ["environment", "concept", "fantasy", "sci-fi"],
                quality: "premium",
                complexity: "expert"
            }
        ],
        traditional: [
            {
                id: "trad_001",
                title: "Oil Painting Style",
                description: "Traditional oil painting technique simulation",
                category: "traditional",
                style: "oil-painting",
                template: "oil painting of {subject}, {color_palette}, traditional painting techniques, {brush_strokes}, {texture}, classical art style",
                tags: ["oil-painting", "traditional", "classical", "texture"],
                quality: "premium",
                complexity: "high"
            },
            {
                id: "trad_002",
                title: "Watercolor Illustration",
                description: "Soft watercolor painting with organic flow",
                category: "traditional",
                style: "watercolor",
                template: "watercolor illustration of {subject}, {color_flow}, soft edges, {paper_texture}, traditional watercolor techniques, organic style",
                tags: ["watercolor", "soft", "organic", "traditional"],
                quality: "high",
                complexity: "medium"
            }
        ]
    },

    "3d-render": {
        architectural: [
            {
                id: "arch_001",
                title: "Modern Building Exterior",
                description: "Contemporary architectural visualization",
                category: "architectural",
                style: "modern",
                template: "3D architectural rendering, {building_type}, modern design, {materials}, {lighting_setup}, {environment}, photorealistic quality",
                tags: ["architecture", "modern", "exterior", "realistic"],
                quality: "ultra",
                complexity: "expert"
            },
            {
                id: "arch_002",
                title: "Interior Visualization",
                description: "Detailed interior space rendering",
                category: "architectural",
                style: "interior",
                template: "interior 3D rendering, {room_type}, {style}, {furniture}, {lighting}, {materials}, {atmosphere}, architectural visualization",
                tags: ["interior", "space", "furniture", "lighting"],
                quality: "ultra",
                complexity: "expert"
            }
        ],
        product: [
            {
                id: "prod_001",
                title: "Product Showcase",
                description: "Commercial product rendering with perfect lighting",
                category: "product",
                style: "commercial",
                template: "3D product render of {product}, {angle}, {lighting_setup}, {background}, {materials}, commercial photography style, {quality}",
                tags: ["product", "commercial", "showcase", "lighting"],
                quality: "ultra",
                complexity: "high"
            }
        ]
    },

    anime: {
        character: [
            {
                id: "ani_001",
                title: "Anime Character Portrait",
                description: "Detailed anime character with expressive features",
                category: "character",
                style: "modern-anime",
                template: "anime character portrait, {character_type}, {expression}, {hair_style}, {eye_color}, {outfit}, detailed anime art, {art_style}",
                tags: ["anime", "character", "portrait", "detailed"],
                quality: "high",
                complexity: "medium"
            },
            {
                id: "ani_002",
                title: "Chibi Character",
                description: "Cute chibi-style character with exaggerated features",
                category: "character",
                style: "chibi",
                template: "chibi style {character}, cute proportions, {expression}, {pose}, {colors}, kawaii aesthetic, adorable style",
                tags: ["chibi", "cute", "kawaii", "adorable"],
                quality: "medium",
                complexity: "low"
            }
        ],
        scene: [
            {
                id: "scene_001",
                title: "Anime Landscape",
                description: "Beautiful anime-style background scenery",
                category: "scene",
                style: "background",
                template: "anime style landscape, {setting}, {time_of_day}, {weather}, {colors}, detailed background art, Studio Ghibli inspired",
                tags: ["anime", "landscape", "background", "ghibli"],
                quality: "high",
                complexity: "high"
            }
        ]
    },

    artistic: {
        abstract: [
            {
                id: "abs_001",
                title: "Abstract Composition",
                description: "Non-representational artistic composition",
                category: "abstract",
                style: "modern",
                template: "abstract art composition, {color_scheme}, {shapes}, {texture}, {movement}, modern abstract style, {medium}",
                tags: ["abstract", "composition", "modern", "artistic"],
                quality: "high",
                complexity: "medium"
            }
        ],
        surreal: [
            {
                id: "surr_001",
                title: "Surreal Scene",
                description: "Dreamlike surreal artistic composition",
                category: "surreal",
                style: "dreamlike",
                template: "surreal art scene, {impossible_elements}, dreamlike atmosphere, {color_palette}, {style_reference}, surrealism, {mood}",
                tags: ["surreal", "dreamlike", "impossible", "artistic"],
                quality: "premium",
                complexity: "expert"
            }
        ]
    }
};

// Advanced Quality Parameters
const QUALITY_PARAMETERS = {
    ultra: {
        descriptors: ["masterpiece", "ultra detailed", "8K resolution", "professional quality", "award winning"],
        technical: ["sharp focus", "perfect composition", "optimal lighting", "color accuracy", "texture detail"],
        enhancement: ["AI enhanced", "optimized parameters", "professional grade"]
    },
    premium: {
        descriptors: ["high quality", "detailed artwork", "professional", "polished"],
        technical: ["good focus", "balanced composition", "proper lighting", "color balance"],
        enhancement: ["enhanced quality", "optimized"]
    },
    high: {
        descriptors: ["good quality", "detailed", "well composed"],
        technical: ["clear focus", "decent composition", "adequate lighting"],
        enhancement: ["quality enhanced"]
    },
    medium: {
        descriptors: ["decent quality", "readable details"],
        technical: ["acceptable focus", "basic composition"],
        enhancement: ["basic enhancement"]
    }
};

// Style Modifiers with Detailed Parameters
const STYLE_MODIFIERS = {
    strength: {
        1: { name: "Minimal", descriptors: ["subtle hint of", "barely noticeable", "whisper of"] },
        2: { name: "Very Light", descriptors: ["slight", "gentle touch of", "faint"] },
        3: { name: "Light", descriptors: ["light", "mild", "soft"] },
        4: { name: "Moderate-Light", descriptors: ["noticeable", "clear", "evident"] },
        5: { name: "Balanced", descriptors: ["balanced", "harmonious", "well-integrated"] },
        6: { name: "Moderate-Strong", descriptors: ["strong", "pronounced", "distinct"] },
        7: { name: "Strong", descriptors: ["dominant", "bold", "striking"] },
        8: { name: "Very Strong", descriptors: ["heavy", "intense", "powerful"] },
        9: { name: "Extreme", descriptors: ["extreme", "overwhelming", "maximum"] },
        10: { name: "Complete Override", descriptors: ["total", "complete", "absolute"] }
    }
};

// Lighting System with Advanced Presets
const ADVANCED_LIGHTING_PRESETS = {
    "natural-daylight": {
        primary: "natural daylight",
        secondary: "soft ambient lighting",
        mood: "bright and airy",
        technical: "balanced exposure, natural color temperature"
    },
    "golden-hour": {
        primary: "golden hour lighting",
        secondary: "warm directional light",
        mood: "romantic and warm",
        technical: "low angle sun, warm color temperature 2700K"
    },
    "blue-hour": {
        primary: "blue hour lighting",
        secondary: "cool ambient twilight",
        mood: "mysterious and ethereal",
        technical: "cool color temperature 6500K, soft shadows"
    },
    "studio-portrait": {
        primary: "professional studio lighting",
        secondary: "key light with fill and rim",
        mood: "professional and controlled",
        technical: "3-point lighting setup, controlled shadows"
    },
    "dramatic-chiaroscuro": {
        primary: "dramatic chiaroscuro lighting",
        secondary: "high contrast directional",
        mood: "dramatic and moody",
        technical: "strong directional light, deep shadows"
    },
    "soft-diffused": {
        primary: "soft diffused lighting",
        secondary: "even illumination",
        mood: "gentle and flattering",
        technical: "large light source, minimal shadows"
    },
    "backlighting": {
        primary: "backlit subject",
        secondary: "rim lighting effect",
        mood: "ethereal and glowing",
        technical: "light source behind subject, lens flare potential"
    },
    "candlelight": {
        primary: "warm candlelight",
        secondary: "flickering warm illumination",
        mood: "intimate and cozy",
        technical: "warm color temperature 2000K, dancing shadows"
    }
};

// Color Palette Systems
const COLOR_PALETTES = {
    "warm-earth": {
        primary: ["#8B4513", "#CD853F", "#DEB887", "#F4A460"],
        description: "warm earthy tones",
        mood: "cozy and natural",
        application: "portraits, landscapes, rustic themes"
    },
    "cool-blues": {
        primary: ["#191970", "#4169E1", "#6495ED", "#87CEEB"],
        description: "cool blue spectrum",
        mood: "calm and professional",
        application: "corporate, tech, water scenes"
    },
    "vibrant-sunset": {
        primary: ["#FF4500", "#FF6347", "#FFA500", "#FFD700"],
        description: "vibrant sunset colors",
        mood: "energetic and warm",
        application: "dynamic scenes, celebrations"
    },
    "pastel-soft": {
        primary: ["#FFB6C1", "#E6E6FA", "#F0F8FF", "#F5F5DC"],
        description: "soft pastel colors",
        mood: "gentle and dreamy",
        application: "romantic, soft illustrations"
    },
    "monochrome": {
        primary: ["#000000", "#404040", "#808080", "#C0C0C0", "#FFFFFF"],
        description: "monochrome grayscale",
        mood: "classic and timeless",
        application: "artistic, dramatic, classic"
    }
};

// Advanced Camera Settings Database
const CAMERA_SETTINGS = {
    portrait: {
        "85mm-prime": "85mm prime lens, f/1.4, shallow depth of field",
        "50mm-standard": "50mm lens, f/1.8, natural perspective",
        "135mm-telephoto": "135mm telephoto, f/2.0, compressed perspective"
    },
    landscape: {
        "14mm-ultra-wide": "14mm ultra-wide lens, f/8, hyperfocal focus",
        "24mm-wide": "24mm wide angle, f/11, deep focus",
        "70-200mm-telephoto": "70-200mm telephoto, f/8, compressed landscape"
    },
    macro: {
        "100mm-macro": "100mm macro lens, f/16, 1:1 magnification",
        "60mm-macro": "60mm macro lens, f/11, close focus",
        "specialized-macro": "specialized macro setup, focus stacking"
    }
};

// Template Processing Engine
class PromptTemplateEngine {
    constructor() {
        this.library = EXTENDED_PROMPT_LIBRARY;
        this.qualityParams = QUALITY_PARAMETERS;
        this.lightingPresets = ADVANCED_LIGHTING_PRESETS;
        this.colorPalettes = COLOR_PALETTES;
        this.cameraSettings = CAMERA_SETTINGS;
    }

    // Generate advanced prompt with template
    generateFromTemplate(templateId, customParams = {}) {
        const template = this.findTemplate(templateId);
        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }

        let prompt = template.template;
        
        // Apply quality parameters
        const qualityLevel = template.quality || 'high';
        const qualityParams = this.qualityParams[qualityLevel];
        
        // Replace template variables
        Object.keys(customParams).forEach(key => {
            const regex = new RegExp(`{${key}}`, 'g');
            prompt = prompt.replace(regex, customParams[key]);
        });

        // Apply automatic enhancements
        if (qualityParams) {
            prompt += ', ' + qualityParams.descriptors.slice(0, 3).join(', ');
            prompt += ', ' + qualityParams.technical.slice(0, 2).join(', ');
        }

        return {
            prompt: prompt,
            template: template,
            quality: qualityLevel,
            complexity: template.complexity
        };
    }

    // Find template by ID
    findTemplate(templateId) {
        for (const category of Object.values(this.library)) {
            for (const subcategory of Object.values(category)) {
                if (Array.isArray(subcategory)) {
                    const template = subcategory.find(t => t.id === templateId);
                    if (template) return template;
                }
            }
        }
        return null;
    }

    // Get all templates by category
    getTemplatesByCategory(category) {
        return this.library[category] || {};
    }

    // Search templates by tags
    searchTemplates(searchTags) {
        const results = [];
        
        for (const category of Object.values(this.library)) {
            for (const subcategory of Object.values(category)) {
                if (Array.isArray(subcategory)) {
                    subcategory.forEach(template => {
                        const matchingTags = template.tags.filter(tag => 
                            searchTags.some(searchTag => 
                                tag.toLowerCase().includes(searchTag.toLowerCase())
                            )
                        );
                        
                        if (matchingTags.length > 0) {
                            results.push({
                                ...template,
                                relevance: matchingTags.length / searchTags.length
                            });
                        }
                    });
                }
            }
        }

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    // Generate style-specific enhancement
    applyStyleEnhancement(basePrompt, styleCategory, strength = 5) {
        const styleModifier = STYLE_MODIFIERS.strength[strength];
        const enhancement = styleModifier.descriptors[0];
        
        // Category-specific enhancements
        const categoryEnhancements = {
            photography: ["professional photography", "perfect exposure", "sharp detail"],
            illustration: ["artistic illustration", "creative composition", "visual storytelling"],
            "3d-render": ["photorealistic rendering", "accurate materials", "professional lighting"],
            anime: ["anime art style", "character design", "vibrant colors"],
            artistic: ["artistic expression", "creative vision", "unique style"]
        };

        const enhancements = categoryEnhancements[styleCategory] || [];
        return `${basePrompt}, ${enhancement} ${enhancements.join(', ')}`;
    }

    // Apply lighting preset
    applyLighting(basePrompt, lightingType) {
        const lighting = this.lightingPresets[lightingType];
        if (!lighting) return basePrompt;

        return `${basePrompt}, ${lighting.primary}, ${lighting.secondary}, ${lighting.mood} mood`;
    }

    // Apply color palette
    applyColorPalette(basePrompt, paletteType) {
        const palette = this.colorPalettes[paletteType];
        if (!palette) return basePrompt;

        return `${basePrompt}, ${palette.description}, ${palette.mood} atmosphere`;
    }

    // Get template statistics
    getLibraryStats() {
        let totalTemplates = 0;
        const categoryStats = {};

        Object.entries(this.library).forEach(([category, subcategories]) => {
            let categoryTotal = 0;
            Object.values(subcategories).forEach(subcategory => {
                if (Array.isArray(subcategory)) {
                    categoryTotal += subcategory.length;
                }
            });
            categoryStats[category] = categoryTotal;
            totalTemplates += categoryTotal;
        });

        return {
            total: totalTemplates,
            byCategory: categoryStats,
            qualityLevels: Object.keys(this.qualityParams).length,
            lightingPresets: Object.keys(this.lightingPresets).length,
            colorPalettes: Object.keys(this.colorPalettes).length
        };
    }
}

// Library Management System
class LibraryManager {
    constructor() {
        this.customTemplates = this.loadCustomTemplates();
        this.favorites = this.loadFavorites();
        this.recentlyUsed = this.loadRecentlyUsed();
    }

    // Load custom templates from local storage
    loadCustomTemplates() {
        try {
            return JSON.parse(localStorage.getItem('customTemplates') || '[]');
        } catch (e) {
            console.error('Failed to load custom templates:', e);
            return [];
        }
    }

    // Save custom template
    saveCustomTemplate(template) {
        const newTemplate = {
            ...template,
            id: `custom_${Date.now()}`,
            dateCreated: new Date().toISOString(),
            isCustom: true
        };

        this.customTemplates.push(newTemplate);
        this.saveCustomTemplates();
        return newTemplate.id;
    }

    // Save custom templates to local storage
    saveCustomTemplates() {
        try {
            localStorage.setItem('customTemplates', JSON.stringify(this.customTemplates));
        } catch (e) {
            console.error('Failed to save custom templates:', e);
        }
    }

    // Load favorites from local storage
    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('favoriteTemplates') || '[]');
        } catch (e) {
            console.error('Failed to load favorites:', e);
            return [];
        }
    }

    // Add to favorites
    addToFavorites(templateId) {
        if (!this.favorites.includes(templateId)) {
            this.favorites.push(templateId);
            this.saveFavorites();
        }
    }

    // Remove from favorites
    removeFromFavorites(templateId) {
        this.favorites = this.favorites.filter(id => id !== templateId);
        this.saveFavorites();
    }

    // Save favorites to local storage
    saveFavorites() {
        try {
            localStorage.setItem('favoriteTemplates', JSON.stringify(this.favorites));
        } catch (e) {
            console.error('Failed to save favorites:', e);
        }
    }

    // Load recently used from local storage
    loadRecentlyUsed() {
        try {
            return JSON.parse(localStorage.getItem('recentTemplates') || '[]');
        } catch (e) {
            console.error('Failed to load recent templates:', e);
            return [];
        }
    }

    // Add to recently used
    addToRecentlyUsed(templateId) {
        this.recentlyUsed = this.recentlyUsed.filter(id => id !== templateId);
        this.recentlyUsed.unshift(templateId);
        
        // Keep only the 20 most recent
        if (this.recentlyUsed.length > 20) {
            this.recentlyUsed = this.recentlyUsed.slice(0, 20);
        }
        
        this.saveRecentlyUsed();
    }

    // Save recently used to local storage
    saveRecentlyUsed() {
        try {
            localStorage.setItem('recentTemplates', JSON.stringify(this.recentlyUsed));
        } catch (e) {
            console.error('Failed to save recent templates:', e);
        }
    }

    // Export library data
    exportLibrary() {
        return {
            customTemplates: this.customTemplates,
            favorites: this.favorites,
            recentlyUsed: this.recentlyUsed,
            exportDate: new Date().toISOString(),
            version: "1.0"
        };
    }

    // Import library data
    importLibrary(data) {
        try {
            if (data.customTemplates) {
                this.customTemplates = [...this.customTemplates, ...data.customTemplates];
                this.saveCustomTemplates();
            }
            
            if (data.favorites) {
                this.favorites = [...new Set([...this.favorites, ...data.favorites])];
                this.saveFavorites();
            }
            
            return true;
        } catch (e) {
            console.error('Failed to import library:', e);
            return false;
        }
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EXTENDED_PROMPT_LIBRARY,
        QUALITY_PARAMETERS,
        STYLE_MODIFIERS,
        ADVANCED_LIGHTING_PRESETS,
        COLOR_PALETTES,
        CAMERA_SETTINGS,
        PromptTemplateEngine,
        LibraryManager
    };
}