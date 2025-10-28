// Storage keys are deprecated - data is now managed by React Query
// These constants are kept for backward compatibility only
export const STORAGE_KEYS = {
  SCENES: 'whiteboard-scenes',        // Deprecated: Use React Query
  PROJECTS: 'whiteboard-projects',    // Deprecated: Use React Query
  ASSETS: 'whiteboard-assets',        // Deprecated: Use React Query
  ASSET_CACHE: 'whiteboard-asset-cache', // Deprecated
  SETTINGS: 'whiteboard-settings',    // Still used for UI preferences
  TEMPLATES: 'whiteboard-templates',  // Still used for templates
} as const;

export const DEFAULT_IDS = {
  PROJECT: 'default-project',
  USER: 'user_123',
  CHANNEL: 'chn_456',
} as const;

export const DEFAULT_SCENE_DURATION = 5;

export const ANIMATION_TYPES = [
  'fade',
  'slide',
  'zoom',
  'none',
] as const;

export const EXPORT_FORMATS = {
  JSON: 'json',
  PNG: 'png',
  JPG: 'jpg',
  WEBM: 'webm',
  MP4: 'mp4',
} as const;

export const MAX_HISTORY_STATES = 50;

export const CANVAS_DEFAULTS = {
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND: '#ffffff',
} as const;

export default {
  STORAGE_KEYS,
  DEFAULT_IDS,
  DEFAULT_SCENE_DURATION,
  ANIMATION_TYPES,
  EXPORT_FORMATS,
  MAX_HISTORY_STATES,
  CANVAS_DEFAULTS,
};
