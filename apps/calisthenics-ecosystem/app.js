// Application data
const appData = {
  "parts": [
    {
      "id": 1,
      "name": "START HERE",
      "subtitle": "The Invitation",
      "function": "Orientation & Commitment",
      "chapters": ["What, How, Why & Who", "Getting Started"],
      "connectsTo": ["all_parts", "stage_1"],
      "color": "#FFD700"
    },
    {
      "id": 2, 
      "name": "THE ART OF CALISTHENICS",
      "subtitle": "Philosophical Foundation",
      "function": "System Understanding",
      "chapters": ["Movement as Universal Language", "Calisthenics vs Other Methods", "Safety & Expectations"],
      "connectsTo": ["stage_1", "all_disciplines"],
      "color": "#FF6B6B"
    },
    {
      "id": 3,
      "name": "MASTERING CALISTHENICS", 
      "subtitle": "Technical Core",
      "function": "Skill Development",
      "chapters": ["Three Stages Implementation", "Perfect Technique Paradigm", "Fundamental Movement Patterns"],
      "connectsTo": ["stage_2", "power_free", "hand_balancing"],
      "color": "#4ECDC4"
    },
    {
      "id": 4,
      "name": "ROAD TO MASTERY",
      "subtitle": "Specialization Hub", 
      "function": "Individual Path Selection",
      "chapters": ["Six Discipline Deep Dives", "Hybrid Path Integration"],
      "connectsTo": ["all_disciplines", "stage_3"],
      "color": "#45B7D1"
    },
    {
      "id": 5,
      "name": "BUILDING YOUR OWN PROGRAM",
      "subtitle": "Application Engine",
      "function": "Personal Implementation", 
      "chapters": ["Program Templates", "Custom Routine Construction"],
      "connectsTo": ["all_stages", "all_disciplines"],
      "color": "#96CEB4"
    },
    {
      "id": 6,
      "name": "THE ENDLESS JOURNEY",
      "subtitle": "Sustainability Matrix",
      "function": "Long-term Development",
      "chapters": ["Injury Management", "Patience & Persistence"],
      "connectsTo": ["advanced_stage_3"],
      "color": "#FECA57"
    },
    {
      "id": 7,
      "name": "YOU ARE NOW A MASTER",
      "subtitle": "Legacy Circle", 
      "function": "Knowledge Transfer",
      "chapters": ["Teaching Others", "The Price of Mastery"],
      "connectsTo": ["teaching", "community", "part_1"],
      "color": "#FF9FF3"
    }
  ],
  "stages": [
    {
      "id": 1,
      "name": "FOUNDATION",
      "subtitle": "The Root System",
      "focus": ["Body Awareness & Mobility", "Joint Stability & Preparation", "Basic Movement Patterns", "Handstand Basics"],
      "disciplines": ["mobility", "bodybuilding"],
      "timeline": "Months 1-12",
      "color": "#8FBC8F"
    },
    {
      "id": 2, 
      "name": "EXPANSION",
      "subtitle": "The Trunk Growth",
      "focus": ["Big Seven Movement Mastery", "Bent-Arm Strength Development", "Introduction to Skill Training", "Progressive Overload Systems"],
      "disciplines": ["power_free", "street_lifting", "hand_balancing"],
      "timeline": "Year 2-3", 
      "color": "#DEB887"
    },
    {
      "id": 3,
      "name": "TRANSFORMATION", 
      "subtitle": "The Canopy Expression",
      "focus": ["Advanced Skill Integration", "Personal Style Development", "Teaching & Leadership", "Continuous Evolution"],
      "disciplines": ["freestyle", "all_advanced"],
      "timeline": "Year 3+",
      "color": "#DA70D6"
    }
  ],
  "disciplines": [
    {
      "id": "bodybuilding",
      "name": "BODYBUILDING",
      "subtitle": "The Foundation Forest", 
      "focus": "Volume, Hypertrophy, Aesthetics",
      "peakIntegration": "Stage 1-2",
      "connectsTo": ["all_disciplines"],
      "color": "#FF6B6B"
    },
    {
      "id": "power_free",
      "name": "POWER FREE",
      "subtitle": "The Mountain Peaks",
      "focus": "Planche, Front Lever, One-Arm Pull-up", 
      "peakIntegration": "Stage 2-3",
      "connectsTo": ["hand_balancing", "street_lifting"],
      "color": "#4ECDC4"
    },
    {
      "id": "freestyle",
      "name": "FREESTYLE", 
      "subtitle": "The Flowing Rivers",
      "focus": "Creativity, Flow, Performance",
      "peakIntegration": "Stage 3",
      "connectsTo": ["all_disciplines"],
      "color": "#45B7D1"
    },
    {
      "id": "street_lifting",
      "name": "STREET LIFTING",
      "subtitle": "The Bedrock",
      "focus": "Weighted movements, Competition lifts",
      "peakIntegration": "Stage 2-3", 
      "connectsTo": ["power_free", "bodybuilding"],
      "color": "#96CEB4"
    },
    {
      "id": "hand_balancing", 
      "name": "HAND-BALANCING",
      "subtitle": "The Sky Realm",
      "focus": "Balance, Spatial awareness, Inversions",
      "peakIntegration": "Stage 1-3 (continuous)",
      "connectsTo": ["power_free", "mobility"],
      "color": "#FECA57"
    },
    {
      "id": "mobility",
      "name": "MOBILITY",
      "subtitle": "The Atmosphere", 
      "focus": "Flexibility, Recovery, Movement quality",
      "peakIntegration": "ALL stages (foundational)",
      "connectsTo": ["all_disciplines"],
      "color": "#FF9FF3"
    }
  ],
  "pathways": [
    {
      "name": "Beginner Pathway",
      "route": ["Part 1", "Part 2", "Stage 1", "Mobility + Bodybuilding", "Part 3 (Basics)"],
      "color": "#90EE90"
    },
    {
      "name": "Intermediate Pathway", 
      "route": ["Part 3", "Stage 2", "Power Free + Street Lifting", "Part 4 (Specialization)"],
      "color": "#FFD700"
    },
    {
      "name": "Advanced Pathway",
      "route": ["Part 4", "Stage 3", "Freestyle + Hybrid combinations", "Part 7 (Mastery)"],
      "color": "#FF69B4"
    },
    {
      "name": "Strength Focus",
      "route": ["Bodybuilding", "Street Lifting", "Power Free"],
      "color": "#DC143C"
    },
    {
      "name": "Skill Focus", 
      "route": ["Hand-Balancing", "Power Free", "Freestyle"],
      "color": "#00CED1"
    },
    {
      "name": "Health Focus",
      "route": ["Mobility", "Bodybuilding", "Maintenance"],
      "color": "#32CD32"
    }
  ]
};

