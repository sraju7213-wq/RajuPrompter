// Global variables
let currentTab = 'text-prompt';
let history = [];
let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// DOM Elements
const themeToggle = document.querySelector('#theme-toggle');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const generatePromptsBtn = document.getElementById('generate-prompts-btn');
const analyzeImageBtn = document.getElementById('analyze-image-btn');
const dropArea = document.getElementById('drop-area');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const imagePromptResult = document.getElementById('image-prompt-result');
const promptsContainer = document.getElementById('prompts-container');
const historyList = document.getElementById('history-list');
const searchHistory = document.getElementById('search-history');
const exportHistoryBtn = document.getElementById('export-history');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Load saved data
  loadHistory();
  loadTheme();
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize tabs
  switchTab(currentTab);
});

// Set up event listeners
function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.id.replace('-tab', '');
      switchTab(tabId);
    });
  });
  
  // Generate prompts
  generatePromptsBtn.addEventListener('click', generatePrompts);
  
  // Image upload handling
  imageUpload.addEventListener('change', handleImageUpload);
  dropArea.addEventListener('dragover', handleDragOver);
  dropArea.addEventListener('drop', handleDrop);
  analyzeImageBtn.addEventListener('click', analyzeImage);
  
  // History controls
  searchHistory.addEventListener('input', filterHistory);
  exportHistoryBtn.addEventListener('click', exportHistory);
}

// Switch between tabs
function switchTab(tabId) {
  // Update active tab
  tabs.forEach(tab => tab.classList.remove('active'));
  document.getElementById(`${tabId}-tab`).classList.add('active');
  
  // Show active content
  tabContents.forEach(content => content.classList.remove('active'));
  document.getElementById(`${tabId}-content`).classList.add('active');
  
  currentTab = tabId;
}

// Toggle theme
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Load theme preference
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode = savedTheme === 'dark';
  }
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
}

// Generate enhanced prompts
function generatePrompts() {
  // Get form values
  const promptType = document.getElementById('prompt-type').value;
  const artStyle = document.getElementById('art-style').value;
  const mood = document.getElementById('mood').value;
  const composition = document.getElementById('composition').value;
  const customSubject = document.getElementById('custom-subject').value;
  const customLocation = document.getElementById('custom-location').value;
  const customPose = document.getElementById('custom-pose').value;
  
  // Generate 5 unique prompts
  const prompts = [];
  for (let i = 0; i < 5; i++) {
    let prompt = '';
    
    // Base prompt structure
    prompt += `${promptType.charAt(0).toUpperCase() + promptType.slice(1)} of `;
    
    // Add subject if provided
    if (customSubject) {
      prompt += `${customSubject}, `;
    } else {
      // Random subjects
      const subjects = ['a majestic mountain', 'a futuristic city', 'an ancient castle', 'a mystical forest', 'a bustling marketplace'];
      prompt += `${subjects[Math.floor(Math.random() * subjects.length)]}, `;
    }
    
    // Add art style
    prompt += `in ${artStyle} style, `;
    
    // Add mood
    prompt += `${mood} mood, `;
    
    // Add composition
    prompt += `${composition} composition`;
    
    // Add location if provided
    if (customLocation) {
      prompt += `, set in ${customLocation}`;
    } else {
      // Random locations
      const locations = ['under a starry night sky', 'on a distant planet', 'in a cyberpunk alleyway', 'by a tranquil lake', 'inside a grand cathedral'];
      prompt += `, ${locations[Math.floor(Math.random() * locations.length)]}`;
    }
    
    // Add pose/action if provided
    if (customPose) {
      prompt += `, ${customPose}`;
    } else {
      // Random poses
      const poses = ['with dramatic lighting', 'in motion', 'capturing the essence of wonder', 'exuding mystery', 'in perfect harmony with nature'];
      prompt += `, ${poses[Math.floor(Math.random() * poses.length)]}`;
    }
    
    // Add additional details
    const extraDetails = [
      ', cinematic quality',
      ', highly detailed',
      ', professional photography',
      ', 8k resolution',
      ', ultra-realistic'
    ];
    prompt += extraDetails[Math.floor(Math.random() * extraDetails.length)];
    
    prompts.push(prompt);
  }
  
  // Display prompts
  displayPrompts(prompts);
  
  // Save to history
  saveToHistory(prompts);
}

// Display generated prompts
function displayPrompts(prompts) {
  promptsContainer.innerHTML = '';
  
  prompts.forEach((prompt, index) => {
    const promptCard = document.createElement('div');
    promptCard.className = 'prompt-card';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = () => copyToClipboard(prompt);
    
    const promptText = document.createElement('div');
    promptText.className = 'prompt-text';
    promptText.textContent = prompt;
    
    promptCard.appendChild(copyBtn);
    promptCard.appendChild(promptText);
    promptsContainer.appendChild(promptCard);
  });
}

// Copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show toast notification
    showToast('Copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

// Show toast notification
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#333';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '1000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    document.body.appendChild(toast);
  }
  
  // Update message and show
  toast.textContent = message;
  toast.style.opacity = '1';
  
  // Hide after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);
}

