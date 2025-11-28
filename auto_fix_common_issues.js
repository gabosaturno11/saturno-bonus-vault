#!/usr/bin/env node

/**
 * Auto-Fix Common Issues Script
 * Automatically fixes common problems across MVPs
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname);

// Common fixes to apply
const FIXES = {
  // Fix 1: Add DOMContentLoaded wrapper
  addDOMContentLoaded: (content) => {
    // Check if already wrapped
    if (content.includes('DOMContentLoaded')) {
      return content;
    }
    
    // Find main code block
    const mainCodeMatch = content.match(/(document\.addEventListener|window\.onload|document\.getElementById)/);
    if (mainCodeMatch) {
      // Wrap in DOMContentLoaded
      const before = content.substring(0, content.indexOf(mainCodeMatch[0]));
      const after = content.substring(content.indexOf(mainCodeMatch[0]));
      
      return before + `
document.addEventListener('DOMContentLoaded', function() {
${after}
});`;
    }
    
    return content;
  },
  
  // Fix 2: Add localStorage helpers
  addLocalStorageHelpers: (content) => {
    if (content.includes('getStoredDocuments') || content.includes('localStorage.getItem')) {
      return content; // Already has helpers
    }
    
    const helpers = `
// localStorage helpers
function getStoredDocuments() {
  try {
    const stored = localStorage.getItem('app_documents');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveDocuments(docs) {
  try {
    localStorage.setItem('app_documents', JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save:', e);
  }
}
`;
    
    // Insert before first function
    const functionMatch = content.match(/(function|const.*=.*function|class)/);
    if (functionMatch) {
      const index = content.indexOf(functionMatch[0]);
      return content.substring(0, index) + helpers + '\n' + content.substring(index);
    }
    
    return helpers + '\n' + content;
  },
  
  // Fix 3: Add null checks
  addNullChecks: (content) => {
    // Find getElementById calls without null checks
    const pattern = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
    let newContent = content;
    let match;
    const replacements = new Set();
    
    while ((match = pattern.exec(content)) !== null) {
      const fullMatch = match[0];
      const id = match[1];
      const varName = id.replace(/-/g, '_');
      
      // Check if already has null check
      const afterMatch = content.substring(match.index);
      if (!afterMatch.match(new RegExp(`if\\s*\\(.*${varName}.*\\)`))) {
        replacements.add({
          old: fullMatch,
          new: `(function() { const ${varName} = ${fullMatch}; if (!${varName}) return null; return ${varName}; })()`
        });
      }
    }
    
    // Apply replacements (simplified - would need more sophisticated replacement)
    return newContent;
  },
  
  // Fix 4: Add create/delete handlers
  addCreateDeleteHandlers: (content) => {
    // Check if handlers exist
    if (content.includes('createDocument') || content.includes('handleCreate')) {
      return content; // Already has handlers
    }
    
    const handlers = `
// Create handler
function handleCreate() {
  const title = prompt('Enter title:');
  if (!title) return;
  
  const newDoc = {
    id: Date.now().toString(),
    title: title,
    content: '',
    createdAt: new Date().toISOString()
  };
  
  const docs = getStoredDocuments();
  docs.push(newDoc);
  saveDocuments(docs);
  renderDocuments();
}

// Delete handler
function handleDelete(id) {
  if (!confirm('Delete this item?')) return;
  
  const docs = getStoredDocuments();
  const filtered = docs.filter(d => d.id !== id);
  saveDocuments(filtered);
  renderDocuments();
}
`;
    
    return handlers + '\n' + content;
  }
};

/**
 * Apply fixes to a file
 */
function applyFixes(filePath, mvpName) {
  console.log(`\n🔧 Applying fixes to ${mvpName}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Apply each fix
  Object.keys(FIXES).forEach(fixName => {
    const newContent = FIXES[fixName](content);
    if (newContent !== content) {
      console.log(`   ✅ Applied: ${fixName}`);
      content = newContent;
      modified = true;
    }
  });
  
  if (modified) {
    // Create backup
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, fs.readFileSync(filePath));
    console.log(`   💾 Backup created: ${backupPath}`);
    
    // Write fixed content
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ Fixed file saved`);
    return true;
  } else {
    console.log(`   ℹ️  No fixes needed`);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Auto-Fix Common Issues');
  console.log('='.repeat(60));
  
  const mvps = [
    { name: 'calisthenics-ecosystem', file: 'apps/calisthenics-ecosystem/app.js' },
    { name: 'saturno-hub-starter', file: 'apps/saturno-hub-starter/public/index.html' },
    { name: 'writing-hub-kortex', file: 'apps/writing-hub-kortex/app.js' }
  ];
  
  let fixedCount = 0;
  
  mvps.forEach(mvp => {
    const filePath = path.join(BASE_PATH, mvp.file);
    if (applyFixes(filePath, mvp.name)) {
      fixedCount++;
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Fixed ${fixedCount} file(s)`);
  console.log('⚠️  Please review changes and test in browser!');
  console.log('💾 Backups created with .backup extension');
}

if (require.main === module) {
  main();
}

module.exports = { applyFixes, FIXES };


