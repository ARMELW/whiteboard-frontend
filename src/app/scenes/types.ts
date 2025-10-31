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

export interface ScenePayload {
  projectId?: string;
  title?: string;
  content?: string;
  duration?: number;
  animation?: string;
  backgroundImage?: string | null;
  sceneImage?: string | null;
  layers?: Layer[];
  cameras?: Camera[];
  sceneCameras?: Camera[];
  multiTimeline?: MultiTimeline;
  audio?: AudioConfig;
  sceneAudio?: SceneAudioConfig | null;
  transition_type?: string;
  dragging_speed?: number;
  slide_duration?: number;
  sync_slide_with_voice?: boolean;
  sceneWidth?: number;
  sceneHeight?: number;
}
