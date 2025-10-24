# History System Documentation

## Overview

This document describes the enhanced action-based history system for undo/redo functionality in the Whiteboard Frontend application.

## Features

- **Action-Based History**: Instead of storing full state snapshots, the system tracks individual actions with their undo/redo operations
- **Configurable Limit**: Default limit of 50 actions (configurable)
- **Keyboard Shortcuts**: 
  - `Ctrl+Z` / `Cmd+Z` - Undo
  - `Ctrl+Y` / `Cmd+Y` / `Cmd+Shift+Z` - Redo
- **Visual History Panel**: Optional panel showing all actions with timestamps
- **Supported Actions**:
  - Scene operations (add, update, delete, reorder)
  - Layer operations (add, update, delete, move, duplicate)
  - Property changes (scene and layer properties)
  - Camera operations (add, update, delete)

## Architecture

### Core Components

#### 1. History Store (`src/app/history/store.ts`)
Zustand store managing the undo/redo stacks:
- `undoStack`: Array of actions that can be undone
- `redoStack`: Array of actions that can be redone
- `maxHistorySize`: Maximum number of actions to keep (default: 50)
- `isUndoing`/`isRedoing`: Flags to prevent recursive history recording

#### 2. Action Types (`src/app/history/types.ts`)
Defines all supported action types:
```typescript
export enum ActionType {
  ADD_SCENE = 'ADD_SCENE',
  UPDATE_SCENE = 'UPDATE_SCENE',
  DELETE_SCENE = 'DELETE_SCENE',
  // ... and more
}

export interface HistoryAction {
  type: ActionType;
  timestamp: number;
  description: string;
  undo: () => void;
  redo: () => void;
}
```

#### 3. History Hooks
- `useHistory()`: Access undo/redo operations and state
- `useHistoryActions()`: History-aware action creators

## Usage

### Basic Undo/Redo

```typescript
import { useHistory } from '@/app/history';

function MyComponent() {
  const { undo, redo, canUndo, canRedo } = useHistory();
  
  return (
    <>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </>
  );
}
```

### Using History-Aware Actions

To record an action in history, use the history-aware action creators:

```typescript
import { useHistoryActions } from '@/app/history';

function MyComponent() {
  const { addLayerWithHistory, updateLayerPropertyWithHistory } = useHistoryActions();
  
  const handleAddLayer = () => {
    const newLayer = {
      id: 'layer-123',
      name: 'New Layer',
      type: LayerType.IMAGE,
      // ... other properties
    };
    
    // This will add the layer AND record it in history
    addLayerWithHistory('scene-id', newLayer);
  };
  
  const handleUpdateOpacity = (layerId: string, newOpacity: number) => {
    // This will update the property AND record it in history
    updateLayerPropertyWithHistory('scene-id', layerId, 'opacity', newOpacity);
  };
  
  return (
    <button onClick={handleAddLayer}>Add Layer</button>
  );
}
```

### Available History-Aware Actions

#### Scene Actions
- `addSceneWithHistory(scene: Scene)`
- `updateSceneWithHistory(scene: Scene)`
- `deleteSceneWithHistory(sceneId: string)`
- `reorderScenesWithHistory(sceneIds: string[])`

#### Layer Actions
- `addLayerWithHistory(sceneId: string, layer: Layer)`
- `updateLayerWithHistory(sceneId: string, layer: Layer)`
- `deleteLayerWithHistory(sceneId: string, layerId: string)`
- `moveLayerWithHistory(sceneId: string, fromIndex: number, toIndex: number)`
- `duplicateLayerWithHistory(sceneId: string, layer: Layer)`

#### Property Actions
- `updateScenePropertyWithHistory(sceneId: string, property: string, value: any)`
- `updateLayerPropertyWithHistory(sceneId: string, layerId: string, property: string, value: any)`

#### Camera Actions
- `addCameraWithHistory(sceneId: string, camera: Camera)`

### Showing the History Panel

The history panel can be toggled via the Clock icon button in the AnimationHeader, or programmatically:

```typescript
import { useSceneStore } from '@/app/scenes';

function MyComponent() {
  const setShowHistoryPanel = useSceneStore((state) => state.setShowHistoryPanel);
  
  return (
    <button onClick={() => setShowHistoryPanel(true)}>
      Show History
    </button>
  );
}
```