// Application state
let currentMode = 'overview';
let selectedElement = null;
let showConnections = true;
let highlightFlow = false;
let canvas = null;
let ctx = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupCanvas();
    renderCurrentMode();
});

function initializeApp() {
    // Initialize canvas
    canvas = document.getElementById('connections-canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    // Initialize other sections
    renderPartsSection();
    renderStagesSection();
    renderDisciplinesSection();
}

function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchMode(this.dataset.mode);
        });
    });
    
    // Interactive elements in overview
    document.querySelectorAll('.part-node').forEach(node => {
        node.addEventListener('click', function() {
            showPartDetails(parseInt(this.dataset.part));
        });
        node.addEventListener('mouseenter', function() {
            highlightConnections('part', parseInt(this.dataset.part));
        });
        node.addEventListener('mouseleave', function() {
            clearHighlights();
        });
    });
    
    document.querySelectorAll('.stage-node').forEach(node => {
        node.addEventListener('click', function() {
            showStageDetails(parseInt(this.dataset.stage));
        });
        node.addEventListener('mouseenter', function() {
            highlightConnections('stage', parseInt(this.dataset.stage));
        });
        node.addEventListener('mouseleave', function() {
            clearHighlights();
        });
    });
    
    document.querySelectorAll('.discipline-node').forEach(node => {
        node.addEventListener('click', function() {
            showDisciplineDetails(this.dataset.discipline);
        });
        node.addEventListener('mouseenter', function() {
            highlightConnections('discipline', this.dataset.discipline);
        });
        node.addEventListener('mouseleave', function() {
            clearHighlights();
        });
    });
    
    // Detail panel
    document.getElementById('close-panel').addEventListener('click', closeDetailPanel);
    
    // Connection controls
    document.getElementById('show-connections').addEventListener('change', function() {
        showConnections = this.checked;
        drawConnections();
    });
    
    document.getElementById('highlight-flow').addEventListener('change', function() {
        highlightFlow = this.checked;
        drawConnections();
    });
    
    // Pathway buttons
    document.querySelectorAll('.pathway-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectPathway(this.dataset.pathway);
        });
    });
}

