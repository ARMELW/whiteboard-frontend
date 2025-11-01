# SVG Path Editor - User Guide

## Overview
The SVG Path Editor is a tool for creating animation paths for whiteboard-style animations. It allows you to define precise point sequences that can be used to animate hand-drawing effects along SVG elements.

## Accessing the Editor
Navigate to: `/svg-path-editor`

## How to Use

### 1. Upload an SVG File
- Click the **"Upload SVG"** button in the toolbar
- Select an SVG file from your computer
- The SVG will be displayed on the canvas and automatically scaled to fit

### 2. Add Points
- **Click** anywhere on the SVG to add a point
- Points are numbered in the order they are added
- Each point is automatically connected to the previous one with a line

### 3. Edit Points
- **Drag** any point to reposition it
- **Click** a point to select it (it will turn red)
- **Press Delete** to remove the selected point
- **Press Escape** to deselect the current point

### 4. Undo/Redo
- **Ctrl+Z** (or Cmd+Z on Mac) to undo
- **Ctrl+Y** (or Cmd+Y on Mac) to redo
- Or use the toolbar buttons

### 5. Export Path Data
- Click the **"Export JSON"** button
- A JSON file will be downloaded containing all point coordinates
- Format: `[{"x": 12, "y": 30}, {"x": 15, "y": 32}, ...]`

### 6. Clear or Reset
- **Clear Points**: Removes all points but keeps the SVG
- **Reset**: Removes both the SVG and all points

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Click | Add point or select point |
| Drag | Move point |
| Delete | Remove selected point |
| Escape | Deselect point |
| Ctrl+Z / Cmd+Z | Undo |
| Ctrl+Y / Cmd+Y | Redo |

## Use Cases

### Hand-Drawing Animation
1. Upload an SVG of the shape you want to animate
2. Place points along the path you want the "hand" to follow
3. Export the points as JSON
4. Use the JSON data in your animation system to animate the hand movement

### Best Practices
- Start from the natural beginning of the shape
- Add more points on curves for smoother animations
- Use fewer points on straight sections
- Test with different point densities to find the right balance

## Technical Details

### Exported JSON Format
```json
[
  { "x": 50, "y": 200 },
  { "x": 120, "y": 180 },
  { "x": 200, "y": 160 },
  { "x": 280, "y": 180 },
  { "x": 350, "y": 200 }
]
```

Coordinates are relative to the SVG's coordinate system (not screen pixels).

### Supported SVG Features
- Standard SVG elements (paths, shapes, groups)
- ViewBox-based sizing
- Width/height attributes
- Most standard SVG attributes

### Sample SVG
A sample arrow SVG is provided at `docs/svg-path-editor-sample.svg` for testing.

## Integration with Animation System

The exported JSON can be used with animation libraries to:
1. Create path following animations
2. Animate drawing effects with a hand/pen cursor
3. Create reveal animations along custom paths
4. Coordinate multiple animated elements

Example usage with animation system:
```typescript
import pathPoints from './path-points.json';

// Animate hand along path
pathPoints.forEach((point, index) => {
  setTimeout(() => {
    handElement.style.left = point.x + 'px';
    handElement.style.top = point.y + 'px';
  }, index * 100);
});
```

## Troubleshooting

### SVG Not Displaying
- Ensure the file is a valid SVG
- Check that the SVG has width/height or viewBox attributes
- Try opening the SVG in a browser to verify it's valid

### Points Not Aligning
- Points use the SVG's coordinate system
- If the SVG has transforms, they may affect positioning
- Ensure the SVG is properly structured

### Export Not Working
- Make sure you have at least one point added
- Check browser console for errors
- Verify that browser allows downloads

## Future Enhancements
- Zoom and pan controls
- Grid snapping
- Point editing sidebar
- Path smoothing options
- Multiple path support
- SVG layer selection