## Migration Guide

### For Existing Code

If you're currently using direct store actions (e.g., `addLayer`, `updateLayer`), you have two options:

#### Option 1: Use History-Aware Actions (Recommended)
Replace direct store calls with history-aware versions:

**Before:**
```typescript
const addLayer = useSceneStore((state) => state.addLayer);
addLayer(sceneId, newLayer);
```

**After:**
```typescript
const { addLayerWithHistory } = useHistoryActions();
addLayerWithHistory(sceneId, newLayer);
```

#### Option 2: Keep Direct Actions (Not Recommended)
If you need to perform actions without recording history (e.g., for batch operations or loading saved data), you can continue using direct store actions. However, this means those actions won't be undoable.

## How It Works

1. **Action Recording**: When you call a history-aware action (e.g., `addLayerWithHistory`), it:
   - Creates a history action object with undo/redo callbacks
   - Executes the actual store mutation
   - Pushes the action to the undo stack
   - Clears the redo stack

2. **Undo Operation**: When undo is triggered:
   - Sets `isUndoing` flag to prevent recursive recording
   - Executes the `undo()` callback of the last action in undo stack
   - Moves the action from undo stack to redo stack
   - Resets the `isUndoing` flag

3. **Redo Operation**: Similar to undo but in reverse:
   - Sets `isRedoing` flag
   - Executes the `redo()` callback
   - Moves action from redo stack back to undo stack
   - Resets the `isRedoing` flag

4. **Preventing Recursive Recording**: The `isUndoing` and `isRedoing` flags prevent the undo/redo operations themselves from being recorded as new actions in history.

## Configuration

### Changing History Limit

The default history limit is 50 actions. To change it:

```typescript
import { useHistoryStore } from '@/app/history';

// In your initialization code
useHistoryStore.getState().setMaxHistorySize(100); // Set to 100 actions
```

### Clearing History

To clear all history:

```typescript
import { useHistory } from '@/app/history';

function MyComponent() {
  const { clear } = useHistory();
  
  return (
    <button onClick={clear}>Clear History</button>
  );
}
```

## Best Practices

1. **Always use history-aware actions for user-initiated changes**: This ensures users can undo their actions
2. **Skip history for programmatic/batch operations**: When loading data or performing batch operations, use direct store actions
3. **Provide meaningful descriptions**: Action descriptions appear in the history panel, so make them user-friendly
4. **Consider performance**: For high-frequency updates (e.g., dragging), you may want to debounce or throttle history recording

## Example: Complete Component

```typescript
import React from 'react';
import { useHistoryActions } from '@/app/history';
import { Layer, LayerType } from '@/app/scenes/types';

function LayerManager({ sceneId }: { sceneId: string }) {
  const { 
    addLayerWithHistory, 
    deleteLayerWithHistory,
    updateLayerPropertyWithHistory 
  } = useHistoryActions();
  
  const handleAddTextLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: 'Text Layer',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 100, y: 100 },
      z_index: 0,
      scale: 1,
      opacity: 1,
      text: 'Hello World',
    };
    
    addLayerWithHistory(sceneId, newLayer);
  };
  
  const handleDeleteLayer = (layerId: string) => {
    deleteLayerWithHistory(sceneId, layerId);
  };
  
  const handleChangeOpacity = (layerId: string, opacity: number) => {
    updateLayerPropertyWithHistory(sceneId, layerId, 'opacity', opacity);
  };
  
  return (
    <div>
      <button onClick={handleAddTextLayer}>Add Text Layer</button>
      {/* More UI components */}
    </div>
  );
}

export default LayerManager;
```

## Troubleshooting

### Actions not appearing in history
- Make sure you're using history-aware actions (e.g., `addLayerWithHistory`) instead of direct store actions
- Check that the action isn't being performed during an undo/redo operation

### Undo not working as expected
- Verify that the undo callback is correctly restoring the previous state
- Check the browser console for any errors during undo execution

### History growing too large
- Reduce the `maxHistorySize` setting
- Consider implementing action coalescing for rapid successive changes
