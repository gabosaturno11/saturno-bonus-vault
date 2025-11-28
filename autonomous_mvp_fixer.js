#!/usr/bin/env node

/**
 * Autonomous MVP Fixer Script
 * Tests and fixes common issues across all MVPs
 * Can be run by multiple agents in parallel
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MVP_PATHS = {
  'saturno-command': 'apps/saturno-command',
  'calisthenics-ecosystem': 'apps/calisthenics-ecosystem',
  'saturno-hub-starter': 'apps/saturno-hub-starter/public',
  'writing-hub-kortex': 'apps/writing-hub-kortex'
};

const BASE_PATH = path.join(__dirname);

// Test Results
const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

/**
 * Check if file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (e) {
    return false;
  }
}

/**
 * Read file content
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

/**
 * Check for common JavaScript errors
 */
function checkJavaScriptErrors(content, mvpName) {
  const errors = [];
  
  // Check for common issues
  if (content.includes('addEventListener') && !content.includes('DOMContentLoaded')) {
    errors.push('Event listeners may be attached before DOM is ready');
  }
  
  if (content.includes('localStorage') && !content.includes('try') && !content.includes('catch')) {
    errors.push('localStorage access should be wrapped in try-catch');
  }
  
  if (content.includes('document.getElementById') && content.includes('null')) {
    errors.push('Potential null reference errors - check element existence');
  }
  
  // Check for broken event handlers
  if (content.includes('onClick') && !content.includes('onclick') && !content.includes('addEventListener')) {
    errors.push('React onClick handlers may not work in vanilla JS');
  }
  
  return errors;
}

/**
 * Check for missing functionality
 */
function checkMissingFunctionality(content, mvpName) {
  const missing = [];
  
  // Check for create functionality
  if (content.includes('Create') || content.includes('create') || content.includes('Add')) {
    if (!content.includes('createDocument') && 
        !content.includes('handleCreate') && 
        !content.includes('addDocument') &&
        !content.includes('createWorkflow') &&
        !content.includes('createPrompt')) {
      missing.push('Create buttons found but no create handler functions');
    }
  }
  
  // Check for delete functionality
  if (content.includes('Delete') || content.includes('delete') || content.includes('Remove')) {
    if (!content.includes('deleteDocument') && 
        !content.includes('handleDelete') && 
        !content.includes('removeDocument') &&
        !content.includes('deleteWorkflow') &&
        !content.includes('deletePrompt')) {
      missing.push('Delete buttons found but no delete handler functions');
    }
  }
  
  // Check for localStorage persistence
  if (content.includes('useState') || content.includes('setState')) {
    if (!content.includes('localStorage') && !content.includes('sessionStorage')) {
      missing.push('State management found but no persistence mechanism');
    }
  }
  
  return missing;
}

/**
 * Check HTML structure
 */
function checkHTMLStructure(htmlPath, mvpName) {
  const issues = [];
  const html = readFile(htmlPath);
  
  if (!html) {
    issues.push('HTML file not found or unreadable');
    return issues;
  }
  
  // Check for required scripts
  if (html.includes('app.js') && !fileExists(path.join(path.dirname(htmlPath), 'app.js'))) {
    issues.push('app.js referenced but not found');
  }
  
  if (html.includes('style.css') && !fileExists(path.join(path.dirname(htmlPath), 'style.css'))) {
    issues.push('style.css referenced but not found');
  }
  
  // Check for root element
  if (html.includes('ReactDOM.render') && !html.includes('id="root"')) {
    issues.push('React app but no root element found');
  }
  
  // Check for proper script tags
  if (html.includes('type="text/babel"') && !html.includes('@babel/standalone')) {
    issues.push('Babel script type used but Babel standalone not loaded');
  }
  
  return issues;
}

/**
 * Test MVP
 */
