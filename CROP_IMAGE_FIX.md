# Fix: Cropped Image Not Being Saved to Asset Library

## Problem Description

When users upload an image to the asset library through the crop modal:
- A crop box is displayed showing a 50% centered crop of the uploaded image
- If the user clicks "Apply Crop" without interacting with the crop box
- The full uncropped image is saved to the asset library instead of the visible cropped portion

## Root Cause

The issue was in the `ImageCropModal` component's `handleCropComplete` function:

1. The modal displays an initial crop box (50% of image, centered) using the `crop` state
2. The `completedCrop` state is only updated when ReactCrop's `onComplete` callback fires
3. The `onComplete` callback only fires after user interaction (dragging/resizing)
4. When user clicks "Apply Crop" without interaction, `completedCrop` remains `null`
5. The code checked `if (!completedCrop || ...)` and used the original uncropped image

## Solution

Modified the `handleCropComplete` function in `src/components/molecules/ImageCropModal.tsx`:

### Before
```typescript
if (!completedCrop || completedCrop.width === 0 || completedCrop.height === 0) {
  // Use original uncropped image
  finalImageUrl = imageUrl;
} else {
  // Crop using completedCrop
}
```

### After
```typescript
// Use completedCrop if available (user interacted with crop box),
// otherwise use the current crop state (initial 50% crop shown in modal)
const cropToUse = completedCrop || crop;

// Convert percentage crop to pixel crop if needed
let pixelCrop: PixelCrop;
if (cropToUse.unit === '%') {
  const percentCrop = cropToUse as PercentCrop;
  pixelCrop = {
    unit: 'px',
    x: (percentCrop.x / 100) * image.width,
    y: (percentCrop.y / 100) * image.height,
    width: (percentCrop.width / 100) * image.width,
    height: (percentCrop.height / 100) * image.height
  };
} else {
  pixelCrop = cropToUse as PixelCrop;
}

if (!pixelCrop || pixelCrop.width === 0 || pixelCrop.height === 0) {
  // Use original uncropped image
  finalImageUrl = imageUrl;
} else {
  // Crop using pixelCrop
  // Scale from displayed dimensions to natural dimensions
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // ... canvas drawing code
}
```

## Key Changes

1. **Fallback to `crop` state**: If `completedCrop` is null, use the `crop` state (initial 50% crop)
2. **Percentage to pixel conversion**: Added logic to convert percentage-based crops to pixel-based crops
3. **Proper scaling**: Maintained correct scaling from displayed dimensions to natural dimensions
4. **Explicit type casting**: Improved type safety with explicit casts

## Behavior Changes

### Before Fix
- **Without interaction**: Full uncropped image saved
- **With interaction**: Cropped image saved
- **"Use Full Image" button**: Full uncropped image saved ✓

### After Fix
- **Without interaction**: 50% centered crop saved (as shown in modal)
- **With interaction**: Cropped image saved (as adjusted by user)
- **"Use Full Image" button**: Full uncropped image saved ✓

## Testing Scenarios

1. **Upload image and immediately click "Apply Crop"**
   - Expected: 50% centered crop is saved
   - Previous: Full image was saved

2. **Upload image, adjust crop box, then click "Apply Crop"**
   - Expected: Adjusted crop is saved
   - Previous: Adjusted crop was saved ✓

3. **Upload image and click "Use Full Image"**
   - Expected: Full uncropped image is saved
   - Previous: Full uncropped image was saved ✓

## Technical Details

### Coordinate System Conversion

The fix properly handles coordinate system conversions:

1. **Crop state**: Percentage of displayed image (e.g., 50% width)
2. **Pixel crop**: Pixels in displayed image dimensions
3. **Canvas crop**: Pixels in natural image dimensions

Example for a 1600x1200 image displayed at 800x600:
- Initial crop: 50% width, 50% height, centered (25%, 25%)
- Displayed pixels: 400x300 at position (200, 150)
- Natural pixels: 800x600 at position (400, 300)
- Result: 800x600 cropped image (50% of 1600x1200)

### Code Flow

```
User uploads image
  ↓
ImageCropModal opens with initial 50% crop
  ↓
User sees crop box (50% of image, centered)
  ↓
User clicks "Apply Crop" (without interaction)
  ↓
handleCropComplete()
  ↓
cropToUse = completedCrop || crop  // Uses crop (initial state)
  ↓
Convert percentage to pixels (displayed dimensions)
  ↓
Scale pixels to natural dimensions
  ↓
Draw cropped portion to canvas
  ↓
Save cropped image to asset library
```

## Files Modified

- `src/components/molecules/ImageCropModal.tsx`: Updated `handleCropComplete` function

## Related Code

The fix is isolated to the `ImageCropModal` component. All consumers of this component continue to work without changes:

- `src/components/organisms/AssetLibrary.tsx`
- `src/components/organisms/LayerEditorModals.tsx`
- `src/components/HandWritingAnimation.tsx`
