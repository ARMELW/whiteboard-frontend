/**
 * Projection Calculator Utility
 * Calculates element positions and dimensions for a given projection screen
 */

// --- ENUMS AND TYPE DEFINITIONS (Self-Contained) ---

export enum SceneAnimationType {
  FADE = 'fade',
  SLIDE = 'slide',
  ZOOM = 'zoom',
  NONE = 'none',
}

export enum LayerType {
  IMAGE = 'image',
  TEXT = 'text',
  SHAPE = 'shape',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export enum LayerMode {
  DRAW = 'draw',
  STATIC = 'static',
  ANIMATED = 'animated',
}

export enum CameraMovementType {
  STATIC = 'static',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out',
  PAN_LEFT = 'pan_left',
  PAN_RIGHT = 'pan_right',
  PAN_UP = 'pan_up',
  PAN_DOWN = 'pan_down',
  FOCUS_POINT = 'focus_point',
  CIRCULAR = 'circular',
  CUSTOM = 'custom',
}

export enum CameraEasing {
  LINEAR = 'linear',
  EASE_IN = 'ease_in',
  EASE_OUT = 'ease_out',
  EASE_IN_OUT = 'ease_in_out',
  BOUNCE = 'bounce',
  ELASTIC = 'elastic',
}

export interface Position {
  x: number;
  y: number;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  mode: LayerMode;
  position: Position;
  camera_position?: Position;
  width: number;
  height: number;
  z_index: number;
  scale: number;
  opacity: number;
  rotation?: number;
  skip_rate?: number;
  image_path?: string;
  text?: string;
  text_config?: any;
  shape_config?: any;
  locked?: boolean;
  visible?: boolean;
  animation_type?: string;
  animation_speed?: number;
  end_delay?: number;
  hand_type?: string;
  cachedImage?: string | null;
  [key: string]: any;
}

export interface CameraKeyframe {
  time: number;
  position: Position;
  zoom: number;
  easing?: CameraEasing;
}

export interface CameraSequence {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  keyframes: CameraKeyframe[];
  movementType: CameraMovementType;
  easing: CameraEasing;
}

export interface CameraAnimation {
  sequences: CameraSequence[];
  [key: string]: any;
}

export interface Camera {
  id: string;
  name: string;
  position: Position;
  scale?: number;
  zoom?: number;
  width?: number;
  height?: number;
  animation?: CameraAnimation;
  locked?: boolean;
  isDefault?: boolean;
  duration?: number;
  transition_duration?: number;
  easing?: string;
  pauseDuration?: number;
  movementType?: string;
  [key: string]: any;
}

export interface MultiTimeline {
  cameraSequences?: CameraSequence[];
  [key: string]: any;
}

export interface SceneAudioConfig {
  fileId: string;
  fileName: string;
  fileUrl: string;
  volume: number;
  duration: number;
}

export interface AudioConfig {
  [key: string]: any;
}

export interface Scene {
  id: string;
  projectId: string;
  title: string;
  content: string;
  duration: number;
  animation: string;
  backgroundImage: string | null;
  backgroundColor?: string;
  sceneImage?: string | null;
  layers: Layer[];
  cameras: Camera[];
  sceneCameras: Camera[];
  multiTimeline: MultiTimeline;
  audio: AudioConfig;
  sceneAudio?: SceneAudioConfig | null;
  createdAt: string;
  updatedAt: string;
  transition_type?: string;
  dragging_speed?: number;
  slide_duration?: number;
  sync_slide_with_voice?: boolean;
  sceneWidth?: number;
  sceneHeight?: number;
}


// --- PROJECTION INTERFACES ---

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


// --- PROJECTION FUNCTIONS ---

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
  // Use scene dimensions as fallback if camera dimensions are not set
  const cameraWidth = camera.width || sceneWidth;
  const cameraHeight = camera.height || sceneHeight;
  
