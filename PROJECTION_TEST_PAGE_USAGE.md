# Projection Test Page - Usage Guide

## Overview

The Projection Test Page is a standalone testing tool for validating the projection system without requiring backend connectivity. It uses isolated test data with predefined scenarios to verify that layer positions, dimensions, and visibility calculations are accurate.

## Accessing the Test Page

**URL**: `http://localhost:5173/test/projection` (or your dev server URL)

No authentication or backend connection required!

## Features

### 1. Multiple Test Scenarios

The page includes 6 carefully designed test scenarios:

#### Test 1: Simple Centered
- **Purpose**: Verify basic centered element projection
- **Setup**: Single text layer at exact center of scene
- **Camera**: Centered (50%, 50%), no zoom
- **Expected**: 1 visible layer at canvas center

#### Test 2: Off-Center Elements
- **Purpose**: Test multiple elements at different positions
- **Setup**: 3 text layers (top-left, top-right, bottom-center)
- **Camera**: Centered (50%, 50%), no zoom
- **Expected**: 3 visible layers in their respective positions

#### Test 3: Camera Zoom 2x
- **Purpose**: Validate camera zoom magnification
- **Setup**: 2 layers (center and small top)
- **Camera**: Centered with 2x zoom
- **Expected**: 2 visible layers, content appears magnified

#### Test 4: Camera Offset
- **Purpose**: Test camera panning and layer visibility detection
- **Setup**: 3 layers at various positions
- **Camera**: Panned to top-left (30%, 30%)
- **Expected**: 2 visible, 1 hidden (outside viewport)

#### Test 5: Complex (Rotation & Scale)
- **Purpose**: Validate rotation, scale, and opacity
- **Setup**: 3 layers with different transforms
- **Camera**: Centered, no zoom
- **Expected**: 3 visible layers with transforms applied

#### Test 6: Small Camera Viewport
- **Purpose**: Test partial scene capture
- **Setup**: 3 layers across scene
- **Camera**: Centered, 800×450 viewport (smaller than scene)
- **Expected**: 1-2 visible (depending on position)

### 2. Resolution Testing

Test projection at different output resolutions:
- **SD**: 640×480
- **HD**: 1280×720
- **Full HD**: 1920×1080 (default)
- **2K**: 2560×1440
- **4K**: 3840×2160

The projection calculator should maintain correct aspect ratios and proportions at all resolutions.

### 3. Visual Aids

#### Grid
- 50px grid squares
- Red dashed center lines (50%, 50%)
- Helps visualize position accuracy

#### Layer Visualization
- Blue dashed borders around each layer
- Green border on hover
- Semi-transparent background for visibility

#### Coordinate Display
- Hover over any layer to see:
  - Scene coordinates (original position)
  - Projected coordinates (screen position)
  - Original and projected dimensions
  - Layer scale and opacity

### 4. Debug Information

The debug panels show:

**Visible Layers Panel (Green)**:
- List of all layers visible in camera viewport
- Scene and projected coordinates
- Original and projected dimensions
- Scale and opacity values

**Hidden Layers Panel (Red)**:
- Layers outside camera viewport
- Reason for being hidden
- Scene position information

### 5. Interactive Controls

**Test Scenario Dropdown**: Select different test cases

**Resolution Dropdown**: Change projection screen size

**Checkboxes**:
- **Grid**: Toggle grid and center lines
- **Coords**: Toggle coordinate tooltips on hover
- **Debug**: Toggle debug information panels

## How to Use

### Basic Testing Workflow

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the test page**:
   ```
   http://localhost:5173/test/projection
   ```

3. **Select a test scenario**:
   - Use the dropdown to choose a test case
   - Read the scenario description

4. **Verify the projection**:
   - Check that visible layer count matches expectations
   - Hover over layers to inspect coordinates
   - Verify positions look correct on the canvas

5. **Test different resolutions**:
   - Change the resolution dropdown
   - Verify layers maintain proportions
   - Check that projection scale adjusts correctly

6. **Inspect debug info**:
   - Review visible layers list
   - Check hidden layers (if any)
   - Compare scene vs projected coordinates

### What to Look For

#### ✅ Correct Behavior

1. **Centered Layer** (Test 1):
   - Should appear at exact center of canvas
   - Projected position ≈ (screenWidth/2, screenHeight/2)

2. **Multiple Layers** (Test 2):
   - Relative positions should match visual layout
   - Spacing should look proportional

3. **Camera Zoom** (Test 3):
   - Content should appear larger
   - Projection scale should account for zoom
   - All visible elements should be magnified equally

4. **Camera Offset** (Test 4):
   - Some layers should be hidden
   - Visible layers should be positioned relative to camera viewport
   - Hidden layers panel should list out-of-view elements

