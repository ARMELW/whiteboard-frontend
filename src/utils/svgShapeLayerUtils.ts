/**
 * SVG Shape Layer Utilities
 * Helper functions for creating layers from SVG shape assets
 */

import { v4 as uuidv4 } from 'uuid';
import { LayerType, LayerMode, Layer } from '@/app/scenes/types';
import type { ShapeAsset } from '@/app/shapes/api/shapesService';
import { calculateCameraRelativePosition, createDefaultCamera } from './cameraAnimator';

/**
 * Create a new layer from an SVG shape asset
 * @param shape - The shape asset to convert to a layer
 * @param currentLayersCount - Number of existing layers in the scene (for z-index)
 * @param options - Optional parameters for positioning
 * @returns A new layer object ready to be added to the scene
 */
export function createLayerFromShapeAsset(
  shape: ShapeAsset,
  currentLayersCount: number = 0,
  options?: {
    sceneWidth?: number;
    sceneHeight?: number;
    selectedCamera?: any;
    sceneCameras?: any[];
  }
): Layer {
  const sceneWidth = options?.sceneWidth || 1920;
  const sceneHeight = options?.sceneHeight || 1080;
  const sceneCameras = options?.sceneCameras || [];
  const selectedCamera = options?.selectedCamera;
  
  // Calculate camera center position
  let cameraCenterX = sceneWidth / 2;
  let cameraCenterY = sceneHeight / 2;
  let cameraZoom = 1;
  
  if (selectedCamera && selectedCamera.position) {
    cameraCenterX = selectedCamera.position.x * sceneWidth;
    cameraCenterY = selectedCamera.position.y * sceneHeight;
    cameraZoom = Math.max(0.1, selectedCamera.zoom || 1);
  }
  
  // Calculate shape dimensions with camera zoom
  const shapeWidth = (shape.width || 200) * cameraZoom;
  const shapeHeight = (shape.height || 200) * cameraZoom;
  
  // Center the shape at camera position
  const initialX = cameraCenterX - (shapeWidth / 2);
  const initialY = cameraCenterY - (shapeHeight / 2);
  
  // Calculate camera-relative position using DEFAULT camera (not selected camera)
  const defaultCamera = sceneCameras.find((cam: any) => cam.isDefault === true) || createDefaultCamera('16:9');
  const cameraPosition = calculateCameraRelativePosition(
    { x: initialX, y: initialY },
    defaultCamera,
    sceneWidth,
    sceneHeight
  );
  
  const layer: Layer = {
    id: uuidv4(),
    type: LayerType.SHAPE,
    name: shape.name,
    mode: LayerMode.DRAW,
    position: {
      x: initialX,
      y: initialY,
    },
    camera_position: cameraPosition,
    width: shape.width || 200,
    height: shape.height || 200,
    scale: cameraZoom,
    opacity: 1,
    rotation: 0,
    shape_config: {
      color: '#222222',
      fill_color: '#222222',
      stroke_width: 5,
    },
    z_index: currentLayersCount,
    skip_rate: 5,
    visible: true,
    locked: false,
    // SVG-specific properties (supported via Layer's index signature)
    svg_path: shape.url,
    svg_sampling_rate: 1,
    svg_reverse: false,
  };
  
  return layer;
}
