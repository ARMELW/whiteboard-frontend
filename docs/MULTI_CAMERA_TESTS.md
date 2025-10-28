# Multi-Camera Test Scenarios

This file contains test scenarios to validate the multi-camera implementation.

## Test 1: Basic Scene Dimension Configuration

**Objective:** Verify that scene dimensions can be configured and applied correctly.

### Steps:
1. Open the application
2. Create a new scene
3. Navigate to Scene Properties panel
4. Change scene dimensions to 3840 × 2160
5. Verify canvas resizes accordingly

**Expected Result:**
- Scene width input shows 3840
- Scene height input shows 2160
- Canvas displays at calculated zoom to fit viewport
- Layers can be positioned anywhere within 3840 × 2160 space

## Test 2: Adding Multiple Cameras

**Objective:** Verify that multiple cameras can be added and managed.

### Steps:
1. Open a scene
2. Click "+ Caméra" button in header
3. Verify Camera 1 appears on canvas
4. Click "+ Caméra" again
5. Verify Camera 2 appears on canvas
6. Check camera count badge shows "2 caméras"

**Expected Result:**
- Each new camera has a unique ID
- Cameras are numbered sequentially (Camera 1, Camera 2, Camera 3...)
- Count badge updates correctly
- Each camera displays its name label on the canvas

## Test 3: Camera Positioning and Resizing

**Objective:** Verify camera manipulation works correctly.

### Steps:
1. Add a new camera
2. Click and drag the camera to move it
3. Click corner handles and drag to resize
4. Verify camera stays within scene bounds

**Expected Result:**
- Camera moves smoothly with mouse
- Camera resizes maintaining aspect ratio
- Minimum size constraint (100×100) is enforced
- Position is clamped to scene boundaries (0-100%)

## Test 4: Camera Selection and Locking

**Objective:** Verify camera selection and lock/unlock functionality.

### Steps:
1. Add two cameras
2. Click on Camera 1 - verify it's selected (pink border)
3. Click lock button in header
4. Try to move Camera 1 - verify it cannot be moved
5. Click unlock button
6. Verify Camera 1 can be moved again

**Expected Result:**
- Selected camera has solid pink border (#ec4899)
- Locked cameras cannot be dragged or resized
- Lock icon shows in button when locked
- Default camera is always locked and cannot be unlocked

## Test 5: Camera Manager

**Objective:** Verify camera manager functionality.

### Steps:
1. Add 3 cameras with different positions/sizes
2. Click "Gérer" button to open Camera Manager
3. Edit Camera 1 name to "Vue Principale"
4. Change Camera 2 zoom to 1.5
5. Archive Camera 3
6. Click "Enregistrer"

**Expected Result:**
- Camera Manager shows all cameras with their properties
- Name changes are reflected in camera label
- Zoom changes are applied to camera
- Archived camera appears faded in manager
- Changes persist after closing manager

## Test 6: Large Scene with Multiple Cameras

**Objective:** Test full workflow with immense scene and multiple cameras.

### Steps:
1. Create new scene
2. Set dimensions to 6000 × 3000
3. Add several layers (images/text) across the scene
4. Add Camera 1 at position (25%, 50%)
5. Add Camera 2 at position (50%, 50%)
6. Add Camera 3 at position (75%, 50%)
7. Resize each camera to frame different content
8. Use zoom controls to navigate the scene
9. Save the scene

**Expected Result:**
- Scene supports 6000 × 3000 dimensions
- All 3 cameras are positioned correctly
- Each camera frames different content
- Scene zoom allows navigation of large canvas
- Scene saves with all camera configurations

## Test 7: Camera Deletion

**Objective:** Verify camera deletion works correctly.

### Steps:
1. Add 2 cameras
2. Open Camera Manager
3. Try to delete default camera - should show alert
4. Delete Camera 1 - confirm deletion
5. Verify Camera 1 is removed from canvas
6. Verify camera count badge updates

**Expected Result:**
- Default camera cannot be deleted (alert shown)
- Confirmation dialog appears for camera deletion
- Deleted camera is removed from scene
- Camera count badge decrements
- Remaining cameras remain functional

## Test 8: Backward Compatibility

**Objective:** Verify existing scenes without dimensions work correctly.

### Steps:
1. Load an existing scene (without sceneWidth/sceneHeight)
2. Verify scene defaults to 1920 × 1080
3. Add a camera
4. Verify everything works normally

**Expected Result:**
- Scene dimensions default to 1920 × 1080
- Camera system works as expected
- No errors or warnings in console

## Test 9: Responsive Header Controls

**Objective:** Verify header camera controls adapt to screen size.

### Steps:
1. Resize browser window to narrow width
2. Verify camera controls remain visible and functional
3. Verify some text labels hide on mobile (using hidden md:inline)

**Expected Result:**
- Controls stack appropriately on narrow screens
- Essential buttons remain accessible
- Camera selector remains usable

## Test 10: Performance with Many Cameras

**Objective:** Verify performance with maximum realistic camera count.

### Steps:
1. Create scene with dimensions 5000 × 3000
2. Add 10 cameras at various positions
3. Select and move different cameras
4. Open camera manager
5. Navigate the canvas with zoom

**Expected Result:**
- No noticeable lag when selecting/moving cameras
- Camera Manager loads quickly with 10 cameras
- Canvas zoom/pan remains smooth
- Memory usage stays reasonable (< 500MB)

## Automated Test Coverage

The following aspects should be covered by unit/integration tests:

### Type Safety
- ✅ Scene interface includes optional sceneWidth/sceneHeight
- ✅ ScenePayload interface includes optional sceneWidth/sceneHeight
- ✅ Camera interface properly typed

### Component Behavior
- ✅ SceneCanvas uses scene dimensions or defaults to 1920×1080
- ✅ KonvaCamera displays camera name label
- ✅ Camera numbering skips default camera
- ✅ AnimationHeader shows camera count badge

### Data Validation
- ✅ Scene dimensions minimum: 1920 × 1080
- ✅ Scene dimensions maximum: 10000 × 10000
- ✅ Camera minimum size: 100 × 100
- ✅ Camera position clamped to 0-1 range

## Known Issues / Limitations

1. **Maximum Scene Size:** While 10000×10000 is technically supported, performance may degrade on lower-end devices
2. **Camera Minimum Size:** 100×100 pixels is enforced but may be too large for some use cases
3. **Default Camera:** Cannot be deleted or unlocked - this is by design but may confuse some users
4. **Camera Animation:** Camera sequence editor not yet updated for new multi-camera system
5. **Export:** Video export may need optimization for large scenes

## Future Enhancements

- [ ] Add camera presets (16:9, 4:3, 1:1, etc.)
- [ ] Add camera duplication feature
- [ ] Add camera grouping/layers
- [ ] Optimize rendering for very large scenes
- [ ] Add camera animation timeline integration
- [ ] Add camera viewport preview thumbnails
- [ ] Add keyboard shortcuts for camera operations
- [ ] Add camera position snapping/guides

---

**Last Updated:** October 2025  
**Test Coverage:** Manual Testing Required  
**Status:** Ready for QA
