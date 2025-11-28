const { useState, useEffect, useRef } = React;

// Sample data from the provided JSON
const sampleData = {
  metrics: {
    totalViews: 2847293,
    totalFollowers: 156780,
    engagementRate: 8.4,
    contentPublished: 147,
    avgViewsPerPost: 19370,
    topPerformingPlatform: "Instagram"
  },
  contentPerformance: [
    {"platform": "Instagram", "views": 1200000, "engagement": 9.2, "posts": 45},
    {"platform": "TikTok", "views": 890000, "engagement": 12.1, "posts": 38},
    {"platform": "YouTube", "views": 657293, "engagement": 6.8, "posts": 12},
    {"platform": "Blog", "views": 100000, "engagement": 4.2, "posts": 8}
  ],
  weeklyAnalytics: [
    {"day": "Mon", "views": 45000, "engagement": 8.2, "posts": 3},
    {"day": "Tue", "views": 52000, "engagement": 7.9, "posts": 2},
    {"day": "Wed", "views": 38000, "engagement": 9.1, "posts": 4},
    {"day": "Thu", "views": 61000, "engagement": 8.7, "posts": 3},
    {"day": "Fri", "views": 48000, "engagement": 9.4, "posts": 2},
    {"day": "Sat", "views": 71000, "engagement": 10.2, "posts": 5},
    {"day": "Sun", "views": 59000, "engagement": 8.8, "posts": 4}
  ],
  automationWorkflows: [
    {"name": "Morning Motivation Posts", "status": "active", "triggers": 24, "success": 96},
    {"name": "Workout Video Distribution", "status": "active", "triggers": 12, "success": 100},
    {"name": "Client Success Stories", "status": "paused", "triggers": 8, "success": 87},
    {"name": "Nutrition Tip Scheduler", "status": "active", "triggers": 16, "success": 92}
  ],
  contentCalendar: [
    {"date": "2025-07-09", "title": "Morning Workout Routine", "platform": "Instagram", "status": "scheduled", "type": "video"},
    {"date": "2025-07-09", "title": "Nutrition Myths Debunked", "platform": "TikTok", "status": "scheduled", "type": "post"},
    {"date": "2025-07-10", "title": "Client Transformation Story", "platform": "YouTube", "status": "draft", "type": "video"},
    {"date": "2025-07-10", "title": "Mindful Eating Tips", "platform": "Blog", "status": "draft", "type": "article"},
    {"date": "2025-07-11", "title": "HIIT vs Steady State", "platform": "Instagram", "status": "idea", "type": "post"}
  ],
  aiLegionPrompts: [
    {"category": "Motivation", "prompt": "Create authentic motivation content that opposes toxic positivity", "usage": 45},
    {"category": "Philosophy", "prompt": "Explore the mind-body connection in fitness", "usage": 32},
    {"category": "Anti-Mainstream", "prompt": "Challenge conventional fitness industry narratives", "usage": 28},
    {"category": "Real Results", "prompt": "Share genuine transformation stories without fake promises", "usage": 38}
  ],
  contentTemplates: [
    {"name": "Workout Wednesday", "platform": "Instagram", "type": "carousel", "usage": 12},
    {"name": "Motivation Monday", "platform": "TikTok", "type": "video", "usage": 8},
    {"name": "Transformation Tuesday", "platform": "YouTube", "type": "long-form", "usage": 4},
    {"name": "Philosophy Friday", "platform": "Blog", "type": "article", "usage": 6}
  ]
};

// Header Component
const Header = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'content', label: 'Content Creator' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'automation', label: 'Automation' },
    { id: 'ai-legion', label: 'AI Legion' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="header">
      <div className="header__content">
        <div className="logo">🚀 Saturno Command</div>
        <nav className="nav">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav__item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </div>
          ))}
        </nav>
        <div className="user-profile">
          <div className="user-avatar">FC</div>
          <div className="user-info">
            <div className="user-name">Fitness Creator</div>
            <div className="user-role">Content Machine</div>
          </div>
        </div>
      </div>
    </header>
  );
};

