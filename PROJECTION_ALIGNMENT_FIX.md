# Projection Alignment Fix

## Issue Description
The projection viewer was displaying objects in incorrect positions and scales compared to the editor view. Objects appeared misaligned and smaller than expected.

## Root Cause Analysis

### The Problem
In `src/components/organisms/ProjectionViewer.tsx`, a **double-scaling** issue was occurring:

1. **First Scale**: The `projectionCalculator` correctly computed projected positions and dimensions for layers based on camera viewport and screen dimensions
2. **Second Scale (Bug)**: The `ProjectionViewer` component then applied an additional `displayScale` to these already-projected coordinates

### Code Example (Before Fix)
```typescript
// Line 168 - Calculated a display scale
const displayScale = Math.min(screenWidth, 1200) / screenWidth;

// Lines 177-180 - Applied this scale AGAIN to already-projected values
style={{
  left: layer.position.x * displayScale,  // ❌ Double scaling
  top: layer.position.y * displayScale,   // ❌ Double scaling
  width: layer.width * displayScale,      // ❌ Double scaling
  height: layer.height * displayScale,    // ❌ Double scaling
}}
```

### Why This Caused Misalignment

The `projectionCalculator` already:
- Calculates the correct scale factor based on camera and screen dimensions
- Transforms layer positions from scene coordinates to screen coordinates
- Accounts for camera viewport offset
- Centers the projection if needed

When the viewer applied another scale factor, it compressed everything further, causing:
- Objects to appear smaller than they should
- Positions to be offset incorrectly
- Misalignment between editor and projection views

## The Fix

### Solution Approach
Instead of applying a second scale to coordinates, we now:
1. Use the projected coordinates **directly** without modification
2. Apply CSS `transform: scale()` to the **entire canvas container** when needed to fit in the viewer
3. Use a wrapper div to handle the scaled dimensions properly in the DOM

### Code After Fix
```typescript
// Calculate display scale for the entire canvas (not individual layers)
const maxDisplayWidth = 1200;
const maxDisplayHeight = 675;
const displayScale = Math.min(
  1, // Don't scale up, only scale down
  maxDisplayWidth / screenWidth,
  maxDisplayHeight / screenHeight
);

// Wrapper to handle scaled dimensions
<div style={{
  width: screenWidth * displayScale,
  height: screenHeight * displayScale,
  position: 'relative'
}}>
  {/* Canvas with CSS transform for uniform scaling */}
  <div style={{ 
    width: screenWidth,
    height: screenHeight,
    transform: `scale(${displayScale})`,
    transformOrigin: 'top left'
  }}>
    {/* Layers use projected coordinates directly */}
    {projectedLayers.map(layer => (
      <div style={{
        left: layer.position.x,      // ✅ Direct use
        top: layer.position.y,       // ✅ Direct use
        width: layer.width,          // ✅ Direct use
        height: layer.height,        // ✅ Direct use
      }}>
    ))}
  </div>
</div>
```

## Benefits of This Fix

✅ **Correct Positioning**: Objects now appear in their exact calculated positions  
✅ **Correct Scaling**: Objects maintain their proper sizes  
✅ **Uniform Scaling**: The entire canvas scales uniformly when needed to fit the viewer  
✅ **Maintains Proportions**: CSS transform preserves the aspect ratio and relationships between elements  
✅ **No Math Errors**: Eliminates the compound scaling error  

## Technical Details

### Projection Pipeline (Correct Flow)

1. **Scene Coordinates** (editor)
   - Layer position: `(x, y)` in scene pixels
   - Example: `(500, 300)` in a 1920×1080 scene

2. **Camera Viewport**
   - Camera position: `(0.5, 0.5)` normalized (center)
   - Camera size: `800×450` pixels
   - Viewport top-left: `(560, 315)` in scene coordinates

3. **Relative to Camera**
   - Layer relative to viewport: `(500 - 560, 300 - 315) = (-60, -15)`

4. **Projection Scale**
   - Screen size: `1920×1080`
   - Camera size: `800×450`
   - Scale: `min(1920/800, 1080/450) = min(2.4, 2.4) = 2.4`

5. **Projected Position**
   - Scaled position: `(-60 * 2.4, -15 * 2.4) = (-144, -36)`
   - With centering offset: actual screen position

6. **Display (CSS Transform)**
   - If screen is too large for viewer, apply uniform CSS scale
   - Example: If 1920×1080 doesn't fit, scale entire canvas to 1200×675
   - Display scale: `1200/1920 = 0.625`
   - **Important**: This is applied via CSS, not to coordinates

### Why CSS Transform Works

CSS `transform: scale()` is applied **after** layout calculations:
- Coordinates remain in their original coordinate system
- The browser handles the visual scaling
- No compound math errors
- Aspect ratios are preserved
- Transforms don't affect DOM layout (wrapper div handles that)

## Testing Recommendations

To verify this fix works correctly:

1. **Basic Alignment Test**
   - Place objects in specific positions in the editor
   - Open the projection viewer
   - Verify objects appear in the same relative positions

2. **Multi-Resolution Test**
   - Test with different projection resolutions (SD, HD, Full HD, 4K)
   - Verify objects maintain correct proportions
   - Check that objects don't shrink or move unexpectedly

3. **Camera Viewport Test**
   - Move the camera in the editor
   - Verify projection updates correctly
   - Check objects outside viewport are hidden

4. **Edge Cases**
   - Objects at scene boundaries
   - Very small or very large objects
   - Rotated objects
   - Objects with transparency

## Files Modified

- `src/components/organisms/ProjectionViewer.tsx`
  - Removed double-scaling bug
  - Added proper CSS transform scaling
  - Added wrapper div for scaled dimensions
  - Updated canvas size display text

## Related Documentation

- `PROJECTION_SYSTEM_GUIDE.md` - Complete projection system documentation
- `src/utils/projectionCalculator.ts` - Projection calculation logic
- `src/hooks/useProjection.ts` - Projection hooks

## Version History

- **Date**: 2025-10-31
- **Issue**: Projection alignment incorrect
- **Status**: ✅ Fixed
- **Severity**: High (visual accuracy critical)
