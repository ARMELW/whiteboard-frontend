/**
 * Projection Calculator Utility
 * Calculates element positions and dimensions for a given projection screen
 */

import type { Position, Layer, Camera } from '@/app/scenes/types';

export interface ProjectionDimensions {
  width: number;
  height: number;
}

export interface ProjectedPosition {
  x: number;
  y: number;
}

export interface ProjectedLayer {
  id: string;
  position: ProjectedPosition;
  width: number;
  height: number;
  scale: number;
  opacity: number;
  rotation?: number;
  isVisible: boolean; // Whether layer is visible in camera viewport
}

/**
 * Calculate scale factor to fit scene into projection screen
 * Maintains aspect ratio
 */
export const calculateProjectionScale = (
  sceneWidth: number,
  sceneHeight: number,
  screenWidth: number,
  screenHeight: number
): number => {
  const scaleX = screenWidth / sceneWidth;
  const scaleY = screenHeight / sceneHeight;
  
  // Use minimum scale to ensure entire scene fits
  return Math.min(scaleX, scaleY);
};

/**
 * Calculate projected position for a layer on the projection screen
 * Takes into account camera viewport and projection screen dimensions
 */
export const calculateProjectedLayerPosition = (
  layer: Layer,
  camera: Camera,
  sceneWidth: number,
  sceneHeight: number,
  screenWidth: number,
  screenHeight: number
): ProjectedPosition => {
  // Use pre-calculated camera_position if available (preferred)
  // This ensures consistency with backend calculations
  let relativeX: number;
  let relativeY: number;
  
  if (layer.camera_position !== undefined) {
    // Use authoritative camera-relative position from backend
    relativeX = layer.camera_position.x;
    relativeY = layer.camera_position.y;
  } else {
    // Fallback: Calculate camera viewport in scene coordinates
    const cameraViewportX = (camera.position.x * sceneWidth) - (camera.width / 2);
    const cameraViewportY = (camera.position.y * sceneHeight) - (camera.height / 2);
    
    // Get layer position relative to camera
    relativeX = layer.position.x - cameraViewportX;
    relativeY = layer.position.y - cameraViewportY;
  }
  
  // Calculate projection scale
  const projectionScale = calculateProjectionScale(
    camera.width,
    camera.height,
    screenWidth,
    screenHeight
  );
  
  // Project onto screen
  const projectedX = relativeX * projectionScale;
  const projectedY = relativeY * projectionScale;
  
  // Center the projection if screen is larger than needed
  const scaledCameraWidth = camera.width * projectionScale;
  const scaledCameraHeight = camera.height * projectionScale;
  const offsetX = (screenWidth - scaledCameraWidth) / 2;
  const offsetY = (screenHeight - scaledCameraHeight) / 2;
  
  return {
    x: projectedX + offsetX,
    y: projectedY + offsetY
  };
};

/**
 * Calculate projected dimensions for a layer
 */
export const calculateProjectedLayerDimensions = (
  layer: Layer,
  camera: Camera,
  sceneWidth: number,
  sceneHeight: number,
  screenWidth: number,
  screenHeight: number
): ProjectionDimensions => {
  const projectionScale = calculateProjectionScale(
    camera.width,
    camera.height,
    screenWidth,
    screenHeight
  );
  
  const layerWidth = (layer.width || 0) * (layer.scale || 1);
  const layerHeight = (layer.height || 0) * (layer.scale || 1);
  
  return {
    width: layerWidth * projectionScale,
    height: layerHeight * projectionScale
  };
};

/**
 * Check if a layer is visible in the camera viewport
 */
export const isLayerVisibleInCamera = (
  layer: Layer,
  camera: Camera,
  sceneWidth: number,
  sceneHeight: number
): boolean => {
  // Calculate camera viewport bounds
  const cameraViewportX = (camera.position.x * sceneWidth) - (camera.width / 2);
  const cameraViewportY = (camera.position.y * sceneHeight) - (camera.height / 2);
  const cameraViewportRight = cameraViewportX + camera.width;
  const cameraViewportBottom = cameraViewportY + camera.height;
  
  // Calculate layer bounds
  const layerWidth = (layer.width || 0) * (layer.scale || 1);
  const layerHeight = (layer.height || 0) * (layer.scale || 1);
  const layerRight = layer.position.x + layerWidth;
  const layerBottom = layer.position.y + layerHeight;
  
  // Check for overlap (layer is visible if it overlaps with camera viewport)
  const isOverlapping = !(
    layer.position.x > cameraViewportRight ||
    layerRight < cameraViewportX ||
    layer.position.y > cameraViewportBottom ||
    layerBottom < cameraViewportY
  );
  
  return isOverlapping && (layer.visible !== false) && (layer.opacity || 1) > 0;
};

/**
 * Project all layers for a scene onto the projection screen
 */
export const projectLayersToScreen = (
  layers: Layer[],
  camera: Camera,
  sceneWidth: number,
  sceneHeight: number,
  screenWidth: number,
  screenHeight: number
): ProjectedLayer[] => {
  return layers.map(layer => {
    const position = calculateProjectedLayerPosition(
      layer,
      camera,
      sceneWidth,
      sceneHeight,
      screenWidth,
      screenHeight
    );
    
    const dimensions = calculateProjectedLayerDimensions(
      layer,
      camera,
      sceneWidth,
      sceneHeight,
      screenWidth,
      screenHeight
    );
    
    const isVisible = isLayerVisibleInCamera(
      layer,
      camera,
      sceneWidth,
      sceneHeight
    );
    
    return {
      id: layer.id,
      position,
      width: dimensions.width,
      height: dimensions.height,
      scale: layer.scale || 1,
      opacity: layer.opacity || 1,
      rotation: layer.rotation,
      isVisible
    };
  });
};

/**
 * Get projection screen dimensions from store or use defaults
 */
export const getProjectionScreenDimensions = (
  projectionScreenWidth?: number,
  projectionScreenHeight?: number
): ProjectionDimensions => {
  return {
    width: projectionScreenWidth || 1920,
    height: projectionScreenHeight || 1080
  };
};

export default {
  calculateProjectionScale,
  calculateProjectedLayerPosition,
  calculateProjectedLayerDimensions,
  isLayerVisibleInCamera,
  projectLayersToScreen,
  getProjectionScreenDimensions
};
