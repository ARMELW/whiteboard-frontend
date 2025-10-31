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
 * Maintains aspect ratio.
 * Note: sceneWidth/sceneHeight here represents the area CAPTURED by the camera.
 */
export const calculateProjectionScale = (
  capturedWidth: number,
  capturedHeight: number,
  screenWidth: number,
  screenHeight: number,
  cameraZoom: number = 1 // New parameter to factor in camera zoom
): number => {
  // Adjust captured dimensions by the zoom factor. Higher zoom means smaller captured area (division).
  // This effectively magnifies the content.
  const effectiveCapturedWidth = capturedWidth / cameraZoom;
  const effectiveCapturedHeight = capturedHeight / cameraZoom;

  const scaleX = screenWidth / effectiveCapturedWidth;
  const scaleY = screenHeight / effectiveCapturedHeight;
  
  // Use minimum scale to ensure entire captured area fits (letterboxing/pillarboxing)
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
  const cameraZoom = camera.zoom || 1; // Get zoom factor
  
  // --- Correction pour la position de la caméra ---
  // Assurer que la position de la caméra a une valeur par défaut de 0.5 (centre) si elle manque.
  const cameraCenterX = camera.position?.x ?? 0.5;
  const cameraCenterY = camera.position?.y ?? 0.5;
  // ----------------------------------------------


  // Use pre-calculated camera_position if available (preferred)
  // This ensures consistency with backend calculations. camera_position is the layer's
  // top-left position relative to the camera's top-left viewport corner.
  let relativeX: number;
  let relativeY: number;
  
  // Define the effective camera viewport width/height
  const effectiveCameraWidth = cameraWidth / cameraZoom;
  const effectiveCameraHeight = cameraHeight / cameraZoom;
  
  if (layer.camera_position != null && 
      typeof layer.camera_position.x === 'number' && 
      typeof layer.camera_position.y === 'number') {
    // Path 1: Use authoritative camera-relative position from backend
    // NOTE: We assume layer.camera_position.x/y represents the LAYER'S TOP-LEFT relative to the CAMERA'S TOP-LEFT.
    relativeX = layer.camera_position.x;
    relativeY = layer.camera_position.y;
  } else {
    // Path 2: Fallback - Calculate position relative to camera from absolute scene coordinates.
    
    // 1. Calculate layer's true dimensions in scene space (needed for Center -> Top-Left conversion)
    const layerSceneWidth = (layer.width || 0) * (layer.scale || 1);
    const layerSceneHeight = (layer.height || 0) * (layer.scale || 1);

    // 2. Assume layer.position (layer.position.x/y) is the CENTER, convert to TOP-LEFT
    const layerTLX = layer.position.x - (layerSceneWidth / 2);
    const layerTLY = layer.position.y - (layerSceneHeight / 2);
    
    // 3. Calculate camera viewport's top-left corner in scene coordinates
    // cameraCenterX/Y is the camera's CENTER point (0.0 to 1.0 of sceneWidth/Height)
    const cameraViewportX = (cameraCenterX * sceneWidth) - (effectiveCameraWidth / 2); // Utilisation de cameraCenterX
    const cameraViewportY = (cameraCenterY * sceneHeight) - (effectiveCameraHeight / 2); // Utilisation de cameraCenterY
    
    // 4. Get layer position (top-left) relative to camera's top-left
    relativeX = layerTLX - cameraViewportX; // Use layerTLX (Top-Left)
    relativeY = layerTLY - cameraViewportY; // Use layerTLY (Top-Left)
  }
  
  // Calculate projection scale, passing the zoom factor
  const projectionScale = calculateProjectionScale(
    cameraWidth, // Passed as "capturedWidth"
    cameraHeight, // Passed as "capturedHeight"
    screenWidth,
    screenHeight,
    cameraZoom
  );
  
  // Project onto screen (gives top-left corner position)
  const projectedX = relativeX * projectionScale;
  const projectedY = relativeY * projectionScale;
  
  // Center the projection if screen is larger than needed (letterboxing/pillarboxing)
  const scaledCameraWidth = effectiveCameraWidth * projectionScale;
  const scaledCameraHeight = effectiveCameraHeight * projectionScale;
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
  const cameraZoom = camera.zoom || 1; // Get zoom factor

  // Projection scale must be uniform for both width and height to ensure proportionality.
  const projectionScale = calculateProjectionScale(
    cameraWidth,
    cameraHeight,
    screenWidth,
    screenHeight,
    cameraZoom
  );
  
  // Calculate layer dimensions in scene space (base dimensions × layer scale)
  const layerWidth = (layer.width || 0) * (layer.scale || 1);
  const layerHeight = (layer.height || 0) * (layer.scale || 1);
  
  return {
    // Apply projection scale to get final projected dimensions on screen
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
  const cameraZoom = camera.zoom || 1; // Get zoom factor
  
  // --- Correction pour la position de la caméra ---
  const cameraCenterX = camera.position?.x ?? 0.5;
  const cameraCenterY = camera.position?.y ?? 0.5;
  // ----------------------------------------------

  // Calculate the effective width/height of the captured area
  const effectiveCameraWidth = cameraWidth / cameraZoom;
  const effectiveCameraHeight = cameraHeight / cameraZoom;

  // Calculate camera viewport bounds (Top-Left and Bottom-Right)
  // Camera center position minus half the effective width/height
  const cameraViewportX = (cameraCenterX * sceneWidth) - (effectiveCameraWidth / 2);
  const cameraViewportY = (cameraCenterY * sceneHeight) - (effectiveCameraHeight / 2);
  const cameraViewportRight = cameraViewportX + effectiveCameraWidth;
  const cameraViewportBottom = cameraViewportY + effectiveCameraHeight;
  
  // Calculate layer bounds (Top-Left and Bottom-Right)
  // NOTE: Assuming layer.position is the CENTER, we adjust to Top-Left for visibility check
  const layerWidth = (layer.width || 0) * (layer.scale || 1);
  const layerHeight = (layer.height || 0) * (layer.scale || 1);
  const layerTLX = layer.position.x - (layerWidth / 2);
  const layerTLY = layer.position.y - (layerHeight / 2);

  const layerRight = layerTLX + layerWidth;
  const layerBottom = layerTLY + layerHeight;
  
  // Check for overlap (layer is visible if it overlaps with camera viewport)
  // This uses Axis-Aligned Bounding Box (AABB) checking.
  const isOverlapping = !(
    layerTLX > cameraViewportRight ||
    layerRight < cameraViewportX ||
    layerTLY > cameraViewportBottom ||
    layerBottom < cameraViewportY
  );
  
  return isOverlapping && (layer.visible !== false) && (layer.opacity || 1) > 0;
};

/**
 * Project all layers for a scene onto the projection screen
 *
 * NOTE: This function calculates the TOP-LEFT position for CSS rendering.
 * The center-to-top-left conversion is now handled in calculateProjectedLayerPosition (fallback path)
 * or assumed to be handled by layer.camera_position (authoritative path).
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
    
    // La position 'position' est déjà le Top-Left projeté. Aucune correction supplémentaire nécessaire ici.

    return {
      id: layer.id,
      position, // C'est le coin Top-Left projeté
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
