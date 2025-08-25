// Advanced AI Prompt Generator with Heavy-Duty Methods
class AdvancedPromptGenerator {
    constructor() {
        this.history = [];
        this.variations = [];
        this.tags = ['landscape', 'portrait', 'nature', 'urban', 'fantasy', 'sci-fi', 'realistic', 'colorful', 'minimalist', 'detailed'];
        this.promptTemplates = this.initializePromptTemplates();
        this.stats = {
            totalPrompts: 0,
            variationsCount: 0,
            tagsCount: 0,
            favoritesCount: 0
        };
        this.init();
    }

    initializePromptTemplates() {
        return {
            image: [
                "A stunning {style} {subject} with {details}, {enhancements}. Professional quality, {quality}, {lighting} lighting, {composition}, {colors}, {texture}. Highly detailed, {focus}. Cinematic atmosphere, {mood}.",
                "Professional {style} photograph of {subject} featuring {details}. {enhancements} with {quality} detail. {lighting} lighting, {composition}, {colors} palette, {texture} surface. Ultra-realistic, {focus}. {mood} atmosphere.",
                "{subject} in {style} style, {details}. {enhancements} with {quality} rendering. {lighting} illumination, {composition} framing, {colors} scheme, {texture} finish. {focus} sharpness, {mood} ambiance.",
                "Highly detailed {style} artwork of {subject} with {details}. {enhancements} in {quality} execution. {lighting} conditions, {composition} layout, {colors} harmony, {texture} realism. {focus} clarity, {mood} setting.",
                "Ultra-realistic {style} image of {subject} displaying {details}. {enhancements} at {quality} level. {lighting} environment, {composition} perspective, {colors} tones, {texture} surfaces. {focus} precision, {mood} atmosphere."
            ],
            text: [
                "Write a comprehensive {type} article about {subject} with {details}. Include {enhancements} and {quality} structure. {mood} tone, {structure}. Professional language, {clarity}.",
                "Create a detailed {type} document on {subject} with {details}. {enhancements} in {quality} format. {mood} approach, {structure} organization. Clear {clarity}, {depth}.",
                "{type} content about {subject} featuring {details}. {enhancements} with {quality} presentation. {mood} delivery, {structure} flow. {clarity} communication, {depth} analysis.",
                "Professional {type} material on {subject} including {details}. {enhancements} at {quality} standard. {mood} expression, {structure} framework. {clarity} explanation, {depth} insight.",
                "Comprehensive {type} guide for {subject} with {details}. {enhancements} in {quality} content. {mood} tone, {structure} methodology. {clarity} focus, {depth} coverage."
            ],
            creative: [
                "A creative story about {subject} set in {details}. {enhancements} with {quality} narrative. {mood} atmosphere, {structure} progression. {clarity} character development, {depth} themes.",
                "Creative writing piece focusing on {subject} with {details}. {enhancements} in {quality} storytelling. {mood} setting, {structure} flow. {clarity} plot, {depth} character.",
                "Imaginative {type} piece about {subject} involving {details}. {enhancements} at {quality} level. {mood} environment, {structure} development. {clarity} expression, {depth} exploration.",
                "Original {type} content featuring {subject} and {details}. {enhancements} with {quality} creativity. {mood} tone, {structure} arrangement. {clarity} vision, {depth} meaning.",
                "Innovative {type} about {subject} with {details}. {enhancements} in {quality} imagination. {mood} context, {structure} sequence. {clarity} articulation, {depth} significance."
            ],
            technical: [
                "Technical documentation for {subject} with {details}. {enhancements} at {quality} standard. {mood} professionalism, {structure} organization. {clarity} instructions, {depth} specifications.",
                "Comprehensive technical guide for {subject} featuring {details}. {enhancements} in {quality} format. {mood} precision, {structure} presentation. {clarity} procedures, {depth} details.",
                "Detailed {type} manual for {subject} including {details}. {enhancements} with {quality} accuracy. {mood} thoroughness, {structure} framework. {clarity} explanations, {depth} components.",
                "Professional technical specification for {subject} with {details}. {enhancements} at {quality} level. {mood} rigor, {structure} methodology. {clarity} requirements, {depth} implementation.",
                "Technical blueprint for {subject} involving {details}. {enhancements} in {quality} execution. {mood} precision, {structure} methodology. {clarity} steps, {depth} considerations."
            ],
            art: [
                "Artistic creation of {subject} in {style} style with {details}. {enhancements} at {quality} level. {mood} expression, {structure} composition. {clarity} form, {depth} meaning.",
                "{style} artwork depicting {subject} featuring {details}. {enhancements} in {quality} execution. {mood} interpretation, {structure} design. {clarity} elements, {depth} symbolism.",
                "Creative {type} piece showcasing {subject} with {details}. {enhancements} with {quality} technique. {mood} aesthetic, {structure} arrangement. {clarity} vision, {depth} expression.",
                "Visual {type} representation of {subject} in {style} style. {enhancements} at {quality} standard. {mood} concept, {structure} layout. {clarity} presentation, {depth} meaning.",
                "Artistic interpretation of {subject} using {details}. {enhancements} in {quality} form. {mood} theme, {structure} composition. {clarity} elements, {depth} significance."
            ],
            photography: [
                "Professional photography of {subject} with {details}. {enhancements} in {quality} execution. {mood} atmosphere, {structure} framing. {clarity} focus, {depth} composition.",
                "{style} photography capturing {subject} featuring {details}. {enhancements} at {quality} level. {mood} setting, {structure} perspective. {clarity} sharpness, {depth} detail.",
                "Photographic masterpiece of {subject} with {details}. {enhancements} with {quality} precision. {mood} environment, {structure} composition. {clarity} definition, {depth} nuance.",
                "High-quality {style} photograph of {subject} displaying {details}. {enhancements} in {quality} rendering. {mood} ambiance, {structure} framing. {clarity} focus, {depth} storytelling.",
                "Cinematic photography of {subject} featuring {details}. {enhancements} at {quality} standard. {mood} atmosphere, {structure} perspective. {clarity} focus, {depth} storytelling."
            ]
        };
    }

