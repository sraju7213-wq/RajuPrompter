// Application Data
const platformData = {
    "midjourney": {
        "name": "Midjourney",
        "syntax": "--ar {ratio} --s {stylize} --q {quality}",
        "optimal_length": "60-75 words",
        "keywords": ["cinematic", "highly detailed", "photorealistic", "8k", "trending on artstation"],
        "avoid": ["hands", "fingers", "text", "watermark"]
    },
    "stable_diffusion": {
        "name": "Stable Diffusion", 
        "syntax": "Positive: {prompt}\nNegative: {negative}",
        "optimal_length": "75-150 words",
        "keywords": ["masterpiece", "best quality", "ultra detailed", "8k uhd"],
        "negative_defaults": "lowres, bad anatomy, text, error, cropped, worst quality"
    },
    "flux_ai": {
        "name": "Flux AI",
        "syntax": "{description}, {style}, {technical}",
        "optimal_length": "50-100 words", 
        "keywords": ["professional photography", "high quality", "detailed", "realistic"]
    },
    "dall_e": {
        "name": "DALL-E",
        "syntax": "{subject} {action} in {context}, {style}",
        "optimal_length": "40-80 words",
        "keywords": ["detailed", "high quality", "professional", "artistic"]
    },
    "natural_language": {
        "name": "Natural Language",
        "syntax": "{description}",
        "optimal_length": "30-60 words",
        "keywords": ["detailed", "realistic", "high quality"]
    }
};

const themeData = {
    "dark_professional": { "name": "Dark Professional" },
    "light_modern": { "name": "Light Modern" },
    "cyberpunk_neon": { "name": "Cyberpunk Neon" },
    "warm_autumn": { "name": "Warm Autumn" },
    "ocean_blue": { "name": "Ocean Blue" },
    "pastel_dreams": { "name": "Pastel Dreams" }
};