5. **Complex Transforms** (Test 5):
   - Rotated elements should maintain rotation
   - Scaled elements should appear larger
   - Opacity should be applied correctly

6. **Small Camera** (Test 6):
   - Layers outside small viewport should be hidden
   - Projection should fill the screen
   - Projection scale should adjust accordingly

#### ❌ Issues to Watch For

1. **Double Scaling**:
   - Elements appear too small or too large
   - Positions are offset from expected

2. **Incorrect Visibility**:
   - Layers that should be visible are hidden
   - Layers that should be hidden are visible

3. **Aspect Ratio Issues**:
   - Elements appear stretched or squashed
   - Proportions don't match across resolutions

4. **Center Misalignment**:
   - Centered elements not at canvas center
   - Offset increases with resolution changes

## Running Automated Tests

The projection system includes Playwright tests that automatically validate all scenarios.

### Run Tests

```bash
# Run tests in headless mode
npm run test:projection

# Run tests with UI (interactive)
npm run test:projection:ui

# Run tests in headed mode (see browser)
npm run test:projection:headed
```

### Test Coverage

The automated tests verify:
- All 6 test scenarios load correctly
- Visible/hidden layer counts are accurate
- Resolution changes update projection
- Projection scale calculations are correct
- Layer hover interactions work
- Toggle controls function properly
- Canvas displays at all resolutions
- Centered layers remain centered across resolutions

## Technical Details

### Projection Calculator

The test page uses the same `projectionCalculator.ts` utilities as the main application:

- `calculateProjectionScale()`: Determines scale factor to fit scene in screen
- `calculateProjectedLayerPosition()`: Converts scene coordinates to screen coordinates
- `calculateProjectedLayerDimensions()`: Scales layer dimensions for screen
- `isLayerVisibleInCamera()`: Checks if layer overlaps camera viewport
- `projectLayersToScreen()`: Projects all layers for a scene

### Test Data Structure

Each test scene includes:
- **Scene dimensions**: 1920×1080 (default)
- **Camera configuration**: Position, zoom, viewport size
- **Layers**: Position, size, scale, rotation, opacity
- **Expected behavior**: Description of what should be visible

Test data is located in: `src/data/projectionTestData.ts`

### Coordinate Systems

**Scene Coordinates**: 
- Absolute positions in the scene (e.g., 960, 540 for center of 1920×1080)
- Origin at top-left (0, 0)

**Camera Viewport**:
- Defined by camera position (0.0 to 1.0 normalized)
- Viewport size (default same as scene, can be smaller)
- Zoom factor (1.0 = no zoom, 2.0 = 2x magnification)

**Projected Coordinates**:
- Position on projection screen after scaling
- Accounts for camera viewport, zoom, and screen dimensions
- Used for final rendering

## Troubleshooting

### Page doesn't load
- Ensure dev server is running (`npm run dev`)
- Check console for errors
- Verify route is registered in `src/routes/index.tsx`

### Layers appear in wrong positions
- Check projection scale value (should be reasonable)
- Verify camera position is normalized (0.0-1.0)
- Inspect scene vs projected coordinates in debug panel

### All layers showing as visible when some should be hidden
- Verify test data layer positions
- Check camera viewport size and position
- Review visibility calculation in `isLayerVisibleInCamera()`

### Elements are double-scaled or too small
- Check if CSS transforms are being applied to already-scaled dimensions
- Verify `calculateProjectedLayerDimensions()` returns scaled values
- Ensure display scale is only applied to canvas container, not individual layers

## Integration with Backend

While this test page uses isolated data, the projection system is designed to work with real backend data:

1. **Backend sends**:
   - Scene with layers
   - Camera configuration
   - Projection screen dimensions

2. **Frontend calculates**:
   - Projection scale
   - Layer positions on screen
   - Layer dimensions
   - Visibility

3. **Used for**:
   - Preview generation
   - Video rendering
   - Export to different resolutions
   - Multi-camera views

The isolated test page helps validate the calculation logic independently of backend connectivity.

## Contributing

To add new test scenarios:

1. Edit `src/data/projectionTestData.ts`
2. Add a new `Scene` object with desired configuration
3. Add it to `allTestScenes` array
4. Document the expected behavior
5. Add corresponding Playwright test in `test/projection-system.spec.js`

## Support

For issues or questions:
- Check existing documentation in `/docs`
- Review `PROJECTION_SYSTEM_GUIDE.md`
- Check `PROJECTION_ALIGNMENT_FIX.md` for known issues
- Open an issue on GitHub with screenshots from the test page

---

**Last Updated**: 2025-10-31  
**Version**: 1.0.0
