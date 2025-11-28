// Kortex Writing Hub - Main Application Logic
class KortexApp {
    constructor() {
        this.state = {
            focusTimer: {
                isRunning: false,
                timeLeft: 25 * 60, // 25 minutes in seconds
                duration: 25 * 60,
                currentCategory: 'Writing'
            },
            documents: [],
            projects: [],
            assets: [],
            activeDocument: null,
            activeTool: 'ai',
            currentView: 'list',
            chatMessages: [],
            constellationNodes: [],
            focusCategories: [
                {name: "Writing", color: "#4A90E2", description: "Deep focus for creative writing and content creation"},
                {name: "Training", color: "#FF6B6B", description: "High-energy sessions for physical training"},
                {name: "Meditation", color: "#50E3C2", description: "Calm, centered states for mindfulness practice"},
                {name: "Breath Work", color: "#9013FE", description: "Intentional breathing and pranayama"},
                {name: "Free Flow", color: "#FFD93D", description: "Open-ended creative exploration"}
            ]
        };
        
        this.timerInterval = null;
        this.init();
    }

    init() {
        this.loadInitialData();
        this.bindEvents();
        this.initializeUI();
        this.renderAll();
    }

    loadInitialData() {
        // Load sample documents
        this.state.documents = [
            {
                id: "doc-1",
                title: "The Art of Calisthenics",
                content: "# The Art of Calisthenics\n\nCalisthenics is more than exercise—it's a philosophy of movement, strength, and grace.\n\n## Core Principles\n\n- **Progressive Overload**: Gradually increase difficulty\n- **Form First**: Perfect technique before advancing\n- **Consistency**: Regular practice builds mastery\n\n## Basic Movements\n\n1. Push-ups\n2. Pull-ups\n3. Squats\n4. Planks\n\n*Remember: The journey is the destination.*",
                type: "markdown",
                tags: ["calisthenics", "philosophy", "movement"],
                created: "2025-07-02",
                modified: "2025-07-02"
            },
            {
                id: "doc-2", 
                title: "Focus and Flow States",
                content: "# Focus and Flow States\n\nThe intersection of concentration and creativity...\n\n## What is Flow?\n\nFlow is a mental state where:\n- Time seems to disappear\n- Self-consciousness fades\n- Performance peaks naturally\n\n## Creating Flow Conditions\n\n1. **Clear Goals**: Know what you're working toward\n2. **Immediate Feedback**: Get quick responses to your actions\n3. **Challenge-Skill Balance**: Find the sweet spot between boredom and anxiety\n\n> \"The ego falls away. Time flies. Every action, movement, and thought follows inevitably from the previous one.\" - Mihaly Csikszentmihalyi",
                type: "markdown",
                tags: ["focus", "psychology", "productivity"],
                created: "2025-07-02",
                modified: "2025-07-02"
            }
        ];

        // Load sample projects
        this.state.projects = [
            {
                id: "proj-1",
                title: "Writing Portfolio",
                description: "Collection of articles and essays",
                progress: 65,
                tasks: [
                    { id: "task-1", title: "Complete calisthenics article", status: "done" },
                    { id: "task-2", title: "Write flow state guide", status: "in-progress" },
                    { id: "task-3", title: "Research meditation techniques", status: "todo" }
                ],
                linkedDocuments: ["doc-1", "doc-2"]
            },
            {
                id: "proj-2",
                title: "Fitness Content",
                description: "Training guides and workout plans",
                progress: 30,
                tasks: [
                    { id: "task-4", title: "Create beginner routine", status: "todo" },
                    { id: "task-5", title: "Film exercise demos", status: "todo" }
                ],
                linkedDocuments: ["doc-1"]
            }
        ];

        // Load sample assets
        this.state.assets = [
            {id: "asset-1", name: "Logo White", type: "image", size: "45KB", url: "/assets/logo-white.svg"},
            {id: "asset-2", name: "Training Guide", type: "pdf", size: "2.3MB", url: "/assets/training-guide.pdf"},
            {id: "asset-3", name: "Workout Tracker", type: "excel", size: "156KB", url: "/assets/tracker.xlsx"}
        ];

        // Initialize constellation nodes
        this.state.constellationNodes = [
            { id: "node-1", label: "Writing", x: 150, y: 100, color: "#4A90E2", connections: ["node-2", "node-3"] },
            { id: "node-2", label: "Focus", x: 250, y: 150, color: "#50E3C2", connections: ["node-1", "node-4"] },
            { id: "node-3", label: "Training", x: 100, y: 200, color: "#FF6B6B", connections: ["node-1"] },
            { id: "node-4", label: "Flow", x: 300, y: 200, color: "#9013FE", connections: ["node-2"] }
        ];

        // Set active document
        this.state.activeDocument = this.state.documents[0];
    }

