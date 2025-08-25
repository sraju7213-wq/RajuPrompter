// Advanced AI Prompt Generator
class AdvancedPromptGenerator {
    constructor() {
        this.promptsLibrary = [];
        this.currentPrompt = '';
        this.init();
    }

    init() {
        this.loadPromptsFromStorage();
        this.setupEventListeners();
        this.generateInitialSuggestions();
        this.renderLibrary();
    }

    setupEventListeners() {
        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generatePrompt();
        });

        // Save button
        document.getElementById('save-btn').addEventListener('click', () => {
            this.savePrompt();
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearAll();
        });

        // Copy button
        document.getElementById('copy-btn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Search in library
        document.getElementById('search-library').addEventListener('input', (e) => {
            this.searchLibrary(e.target.value);
        });

        // Category filter
        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filterLibrary(e.target.value);
        });

        // Input field
        document.getElementById('prompt-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generatePrompt();
            }
        });
    }

    generateInitialSuggestions() {
        const suggestions = [
            "Create a detailed description of a futuristic cityscape",
            "Write a compelling product description for a smartwatch",
            "Develop a marketing campaign for a new fitness app",
            "Generate a creative story about time travel",
            "Create a technical documentation for API endpoints"
        ];

        this.renderSuggestions(suggestions);
    }

    renderSuggestions(suggestions) {
        const container = document.getElementById('suggestions-container');
        container.innerHTML = '';

        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = suggestion;
            div.addEventListener('click', () => {
                document.getElementById('prompt-input').value = suggestion;
            });
            container.appendChild(div);
        });
    }

    async generatePrompt() {
        const input = document.getElementById('prompt-input').value.trim();
        if (!input) {
            this.showError('Please enter a prompt context');
            return;
        }

        this.showLoading(true);
        
        try {
            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Enhanced prompt generation logic
            const generatedPrompt = this.enhancePrompt(input);
            this.currentPrompt = generatedPrompt;
            this.displayPrompt(generatedPrompt);
            
            // Add to library automatically
            this.addToLibrary({
                title: `Generated Prompt ${Date.now()}`,
                content: generatedPrompt,
                category: this.categorizePrompt(input),
                tags: ['generated', 'ai'],
                timestamp: new Date()
            });
            
        } catch (error) {
            this.showError('Failed to generate prompt. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    enhancePrompt(input) {
        // Advanced prompt engineering techniques
        const techniques = [
            "Be specific and detailed",
            "Include context and constraints",
            "Add examples or references",
            "Specify format and style",
            "Define success criteria"
        ];
        
        const enhanced = `
${input}

Enhanced with:
• ${techniques[Math.floor(Math.random() * techniques.length)]}
• More detailed specifications
• Clear output format
• Specific examples

Output format: [Your response here]

Expected quality: Professional and precise
`;
        
        return enhanced;
    }

    categorizePrompt(input) {
        const categories = {
            'creative': ['art', 'design', 'story', 'creative', 'storytelling', 'visual'],
            'technical': ['code', 'programming', 'development', 'technical', 'api', 'system'],
            'business': ['marketing', 'sales', 'business', 'strategy', 'product', 'growth'],
            'educational': ['tutorial', 'learning', 'education', 'teaching', 'course', 'lesson']
        };

        const lowerInput = input.toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerInput.includes(keyword))) {
                return category;
            }
        }
        return 'general';
    }

    displayPrompt(prompt) {
        const container = document.getElementById('output-container');
        container.innerHTML = `<pre>${this.escapeHtml(prompt)}</pre>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    savePrompt() {
        const prompt = this.currentPrompt;
        if (!prompt) {
            this.showError('No prompt to save');
            return;
        }

        const title = prompt.substring(0, 30) + '...';
        const category = this.categorizePrompt(prompt);
        
        this.addToLibrary({
            title: title,
            content: prompt,
            category: category,
            tags: ['saved', 'personal'],
            timestamp: new Date()
        });

        this.showMessage('Prompt saved successfully!');
    }

    addToLibrary(promptItem) {
        this.promptsLibrary.unshift(promptItem);
        this.savePromptsToStorage();
        this.renderLibrary();
    }

    loadPromptsFromStorage() {
        const stored = localStorage.getItem('promptLibrary');
        if (stored) {
            this.promptsLibrary = JSON.parse(stored);
        } else {
            // Default library
            this.promptsLibrary = [
                {
                    title: "Creative Writing Template",
                    content: "Write a creative story about [character] who [situation]. Include [specific elements] and end with [resolution].",
                    category: "creative",
                    tags: ["writing", "template"],
                    timestamp: new Date()
                },
                {
                    title: "Technical Documentation Guide",
                    content: "Create technical documentation for [system/api]. Include installation steps, usage examples, and troubleshooting tips.",
                    category: "technical",
                    tags: ["documentation", "tech"],
                    timestamp: new Date()
                }
            ];
        }
    }

    savePromptsToStorage() {
        localStorage.setItem('promptLibrary', JSON.stringify(this.promptsLibrary));
    }

    renderLibrary() {
        const container = document.getElementById('library-container');
        container.innerHTML = '';

        this.promptsLibrary.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'library-item';
            div.innerHTML = `
                <h4><i class="fas fa-bookmark"></i> ${item.title}</h4>
                <p>${item.content.substring(0, 100)}...</p>
                <div class="tags">
                    <span class="tag">${item.category}</span>
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <small>${new Date(item.timestamp).toLocaleDateString()}</small>
            `;
            
            div.addEventListener('click', () => {
                this.displayPrompt(item.content);
                this.currentPrompt = item.content;
            });
            
            container.appendChild(div);
        });
    }

    searchLibrary(query) {
        const filtered = this.promptsLibrary.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        this.renderFilteredLibrary(filtered);
    }

    filterLibrary(category) {
        if (category === 'all') {
            this.renderLibrary();
            return;
        }
        
        const filtered = this.promptsLibrary.filter(item => item.category === category);
        this.renderFilteredLibrary(filtered);
    }

    renderFilteredLibrary(filtered) {
        const container = document.getElementById('library-container');
        container.innerHTML = '';

        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'library-item';
            div.innerHTML = `
                <h4><i class="fas fa-bookmark"></i> ${item.title}</h4>
                <p>${item.content.substring(0, 100)}...</p>
                <div class="tags">
                    <span class="tag">${item.category}</span>
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <small>${new Date(item.timestamp).toLocaleDateString()}</small>
            `;
            
            div.addEventListener('click', () => {
                this.displayPrompt(item.content);
                this.currentPrompt = item.content;
            });
            
            container.appendChild(div);
        });
    }

    clearAll() {
        document.getElementById('prompt-input').value = '';
        document.getElementById('output-container').innerHTML = '<p>Your generated prompt will appear here...</p>';
        this.currentPrompt = '';
    }

    copyToClipboard() {
        const prompt = this.currentPrompt;
        if (!prompt) {
            this.showError('No prompt to copy');
            return;
        }

        navigator.clipboard.writeText(prompt)
            .then(() => {
                this.showMessage('Copied to clipboard!');
            })
            .catch(err => {
                this.showError('Failed to copy: ' + err);
            });
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showMessage(message) {
        // Simple toast notification
        alert(message);
    }

    showError(message) {
        alert(`Error: ${message}`);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedPromptGenerator();
});
