# Multi-Selection and Image Centering Implementation

## Overview
This document describes the implementation of multi-selection with Ctrl+Click and image centering features for the whiteboard frontend application.

## Problem Statement
The original issue requested:
1. **Multi-selection functionality**: Like any editing software, the ability to select multiple layers using Ctrl+Click, then move or delete them together
2. **Image centering bug fix**: Images added from the asset library were not centered in the camera viewport but placed outside

## Solution

### 1. Multi-Selection Implementation

#### Store Changes (`src/app/scenes/store.ts`)
Added multi-selection state management:
```typescript
interface SceneState {
  selectedLayerId: string | null;
  selectedLayerIds: string[];  // New: Array for multi-selection
  // ... other fields
}
```

New actions:
- `setSelectedLayerIds(ids: string[])` - Set multiple selected layers
- `toggleLayerSelection(id: string)` - Toggle layer selection for Ctrl+Click
- `clearSelection()` - Clear all selections

#### Layer Component Updates
Updated three layer components to support multi-selection:

**LayerImage** (`src/components/molecules/canvas/LayerImage.tsx`):
- Added `selectedLayerIds` and `allLayers` props
- Modified `onSelect` to accept event parameter for Ctrl key detection
- Implemented group drag with `onDragStart`, `onDragMove`, `onDragEnd` handlers
- Tracks drag delta and applies it to all selected layers

**LayerText** (`src/components/molecules/canvas/LayerText.tsx`):
- Same multi-selection support as LayerImage
- Group drag functionality
- Maintains text-specific features like double-click editing

**LayerShape** (`src/components/LayerShape.tsx`):
- Updated `onSelect` signature to accept event parameter
- Integrated with multi-selection system

#### Canvas Integration (`src/components/organisms/SceneCanvas.tsx`)
Added multi-selection logic:
```typescript
const handleLayerSelect = (e?: any) => {
  const ctrlPressed = e?.evt?.ctrlKey || e?.evt?.metaKey;
  if (ctrlPressed) {
    // Multi-selection: toggle layer
    toggleLayerSelection(layer.id);
  } else {
    // Single selection: clear others
    onSelectLayer(layer.id);
    setSelectedLayerIds([layer.id]);
  }
};
```

Added keyboard deletion:
```typescript
React.useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerIds.length > 0) {
      if (!isEditingText) {
        e.preventDefault();
        selectedLayerIds.forEach((layerId) => {
          deleteLayer({ sceneId: scene.id, layerId });
        });
        clearSelection();
      }
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedLayerIds, scene.id, deleteLayer, clearSelection, isEditingText]);
```

#### UI Feedback (`src/components/organisms/PropertiesPanel.tsx`)
Added multi-selection info panel:
- Shows count of selected layers
- Displays usage instructions
- Only appears when multiple layers are selected

### 2. Image Centering Fix

#### Root Cause
Images were being positioned using normalized coordinates (0-1) without accounting for:
- Camera viewport dimensions
- Camera zoom level
- Image dimensions

#### Solution (`src/components/organisms/EmbeddedAssetLibraryPanel.tsx`)

Updated both `handleSelectAsset` and `handleCropComplete`:

```typescript
// Calculate camera center in pixel coordinates
const sceneWidth = 1920;
const sceneHeight = 1080;
let cameraCenterX = defaultCamera.position.x * sceneWidth;
let cameraCenterY = defaultCamera.position.y * sceneHeight;

// Calculate viewport size accounting for zoom
const cameraWidth = defaultCamera?.width || 800;
const cameraHeight = defaultCamera?.height || 450;
const cameraZoom = Math.max(0.1, defaultCamera?.zoom || 1);

const viewportWidth = cameraWidth / cameraZoom;
const viewportHeight = cameraHeight / cameraZoom;

// Fit image within 80% of viewport
const maxWidth = viewportWidth * 0.8;
const maxHeight = viewportHeight * 0.8;

const scaleX = maxWidth / asset.width;
const scaleY = maxHeight / asset.height;
const scale = Math.min(scaleX, scaleY, 1.0);

// Center the scaled image in viewport
const scaledImageWidth = asset.width * scale;
const scaledImageHeight = asset.height * scale;

const positionX = cameraCenterX - (scaledImageWidth / 2);
const positionY = cameraCenterY - (scaledImageHeight / 2);
```

## Features

### Multi-Selection
1. **Ctrl+Click Selection**
   - Hold Ctrl (Cmd on Mac) and click layers to add/remove from selection
   - Visual feedback with transformer boxes on all selected layers
   - Works across all layer types (image, text, shape)

2. **Group Movement**
   - Drag any selected layer to move all selected layers together
   - Relative positions maintained during drag
   - Smooth coordinated movement

