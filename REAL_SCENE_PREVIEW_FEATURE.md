# Real Scene Preview Feature

## Overview

This feature adds a "Real Scene Preview" mode to the whiteboard animation editor, allowing users and developers to view scenes exactly as they will be rendered in the final video export, with optional debugging information to identify position issues.

## Problem Statement

The application previously lacked a way to visualize how scenes would actually appear in the final render. Users could edit scenes in the editor, but there was no direct feedback about:
- How camera viewports frame the content
- Whether elements are positioned correctly within the camera's view
- The exact coordinates of elements in the scene

This made debugging position errors difficult, especially when elements appeared misaligned or off-screen in the final export.

## Solution

### New Components

#### 1. **RealScenePreview Component**
Location: `src/components/molecules/RealScenePreview.tsx`

A specialized rendering component that:
- Renders the scene without interactive editing controls
- Calculates and visualizes the selected camera's viewport
- Adds optional debug overlays showing position information
- Highlights which elements are inside/outside the camera view

**Key Features:**
- **Camera Viewport Visualization**: Shows the active camera's frame with a green dashed border
- **Position Crosshairs**: Displays red crosshairs at the center point of each layer
- **Coordinate Labels**: Shows layer names and (x, y) coordinates
- **In-View Indicators**: Elements inside the camera viewport are highlighted in green, those outside in gray
- **Semi-transparent Overlay**: Areas outside the camera viewport are darkened for better contrast

#### 2. **SceneCanvas Enhancement**
Location: `src/components/organisms/SceneCanvas.tsx`

Enhanced the main canvas component with:
- Preview mode toggle button
- State management for preview mode and debug info visibility
- Conditional rendering between edit mode and preview mode
- New toolbar section with mode controls

### User Interface

#### Preview Mode Toolbar
Added a new toolbar below the camera controls with:

1. **Mode Toggle Button**
   - Icon: Eye symbol
   - States: "Mode Édition" / "Mode Prévisualisation Réelle"
   - Toggles between edit and preview modes
   - Primary color when preview mode is active

2. **Debug Info Checkbox** (visible only in preview mode)
   - Label: "Afficher les infos de débogage"
   - Allows users to show/hide position debugging information
   - Enabled by default

3. **Info Banner** (visible only in preview mode)
   - Message: "💡 Cette vue montre exactement comment la scène sera rendue dans la vidéo finale"
   - Provides context about what the preview mode shows

### How It Works

#### Camera Viewport Calculation
```typescript
// Camera position is normalized (0-1), convert to pixels
const cameraCenterX = (camera.position.x || 0.5) * sceneWidth;
const cameraCenterY = (camera.position.y || 0.5) * sceneHeight;

// Calculate viewport dimensions with zoom
const viewportWidth = cameraWidth / cameraZoom;
const viewportHeight = cameraHeight / cameraZoom;

// Calculate top-left corner of viewport
const viewportX = cameraCenterX - viewportWidth / 2;
const viewportY = cameraCenterY - viewportHeight / 2;
```

#### Debug Overlay Layers
The preview mode adds multiple Konva layers:

1. **Semi-transparent Mask**: Covers the entire scene with 50% opacity black
2. **Clear Viewport Area**: Uses `destination-out` composite operation to reveal the camera viewport
3. **Viewport Border**: Green dashed border around the camera frame
4. **Camera Label**: Green background with camera name and zoom level
5. **Position Markers**: For each layer:
   - Red crosshair at the layer's position
   - Label with layer name and coordinates
   - Color coding: green if in view, gray if outside

## Usage Guide

### For Users

1. **Open a Scene**: Select a scene in the editor
2. **Enable Preview Mode**: Click the "Mode Prévisualisation Réelle" button
3. **View Camera Framing**: The green dashed border shows what the camera captures
4. **Check Element Positions**: Look for red crosshairs and coordinate labels
5. **Toggle Debug Info**: Use the checkbox to show/hide debugging overlays
6. **Test Different Cameras**: Select different cameras to see various viewpoints
7. **Return to Editing**: Click the button again to return to "Mode Édition"

### For Developers

#### Integrating the Preview Component

