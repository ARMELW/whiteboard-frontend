# Multi-Camera Support - Quick Reference

## What's New

This update adds support for **multiple cameras** and **immense scenes** to the whiteboard animation editor.

## Key Features

### 🎥 Multiple Cameras
- Add unlimited cameras to a single scene
- Each camera captures a different viewport of the scene
- Cameras can be positioned, resized, and locked independently
- Automatic camera numbering (Camera 1, 2, 3...)

### 📐 Immense Scenes
- Scene dimensions up to 10000×10000 pixels
- Default remains 1920×1080 for compatibility
- Configurable via Scene Properties panel
- Perfect for complex animations with multiple zones

### 🎛️ Enhanced Controls
- Camera selector in header with count badge
- Quick add camera button
- Camera manager modal for advanced management
- Zoom controls for scene navigation
- Lock/unlock cameras to prevent accidental changes

## Quick Start

### Creating a Large Scene

1. Open **Scene Properties** panel
2. Find **"Scene Dimensions"** section
3. Set Width: `4000px` and Height: `2000px`
4. Build your scene with layers

### Adding Cameras

1. Click **"+ Camera"** button in header
2. Drag camera to desired position
3. Resize using corner handles
4. Lock when finalized

### Managing Cameras

1. Click **"Manage"** button in header
2. View all cameras with their properties
3. Edit names, zoom levels
4. Archive or delete unused cameras

## Visual Example

```
┌─────────────────────────────────────────────────────────────┐
│                    Immense Scene (6000×2000)                │
│                                                             │
│  ┌──────────────┐      ┌──────────┐      ┌──────────────┐ │
│  │   Camera 1   │      │ Camera 2 │      │   Camera 3   │ │
│  │              │      │          │      │              │ │
│  │  Main View   │      │  Detail  │      │  Close-up    │ │
│  │              │      │   View   │      │              │ │
│  └──────────────┘      └──────────┘      └──────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Use Cases

- **Zoom Animations:** Start wide, zoom to details
- **Multi-Angle:** Show subject from different perspectives
- **Story Zones:** Different areas for different story parts
- **Picture-in-Picture:** Main view with detail insets

## Documentation

See [MULTI_CAMERA_GUIDE.md](./MULTI_CAMERA_GUIDE.md) for complete documentation.

## Technical Details

### Modified Files
- `src/app/scenes/types.ts` - Added sceneWidth/sceneHeight
- `src/components/organisms/SceneCanvas.tsx` - Dynamic scene dimensions
- `src/components/molecules/canvas/KonvaCamera.tsx` - Camera labels
- `src/components/molecules/scene/ScenePropertiesForm.tsx` - Dimension controls
- `src/components/organisms/AnimationHeader.tsx` - Camera controls
- `src/components/organisms/CameraManagerModal.tsx` - Enhanced UI

### API Changes
- Scene payload now accepts optional `sceneWidth` and `sceneHeight`
- Default values: 1920×1080 (backward compatible)
- Camera numbering starts from 1 (excluding default camera)

## Screenshots

*(Screenshots to be added)*

---

**Feature Status:** ✅ Complete  
**Version:** 1.0  
**Date:** October 2025
