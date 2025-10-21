import { create } from 'zustand';
import scenesService from './api/scenesService';
import sampleStory from '../../data/scenes';
import { Scene, ScenePayload, Layer, Camera } from './types';
import { generateSceneThumbnail } from '../../utils/sceneThumbnail';

interface SceneState {
  // Data state
  scenes: Scene[];
  loading: boolean;
  error: Error | null;
  
  // UI state
  selectedSceneIndex: number;
  selectedLayerId: string | null;
  showAssetLibrary: boolean;
  showShapeToolbar: boolean;
  showCropModal: boolean;
  pendingImageData: any | null;
  
  // Data Actions
  loadScenes: () => Promise<void>;
  createScene: (payload?: ScenePayload) => Promise<Scene>;
  updateScene: (id: string, data: Partial<Scene>, skipThumbnail?: boolean) => Promise<Scene>;
  deleteScene: (id: string) => Promise<void>;
  duplicateScene: (id: string) => Promise<Scene>;
  reorderScenes: (sceneIds: string[]) => Promise<void>;
  addLayer: (sceneId: string, layer: Layer) => Promise<Scene>;
  updateLayer: (sceneId: string, layerId: string, data: Partial<Layer>) => Promise<Scene>;
  deleteLayer: (sceneId: string, layerId: string) => Promise<Scene>;
  addCamera: (sceneId: string, camera: Camera) => Promise<Scene>;
  moveLayer: (sceneId: string, layerId: string, direction: 'up' | 'down') => Promise<Scene>;
  duplicateLayer: (sceneId: string, layerId: string) => Promise<Scene>;
  
  // UI Actions
  setSelectedSceneIndex: (index: number) => void;
  setSelectedLayerId: (id: string | null) => void;
  setShowAssetLibrary: (show: boolean) => void;
  setShowShapeToolbar: (show: boolean) => void;
  setShowCropModal: (show: boolean) => void;
  setPendingImageData: (data: any | null) => void;
  
  // Reset all state
  reset: () => void;
}

const initialUIState = {
  selectedSceneIndex: 0,
  selectedLayerId: null,
  showAssetLibrary: false,
  showShapeToolbar: false,
  showCropModal: false,
  pendingImageData: null,
};

const initialDataState = {
  scenes: [],
  loading: false,
  error: null,
};