3. **Keyboard Deletion**
   - Press Delete or Backspace to remove all selected layers
   - Protected during text editing to prevent accidental deletions
   - Works with single or multiple selections

4. **UI Feedback**
   - Properties panel shows multi-selection count
   - Clear instructions for group operations
   - Semantic HTML structure

### Image Centering
1. **Proper Positioning**
   - Images center in camera viewport, not scene origin
   - Accounts for camera position in scene

2. **Intelligent Scaling**
   - Images scale to fit 80% of camera viewport
   - Respects aspect ratio
   - Accounts for camera zoom level

3. **Consistent Behavior**
   - Same logic for asset library and cropped images
   - Predictable placement regardless of camera state

## Testing

### Build Status
✅ Build passes successfully
✅ No TypeScript errors
✅ No linting issues

### Security
✅ CodeQL analysis: 0 vulnerabilities found
✅ No security issues introduced

### Code Quality
✅ Code review feedback addressed
✅ Proper React patterns used
✅ No unsafe operations

## Usage Instructions

### Selecting Multiple Layers
1. Hold Ctrl key (Cmd on Mac)
2. Click on layers you want to select
3. Each clicked layer toggles selection
4. Transformer boxes show on all selected layers

### Moving Multiple Layers
1. Select multiple layers with Ctrl+Click
2. Click and drag any selected layer
3. All selected layers move together maintaining relative positions

### Deleting Multiple Layers
1. Select layers with Ctrl+Click
2. Press Delete or Backspace key
3. All selected layers are removed
4. Selection is cleared automatically

### Adding Centered Images
1. Open asset library from left panel
2. Click on any image in the library
3. Image appears centered in the active camera viewport
4. Image is automatically scaled to fit nicely in view

## Files Modified

### Core Changes
- `src/app/scenes/store.ts` - Multi-selection state management
- `src/components/organisms/SceneCanvas.tsx` - Selection and deletion logic
- `src/components/molecules/canvas/LayerImage.tsx` - Multi-drag support
- `src/components/molecules/canvas/LayerText.tsx` - Multi-drag support
- `src/components/LayerShape.tsx` - Event parameter support

### UI Changes
- `src/components/organisms/PropertiesPanel.tsx` - Multi-selection feedback
- `src/components/organisms/EmbeddedAssetLibraryPanel.tsx` - Image centering fix

## Technical Details

### Multi-Selection State Flow
1. User Ctrl+Clicks layer → `handleLayerSelect` called with event
2. Event checked for Ctrl/Cmd key
3. If Ctrl: `toggleLayerSelection(layerId)` called
4. If not: `setSelectedLayerIds([layerId])` for single selection
5. Store updates `selectedLayerIds` array
6. All components using `selectedLayerIds` re-render
7. Transformer boxes appear on selected layers

### Group Drag Flow
1. User starts dragging a selected layer → `onDragStart` fired
2. Initial position stored in `dragStartPosRef`
3. During drag → `onDragMove` fired continuously
4. Delta calculated: `current position - start position`
5. For each selected layer (except dragged one):
   - Get current position
   - Add delta
   - Call `onChange` with new position
6. Update `dragStartPosRef` for next delta calculation
7. On release → `onDragEnd` fired, reference cleared

### Image Centering Calculation
1. Get camera position (normalized 0-1)
2. Convert to scene pixels (multiply by 1920x1080)
3. Get camera viewport dimensions
4. Divide by zoom to get actual viewport in scene space
5. Calculate max dimensions (80% of viewport)
6. Scale image to fit within max dimensions
7. Calculate top-left position to center scaled image
8. Create layer with pixel position and scale

## Benefits

### User Experience
- Familiar multi-selection behavior (like Photoshop, Figma, etc.)
- Efficient workflow for managing multiple layers
- Predictable image placement
- Better visual feedback

### Code Quality
- Clean separation of concerns
- Reusable multi-selection logic
- Proper state management
- Type-safe implementation

### Maintainability
- Well-documented code
- Consistent patterns across layer types
- Easy to extend for future features
- No breaking changes to existing functionality

## Future Enhancements

Possible improvements:
1. Selection box (rubber band) for area selection
2. Shift+Click for contiguous selection
3. Group transformation (scale/rotate multiple layers)
4. Layer grouping/ungrouping
5. Selection presets/saved selections
6. Alignment tools for selected layers

## Conclusion

This implementation successfully addresses both issues from the problem statement:
1. ✅ Multi-selection with Ctrl+Click is fully functional
2. ✅ Images now center correctly in camera viewport

The solution follows React best practices, maintains type safety, and introduces no security vulnerabilities. All features are ready for production use.
