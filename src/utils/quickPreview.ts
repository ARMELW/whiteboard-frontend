import { Scene } from '../app/scenes/types';
import { exportSceneImage } from './sceneExporter';

/**
 * Quick Preview Utility
 * Generates instant preview of scenes without full video generation
 */

export interface QuickPreviewOptions {
  width?: number;
  height?: number;
  fps?: number;
  sceneDuration?: number;
}

/**
 * Create a quick preview video from scenes using canvas and MediaRecorder
 * This provides instant preview without backend processing
 */
export const createQuickPreview = async (
  scenes: Scene[],
  options: QuickPreviewOptions = {}
): Promise<string> => {
  const {
    width = 1920,
    height = 1080,
    fps = 30,
    sceneDuration = 3 // Default 3 seconds per scene if no duration specified
  } = options;

  if (scenes.length === 0) {
    throw new Error('No scenes to preview');
  }

  // Create an offscreen canvas for rendering
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  // Setup MediaRecorder
  const stream = canvas.captureStream(fps);
  const chunks: Blob[] = [];
  
  const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
    ? 'video/webm; codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm')
    ? 'video/webm'
    : 'video/mp4';

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 5000000 // 5 Mbps
  });

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  // Promise that resolves when recording is complete
  const recordingComplete = new Promise<string>((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      resolve(url);
    };

    mediaRecorder.onerror = (e) => {
      reject(new Error('Recording failed'));
    };
  });

  // Start recording
  mediaRecorder.start();

  // Render each scene
  for (const scene of scenes) {
    try {
      // Get scene duration (use provided duration or default)
      const duration = (scene.duration || sceneDuration) * 1000; // Convert to ms
      
      // Export scene as image
      const sceneDataUrl = await exportSceneImage(scene, {
        sceneWidth: width,
        sceneHeight: height,
        background: scene.backgroundColor || '#FFFFFF'
      });

      // Load the scene image
      const img = await loadImage(sceneDataUrl);
      
      // Calculate frames for this scene
      const frames = Math.ceil((duration / 1000) * fps);
      
      // Render frames for this scene
      for (let i = 0; i < frames; i++) {
        // Clear canvas
        ctx.fillStyle = scene.backgroundColor || '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // Draw scene image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Wait for next frame
        await new Promise(resolve => setTimeout(resolve, 1000 / fps));
      }
    } catch (error) {
      console.error('Error rendering scene:', error);
      // Continue with next scene
    }
  }

  // Stop recording
  mediaRecorder.stop();

  // Wait for recording to complete
  const videoUrl = await recordingComplete;
  
  return videoUrl;
};

/**
 * Create a simple image slideshow preview (simpler alternative)
 * Shows each scene as a static image with transitions
 */
export const createSlideshowPreview = async (
  scenes: Scene[],
  options: { width?: number; height?: number } = {}
): Promise<string[]> => {
  const { width = 1920, height = 1080 } = options;

  if (scenes.length === 0) {
    throw new Error('No scenes to preview');
  }

  const sceneImages: string[] = [];

  for (const scene of scenes) {
    try {
      const sceneDataUrl = await exportSceneImage(scene, {
        sceneWidth: width,
        sceneHeight: height,
        background: scene.backgroundColor || '#FFFFFF'
      });
      sceneImages.push(sceneDataUrl);
    } catch (error) {
      console.error('Error exporting scene:', error);
    }
  }

  return sceneImages;
};

/**
 * Helper to load an image from data URL
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};