export const useSceneStore = create<SceneState>((set, get) => ({
  ...initialDataState,
  ...initialUIState,
  
  // Data Actions
  loadScenes: async () => {
    set({ loading: true, error: null });
    try {
      const result = await scenesService.list({ page: 1, limit: 1000 });
      
      if (result.data.length === 0) {
        const initialScenes = sampleStory || [];
        await scenesService.bulkUpdate(initialScenes);
        set({ scenes: initialScenes, loading: false });
      } else {
        set({ scenes: result.data, loading: false });
      }
    } catch (error) {
      set({ error: error as Error, loading: false });
    }
  },
  
  createScene: async (payload: ScenePayload = {}) => {
    set({ loading: true, error: null });
    try {
      const scene = await scenesService.create(payload);
      const scenes = [...get().scenes, scene];
      set({ scenes, loading: false });
      
      // Generate thumbnail asynchronously
      generateSceneThumbnail(scene).then(async (thumbnail) => {
        if (thumbnail) {
          const updated = await scenesService.update(scene.id, { sceneImage: thumbnail });
          set(state => ({
            scenes: state.scenes.map(s => s.id === updated.id ? updated : s)
          }));
        }
      });
      
      return scene;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  updateScene: async (id: string, data: Partial<Scene>, skipThumbnail = false) => {
    set({ loading: true, error: null });
    try {
      const scene = await scenesService.update(id, data);
      set(state => ({
        scenes: state.scenes.map(s => s.id === id ? scene : s),
        loading: false
      }));
      
      // Generate thumbnail asynchronously if not skipped
      if (!skipThumbnail) {
        generateSceneThumbnail(scene).then(async (thumbnail) => {
          if (thumbnail) {
            const updated = await scenesService.update(scene.id, { sceneImage: thumbnail });
            set(state => ({
              scenes: state.scenes.map(s => s.id === updated.id ? updated : s)
            }));
          }
        });
      }
      
      return scene;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  deleteScene: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await scenesService.delete(id);
      set(state => ({
        scenes: state.scenes.filter(s => s.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  duplicateScene: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const scene = await scenesService.duplicate(id);
      const scenes = [...get().scenes, scene];
      set({ scenes, loading: false });
      
      // Generate thumbnail asynchronously
      generateSceneThumbnail(scene).then(async (thumbnail) => {
        if (thumbnail) {
          const updated = await scenesService.update(scene.id, { sceneImage: thumbnail });
          set(state => ({
            scenes: state.scenes.map(s => s.id === updated.id ? updated : s)
          }));
        }
      });
      
      return scene;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  reorderScenes: async (sceneIds: string[]) => {
    set({ loading: true, error: null });
    try {
      const scenes = await scenesService.reorder(sceneIds);
      set({ scenes, loading: false });
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  addLayer: async (sceneId: string, layer: Layer) => {
    set({ loading: true, error: null });
    try {
      const scene = await scenesService.addLayer(sceneId, layer);
      set(state => ({
        scenes: state.scenes.map(s => s.id === sceneId ? scene : s),
        loading: false
      }));
      
      // Generate thumbnail asynchronously
      generateSceneThumbnail(scene).then(async (thumbnail) => {
        if (thumbnail) {
          const updated = await scenesService.update(scene.id, { sceneImage: thumbnail });
          set(state => ({
            scenes: state.scenes.map(s => s.id === updated.id ? updated : s)
          }));
        }
      });
      
      return scene;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  updateLayer: async (sceneId: string, layerId: string, data: Partial<Layer>) => {
    set({ loading: true, error: null });
    try {
      const scene = await scenesService.updateLayer(sceneId, layerId, data);
      set(state => ({
        scenes: state.scenes.map(s => s.id === sceneId ? scene : s),
        loading: false
      }));
      
      // Generate thumbnail asynchronously
      generateSceneThumbnail(scene).then(async (thumbnail) => {
        if (thumbnail) {
          const updated = await scenesService.update(scene.id, { sceneImage: thumbnail });
          set(state => ({
            scenes: state.scenes.map(s => s.id === updated.id ? updated : s)
          }));
        }
      });
      
      return scene;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  deleteLayer: async (sceneId: string, layerId: string) => {
    set({ loading: true, error: null });
    try {
      const scene = await scenesService.deleteLayer(sceneId, layerId);
      set(state => ({
        scenes: state.scenes.map(s => s.id === sceneId ? scene : s),
        loading: false
      }));
      
      // Generate thumbnail asynchronously
      generateSceneThumbnail(scene).then(async (thumbnail) => {
        if (thumbnail) {
          const updated = await scenesService.update(scene.id, { sceneImage: thumbnail });
          set(state => ({
            scenes: state.scenes.map(s => s.id === updated.id ? updated : s)
          }));
        }
      });
      
      return scene;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  addCamera: async (sceneId: string, camera: Camera) => {
    set({ loading: true, error: null });
    try {
      const scene = await scenesService.addCamera(sceneId, camera);
      set(state => ({
        scenes: state.scenes.map(s => s.id === sceneId ? scene : s),
        loading: false
      }));
      return scene;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  moveLayer: async (sceneId: string, layerId: string, direction: 'up' | 'down') => {
    set({ loading: true, error: null });
    try {
      const scene = await scenesService.detail(sceneId);
      if (!scene || !scene.layers) return scene;
      
      const layers = [...scene.layers];
      const idx = layers.findIndex(l => l.id === layerId);
      if (idx === -1) return scene;
      
      const newIdx = direction === 'up' ? Math.max(0, idx - 1) : Math.min(layers.length - 1, idx + 1);
      if (newIdx === idx) return scene;
      
      const [moved] = layers.splice(idx, 1);
      layers.splice(newIdx, 0, moved);
      
      layers.forEach((l, i) => {
        l.z_index = i + 1;
      });
      
      const updated = await scenesService.update(sceneId, { ...scene, layers });
      set(state => ({
        scenes: state.scenes.map(s => s.id === sceneId ? updated : s),
        loading: false
      }));
      
      // Generate thumbnail asynchronously
      generateSceneThumbnail(updated).then(async (thumbnail) => {
        if (thumbnail) {
          const withThumbnail = await scenesService.update(updated.id, { sceneImage: thumbnail });
          set(state => ({
            scenes: state.scenes.map(s => s.id === withThumbnail.id ? withThumbnail : s)
          }));
        }
      });
      
      return updated;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  duplicateLayer: async (sceneId: string, layerId: string) => {
    set({ loading: true, error: null });
    try {
      const scene = await scenesService.detail(sceneId);
      if (!scene || !scene.layers) return scene;
      
      const layer = scene.layers.find(l => l.id === layerId);
      if (!layer) return scene;
      
      const newLayer = {
        ...layer,
        id: `layer-${Date.now()}`,
        name: `${layer.name || 'Layer'} (Copie)`,
        z_index: scene.layers.length + 1,
      };
      
      const updated = await scenesService.update(sceneId, {
        ...scene,
        layers: [...scene.layers, newLayer],
      });
      
      set(state => ({
        scenes: state.scenes.map(s => s.id === sceneId ? updated : s),
        loading: false
      }));
      
      // Generate thumbnail asynchronously
      generateSceneThumbnail(updated).then(async (thumbnail) => {
        if (thumbnail) {
          const withThumbnail = await scenesService.update(updated.id, { sceneImage: thumbnail });
          set(state => ({
            scenes: state.scenes.map(s => s.id === withThumbnail.id ? withThumbnail : s)
          }));
        }
      });
      
      return updated;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },
  
  // UI Actions
  setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setShowAssetLibrary: (show) => set({ showAssetLibrary: show }),
  setShowShapeToolbar: (show) => set({ showShapeToolbar: show }),
  setShowCropModal: (show) => set({ showCropModal: show }),
  setPendingImageData: (data) => set({ pendingImageData: data }),
  
  reset: () => set({ ...initialDataState, ...initialUIState }),
}));
