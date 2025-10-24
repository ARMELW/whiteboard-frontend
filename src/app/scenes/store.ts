import { create } from 'zustand';
// scenesService calls removed from store. Consumers must call API and update store via setters.
import { Scene, Layer, Camera, SceneAudioConfig } from './types';
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
  showHistoryPanel: boolean;
  pendingImageData: any | null;
  activeTab: string; // Ajout onglet actif pour PropertiesPanel
  
  // Data Actions
  setScenes: (scenes: Scene[]) => void;
  addScene: (scene: Scene, afterIndex?: number) => void;
  updateScene: (scene: Scene) => void;
  updateSceneProperty: (sceneId: string, property: string, value: any) => void;
  deleteScene: (id: string) => void;
  reorderScenes: (sceneIds: string[]) => void;
  addLayer: (sceneId: string, layer: Layer) => void;
  updateLayer: (sceneId: string, layer: Layer) => void;
  updateLayerProperty: (sceneId: string, layerId: string, property: string, value: any) => void;
  deleteLayer: (sceneId: string, layerId: string) => void;
  addCamera: (sceneId: string, camera: Camera) => void;
  moveLayer: (sceneId: string, from: number, to: number) => void;
  duplicateLayer: (sceneId: string, layer: Layer, afterIndex?: number) => void;
  updateSceneThumbnail: (sceneId: string) => Promise<void>;
  
  // Audio Actions
  setSceneAudio: (sceneId: string, audio: SceneAudioConfig | null) => void;
  updateSceneAudioVolume: (sceneId: string, volume: number) => void;
  
  // UI Actions
  setSelectedSceneIndex: (index: number) => void;
  setSelectedLayerId: (id: string | null) => void;
  setShowAssetLibrary: (show: boolean) => void;
  setShowShapeToolbar: (show: boolean) => void;
  setShowCropModal: (show: boolean) => void;
  setShowHistoryPanel: (show: boolean) => void;
  setPendingImageData: (data: any | null) => void;
  setActiveTab: (tab: string) => void; // Ajout setter onglet actif
  
  // Reset all state
  reset: () => void;
}

const initialUIState = {
  selectedSceneIndex: 0,
  selectedLayerId: null,
  showAssetLibrary: false,
  showShapeToolbar: false,
  showCropModal: false,
  showHistoryPanel: false,
  pendingImageData: null,
  activeTab: 'properties',
};

const initialDataState = {
  scenes: [],
  loading: false,
  error: null,
};

