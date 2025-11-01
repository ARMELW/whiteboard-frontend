# SVG Path Editor - Testing Guide

## Quick Start Testing

### 1. Start the Application
```bash
npm run dev
```

### 2. Navigate to the Editor
Open browser and go to: `http://localhost:5173/svg-path-editor`

### 3. Use the Sample SVG
Upload the provided sample: `docs/svg-path-editor-sample.svg`

## Test Cases

### TC1: SVG Upload
**Steps:**
1. Click "Upload SVG" button
2. Select `docs/svg-path-editor-sample.svg`
3. Verify SVG appears on canvas
4. Verify SVG is scaled to fit

**Expected:**
- SVG displays centered on canvas
- SVG maintains aspect ratio
- Canvas shows dark background
- Point counter shows "0 points"

### TC2: Add Points
**Steps:**
1. Upload SVG (TC1)
2. Click on the arrow shaft
3. Click multiple times along the arrow
4. Verify points are numbered 1, 2, 3, etc.

**Expected:**
- Each click adds a blue point
- Points show white numbers
- Lines connect consecutive points
- Point counter increments

### TC3: Select Points
**Steps:**
1. Add several points (TC2)
2. Click on a point
3. Verify selection state

**Expected:**
- Selected point turns red
- Point shows shadow/glow effect
- Other points remain blue

### TC4: Move Points
**Steps:**
1. Add several points (TC2)
2. Click and drag a point
3. Move to new position
4. Release mouse

**Expected:**
- Point follows cursor
- Connected lines update in real-time
- Point coordinates update
- Smooth dragging experience

### TC5: Delete Points
**Steps:**
1. Add several points (TC2)
2. Click to select a point
3. Press Delete key
4. Verify point is removed

**Expected:**
- Selected point disappears
- Lines reconnect around removed point
- Point numbers renumber
- Counter decrements

### TC6: Undo/Redo
**Steps:**
1. Add 3 points
2. Press Ctrl+Z (or Cmd+Z)
3. Verify last point removed
4. Press Ctrl+Y (or Cmd+Y)
5. Verify point restored

**Expected:**
- Undo removes last action
- Redo restores undone action
- Can undo up to 50 actions
- Buttons disable at limits

### TC7: Clear Points
**Steps:**
1. Add several points
2. Click "Clear Points" button
3. Confirm in dialog

**Expected:**
- All points removed
- SVG remains displayed
- Counter shows "0 points"
- Lines disappear

### TC8: Export JSON
**Steps:**
1. Add 5+ points
2. Click "Export JSON"
3. Check downloaded file

**Expected:**
- File named `path-points.json` downloads
- JSON format: `[{"x": 50, "y": 200}, ...]`
- Coordinates match point positions
- No decimals (rounded to integers)

### TC9: Reset All
**Steps:**
1. Upload SVG and add points
2. Click "Reset" button
3. Confirm in dialog

**Expected:**
- SVG removed
- All points removed
- Canvas shows empty state
- Message: "No SVG loaded"

### TC10: Keyboard Shortcuts
**Steps:**
Test all keyboard shortcuts:
- Delete: Remove selected point
- Escape: Deselect point
- Ctrl+Z: Undo
- Ctrl+Y: Redo

**Expected:**
- All shortcuts work as described
- No conflicts with browser shortcuts
- Visual feedback for actions

## Edge Cases

### E1: Invalid File Upload
**Steps:**
1. Try uploading a PNG/JPG file
2. Verify error message

**Expected:**
- Alert: "Please upload an SVG file"
- No change to canvas

### E2: Export With No Points
**Steps:**
1. Upload SVG without adding points
2. Click "Export JSON"

**Expected:**
- Alert: "No points to export"
- No file download

### E3: Rapid Clicking
**Steps:**
1. Upload SVG
2. Rapidly click 50+ times

**Expected:**
- All clicks register
- No performance degradation
- Points remain draggable
- Canvas stays responsive

### E4: Click Outside SVG
**Steps:**
1. Upload SVG
2. Click on empty canvas (outside SVG)

**Expected:**
- No point added
- No error
- No visual change

### E5: Large SVG
**Steps:**
1. Upload a complex, large SVG
2. Add points
3. Test performance

**Expected:**
- SVG scales appropriately
- Point placement accurate
- Dragging remains smooth
- Export works correctly

## Browser Compatibility

Test in all target browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome (optional)
- [ ] Mobile Safari (optional)

## Performance Benchmarks

### Metrics to Check:
- Canvas FPS: Should maintain 60fps
- Point limit: Test with 100+ points
- Drag latency: Should be < 16ms
- History memory: Monitor with DevTools
- File upload speed: < 1s for typical SVGs

## Visual Testing

### Check These Elements:
- [ ] Points are clearly visible
- [ ] Numbers are readable
- [ ] Lines are visible but not distracting
- [ ] Selected state is obvious (red)
- [ ] Hover cursor changes to pointer
- [ ] Toolbar buttons are properly aligned
- [ ] Empty states show helpful messages
- [ ] Help text is readable

## Responsive Design

Test at different viewport sizes:
- [ ] 1920x1080 (Desktop)
- [ ] 1366x768 (Laptop)
- [ ] 1024x768 (Tablet landscape)
- [ ] 768x1024 (Tablet portrait)
- [ ] 375x667 (Mobile)

## Integration Testing

### Test JSON Output:
```javascript
// Sample output format
[
  { "x": 50, "y": 200 },
  { "x": 150, "y": 180 },
  { "x": 250, "y": 200 }
]
```

### Verify:
- [ ] Coordinates are numbers (not strings)
- [ ] No NaN or Infinity values
- [ ] Coordinates are within SVG bounds
- [ ] Array maintains point order
- [ ] JSON is valid and parseable

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Instructions are clear
- [ ] Error messages are helpful
- [ ] Color contrast is sufficient

## Error Handling

Test these error scenarios:
- [ ] Corrupt SVG file
- [ ] SVG with no dimensions
- [ ] SVG with invalid viewBox
- [ ] Browser blocks file download
- [ ] Out of memory (100+ points)

## Success Criteria

All tests pass when:
- ✅ No console errors
- ✅ No TypeScript errors
- ✅ Build succeeds
- ✅ All functional tests pass
- ✅ Performance is acceptable
- ✅ UI is responsive
- ✅ JSON export is correct

## Bug Report Template

If you find a bug, use this format:

```
**Title:** Brief description

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happened

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Screen: 1920x1080

**Screenshots/Video:**
(if applicable)
```

## Performance Profiling

### Using Chrome DevTools:
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Perform actions (add/move/delete points)
5. Stop recording
6. Check for:
   - Long tasks (> 50ms)
   - Memory leaks
   - Excessive re-renders

## Automation Opportunities

Future test automation could include:
- [ ] Playwright E2E tests
- [ ] Unit tests for store actions
- [ ] Component tests with React Testing Library
- [ ] Visual regression tests
- [ ] Performance benchmarks

## Test Status

Fill this out as you test:

- [ ] TC1: SVG Upload
- [ ] TC2: Add Points
- [ ] TC3: Select Points
- [ ] TC4: Move Points
- [ ] TC5: Delete Points
- [ ] TC6: Undo/Redo
- [ ] TC7: Clear Points
- [ ] TC8: Export JSON
- [ ] TC9: Reset All
- [ ] TC10: Keyboard Shortcuts
- [ ] E1-E5: Edge Cases
- [ ] Browser Compatibility
- [ ] Performance
- [ ] Visual Testing
- [ ] Responsive Design
- [ ] Integration
- [ ] Accessibility
- [ ] Error Handling