// Handle image upload
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    previewImage(file);
  }
}

// Handle drag over
function handleDragOver(e) {
  e.preventDefault();
  dropArea.classList.add('highlight');
}

// Handle drop
function handleDrop(e) {
  e.preventDefault();
  dropArea.classList.remove('highlight');
  
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    previewImage(file);
  }
}

// Preview uploaded image
function previewImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    imagePreview.style.display = 'block';
    analyzeImageBtn.disabled = false;
  };
  reader.readAsDataURL(file);
}

// Analyze image (simulated)
function analyzeImage() {
  // In a real app, this would use an AI model
  // For demo purposes, we'll simulate analysis
  
  // Show loading state
  analyzeImageBtn.textContent = 'Analyzing...';
  analyzeImageBtn.disabled = true;
  
  // Simulate processing delay
  setTimeout(() => {
    // Generate prompt based on image properties
    const prompt = "An artistic representation of a vibrant sunset over a calm ocean, captured with a wide-angle lens in golden hour lighting. The scene is composed with a leading path that guides the viewer's eye toward the horizon. The water reflects the warm hues of the sky creating a mirror-like effect. The overall mood is serene and contemplative.";
    
    // Display result
    imagePromptResult.innerHTML = `
      <div class="prompt-card">
        <div class="prompt-text">${prompt}</div>
        <button class="copy-btn" onclick="copyToClipboard('${prompt}')">Copy</button>
      </div>
    `;
    
    // Save to history
    saveToHistory([prompt]);
    
    // Reset button
    analyzeImageBtn.textContent = 'Analyze Image';
    analyzeImageBtn.disabled = false;
  }, 1500);
}

// Save to history
function saveToHistory(prompts) {
  const timestamp = new Date().toISOString();
  
  prompts.forEach(prompt => {
    history.unshift({
      id: Date.now() + Math.random(),
      prompt,
      timestamp,
      favorite: false
    });
  });
  
  // Keep only last 50 items
  if (history.length > 50) {
    history = history.slice(0, 50);
  }
  
  // Save to localStorage
  localStorage.setItem('promptHistory', JSON.stringify(history));
  
  // Update UI
  renderHistory();
}

// Load history from localStorage
function loadHistory() {
  const savedHistory = localStorage.getItem('promptHistory');
  if (savedHistory) {
    history = JSON.parse(savedHistory);
  }
  renderHistory();
}

// Render history list
function renderHistory() {
  historyList.innerHTML = '';
  
  if (history.length === 0) {
    historyList.innerHTML = '<p>No history yet.</p>';
    return;
  }
  
  history.forEach(item => {
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${item.favorite ? 'favorite' : ''}`;
    historyItem.dataset.id = item.id;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.onclick = () => deleteFromHistory(item.id);
    
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    favoriteBtn.textContent = item.favorite ? '★' : '☆';
    favoriteBtn.onclick = () => toggleFavorite(item.id);
    
    const promptText = document.createElement('div');
    promptText.className = 'prompt-text';
    promptText.textContent = item.prompt;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date(item.timestamp).toLocaleString();
    
    historyItem.appendChild(deleteBtn);
    historyItem.appendChild(favoriteBtn);
    historyItem.appendChild(promptText);
    historyItem.appendChild(timestamp);
    
    historyList.appendChild(historyItem);
  });
}

// Filter history based on search term
function filterHistory() {
  const searchTerm = searchHistory.value.toLowerCase();
  
  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(searchTerm)
  );
  
  // Re-render with filtered results
  historyList.innerHTML = '';
  
  if (filteredHistory.length === 0) {
    historyList.innerHTML = '<p>No matching history found.</p>';
    return;
  }
  
  filteredHistory.forEach(item => {
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${item.favorite ? 'favorite' : ''}`;
    historyItem.dataset.id = item.id;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.onclick = () => deleteFromHistory(item.id);
    
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    favoriteBtn.textContent = item.favorite ? '★' : '☆';
    favoriteBtn.onclick = () => toggleFavorite(item.id);
    
    const promptText = document.createElement('div');
    promptText.className = 'prompt-text';
    promptText.textContent = item.prompt;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date(item.timestamp).toLocaleString();
    
    historyItem.appendChild(deleteBtn);
    historyItem.appendChild(favoriteBtn);
    historyItem.appendChild(promptText);
    historyItem.appendChild(timestamp);
    
    historyList.appendChild(historyItem);
  });
}

// Delete item from history
function deleteFromHistory(id) {
  history = history.filter(item => item.id !== id);
  localStorage.setItem('promptHistory', JSON.stringify(history));
  renderHistory();
}

// Toggle favorite status
function toggleFavorite(id) {
  history = history.map(item => {
    if (item.id === id) {
      return { ...item, favorite: !item.favorite };
    }
    return item;
  });
  
  localStorage.setItem('promptHistory', JSON.stringify(history));
  renderHistory();
}

// Export history as JSON
function exportHistory() {
  const dataStr = JSON.stringify(history, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'prompt-history.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