function switchMode(mode) {
    currentMode = mode;
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    // Update sections
    document.querySelectorAll('.mode-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${mode}-mode`).classList.add('active');
    
    renderCurrentMode();
}

function renderCurrentMode() {
    switch(currentMode) {
        case 'overview':
            drawConnections();
            break;
        case 'parts':
            renderPartsFlowchart();
            break;
        case 'stages':
            renderStagesSpiral();
            break;
        case 'disciplines':
            renderDisciplinesGalaxy();
            break;
        case 'pathways':
            renderPathways();
            break;
    }
}

function setupCanvas() {
    if (!canvas) return;
    
    resizeCanvas();
    drawConnections();
}

function resizeCanvas() {
    if (!canvas) return;
    
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    if (currentMode === 'overview' && showConnections) {
        drawConnections();
    }
}

function drawConnections() {
    if (!ctx || !showConnections || currentMode !== 'overview') return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle connection lines between related elements
    ctx.strokeStyle = 'rgba(33, 128, 141, 0.2)';
    ctx.lineWidth = 1;
    
    // Draw connections from center to all elements
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Connect to parts ring
    const partNodes = document.querySelectorAll('.part-node');
    partNodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const nodeX = rect.left + rect.width / 2 - canvasRect.left;
        const nodeY = rect.top + rect.height / 2 - canvasRect.top;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nodeX, nodeY);
        ctx.stroke();
    });
    
    // Connect stages
    const stageNodes = document.querySelectorAll('.stage-node');
    stageNodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const nodeX = rect.left + rect.width / 2 - canvasRect.left;
        const nodeY = rect.top + rect.height / 2 - canvasRect.top;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nodeX, nodeY);
        ctx.stroke();
    });
    
    if (highlightFlow) {
        // Draw flow connections between stages
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < stageNodes.length - 1; i++) {
            const currentRect = stageNodes[i].getBoundingClientRect();
            const nextRect = stageNodes[i + 1].getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            const currentX = currentRect.left + currentRect.width / 2 - canvasRect.left;
            const currentY = currentRect.top + currentRect.height / 2 - canvasRect.top;
            const nextX = nextRect.left + nextRect.width / 2 - canvasRect.left;
            const nextY = nextRect.top + nextRect.height / 2 - canvasRect.top;
            
            ctx.beginPath();
            ctx.moveTo(currentX, currentY);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
        }
    }
}

function highlightConnections(type, id) {
    if (!showConnections || currentMode !== 'overview') return;
    
    drawConnections();
    
    // Add highlighting logic here
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.lineWidth = 2;
    
    // Highlight connections based on type and id
    // This would be expanded based on the specific connection rules
}

function clearHighlights() {
    if (currentMode === 'overview') {
        drawConnections();
    }
}

function renderPartsSection() {
    const container = document.getElementById('parts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.parts.forEach((part, index) => {
        const partElement = document.createElement('div');
        partElement.className = 'part-flowchart-item';
        partElement.innerHTML = `
            <div class="part-header" style="background-color: ${part.color}20; border-color: ${part.color}">
                <h3>${part.name}</h3>
                <p>${part.subtitle}</p>
            </div>
            <div class="part-body">
                <p><strong>Function:</strong> ${part.function}</p>
                <ul>
                    ${part.chapters.map(chapter => `<li>${chapter}</li>`).join('')}
                </ul>
            </div>
        `;
        partElement.addEventListener('click', () => showPartDetails(part.id));
        container.appendChild(partElement);
    });
}

function renderStagesSection() {
    const container = document.getElementById('stages-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.stages.forEach((stage, index) => {
        const stageElement = document.createElement('div');
        stageElement.className = 'stage-spiral-item';
        stageElement.innerHTML = `
            <div class="stage-header" style="background-color: ${stage.color}20; border-color: ${stage.color}">
                <h3>${stage.name}</h3>
                <p>${stage.subtitle}</p>
                <span class="timeline">${stage.timeline}</span>
            </div>
            <div class="stage-focus">
                <ul>
                    ${stage.focus.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
        stageElement.addEventListener('click', () => showStageDetails(stage.id));
        container.appendChild(stageElement);
    });
}

function renderDisciplinesSection() {
    const container = document.getElementById('disciplines-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.disciplines.forEach(discipline => {
        const disciplineElement = document.createElement('div');
        disciplineElement.className = 'discipline-galaxy-item';
        disciplineElement.innerHTML = `
            <div class="discipline-header" style="background-color: ${discipline.color}20; border-color: ${discipline.color}">
                <h3>${discipline.name}</h3>
                <p>${discipline.subtitle}</p>
            </div>
            <div class="discipline-details">
                <p><strong>Focus:</strong> ${discipline.focus}</p>
                <p><strong>Peak Integration:</strong> ${discipline.peakIntegration}</p>
            </div>
        `;
        disciplineElement.addEventListener('click', () => showDisciplineDetails(discipline.id));
        container.appendChild(disciplineElement);
    });
}

function renderPartsFlowchart() {
    renderPartsSection();
}

function renderStagesSpiral() {
    renderStagesSection();
}

function renderDisciplinesGalaxy() {
    renderDisciplinesSection();
}

function renderPathways() {
    // Pathways are handled by pathway selection
}

function selectPathway(pathwayType) {
    // Update pathway buttons
    document.querySelectorAll('.pathway-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-pathway="${pathwayType}"]`).classList.add('active');
    
    // Find and display the selected pathway
    const pathway = appData.pathways.find(p => 
        p.name.toLowerCase().includes(pathwayType) || 
        p.name.toLowerCase().replace(' ', '') === pathwayType
    );
    
    if (pathway) {
        renderPathwayVisualization(pathway);
    }
}

