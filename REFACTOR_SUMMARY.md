# Refactoring Summary: Selection & Performance Optimization

## Overview
This refactoring addresses three critical issues in the whiteboard application related to layer selection, property display, and rendering performance.

## Issues Fixed

### 1. Selected Element/Layer Deselection on Auto-Save ✅
**Problem**: When auto-save triggered (every 3 seconds after changes), the selected layer and element were being deselected, interrupting the user's workflow.

**Root Cause**: In `useLayerEditor.ts`, the `useEffect` hook that synced the edited scene with the current scene was unconditionally resetting `selectedLayerId` and `selectedCamera` to `null` whenever the scene changed.

**Solution**: 
- Modified the `useEffect` in `useLayerEditor.ts` to only reset selection when the selected layer no longer exists
- Added logic to check if the currently selected layer still exists in the new scene data
- Preserves selection state across scene updates, only clearing it when the layer is actually deleted

```typescript
// Before: Always reset selection
useEffect(() => {
  setEditedScene({ ...scene, layers: scene.layers || [] });
  setSelectedLayerId(null);  // ❌ Always clears selection
  setSelectedCamera(null);
}, [scene]);

// After: Only reset if layer doesn't exist
useEffect(() => {
  const layerStillExists = scene.layers?.some((l: any) => l.id === currentSelectedLayerId);
  setEditedScene({ ...scene, layers: scene.layers || [] });
  
  if (currentSelectedLayerId && !layerStillExists) {
    setSelectedLayerId(null);  // ✅ Only clears when layer is gone
  }
}, [scene, externalSelectedLayerId, internalSelectedLayerId, setSelectedLayerId]);
```

### 2. Text Properties Not Displaying When Clicking on Layer ✅
**Problem**: When clicking on a text layer, the text properties panel would not display the properties or would show stale data.

**Root Cause**: 
- `PropertiesPanel` was using `useCurrentScene()` which fetches data from React Query cache
- The cache could be stale while the user was editing (local state in `editedScene`)
- Auto-save operations were updating the cache, but there was a timing mismatch

**Solution**:
- Lifted the `editedScene` state to `AnimationContainer` component
- Pass the edited scene directly from `LayerEditor` to `PropertiesPanel` as a prop
- `PropertiesPanel` now uses `propEditedScene || sceneFromCache`, prioritizing the fresh edited state
- This ensures properties always reflect the current editing state, not stale cache data

```typescript
// AnimationContainer.tsx
const [editedScene, setEditedScene] = useState<any>(null);
<LayerEditor onEditedSceneChange={setEditedScene} />
<PropertiesPanel editedScene={editedScene} />

// PropertiesPanel.tsx
const PropertiesPanel = ({ editedScene: propEditedScene }) => {
  const sceneFromCache = useCurrentScene();
  const scene = propEditedScene || sceneFromCache;  // ✅ Use fresh edited state first
  // ...
};
```

### 3. Heavy Re-rendering on Property Changes ✅
**Problem**: Every time a property changed (e.g., text color, position), all components would re-render, causing performance issues and a sluggish UI.

**Root Causes**:
1. `useScenesActions` was updating the entire React Query cache on every mutation
2. Auto-save was triggering these cache updates every 3 seconds
3. Components weren't memoized, so they re-rendered on every state change
4. Callbacks weren't memoized, creating new function references on each render

**Solutions**:

#### A. Optimize Auto-Save Cache Updates
- Added `skipCacheUpdate: true` flag to auto-save `updateScene` calls
- This flag is handled in `useScenesActions.ts` to skip optimistic updates during auto-save
- Prevents unnecessary cache thrashing during auto-save operations

```typescript
// LayerEditor.tsx - Auto-save with skipCacheUpdate
await updateScene({ 
  id: scene.id, 
  data: { /* scene updates */ },
  skipCacheUpdate: true  // ✅ Skip cache update during auto-save
});

// useScenesActions.ts - Honor the flag
onMutate: async (variables: { id: string; data: Partial<Scene>; skipCacheUpdate?: boolean }) => {
  if (skipCacheUpdate) {
    return { skipped: true };  // ✅ Skip optimistic update
  }
  // ... normal cache update logic
}
```

