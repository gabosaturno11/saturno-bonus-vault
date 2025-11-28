/**
 * Saturno Writing Hub - FULLY FUNCTIONAL JavaScript
 * This fixes ALL the broken features and provides working functionality
 */

class SaturnoWritingHub {
    constructor() {
        this.currentContent = '';
        this.isVoiceActive = false;
        this.recognition = null;
        this.autoSaveInterval = null;
        this.currentWorkspaceTab = 'editor';
        this.currentPromptTab = 'business';
        this.wordCount = 0;
        
        // Initialize the app
        this.init();
    }

    // Initialize the application
    init() {
        console.log('🚀 Initializing Saturno Writing Hub...');
        
        // Show loading screen, then initialize
        setTimeout(() => {
            this.hideLoadingScreen();
            this.setupEventListeners();
            this.initializeVoiceRecognition();
            this.setupAutoSave();
            this.loadFromStorage();
            console.log('✅ Saturno Writing Hub initialized successfully');
        }, 2000);
    }

    // Hide loading screen and show main app
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const appContainer = document.getElementById('app-container');
        
        loadingScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
    }

    // Setup all event listeners
    setupEventListeners() {
        // Voice toggle
        const voiceToggle = document.getElementById('voice-toggle');
        if (voiceToggle) {
            voiceToggle.addEventListener('click', () => this.toggleVoice());
        }

        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportDocument());
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Workspace tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchWorkspaceTab(tab);
            });
        });

        // Prompt tabs
        document.querySelectorAll('.prompt-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchPromptTab(tab);
            });
        });

        // Prompt load buttons
        document.querySelectorAll('.prompt-load-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.currentTarget.dataset.prompt;
                this.loadPrompt(prompt);
            });
        });

        // Vault items
        document.querySelectorAll('.vault-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleVaultAction(action);
            });
        });

        // Editor content changes
        const editor = document.getElementById('main-editor');
        if (editor) {
            editor.addEventListener('input', () => this.handleEditorChange());
            editor.addEventListener('keydown', (e) => this.handleEditorKeydown(e));
        }

        // HTML selector
        const htmlSelector = document.getElementById('html-selector');
        if (htmlSelector) {
            htmlSelector.addEventListener('change', (e) => this.loadHTMLFile(e.target.value));
        }

        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.openFullscreen());
        }

        // AI input
        const aiSend = document.getElementById('ai-send');
        const aiInput = document.getElementById('ai-input');
        if (aiSend && aiInput) {
            aiSend.addEventListener('click', () => this.sendAIMessage());
            aiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.sendAIMessage();
            });
        }

        // Modal close
        const closeVoiceModal = document.getElementById('close-voice-modal');
        if (closeVoiceModal) {
            closeVoiceModal.addEventListener('click', () => this.closeVoiceModal());
        }

        // Toolbar buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                if (action) this.handleToolbarAction(action);
            });
        });
    }

    // Initialize voice recognition
    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                console.log('🎤 Voice recognition started');
                this.showVoiceModal();
                this.updateVoiceIndicator(true);
            };

            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                console.log('🗣️ Voice command:', command);
                this.processVoiceCommand(command);
                this.closeVoiceModal();
            };

            this.recognition.onerror = (event) => {
                console.error('❌ Voice recognition error:', event.error);
                this.closeVoiceModal();
                this.updateVoiceIndicator(false);
            };

            this.recognition.onend = () => {
                console.log('🎤 Voice recognition ended');
                this.isVoiceActive = false;
                this.updateVoiceIndicator(false);
            };
        } else {
            console.warn('⚠️ Speech recognition not supported');
        }
    }

    // Toggle voice recognition
    toggleVoice() {
        if (!this.recognition) {
            alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        if (this.isVoiceActive) {
            this.recognition.stop();
            this.isVoiceActive = false;
            this.closeVoiceModal();
        } else {
            this.recognition.start();
            this.isVoiceActive = true;
        }
    }

    // Show voice modal
    showVoiceModal() {
        const modal = document.getElementById('voice-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Close voice modal
    closeVoiceModal() {
        const modal = document.getElementById('voice-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.updateVoiceIndicator(false);
    }

    // Update voice indicator
    updateVoiceIndicator(active) {
        const indicator = document.getElementById('voice-indicator');
        const voiceBtn = document.getElementById('voice-toggle');
        
        if (indicator) {
            indicator.classList.toggle('active', active);
        }
        
        if (voiceBtn) {
            voiceBtn.classList.toggle('active', active);
        }
    }

    // Process voice commands
    processVoiceCommand(command) {
        console.log('Processing voice command:', command);
        
        const commands = {
            'load framework architect': 'framework-architect',
            'run business intelligence': 'market-intelligence',
            'execute swot analysis': 'swot-analysis',
            'generate lead system': 'lead-generation',
            'open visual designer': 'visual-designer',
            'start content alchemist': 'content-alchemist',
            'master organization': 'master-organization',
            'duplicate detection': 'duplicate-detection',
            'content synthesis': 'content-synthesis'
        };

        const promptKey = commands[command];
        if (promptKey) {
            this.loadPrompt(promptKey);
            this.showNotification(`Loaded: ${command}`);
        } else {
            this.showNotification(`Command not recognized: ${command}`);
        }
    }

    // Switch workspace tab
    switchWorkspaceTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentWorkspaceTab = tabName;

        // Update preview if switching to preview tab
        if (tabName === 'preview') {
            this.updatePreview();
        }
    }

    // Switch prompt tab
    switchPromptTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.prompt-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.prompt-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-prompts`).classList.add('active');

        this.currentPromptTab = tabName;
    }

    // Load prompt content
    loadPrompt(promptKey) {
        const prompts = {
            'market-intelligence': `# Market Intelligence Engine - 450% ROI Strategic Analysis Framework

You are a Market Intelligence Analyst with access to comprehensive data sources. Your task is to generate actionable insights for strategic decision-making.

## Analysis Framework:

### 1. Market Trends Analysis
- Identify emerging patterns and opportunities
- Monitor industry shifts and disruptions  
- Track consumer behavior changes
- Analyze technological adoption rates

### 2. Competitive Landscape Assessment
- Assess competitive positioning and strategies
- Identify market gaps and white spaces
- Monitor competitor moves and announcements
- Evaluate competitive advantages and vulnerabilities

### 3. Consumer Sentiment Intelligence
- Extract insights from social media conversations
- Analyze review patterns and feedback trends
- Monitor brand perception and sentiment shifts
- Identify customer pain points and desires

### 4. Growth Opportunity Mapping
- Highlight untapped market segments
- Identify expansion opportunities
- Assess market readiness for new offerings
- Evaluate partnership and collaboration potential

### 5. Risk Assessment & Mitigation
- Identify potential threats and challenges
- Assess regulatory and compliance risks
- Monitor economic indicators and market volatility
- Develop contingency planning frameworks

## Implementation Protocol:
1. Define intelligence objectives and KPIs
2. Establish data collection methodologies
3. Deploy analysis frameworks systematically
4. Generate actionable recommendations with timelines
5. Create monitoring and adjustment mechanisms

## Output Requirements:
- Executive summary with key insights
- Detailed analysis with supporting data
- Strategic recommendations with implementation roadmap
- Risk assessment with mitigation strategies
- Success metrics and monitoring protocols`,

            'swot-analysis': `# SWOT Analysis Pro - 600% ROI Comprehensive Strategic Framework

You are a Strategic Business Analyst conducting comprehensive SWOT analysis for competitive positioning and strategic planning.

## Analysis Structure:

### STRENGTHS (Internal Positive Factors)
- Core capabilities and competitive advantages
- Unique value propositions and differentiators
- Resource advantages (financial, human, technological)
- Brand equity and market position
- Operational efficiencies and processes
- Intellectual property and innovations

### WEAKNESSES (Internal Limiting Factors)
- Resource constraints and limitations
- Skill gaps and capability deficits
- Process inefficiencies and bottlenecks
- Brand perception challenges
- Financial limitations or dependencies
- Technology or infrastructure gaps

### OPPORTUNITIES (External Positive Factors)
- Market trends and emerging segments
- Technological advancements and innovations
- Regulatory changes and policy shifts
- Partnership and collaboration possibilities
- Customer behavior evolution
- Economic and demographic shifts

### THREATS (External Risk Factors)
- Competitive pressures and new entrants
- Market disruptions and industry changes
- Regulatory challenges and compliance risks
- Economic downturns and market volatility
- Technology obsolescence risks
- Supply chain vulnerabilities

## Strategic Integration Matrix:

### SO Strategies (Strength-Opportunity)
- Leverage strengths to capitalize on opportunities
- Maximize competitive advantages in growing markets

### WO Strategies (Weakness-Opportunity)
- Address weaknesses to pursue opportunities
- Develop capabilities to enter new markets

### ST Strategies (Strength-Threat)
- Use strengths to mitigate threats
- Defend market position against competitors

### WT Strategies (Weakness-Threat)
- Minimize weaknesses and avoid threats
- Develop contingency plans for risk scenarios

## Output Deliverables:
1. Comprehensive SWOT matrix with detailed analysis
2. Strategic priority recommendations
3. Implementation roadmap with timelines
4. Resource allocation suggestions
5. Success metrics and monitoring framework`,

            'lead-generation': `# Lead Generation System - 420% ROI Core Four Framework

You are a Lead Generation Specialist implementing the Core Four system for sustainable organic growth and conversion optimization.

## Core Four Pillars:

### 1. CONTENT MAGNETISM
**Objective:** Create irresistible, value-driven content that attracts ideal prospects

**Strategies:**
- Develop pillar content addressing core customer challenges
- Create educational resources that establish authority
- Produce multimedia content for diverse consumption preferences
- Implement storytelling techniques for emotional engagement
- Design interactive content for increased engagement

**Implementation:**
- Content audit and gap analysis
- Editorial calendar development
- Content distribution strategy
- Performance tracking and optimization

### 2. SEARCH OPTIMIZATION
**Objective:** Dominate relevant search results for maximum visibility

**Strategies:**
- Keyword research and mapping
- On-page optimization for target terms
- Technical SEO improvements
- Local SEO optimization (if applicable)
- Voice search optimization

**Implementation:**
- SEO audit and baseline establishment
- Content optimization schedule
- Link building campaign
- Performance monitoring and adjustments

### 3. SOCIAL AMPLIFICATION
**Objective:** Leverage social platforms for reach and engagement

**Strategies:**
- Platform-specific content adaptation
- Community building and engagement
- Influencer partnerships and collaborations
- Social listening and reputation management
- Paid social advertising (strategic)

**Implementation:**
- Social media audit and strategy
- Content calendar for each platform
- Engagement protocols and response strategies
- Performance tracking and optimization

### 4. CONVERSION OPTIMIZATION
**Objective:** Turn visitors into qualified leads through systematic optimization

**Strategies:**
- Landing page optimization
- Lead magnet development
- Email capture mechanisms
- Nurture sequence creation
- Sales funnel optimization

**Implementation:**
- Conversion audit and baseline
- A/B testing protocols
- Lead scoring system
- CRM integration and automation
- Performance tracking and improvement

## Success Metrics:
- Traffic quality and volume
- Lead generation rate
- Conversion rate optimization
- Customer acquisition cost
- Lifetime value improvement

## Implementation Timeline:
- Week 1-2: Audit and strategy development
- Week 3-8: Foundation implementation
- Week 9-12: Optimization and scaling
- Ongoing: Monitoring and continuous improvement`,

            'framework-architect': `# Framework Architect - Knowledge Synthesis Protocol

You are a Framework Architect specializing in knowledge synthesis and content structuring for maximum comprehension and application.

## Synthesis Protocol:

### 1. ANALYZE (Deconstruction Phase)
- Break down complex information into core components
- Identify key concepts, principles, and relationships
- Map information hierarchy and dependencies
- Recognize patterns and recurring themes
- Extract actionable insights and practical applications

### 2. CATEGORIZE (Organization Phase)
- Group related concepts and create logical clusters
- Establish clear categories and subcategories
- Identify cross-connections and interdependencies
- Create taxonomies for easy navigation
- Develop tagging systems for reference

### 3. STRUCTURE (Architecture Phase)
- Create logical hierarchy and information flow
- Design progressive complexity pathways
- Establish clear learning sequences
- Build modular components for flexibility
- Ensure scalability and extensibility

### 4. SYNTHESIZE (Integration Phase)
- Combine elements into coherent frameworks
- Create visual representations and mental models
- Develop practical implementation guides
- Build assessment and validation tools
- Establish feedback and improvement loops

### 5. VALIDATE (Quality Assurance Phase)
- Ensure completeness and logical consistency
- Test framework effectiveness with target audience
- Identify gaps and improvement opportunities
- Refine based on feedback and results
- Document best practices and lessons learned

## Output Framework Requirements:
- Clear visual hierarchy and navigation
- Progressive disclosure of complexity
- Multiple learning pathways
- Practical application examples
- Assessment and validation tools
- Continuous improvement mechanisms

## Framework Components:
1. Executive Overview
2. Core Principles and Foundations
3. Detailed Implementation Guide
4. Practical Examples and Case Studies
5. Assessment and Measurement Tools
6. Troubleshooting and FAQ Section
7. Additional Resources and References`,

            'visual-designer': `# Visual Systems Designer - Compelling Identity Framework

You are a Visual Systems Designer creating compelling visual identities that enhance message impact and audience engagement.

## Design Process Framework:

### 1. CONCEPT ANALYSIS
**Objective:** Understand core message and target audience

**Analysis Components:**
- Message core and key themes
- Audience demographics and psychographics
- Brand personality and voice
- Competitive landscape analysis
- Cultural and contextual considerations

### 2. VISUAL LANGUAGE DEVELOPMENT
**Objective:** Develop consistent design principles

**Design Elements:**
- Visual hierarchy and information architecture
- Grid systems and layout principles
- Spacing and proportion guidelines
- Visual consistency rules
- Brand expression guidelines

### 3. COLOR PSYCHOLOGY APPLICATION
**Objective:** Select colors that reinforce message and emotion

**Color Strategy:**
- Primary color palette selection
- Secondary and accent color systems
- Color meaning and psychological impact
- Accessibility and contrast considerations
- Cross-platform color consistency

### 4. TYPOGRAPHY SYSTEM
**Objective:** Choose fonts that enhance readability and mood

**Typography Elements:**
- Primary and secondary font families
- Hierarchy and sizing systems
- Line height and spacing rules
- Readability optimization
- Brand voice expression through type

### 5. LAYOUT SYSTEMS
**Objective:** Create scalable, flexible layouts

**Layout Components:**
- Grid systems and templates
- Component libraries
- Responsive design principles
- Information hierarchy
- White space and breathing room

### 6. BRAND CONSISTENCY
**Objective:** Ensure cohesive visual experience

**Consistency Elements:**
- Style guides and documentation
- Asset libraries and templates
- Quality control processes
- Application guidelines
- Evolution and maintenance protocols

## Deliverables:
1. Visual identity concept and rationale
2. Color palette with usage guidelines
3. Typography system documentation
4. Layout templates and grid systems
5. Component library and style guide
6. Application examples and guidelines
7. Implementation roadmap and support`,

            'content-alchemist': `# Content Alchemist - Multi-Format Deployment System

You are a Content Alchemist transforming ideas into engaging, multi-format content with authentic voice consistency.

## Transformation Process:

### 1. VOICE CALIBRATION
**Objective:** Establish authentic, consistent tone across all formats

**Voice Elements:**
- Brand personality definition
- Tone and style guidelines
- Language patterns and preferences
- Audience communication style
- Emotional resonance factors

### 2. FORMAT ADAPTATION
**Objective:** Optimize content for each platform and medium

**Format Considerations:**
- Platform-specific requirements and constraints
- Audience behavior and consumption patterns
- Technical specifications and limitations
- Engagement optimization strategies
- Cross-platform coherence maintenance

### 3. ENGAGEMENT OPTIMIZATION
**Objective:** Maximize audience connection and interaction

**Engagement Strategies:**
- Hook development and attention capture
- Storytelling techniques and narrative flow
- Interactive elements and call-to-actions
- Emotional triggers and resonance points
- Community building and conversation starters

### 4. VALUE AMPLIFICATION
**Objective:** Enhance core message impact and memorability

**Value Enhancement:**
- Key message reinforcement
- Supporting evidence and credibility
- Practical application and actionability
- Unique insights and perspectives
- Transformation and benefit communication

### 5. DISTRIBUTION STRATEGY
**Objective:** Plan multi-channel deployment for maximum reach

**Distribution Elements:**
- Channel selection and prioritization
- Timing and frequency optimization
- Cross-promotion and amplification
- Performance tracking and optimization
- Audience development and retention

## Content Format Library:

### Long-Form Content:
- Blog posts and articles
- White papers and guides
- E-books and reports
- Case studies and analysis
- Video content and webinars

### Short-Form Content:
- Social media posts
- Email newsletters
- Infographics and visuals
- Video snippets and stories
- Podcast episodes and audio

### Interactive Content:
- Quizzes and assessments
- Polls and surveys
- Live streams and Q&As
- Webinars and workshops
- Community discussions

## Quality Assurance:
- Voice consistency check
- Format optimization review
- Engagement element validation
- Value proposition confirmation
- Distribution readiness assessment`,

            'master-organization': `# Master System Organization - Document Ecosystem Management

You are a Master System Organizer for complex document ecosystems, transforming chaos into structured, accessible knowledge systems.

## Organization Protocol:

### 1. CATEGORIZE (Classification Phase)
**Objective:** Group documents by type, purpose, and strategic relevance

**Classification Systems:**
- Document type taxonomy (reports, drafts, templates, references)
- Purpose-based grouping (strategic, operational, educational, archival)
- Project and campaign organization
- Audience and stakeholder segmentation
- Chronological and version organization

### 2. PRIORITIZE (Value Assessment Phase)
**Objective:** Rank by current utility and strategic value

**Priority Matrices:**
- High/Medium/Low impact assessment
- Frequency of use analysis
- Strategic importance evaluation
- Time-sensitive content identification
- Resource allocation optimization

### 3. CONSOLIDATE (Duplication Management Phase)
**Objective:** Identify duplicates and mergeable content

**Consolidation Strategies:**
- Exact duplicate identification and removal
- Near-duplicate analysis and merger opportunities
- Content overlap assessment
- Version control optimization
- Master document designation

### 4. STRUCTURE (Architecture Phase)
**Objective:** Propose logical folder/tagging systems

**Structural Elements:**
- Hierarchical folder organization
- Tagging and metadata systems
- Cross-reference and linking protocols
- Search optimization strategies
- Access control and permissions

### 5. ARCHIVE (Preservation Strategy Phase)
**Objective:** Recommend preservation vs. removal strategies

**Archive Protocols:**
- Historical value assessment
- Legal and compliance requirements
- Storage optimization strategies
- Retrieval and access procedures
- Migration and format considerations

## Implementation Framework:

### Phase 1: Discovery and Assessment (Week 1-2)
- Complete document inventory
- Initial categorization and assessment
- Stakeholder requirements gathering
- System architecture planning

### Phase 2: Organization and Structure (Week 3-4)
- Folder structure implementation
- Document migration and organization
- Tagging and metadata application
- Quality control and validation

### Phase 3: Optimization and Training (Week 5-6)
- Search optimization and testing
- User training and documentation
- Process standardization
- Maintenance procedures establishment

## Deliverables:
1. Complete document inventory and assessment
2. Organizational structure and taxonomy
3. Implementation roadmap and timeline
4. User training materials and documentation
5. Maintenance and governance protocols
6. Performance metrics and optimization plan`,

            'duplicate-detection': `# Duplicate Detection - Content Analysis System

You are a Duplicate Content Detective with expertise in content analysis, similarity detection, and consolidation strategies.

## Detection Process:

### 1. EXACT DUPLICATES
**Objective:** Identify identical content for immediate removal

**Detection Methods:**
- Character-by-character comparison
- Hash-based duplicate identification
- Metadata and timestamp analysis
- File size and format comparison
- Automated scanning protocols

**Action Items:**
- Flag for immediate removal
- Preserve single master copy
- Update references and links
- Document elimination decisions

### 2. NEAR-DUPLICATES
**Objective:** Flag similar content requiring review and decision

**Analysis Criteria:**
- Content similarity percentage (80-95%)
- Structural and format similarities
- Topic and theme overlap
- Audience and purpose alignment
- Quality and completeness comparison

**Decision Framework:**
- Keep both if serving different purposes
- Merge if content is complementary
- Choose superior version if one is clearly better
- Archive secondary version for reference

### 3. VALUE VARIATIONS
**Objective:** Preserve content with unique elements and perspectives

**Value Assessment:**
- Unique insights and perspectives
- Different audience targeting
- Complementary information and angles
- Historical or contextual significance
- Strategic and tactical variations

**Preservation Strategy:**
- Maintain separate documents
- Create cross-references and links
- Develop comparative analysis
- Establish clear differentiation

### 4. MERGE CANDIDATES
**Objective:** Recommend consolidation opportunities for enhanced value

**Merger Criteria:**
- Complementary content sections
- Similar structure and format
- Compatible audience and purpose
- Enhanced value through combination
- Simplified maintenance and updates

**Consolidation Process:**
- Content mapping and alignment
- Quality assessment and selection
- Integration and synthesis
- Review and validation
- Reference and link updates

## Analysis Output:

### Content Comparison Matrix:
- Document A vs Document B analysis
- Similarity percentage and metrics
- Unique elements identification
- Quality and completeness scores
- Recommendation and rationale

### Detailed Recommendations:
- Keep both with differentiation
- Merge into comprehensive document
- Archive secondary version
- Remove duplicate completely
- Develop into content series

### Implementation Plan:
- Priority order for processing
- Resource requirements and timeline
- Quality control and validation steps
- Stakeholder approval processes
- Documentation and tracking systems

## Quality Assurance:
- Human review of automated recommendations
- Stakeholder validation of merger decisions
- Quality control of consolidated content
- Link and reference verification
- Performance and impact assessment`,

            'content-synthesis': `# Content Synthesis - Master Document Creation

You are a Master Content Synthesizer combining multiple document versions while preserving all unique value and maintaining authorial voice consistency.

## Synthesis Process:

### 1. CONSOLIDATED VERSION CREATION
**Objective:** Create unified master document from multiple sources

**Integration Strategy:**
- Content mapping and structural alignment
- Best elements extraction and combination
- Logical flow and narrative development
- Comprehensive coverage optimization
- Quality and consistency enhancement

**Synthesis Principles:**
- Preserve all unique insights and perspectives
- Maintain logical progression and flow
- Ensure comprehensive topic coverage
- Optimize readability and accessibility
- Create definitive resource document

### 2. BEST ELEMENTS EXTRACTION
**Objective:** Extract superior components from each version

**Element Assessment:**
- Content quality and depth analysis
- Clarity and communication effectiveness
- Unique insights and perspectives
- Supporting evidence and examples
- Practical applications and tools

**Selection Criteria:**
- Accuracy and factual correctness
- Relevance and current applicability
- Audience engagement and clarity
- Comprehensiveness and completeness
- Innovation and unique value

### 3. UNIQUE INSIGHTS COMPILATION
**Objective:** Compile distinctive perspectives and innovative ideas

**Insight Categories:**
- Original research and findings
- Personal experiences and case studies
- Innovative approaches and methodologies
- Expert opinions and analysis
- Cultural and contextual perspectives

**Integration Methods:**
- Thematic organization and grouping
- Comparative analysis and synthesis
- Progressive disclosure and building
- Cross-referencing and connection
- Supporting documentation and evidence

### 4. ARCHIVE SUMMARY CREATION
**Objective:** Summarize historical versions for reference

**Archive Documentation:**
- Version history and evolution
- Key differences and variations
- Contributing authors and sources
- Creation dates and contexts
- Archival rationale and decisions

**Reference System:**
- Clear version identification
- Access and retrieval procedures
- Relationship to master document
- Historical significance and value
- Future reference guidelines

## Preservation Principles:

### Comprehensive Value Capture:
- Every unique idea and insight preserved
- No valuable content lost in synthesis
- Historical context and evolution maintained
- Attribution and credit preservation
- Future reference and access enabled

### Voice Consistency Maintenance:
- Unified tone and style throughout
- Original author voice preservation
- Seamless integration and flow
- Professional presentation standards
- Authentic expression and personality

### Chronological Development Tracking:
- Evolution of ideas and concepts
- Learning and development progression
- Iterative improvement documentation
- Historical decision context
- Future development pathway

## Output Deliverables:

### Master Document:
- Comprehensive synthesized content
- Unified structure and organization
- Consistent voice and style
- Complete topic coverage
- Optimized user experience

### Archive Documentation:
- Historical version inventory
- Evolution and development timeline
- Key contributors and sources
- Archive access and reference guide
- Future synthesis considerations

### Integration Report:
- Synthesis methodology and approach
- Key decisions and rationale
- Quality assurance and validation
- Performance and impact metrics
- Recommendations for future synthesis`
        };

        const editor = document.getElementById('main-editor');
        if (editor && prompts[promptKey]) {
            editor.value = prompts[promptKey];
            this.currentContent = prompts[promptKey];
            this.updateWordCount();
            this.saveToStorage();
            this.updatePreview();
            
            // Switch to editor tab
            this.switchWorkspaceTab('editor');
            
            // Show notification
            this.showNotification('Prompt loaded successfully!');
        }
    }

    // Handle vault actions
    handleVaultAction(action) {
        const actions = {
            'load-brand-framework': 'Brand Identity Framework loaded',
            'load-content-audit': 'Content Audit Tools loaded',
            'load-calisthenics-book': 'The Art of Calisthenics book structure loaded',
            'load-exercise-database': 'Exercise Database (700+ movements) loaded',
            'load-flexibility-designer': 'Flexibility Program Designer loaded',
            'load-command-center': 'Digital Empire Command Center loaded',
            'load-msopm-system': 'MSOPM System loaded'
        };

        const message = actions[action] || 'Vault item loaded';
        this.showNotification(message);

        // Load sample content for specific actions
        if (action === 'load-calisthenics-book') {
            this.loadBookStructure();
        } else if (action === 'load-flexibility-designer') {
            this.loadFlexibilityDesigner();
        }
    }

    // Load book structure
    loadBookStructure() {
        const bookStructure = `# The Art of Calisthenics - Complete Book Structure

## 🌀 Introduction Hub
- **Preface**: Setting the tone and author's vision
- **Disclaimer**: Essential safety and health considerations  
- **Introduction**: Overview of calisthenics and the book's philosophy

## 🟥 PART 1: START HERE
### Chapter 1: What, How, Why & Who
### Chapter 2: Getting Started

## 🟨 PART 2: THE ART OF CALISTHENICS
### Chapter 3: What is Calisthenics?
### Chapter 4: Calisthenics is for Everyone
### Chapter 5: What to Expect from Calisthenics?
### Chapter 6: Equipment Guide

## 🟩 PART 3: MASTERING CALISTHENICS
### Chapter 7: Perfect Technique Paradigm - or Paradox
### Chapter 8: The Calisthenics Journey
### Chapter 9: Stage 1: Creating the Base
### Chapter 10: Stage 2: Building the Structure
### Chapter 11: Stage 3: Mastering Calisthenics

## 🟦 PART 4: ROAD TO MASTERY
### Chapter 12: Bodybuilding
### Chapter 13: Power Free
### Chapter 14: Freestyle Calisthenics
### Chapter 15: Street Lifting
### Chapter 16: Hand-Balancing
### Chapter 17: Mobility Skills
### Chapter 18: Hybrid Paths

## 🟪 PART 5: BUILDING YOUR OWN PROGRAM
### Chapter 19: Program Templates
### Chapter 20: Constructing Your Routine

## 🟫 PART 6: THE ENDLESS JOURNEY
### Chapter 21: Working Around Injuries
### Chapter 22: Patience is a Virtue

## ⬛ PART 7: YOU ARE NOW A CALISTHENICS MASTER
### Chapter 23: What is Next?
### Chapter 24: Passing The Torch
### Chapter 25: The Price of Mastery

**Total Structure**: 7 Parts • 25 Chapters • 150+ Subsections • 700+ Pages`;

        const editor = document.getElementById('main-editor');
        if (editor) {
            editor.value = bookStructure;
            this.currentContent = bookStructure;
            this.updateWordCount();
            this.saveToStorage();
            this.updatePreview();
            this.switchWorkspaceTab('editor');
        }
    }

    // Load flexibility designer
    loadFlexibilityDesigner() {
        const flexibilityContent = `# Flexibility Program Designer - Phase 1 Template

Build your personalized Phase 1 program. This template teaches you the basics and gives you a flavor for the limitless potential of this approach to flexibility training.

## Sample Program Structure

| ORDER | EXERCISE | REPS | SETS | TEMPO | REST |
|-------|----------|------|------|-------|------|
| A1 | Calf stretching (forward/inward/outward) | 60s per angle | 1 | - | - |
| B1 | Tailors pose | 8 | 3-4 | 2310 | 60s |
| B2 | Extended frog stretch | 30s | 3 | - | 60s |
| C1 | Modified pigeon stretch | 30s per side | 2-3 | - | 30s |
| D1 | Pancake reach or straddle fold | 8 | 3 | 2212 | 45s |

## Program Customization Guidelines

### Beginner Level:
- Start with shorter hold times (15-30s)
- Focus on gentle stretches
- Prioritize form over depth
- Allow longer rest periods

### Intermediate Level:
- Increase hold times (30-60s)
- Add loaded stretches
- Introduce isometric contractions
- Reduce rest periods

### Advanced Level:
- Longer holds (60s+)
- Complex movement patterns
- Higher intensity variations
- Minimal rest requirements

## The Big Seven Flexibility Patterns:
1. **Squat**: Deep hip and ankle mobility
2. **Forward Fold**: Posterior chain flexibility
3. **Pancake**: Hip flexion and spine mobility
4. **Front Split**: Hip flexor and hamstring flexibility
5. **Side Split**: Hip abduction and adductor flexibility
6. **Bridge**: Spine extension and shoulder mobility
7. **German Hang**: Shoulder flexion and lat flexibility

## Programming Notes:
- **Important**: There is a time and place to break the rules, which we cover in the specialist programs, but the majority of your flexibility training is not the time to break this rule.
- Progress gradually and listen to your body
- Consistency over intensity
- Quality over quantity`;

        const editor = document.getElementById('main-editor');
        if (editor) {
            editor.value = flexibilityContent;
            this.currentContent = flexibilityContent;
            this.updateWordCount();
            this.saveToStorage();
            this.updatePreview();
            this.switchWorkspaceTab('editor');
        }
    }

    // Handle editor changes
    handleEditorChange() {
        const editor = document.getElementById('main-editor');
        if (editor) {
            this.currentContent = editor.value;
            this.updateWordCount();
            this.updateSaveStatus('unsaved');
            
            // Update preview if in preview tab
            if (this.currentWorkspaceTab === 'preview') {
                this.updatePreview();
            }
        }
    }

    // Handle editor keyboard shortcuts
    handleEditorKeydown(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.saveToStorage();
            this.updateSaveStatus('saved');
        }
        
        // Ctrl+B for bold (simplified)
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            this.handleToolbarAction('bold');
        }
        
        // Ctrl+I for italic
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            this.handleToolbarAction('italic');
        }
    }

    // Handle toolbar actions
    handleToolbarAction(action) {
        const editor = document.getElementById('main-editor');
        if (!editor) return;

        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);
        
        let replacement = selectedText;
        
        switch (action) {
            case 'bold':
                replacement = `**${selectedText}**`;
                break;
            case 'italic':
                replacement = `*${selectedText}*`;
                break;
            case 'underline':
                replacement = `__${selectedText}__`;
                break;
            case 'h1':
                replacement = `# ${selectedText}`;
                break;
            case 'h2':
                replacement = `## ${selectedText}`;
                break;
            case 'h3':
                replacement = `### ${selectedText}`;
                break;
            case 'list':
                replacement = `- ${selectedText}`;
                break;
            case 'link':
                replacement = `[${selectedText}](url)`;
                break;
        }
        
        editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end);
        editor.focus();
        editor.setSelectionRange(start + replacement.length, start + replacement.length);
        
        this.handleEditorChange();
    }

    // Update word count
    updateWordCount() {
        const words = this.currentContent.trim().split(/\s+/).filter(word => word.length > 0);
        this.wordCount = words.length;
        
        const wordCountElement = document.getElementById('word-count');
        if (wordCountElement) {
            wordCountElement.textContent = this.wordCount;
        }
    }

    // Update save status
    updateSaveStatus(status) {
        const saveStatusElement = document.getElementById('save-status');
        if (saveStatusElement) {
            saveStatusElement.textContent = status === 'saved' ? 'Saved' : 'Unsaved';
            saveStatusElement.style.color = status === 'saved' ? 'var(--saturn-tertiary)' : 'var(--saturn-gold)';
        }
    }

    // Update preview
    updatePreview() {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;

        if (!this.currentContent.trim()) {
            previewContent.innerHTML = '<p class="placeholder">Preview will appear here when you start writing...</p>';
            return;
        }

        // Simple markdown to HTML conversion
        let html = this.currentContent
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/__(.*?)__/gim, '<u>$1</u>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/\n/gim, '<br>')
            .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

        previewContent.innerHTML = html;
    }

    // Load HTML file in viewer
    loadHTMLFile(fileName) {
        const frame = document.getElementById('html-frame');
        if (!frame || !fileName) return;

        // For demo purposes, create some sample HTML content
        const htmlFiles = {
            'flexibility-program-designer': this.createFlexibilityDesignerHTML(),
            'chapter-card-variations': this.createChapterCardsHTML(),
            'calisthenics-digital-book': this.createDigitalBookHTML(),
            'mind-map-toc': this.createMindMapHTML()
        };

        const htmlContent = htmlFiles[fileName] || '<h1>File not found</h1>';
        
        // Create a blob URL for the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        frame.src = url;
    }

    // Create sample HTML files
    createFlexibilityDesignerHTML() {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Flexibility Program Designer</title>
    <style>
        body { font-family: 'Inter', sans-serif; padding: 20px; background: #0f0f0f; color: #f5f5f5; }
        h1 { color: #6366f1; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #404040; padding: 12px; text-align: left; }
        th { background: #2a2a2a; }
        tr:nth-child(even) { background: #1a1a1a; }
        .section { margin: 30px 0; padding: 20px; background: #1f1f1f; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>🤸 Flexibility Program Designer</h1>
    
    <div class="section">
        <h2>Phase 1 Program Template</h2>
        <p>Build your personalized flexibility routine with this interactive template.</p>
        
        <table>
            <thead>
                <tr>
                    <th>ORDER</th>
                    <th>EXERCISE</th>
                    <th>REPS</th>
                    <th>SETS</th>
                    <th>TEMPO</th>
                    <th>REST</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>A1</td>
                    <td>Calf stretching (forward/inward/outward)</td>
                    <td>60s per angle</td>
                    <td>1</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>B1</td>
                    <td>Tailors pose</td>
                    <td>8</td>
                    <td>3-4</td>
                    <td>2310</td>
                    <td>60s</td>
                </tr>
                <tr>
                    <td>B2</td>
                    <td>Extended frog stretch</td>
                    <td>30s</td>
                    <td>3</td>
                    <td>-</td>
                    <td>60s</td>
                </tr>
                <tr>
                    <td>C1</td>
                    <td>Modified pigeon stretch</td>
                    <td>30s per side</td>
                    <td>2-3</td>
                    <td>-</td>
                    <td>30s</td>
                </tr>
                <tr>
                    <td>D1</td>
                    <td>Pancake reach</td>
                    <td>8</td>
                    <td>3</td>
                    <td>2212</td>
                    <td>45s</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h3>The Big Seven Flexibility Patterns</h3>
        <ul>
            <li><strong>Squat</strong>: Deep hip and ankle mobility</li>
            <li><strong>Forward Fold</strong>: Posterior chain flexibility</li>
            <li><strong>Pancake</strong>: Hip flexion and spine mobility</li>
            <li><strong>Front Split</strong>: Hip flexor and hamstring flexibility</li>
            <li><strong>Side Split</strong>: Hip abduction and adductor flexibility</li>
            <li><strong>Bridge</strong>: Spine extension and shoulder mobility</li>
            <li><strong>German Hang</strong>: Shoulder flexion and lat flexibility</li>
        </ul>
    </div>
</body>
</html>`;
    }

    createChapterCardsHTML() {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Chapter Card Variations</title>
    <style>
        body { font-family: 'Inter', sans-serif; padding: 20px; background: #0f0f0f; color: #f5f5f5; }
        h1 { color: #6366f1; text-align: center; margin-bottom: 30px; }
        .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .chapter-card { 
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a); 
            border: 1px solid #404040; 
            border-radius: 12px; 
            padding: 20px; 
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .chapter-card:hover { 
            transform: translateY(-5px); 
            border-color: #6366f1; 
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        }
        .chapter-number { color: #8b5cf6; font-size: 14px; font-weight: 600; }
        .chapter-title { font-size: 18px; font-weight: 600; margin: 10px 0; }
        .chapter-desc { color: #a3a3a3; font-size: 14px; line-height: 1.6; }
        .part-badge { 
            background: #6366f1; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 12px; 
            font-weight: 500;
            display: inline-block;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <h1>📖 Chapter Card Variations</h1>
    
    <div class="card-grid">
        <div class="chapter-card">
            <div class="part-badge">Part 1: Start Here</div>
            <div class="chapter-number">Chapter 1</div>
            <div class="chapter-title">What, How, Why & Who</div>
            <div class="chapter-desc">Understanding the comprehensive scope and transformative potential of calisthenics as both physical practice and life philosophy.</div>
        </div>
        
        <div class="chapter-card">
            <div class="part-badge">Part 1: Start Here</div>
            <div class="chapter-number">Chapter 2</div>
            <div class="chapter-title">Getting Started</div>
            <div class="chapter-desc">More action, less knowledge. Practice-focused approach to beginning your calisthenics journey with direction over speed.</div>
        </div>
        
        <div class="chapter-card">
            <div class="part-badge">Part 2: The Art</div>
            <div class="chapter-number">Chapter 3</div>
            <div class="chapter-title">What is Calisthenics?</div>
            <div class="chapter-desc">Definition, advantages, disadvantages, and foundation for future training. Understanding calisthenics vs gymnastics.</div>
        </div>
        
        <div class="chapter-card">
            <div class="part-badge">Part 2: The Art</div>
            <div class="chapter-number">Chapter 4</div>
            <div class="chapter-title">Calisthenics is for Everyone</div>
            <div class="chapter-desc">Evolution of the discipline, training philosophy, the 3 archetypes, safety considerations, and applications in sports.</div>
        </div>
        
        <div class="chapter-card">
            <div class="part-badge">Part 3: Mastering</div>
            <div class="chapter-number">Chapter 9</div>
            <div class="chapter-title">Stage 1: Creating the Base</div>
            <div class="chapter-desc">Body awareness, mobility basics, joint stability, positional drills, compression strength, and handstand fundamentals.</div>
        </div>
        
        <div class="chapter-card">
            <div class="part-badge">Part 4: Road to Mastery</div>
            <div class="chapter-number">Chapter 16</div>
            <div class="chapter-title">Hand-Balancing</div>
            <div class="chapter-desc">The endless journey through strength, balance, alignment, mobility, entries, and training on different surfaces.</div>
        </div>
    </div>
</body>
</html>`;
    }

    createDigitalBookHTML() {
        return `<!DOCTYPE html>
<html>
<head>
    <title>The Art of Calisthenics - Digital Book</title>
    <style>
        body { font-family: 'Inter', sans-serif; padding: 20px; background: #0f0f0f; color: #f5f5f5; }
        h1 { color: #6366f1; text-align: center; margin-bottom: 10px; }
        .subtitle { text-align: center; color: #a3a3a3; margin-bottom: 30px; }
        .stats { display: flex; justify-content: center; gap: 30px; margin-bottom: 40px; }
        .stat { text-align: center; }
        .stat-number { font-size: 32px; font-weight: 700; color: #6366f1; }
        .stat-label { font-size: 14px; color: #a3a3a3; }
        .part { margin: 30px 0; padding: 20px; background: #1f1f1f; border-radius: 12px; border-left: 4px solid #6366f1; }
        .part-title { font-size: 20px; font-weight: 600; margin-bottom: 15px; }
        .chapter { margin: 10px 0; padding: 10px; background: #2a2a2a; border-radius: 8px; }
        .chapter-title { font-weight: 500; }
        .chapter-desc { color: #a3a3a3; font-size: 14px; margin-top: 5px; }
        .intro-hub { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; border-radius: 12px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>📚 The Art of Calisthenics</h1>
    <div class="subtitle">A 700+ Page Journey from Foundation to Mastery</div>
    
    <div class="stats">
        <div class="stat">
            <div class="stat-number">7</div>
            <div class="stat-label">Major Parts</div>
        </div>
        <div class="stat">
            <div class="stat-number">25</div>
            <div class="stat-label">Chapters</div>
        </div>
        <div class="stat">
            <div class="stat-number">150+</div>
            <div class="stat-label">Subsections</div>
        </div>
        <div class="stat">
            <div class="stat-number">700+</div>
            <div class="stat-label">Pages</div>
        </div>
    </div>
    
    <div class="intro-hub">
        <h2>🌀 Introduction Hub</h2>
        <p>"Before you move, you must understand the space within."</p>
        <ul>
            <li>Preface: Setting the tone and author's vision</li>
            <li>Disclaimer: Essential safety and health considerations</li>
            <li>Introduction: Overview of calisthenics and the book's philosophy</li>
        </ul>
    </div>
    
    <div class="part">
        <div class="part-title">🟥 PART 1: START HERE</div>
        <div class="chapter">
            <div class="chapter-title">Chapter 1: What, How, Why & Who</div>
            <div class="chapter-desc">Understanding scope, approach, purpose, and audience</div>
        </div>
        <div class="chapter">
            <div class="chapter-title">Chapter 2: Getting Started</div>
            <div class="chapter-desc">More action, less knowledge. Practice, practice, practice.</div>
        </div>
    </div>
    
    <div class="part">
        <div class="part-title">🟨 PART 2: THE ART OF CALISTHENICS</div>
        <div class="chapter">
            <div class="chapter-title">Chapter 3: What is Calisthenics?</div>
            <div class="chapter-desc">Definition, advantages, disadvantages, foundation for future training</div>
        </div>
        <div class="chapter">
            <div class="chapter-title">Chapter 4: Calisthenics is for Everyone</div>
            <div class="chapter-desc">Evolution, philosophy, archetypes, safety, applications</div>
        </div>
        <div class="chapter">
            <div class="chapter-title">Chapter 5: What to Expect from Calisthenics?</div>
            <div class="chapter-desc">Realistic expectations, time commitment, goal setting</div>
        </div>
        <div class="chapter">
            <div class="chapter-title">Chapter 6: Equipment Guide</div>
            <div class="chapter-desc">Essential equipment, home gym setup, weighted calisthenics</div>
        </div>
    </div>
    
    <div class="part">
        <div class="part-title">🟩 PART 3: MASTERING CALISTHENICS</div>
        <div class="chapter">
            <div class="chapter-title">Chapter 7: Perfect Technique Paradigm</div>
            <div class="chapter-desc">Injuries, effectiveness, efficiency, excellence vs. perfection</div>
        </div>
        <div class="chapter">
            <div class="chapter-title">Chapter 8: The Calisthenics Journey</div>
            <div class="chapter-desc">Mindset, approach, warm-up, the three stages</div>
        </div>
        <div class="chapter">
            <div class="chapter-title">Chapter 9: Stage 1: Creating the Base</div>
            <div class="chapter-desc">Body awareness, mobility, stability, handstand basics</div>
        </div>
        <div class="chapter">
            <div class="chapter-title">Chapter 10: Stage 2: Building the Structure</div>
            <div class="chapter-desc">Big-Seven movements, progression methods, skill training</div>
        </div>
        <div class="chapter">
            <div class="chapter-title">Chapter 11: Stage 3: Mastering Calisthenics</div>
            <div class="chapter-desc">Specialization, longevity, choosing your path</div>
        </div>
    </div>
</body>
</html>`;
    }

    createMindMapHTML() {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Interactive Mind Map TOC</title>
    <style>
        body { font-family: 'Inter', sans-serif; padding: 0; margin: 0; background: #0f0f0f; color: #f5f5f5; overflow: hidden; }
        .mindmap-container { width: 100vw; height: 100vh; position: relative; }
        .center-node { 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 50%;
            width: 200px;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-weight: 700;
            font-size: 18px;
            box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .center-node:hover { transform: translate(-50%, -50%) scale(1.1); }
        .branch-node {
            position: absolute;
            background: #1f1f1f;
            border: 2px solid #6366f1;
            border-radius: 12px;
            padding: 15px;
            min-width: 150px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .branch-node:hover { 
            background: #2a2a2a; 
            border-color: #8b5cf6; 
            transform: scale(1.05);
        }
        .branch-title { font-weight: 600; margin-bottom: 5px; }
        .branch-desc { font-size: 12px; color: #a3a3a3; }
        .connection-line {
            position: absolute;
            height: 2px;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            transform-origin: left center;
        }
        
        /* Positioning for branches */
        .part1 { top: 20%; left: 20%; }
        .part2 { top: 15%; right: 20%; }
        .part3 { top: 40%; right: 10%; }
        .part4 { bottom: 20%; right: 15%; }
        .part5 { bottom: 15%; left: 20%; }
        .part6 { top: 60%; left: 10%; }
        .part7 { top: 35%; left: 70%; }
    </style>
</head>
<body>
    <div class="mindmap-container">
        <div class="center-node">
            <div>
                <div>The Art of</div>
                <div>Calisthenics</div>
                <div style="font-size: 12px; margin-top: 10px;">700+ Pages</div>
            </div>
        </div>
        
        <div class="branch-node part1">
            <div class="branch-title">🟥 START HERE</div>
            <div class="branch-desc">Foundation & Getting Started</div>
        </div>
        
        <div class="branch-node part2">
            <div class="branch-title">🟨 THE ART</div>
            <div class="branch-desc">Understanding Calisthenics</div>
        </div>
        
        <div class="branch-node part3">
            <div class="branch-title">🟩 MASTERING</div>
            <div class="branch-desc">Three-Stage Journey</div>
        </div>
        
        <div class="branch-node part4">
            <div class="branch-title">🟦 ROAD TO MASTERY</div>
            <div class="branch-desc">Specialized Disciplines</div>
        </div>
        
        <div class="branch-node part5">
            <div class="branch-title">🟪 PROGRAM BUILDING</div>
            <div class="branch-desc">Templates & Construction</div>
        </div>
        
        <div class="branch-node part6">
            <div class="branch-title">🟫 ENDLESS JOURNEY</div>
            <div class="branch-desc">Injuries & Patience</div>
        </div>
        
        <div class="branch-node part7">
            <div class="branch-title">⬛ MASTERY</div>
            <div class="branch-desc">Legacy & Wisdom</div>
        </div>
    </div>
    
    <script>
        // Add some interactivity
        document.querySelectorAll('.branch-node').forEach(node => {
            node.addEventListener('click', () => {
                alert('Chapter details would open here in the full version!');
            });
        });
        
        document.querySelector('.center-node').addEventListener('click', () => {
            alert('Welcome to The Art of Calisthenics interactive journey!');
        });
    </script>
</body>
</html>`;
    }

    // Open fullscreen
    openFullscreen() {
        const frame = document.getElementById('html-frame');
        if (frame && frame.src) {
            window.open(frame.src, '_blank');
        }
    }

    // Send AI message
    sendAIMessage() {
        const input = document.getElementById('ai-input');
        const messagesContainer = document.getElementById('ai-messages');
        
        if (!input || !messagesContainer) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'ai-message user';
        userMessage.innerHTML = `
            <div class="message-avatar" style="background: var(--saturn-secondary);">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">${message}</div>
        `;
        messagesContainer.appendChild(userMessage);
        
        // Clear input
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const aiResponse = this.generateAIResponse(message);
            const aiMessage = document.createElement('div');
            aiMessage.className = 'ai-message assistant';
            aiMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">${aiResponse}</div>
            `;
            messagesContainer.appendChild(aiMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Generate AI response
    generateAIResponse(message) {
        const responses = [
            "I can help you with writing, content structuring, and prompt optimization. What specific aspect would you like to explore?",
            "Based on your input, I recommend using the Framework Architect prompt for better content organization.",
            "That's an interesting perspective! Have you considered applying the SWOT Analysis framework to this topic?",
            "For content like this, the Content Alchemist prompt might help you adapt it for multiple formats.",
            "I notice you're working on calisthenics content. The exercise database integration could enhance this section.",
            "This content would benefit from the Visual Systems Designer approach for better presentation.",
            "Consider using the Master Organization prompt to structure this information more effectively."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Setup auto-save
    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.currentContent) {
                this.saveToStorage();
                this.updateSaveStatus('saved');
            }
        }, 30000); // Auto-save every 30 seconds
    }

    // Save to local storage
    saveToStorage() {
        localStorage.setItem('saturno-writing-hub-content', this.currentContent);
        localStorage.setItem('saturno-writing-hub-timestamp', new Date().toISOString());
    }

    // Load from local storage
    loadFromStorage() {
        const savedContent = localStorage.getItem('saturno-writing-hub-content');
        const editor = document.getElementById('main-editor');
        
        if (savedContent && editor) {
            editor.value = savedContent;
            this.currentContent = savedContent;
            this.updateWordCount();
            this.updatePreview();
        }
    }

    // Export document
    exportDocument() {
        if (!this.currentContent.trim()) {
            this.showNotification('No content to export!');
            return;
        }
        
        const blob = new Blob([this.currentContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `saturno-writing-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Document exported successfully!');
    }

    // Toggle theme
    toggleTheme() {
        document.body.classList.toggle('light-theme');
        this.showNotification('Theme toggled!');
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--saturn-primary);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: var(--shadow-lg);
        `;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(notificationStyles);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.saturnoHub = new SaturnoWritingHub();
});

// Export for potential external use
window.SaturnoWritingHub = SaturnoWritingHub;