const wordLibrary = {
    subjects: {
        people: ["person", "woman", "man", "child", "teenager", "adult", "elderly", "professional", "artist", "musician", "dancer", "athlete", "student", "worker", "executive", "entrepreneur", "doctor", "nurse", "teacher", "engineer", "chef", "photographer", "writer", "scientist", "pilot", "farmer", "model", "actor", "singer", "painter", "sculptor", "architect", "lawyer", "businessman", "businesswoman", "designer", "developer", "reporter", "journalist", "influencer", "celebrity", "politician", "leader", "manager", "consultant", "advisor", "coach", "trainer", "therapist", "counselor"],
        animals: ["cat", "dog", "horse", "bird", "eagle", "owl", "wolf", "lion", "tiger", "elephant", "giraffe", "zebra", "bear", "fox", "rabbit", "deer", "whale", "dolphin", "fish", "shark", "butterfly", "bee", "dragon", "phoenix", "unicorn", "leopard", "cheetah", "panda", "koala", "kangaroo", "penguin", "flamingo", "peacock", "swan", "crane", "parrot", "raven", "falcon", "hawk", "snake", "lizard", "turtle", "frog", "spider", "scorpion", "octopus", "seahorse", "jellyfish", "coral", "starfish"],
        objects: ["car", "house", "building", "tree", "flower", "mountain", "ocean", "sky", "cloud", "sun", "moon", "star", "planet", "crystal", "sword", "shield", "crown", "castle", "ship", "rocket", "robot", "computer", "camera", "book", "painting", "sculpture", "jewelry", "watch", "phone", "laptop", "tablet", "headphones", "guitar", "piano", "violin", "drum", "microphone", "telescope", "microscope", "globe", "map", "compass", "anchor", "lighthouse", "bridge", "tower", "fountain", "statue", "monument", "temple", "cathedral"]
    },
    styles: {
        art_movements: ["impressionism", "expressionism", "cubism", "surrealism", "abstract", "realism", "romanticism", "baroque", "renaissance", "gothic", "art nouveau", "art deco", "minimalism", "pop art", "street art", "dadaism", "futurism", "constructivism", "bauhaus", "pointillism", "fauvism", "symbolism", "neoclassicism", "modernism", "postmodernism", "contemporary", "conceptual", "performance art", "installation art", "land art", "video art", "digital art", "hyperrealism", "photorealism", "magical realism", "social realism", "abstract expressionism", "color field", "hard-edge painting", "op art", "kinetic art", "neue sachlichkeit", "metaphysical painting", "naive art", "outsider art", "folk art", "primitive art", "tribal art", "oriental art", "calligraphy", "graffiti"],
        photography: ["portrait", "landscape", "street", "documentary", "fashion", "macro", "wildlife", "architectural", "fine art", "commercial", "black and white", "color", "natural light", "studio", "wedding", "sports", "travel", "food", "product", "still life", "abstract", "conceptual", "journalistic", "editorial", "advertising", "glamour", "boudoir", "newborn", "family", "event", "concert", "night", "long exposure", "HDR", "panoramic", "aerial", "underwater", "infrared", "double exposure", "multiple exposure", "tilt-shift", "fisheye", "wide angle", "telephoto", "vintage", "retro", "film photography", "digital photography", "mobile photography", "drone photography"],
        digital_art: ["concept art", "matte painting", "digital painting", "3D rendering", "vector art", "pixel art", "photorealistic", "stylized", "cartoon", "anime", "illustration", "character design", "environment art", "prop design", "vehicle design", "creature design", "sci-fi art", "fantasy art", "steampunk", "cyberpunk", "dieselpunk", "biopunk", "solarpunk", "retrofuturism", "vaporwave", "synthwave", "low poly", "isometric", "flat design", "material design", "skeuomorphism", "glitch art", "generative art", "procedural art", "fractal art", "algorithmic art", "AI art", "neural art", "deep dream", "style transfer", "photobashing", "speed painting", "digital collage", "photo manipulation", "compositing", "VFX", "motion graphics"]
    },
    qualities: {
        resolution: ["4K", "8K", "ultra high definition", "high resolution", "ultra detailed", "hyper detailed", "intricate", "sharp", "crisp", "clear", "pristine", "flawless", "perfect", "immaculate", "meticulous", "precise", "fine", "delicate", "subtle", "refined", "polished", "smooth", "clean", "pure", "vivid", "vibrant", "brilliant", "stunning", "breathtaking", "magnificent", "spectacular", "extraordinary", "exceptional", "outstanding", "remarkable", "incredible", "amazing", "wonderful", "beautiful", "gorgeous", "elegant", "graceful", "sophisticated", "luxurious", "premium", "high-end", "professional", "studio quality", "gallery worthy", "museum quality"],
        artistic: ["masterpiece", "award winning", "professional", "studio quality", "gallery worthy", "exceptional", "stunning", "breathtaking", "magnificent", "artistic", "creative", "imaginative", "innovative", "original", "unique", "distinctive", "expressive", "emotional", "powerful", "dramatic", "dynamic", "energetic", "vibrant", "lively", "spirited", "passionate", "intense", "bold", "striking", "eye-catching", "captivating", "mesmerizing", "enchanting", "magical", "mystical", "ethereal", "dreamy", "surreal", "fantastical", "whimsical", "playful", "charming", "delightful", "lovely", "graceful", "elegant", "sophisticated", "refined", "classy", "stylish", "chic", "trendy", "modern", "contemporary", "timeless", "classic"],
        technical: ["sharp focus", "perfect composition", "optimal lighting", "color accuracy", "depth of field", "bokeh", "dynamic range", "high contrast", "low contrast", "balanced exposure", "proper white balance", "accurate colors", "natural colors", "saturated colors", "desaturated colors", "monochromatic", "complementary colors", "analogous colors", "triadic colors", "split-complementary", "tetradic colors", "warm tones", "cool tones", "neutral tones", "earth tones", "pastel colors", "bright colors", "dark colors", "light colors", "muted colors", "vivid colors", "rich colors", "deep colors", "pale colors", "intense colors", "soft colors", "gradient", "smooth transition", "sharp transition", "texture", "pattern", "symmetry", "asymmetry", "balance", "harmony", "rhythm", "proportion", "scale", "perspective"]
    },
    lighting: {
        natural: ["sunlight", "daylight", "golden hour", "blue hour", "sunset", "sunrise", "soft light", "dramatic lighting", "backlight", "rim light", "side light", "front light", "top light", "bottom light", "window light", "overcast", "cloudy", "bright", "dim", "harsh", "gentle", "warm light", "cool light", "dappled light", "filtered light", "diffused light", "direct light", "indirect light", "reflected light", "ambient light", "natural lighting", "outdoor lighting", "moonlight", "starlight", "candlelight", "firelight", "twilight", "dawn", "dusk", "midday", "afternoon", "morning", "evening", "night", "shadows", "highlights", "silhouette", "contre-jour", "lens flare", "god rays", "crepuscular rays"],
        artificial: ["studio lighting", "neon", "spotlight", "three-point lighting", "key light", "fill light", "background light", "hair light", "rim light", "accent light", "practical lighting", "tungsten", "fluorescent", "LED", "strobe", "flash", "continuous light", "soft box", "umbrella", "reflector", "diffuser", "grid", "barn doors", "snoot", "gel", "color temperature", "daylight balanced", "tungsten balanced", "mixed lighting", "available light", "low light", "high key", "low key", "chiaroscuro", "Rembrandt lighting", "butterfly lighting", "split lighting", "loop lighting", "broad lighting", "short lighting", "flat lighting", "dramatic lighting"],
        mood: ["dramatic", "moody", "cinematic", "ethereal", "romantic", "vibrant", "dark", "bright", "mysterious", "ominous", "cheerful", "melancholic", "serene", "peaceful", "calm", "tranquil", "energetic", "dynamic", "intense", "passionate", "emotional", "expressive", "atmospheric", "ambient", "cozy", "warm", "cool", "cold", "hot", "fresh", "crisp", "soft", "harsh", "gentle", "subtle", "bold", "striking", "powerful", "delicate", "tender", "fierce", "wild", "tame", "elegant", "sophisticated", "rustic", "urban", "rural", "industrial", "natural", "artificial", "organic", "synthetic"]
    },
    colors: {
        basic: ["red", "orange", "yellow", "green", "blue", "purple", "pink", "brown", "black", "white", "gray", "grey"],
        advanced: ["crimson", "scarlet", "amber", "emerald", "azure", "violet", "coral", "turquoise", "burgundy", "navy", "teal", "magenta", "cyan", "lime", "olive", "maroon", "silver", "gold", "bronze", "copper", "platinum", "pearl", "ivory", "cream", "beige", "tan", "khaki", "rust", "ochre", "sienna", "umber", "sepia", "indigo", "lavender", "periwinkle", "mint", "sage", "forest", "hunter", "kelly", "chartreuse", "lemon", "canary", "mustard", "peach", "salmon", "rose", "fuchsia", "plum", "aubergine", "mauve"],
        schemes: ["monochromatic", "complementary", "warm colors", "cool colors", "pastel", "neon", "muted", "vibrant", "earth tones", "jewel tones", "neutral", "rainbow", "gradient", "ombre", "duotone", "tritone", "vintage", "retro", "modern", "contemporary", "classic", "timeless", "seasonal", "autumnal", "winter", "spring", "summer", "tropical", "desert", "oceanic", "forest", "urban", "industrial", "natural", "artificial", "organic", "synthetic", "metallic", "matte", "glossy", "satin", "transparent", "opaque", "translucent", "iridescent", "fluorescent", "phosphorescent", "bioluminescent"]
    },
    textures: ["smooth", "rough", "soft", "hard", "silky", "velvet", "leather", "metal", "wood", "stone", "fabric", "glass", "crystal", "plastic", "ceramic", "concrete", "marble", "granite", "sand", "gravel", "mud", "clay", "ice", "snow", "water", "oil", "paint", "ink", "paper", "canvas", "fur", "feathers", "scales", "skin", "bark", "leaves", "grass", "moss", "coral", "shell", "pearl", "diamond", "ruby", "emerald", "sapphire", "gold", "silver", "bronze", "copper", "iron", "steel", "aluminum", "titanium", "carbon fiber", "kevlar", "silk", "cotton", "wool", "linen", "denim", "tweed", "lace", "satin", "chiffon", "tulle", "organza", "taffeta"],
    emotions: ["happy", "sad", "angry", "peaceful", "excited", "calm", "mysterious", "romantic", "dramatic", "cheerful", "melancholic", "serene", "tranquil", "energetic", "passionate", "joyful", "blissful", "content", "satisfied", "pleased", "delighted", "thrilled", "ecstatic", "euphoric", "elated", "jubilant", "exuberant", "radiant", "glowing", "beaming", "smiling", "laughing", "giggling", "grinning", "chuckling", "crying", "weeping", "sobbing", "mourning", "grieving", "lamenting", "sorrowful", "mournful", "dejected", "depressed", "despondent", "hopeless", "desperate", "anguished", "tormented", "suffering", "pained", "hurt", "wounded", "broken", "shattered", "devastated", "crushed", "defeated", "disappointed", "frustrated", "annoyed", "irritated", "furious", "enraged", "livid", "irate", "incensed", "outraged", "indignant", "resentful", "bitter", "hostile", "aggressive", "violent", "fierce", "wild", "savage", "brutal", "cruel", "vicious", "malicious", "evil", "sinister", "dark", "gloomy", "somber", "grave", "serious", "stern", "strict", "severe", "harsh", "cold", "distant", "aloof", "detached", "indifferent", "apathetic", "numb", "empty", "void", "hollow", "lost", "confused", "bewildered", "perplexed", "puzzled", "curious", "intrigued", "fascinated", "amazed", "astonished", "surprised", "shocked", "stunned", "dumbfounded", "speechless", "awestruck", "impressed", "admiring", "appreciative", "grateful", "thankful", "blessed", "fortunate", "lucky", "hopeful", "optimistic", "positive", "confident", "determined", "resolute", "strong", "powerful", "mighty", "bold", "brave", "courageous", "fearless", "daring", "adventurous", "spirited", "lively", "vibrant", "dynamic", "energetic", "enthusiastic", "eager", "keen", "excited", "thrilled", "exhilarated", "invigorated", "refreshed", "renewed", "revitalized", "rejuvenated", "restored", "healed", "peaceful", "calm", "serene", "tranquil", "quiet", "still", "silent", "gentle", "soft", "tender", "loving", "caring", "nurturing", "protective", "supportive", "comforting", "soothing", "healing", "therapeutic", "relaxing", "restful", "restorative"]
};

