# Manual Test Plan - History System

## Test Environment
- Browser: Modern browser (Chrome, Firefox, Safari)
- URL: http://localhost:5174

## Test Cases

### 1. Basic Undo/Redo with Keyboard Shortcuts
**Steps:**
1. Open the application
2. Create a new scene or use existing scene
3. Add a layer (image, text, or shape)
4. Press `Ctrl+Z` (or `Cmd+Z` on Mac)
5. Verify the layer is removed
6. Press `Ctrl+Y` (or `Cmd+Y` on Mac)
7. Verify the layer is restored

**Expected Result:** Layer should be removed with undo and restored with redo

### 2. Undo/Redo Buttons
**Steps:**
1. Open the application
2. Add multiple layers (at least 3)
3. Click the Undo button (↶) in the header
4. Verify the last action is undone
5. Click the Redo button (↷) in the header
6. Verify the action is redone

**Expected Result:** Buttons should work and be disabled when no actions are available

### 3. Visual History Panel
**Steps:**
1. Open the application
2. Click the Clock icon (🕐) in the header
3. Verify the History Panel appears on the right side
4. Perform several actions (add layers, update properties)
5. Check that actions appear in the history panel with timestamps and descriptions
6. Click the Clock icon again to close the panel

**Expected Result:** History panel shows all actions with French descriptions and timestamps

### 4. Layer Addition/Deletion
**Steps:**
1. Add a new layer to a scene
2. Note the layer appears in the scene
3. Press Ctrl+Z to undo
4. Verify the layer is removed
5. Press Ctrl+Y to redo
6. Verify the layer is back
7. Delete the layer
8. Press Ctrl+Z to undo deletion
9. Verify the layer is restored

**Expected Result:** All operations should be reversible

### 5. Property Changes
**Steps:**
1. Select a layer
2. Change a property (opacity, position, scale, etc.)
3. Press Ctrl+Z to undo
4. Verify the property is restored to previous value
5. Press Ctrl+Y to redo
6. Verify the property change is reapplied

**Expected Result:** Property changes should be undoable/redoable

### 6. Scene Operations
**Steps:**
1. Add a new scene
2. Verify the scene appears
3. Press Ctrl+Z to undo
4. Verify the scene is removed
5. Press Ctrl+Y to redo
6. Verify the scene is back

**Expected Result:** Scene operations should be undoable/redoable

### 7. History Limit (50 actions)
**Steps:**
1. Perform 60+ consecutive actions (add layers, change properties, etc.)
2. Open the History Panel
3. Verify only ~50 most recent actions are shown
4. Try to undo more than 50 times
5. Verify you can only undo up to the limit

**Expected Result:** Only the last 50 actions are kept in history

### 8. Redo Stack Clearing
**Steps:**
1. Perform 3 actions
2. Undo all 3 actions
3. Verify redo stack has 3 actions
4. Perform a new action
5. Verify redo stack is cleared
6. Try to redo
7. Verify redo is not available

**Expected Result:** New actions should clear the redo stack

### 9. Multiple Scene Editing
**Steps:**
1. Create Scene A and add a layer
2. Switch to Scene B and add a layer
3. Switch back to Scene A
4. Press Ctrl+Z
5. Verify the last action (Scene B's layer) is undone
6. Not Scene A's layer

**Expected Result:** History should work across all scenes, undoing in chronological order

### 10. Current State Indicator
**Steps:**
1. Open History Panel
2. Perform several actions
3. Verify the most recent action is marked as "État actuel" (Current State)
4. Undo one action
5. Verify the previous action is now marked as current state
6. Actions after current state should appear grayed out

**Expected Result:** Visual indicator shows current position in history

## Known Limitations

1. **Manual Integration Required**: The history system is built but not yet integrated into all existing action points. Developers must use `useHistoryActions()` hook instead of direct store actions to record history.

2. **High-Frequency Updates**: Rapid updates (e.g., dragging sliders) may fill history quickly. Consider implementing debouncing for such cases.

## Notes for Developers

To enable history for an action, replace:
```typescript
const addLayer = useSceneStore((state) => state.addLayer);
addLayer(sceneId, layer);
```

With:
```typescript
const { addLayerWithHistory } = useHistoryActions();
addLayerWithHistory(sceneId, layer);
```

See `docs/HISTORY_SYSTEM.md` for complete documentation.