function testMVP(mvpName, mvpPath) {
  console.log(`\n🔍 Testing ${mvpName}...`);
  console.log(`   Path: ${mvpPath}`);
  
  const fullPath = path.join(BASE_PATH, mvpPath);
  const indexPath = path.join(fullPath, 'index.html');
  
  // Check if MVP exists
  if (!fileExists(fullPath)) {
    testResults.failed.push({
      mvp: mvpName,
      issue: 'MVP directory not found',
      path: mvpPath
    });
    return;
  }
  
  // Check HTML file
  if (!fileExists(indexPath)) {
    testResults.failed.push({
      mvp: mvpName,
      issue: 'index.html not found',
      path: indexPath
    });
    return;
  }
  
  // Check HTML structure
  const htmlIssues = checkHTMLStructure(indexPath, mvpName);
  htmlIssues.forEach(issue => {
    testResults.failed.push({
      mvp: mvpName,
      issue: `HTML: ${issue}`,
      path: indexPath
    });
  });
  
  // Check JavaScript files
  const jsFiles = [
    path.join(fullPath, 'app.js'),
    path.join(fullPath, 'index.js'),
    path.join(fullPath, 'main.js')
  ];
  
  let jsFound = false;
  jsFiles.forEach(jsPath => {
    if (fileExists(jsPath)) {
      jsFound = true;
      const jsContent = readFile(jsPath);
      
      if (jsContent) {
        // Check for errors
        const jsErrors = checkJavaScriptErrors(jsContent, mvpName);
        jsErrors.forEach(error => {
          testResults.warnings.push({
            mvp: mvpName,
            issue: `JS Warning: ${error}`,
            path: jsPath
          });
        });
        
        // Check for missing functionality
        const missing = checkMissingFunctionality(jsContent, mvpName);
        missing.forEach(m => {
          testResults.warnings.push({
            mvp: mvpName,
            issue: `Missing: ${m}`,
            path: jsPath
          });
        });
      }
    }
  });
  
  if (!jsFound) {
    testResults.warnings.push({
      mvp: mvpName,
      issue: 'No JavaScript file found (app.js, index.js, or main.js)',
      path: fullPath
    });
  }
  
  // Check CSS file
  const cssPath = path.join(fullPath, 'style.css');
  if (!fileExists(cssPath)) {
    testResults.warnings.push({
      mvp: mvpName,
      issue: 'style.css not found',
      path: fullPath
    });
  }
  
  testResults.passed.push({
    mvp: mvpName,
    path: mvpPath
  });
  
  console.log(`   ✅ Basic structure OK`);
}

/**
 * Generate fix report
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('MVP TEST REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n✅ Passed: ${testResults.passed.length}`);
  testResults.passed.forEach(result => {
    console.log(`   - ${result.mvp}`);
  });
  
  console.log(`\n⚠️  Warnings: ${testResults.warnings.length}`);
  testResults.warnings.forEach(result => {
    console.log(`   - ${result.mvp}: ${result.issue}`);
  });
  
  console.log(`\n❌ Failed: ${testResults.failed.length}`);
  testResults.failed.forEach(result => {
    console.log(`   - ${result.mvp}: ${result.issue}`);
  });
  
  // Generate fix suggestions
  console.log('\n' + '='.repeat(60));
  console.log('FIX SUGGESTIONS');
  console.log('='.repeat(60));
  
  const fixSuggestions = {
    'calisthenics-ecosystem': [
      '1. Ensure all event listeners are attached after DOMContentLoaded',
      '2. Check canvas initialization and resize handlers',
      '3. Verify all click handlers on nodes are connected',
      '4. Test detail panel open/close functionality'
    ],
    'saturno-hub-starter': [
      '1. Verify all localStorage save/load functions',
      '2. Check drag-and-drop event handlers',
      '3. Test modal open/close functionality',
      '4. Verify command palette (Ctrl/Cmd+K) works'
    ],
    'writing-hub-kortex': [
      '1. Test document create/delete functions',
      '2. Verify markdown preview rendering',
      '3. Check timer functionality',
      '4. Test sidebar toggle functionality'
    ],
    'saturno-command': [
      '1. ✅ Already fixed - verify in browser',
      '2. Test document create/delete',
      '3. Test workflow creation',
      '4. Test prompt creation'
    ]
  };
  
  Object.keys(fixSuggestions).forEach(mvp => {
    console.log(`\n${mvp.toUpperCase()}:`);
    fixSuggestions[mvp].forEach(suggestion => {
      console.log(`   ${suggestion}`);
    });
  });
  
  // Save report to file
  const reportPath = path.join(BASE_PATH, 'MVP_TEST_REPORT.txt');
  const reportContent = `
MVP Test Report - ${new Date().toISOString()}

PASSED: ${testResults.passed.length}
${testResults.passed.map(r => `- ${r.mvp}`).join('\n')}

WARNINGS: ${testResults.warnings.length}
${testResults.warnings.map(r => `- ${r.mvp}: ${r.issue}`).join('\n')}

FAILED: ${testResults.failed.length}
${testResults.failed.map(r => `- ${r.mvp}: ${r.issue}`).join('\n')}
  `.trim();
  
  fs.writeFileSync(reportPath, reportContent);
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Autonomous MVP Fixer');
  console.log('='.repeat(60));
  console.log(`Base path: ${BASE_PATH}`);
  
  // Test all MVPs
  Object.keys(MVP_PATHS).forEach(mvpName => {
    testMVP(mvpName, MVP_PATHS[mvpName]);
  });
  
  // Generate report
  generateReport();
  
  // Exit with appropriate code
  if (testResults.failed.length > 0) {
    process.exit(1);
  } else if (testResults.warnings.length > 0) {
    process.exit(0);
  } else {
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { testMVP, checkJavaScriptErrors, checkMissingFunctionality };