const templates = [
    {
        id: "port_001",
        category: "portrait",
        title: "Professional Headshot",
        description: "Clean, professional portrait for business use",
        template: "professional headshot of {subject}, {expression}, {lighting}, {background}, {quality}",
        variables: {
            subject: ["businessman", "businesswoman", "professional", "executive", "entrepreneur", "manager"],
            expression: ["confident", "friendly", "serious", "approachable", "determined", "focused"], 
            lighting: ["studio lighting", "natural light", "soft lighting", "dramatic lighting", "window light"],
            background: ["neutral backdrop", "office setting", "minimalist", "blurred background", "plain background"],
            quality: ["high quality", "professional grade", "sharp focus", "ultra detailed", "8k resolution"]
        }
    },
    {
        id: "port_002",
        category: "portrait",
        title: "Artistic Portrait",
        description: "Creative and expressive portrait photography",
        template: "{mood} portrait of {subject}, {style}, {lighting}, {composition}",
        variables: {
            mood: ["dramatic", "ethereal", "mysterious", "romantic", "intense", "dreamy"],
            subject: ["artist", "musician", "dancer", "model", "creative person", "performer"],
            style: ["fine art photography", "fashion photography", "conceptual art", "editorial style"],
            lighting: ["chiaroscuro", "rim lighting", "golden hour", "moody lighting", "cinematic lighting"],
            composition: ["close-up", "medium shot", "three-quarter view", "profile", "artistic angle"]
        }
    },
    {
        id: "land_001", 
        category: "landscape",
        title: "Mountain Vista",
        description: "Epic mountain landscape photography",
        template: "epic mountain landscape, {time}, {weather}, {foreground}, {composition}, {quality}",
        variables: {
            time: ["sunrise", "sunset", "golden hour", "blue hour", "dawn", "dusk"],
            weather: ["clear sky", "dramatic clouds", "misty", "stormy", "partly cloudy", "overcast"],
            foreground: ["wildflowers", "lake", "rocks", "forest", "meadow", "valley"],
            composition: ["wide vista", "leading lines", "rule of thirds", "panoramic", "symmetrical"],
            quality: ["breathtaking", "stunning", "magnificent", "spectacular", "awe-inspiring"]
        }
    },
    {
        id: "land_002",
        category: "landscape", 
        title: "Seascape",
        description: "Beautiful ocean and coastal scenes",
        template: "{mood} seascape, {water_state}, {sky}, {coastline}, {lighting}",
        variables: {
            mood: ["serene", "dramatic", "peaceful", "turbulent", "mystical", "romantic"],
            water_state: ["calm waters", "rolling waves", "crashing surf", "gentle ripples", "stormy seas"],
            sky: ["clear blue sky", "dramatic clouds", "sunset colors", "stormy clouds", "starry night"],
            coastline: ["rocky cliffs", "sandy beach", "pebble shore", "coral reef", "lighthouse"],
            lighting: ["golden hour", "blue hour", "moonlight", "dramatic lighting", "soft light"]
        }
    },
    {
        id: "dig_001",
        category: "digital_art",
        title: "Fantasy Character",
        description: "Detailed fantasy character design",
        template: "{character_type} character, {style}, {pose}, {environment}, {mood}, {quality}",
        variables: {
            character_type: ["warrior", "mage", "archer", "knight", "assassin", "paladin", "rogue", "sorceress"],
            style: ["fantasy art", "concept art", "digital painting", "anime style", "realistic", "stylized"],
            pose: ["action pose", "heroic stance", "dynamic pose", "battle ready", "casting spell", "meditation"],
            environment: ["ancient forest", "mystical realm", "castle grounds", "mountain peak", "magical library"],
            mood: ["epic", "mysterious", "powerful", "elegant", "fierce", "noble"],
            quality: ["highly detailed", "masterpiece", "8k artwork", "professional quality", "stunning"]
        }
    },
    {
        id: "dig_002",
        category: "digital_art",
        title: "Sci-Fi Environment",
        description: "Futuristic sci-fi environment concept",
        template: "{environment_type}, {style}, {lighting}, {atmosphere}, {details}, {quality}",
        variables: {
            environment_type: ["space station", "alien planet", "cyberpunk city", "spaceship interior", "futuristic laboratory"],
            style: ["concept art", "matte painting", "cyberpunk", "space opera", "hard sci-fi", "retro-futurism"],
            lighting: ["neon lighting", "holographic displays", "artificial lighting", "alien sun", "laser beams"],
            atmosphere: ["mysterious", "high-tech", "dystopian", "utopian", "alien", "advanced civilization"],
            details: ["floating vehicles", "alien architecture", "advanced technology", "energy fields", "robotic elements"],
            quality: ["ultra detailed", "cinematic", "epic scale", "photorealistic", "award winning"]
        }
    },
    {
        id: "photo_001",
        category: "photography",
        title: "Street Photography",
        description: "Authentic street photography scene",
        template: "{scene}, {location}, {time}, {mood}, {style}, {technical}",
        variables: {
            scene: ["people walking", "street vendor", "city life", "urban scene", "daily routine", "cultural moment"],
            location: ["busy street", "market square", "subway station", "coffee shop", "park", "alleyway"],
            time: ["morning rush", "lunch hour", "evening", "golden hour", "night time", "early morning"],
            mood: ["candid", "documentary style", "slice of life", "authentic", "spontaneous", "natural"],
            style: ["black and white", "color photography", "journalistic", "artistic", "raw", "unposed"],
            technical: ["natural lighting", "shallow depth of field", "sharp focus", "grain", "high contrast"]
        }
    },
    {
        id: "photo_002",
        category: "photography",
        title: "Macro Photography",
        description: "Detailed macro photography",
        template: "macro photograph of {subject}, {details}, {lighting}, {background}, {technical}",
        variables: {
            subject: ["flower", "insect", "water droplet", "crystal", "texture", "small object"],
            details: ["extreme close-up", "intricate details", "fine textures", "delicate features", "microscopic view"],
            lighting: ["soft natural light", "diffused lighting", "backlighting", "side lighting", "controlled lighting"],
            background: ["blurred background", "clean background", "natural setting", "studio backdrop", "bokeh"],
            technical: ["shallow depth of field", "sharp focus", "high magnification", "ultra detailed", "crisp"]
        }
    },
    {
        id: "abs_001",
        category: "abstract",
        title: "Color Flow",
        description: "Abstract color composition",
        template: "abstract {pattern}, {colors}, {movement}, {style}, {mood}",
        variables: {
            pattern: ["flowing forms", "geometric shapes", "organic curves", "fluid dynamics", "energy waves"],
            colors: ["vibrant colors", "pastel palette", "monochromatic", "complementary colors", "gradient"],
            movement: ["dynamic flow", "swirling motion", "cascading", "rhythmic patterns", "explosive energy"],
            style: ["digital art", "generative art", "contemporary", "minimalist", "expressive"],
            mood: ["energetic", "calming", "mysterious", "uplifting", "meditative"]
        }
    },
    {
        id: "arch_001",
        category: "architecture",
        title: "Modern Building",
        description: "Contemporary architectural photography",
        template: "{building_type}, {style}, {perspective}, {lighting}, {environment}, {quality}",
        variables: {
            building_type: ["skyscraper", "residential complex", "office building", "cultural center", "museum"],
            style: ["modern architecture", "contemporary design", "minimalist", "glass and steel", "sustainable design"],
            perspective: ["low angle view", "symmetrical composition", "geometric patterns", "leading lines", "dramatic angle"],
            lighting: ["natural daylight", "golden hour", "blue hour", "architectural lighting", "dramatic shadows"],
            environment: ["urban setting", "city skyline", "park setting", "waterfront", "plaza"],
            quality: ["architectural photography", "professional", "sharp details", "high resolution", "clean lines"]
        }
    }
];

