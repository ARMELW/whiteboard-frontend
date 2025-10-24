# Scene and Layer Duplication Fix

## Issue
When duplicating a scene or layer, the duplicated item was being added at the end of the list instead of right after the original item.

## Solution
Modified the duplication logic to insert the duplicated scene or layer immediately after the original item in the list.

## Changes Made

### 1. Layer Duplication

#### `src/app/scenes/store.ts`
- Modified `duplicateLayer` signature to accept an optional `afterIndex` parameter
- Updated implementation to insert the layer at `afterIndex + 1` when provided, otherwise append at the end (backward compatible)

```typescript
duplicateLayer: (sceneId: string, layer: Layer, afterIndex?: number) => {
  set(state => ({
    scenes: state.scenes.map(s => {
      if (s.id !== sceneId) return s;
      
      const layers = [...(s.layers || [])];
      
      // If afterIndex is provided, insert right after that index
      if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < layers.length) {
        layers.splice(afterIndex + 1, 0, layer);
      } else {
        // Otherwise, add at the end (default behavior)
        layers.push(layer);
      }
      
      return { ...s, layers };
    })
  }));
  setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
}
```

#### `src/app/scenes/hooks/useScenesActions.ts`
- Updated `duplicateLayer` to find the original layer's index and pass it to the store

#### `src/app/history/hooks/useHistoryActions.ts`
- Updated `duplicateLayerWithHistory` to accept and forward the `afterIndex` parameter

#### `src/app/hooks/useScenesActionsWithHistory.ts`
- Updated to find the layer index and pass it through the call chain

### 2. Scene Duplication

#### `src/app/scenes/store.ts`
- Modified `addScene` signature to accept an optional `afterIndex` parameter
- Updated implementation to insert the scene at `afterIndex + 1` when provided, otherwise append at the end (backward compatible)

```typescript
addScene: (scene: Scene, afterIndex?: number) => {
  set(state => {
    const scenes = [...state.scenes];
    
    // If afterIndex is provided, insert right after that index
    if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < scenes.length) {
      scenes.splice(afterIndex + 1, 0, scene);
    } else {
      // Otherwise, add at the end (default behavior)
      scenes.push(scene);
    }
    
    return { scenes };
  });
}
```

#### `src/app/scenes/hooks/useScenesActions.ts`
- Updated `duplicateScene` to find the original scene's index and pass it to `addScene`

#### `src/components/organisms/ScenePanel.tsx`
- Updated `handleDuplicateScene` to set the selected scene index to `index + 1` instead of `scenes.length`

#### `src/app/history/hooks/useHistoryActions.ts`
- Updated `addSceneWithHistory` to accept and forward the `afterIndex` parameter

## Backward Compatibility

All changes maintain backward compatibility:
- The `afterIndex` parameter is optional in all functions
- When not provided, items are appended at the end (previous behavior)
- Existing code that doesn't pass the index will continue to work

## Testing

The logic was verified with unit tests showing correct insertion at:
- Middle positions
- First position
- Last position

All edge cases were tested and pass successfully.

## Files Modified

1. `src/app/scenes/store.ts`
2. `src/app/scenes/hooks/useScenesActions.ts`
3. `src/app/history/hooks/useHistoryActions.ts`
4. `src/app/hooks/useScenesActionsWithHistory.ts`
5. `src/components/organisms/ScenePanel.tsx`

## Build Status

✅ Lint: Passed (no errors in modified files)
✅ Build: Passed
✅ Logic Tests: All passed
