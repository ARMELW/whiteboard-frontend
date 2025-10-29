/**
 * Preview Service
 * Handles video preview generation by sending minimal scene data to backend
 */

import httpClient from './httpClient';
import { API_ENDPOINTS } from '@/config/api';
import { Scene } from '@/app/scenes/types';

export interface PreviewScenePayload {
  sceneId: string;
  duration: number;
  layers: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    scale: number;
    opacity: number;
    image_path?: string;
    text_config?: any;
    shape_config?: any;
    z_index: number;
  }>;
  cameras: Array<{
    id: string;
    position: { x: number; y: number };
    width?: number;
    height?: number;
    zoom?: number;
    isDefault?: boolean;
  }>;
  backgroundColor?: string;
  backgroundImage?: string | null;
  audio?: {
    fileId?: string;
    volume?: number;
  } | null;
}

export interface PreviewCompletePayload {
  projectId: string;
  scenes: PreviewScenePayload[];
  config?: {
    width?: number;
    height?: number;
    fps?: number;
  };
}

export interface PreviewResponse {
  success: boolean;
  data: {
    previewId: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    videoUrl?: string;
    progress?: number;
  };
}

export interface PreviewStatusResponse {
  success: boolean;
  data: {
    previewId: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    videoUrl?: string;
    previewUrl?: string;
    progress: number;
    error?: string;
  };
}

/**
 * Extract minimal scene data for preview
 */
export const extractPreviewSceneData = (scene: Scene): PreviewScenePayload => {
  return {
    sceneId: scene.id,
    duration: scene.duration || 5,
    layers: (scene.layers || []).map(layer => ({
      id: layer.id,
      type: layer.type,
      position: layer.position,
      scale: layer.scale,
      opacity: layer.opacity,
      image_path: layer.image_path,
      text_config: layer.text_config,
      shape_config: layer.shape_config,
      z_index: layer.z_index,
    })),
    cameras: (scene.sceneCameras || []).map(camera => ({
      id: camera.id,
      position: camera.position,
      width: camera.width,
      height: camera.height,
      zoom: camera.zoom,
      isDefault: camera.isDefault,
    })),
    backgroundColor: scene.backgroundColor,
    backgroundImage: scene.backgroundImage,
    audio: scene.sceneAudio ? {
      fileId: scene.sceneAudio.fileId,
      volume: scene.sceneAudio.volume,
    } : null,
  };
};

class PreviewService {
  /**
   * Generate preview for a single scene
   */
  async previewScene(scene: Scene): Promise<string> {
    try {
      const payload = extractPreviewSceneData(scene);
      
      const response = await httpClient.post<PreviewResponse>(
        API_ENDPOINTS.preview.scene,
        payload
      );

      return response.data.data.previewId;
    } catch (error) {
      console.error('Error generating scene preview:', error);
      throw error;
    }
  }

  /**
   * Generate preview for complete video (all scenes)
   */
  async previewComplete(
    projectId: string,
    scenes: Scene[],
    config?: { width?: number; height?: number; fps?: number }
  ): Promise<string> {
    try {
      const payload: PreviewCompletePayload = {
        projectId,
        scenes: scenes.map(extractPreviewSceneData),
        config: config || {
          width: 1920,
          height: 1080,
          fps: 30,
        },
      };

      const response = await httpClient.post<PreviewResponse>(
        API_ENDPOINTS.preview.complete,
        payload
      );

      return response.data.data.previewId;
    } catch (error) {
      console.error('Error generating complete preview:', error);
      throw error;
    }
  }

  /**
   * Get preview status
   */
  async getPreviewStatus(previewId: string): Promise<PreviewStatusResponse['data']> {
    try {
      const response = await httpClient.get<PreviewStatusResponse>(
        API_ENDPOINTS.preview.status(previewId)
      );

      return response.data.data;
    } catch (error) {
      console.error('Error getting preview status:', error);
      throw error;
    }
  }

  /**
   * Cancel preview generation
   */
  async cancelPreview(previewId: string): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.preview.cancel(previewId));
    } catch (error) {
      console.error('Error canceling preview:', error);
      throw error;
    }
  }

  /**
   * Poll for preview completion
   */
  async pollPreviewStatus(
    previewId: string,
    onProgress?: (progress: number) => void,
    maxAttempts = 60,
    interval = 2000
  ): Promise<string> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          attempts++;
          
          if (attempts > maxAttempts) {
            reject(new Error('Preview generation timeout'));
            return;
          }

          const status = await this.getPreviewStatus(previewId);

          if (onProgress && status.progress !== undefined) {
            onProgress(status.progress);
          }

          if (status.status === 'completed' && (status.videoUrl || status.previewUrl)) {
            resolve(status.videoUrl || status.previewUrl!);
          } else if (status.status === 'error') {
            reject(new Error(status.error || 'Preview generation failed'));
          } else {
            setTimeout(checkStatus, interval);
          }
        } catch (error) {
          reject(error);
        }
      };

      checkStatus();
    });
  }
}

export const previewService = new PreviewService();