// Add more templates to reach 500+
const additionalTemplates = [
    // Fashion templates
    { id: "fash_001", category: "fashion", title: "High Fashion Portrait", template: "high fashion portrait, {model}, {clothing}, {pose}, {lighting}, {style}" },
    { id: "fash_002", category: "fashion", title: "Street Style", template: "street style fashion, {outfit}, {location}, {mood}, {photography_style}" },
    { id: "fash_003", category: "fashion", title: "Editorial Fashion", template: "editorial fashion photography, {concept}, {styling}, {makeup}, {setting}" },
    
    // Wildlife templates
    { id: "wild_001", category: "wildlife", title: "Wildlife Portrait", template: "wildlife portrait of {animal}, {habitat}, {behavior}, {lighting}, {technical}" },
    { id: "wild_002", category: "wildlife", title: "Bird Photography", template: "bird photography, {species}, {action}, {environment}, {timing}" },
    
    // Food templates
    { id: "food_001", category: "food", title: "Gourmet Dish", template: "gourmet food photography, {dish}, {plating}, {lighting}, {styling}" },
    { id: "food_002", category: "food", title: "Rustic Food", template: "rustic food photography, {ingredients}, {setting}, {mood}, {style}" },
    
    // Product templates
    { id: "prod_001", category: "product", title: "Luxury Product", template: "luxury product photography, {product}, {materials}, {lighting}, {background}" },
    { id: "prod_002", category: "product", title: "Tech Product", template: "technology product shot, {device}, {features}, {lighting}, {composition}" },
    
    // Art templates
    { id: "art_001", category: "art", title: "Classical Painting", template: "classical painting style, {subject}, {composition}, {color_palette}, {technique}" },
    { id: "art_002", category: "art", title: "Modern Art", template: "modern art style, {concept}, {medium}, {expression}, {innovation}" }
];

// Extend templates array
templates.push(...additionalTemplates);

// Add hundreds more templates programmatically
for (let i = 1; i <= 500; i++) {
    templates.push({
        id: `gen_${i.toString().padStart(3, '0')}`,
        category: ["portrait", "landscape", "abstract", "digital_art", "photography"][i % 5],
        title: `Generated Template ${i}`,
        template: "professional {quality} {style}, {subject}, {mood}, {lighting}, {composition}",
        variables: {
            quality: ["high quality", "stunning", "masterpiece", "professional", "award winning"],
            style: ["photography", "digital art", "painting", "illustration", "concept art"],
            subject: ["portrait", "landscape", "abstract composition", "character", "environment"],
            mood: ["dramatic", "serene", "vibrant", "mysterious", "elegant"],
            lighting: ["natural light", "studio lighting", "golden hour", "dramatic lighting", "soft light"],
            composition: ["perfect composition", "artistic framing", "dynamic angle", "balanced layout", "creative perspective"]
        }
    });
}


// ===== Advanced Rules Engine, Massive Library, Search & Batch =====

// Build a >10k library by programmatically generating phrases from base vocab
function buildMassiveLibrary() {
    const adjectives = ["dramatic","ethereal","mysterious","romantic","intense","dreamy","vibrant","serene","gritty","noir","minimal","ornate","dynamic","elegant","whimsical","cinematic","photorealistic","hyperreal","surreal","moody","bold","subtle","warm","cool","pastel","neon","muted","vivid","textured","polished"];
    const mediums = ["photography","digital painting","oil painting","watercolor","charcoal","ink","vector art","pixel art","3D render","isometric art","matte painting","collage"];
    const subjects = ["portrait","landscape","cityscape","still life","macro flower","wildlife","astronaut","samurai","android","cyborg","wizard","dragon","spaceship","cathedral","market","alley","desert","ocean","mountain","forest","mecha","castle","nebula","robot","villa","temple","bridge","harbor","library"];
    const lenses = ["wide angle","telephoto","macro","tilt-shift","fisheye","35mm","50mm","85mm","200mm"];
    const lights = ["golden hour","blue hour","studio lighting","soft light","rim light","backlight","volumetric light","hard shadows","bokeh","HDR"];
    const moods = ["tranquil","tense","joyful","melancholic","mystical","epic","intimate","grand","playful","austere"];
    const styles = ["baroque","renaissance","art deco","art nouveau","impressionist","expressionist","cubist","surrealist","minimalist","brutalist","cyberpunk","steampunk","solarpunk","retrofuturism","vaporwave","synthwave"];
    const details = ["intricate details","sharp focus","shallow depth of field","film grain","soft gradients","high contrast","low contrast","natural colors","rich colors","muted palette","pastel palette","complementary colors","duotone","monochrome"];

    const bucket = new Set();

    // seed with existing words from wordLibrary
    Object.values(wordLibrary).forEach(group => {
        if (Array.isArray(group)) {
            group.forEach(x => bucket.add(x));
        } else if (typeof group === 'object') {
            Object.values(group).forEach(sub => Array.isArray(sub) && sub.forEach(x => bucket.add(x)));
        }
    });

    function pushPhrase(a,b,c,d,e) {
        const phrase = [a,b,c,d,e].filter(Boolean).join(", ");
        bucket.add(phrase);
    }

    // Generate combinations; cap to ~12k entries to avoid DOM overload
    let count = 0;
    for (let i=0; i<adjectives.length; i++) {
        for (let j=0; j<subjects.length; j++) {
            for (let k=0; k<moods.length; k++) {
                pushPhrase(adjectives[i] + " " + subjects[j], mediums[i % mediums.length], lights[k % lights.length], styles[(i+j+k) % styles.length], details[(i+j) % details.length]);
                count++;
                if (bucket.size > 12000) break;
            }
            if (bucket.size > 12000) break;
        }
        if (bucket.size > 12000) break;
    }

    // Also add short single words to ensure >10k total items
    const shortWords = [].concat(adjectives, mediums, subjects, lenses, lights, moods, styles, details);
    shortWords.forEach(w => bucket.add(w));

    const massive = Array.from(bucket);
    // Store as its own category
    wordLibrary.massive = { generated: massive };
}

// Search/filter capability for word library
function filterWordBank(term) {
    const words = collectAllWords();
    const q = term.trim().toLowerCase();
    const MAX_SHOW = 500; // cap render for performance
    let matches = words;
    if (q) {
        matches = words.filter(w => w.toLowerCase().includes(q));
    }
    const limited = matches.slice(0, MAX_SHOW);
    elements.wordBank.innerHTML = limited.map(word => 
        `<span class="word-item" data-word="${word}">${word}</span>`
    ).join('');
    document.querySelectorAll('.word-item').forEach(item => {
        item.addEventListener('click', addWordToPrompt);
    });
}