    bindEvents() {
        // Focus Timer Events
        document.getElementById('focusTimer').addEventListener('click', () => this.toggleTimer());
        document.getElementById('timerSettings').addEventListener('click', (e) => {
            e.stopPropagation();
            this.showTimerModal();
        });

        // Timer Modal Events
        document.getElementById('closeTimerModal').addEventListener('click', () => this.hideTimerModal());
        document.getElementById('timerDuration').addEventListener('change', (e) => {
            this.state.focusTimer.duration = parseInt(e.target.value) * 60;
            this.state.focusTimer.timeLeft = this.state.focusTimer.duration;
            this.updateTimerDisplay();
        });
        document.getElementById('addCategory').addEventListener('click', () => this.addCustomCategory());

        // Sidebar Toggles
        document.getElementById('leftToggle').addEventListener('click', () => this.toggleSidebar('left'));
        document.getElementById('rightToggle').addEventListener('click', () => this.toggleSidebar('right'));

        // Tool Tabs
        document.querySelectorAll('.tool-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTool(tab.dataset.tool));
        });

        // Document Management
        document.getElementById('addDocument').addEventListener('click', () => this.showDocumentModal());
        document.getElementById('closeDocumentModal').addEventListener('click', () => this.hideDocumentModal());
        document.getElementById('createDocument').addEventListener('click', () => this.createDocument());

        // Editor Events
        document.getElementById('documentEditor').addEventListener('input', (e) => this.handleEditorInput(e));
        document.getElementById('previewToggle').addEventListener('click', () => this.togglePreview());