export const useSceneStore = create<SceneState>((set) => ({
  ...initialDataState,
  ...initialUIState,

  // UI Action pour l'onglet actif
  setActiveTab: (tab: string) => set({ activeTab: tab }),

  // Data Actions
  setScenes: (scenes: Scene[]) => set({ scenes }),
  addScene: (scene: Scene, afterIndex?: number) => {
    set(state => {
      const scenes = [...state.scenes];
      
      // If afterIndex is provided, insert right after that index
      if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < scenes.length) {
        scenes.splice(afterIndex + 1, 0, scene);
      } else {
        // Otherwise, add at the end (default behavior)
        scenes.push(scene);
      }
      
      return { scenes };
    });
    // Do NOT generate thumbnail on scene creation; wait for content.
  },
  updateScene: (scene: Scene) => {
    set(state => ({ scenes: state.scenes.map(s => s.id === scene.id ? scene : s) }));
    setTimeout(() => useSceneStore.getState().updateSceneThumbnail(scene.id), 0);
  },
  updateSceneProperty: (sceneId: string, property: string, value: any) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? { ...s, [property]: value } : s)
    }));
    setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
  },
  deleteScene: (id: string) => set(state => ({ scenes: state.scenes.filter(s => s.id !== id) })),
  reorderScenes: (sceneIds: string[]) => {
    set(state => ({
      scenes: sceneIds.map(id => state.scenes.find(s => s.id === id)).filter(Boolean) as Scene[]
    }));
    // Update thumbnails for all scenes after reorder
    setTimeout(() => {
      sceneIds.forEach(id => useSceneStore.getState().updateSceneThumbnail(id));
    }, 0);
  },
  addLayer: (sceneId: string, layer: Layer) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? { ...s, layers: [...(s.layers || []), layer] } : s)
    }));
    // If it's an image layer, wait for the image to load before updating the thumbnail
    if (layer.type === 'image' && layer.image_path) {
      const img = new window.Image();
      img.onload = () => {
        setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
      };
      img.onerror = () => {
        setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
      };
      img.src = layer.image_path;
    } else {
      setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
    }
  },
  updateLayer: (sceneId: string, layer: Layer) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? {
        ...s,
        layers: (s.layers || []).map(l => l.id === layer.id ? layer : l)
      } : s)
    }));
    setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
  },
  updateLayerProperty: (sceneId: string, layerId: string, property: string, value: any) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? {
        ...s,
        layers: (s.layers || []).map(l => l.id === layerId ? { ...l, [property]: value } : l)
      } : s)
    }));
    setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
  },
  deleteLayer: (sceneId: string, layerId: string) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? {
        ...s,
        layers: (s.layers || []).filter(l => l.id !== layerId)
      } : s)
    }));
    setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
  },
  addCamera: (sceneId: string, camera: Camera) => set(state => ({
    scenes: state.scenes.map(s => s.id === sceneId ? {
      ...s,
      sceneCameras: [...(s.sceneCameras || []), camera]
    } : s)
  })),
  moveLayer: (sceneId: string, from: number, to: number) => {
    set(state => ({
      scenes: state.scenes.map(s => {
        if (s.id !== sceneId || !(s.layers && s.layers.length > 0)) return s;
        const layers = [...s.layers];
        const [moved] = layers.splice(from, 1);
        layers.splice(to, 0, moved);
        return { ...s, layers };
      })
    }));
    setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
  },
  duplicateLayer: (sceneId: string, layer: Layer, afterIndex?: number) => {
    set(state => ({
      scenes: state.scenes.map(s => {
        if (s.id !== sceneId) return s;
        
        const layers = [...(s.layers || [])];
        
        // If afterIndex is provided, insert right after that index
        if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < layers.length) {
          layers.splice(afterIndex + 1, 0, layer);
        } else {
          // Otherwise, add at the end (default behavior)
          layers.push(layer);
        }
        
        return { ...s, layers };
      })
    }));
    setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
  },

  // Generate and update the scene thumbnail in real time (async, does not block UI)
  updateSceneThumbnail: async (sceneId: string) => {
    const state = useSceneStore.getState();
    const scene = state.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    const thumbnail = await generateSceneThumbnail(scene);
    if (thumbnail) {
      useSceneStore.setState({
        scenes: state.scenes.map(s => s.id === sceneId ? { ...s, sceneImage: thumbnail } : s)
      });
    }
  },
  
  // Audio Actions
  setSceneAudio: (sceneId: string, audio: SceneAudioConfig | null) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? { ...s, sceneAudio: audio } : s)
    }));
  },
  
  updateSceneAudioVolume: (sceneId: string, volume: number) => {
    set(state => ({
      scenes: state.scenes.map(s => {
        if (s.id === sceneId && s.sceneAudio) {
          return { ...s, sceneAudio: { ...s.sceneAudio, volume } };
        }
        return s;
      })
    }));
  },
  
  // UI Actions
  setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setShowAssetLibrary: (show) => set({ showAssetLibrary: show }),
  setShowShapeToolbar: (show) => set({ showShapeToolbar: show }),
  setShowCropModal: (show) => set({ showCropModal: show }),
  setShowHistoryPanel: (show) => set({ showHistoryPanel: show }),
  setPendingImageData: (data) => set({ pendingImageData: data }),
  
  reset: () => set({ ...initialDataState, ...initialUIState }),
}));