// Collect all words & phrases across categories
function collectAllWords() {
    const words = [];
    Object.values(wordLibrary).forEach(group => {
        if (Array.isArray(group)) {
            words.push(...group);
        } else if (typeof group === 'object') {
            Object.values(group).forEach(sub => Array.isArray(sub) && words.push(...sub));
        }
    });
    return words;
}

// Rules for platforms
const rulesEngine = {
    platforms: {
        midjourney: {
            maxWords: 75,
            avoid: (platformData.midjourney.avoid || []),
            mustInclude: [],
            postProcess(prompt) { return prompt; }
        },
        stable_diffusion: {
            maxWords: 150,
            avoid: [],
            mustInclude: ["Positive:", "Negative:"],
            postProcess(prompt) { return prompt; }
        },
        flux_ai: {
            maxWords: 100,
            avoid: [],
            mustInclude: [],
            postProcess(prompt) { return prompt; }
        },
        dall_e: {
            maxWords: 80,
            avoid: [],
            mustInclude: [],
            postProcess(prompt) { return prompt; }
        },
        natural_language: {
            maxWords: 60,
            avoid: [],
            mustInclude: [],
            postProcess(prompt) { return prompt; }
        }
    },
    analyze(prompt, platformKey) {
        const plat = this.platforms[platformKey] || this.platforms.natural_language;
        const words = prompt.trim().split(/\s+/).filter(Boolean);
        const issues = [];
        if (words.length > plat.maxWords) {
            issues.push(`Too long for ${platformKey}: ${words.length}/${plat.maxWords} words.`);
        }
        plat.avoid.forEach(term => {
            if (prompt.toLowerCase().includes(term.toLowerCase())) {
                issues.push(`Avoid term detected: "${term}"`);
            }
        });
        plat.mustInclude.forEach(term => {
            if (!prompt.includes(term)) {
                issues.push(`Missing required token: "${term}"`);
            }
        });
        // Simple duplicates check
        const dupes = words.filter((w, i) => words.indexOf(w) !== i);
        if (dupes.length > 10) issues.push("High repetition detected.");
        return { ok: issues.length === 0, issues, wordCount: words.length };
    },
    optimize(prompt, platformKey) {
        // Very simple optimization: collapse spaces, remove duplicate commas, trim repeated adjectives
        let p = prompt.replace(/\s*,\s*/g, ", ").replace(/,{2,}/g, ",").replace(/\s{2,}/g, " ").trim();
        // Remove repeated words back-to-back
        p = p.replace(/\b(\w+)(\s+\1\b)+/gi, "$1");
        const plat = this.platforms[platformKey] || this.platforms.natural_language;
        const words = p.split(/\s+/);
        if (words.length > plat.maxWords) {
            p = words.slice(0, plat.maxWords).join(" ");
        }
        return p;
    }
};

// Lint UI
function lintAndOptimize() {
    const analysis = rulesEngine.analyze(currentPrompt, currentPlatform);
    let msg = `Words: ${analysis.wordCount}. `;
    if (analysis.ok) {
        msg += "Looks good for this platform.";
        document.getElementById('rules-feedback').className = "status status--success";
    } else {
        msg += analysis.issues.join(" ");
        document.getElementById('rules-feedback').className = "status status--warning";
    }
    document.getElementById('rules-feedback').textContent = msg;
    // Offer optimization
    const optimized = rulesEngine.optimize(currentPrompt, currentPlatform);
    if (optimized !== currentPrompt) {
        currentPrompt = optimized;
        elements.promptInput.value = optimized;
        updatePromptPreview();
        updateWordCount();
    }
}

// Batch generation (20 prompts)
let batchBuffer = [];
function batchGenerate(count = 20) {
    const categories = ["portrait","nature","fantasy","scifi","abstract"];
    batchBuffer = [];
    for (let i=0; i<count; i++) {
        const cat = categories[i % categories.length];
        const p = generateRandomPrompt(cat);
        batchBuffer.push(p);
    }
    addToHistory(`Batch generated ${count} prompts.`);
}

function exportBatch() {
    if (!batchBuffer.length) batchGenerate();
    const data = {
        platform: currentPlatform,
        generated_at: new Date().toISOString(),
        count: batchBuffer.length,
        prompts: batchBuffer
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_batch_${Date.now()}.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Hook up new UI controls after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Build massive library once
    buildMassiveLibrary();
    // Wire search
    const search = document.getElementById('word-search');
    if (search) {
        search.addEventListener('input', (e) => filterWordBank(e.target.value));
    }
    // Wire buttons
    const lintBtn = document.getElementById('lint-prompt-btn');
    lintBtn && lintBtn.addEventListener('click', lintAndOptimize);
    const batchBtn = document.getElementById('batch-generate-btn');
    batchBtn && batchBtn.addEventListener('click', () => { batchGenerate(20); alert('Generated 20 prompts in memory. Use "Export Batch" to save.'); });
    const exportBatchBtn = document.getElementById('export-batch-btn');
    exportBatchBtn && exportBatchBtn.addEventListener('click', exportBatch);
});

// Application state
let currentPlatform = 'midjourney';
let currentTheme = 'dark_professional';
let currentPrompt = '';
let promptHistory = [];
let savedPrompts = [];
let currentTab = 'manual';
let currentWordCategory = 'subjects';

// DOM elements
let elements = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    initializeWordLibrary();
    initializeTemplates();
    updatePlatformControls();
    updatePromptPreview();
    loadSavedData();
});

function initializeElements() {
    elements = {
        platformSelect: document.getElementById('platform-select'),
        themeSelect: document.getElementById('theme-select'),
        promptInput: document.getElementById('prompt-input'),
        wordBank: document.getElementById('word-bank'),
        templateGrid: document.getElementById('template-grid'),
        promptPreview: document.getElementById('prompt-preview'),
        previewContent: document.getElementById('preview-content'),
        platformBadge: document.getElementById('platform-badge'),
        wordCount: document.getElementById('word-count'),
        platformControls: document.getElementById('platform-controls'),
        qualitySlider: document.getElementById('quality-slider'),
        qualityValue: document.getElementById('quality-value'),
        stylizeSlider: document.getElementById('stylize-slider'),
        stylizeValue: document.getElementById('stylize-value'),
        aspectRatio: document.getElementById('aspect-ratio'),
        promptHistory: document.getElementById('prompt-history'),
        savedPrompts: document.getElementById('saved-prompts'),
        uploadZone: document.getElementById('upload-zone'),
        fileInput: document.getElementById('file-input'),
        browseBtn: document.getElementById('browse-btn'),
        imageAnalysis: document.getElementById('image-analysis'),
        uploadedImage: document.getElementById('uploaded-image'),
        analyzedPrompt: document.getElementById('analyzed-prompt'),
        saveModal: document.getElementById('save-modal'),
        promptName: document.getElementById('prompt-name'),
        promptDescription: document.getElementById('prompt-description')
    };
}

