# Agent Quick Start Guide
## For AI Assistants Working on MVP Fixes

### 🎯 Mission
Fix all 4 MVPs to be CLEAN and fully functional for Black Friday launch.

**Deadline:** 2PM EST Tomorrow (Friday Nov 29, 2025)
**Webinar:** 3PM EST Tomorrow

---

## 📋 Agent Assignments

### Agent 1: Calisthenics Ecosystem
**File:** `apps/calisthenics-ecosystem/index.html`
**Status:** BROKEN - Interactive features not working

**Your Tasks:**
1. Fix navigation buttons (Overview, 7 Parts, 3 Stages, 6 Disciplines, Pathways)
2. Connect all click handlers on nodes
3. Fix canvas connection drawing
4. Ensure detail panel opens/closes
5. Test all 7 parts, 3 stages, 6 disciplines are navigable

**Key Functions to Fix:**
- `setupEventListeners()` - Ensure elements exist before attaching
- `drawConnections()` - Canvas rendering
- `showPartDetails()`, `showStageDetails()`, `showDisciplineDetails()`
- `selectPathway()`

**Test Checklist:**
- [ ] All nav buttons work
- [ ] All nodes are clickable
- [ ] Detail panel shows content
- [ ] Canvas draws connections
- [ ] Pathways selection works

---

### Agent 2: Saturno Hub Starter
**File:** `apps/saturno-hub-starter/public/index.html`
**Status:** BROKEN - HTML features broken

**Your Tasks:**
1. Fix all interactive features
2. Fix document create/delete
3. Fix timeline drag-and-drop
4. Fix command palette (Ctrl/Cmd+K)
5. Verify localStorage persistence

**Key Functions to Fix:**
- Document management (create/delete)
- Timeline drag handlers
- Modal open/close
- Command palette
- Form submissions

**Test Checklist:**
- [ ] Can create documents
- [ ] Can delete documents
- [ ] Timeline drag works
- [ ] Command palette opens
- [ ] All buttons respond

---

### Agent 3: Writing Hub Kortex
**File:** `apps/writing-hub-kortex/index.html`
**Status:** OK - Minor tweaks needed

**Your Tasks:**
1. Verify document create/delete works
2. Test markdown preview
3. Verify timer functionality
4. Test AI chat interface
5. Check constellation map

**Key Functions to Verify:**
- `createDocument()`
- `closeDocumentTab()`
- Markdown rendering
- Timer start/pause/complete

**Test Checklist:**
- [ ] Documents create/delete
- [ ] Markdown preview works
- [ ] Timer functions
- [ ] Sidebar toggles
- [ ] Search works

---

### Agent 4: Testing & QA
**File:** All MVPs
**Status:** Final verification

**Your Tasks:**
1. Test all MVPs in browser
2. Check console for errors
3. Test mobile responsiveness
4. Verify all features work
5. Cross-browser testing

**Test Checklist:**
- [ ] No console errors
- [ ] All buttons work
- [ ] Mobile view works
- [ ] Data persists
- [ ] No broken links

---

## 🚀 Quick Start Commands

```bash
# Navigate to project
cd ~/Desktop/"FINAL PDFS (TBV)"/_MONDAY_BONUS

# Run autonomous tester
node autonomous_mvp_fixer.js

# Open MVP in browser
open apps/[mvp-name]/index.html

# Check for errors
# Open browser console (F12) and look for red errors
```

---

## 🔧 Common Fixes

### Fix 1: Event Listeners Not Working
```javascript
// BAD - Elements might not exist
document.getElementById('button').addEventListener('click', handler);

// GOOD - Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('button');
  if (button) {
    button.addEventListener('click', handler);
  }
});
```

### Fix 2: Create/Delete Functions Missing
```javascript
// Add create function
function createDocument() {
  const newDoc = {
    id: Date.now().toString(),
    title: 'New Document',
    content: '',
    createdAt: new Date().toISOString()
  };
  
  // Save to localStorage
  const docs = getStoredDocuments();
  docs.push(newDoc);
  saveDocuments(docs);
  
  // Update UI
  renderDocuments();
}

// Add delete function
function deleteDocument(id) {
  if (confirm('Delete this document?')) {
    const docs = getStoredDocuments();
    const filtered = docs.filter(d => d.id !== id);
    saveDocuments(filtered);
    renderDocuments();
  }
}
```

### Fix 3: localStorage Persistence
```javascript
// Helper functions
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
```

---

## ✅ Before You Finish

1. **Test in Browser**
   - Open the HTML file
   - Check console (F12) for errors
   - Test all buttons
   - Test create/delete

2. **Verify Mobile**
   - Resize browser window
   - Check touch interactions
   - Verify layouts don't break

3. **Check Persistence**
   - Create something
   - Reload page
   - Verify it's still there

4. **Final Check**
   - No console errors
   - All features work
   - Clean code

---

## 📝 Reporting

After fixing, update:
- `MVP_FIX_PLAN.md` - Mark your tasks complete
- Add notes about what you fixed
- Report any remaining issues

---

## 🆘 Need Help?

- Check `CURSOR_MVP_FIX_COMMAND.md` for detailed instructions
- Review `MVP_FIX_PLAN.md` for full context
- Look at `saturno-command` (already fixed) as reference

---

**Remember:** These MVPs are for CUSTOMERS. They must be CLEAN and WORKING!