    init() {
        this.loadHistory();
        this.setupEventListeners();
        this.updateStats();
        this.renderHistory();
    }

    setupEventListeners() {
        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generatePrompt();
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetForm();
        });

        // Copy button
        document.getElementById('copy-btn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Add tag button
        document.getElementById('add-tag-btn').addEventListener('click', () => {
            this.addCustomTag();
        });

        // Slider events
        document.getElementById('length-slider').addEventListener('input', (e) => {
            this.updateLengthValue(e.target.value);
        });
        
        document.getElementById('creativity-slider').addEventListener('input', (e) => {
            this.updateCreativityValue(e.target.value);
        });

        // Input field for Enter key
        document.getElementById('subject').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generatePrompt();
            }
        });

        // Tag click events
        document.getElementById('tag-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                this.toggleTag(e.target);
            }
        });
    }

    updateLengthValue(value) {
        const labels = ['Short', 'Medium', 'Long'];
        document.getElementById('length-value').textContent = labels[value - 1];
    }

    updateCreativityValue(value) {
        const labels = ['Low', 'Moderate', 'High'];
        document.getElementById('creativity-value').textContent = labels[value - 1];
    }

    resetForm() {
        document.getElementById('prompt-type').value = 'image';
        document.getElementById('style').value = 'realistic';
        document.getElementById('subject').value = '';
        document.getElementById('details').value = '';
        
        // Reset checkboxes
        const checkboxes = document.querySelectorAll('.checkbox-item input');
        checkboxes.forEach(cb => cb.checked = false);
        
        // Reset sliders
        document.getElementById('length-slider').value = 2;
        document.getElementById('creativity-slider').value = 2;
        this.updateLengthValue(2);
        this.updateCreativityValue(2);
        
        // Clear output
        document.getElementById('output-container').innerHTML = '<p>Your generated prompt will appear here...</p>';
        document.getElementById('variations-container').innerHTML = '<p>No variations generated yet. Create a prompt to see variations.</p>';
        
        // Reset tags
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => tag.classList.remove('active'));
    }

    addCustomTag() {
        const input = document.getElementById('custom-tag');
        const tagValue = input.value.trim();
        
        if (tagValue && !this.tags.includes(tagValue)) {
            this.tags.push(tagValue);
            this.renderTags();
            input.value = '';
        }
    }

    toggleTag(element) {
        element.classList.toggle('active');
    }

    renderTags() {
        const container = document.getElementById('tag-container');
        container.innerHTML = '';
        
        this.tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            container.appendChild(tagElement);
        });
    }

    generatePrompt() {
        const promptType = document.getElementById('prompt-type').value;
        const style = document.getElementById('style').value;
        const subject = document.getElementById('subject').value.trim();
        const details = document.getElementById('details').value.trim();
        
        if (!subject) {
            this.showError('Please enter a subject for your prompt');
            return;
        }
        
        // Collect enhancements
        const enhancements = [];
        const checkboxes = document.querySelectorAll('.checkbox-item input:checked');
        checkboxes.forEach(cb => enhancements.push(cb.value));
        
        // Get selected tags
        const selectedTags = [];
        const activeTags = document.querySelectorAll('#tag-container .tag.active');
        activeTags.forEach(tag => selectedTags.push(tag.textContent));
        
        // Get slider values
        const lengthLevel = document.getElementById('length-slider').value;
        const creativityLevel = document.getElementById('creativity-slider').value;
        
        // Prepare prompt data
        const promptData = {
            type: promptType,
            style: style,
            subject: subject,
            details: details,
            enhancements: enhancements.join(', '),
            tags: selectedTags,
            length: lengthLevel,
            creativity: creativityLevel,
            timestamp: new Date()
        };
        
        this.showLoading(true);
        
        // Simulate AI processing with delay
        setTimeout(() => {
            try {
                // Generate main prompt
                const mainPrompt = this.createAdvancedPrompt(promptData);
                
                // Generate variations
                const variations = this.generateVariations(promptData, 5);
                
                // Display results
                this.displayPrompt(mainPrompt);
                this.displayVariations(variations);
                
                // Update history
                this.addToHistory({
                    ...promptData,
                    prompt: mainPrompt,
                    variations: variations
                });
                
                // Update stats
                this.stats.totalPrompts++;
                this.stats.variationsCount += variations.length;
                this.updateStats();
                
            } catch (error) {
                this.showError('Failed to generate prompt: ' + error.message);
            } finally {
                this.showLoading(false);
            }
        }, 1500);
    }

    createAdvancedPrompt(data) {
        // Build base template
        const template = this.promptTemplates[data.type][Math.floor(Math.random() * this.promptTemplates[data.type].length)];
        
        // Enhanced variables for more detail
        const variables = {
            style: this.getEnhancedStyle(data.style),
            subject: data.subject,
            details: data.details || this.getRandomDetails(),
            enhancements: data.enhancements || this.getRandomEnhancements(),
            quality: this.getQualityLevel(data.creativity),
            lighting: this.getRandomLighting(),
            composition: this.getRandomComposition(),
            colors: this.getRandomColors(),
            texture: this.getRandomTexture(),
            focus: this.getRandomFocus(),
            mood: this.getRandomMood(),
            type: this.getTypeName(data.type)
        };
        
        // Replace placeholders in template
        let prompt = template;
        for (const [key, value] of Object.entries(variables)) {
            prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
        }
        
        // Add tags if any
        if (data.tags.length > 0) {
            prompt += ` Tags: ${data.tags.join(', ')}`;
        }
        
        // Adjust length based on slider
        prompt = this.adjustPromptLength(prompt, data.length);
        
        return prompt;
    }

    getEnhancedStyle(style) {
        const styles = {
            realistic: ['photorealistic', 'hyperrealistic', 'ultra-detailed'],
            abstract: ['conceptual', 'expressionist', 'surreal'],
            anime: ['Japanese anime style', 'manga art', 'chibi style'],
            cyberpunk: ['neon-lit', 'futuristic', 'dark-tech'],
            minimalist: ['clean', 'simple', 'elegant'],
            photographic: ['professional photography', 'studio quality', 'sharp focus'],
            painting: ['oil painting', 'watercolor', 'acrylic'],
            'digital-art': ['digital painting', 'vector art', 'concept art'],
            watercolor: ['watercolor painting', 'soft edges', 'flowing textures'],
            'oil-painting': ['oil on canvas', 'brush strokes', 'rich colors'],
            sketch: ['pencil sketch', 'contour lines', 'shading'],
            '3d-render': ['3D render', 'CGI', 'digital sculpting']
        };
        
        const styleOptions = styles[style] || [style];
        return styleOptions[Math.floor(Math.random() * styleOptions.length)];
    }

    getRandomDetails() {
        const details = [
            'detailed facial features',
            'natural lighting',
            'dynamic pose',
            'vibrant colors',
            'high resolution',
            'sharp focus',
            'realistic textures',
            'professional composition',
            'depth of field',
            'cinematic framing'
        ];
        return details[Math.floor(Math.random() * details.length)];
    }

    getRandomEnhancements() {
        const enhancements = [
            'high-resolution quality',
            'detailed texture mapping',
            'realistic lighting effects',
            'professional composition',
            'depth of field',
            'dynamic perspective',
            'accurate proportions',
            'natural color palette',
            'sharp focus',
            'high contrast'
        ];
        return enhancements[Math.floor(Math.random() * enhancements.length)];
    }

    getQualityLevel(creativity) {
        const levels = ['basic', 'standard', 'premium', 'professional', 'masterpiece'];
        return levels[Math.min(creativity, levels.length) - 1];
    }

    getRandomLighting() {
        const lightings = [
            'natural', 'soft', 'dramatic', 'ambient', 'studio', 'backlit', 'rim', 'diffused'
        ];
        return lightings[Math.floor(Math.random() * lightings.length)];
    }

    getRandomComposition() {
        const compositions = [
            'centered composition', 'rule of thirds', 'symmetrical', 'asymmetrical', 'leading lines', 'framing'
        ];
        return compositions[Math.floor(Math.random() * compositions.length)];
    }

    getRandomColors() {
        const colors = [
            'vibrant', 'subtle', 'bold', 'pastel', 'monochromatic', 'complementary', 'analogous', 'earth tones'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomTexture() {
        const textures = [
            'smooth', 'rough', 'glossy', 'matte', 'velvety', 'crisp', 'soft', 'defined'
        ];
        return textures[Math.floor(Math.random() * textures.length)];
    }

    getRandomFocus() {
        const focuses = [
            'sharp', 'crisp', 'clear', 'precise', 'focused', 'distinct', 'well-defined'
        ];
        return focuses[Math.floor(Math.random() * focuses.length)];
    }

    getRandomMood() {
        const moods = [
            'mysterious', 'serene', 'dramatic', 'cheerful', 'melancholic', 'epic', 'nostalgic', 'intense'
        ];
        return moods[Math.floor(Math.random() * moods.length)];
    }

    getTypeName(type) {
        const types = {
            image: 'image',
            text: 'text',
            creative: 'creative writing',
            technical: 'technical documentation',
            art: 'artistic creation',
            photography: 'photography'
        };
        return types[type] || type;
    }

    adjustPromptLength(prompt, lengthLevel) {
        switch(lengthLevel) {
            case '1': // Short
                return this.shortenPrompt(prompt);
            case '3': // Long
                return this.extendPrompt(prompt);
            default: // Medium
                return prompt;
        }
    }

    shortenPrompt(prompt) {
        // Remove extra descriptive words and simplify structure
        const words = prompt.split(' ');
        const shortWords = words.slice(0, Math.max(50, words.length * 0.7));
        return shortWords.join(' ') + '...';
    }

    extendPrompt(prompt) {
        // Add more descriptive elements and complexity
        const additions = [
            'with intricate details',
            'in extreme close-up',
            'with subtle shadows',
            'captured in golden hour',
            'with rich depth',
            'in stunning clarity',
            'with perfect balance',
            'rendered with masterful technique',
            'showing exceptional craftsmanship',
            'in a breathtaking composition'
        ];
        
        const randomAddition = additions[Math.floor(Math.random() * additions.length)];
        return prompt + '. ' + randomAddition + '.';
    }

    generateVariations(data, count) {
        const variations = [];
        for (let i = 0; i < count; i++) {
            // Create variation with slight modifications
            const variationData = {...data};
            variationData.variationId = i + 1;
            
            // Slightly modify some parameters for variety
            if (Math.random() > 0.5) {
                variationData.style = this.getRandomStyle();
            }
            
            if (Math.random() > 0.7) {
                variationData.details = this.getRandomDetails();
            }
            
            if (Math.random() > 0.6) {
                variationData.mood = this.getRandomMood();
            }
            
            variations.push(this.createAdvancedPrompt(variationData));
        }
        return variations;
    }

    getRandomStyle() {
        const styles = [
            'realistic', 'abstract', 'anime', 'cyberpunk', 'minimalist', 'photographic',
            'painting', 'digital-art', 'watercolor', 'oil-painting', 'sketch', '3d-render'
        ];
        return styles[Math.floor(Math.random() * styles.length)];
    }

    displayPrompt(prompt) {
        const container = document.getElementById('output-container');
        container.innerHTML = `<pre>${this.escapeHtml(prompt)}</pre>`;
    }

    displayVariations(variations) {
        const container = document.getElementById('variations-container');
        if (variations.length === 0) {
            container.innerHTML = '<p>No variations generated yet. Create a prompt to see variations.</p>';
            return;
        }
        
        let html = '';
        variations.forEach((variation, index) => {
            html += `
                <div class="variation-card">
                    <div class="variation-header">
                        <span class="variation-number">Variation ${index + 1}</span>
                        <div class="variation-actions">
                            <button onclick="copyVariation(${index})"><i class="fas fa-copy"></i></button>
                            <button onclick="useVariation(${index})"><i class="fas fa-check"></i></button>
                        </div>
                    </div>
                    <div class="variation-content">
                        <pre>${this.escapeHtml(variation)}</pre>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addToHistory(item) {
        this.history.unshift(item);
        // Keep only last 20 items
        if (this.history.length > 20) {
            this.history.pop();
        }
        this.saveHistory();
        this.renderHistory();
    }

    saveHistory() {
        localStorage.setItem('promptHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('promptHistory');
        if (saved) {
            this.history = JSON.parse(saved);
        }
    }

    renderHistory() {
        const container = document.getElementById('history-container');
        if (this.history.length === 0) {
            container.innerHTML = '<p>No prompts generated yet. Start creating prompts to build your history!</p>';
            return;
        }
        
        let html = '';
        this.history.slice(0, 10).forEach(item => {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            html += `
                <div class="history-item" onclick="loadHistoryItem(${this.history.indexOf(item)})">
                    <h4>${item.subject}</h4>
                    <p>${item.prompt.substring(0, 100)}...</p>
                    <div class="timestamp">${formattedDate}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    copyToClipboard() {
        const prompt = document.querySelector('#output-container pre').textContent;
        if (!prompt) {
            this.showError('No prompt to copy');
            return;
        }

        navigator.clipboard.writeText(prompt)
            .then(() => {
                alert('Prompt copied to clipboard!');
            })
            .catch(err => {
                this.showError('Failed to copy: ' + err);
            });
    }

    updateStats() {
        document.getElementById('total-prompts').textContent = this.stats.totalPrompts;
        document.getElementById('variations-count').textContent = this.stats.variationsCount;
        document.getElementById('tags-count').textContent = this.tags.length;
        document.getElementById('favorites-count').textContent = this.stats.favoritesCount;
    }
}

// Global functions for callbacks
function copyVariation(index) {
    const prompt = document.querySelectorAll('.variation-content pre')[index].textContent;
    navigator.clipboard.writeText(prompt)
        .then(() => {
            alert('Variation copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy:', err);
        });
}

function useVariation(index) {
    const prompt = document.querySelectorAll('.variation-content pre')[index].textContent;
    document.getElementById('output-container').innerHTML = `<pre>${escapeHtml(prompt)}</pre>`;
    alert('Variation applied to main prompt!');
}

function loadHistoryItem(index) {
    const item = window.promptGenerator.history[index];
    if (item) {
        // Populate form with history data
        document.getElementById('prompt-type').value = item.type;
        document.getElementById('style').value = item.style;
        document.getElementById('subject').value = item.subject;
        document.getElementById('details').value = item.details;
        
        // Set enhancements
        const enhancements = item.enhancements.split(', ');
        const checkboxes = document.querySelectorAll('.checkbox-item input');
        checkboxes.forEach(cb => {
            cb.checked = enhancements.includes(cb.value);
        });
        
        // Apply tags
        const tags = document.querySelectorAll('#tag-container .tag');
        tags.forEach(tag => {
            tag.classList.remove('active');
            if (item.tags.includes(tag.textContent)) {
                tag.classList.add('active');
            }
        });
        
        // Set slider values
        document.getElementById('length-slider').value = item.length;
        document.getElementById('creativity-slider').value = item.creativity;
        window.promptGenerator.updateLengthValue(item.length);
        window.promptGenerator.updateCreativityValue(item.creativity);
        
        // Display the prompt
        document.getElementById('output-container').innerHTML = `<pre>${escapeHtml(item.prompt)}</pre>`;
        
        // Display variations
        if (item.variations && item.variations.length > 0) {
            window.promptGenerator.displayVariations(item.variations);
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.promptGenerator = new AdvancedPromptGenerator();
});