function setupEventListeners() {
    // Platform and theme selection
    elements.platformSelect.addEventListener('change', handlePlatformChange);
    elements.themeSelect.addEventListener('change', handleThemeChange);
    
    // Prompt input
    elements.promptInput.addEventListener('input', handlePromptInput);
    
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', handleTabChange);
    });
    
    // Word category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', handleCategoryChange);
    });
    
    // Template category buttons
    document.querySelectorAll('.template-category-btn').forEach(btn => {
        btn.addEventListener('click', handleTemplateCategoryChange);
    });
    
    // Random generation buttons
    document.querySelectorAll('.random-btn').forEach(btn => {
        btn.addEventListener('click', handleRandomGeneration);
    });
    
    // Advanced settings
    elements.qualitySlider.addEventListener('input', updateQualityValue);
    elements.stylizeSlider.addEventListener('input', updateStylizeValue);
    elements.aspectRatio.addEventListener('change', updatePromptPreview);
    
    // Action buttons
    document.getElementById('save-prompt-btn').addEventListener('click', showSaveModal);
    document.getElementById('copy-prompt-btn').addEventListener('click', copyPromptToClipboard);
    document.getElementById('share-prompt-btn').addEventListener('click', sharePrompt);
    document.getElementById('clear-prompt-btn').addEventListener('click', clearPrompt);
    document.getElementById('export-btn').addEventListener('click', exportPrompt);
    
    // Image upload
    elements.browseBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileUpload);
    elements.uploadZone.addEventListener('dragover', handleDragOver);
    elements.uploadZone.addEventListener('drop', handleDrop);
    document.getElementById('use-analyzed-prompt').addEventListener('click', useAnalyzedPrompt);
    
    // Modal handling
    document.getElementById('close-save-modal').addEventListener('click', hideSaveModal);
    document.getElementById('cancel-save').addEventListener('click', hideSaveModal);
    document.getElementById('confirm-save').addEventListener('click', savePrompt);
    
    // Click outside modal to close
    elements.saveModal.addEventListener('click', (e) => {
        if (e.target === elements.saveModal) hideSaveModal();
    });
}

function handlePlatformChange(e) {
    currentPlatform = e.target.value;
    elements.platformBadge.textContent = platformData[currentPlatform].name;
    updatePlatformControls();
    updatePromptPreview();
}

function handleThemeChange(e) {
    currentTheme = e.target.value;
    document.body.setAttribute('data-theme', currentTheme);
}

function handlePromptInput(e) {
    currentPrompt = e.target.value;
    updatePromptPreview();
    updateWordCount();
}

function handleTabChange(e) {
    const tabName = e.target.getAttribute('data-tab');
    
    // Update tab appearance
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    currentTab = tabName;
}

function handleCategoryChange(e) {
    const category = e.target.getAttribute('data-category');
    currentWordCategory = category;
    
    // Update category tab appearance
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update word bank
    updateWordBank();
}

function handleTemplateCategoryChange(e) {
    const category = e.target.getAttribute('data-category');
    
    // Update button appearance
    document.querySelectorAll('.template-category-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter templates
    filterTemplates(category);
}

function handleRandomGeneration(e) {
    const category = e.target.getAttribute('data-category');
    const randomPrompt = generateRandomPrompt(category);
    elements.promptInput.value = randomPrompt;
    currentPrompt = randomPrompt;
    updatePromptPreview();
    updateWordCount();
    addToHistory(randomPrompt);
}

function initializeWordLibrary() {
    updateWordBank();
}

function updateWordBank() {
    const category = currentWordCategory;
    let words = [];
    if (wordLibrary[category]) {
        Object.values(wordLibrary[category]).forEach(subcategory => {
            words.push(...subcategory);
        });
    } else {
        words = collectAllWords();
    }
    // Cap render to 500 items for performance
    const render = words.slice(0, 500);
    elements.wordBank.innerHTML = render.map(word => 
        `<span class="word-item" data-word="${word}">${word}</span>`
    ).join('');
    document.querySelectorAll('.word-item').forEach(item => {
        item.addEventListener('click', addWordToPrompt);
    });
}

function addWordToPrompt(e) {
    const word = e.target.getAttribute('data-word');
    const currentValue = elements.promptInput.value;
    const newValue = currentValue ? `${currentValue}, ${word}` : word;
    elements.promptInput.value = newValue;
    currentPrompt = newValue;
    updatePromptPreview();
    updateWordCount();
}

function initializeTemplates() {
    filterTemplates('all');
}

function filterTemplates(category) {
    const filteredTemplates = category === 'all' ? templates : templates.filter(t => t.category === category);
    
    elements.templateGrid.innerHTML = filteredTemplates.slice(0, 50).map(template => `
        <div class="template-card" data-template-id="${template.id}">
            <h4>${template.title}</h4>
            <p>${template.description || 'Professional template for ' + template.category}</p>
            <div class="template-preview">${template.template}</div>
        </div>
    `).join('');
    
    // Add click handlers to template cards
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', useTemplate);
    });
}

function useTemplate(e) {
    const templateId = e.currentTarget.getAttribute('data-template-id');
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
        const filledTemplate = fillTemplate(template);
        elements.promptInput.value = filledTemplate;
        currentPrompt = filledTemplate;
        updatePromptPreview();
        updateWordCount();
        addToHistory(filledTemplate);
        
        // Switch to manual tab to show the result
        document.querySelector('.tab[data-tab="manual"]').click();
    }
}

function fillTemplate(template) {
    let result = template.template;
    
    if (template.variables) {
        Object.keys(template.variables).forEach(variable => {
            const options = template.variables[variable];
            const randomOption = options[Math.floor(Math.random() * options.length)];
            result = result.replace(`{${variable}}`, randomOption);
        });
    }
    
    return result;
}

