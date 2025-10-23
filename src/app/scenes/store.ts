import { create } from 'zustand';
// scenesService calls removed from store. Consumers must call API and update store via setters.
import { Scene, Layer, Camera } from './types';
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
  activeTab: string; // Ajout onglet actif pour PropertiesPanel
  
  // Data Actions
  setScenes: (scenes: Scene[]) => void;
  addScene: (scene: Scene) => void;
  updateScene: (scene: Scene) => void;
  deleteScene: (id: string) => void;
  reorderScenes: (sceneIds: string[]) => void;
  addLayer: (sceneId: string, layer: Layer) => void;
  updateLayer: (sceneId: string, layer: Layer) => void;
  deleteLayer: (sceneId: string, layerId: string) => void;
  addCamera: (sceneId: string, camera: Camera) => void;
  moveLayer: (sceneId: string, from: number, to: number) => void;
  duplicateLayer: (sceneId: string, layer: Layer) => void;
  updateSceneThumbnail: (sceneId: string) => Promise<void>;
  
  // UI Actions
  setSelectedSceneIndex: (index: number) => void;
  setSelectedLayerId: (id: string | null) => void;
  setShowAssetLibrary: (show: boolean) => void;
  setShowShapeToolbar: (show: boolean) => void;
  setShowCropModal: (show: boolean) => void;
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
  addScene: (scene: Scene) => {
    set(state => ({ scenes: [...state.scenes, scene] }));
    // Do NOT generate thumbnail on scene creation; wait for content.
  },
  updateScene: (scene: Scene) => {
    set(state => ({ scenes: state.scenes.map(s => s.id === scene.id ? scene : s) }));
    setTimeout(() => useSceneStore.getState().updateSceneThumbnail(scene.id), 0);
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
    setTimeout(() => useSceneStore.getState().updateSceneThumbnail(sceneId), 0);
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
      cameras: [...(s.cameras || []), camera]
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
  duplicateLayer: (sceneId: string, layer: Layer) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? {
        ...s,
        layers: [...(s.layers || []), layer]
      } : s)
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
  
  // UI Actions
  setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setShowAssetLibrary: (show) => set({ showAssetLibrary: show }),
  setShowShapeToolbar: (show) => set({ showShapeToolbar: show }),
  setShowCropModal: (show) => set({ showCropModal: show }),
  setPendingImageData: (data) => set({ pendingImageData: data }),
  
  reset: () => set({ ...initialDataState, ...initialUIState }),
}));
