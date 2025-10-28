/**
 * Scene Thumbnail Generator
 * Generates thumbnail images for scenes using the scene export logic
 */

import { exportSceneImage } from './sceneExporter';
import { Scene, Camera } from '../app/scenes/types';

// Thumbnail configuration constants
export const THUMBNAIL_CONFIG = {
  WIDTH: 320,
  HEIGHT: 180,
  PIXEL_RATIO: 2,
  QUALITY: 0.95,
  BACKGROUND_COLOR: '#f5f5f5',
} as const;

/**
 * Generate a thumbnail image for a scene
 * @param {Scene} scene - The scene object to generate thumbnail for
 * @param {object} options - Thumbnail generation options
 * @param {number} options.thumbnailWidth - Thumbnail width (default: 320)
 * @param {number} options.thumbnailHeight - Thumbnail height (default: 180)
 * @returns {Promise<string>} Data URL of the thumbnail PNG
 */
export const generateSceneThumbnail = async (scene: Scene, options: {
  thumbnailWidth?: number;
  thumbnailHeight?: number;
} = {}): Promise<string> => {
  const {
    thumbnailWidth = THUMBNAIL_CONFIG.WIDTH,
    thumbnailHeight = THUMBNAIL_CONFIG.HEIGHT,
  } = options;

  try {
    // Check if scene has a default camera
    const defaultCamera = scene.sceneCameras?.find((cam: Camera) => cam.isDefault);
    
    if (!defaultCamera) {
      console.warn('Scene has no default camera, generating placeholder thumbnail');
      return generatePlaceholderThumbnail(thumbnailWidth, thumbnailHeight, scene.title || 'Scene');
    }

    // Use the exportSceneImage function to generate the thumbnail with higher pixel ratio
    // Default to 1920x1080 if camera dimensions are not available
    const sceneImage = await exportSceneImage(scene, {
      sceneWidth: 1920,
      sceneHeight: 1080,
      background: scene.backgroundImage ? 'transparent' : '#FFFFFF',
      pixelRatio: THUMBNAIL_CONFIG.PIXEL_RATIO,
    });

    // The exported image is at camera resolution, now we need to resize it for thumbnail
    return await resizeImageToThumbnail(sceneImage, thumbnailWidth, thumbnailHeight);
  } catch (error) {
    console.error('Error generating scene thumbnail:', error);
    // Return a placeholder instead of empty string to ensure UI always has a thumbnail
    return generatePlaceholderThumbnail(thumbnailWidth, thumbnailHeight, scene.title || 'Scene');
  }
};

/**
 * Generate a placeholder thumbnail when scene rendering fails or has no camera
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @param {string} sceneTitle - Title to display on placeholder
 * @returns {string} Data URL of the placeholder thumbnail
 */
const generatePlaceholderThumbnail = (width: number, height: number, sceneTitle: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Failed to get canvas context for placeholder thumbnail');
    return '';
  }

  // Fill background
  ctx.fillStyle = THUMBNAIL_CONFIG.BACKGROUND_COLOR;
  ctx.fillRect(0, 0, width, height);

  // Draw a border
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  // Draw scene icon (simple camera icon representation)
  const iconSize = Math.min(width, height) * 0.3;
  const iconX = width / 2;
  const iconY = height / 2 - 10;
  
  ctx.fillStyle = '#999999';
  ctx.beginPath();
  // Use roundRect if available, otherwise use regular rect for compatibility
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(iconX - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize * 0.7, 4);
  } else {
    ctx.rect(iconX - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize * 0.7);
  }
  ctx.fill();
  
  // Draw lens circle
  ctx.fillStyle = '#666666';
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconSize * 0.25, 0, 2 * Math.PI);
  ctx.fill();

  // Draw scene title
  ctx.fillStyle = '#666666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // Truncate title if too long
  const maxLength = 20;
  const displayTitle = sceneTitle.length > maxLength 
    ? sceneTitle.substring(0, maxLength) + '...' 
    : sceneTitle;
  
  ctx.fillText(displayTitle, width / 2, height - 25);

  return canvas.toDataURL('image/png', THUMBNAIL_CONFIG.QUALITY);
};

/**
 * Resize an image data URL to thumbnail size with proper aspect ratio
 * @param {string} dataUrl - Source image data URL
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @returns {Promise<string>} Resized image data URL
 */
const resizeImageToThumbnail = (dataUrl: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate aspect ratios
        const imgAspect = img.width / img.height;
        const targetAspect = width / height;
        
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        // Fit image to maintain aspect ratio (contain)
        if (imgAspect > targetAspect) {
          // Image is wider - fit to width
          drawHeight = width / imgAspect;
          offsetY = (height - drawHeight) / 2;
        } else {
          // Image is taller - fit to height
          drawWidth = height * imgAspect;
          offsetX = (width - drawWidth) / 2;
        }

        // Fill background
        ctx.fillStyle = THUMBNAIL_CONFIG.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, width, height);

        // Draw the image with proper aspect ratio
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        resolve(canvas.toDataURL('image/png', THUMBNAIL_CONFIG.QUALITY));
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = dataUrl;
  });
};
