import BaseService from '../../../services/api/baseService';
import API_ENDPOINTS from '../../../config/api';
import { DEFAULT_IDS } from '../../../config/constants';
import { createMultiTimeline } from '../../../utils/multiTimelineSystem';
import { createSceneAudioConfig } from '../../../utils/audioManager';
import { createCamera } from '../../../utils/cameraAnimator';
import { Scene, ScenePayload, Layer, Camera } from '../types';

const DEFAULT_CAMERA_NAME = 'Vue par défaut';

/**
 * Create a default camera for a scene
 */
function createDefaultCamera(): Camera {
  return createCamera({
    id: `camera-${Date.now()}`,
    name: DEFAULT_CAMERA_NAME,
    isDefault: true,
    width: 800,
    height: 450,
    position: { x: 0.5, y: 0.5 },
    zoom: 0.8,
    locked: true, // Camera par défaut non redimensionnable
    scale: 1,
  });
}

class ScenesService extends BaseService<Scene> {
  constructor() {
    super(API_ENDPOINTS.scenes);
  }

  /**
   * Transform scene data to match backend API expectations
   * Handles backgroundImage null values
   */
  private transformSceneForBackend(scene: Partial<Scene>): any {
    const { projectId, backgroundImage, sceneCameras, ...rest } = scene;
    const transformed: any = {
      ...rest,
      projectId: projectId,
      sceneCameras: sceneCameras ?? [],
    };

    // Only include backgroundImage if it has a value
    if (backgroundImage) {
      transformed.backgroundImage = backgroundImage;
    }

    return transformed;
  }

  /**
   * Transform scene data from backend to internal format
   * Ensures backgroundImage is set properly
   */
  private transformSceneFromBackend(scene: any): Scene {
    const { projectId, sceneCameras, ...rest } = scene;
    return {
      ...rest,
      projectId: projectId,
      sceneCameras: Array.isArray(sceneCameras) ? sceneCameras : [],
      backgroundImage: scene.backgroundImage || null,
    } as Scene;
  }

  async create(payload: ScenePayload = {}): Promise<Scene> {
    const defaultCamera = createDefaultCamera();

    // Use projectId from payload, fallback to default if not provided
    const projectId = payload.projectId || DEFAULT_IDS.PROJECT;

    const defaultScene: Partial<Scene> = {
      id: `scene-${Date.now()}`,
      projectId,
      title: 'Nouvelle Scène',
      content: 'Ajoutez votre contenu ici...',
      duration: 5,
      animation: 'fade',
      layers: [],
      cameras: [],
      sceneCameras: [defaultCamera],
      multiTimeline: createMultiTimeline(5),
      audio: createSceneAudioConfig(),
      ...payload,
    };

    // Don't set backgroundImage to null if not provided
    if (!payload.backgroundImage) {
      delete defaultScene.backgroundImage;
    }

    // Transform for backend if using API
    const useBackend = await this.shouldUseBackendAsync();
    if (useBackend) {
      console.log('[scenesService.create] Creating scene via API', defaultScene);
      const transformedScene = this.transformSceneForBackend(defaultScene);
      const response = await this.createWithTransform(transformedScene);
      return this.transformSceneFromBackend(response);
    }
    console.log('[scenesService.create] Creating scene in local storage', defaultScene);

    return super.create(defaultScene);
  }

  /**
   * Helper method to create with transformed data
   */
  private async createWithTransform(transformedData: any): Promise<any> {
    const httpClient = await import('../../../services/api/httpClient');
    const response = await httpClient.default.post(this.endpoints.create!, transformedData);
    return response.data;
  }

  /**
   * Override update to ensure projectId is always included
   */
  async update(id: string, payload: Partial<Scene>): Promise<Scene> {
    // First, get the current scene to retrieve its projectId if not provided
    let finalPayload = payload;
    
    // Ensure projectId is present in the update payload
    if (!payload.projectId) {
      try {
        const currentScene = await this.detail(id);
        finalPayload = {
          ...payload,
          projectId: currentScene.projectId
        };
      } catch (error) {
        console.error('[scenesService.update] Failed to get current scene, using default projectId', error);
        // Fallback to default projectId if we can't get the current scene
        finalPayload = {
          ...payload,
          projectId: DEFAULT_IDS.PROJECT
        };
      }
    }

    // Transform the payload for backend
    const transformedPayload = this.transformSceneForBackend(finalPayload);

    // Call the parent update method with transformed payload
    const response = await super.update(id, transformedPayload);
    return this.transformSceneFromBackend(response);
  }

  /**
   * Check if backend should be used
   */
  private async shouldUseBackendAsync(): Promise<boolean> {
    const httpClient = await import('../../../services/api/httpClient');
    return httpClient.default.checkIsOnline();
  }

  async duplicate(id: string): Promise<Scene> {
    await this.delay();
    const scene = await this.detail(id);

    // Ensure sceneCameras has at least a default camera
    let sceneCameras = scene.sceneCameras || [];
    if (sceneCameras.length === 0) {
      sceneCameras = [createDefaultCamera()];
    }

    // Deep copy layers with new IDs
    const duplicatedLayers = (scene.layers || []).map(layer => ({
      ...layer,
      id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    const duplicatedScene: Partial<Scene> = {
      ...scene,
      id: `scene-${Date.now()}`,
      title: `${scene.title} (Copie)`,
      projectId: scene.projectId,
      sceneCameras,
      multiTimeline: scene.multiTimeline || createMultiTimeline(scene.duration),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      layers: duplicatedLayers,
    };

    console.log('[scenesService.duplicate] duplicatedScene:', duplicatedScene);
    return super.create(duplicatedScene);
  }

  async reorder(sceneIds: string[]): Promise<Scene[]> {
    await this.delay();
    const allScenes = await this.list({ page: 1, limit: 1000 });
    const scenes = allScenes.data;
    
    const reordered = sceneIds
      .map(id => scenes.find(scene => scene.id === id))
      .filter((scene): scene is Scene => scene !== undefined);

    return super.bulkUpdate(reordered);
  }

  async addLayer(sceneId: string, layer: Layer): Promise<Scene> {
    const scene = await this.detail(sceneId);
    const updatedLayers = [...(scene.layers || []), layer];
    
    return super.update(sceneId, {
      ...scene,
      layers: updatedLayers,
    });
  }

  async updateLayer(sceneId: string, layerId: string, layerData: Partial<Layer>): Promise<Scene> {
    const scene = await this.detail(sceneId);
    const layers = scene.layers || [];
    const layerIndex = layers.findIndex(l => l.id === layerId);
    
    if (layerIndex === -1) {
      throw new Error(`Layer with id ${layerId} not found`);
    }
    
    layers[layerIndex] = { ...layers[layerIndex], ...layerData };
    
    return super.update(sceneId, {
      ...scene,
      layers,
    });
  }

  async deleteLayer(sceneId: string, layerId: string): Promise<Scene> {
    const scene = await this.detail(sceneId);
    const layers = (scene.layers || []).filter(l => l.id !== layerId);
    
    return super.update(sceneId, {
      ...scene,
      layers,
    });
  }

  async addCamera(sceneId: string, camera: Camera): Promise<Scene> {
    const scene = await this.detail(sceneId);
    const updatedCameras = [...(scene.sceneCameras || []), camera];
    
    return super.update(sceneId, {
      ...scene,
      sceneCameras: updatedCameras,
    });
  }
}

export default new ScenesService();