function renderPathwayVisualization(pathway) {
    const container = document.getElementById('pathway-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const pathwayElement = document.createElement('div');
    pathwayElement.className = 'pathway-flow';
    pathwayElement.innerHTML = `
        <h3 style="color: ${pathway.color}; text-align: center; margin-bottom: 2rem;">
            ${pathway.name}
        </h3>
        <div class="pathway-route">
            ${pathway.route.map((step, index) => `
                <div class="pathway-step" style="border-color: ${pathway.color}">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">${step}</div>
                </div>
                ${index < pathway.route.length - 1 ? '<div class="pathway-arrow">→</div>' : ''}
            `).join('')}
        </div>
    `;
    
    container.appendChild(pathwayElement);
}

function showPartDetails(partId) {
    const part = appData.parts.find(p => p.id === partId);
    if (!part) return;
    
    showDetailPanel(`
        <h2 style="color: ${part.color};">${part.name}</h2>
        <h3>${part.subtitle}</h3>
        <p><strong>Function:</strong> ${part.function}</p>
        <h4>Chapters:</h4>
        <ul>
            ${part.chapters.map(chapter => `<li>${chapter}</li>`).join('')}
        </ul>
        <h4>Connections:</h4>
        <p>This part connects to: ${part.connectsTo.join(', ')}</p>
    `);
}

function showStageDetails(stageId) {
    const stage = appData.stages.find(s => s.id === stageId);
    if (!stage) return;
    
    showDetailPanel(`
        <h2 style="color: ${stage.color};">${stage.name}</h2>
        <h3>${stage.subtitle}</h3>
        <p><strong>Timeline:</strong> ${stage.timeline}</p>
        <h4>Focus Areas:</h4>
        <ul>
            ${stage.focus.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <h4>Primary Disciplines:</h4>
        <p>${stage.disciplines.join(', ')}</p>
    `);
}

function showDisciplineDetails(disciplineId) {
    const discipline = appData.disciplines.find(d => d.id === disciplineId);
    if (!discipline) return;
    
    showDetailPanel(`
        <h2 style="color: ${discipline.color};">${discipline.name}</h2>
        <h3>${discipline.subtitle}</h3>
        <p><strong>Focus:</strong> ${discipline.focus}</p>
        <p><strong>Peak Integration:</strong> ${discipline.peakIntegration}</p>
        <h4>Connections:</h4>
        <p>This discipline connects to: ${discipline.connectsTo.join(', ')}</p>
    `);
}

function showDetailPanel(content) {
    const panel = document.getElementById('detail-panel');
    const panelContent = document.getElementById('panel-content');
    
    panelContent.innerHTML = content;
    panel.classList.add('active');
}

function closeDetailPanel() {
    const panel = document.getElementById('detail-panel');
    panel.classList.remove('active');
}

// Add CSS for dynamically created elements
const dynamicStyles = `
<style>
.part-flowchart-item,
.stage-spiral-item,
.discipline-galaxy-item {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 1rem;
    margin: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.part-flowchart-item:hover,
.stage-spiral-item:hover,
.discipline-galaxy-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.2);
}

.part-header,
.stage-header,
.discipline-header {
    border-left: 4px solid;
    padding-left: 1rem;
    margin-bottom: 1rem;
}

.part-header h3,
.stage-header h3,
.discipline-header h3 {
    color: #fff;
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.part-header p,
.stage-header p,
.discipline-header p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-size: 0.9rem;
}

.timeline {
    display: inline-block;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 20px;
    font-size: 0.8rem;
    margin-top: 0.5rem;
}

.pathway-flow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.pathway-route {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.pathway-step {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid;
    border-radius: 12px;
    padding: 1rem;
    min-width: 300px;
}

.step-number {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #fff;
}

.step-content {
    color: #fff;
    font-weight: 500;
}

.pathway-arrow {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 768px) {
    .pathway-step {
        min-width: 250px;
    }
    
    .part-flowchart-item,
    .stage-spiral-item,
    .discipline-galaxy-item {
        margin: 0.5rem;
        padding: 0.75rem;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);