#### B. Component Memoization
- Wrapped `LayerPropertiesForm` with `React.memo` to prevent re-renders when props haven't changed
- Wrapped `TextPropertiesForm` with `React.memo` for the same reason
- Added display names for debugging

```typescript
// LayerPropertiesForm.tsx
export const LayerPropertiesForm: React.FC<LayerPropertiesFormProps> = memo(({
  layer,
  onPropertyChange
}) => {
  // ... component logic
});
LayerPropertiesForm.displayName = 'LayerPropertiesForm';
```

#### C. Computed Value Memoization
- Used `useMemo` in `PropertiesPanel` to memoize the `selectedLayer` computation
- Prevents recalculating which layer is selected on every render

```typescript
// PropertiesPanel.tsx
const selectedLayer = useMemo(() => {
  return scene.layers?.find((layer: any) => layer.id === selectedLayerId);
}, [scene.layers, selectedLayerId]);  // ✅ Only recompute when dependencies change
```

#### D. Callback Memoization
- Wrapped `handleSceneChange` and `handleLayerPropertyChange` with `useCallback`
- Prevents creating new function references on each render
- Stable function references allow child components to skip re-renders

```typescript
// PropertiesPanel.tsx
const handleSceneChange = useCallback((field: string, value: any) => {
  if (!scene.id) return;
  updateScene({ id: scene.id, data: { [field]: value } });
}, [scene.id, updateScene]);  // ✅ Only recreate when dependencies change
```

## Performance Impact

### Before:
- ❌ Selection lost every 3 seconds during auto-save
- ❌ Properties panel showed stale data
- ❌ Every property change triggered full app re-render
- ❌ Auto-save caused unnecessary cache updates
- ❌ Components re-rendered even when their props didn't change

### After:
- ✅ Selection preserved across auto-save operations
- ✅ Properties panel always shows current editing state
- ✅ Only affected components re-render on property changes
- ✅ Auto-save doesn't trigger cache updates
- ✅ Memoized components skip unnecessary re-renders
- ✅ Stable callback references prevent child re-renders

## Files Changed

1. `src/components/molecules/layer-management/useLayerEditor.ts`
   - Fixed selection preservation logic

2. `src/components/organisms/LayerEditor.tsx`
   - Added `onEditedSceneChange` prop
   - Added `skipCacheUpdate` flag to auto-save

3. `src/components/organisms/AnimationContainer.tsx`
   - Lifted `editedScene` state
   - Passed state to child components

4. `src/components/organisms/PropertiesPanel.tsx`
   - Accept `editedScene` prop
   - Added `useMemo` and `useCallback` hooks
   - Use fresh edited state instead of cache

5. `src/components/molecules/properties/LayerPropertiesForm.tsx`
   - Wrapped with `React.memo`

6. `src/components/molecules/properties/TextPropertiesForm.tsx`
   - Wrapped with `React.memo`

## Testing Recommendations

1. **Selection Persistence Test**
   - Select a layer
   - Make changes to trigger auto-save
   - Verify layer remains selected after auto-save

2. **Property Display Test**
   - Click on a text layer
   - Verify text properties display immediately
   - Change text properties and verify they update in real-time

3. **Performance Test**
   - Open browser DevTools Performance tab
   - Change layer properties (color, position, etc.)
   - Verify only relevant components re-render
   - Check that re-renders are minimal

4. **Auto-Save Test**
   - Make multiple changes rapidly
   - Verify auto-save triggers after 3 seconds of inactivity
   - Confirm no performance degradation during auto-save

## Migration Notes

- No breaking changes
- All changes are internal optimizations
- Existing components continue to work as before
- The API surface remains unchanged

## Future Improvements

1. Consider using `React.useDeferredValue` for heavy computations
2. Implement virtual scrolling for large layer lists
3. Consider breaking down `PropertiesPanel` into smaller, more focused components
4. Add performance monitoring to track render times