  // Use pre-calculated camera_position if available (preferred)
  // This ensures consistency with backend calculations. camera_position is the layer's
  // top-left position relative to the camera's top-left viewport corner.
  let relativeX: number;
  let relativeY: number;
  
  if (layer.camera_position != null && 
      typeof layer.camera_position.x === 'number' && 
      typeof layer.camera_position.y === 'number') {
    // Use authoritative camera-relative position from backend
    relativeX = layer.camera_position.x;
    relativeY = layer.camera_position.y;
  } else {
    // Fallback: Calculate camera viewport's top-left corner in scene coordinates
    // camera.position.x/y is the camera's center point expressed as a percentage of scene width/height (0.0 to 1.0)
    const cameraViewportX = (camera.position.x * sceneWidth) - (cameraWidth / 2);
    const cameraViewportY = (camera.position.y * sceneHeight) - (cameraHeight / 2);
    
    // Get layer position (top-left) relative to camera's top-left
    relativeX = layer.position.x - cameraViewportX;
    relativeY = layer.position.y - cameraViewportY;
  }
  
  // Calculate projection scale
  const projectionScale = calculateProjectionScale(
    cameraWidth,
    cameraHeight,
    screenWidth,
    screenHeight
  );
  
  // Project onto screen (gives top-left corner position)
  const projectedX = relativeX * projectionScale;
  const projectedY = relativeY * projectionScale;
  
  // Center the projection if screen is larger than needed (letterboxing/pillarboxing)
  const scaledCameraWidth = cameraWidth * projectionScale;
  const scaledCameraHeight = cameraHeight * projectionScale;
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
  // Use scene dimensions as fallback if camera dimensions are not set
  const cameraWidth = camera.width || sceneWidth;
  const cameraHeight = camera.height || sceneHeight;
  
  const projectionScale = calculateProjectionScale(
    cameraWidth,
    cameraHeight,
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
  // Use scene dimensions as fallback if camera dimensions are not set
  const cameraWidth = camera.width || sceneWidth;
  const cameraHeight = camera.height || sceneHeight;
  
  // Calculate camera viewport bounds (Top-Left and Bottom-Right)
  const cameraViewportX = (camera.position.x * sceneWidth) - (cameraWidth / 2);
  const cameraViewportY = (camera.position.y * sceneHeight) - (cameraHeight / 2);
  const cameraViewportRight = cameraViewportX + cameraWidth;
  const cameraViewportBottom = cameraViewportY + cameraHeight;
  
  // Calculate layer bounds (Top-Left and Bottom-Right)
  const layerWidth = (layer.width || 0) * (layer.scale || 1);
  const layerHeight = (layer.height || 0) * (layer.scale || 1);
  const layerRight = layer.position.x + layerWidth;
  const layerBottom = layer.position.y + layerHeight;
  
  // Check for overlap (layer is visible if it overlaps with camera viewport)
  // This uses Axis-Aligned Bounding Box (AABB) checking.
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
 *
 * NOTE: THIS FUNCTION APPLIES A CORRECTION TO THE POSITION (x, y) BY SUBTRACTING
 * HALF OF THE PROJECTED WIDTH/HEIGHT. This assumes the rendering engine uses 
 * CENTER-ANCHORING for all elements. If your renderer uses TOP-LEFT-ANCHORING,
 * this correction should be REMOVED.
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
    
    // --- CORRECTION D'ANCRAGE SÉLECTIVE ---
    // Applique la correction de Top-Left vers Centre UNIQUEMENT pour le texte,
    // car le moteur de rendu gère les images différemment (Haut-Gauche).
    if (layer.type === LayerType.TEXT) {
      const centerXAdjusted = position.x - (dimensions.width / 2);
      const centerYAdjusted = position.y - (dimensions.height / 2);
      position.x = centerXAdjusted;
      position.y = centerYAdjusted;
    }
    // ------------------------------------

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