```typescript
import RealScenePreview from '../molecules/RealScenePreview';

// In your component
<RealScenePreview
  scene={scene}
  selectedCamera={currentCamera}
  sceneWidth={1920}
  sceneHeight={1080}
  zoom={0.8}
  showDebugInfo={true}
/>
```

#### Props
- `scene`: Scene object with layers and configuration
- `selectedCamera`: Camera object to visualize
- `sceneWidth`: Scene width in pixels (typically 1920)
- `sceneHeight`: Scene height in pixels (typically 1080)
- `zoom`: Display zoom level (affects UI scale)
- `showDebugInfo`: Boolean to show/hide debug overlays

## Benefits

### For Users
- ✅ **Instant Visual Feedback**: See exactly how the scene will render
- ✅ **Position Debugging**: Quickly identify misaligned elements
- ✅ **Camera Understanding**: Understand how camera positioning affects the final output
- ✅ **Workflow Improvement**: Reduce trial-and-error in positioning elements
- ✅ **Quality Assurance**: Verify scenes before exporting

### For Developers
- ✅ **Debugging Tool**: Helps diagnose position-related bugs
- ✅ **Testing Aid**: Validate that camera calculations are correct
- ✅ **Documentation**: Shows the relationship between scene coordinates and camera viewport
- ✅ **Reduced Support**: Users can self-diagnose positioning issues

## Technical Details

### State Management
```typescript
const [isRealPreviewMode, setIsRealPreviewMode] = useState(false);
const [showDebugInfo, setShowDebugInfo] = useState(true);
```

### Conditional Rendering
```typescript
{isRealPreviewMode ? (
  <RealScenePreview
    scene={scene}
    selectedCamera={sceneCameras.find(cam => cam.id === selectedCameraId)}
    sceneWidth={sceneWidth}
    sceneHeight={sceneHeight}
    zoom={sceneZoom}
    showDebugInfo={showDebugInfo}
  />
) : (
  /* Edit mode canvas */
)}
```

### Performance Considerations
- Preview mode is purely visual (no interaction handling)
- Debug overlays use Konva's `listening={false}` to avoid event processing
- Layers are only re-calculated when camera or scene changes

## Future Enhancements

Potential improvements for future iterations:
- [ ] Export preview as image for documentation
- [ ] Multiple camera comparison view
- [ ] Animation timeline preview
- [ ] Grid and ruler overlays
- [ ] Snap-to-viewport guides
- [ ] Warning indicators for off-screen elements
- [ ] Auto-frame camera to fit all layers

## Related Issues

This feature addresses the issue: **"Add real scene preview for position error debugging"**

**Context**: The application had a history of position errors (see `CHANGELOG_TEXT_POSITIONING.md`), making it difficult to diagnose where elements would actually appear in the final render.

**Solution**: The Real Scene Preview feature provides direct visual feedback about positioning, allowing users to see exactly where elements will appear and identify issues before export.

## Testing

### Manual Testing Steps
1. Create a scene with multiple text layers at different positions
2. Add multiple cameras with different zoom levels and positions
3. Toggle preview mode and verify:
   - Camera viewport is accurately displayed
   - Position crosshairs align with layer centers
   - Coordinate labels show correct values
   - In-view highlighting works correctly
   - Debug info toggle functions properly
   - Mode switching preserves scene state

### Test Scenarios
- ✅ Empty scene (no layers)
- ✅ Scene with text layers only
- ✅ Scene with image layers
- ✅ Scene with shape layers
- ✅ Scene with mixed layer types
- ✅ Multiple cameras with different settings
- ✅ Camera at edges/corners of scene
- ✅ High zoom levels (> 2x)
- ✅ Low zoom levels (< 0.5x)

## Files Modified

1. **src/components/molecules/RealScenePreview.tsx** (NEW)
   - New component for real scene preview visualization
   - ~240 lines of code

2. **src/components/organisms/SceneCanvas.tsx** (MODIFIED)
   - Added preview mode state and toggle
   - Added preview mode toolbar
   - Added conditional rendering
   - ~70 lines added

3. **src/components/molecules/index.ts** (MODIFIED)
   - Exported RealScenePreview component
   - 1 line added

## Conclusion

The Real Scene Preview feature significantly improves the debugging and quality assurance workflow for the whiteboard animation editor. It provides clear visual feedback about how scenes will render, making it easy to identify and fix position errors before exporting.