        // AI Chat Events
        document.getElementById('sendMessage').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendChatMessage();
            }
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchDocuments(e.target.value));

        // Project Views
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchProjectView(btn.dataset.view));
        });

        // Constellation Controls
        document.getElementById('addNode').addEventListener('click', () => this.addConstellationNode());
        document.getElementById('resetZoom').addEventListener('click', () => this.resetConstellationView());

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
        });

        // Prevent default drag behaviors
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }

    initializeUI() {
        // Set initial editor content
        document.getElementById('documentEditor').value = this.state.activeDocument?.content || '';
        
        // Initialize constellation SVG
        this.initializeConstellation();
        
        // Update timer display
        this.updateTimerDisplay();
    }

    renderAll() {
        this.renderDocumentTree();
        this.renderProjectTree();
        this.renderAssetTree();
        this.renderTimerCategories();
        this.renderProjects();
        this.renderConstellation();
        this.updatePreview();
    }

    // Timer Functions
    toggleTimer() {
        if (this.state.focusTimer.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.state.focusTimer.isRunning = true;
        this.timerInterval = setInterval(() => {
            this.state.focusTimer.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.state.focusTimer.timeLeft <= 0) {
                this.completeTimer();
            }
        }, 1000);
        
        document.querySelector('.timer-progress').style.stroke = this.getCurrentCategoryColor();
    }

    pauseTimer() {
        this.state.focusTimer.isRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    completeTimer() {
        this.pauseTimer();
        this.state.focusTimer.timeLeft = this.state.focusTimer.duration;
        this.updateTimerDisplay();
        
        // Show completion notification
        this.showNotification(`${this.state.focusTimer.currentCategory} session completed!`, 'success');
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.state.focusTimer.timeLeft / 60);
        const seconds = this.state.focusTimer.timeLeft % 60;
        const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timerTime').textContent = timeText;
        document.getElementById('timerCategory').textContent = this.state.focusTimer.currentCategory;
        
        // Update progress circle
        const progress = 1 - (this.state.focusTimer.timeLeft / this.state.focusTimer.duration);
        const dashOffset = 220 - (220 * progress);
        document.getElementById('timerProgress').style.strokeDashoffset = dashOffset;
    }

    getCurrentCategoryColor() {
        const category = this.state.focusCategories.find(c => c.name === this.state.focusTimer.currentCategory);
        return category?.color || '#4A90E2';
    }

    showTimerModal() {
        document.getElementById('timerModal').classList.remove('hidden');
        this.renderTimerCategories();
    }

    hideTimerModal() {
        document.getElementById('timerModal').classList.add('hidden');
    }

    renderTimerCategories() {
        const container = document.getElementById('timerCategories');
        container.innerHTML = this.state.focusCategories.map(category => `
            <div class="timer-category-card ${category.name === this.state.focusTimer.currentCategory ? 'active' : ''}" 
                 data-category="${category.name}">
                <div class="category-color" style="background: ${category.color}"></div>
                <div class="category-name">${category.name}</div>
            </div>
        `).join('');

        // Bind category selection
        container.addEventListener('click', (e) => {
            const card = e.target.closest('.timer-category-card');
            if (card) {
                this.selectTimerCategory(card.dataset.category);
            }
        });
    }

    selectTimerCategory(categoryName) {
        this.state.focusTimer.currentCategory = categoryName;
        document.querySelectorAll('.timer-category-card').forEach(card => {
            card.classList.toggle('active', card.dataset.category === categoryName);
        });
        this.updateTimerDisplay();
        
        // Update timer progress color
        const color = this.getCurrentCategoryColor();
        document.querySelector('.timer-progress').style.stroke = color;
    }

    addCustomCategory() {
        const name = document.getElementById('newCategoryName').value.trim();
        const color = document.getElementById('newCategoryColor').value;
        
        if (name && !this.state.focusCategories.find(c => c.name === name)) {
            this.state.focusCategories.push({
                name,
                color,
                description: `Custom category: ${name}`
            });
            
            document.getElementById('newCategoryName').value = '';
            this.renderTimerCategories();
            this.showNotification(`Category "${name}" added!`, 'success');
        }
    }

    // Document Management
    showDocumentModal() {
        document.getElementById('documentModal').classList.remove('hidden');
    }

    hideDocumentModal() {
        document.getElementById('documentModal').classList.add('hidden');
    }

    createDocument() {
        const title = document.getElementById('newDocumentTitle').value.trim();
        const tags = document.getElementById('newDocumentTags').value.split(',').map(t => t.trim()).filter(t => t);
        const template = document.getElementById('documentTemplate').value;
        
        if (!title) return;

        const newDoc = {
            id: `doc-${Date.now()}`,
            title,
            content: this.getDocumentTemplate(template),
            type: 'markdown',
            tags,
            created: new Date().toISOString().split('T')[0],
            modified: new Date().toISOString().split('T')[0]
        };

        this.state.documents.push(newDoc);
        this.setActiveDocument(newDoc);
        this.renderDocumentTree();
        this.hideDocumentModal();
        
        // Clear form
        document.getElementById('newDocumentTitle').value = '';
        document.getElementById('newDocumentTags').value = '';
    }

    getDocumentTemplate(template) {
        const templates = {
            blank: '',
            article: '# Article Title\n\n## Introduction\n\nWrite your introduction here...\n\n## Main Content\n\nYour main content goes here...\n\n## Conclusion\n\nSummarize your key points...',
            notes: '# Meeting Notes - [Date]\n\n**Attendees:** \n\n**Agenda:**\n- \n\n**Key Points:**\n- \n\n**Action Items:**\n- [ ] \n\n**Next Steps:**\n',
            story: '# Story Title\n\n## Characters\n\n**Protagonist:** \n**Supporting:** \n\n## Setting\n\n**Time:** \n**Place:** \n\n## Plot Outline\n\n### Act I - Setup\n\n### Act II - Confrontation\n\n### Act III - Resolution\n'
        };
        return templates[template] || '';
    }

    setActiveDocument(doc) {
        this.state.activeDocument = doc;
        document.getElementById('documentEditor').value = doc.content;
        this.updateActiveDocumentTab(doc);
        this.updatePreview();
    }

    updateActiveDocumentTab(doc) {
        const tabsContainer = document.getElementById('editorTabs');
        const existingTab = tabsContainer.querySelector(`[data-doc="${doc.id}"]`);
        
        if (!existingTab) {
            // Create new tab
            const tab = document.createElement('div');
            tab.className = 'tab active';
            tab.dataset.doc = doc.id;
            tab.innerHTML = `
                <span>${doc.title}</span>
                <button class="tab-close" onclick="event.stopPropagation(); app.closeDocumentTab('${doc.id}')">×</button>
            `;
            tab.addEventListener('click', () => this.setActiveDocument(doc));
            
            // Remove active from other tabs
            tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tabsContainer.appendChild(tab);
        } else {
            // Activate existing tab
            tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            existingTab.classList.add('active');
        }
    }

    closeDocumentTab(docId) {
        const tab = document.querySelector(`[data-doc="${docId}"]`);
        if (tab) {
            tab.remove();
            
            // Switch to another document if this was active
            if (this.state.activeDocument?.id === docId) {
                const remainingTabs = document.querySelectorAll('#editorTabs .tab');
                if (remainingTabs.length > 0) {
                    const newActiveDoc = this.state.documents.find(d => d.id === remainingTabs[0].dataset.doc);
                    if (newActiveDoc) {
                        this.setActiveDocument(newActiveDoc);
                    }
                } else {
                    this.state.activeDocument = null;
                    document.getElementById('documentEditor').value = '';
                }
            }
        }
    }

    handleEditorInput(e) {
        if (this.state.activeDocument) {
            this.state.activeDocument.content = e.target.value;
            this.state.activeDocument.modified = new Date().toISOString().split('T')[0];
            this.updatePreview();
        }
    }

    togglePreview() {
        const previewPane = document.getElementById('previewPane');
        const editorPane = document.getElementById('editorPane');
        const button = document.getElementById('previewToggle');
        
        if (previewPane.classList.contains('hidden')) {
            previewPane.classList.remove('hidden');
            editorPane.style.flex = '1';
            button.textContent = 'Hide Preview';
        } else {
            previewPane.classList.add('hidden');
            editorPane.style.flex = '1';
            button.textContent = 'Preview';
        }
    }

    updatePreview() {
        const content = document.getElementById('documentEditor').value;
        const previewContent = document.getElementById('previewContent');
        
        // Simple markdown-to-HTML conversion
        let html = content
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[h|u|l])(.+)$/gm, '<p>$1</p>');
        
        previewContent.innerHTML = html;
    }

    renderDocumentTree() {
        const container = document.getElementById('documentTree');
        container.innerHTML = this.state.documents.map(doc => `
            <div class="tree-item ${doc.id === this.state.activeDocument?.id ? 'active' : ''}" data-doc="${doc.id}">
                <span class="tree-item-icon">📄</span>
                <span>${doc.title}</span>
            </div>
        `).join('');

        // Bind click events
        container.addEventListener('click', (e) => {
            const item = e.target.closest('.tree-item');
            if (item) {
                const doc = this.state.documents.find(d => d.id === item.dataset.doc);
                if (doc) this.setActiveDocument(doc);
            }
        });
    }

    renderProjectTree() {
        const container = document.getElementById('projectTree');
        container.innerHTML = this.state.projects.map(project => `
            <div class="tree-item" data-project="${project.id}">
                <span class="tree-item-icon">📊</span>
                <span>${project.title}</span>
            </div>
        `).join('');
    }

    renderAssetTree() {
        const container = document.getElementById('assetTree');
        container.innerHTML = this.state.assets.map(asset => `
            <div class="tree-item" data-asset="${asset.id}">
                <span class="tree-item-icon">${this.getAssetIcon(asset.type)}</span>
                <span>${asset.name}</span>
            </div>
        `).join('');
    }

    getAssetIcon(type) {
        const icons = {
            image: '🖼️',
            pdf: '📄',
            excel: '📊',
            word: '📝',
            video: '🎥',
            audio: '🎵'
        };
        return icons[type] || '📎';
    }

    // Search functionality
    searchDocuments(query) {
        const items = document.querySelectorAll('#documentTree .tree-item');
        items.forEach(item => {
            const title = item.textContent.toLowerCase();
            const matches = title.includes(query.toLowerCase());
            item.style.display = matches ? 'flex' : 'none';
        });
    }

    // Sidebar management
    toggleSidebar(side) {
        const sidebar = document.getElementById(side === 'left' ? 'leftSidebar' : 'rightSidebar');
        sidebar.classList.toggle('collapsed');
    }

    // Tool switching
    switchTool(tool) {
        this.state.activeTool = tool;
        
        // Update tab states
        document.querySelectorAll('.tool-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tool === tool);
        });
        
        // Update panel visibility
        document.querySelectorAll('.tool-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tool}Panel`);
        });
    }

    // AI Chat
    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (!message) return;

        // Add user message
        this.addChatMessage('user', message);
        input.value = '';

        // Simulate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addChatMessage('assistant', response);
        }, 1000);
    }

    addChatMessage(sender, content) {
        const message = { sender, content, timestamp: new Date() };
        this.state.chatMessages.push(message);
        this.renderChatMessage(message);
    }

    renderChatMessage(message) {
        const container = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message.content}</p>
            </div>
        `;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const responses = [
            "That's an interesting perspective! Have you considered exploring that idea further in your writing?",
            "I can help you develop that concept. What specific aspect would you like to focus on?",
            "Based on your documents, this connects well with your work on flow states and focus.",
            "Let me suggest some ways to structure that content for maximum impact.",
            "That reminds me of the calisthenics philosophy you wrote about - finding strength through consistent practice."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Project Management
    switchProjectView(view) {
        this.state.currentView = view;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        this.renderProjects();
    }

    renderProjects() {
        const container = document.getElementById('projectsContainer');
        
        if (this.state.currentView === 'list') {
            container.innerHTML = this.state.projects.map(project => `
                <div class="project-card">
                    <div class="project-title">${project.title}</div>
                    <div class="text-secondary">${project.description}</div>
                    <div class="project-progress">
                        <div class="project-progress-bar" style="width: ${project.progress}%"></div>
                    </div>
                    <div style="margin-top: 8px; font-size: 12px; opacity: 0.7;">
                        ${project.progress}% complete • ${project.tasks.length} tasks
                    </div>
                </div>
            `).join('');
        }
    }

    // Constellation Map
    initializeConstellation() {
        this.renderConstellation();
    }

    renderConstellation() {
        const svg = document.getElementById('constellationSvg');
        const svgRect = svg.getBoundingClientRect();
        
        // Clear existing content
        const existingNodes = svg.querySelectorAll('.constellation-node, .constellation-link');
        existingNodes.forEach(el => el.remove());
        
        // Render connections first (so they appear behind nodes)
        this.state.constellationNodes.forEach(node => {
            if (node.connections) {
                node.connections.forEach(connectionId => {
                    const targetNode = this.state.constellationNodes.find(n => n.id === connectionId);
                    if (targetNode) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', node.x);
                        line.setAttribute('y1', node.y);
                        line.setAttribute('x2', targetNode.x);
                        line.setAttribute('y2', targetNode.y);
                        line.className = 'constellation-link';
                        svg.appendChild(line);
                    }
                });
            }
        });
        
        // Render nodes
        this.state.constellationNodes.forEach(node => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.className = 'constellation-node';
            group.setAttribute('transform', `translate(${node.x}, ${node.y})`);
            
            // Node circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '20');
            circle.setAttribute('fill', node.color);
            circle.setAttribute('filter', 'url(#glow)');
            
            // Node label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dy', '5');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', '500');
            text.textContent = node.label;
            
            group.appendChild(circle);
            group.appendChild(text);
            svg.appendChild(group);
        });
    }

    addConstellationNode() {
        const label = prompt('Enter node label:');
        if (!label) return;
        
        const colors = ['#4A90E2', '#50E3C2', '#FF6B6B', '#9013FE', '#FFD93D'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const newNode = {
            id: `node-${Date.now()}`,
            label,
            x: Math.random() * 300 + 50,
            y: Math.random() * 300 + 50,
            color,
            connections: []
        };
        
        this.state.constellationNodes.push(newNode);
        this.renderConstellation();
    }

    resetConstellationView() {
        // Reset zoom and pan - simplified for this demo
        this.renderConstellation();
    }

    // Utility functions
    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 16px;
            color: var(--color-text);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KortexApp();
});

// Additional utility functions for global access
function closeDocumentTab(docId) {
    window.app.closeDocumentTab(docId);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save (prevent default)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        window.app.showNotification('Document saved locally', 'success');
    }
    
    // Ctrl/Cmd + N for new document
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        window.app.showDocumentModal();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
});

// Slash commands in editor
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('documentEditor');
    if (editor) {
        editor.addEventListener('keydown', (e) => {
            if (e.key === '/') {
                // Simple slash command implementation
                setTimeout(() => {
                    const cursorPos = editor.selectionStart;
                    const textBefore = editor.value.substring(0, cursorPos);
                    const lastLine = textBefore.split('\n').pop();
                    
                    if (lastLine === '/') {
                        // Show simple command menu
                        const commands = [
                            { trigger: '/h1', replacement: '# ' },
                            { trigger: '/h2', replacement: '## ' },
                            { trigger: '/h3', replacement: '### ' },
                            { trigger: '/bold', replacement: '**bold text**' },
                            { trigger: '/italic', replacement: '*italic text*' },
                            { trigger: '/code', replacement: '`code`' },
                            { trigger: '/quote', replacement: '> Quote' }
                        ];
                        
                        // This is a simplified version - in a real app you'd show a dropdown
                        console.log('Slash commands available:', commands.map(c => c.trigger));
                    }
                }, 0);
            }
        });
    }
});