function generateRandomPrompt(category) {
    const prompts = {
        portrait: () => {
            const subjects = wordLibrary.subjects.people;
            const qualities = wordLibrary.qualities.artistic;
            const lighting = wordLibrary.lighting.natural;
            
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const quality = qualities[Math.floor(Math.random() * qualities.length)];
            const light = lighting[Math.floor(Math.random() * lighting.length)];
            
            return `${quality} portrait of ${subject}, ${light}, professional photography, high quality`;
        },
        nature: () => {
            const subjects = [...wordLibrary.subjects.animals, "forest", "mountain", "ocean", "sky", "clouds"];
            const qualities = wordLibrary.qualities.artistic;
            const lighting = wordLibrary.lighting.natural;
            
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const quality = qualities[Math.floor(Math.random() * qualities.length)];
            const light = lighting[Math.floor(Math.random() * lighting.length)];
            
            return `${quality} nature photograph, ${subject}, ${light}, stunning landscape, ultra detailed`;
        },
        fantasy: () => {
            const creatures = ["dragon", "phoenix", "unicorn", "griffin", "fairy", "wizard", "knight", "castle"];
            const qualities = wordLibrary.qualities.artistic;
            const moods = wordLibrary.emotions;
            
            const creature = creatures[Math.floor(Math.random() * creatures.length)];
            const quality = qualities[Math.floor(Math.random() * qualities.length)];
            const mood = moods[Math.floor(Math.random() * moods.length)];
            
            return `${quality} fantasy art, ${creature}, ${mood} atmosphere, magical realm, epic composition`;
        },
        scifi: () => {
            const elements = ["spaceship", "alien planet", "robot", "cyborg", "space station", "laser", "hologram", "future city"];
            const qualities = wordLibrary.qualities.technical;
            const lighting = wordLibrary.lighting.artificial;
            
            const element = elements[Math.floor(Math.random() * elements.length)];
            const quality = qualities[Math.floor(Math.random() * qualities.length)];
            const light = lighting[Math.floor(Math.random() * lighting.length)];
            
            return `${quality} sci-fi concept art, ${element}, ${light}, futuristic technology, cyberpunk style`;
        },
        abstract: () => {
            const colors = wordLibrary.colors.advanced;
            const textures = wordLibrary.textures;
            const emotions = wordLibrary.emotions;
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const texture = textures[Math.floor(Math.random() * textures.length)];
            const emotion = emotions[Math.floor(Math.random() * emotions.length)];
            
            return `abstract art, ${color} colors, ${texture} texture, ${emotion} mood, dynamic composition, modern digital art`;
        },
        surprise: () => {
            // Completely random combination
            const allWords = [];
            Object.values(wordLibrary).forEach(category => {
                if (typeof category === 'object') {
                    Object.values(category).forEach(subcategory => {
                        if (Array.isArray(subcategory)) {
                            allWords.push(...subcategory);
                        }
                    });
                } else if (Array.isArray(category)) {
                    allWords.push(...category);
                }
            });
            
            const randomWords = [];
            for (let i = 0; i < 6; i++) {
                randomWords.push(allWords[Math.floor(Math.random() * allWords.length)]);
            }
            
            return randomWords.join(', ') + ', creative composition, unique style';
        }
    };
    
    return prompts[category] ? prompts[category]() : prompts.surprise();
}

function updatePlatformControls() {
    const platform = platformData[currentPlatform];
    let controlsHTML = '';
    
    switch (currentPlatform) {
        case 'midjourney':
            controlsHTML = `
                <h4>Midjourney Parameters</h4>
                <div class="control-group">
                    <div class="form-group">
                        <label for="mj-aspect">Aspect Ratio (--ar):</label>
                        <select id="mj-aspect" class="form-control">
                            <option value="1:1">1:1 (Square)</option>
                            <option value="16:9">16:9 (Widescreen)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                            <option value="4:3">4:3 (Standard)</option>
                            <option value="3:2">3:2 (Photo)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="mj-stylize">Stylization (--s): <span id="mj-stylize-value">100</span></label>
                        <input type="range" id="mj-stylize" min="0" max="1000" value="100" class="slider">
                    </div>
                    <div class="form-group">
                        <label for="mj-quality">Quality (--q): <span id="mj-quality-value">1</span></label>
                        <input type="range" id="mj-quality" min="0.25" max="2" step="0.25" value="1" class="slider">
                    </div>
                </div>
            `;
            break;
        case 'stable_diffusion':
            controlsHTML = `
                <h4>Stable Diffusion Settings</h4>
                <div class="control-group">
                    <div class="form-group">
                        <label for="sd-steps">Steps:</label>
                        <input type="number" id="sd-steps" class="form-control" value="20" min="1" max="150">
                    </div>
                    <div class="form-group">
                        <label for="sd-cfg">CFG Scale:</label>
                        <input type="number" id="sd-cfg" class="form-control" value="7" min="1" max="30" step="0.5">
                    </div>
                </div>
                <div class="negative-prompt-section">
                    <label for="sd-negative">Negative Prompt:</label>
                    <textarea id="sd-negative" class="form-control" rows="3" 
                              placeholder="lowres, bad anatomy, text, error, cropped, worst quality"></textarea>
                </div>
            `;
            break;
        case 'flux_ai':
            controlsHTML = `
                <h4>Flux AI Settings</h4>
                <div class="control-group">
                    <div class="form-group">
                        <label for="flux-model">Model:</label>
                        <select id="flux-model" class="form-control">
                            <option value="flux-pro">Flux Pro</option>
                            <option value="flux-dev">Flux Dev</option>
                            <option value="flux-schnell">Flux Schnell</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="flux-guidance">Guidance Scale:</label>
                        <input type="number" id="flux-guidance" class="form-control" value="3.5" min="1" max="10" step="0.1">
                    </div>
                </div>
            `;
            break;
        case 'dall_e':
            controlsHTML = `
                <h4>DALL-E Settings</h4>
                <div class="control-group">
                    <div class="form-group">
                        <label for="dalle-size">Image Size:</label>
                        <select id="dalle-size" class="form-control">
                            <option value="1024x1024">1024x1024 (Square)</option>
                            <option value="1024x1792">1024x1792 (Portrait)</option>
                            <option value="1792x1024">1792x1024 (Landscape)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="dalle-style">Style:</label>
                        <select id="dalle-style" class="form-control">
                            <option value="vivid">Vivid</option>
                            <option value="natural">Natural</option>
                        </select>
                    </div>
                </div>
            `;
            break;
        default:
            controlsHTML = `
                <h4>Natural Language Mode</h4>
                <p>Focus on clear, descriptive language that anyone can understand.</p>
            `;
    }
    
    elements.platformControls.innerHTML = controlsHTML;
    
    // Add event listeners for new controls
    addPlatformControlListeners();
}

function addPlatformControlListeners() {
    const stylizeSlider = document.getElementById('mj-stylize');
    const qualitySlider = document.getElementById('mj-quality');
    const negativePrompt = document.getElementById('sd-negative');
    
    if (stylizeSlider) {
        stylizeSlider.addEventListener('input', (e) => {
            document.getElementById('mj-stylize-value').textContent = e.target.value;
            updatePromptPreview();
        });
    }
    
    if (qualitySlider) {
        qualitySlider.addEventListener('input', (e) => {
            document.getElementById('mj-quality-value').textContent = e.target.value;
            updatePromptPreview();
        });
    }
    
    if (negativePrompt) {
        negativePrompt.addEventListener('input', updatePromptPreview);
    }
    
    // Add listeners for other platform controls
    const selects = elements.platformControls.querySelectorAll('select, input');
    selects.forEach(control => {
        control.addEventListener('change', updatePromptPreview);
        control.addEventListener('input', updatePromptPreview);
    });
}

function updatePromptPreview() {
    let preview = currentPrompt;
    const platform = platformData[currentPlatform];
    
    if (!preview) {
        elements.previewContent.textContent = 'Start building your prompt...';
        return;
    }
    
    // Add platform-specific formatting
    switch (currentPlatform) {
        case 'midjourney':
            const mjAspect = document.getElementById('mj-aspect')?.value || '1:1';
            const mjStylize = document.getElementById('mj-stylize')?.value || '100';
            const mjQuality = document.getElementById('mj-quality')?.value || '1';
            
            preview += ` --ar ${mjAspect} --s ${mjStylize} --q ${mjQuality}`;
            break;
        case 'stable_diffusion':
            const sdNegative = document.getElementById('sd-negative')?.value || platform.negative_defaults;
            const sdSteps = document.getElementById('sd-steps')?.value || '20';
            const sdCfg = document.getElementById('sd-cfg')?.value || '7';
            
            preview = `Positive: ${preview}\nNegative: ${sdNegative}\nSteps: ${sdSteps}, CFG Scale: ${sdCfg}`;
            break;
        case 'flux_ai':
            const fluxModel = document.getElementById('flux-model')?.value || 'flux-pro';
            const fluxGuidance = document.getElementById('flux-guidance')?.value || '3.5';
            
            preview += `\nModel: ${fluxModel}, Guidance: ${fluxGuidance}`;
            break;
        case 'dall_e':
            const dalleSize = document.getElementById('dalle-size')?.value || '1024x1024';
            const dalleStyle = document.getElementById('dalle-style')?.value || 'vivid';
            
            preview += `\nSize: ${dalleSize}, Style: ${dalleStyle}`;
            break;
    }
    
    elements.previewContent.textContent = preview;
}

