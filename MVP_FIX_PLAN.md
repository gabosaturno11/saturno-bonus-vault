# MVP Fix Plan - Black Friday Deadline
## Deadline: 2PM EST Tomorrow (Webinar Day)

### Overview
All MVPs must be CLEAN and fully functional for customers accessing the bonus page after purchase.

---

## MVP 1: Saturno Command ✅ FIXED
**Path:** `apps/saturno-command/index.html`
**Status:** FIXED - Document create/delete working, click handlers connected

**Completed:**
- ✅ Document creation with localStorage persistence
- ✅ Document deletion with confirmation
- ✅ Schedule Post and Save as Draft buttons working
- ✅ Workflow creation and deletion
- ✅ AI Prompt creation, editing, and deletion
- ✅ All click handlers connected

**Remaining:**
- [ ] Final browser testing
- [ ] Mobile responsiveness check

---

## MVP 2: The Art of Calisthenics
**Path:** `apps/calisthenics-ecosystem/index.html`
**Status:** NEEDS FIXES
**Agent Assignment:** Agent 1

**Issues to Fix:**
- [ ] Verify all navigation buttons work (Overview, 7 Parts, 3 Stages, 6 Disciplines, Pathways)
- [ ] Fix click handlers on all interactive nodes (part-node, stage-node, discipline-node)
- [ ] Ensure detail panel opens/closes correctly
- [ ] Fix canvas connection drawing
- [ ] Verify pathway selection works
- [ ] Test all 7 parts are navigable
- [ ] Test all 3 stages are navigable
- [ ] Test all 6 disciplines are navigable

**Technical Tasks:**
1. Check `setupEventListeners()` function - ensure all elements exist before attaching
2. Fix `drawConnections()` - ensure canvas resizes properly
3. Verify `showPartDetails()`, `showStageDetails()`, `showDisciplineDetails()` work
4. Test `selectPathway()` function
5. Ensure `switchMode()` updates UI correctly

---

## MVP 3: Saturno Hub Starter
**Path:** `apps/saturno-hub-starter/public/index.html`
**Status:** NEEDS FIXES
**Agent Assignment:** Agent 2

**Issues to Fix:**
- [ ] Check all interactive features work
- [ ] Verify HTML features (contenteditable, forms, etc.)
- [ ] Test document creation/deletion
- [ ] Test timeline drag-and-drop
- [ ] Verify all buttons respond
- [ ] Check localStorage persistence
- [ ] Test command palette (Ctrl/Cmd+K)
- [ ] Verify all sections load correctly

**Technical Tasks:**
1. Review all event listeners
2. Check localStorage save/load functions
3. Verify drag-and-drop handlers
4. Test modal open/close
5. Check form submissions

---

## MVP 4: Writing Hub Kortex
**Path:** `apps/writing-hub-kortex/index.html`
**Status:** MOSTLY OK - Minor tweaks needed
**Agent Assignment:** Agent 3

**Issues to Fix:**
- [ ] Verify document creation works
- [ ] Test document deletion
- [ ] Check markdown preview
- [ ] Verify timer functionality
- [ ] Test AI chat interface
- [ ] Check constellation map
- [ ] Verify sidebar toggles
- [ ] Test search functionality

**Technical Tasks:**
1. Test `createDocument()` function
2. Verify `closeDocumentTab()` works
3. Check markdown rendering
4. Test timer start/pause/complete
5. Verify localStorage persistence

---

## Common Fixes Across All MVPs

### 1. Console Error Check
- [ ] Open each MVP in browser
- [ ] Check browser console for errors
- [ ] Fix any JavaScript errors
- [ ] Fix any missing dependencies

### 2. Click Handler Verification
- [ ] Test all buttons
- [ ] Test all navigation items
- [ ] Test all interactive elements
- [ ] Ensure no broken event listeners

### 3. Create/Delete Functionality
- [ ] All create buttons work
- [ ] All delete buttons work
- [ ] Confirmations show properly
- [ ] Data persists (localStorage)

### 4. Mobile Responsiveness
- [ ] Test on mobile viewport
- [ ] Check touch interactions
- [ ] Verify layouts don't break
- [ ] Test on actual mobile device if possible

### 5. Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Safari
- [ ] Test in Firefox
- [ ] Test in mobile browsers

---

## Testing Checklist (Per MVP)

### Pre-Deployment Testing
1. [ ] Open in browser - no console errors
2. [ ] All buttons respond to clicks
3. [ ] Create functionality works
4. [ ] Delete functionality works
5. [ ] Navigation works between sections
6. [ ] Forms submit correctly
7. [ ] Data persists on page reload
8. [ ] Mobile view works
9. [ ] No broken links
10. [ ] All features accessible

---

## Agent Work Distribution

### Agent 1: Calisthenics Ecosystem
- Focus: Navigation, click handlers, canvas rendering
- Estimated Time: 1-2 hours
- Priority: HIGH

### Agent 2: Saturno Hub Starter  
- Focus: All interactive features, HTML functionality
- Estimated Time: 1-2 hours
- Priority: HIGH

### Agent 3: Writing Hub Kortex
- Focus: Minor tweaks, verification
- Estimated Time: 30-60 minutes
- Priority: MEDIUM

### Agent 4: Testing & QA
- Focus: Cross-browser testing, mobile testing, final verification
- Estimated Time: 1 hour
- Priority: HIGH

---

## Deployment Steps

1. [ ] All MVPs fixed and tested
2. [ ] All console errors resolved
3. [ ] All features working
4. [ ] Mobile tested
5. [ ] Final review of bonus page
6. [ ] Deploy to staging.saturnomovement.com
7. [ ] Final test on staging
8. [ ] Deploy to production

---

## Notes
- All MVPs are frontend-only (no backend needed)
- Use localStorage for persistence
- All fixes must be clean and production-ready
- Deadline is 2PM EST tomorrow
- Webinar is at 3PM EST

