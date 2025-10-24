/**
 * Image Library Configuration
 * Constants and settings for image management
 */

export const IMAGE_CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FORMATS: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  ALLOWED_EXTENSIONS: [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
  ],
} as const;

export const DEFAULT_IMAGE_PROPERTIES = {
  x: 100,
  y: 50,
  width: 400,
  height: 300,
  rotation: 0,
  opacity: 1.0,
  scaleX: 1.0,
  scaleY: 1.0,
  flipX: false,
  flipY: false,
} as const;