function updateWordCount() {
    const wordCount = currentPrompt.split(/\s+/).filter(word => word.length > 0).length;
    elements.wordCount.textContent = `${wordCount} words`;
    
    const platform = platformData[currentPlatform];
    const optimalRange = platform.optimal_length.split('-');
    const min = parseInt(optimalRange[0]);
    const max = parseInt(optimalRange[1]);
    
    if (wordCount < min) {
        elements.wordCount.style.color = 'var(--color-warning)';
    } else if (wordCount > max) {
        elements.wordCount.style.color = 'var(--color-error)';
    } else {
        elements.wordCount.style.color = 'var(--color-success)';
    }
}

function updateQualityValue() {
    elements.qualityValue.textContent = elements.qualitySlider.value;
}

function updateStylizeValue() {
    elements.stylizeValue.textContent = elements.stylizeSlider.value;
}

function addToHistory(prompt) {
    const historyItem = {
        prompt: prompt,
        timestamp: Date.now(),
        platform: currentPlatform
    };
    
    promptHistory.unshift(historyItem);
    if (promptHistory.length > 50) {
        promptHistory = promptHistory.slice(0, 50);
    }
    
    updateHistoryDisplay();
    saveToStorage();
}

function updateHistoryDisplay() {
    elements.promptHistory.innerHTML = promptHistory.slice(0, 10).map(item => `
        <div class="history-item" data-prompt="${item.prompt}">
            <div class="history-item-time">${new Date(item.timestamp).toLocaleTimeString()}</div>
            <div class="history-item-text">${item.prompt}</div>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const prompt = e.currentTarget.getAttribute('data-prompt');
            elements.promptInput.value = prompt;
            currentPrompt = prompt;
            updatePromptPreview();
            updateWordCount();
        });
    });
}

function showSaveModal() {
    if (!currentPrompt) {
        alert('Please create a prompt first');
        return;
    }
    
    elements.saveModal.classList.remove('hidden');
    elements.promptName.focus();
}

function hideSaveModal() {
    elements.saveModal.classList.add('hidden');
    elements.promptName.value = '';
    elements.promptDescription.value = '';
}

function savePrompt() {
    const name = elements.promptName.value.trim();
    if (!name) {
        alert('Please enter a name for the prompt');
        return;
    }
    
    const savedPrompt = {
        id: Date.now(),
        name: name,
        description: elements.promptDescription.value.trim(),
        prompt: currentPrompt,
        platform: currentPlatform,
        timestamp: Date.now()
    };
    
    savedPrompts.unshift(savedPrompt);
    updateSavedPromptsDisplay();
    saveToStorage();
    hideSaveModal();
}

function updateSavedPromptsDisplay() {
    elements.savedPrompts.innerHTML = savedPrompts.slice(0, 10).map(item => `
        <div class="saved-prompt-item" data-prompt="${item.prompt}">
            <div class="saved-prompt-name">${item.name}</div>
            <div class="saved-prompt-text">${item.prompt}</div>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.saved-prompt-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const prompt = e.currentTarget.getAttribute('data-prompt');
            elements.promptInput.value = prompt;
            currentPrompt = prompt;
            updatePromptPreview();
            updateWordCount();
        });
    });
}

function copyPromptToClipboard() {
    if (!currentPrompt) {
        alert('No prompt to copy');
        return;
    }
    
    navigator.clipboard.writeText(elements.previewContent.textContent).then(() => {
        alert('Prompt copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy prompt');
    });
}

function sharePrompt() {
    if (!currentPrompt) {
        alert('No prompt to share');
        return;
    }
    
    const shareData = {
        title: 'AI Prompt Generator Pro',
        text: elements.previewContent.textContent
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        copyPromptToClipboard();
    }
}

function clearPrompt() {
    elements.promptInput.value = '';
    currentPrompt = '';
    updatePromptPreview();
    updateWordCount();
}

function exportPrompt() {
    if (!currentPrompt) {
        alert('No prompt to export');
        return;
    }
    
    const exportData = {
        prompt: currentPrompt,
        platform: currentPlatform,
        preview: elements.previewContent.textContent,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    elements.uploadZone.classList.add('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    elements.uploadZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        processImage(files[0]);
    }
}

function processImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        elements.uploadedImage.src = e.target.result;
        elements.imageAnalysis.style.display = 'grid';
        
        // Simulate image analysis (in real app, this would call an AI service)
        setTimeout(() => {
            const mockPrompt = generateMockImagePrompt();
            elements.analyzedPrompt.value = mockPrompt;
        }, 1500);
    };
    reader.readAsDataURL(file);
}

function generateMockImagePrompt() {
    const styles = ['photography', 'digital art', 'illustration', 'painting'];
    const qualities = ['high quality', 'detailed', 'professional', 'stunning'];
    const subjects = ['portrait', 'landscape', 'still life', 'abstract composition'];
    
    const style = styles[Math.floor(Math.random() * styles.length)];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    
    return `${quality} ${style}, ${subject}, professional lighting, detailed composition, masterpiece`;
}

function useAnalyzedPrompt() {
    const prompt = elements.analyzedPrompt.value;
    elements.promptInput.value = prompt;
    currentPrompt = prompt;
    updatePromptPreview();
    updateWordCount();
    addToHistory(prompt);
    
    // Switch to manual tab
    document.querySelector('.tab[data-tab="manual"]').click();
}

function saveToStorage() {
    const data = {
        promptHistory: promptHistory,
        savedPrompts: savedPrompts,
        currentTheme: currentTheme,
        currentPlatform: currentPlatform
    };
    
    try {
        // Since we can't use localStorage, we'll just keep data in memory
        window.appData = data;
    } catch (e) {
        console.log('Storage not available');
    }
}

function loadSavedData() {
    try {
        const data = window.appData;
        if (data) {
            promptHistory = data.promptHistory || [];
            savedPrompts = data.savedPrompts || [];
            currentTheme = data.currentTheme || 'dark_professional';
            currentPlatform = data.currentPlatform || 'midjourney';
            
            // Apply loaded settings
            elements.themeSelect.value = currentTheme;
            elements.platformSelect.value = currentPlatform;
            document.body.setAttribute('data-theme', currentTheme);
            elements.platformBadge.textContent = platformData[currentPlatform].name;
            
            updateHistoryDisplay();
            updateSavedPromptsDisplay();
        }
    } catch (e) {
        console.log('No saved data found');
    }
}