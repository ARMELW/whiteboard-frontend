# Layer Selection Persistence Fix

## Problem
When a user selects a layer and the scene autosaves (after 3 seconds of inactivity), the layer selection was being reset to `null`. This created a jarring user experience where the selected layer would appear to "disappear" briefly.

## Root Cause
The issue was in `src/components/molecules/layer-management/useLayerEditor.ts`:

```typescript
useEffect(() => {
  setEditedScene({
    ...scene,
    layers: scene.layers || [],
    sceneCameras: scene.sceneCameras || []
  });
  setSelectedLayerId(null);  // ❌ Always cleared selection on scene change
  setSelectedCamera(null);
}, [scene]);
```

The effect would run whenever `scene` changed, which includes:
1. **Switching to a different scene** (intentional: should clear selection)
2. **Scene data updates after save** (bug: should preserve selection)

Both cases triggered the same `setSelectedLayerId(null)`, causing the unwanted behavior.

## Solution
We now distinguish between these two scenarios using scene ID tracking:

```typescript
// Track previous scene ID to detect real scene changes
const prevSceneIdRef = useRef<string | undefined>(scene?.id);

useEffect(() => {
  const isSceneChange = prevSceneIdRef.current !== scene?.id;
  
  setEditedScene({
    ...scene,
    layers: scene.layers || [],
    sceneCameras: scene.sceneCameras || []
  });
  
  if (isSceneChange) {
    // Different scene: clear selection ✅
    setSelectedLayerId(null);
    setSelectedCamera(null);
    prevSceneIdRef.current = scene?.id;
  } else {
    // Same scene (e.g., after save): preserve selection ✅
    if (selectedLayerId) {
      const layerStillExists = scene.layers?.some((layer: any) => layer.id === selectedLayerId);
      if (!layerStillExists) {
        setSelectedLayerId(null);  // Only clear if layer was deleted
      }
    }
    setSelectedCamera(null);
  }
}, [scene, selectedLayerId, setSelectedLayerId]);
```

## Behavior After Fix

### Scenario 1: User selects a layer and makes changes
1. User selects Layer A
2. User modifies Layer A (position, properties, etc.)
3. After 3 seconds, autosave triggers
4. Scene data updates in the cache
5. **Layer A remains selected** ✅ (not reset to null)

### Scenario 2: User switches to a different scene
1. User selects Layer A in Scene 1
2. User clicks on Scene 2
3. Scene changes (different scene ID)
4. **Selection is cleared** ✅ (correct behavior)

### Scenario 3: User deletes the selected layer
1. User selects Layer A
2. User deletes Layer A
3. Layer no longer exists in scene
4. **Selection is cleared** ✅ (correct behavior)

## Testing Scenarios

To manually test this fix:

1. **Test autosave selection persistence:**
   - Open the layer editor
   - Select a layer
   - Make a small change (move it slightly)
   - Wait 3+ seconds for autosave
   - ✅ Layer should remain selected

2. **Test scene switching:**
   - Select a layer in Scene 1
   - Switch to Scene 2
   - ✅ Selection should be cleared

3. **Test layer deletion:**
   - Select a layer
   - Delete the layer
   - ✅ Selection should be cleared

4. **Test layer addition:**
   - Add a new layer
   - ✅ New layer should be automatically selected

## Technical Details

**Files Modified:**
- `src/components/molecules/layer-management/useLayerEditor.ts`

**Key Changes:**
1. Import `useRef` from React
2. Add `prevSceneIdRef` to track previous scene ID
3. Compare scene IDs to detect real scene changes vs. updates
4. Preserve selection on scene updates (same ID)
5. Clear selection only when appropriate

**State Management:**
- Selection state is stored in Zustand (`useSceneStore`)
- `useLayerEditor` receives `selectedLayerId` as external prop
- Selection persistence is handled by not clearing it unnecessarily

**Dependencies:**
- The effect depends on `[scene, selectedLayerId, setSelectedLayerId]`
- This ensures the effect runs when needed but doesn't cause infinite loops
- Scene ID comparison prevents unnecessary selection clearing