// MetricCard Component
const MetricCard = ({ title, value, change, icon }) => {
  const isPositive = change && change > 0;
  
  return (
    <div className="metric-card">
      <div className="metric-card__header">
        <div className="metric-card__title">{title}</div>
        <div>{icon}</div>
      </div>
      <div className="metric-card__value">{value}</div>
      {change && (
        <div className={`metric-card__change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{change}%
        </div>
      )}
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: sampleData.weeklyAnalytics.map(item => item.day),
          datasets: [{
            label: 'Views',
            data: sampleData.weeklyAnalytics.map(item => item.views),
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            fill: true,
            tension: 0.4
          }, {
            label: 'Engagement Rate',
            data: sampleData.weeklyAnalytics.map(item => item.engagement * 5000),
            borderColor: '#FFC185',
            backgroundColor: 'rgba(255, 193, 133, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div>
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Welcome Back, Creator!</h2>
          <button className="btn btn--primary">Create Content</button>
        </div>
        
        <div className="dashboard-grid">
          <MetricCard
            title="Total Views"
            value={formatNumber(sampleData.metrics.totalViews)}
            change={12.5}
            icon="👁️"
          />
          <MetricCard
            title="Total Followers"
            value={formatNumber(sampleData.metrics.totalFollowers)}
            change={8.2}
            icon="👥"
          />
          <MetricCard
            title="Engagement Rate"
            value={`${sampleData.metrics.engagementRate}%`}
            change={2.1}
            icon="💬"
          />
          <MetricCard
            title="Content Published"
            value={sampleData.metrics.contentPublished}
            change={15.3}
            icon="📝"
          />
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Weekly Performance</h3>
        </div>
        <div className="chart-container">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Platform Performance</h3>
        </div>
        <div className="dashboard-grid">
          {sampleData.contentPerformance.map((platform, index) => (
            <div key={index} className="metric-card">
              <div className="metric-card__header">
                <div className="metric-card__title">{platform.platform}</div>
              </div>
              <div className="metric-card__value">{formatNumber(platform.views)}</div>
              <div className="metric-card__meta">
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                  {platform.posts} posts • {platform.engagement}% engagement
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Recent Content</h3>
          <button className="btn btn--outline">View All</button>
        </div>
        <div className="content-list">
          {sampleData.contentCalendar.slice(0, 3).map((item, index) => (
            <div key={index} className="content-item">
              <div className="content-item__info">
                <div className="content-item__title">{item.title}</div>
                <div className="content-item__meta">
                  {item.platform} • {item.type} • {item.date}
                </div>
              </div>
              <div className={`status status--${item.status === 'scheduled' ? 'success' : item.status === 'draft' ? 'warning' : 'info'}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Content Creator Component
const ContentCreator = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
  const [contentType, setContentType] = useState('post');
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Blog'];
  const contentTypes = ['post', 'video', 'carousel', 'story', 'article'];

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const sampleContent = {
        'Instagram': {
          'post': {
            title: 'Transform Your Morning Routine',
            content: '🌅 Start your day with intention, not just intensity.\n\nYour morning sets the tone for everything that follows. While the fitness industry pushes "no days off" and "beast mode," real transformation comes from consistency, not chaos.\n\nMy morning ritual:\n• 5 minutes of mindful breathing\n• Movement that feels good (not punishment)\n• Nutrition that nourishes (not restricts)\n• Setting intentions (not just goals)\n\nWhat does your morning routine look like? 👇\n\n#MorningRoutine #MindfulFitness #AuthenticWellness'
          },
          'video': {
            title: 'Morning Mobility Flow',
            content: '🎥 5-Minute Morning Mobility Routine\n\nScript: Start with gentle neck rolls, move through shoulder shrugs, hip circles, and finish with deep breathing. No equipment needed - just you and your commitment to feeling better.\n\nHook: "What if I told you 5 minutes could change your entire day?"\n\n#MorningMobility #MovementMedicine #WellnessJourney'
          }
        },
        'TikTok': {
          'video': {
            title: 'Fitness Myth Busted',
            content: '🔥 POV: Someone says "no pain, no gain"\n\nMe: Actually, pain is your body\'s way of saying something is wrong. Growth happens in the challenge zone, not the danger zone.\n\nReal talk: The fitness industry profits from your pain. I\'m here to help you thrive, not just survive.\n\n#FitnessMythBusted #HealthyMindset #RealTalk'
          }
        },
        'YouTube': {
          'video': {
            title: 'The Philosophy of Sustainable Fitness',
            content: '📹 Video Outline: The Philosophy of Sustainable Fitness\n\nIntro (0-30s): Why I left the "hustle culture" fitness world\n\nMain Points:\n1. Consistency > Intensity (1-3 min)\n2. Progress > Perfection (3-5 min)\n3. Self-compassion > Self-criticism (5-7 min)\n\nConclusion: Your fitness journey is not a race\n\nCTA: What resonates most with you?\n\n#SustainableFitness #FitnessPhilosophy #WellnessWisdom'
          }
        }
      };

      const content = sampleContent[selectedPlatform]?.[contentType] || {
        title: 'Sample Content',
        content: 'Generated content for ' + selectedPlatform + ' ' + contentType
      };

      setContentTitle(content.title);
      setGeneratedContent(content.content);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div>
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Content Creation Studio</h2>
          <button className="btn btn--primary" onClick={generateContent} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
        
        <div className="content-creator">
          <div className="content-form">
            <div className="form-group">
              <label className="form-label">Platform</label>
              <select
                className="form-control"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Content Type</label>
              <select
                className="form-control"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                {contentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="Enter content title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                placeholder="Generated content will appear here..."
                rows="10"
              />
            </div>

            <div className="flex gap-8">
              <button className="btn btn--primary btn--full-width">Schedule Post</button>
              <button className="btn btn--outline btn--full-width">Save as Draft</button>
            </div>
          </div>

          <div className="content-preview">
            <h3>Preview</h3>
            <div className="card">
              <div className="card__body">
                <h4>{contentTitle || 'Content Title'}</h4>
                <p style={{ whiteSpace: 'pre-wrap', marginTop: '16px' }}>
                  {generatedContent || 'Generated content will appear here...'}
                </p>
                <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  Platform: {selectedPlatform} • Type: {contentType}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Content Templates</h3>
        </div>
        <div className="template-grid">
          {sampleData.contentTemplates.map((template, index) => (
            <div key={index} className="template-card" onClick={() => {
              setSelectedPlatform(template.platform);
              setContentType(template.type);
              setContentTitle(template.name);
            }}>
              <div className="template-card__header">
                <div className="template-card__name">{template.name}</div>
              </div>
              <div className="template-card__platform">{template.platform}</div>
              <div className="template-card__usage">Used {template.usage} times</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Analytics Component
const Analytics = () => {
  const performanceChartRef = useRef(null);
  const engagementChartRef = useRef(null);
  const performanceChartInstance = useRef(null);
  const engagementChartInstance = useRef(null);

  useEffect(() => {
    // Performance Chart
    if (performanceChartRef.current) {
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }

      const ctx = performanceChartRef.current.getContext('2d');
      performanceChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sampleData.contentPerformance.map(item => item.platform),
          datasets: [{
            label: 'Views',
            data: sampleData.contentPerformance.map(item => item.views),
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Engagement Chart
    if (engagementChartRef.current) {
      if (engagementChartInstance.current) {
        engagementChartInstance.current.destroy();
      }

      const ctx = engagementChartRef.current.getContext('2d');
      engagementChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: sampleData.contentPerformance.map(item => item.platform),
          datasets: [{
            data: sampleData.contentPerformance.map(item => item.engagement),
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    return () => {
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }
      if (engagementChartInstance.current) {
        engagementChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Analytics Dashboard</h2>
          <div className="flex gap-8">
            <select className="form-control" style={{ width: 'auto' }}>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <button className="btn btn--outline">Export Data</button>
          </div>
        </div>
        
        <div className="dashboard-grid">
          <MetricCard
            title="Avg Views Per Post"
            value={sampleData.metrics.avgViewsPerPost.toLocaleString()}
            change={5.2}
            icon="📈"
          />
          <MetricCard
            title="Top Platform"
            value={sampleData.metrics.topPerformingPlatform}
            icon="🏆"
          />
          <MetricCard
            title="Engagement Rate"
            value={`${sampleData.metrics.engagementRate}%`}
            change={2.1}
            icon="💬"
          />
          <MetricCard
            title="Content Velocity"
            value="12/week"
            change={8.5}
            icon="⚡"
          />
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Platform Performance</h3>
        </div>
        <div className="chart-container">
          <canvas ref={performanceChartRef}></canvas>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Engagement Breakdown</h3>
        </div>
        <div className="chart-container">
          <canvas ref={engagementChartRef}></canvas>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Content Performance</h3>
        </div>
        <div className="content-list">
          {sampleData.contentCalendar.map((item, index) => (
            <div key={index} className="content-item">
              <div className="content-item__info">
                <div className="content-item__title">{item.title}</div>
                <div className="content-item__meta">
                  {item.platform} • {item.type} • {item.date}
                </div>
              </div>
              <div className="flex gap-16">
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  {Math.floor(Math.random() * 50000)} views
                </div>
                <div className={`status status--${item.status === 'scheduled' ? 'success' : item.status === 'draft' ? 'warning' : 'info'}`}>
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Automation Component
const Automation = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const toggleWorkflow = (index) => {
    const updatedWorkflows = [...sampleData.automationWorkflows];
    updatedWorkflows[index].status = updatedWorkflows[index].status === 'active' ? 'paused' : 'active';
  };

  return (
    <div>
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Automation Center</h2>
          <button className="btn btn--primary">Create Workflow</button>
        </div>
        
        <div className="workflow-grid">
          {sampleData.automationWorkflows.map((workflow, index) => (
            <div key={index} className="workflow-card">
              <div className="workflow-card__header">
                <div className="workflow-card__title">{workflow.name}</div>
                <div className={`status status--${workflow.status === 'active' ? 'success' : 'warning'}`}>
                  {workflow.status}
                </div>
              </div>
              <div className="workflow-card__stats">
                <div>Triggers: {workflow.triggers}</div>
                <div>Success: {workflow.success}%</div>
              </div>
              <div className="flex gap-8" style={{ marginTop: '16px' }}>
                <button 
                  className="btn btn--sm btn--outline"
                  onClick={() => toggleWorkflow(index)}
                >
                  {workflow.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button className="btn btn--sm btn--secondary">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Workflow Builder</h3>
        </div>
        <div className="card">
          <div className="card__body">
            <div className="flex gap-16" style={{ marginBottom: '24px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Workflow Name</label>
                <input type="text" className="form-control" placeholder="Enter workflow name" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Trigger</label>
                <select className="form-control">
                  <option>Time-based</option>
                  <option>Content published</option>
                  <option>Engagement threshold</option>
                  <option>Platform specific</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Actions</label>
              <div className="flex gap-8">
                <button className="btn btn--outline">+ Post to Instagram</button>
                <button className="btn btn--outline">+ Share to Stories</button>
                <button className="btn btn--outline">+ Send Email</button>
                <button className="btn btn--outline">+ Update Calendar</button>
              </div>
            </div>
            <div className="flex gap-8" style={{ marginTop: '24px' }}>
              <button className="btn btn--primary">Save Workflow</button>
              <button className="btn btn--outline">Test Workflow</button>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Automation Templates</h3>
        </div>
        <div className="template-grid">
          {[
            { name: 'Daily Motivation', description: 'Post motivational content every morning', category: 'Social Media' },
            { name: 'Workout Reminders', description: 'Send workout reminders to email list', category: 'Email' },
            { name: 'Success Story Sharing', description: 'Share client transformations weekly', category: 'Content' },
            { name: 'Engagement Booster', description: 'Auto-engage with community posts', category: 'Community' }
          ].map((template, index) => (
            <div key={index} className="template-card">
              <div className="template-card__header">
                <div className="template-card__name">{template.name}</div>
              </div>
              <div style={{ margin: '12px 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                {template.description}
              </div>
              <div className="template-card__platform">{template.category}</div>
              <button className="btn btn--sm btn--primary" style={{ marginTop: '12px', width: '100%' }}>
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// AI Legion Component
const AILegion = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customPrompt, setCustomPrompt] = useState('');

  const categories = ['all', 'Motivation', 'Philosophy', 'Anti-Mainstream', 'Real Results'];

  const filteredPrompts = selectedCategory === 'all' 
    ? sampleData.aiLegionPrompts 
    : sampleData.aiLegionPrompts.filter(prompt => prompt.category === selectedCategory);

  return (
    <div>
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">AI Legion System</h2>
          <div className="flex gap-8">
            <select 
              className="form-control" 
              style={{ width: 'auto' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <button className="btn btn--primary">Create Prompt</button>
          </div>
        </div>
        
        <div className="prompt-library">
          {filteredPrompts.map((prompt, index) => (
            <div key={index} className="prompt-card">
              <div className="prompt-card__header">
                <div className="prompt-card__category">{prompt.category}</div>
                <div className="prompt-card__usage">Used {prompt.usage} times</div>
              </div>
              <div className="prompt-card__text">{prompt.prompt}</div>
              <div className="flex gap-8" style={{ marginTop: '16px' }}>
                <button className="btn btn--sm btn--primary">Use Prompt</button>
                <button className="btn btn--sm btn--outline">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Custom Prompt Builder</h3>
        </div>
        <div className="card">
          <div className="card__body">
            <div className="form-group">
              <label className="form-label">Prompt Category</label>
              <select className="form-control">
                <option>Motivation</option>
                <option>Philosophy</option>
                <option>Anti-Mainstream</option>
                <option>Real Results</option>
                <option>Workout Tips</option>
                <option>Nutrition</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Prompt Text</label>
              <textarea
                className="form-control"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter your custom AI prompt here..."
                rows="4"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Target Platforms</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-4">
                  <input type="checkbox" defaultChecked /> Instagram
                </label>
                <label className="flex items-center gap-4">
                  <input type="checkbox" defaultChecked /> TikTok
                </label>
                <label className="flex items-center gap-4">
                  <input type="checkbox" /> YouTube
                </label>
                <label className="flex items-center gap-4">
                  <input type="checkbox" /> Blog
                </label>
              </div>
            </div>
            <div className="flex gap-8">
              <button className="btn btn--primary">Save Prompt</button>
              <button className="btn btn--outline">Test Prompt</button>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">AI Content Strategy</h3>
        </div>
        <div className="dashboard-grid">
          <div className="metric-card">
            <div className="metric-card__header">
              <div className="metric-card__title">Content Authenticity Score</div>
              <div>🎯</div>
            </div>
            <div className="metric-card__value">94%</div>
            <div className="metric-card__change positive">+2.3%</div>
          </div>
          <div className="metric-card">
            <div className="metric-card__header">
              <div className="metric-card__title">Anti-Mainstream Alignment</div>
              <div>🔥</div>
            </div>
            <div className="metric-card__value">87%</div>
            <div className="metric-card__change positive">+5.1%</div>
          </div>
          <div className="metric-card">
            <div className="metric-card__header">
              <div className="metric-card__title">Voice Consistency</div>
              <div>🎤</div>
            </div>
            <div className="metric-card__value">92%</div>
            <div className="metric-card__change positive">+1.8%</div>
          </div>
          <div className="metric-card">
            <div className="metric-card__header">
              <div className="metric-card__title">Impact Potential</div>
              <div>💥</div>
            </div>
            <div className="metric-card__value">89%</div>
            <div className="metric-card__change positive">+3.2%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Component
const Settings = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');

  const settingsTabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'platforms', label: 'Platforms' },
    { id: 'automation', label: 'Automation' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'billing', label: 'Billing' }
  ];

  return (
    <div>
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Settings</h2>
        </div>
        
        <div className="flex gap-24">
          <div style={{ minWidth: '200px' }}>
            <nav className="flex flex-col gap-8">
              {settingsTabs.map(tab => (
                <div
                  key={tab.id}
                  className={`nav__item ${activeSettingsTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveSettingsTab(tab.id)}
                  style={{ cursor: 'pointer', padding: '8px' }}
                >
                  {tab.label}
                </div>
              ))}
            </nav>
          </div>
          
          <div style={{ flex: 1 }}>
            {activeSettingsTab === 'profile' && (
              <div className="card">
                <div className="card__body">
                  <h3 style={{ marginBottom: '24px' }}>Profile Settings</h3>
                  <div className="form-group">
                    <label className="form-label">Display Name</label>
                    <input type="text" className="form-control" defaultValue="Fitness Creator" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" defaultValue="creator@saturnocommand.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" rows="3" defaultValue="Authentic fitness content creator focused on sustainable wellness and challenging mainstream fitness culture." />
                  </div>
                  <button className="btn btn--primary">Save Changes</button>
                </div>
              </div>
            )}
            
            {activeSettingsTab === 'platforms' && (
              <div className="card">
                <div className="card__body">
                  <h3 style={{ marginBottom: '24px' }}>Platform Connections</h3>
                  {['Instagram', 'TikTok', 'YouTube', 'Blog'].map(platform => (
                    <div key={platform} className="flex justify-between items-center py-16" style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <div>
                        <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{platform}</div>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                          {platform === 'Instagram' ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                      <button className={`btn btn--sm ${platform === 'Instagram' ? 'btn--outline' : 'btn--primary'}`}>
                        {platform === 'Instagram' ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeSettingsTab === 'automation' && (
              <div className="card">
                <div className="card__body">
                  <h3 style={{ marginBottom: '24px' }}>Automation Settings</h3>
                  <div className="form-group">
                    <label className="flex items-center gap-8">
                      <input type="checkbox" defaultChecked />
                      Auto-publish scheduled content
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-8">
                      <input type="checkbox" defaultChecked />
                      Send notifications for workflow failures
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-8">
                      <input type="checkbox" />
                      Auto-engage with community posts
                    </label>
                  </div>
                  <button className="btn btn--primary">Save Settings</button>
                </div>
              </div>
            )}
            
            {activeSettingsTab === 'notifications' && (
              <div className="card">
                <div className="card__body">
                  <h3 style={{ marginBottom: '24px' }}>Notification Preferences</h3>
                  <div className="form-group">
                    <label className="flex items-center gap-8">
                      <input type="checkbox" defaultChecked />
                      Email notifications for new content performance
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-8">
                      <input type="checkbox" defaultChecked />
                      Push notifications for automation alerts
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-8">
                      <input type="checkbox" />
                      Weekly performance summary
                    </label>
                  </div>
                  <button className="btn btn--primary">Save Preferences</button>
                </div>
              </div>
            )}
            
            {activeSettingsTab === 'billing' && (
              <div className="card">
                <div className="card__body">
                  <h3 style={{ marginBottom: '24px' }}>Billing & Subscription</h3>
                  <div className="metric-card" style={{ marginBottom: '24px' }}>
                    <div className="metric-card__header">
                      <div className="metric-card__title">Current Plan</div>
                      <div className="status status--success">Active</div>
                    </div>
                    <div className="metric-card__value">Pro Plan</div>
                    <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                      $99/month • Renews on Aug 8, 2025
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <button className="btn btn--primary">Upgrade Plan</button>
                    <button className="btn btn--outline">View Billing History</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // PWA Install prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setIsInstallable(true);
    });

    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered'))
        .catch(registrationError => console.log('SW registration failed'));
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'content':
        return <ContentCreator />;
      case 'analytics':
        return <Analytics />;
      case 'automation':
        return <Automation />;
      case 'ai-legion':
        return <AILegion />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
      
      {isInstallable && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--color-primary)',
          color: 'var(--color-btn-primary-text)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-base)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-lg)'
        }}>
          📱 Install App
        </div>
      )}
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));