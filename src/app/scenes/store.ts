import { create } from 'zustand';
import { Scene, Layer, Camera, SceneAudioConfig } from './types';
import { generateSceneThumbnail } from '../../utils/sceneThumbnail';
import { generateLayerSnapshotDebounced, shouldRegenerateSnapshot } from '../../utils/layerSnapshot';
import { updateLayerCameraPosition } from '../../utils/cameraAnimator';

/**
 * UI-only store for scene state
 * Data is managed by React Query, this store only handles UI state and temporary scene data
 */
interface SceneState {
  // Temporary scene data (for UI updates before sync)
  scenes: Scene[];
  
  // UI state
  currentProjectId: string | null;
  selectedSceneIndex: number;
  selectedLayerId: string | null;
  selectedLayerIds: string[]; // Multi-selection support
  showAssetLibrary: boolean;
  showShapeToolbar: boolean;
  showShapeLibrary: boolean;
  showCropModal: boolean;
  showHistoryPanel: boolean;
  pendingImageData: any | null;
  activeTab: string; // Ajout onglet actif pour PropertiesPanel
  
  // Preview state
  previewMode: boolean;
  previewVideoUrl: string | null;
  previewType: 'full' | 'scene' | null;
  previewLoading: boolean;
  previewStartSceneIndex: number | null;
  
  // Projection screen dimensions (for preview and positioning)
  projectionScreenWidth: number;
  projectionScreenHeight: number;
  
  // Temporary scene data actions (for optimistic UI updates)
  setScenes: (scenes: Scene[]) => void;
  setCurrentProjectId: (projectId: string | null) => void;
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
  setSelectedLayerIds: (ids: string[]) => void;
  toggleLayerSelection: (id: string) => void; // For Ctrl+Click multi-selection
  clearSelection: () => void;
  setShowAssetLibrary: (show: boolean) => void;
  setShowShapeToolbar: (show: boolean) => void;
  setShowShapeLibrary: (show: boolean) => void;
  setShowCropModal: (show: boolean) => void;
  setShowHistoryPanel: (show: boolean) => void;
  setPendingImageData: (data: any | null) => void;
  setActiveTab: (tab: string) => void; // Ajout setter onglet actif
  
  // Preview Actions
  setPreviewMode: (mode: boolean) => void;
  setPreviewVideoUrl: (url: string | null) => void;
  setPreviewType: (type: 'full' | 'scene' | null) => void;
  setPreviewLoading: (loading: boolean) => void;
  setPreviewStartSceneIndex: (index: number | null) => void;
  startPreview: (videoUrl: string, type: 'full' | 'scene') => void;
  stopPreview: () => void;
  
  // Projection Screen Actions
  setProjectionScreen: (width: number, height: number) => void;
  
  // Reset all state
  reset: () => void;
}

const initialUIState = {
  selectedSceneIndex: 0,
  selectedLayerId: null,
  selectedLayerIds: [],
  showAssetLibrary: false,
  showShapeToolbar: false,
  showShapeLibrary: false,
  showCropModal: false,
  showHistoryPanel: false,
  pendingImageData: null,
  activeTab: 'properties',
  previewMode: false,
  previewVideoUrl: null,
  previewType: null,
  previewLoading: false,
  previewStartSceneIndex: null,
  projectionScreenWidth: 1920,
  projectionScreenHeight: 1080,
};

const initialDataState = {
  scenes: [],
  currentProjectId: null,
};

// Debounce timers for thumbnail generation (one per scene)
const thumbnailUpdateTimers = new Map<string, NodeJS.Timeout>();

// Debounced thumbnail update helper
const debouncedUpdateThumbnail = (sceneId: string, delay = 500) => {
  // Clear existing timer for this scene
  const existingTimer = thumbnailUpdateTimers.get(sceneId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }
  
  // Set new timer
  const timer = setTimeout(() => {
    useSceneStore.getState().updateSceneThumbnail(sceneId);
    thumbnailUpdateTimers.delete(sceneId);
  }, delay);
  
  thumbnailUpdateTimers.set(sceneId, timer);
};

export const useSceneStore = create<SceneState>((set) => ({
  ...initialDataState,
  ...initialUIState,

  // UI Action pour l'onglet actif
  setActiveTab: (tab: string) => set({ activeTab: tab }),

  // Data Actions
  setScenes: (scenes: Scene[]) => set({ scenes }),
  setCurrentProjectId: (projectId: string | null) => set({ currentProjectId: projectId }),
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
    debouncedUpdateThumbnail(scene.id);
  },
  updateSceneProperty: (sceneId: string, property: string, value: any) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? { ...s, [property]: value } : s)
    }));
    // Only update thumbnail if property affects visual appearance
    const visualProperties = ['backgroundImage', 'title', 'content', 'animation'];
    if (visualProperties.includes(property)) {
      debouncedUpdateThumbnail(sceneId);
    }
  },
  deleteScene: (id: string) => set(state => ({ scenes: state.scenes.filter(s => s.id !== id) })),
  reorderScenes: (sceneIds: string[]) => {
    set(state => ({
      scenes: sceneIds.map(id => state.scenes.find(s => s.id === id)).filter(Boolean) as Scene[]
    }));
    // No need to update thumbnails on reorder - visual content hasn't changed
  },
  addLayer: (sceneId: string, layer: Layer) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? { ...s, layers: [...(s.layers || []), layer] } : s)
    }));
    
    // Generate layer snapshot in background with scene context
    const state = useSceneStore.getState();
    const scene = state.scenes.find(s => s.id === sceneId);
    
    if (scene) {
      generateLayerSnapshotDebounced(layer, (cachedImage) => {
        if (cachedImage) {
          set(state => ({
            scenes: state.scenes.map(s => s.id === sceneId ? {
              ...s,
              layers: (s.layers || []).map(l => l.id === layer.id ? { ...l, cachedImage } : l)
            } : s)
          }));
        }
      }, 300, {
        sceneWidth: scene.sceneWidth || 1920,
        sceneHeight: scene.sceneHeight || 1080,
        sceneBackgroundImage: scene.backgroundImage || null,
      });
    }
    
    // If it's an image layer, wait for the image to load before updating the thumbnail
    if (layer.type === 'image' && layer.image_path) {
      const img = new window.Image();
      img.onload = () => {
        debouncedUpdateThumbnail(sceneId);
      };
      img.onerror = () => {
        debouncedUpdateThumbnail(sceneId);
      };
      img.src = layer.image_path;
    } else {
      debouncedUpdateThumbnail(sceneId);
    }
  },
  updateLayer: (sceneId: string, layer: Layer) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? {
        ...s,
        layers: (s.layers || []).map(l => l.id === layer.id ? layer : l)
      } : s)
    }));
    
    // Generate layer snapshot in background with scene context
    const state = useSceneStore.getState();
    const scene = state.scenes.find(s => s.id === sceneId);
    
    if (scene) {
      generateLayerSnapshotDebounced(layer, (cachedImage) => {
        if (cachedImage) {
          set(state => ({
            scenes: state.scenes.map(s => s.id === sceneId ? {
              ...s,
              layers: (s.layers || []).map(l => l.id === layer.id ? { ...l, cachedImage } : l)
            } : s)
          }));
        }
      }, 300, {
        sceneWidth: scene.sceneWidth || 1920,
        sceneHeight: scene.sceneHeight || 1080,
        sceneBackgroundImage: scene.backgroundImage || null,
      });
    }
    
    debouncedUpdateThumbnail(sceneId);
  },
  updateLayerProperty: (sceneId: string, layerId: string, property: string, value: any) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? {
        ...s,
        layers: (s.layers || []).map(l => {
          if (l.id !== layerId) return l;
          
          let updatedLayer = { ...l, [property]: value };
          
          // If scale properties are being changed, also update width/height
          if (property === 'scaleX' || property === 'scaleY') {
            const currentWidth = l.width || 100;
            const currentHeight = l.height || 100;
            const currentScaleX = l.scaleX || 1.0;
            const currentScaleY = l.scaleY || 1.0;
            
            if (property === 'scaleX') {
              // Calculate new width based on scale change
              const scaleFactor = value / currentScaleX;
              updatedLayer.width = currentWidth * scaleFactor;
            } else if (property === 'scaleY') {
              // Calculate new height based on scale change
              const scaleFactor = value / currentScaleY;
              updatedLayer.height = currentHeight * scaleFactor;
            }
          }
          
          // If text_config is being updated and layer is text, recalculate dimensions
          if (property === 'text_config' && l.type === 'text') {
            const textConfig = value;
            const text = textConfig.text || 'Votre texte ici';
            const fontSize = textConfig.size || 48;
            const lineHeight = textConfig.line_height || 1.2;
            
            // Estimate text dimensions
            const avgCharWidth = fontSize * 0.6;
            const lines = text.split('\n');
            const maxLineLength = Math.max(...lines.map((line: string) => line.length));
            const estimatedWidth = maxLineLength * avgCharWidth;
            const estimatedHeight = lines.length * fontSize * lineHeight;
            
            updatedLayer.width = estimatedWidth;
            updatedLayer.height = estimatedHeight;
          }
          
          // If position is being updated, also recalculate camera_position
          if (property === 'position' && updatedLayer.position) {
            updatedLayer = updateLayerCameraPosition(
              updatedLayer, 
              s.sceneCameras || [],
              s.sceneWidth || 1920,
              s.sceneHeight || 1080
            );
          }
          
          return updatedLayer;
        })
      } : s)
    }));
    
    // Regenerate layer snapshot if property affects visual appearance
    const state = useSceneStore.getState();
    const scene = state.scenes.find(s => s.id === sceneId);
    const layer = scene?.layers?.find(l => l.id === layerId);
    
    if (layer && scene && shouldRegenerateSnapshot(property, layer.type)) {
      generateLayerSnapshotDebounced(layer, (cachedImage) => {
        if (cachedImage) {
          set(state => ({
            scenes: state.scenes.map(s => s.id === sceneId ? {
              ...s,
              layers: (s.layers || []).map(l => l.id === layerId ? { ...l, cachedImage } : l)
            } : s)
          }));
        }
      }, 300, {
        sceneWidth: scene.sceneWidth || 1920,
        sceneHeight: scene.sceneHeight || 1080,
        sceneBackgroundImage: scene.backgroundImage || null,
      });
    }
    
    // Only update thumbnail if property affects visual appearance
    const visualProperties = ['position', 'scale', 'opacity', 'image_path', 'text', 'locked', 'scaleX', 'scaleY', 'width', 'height'];
    if (visualProperties.includes(property)) {
      debouncedUpdateThumbnail(sceneId);
    }
  },
  deleteLayer: (sceneId: string, layerId: string) => {
    set(state => ({
      scenes: state.scenes.map(s => s.id === sceneId ? {
        ...s,
        layers: (s.layers || []).filter(l => l.id !== layerId)
      } : s)
    }));
    debouncedUpdateThumbnail(sceneId);
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
    debouncedUpdateThumbnail(sceneId);
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
    
    // Generate layer snapshot in background for duplicated layer with scene context
    const state = useSceneStore.getState();
    const scene = state.scenes.find(s => s.id === sceneId);
    
    if (scene) {
      generateLayerSnapshotDebounced(layer, (cachedImage) => {
        if (cachedImage) {
          set(state => ({
            scenes: state.scenes.map(s => s.id === sceneId ? {
              ...s,
              layers: (s.layers || []).map(l => l.id === layer.id ? { ...l, cachedImage } : l)
            } : s)
          }));
        }
      }, 300, {
        sceneWidth: scene.sceneWidth || 1920,
        sceneHeight: scene.sceneHeight || 1080,
        sceneBackgroundImage: scene.backgroundImage || null,
      });
    }
    
    debouncedUpdateThumbnail(sceneId);
  },

  // Generate and update the scene thumbnail in real time (async, does not block UI)
  updateSceneThumbnail: async (sceneId: string) => {
    const state = useSceneStore.getState();
    const scene = state.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    const thumbnail = await generateSceneThumbnail(scene);
    console.log('Generated thumbnail for scene', sceneId, thumbnail);
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
  setSelectedSceneIndex: (index) => set({ 
    selectedSceneIndex: index,
    // Clear layer selection when changing scenes to prevent stale selections
    selectedLayerId: null,
    selectedLayerIds: []
  }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id, selectedLayerIds: id ? [id] : [] }),
  setSelectedLayerIds: (ids) => set({ 
    selectedLayerIds: ids,
    selectedLayerId: ids.length === 1 ? ids[0] : (ids.length > 0 ? ids[0] : null)
  }),
  toggleLayerSelection: (id) => set((state) => {
    const currentIds = state.selectedLayerIds;
    const isSelected = currentIds.includes(id);
    const newIds = isSelected 
      ? currentIds.filter(layerId => layerId !== id)
      : [...currentIds, id];
    return {
      selectedLayerIds: newIds,
      selectedLayerId: newIds.length === 1 ? newIds[0] : (newIds.length > 0 ? newIds[0] : null)
    };
  }),
  clearSelection: () => set({ selectedLayerId: null, selectedLayerIds: [] }),
  setShowAssetLibrary: (show) => set({ showAssetLibrary: show }),
  setShowShapeToolbar: (show) => set({ showShapeToolbar: show }),
  setShowShapeLibrary: (show) => set({ showShapeLibrary: show }),
  setShowCropModal: (show) => set({ showCropModal: show }),
  setShowHistoryPanel: (show) => set({ showHistoryPanel: show }),
  setPendingImageData: (data) => set({ pendingImageData: data }),
  
  // Preview Actions
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setPreviewVideoUrl: (url) => set({ previewVideoUrl: url }),
  setPreviewType: (type) => set({ previewType: type }),
  setPreviewLoading: (loading) => set({ previewLoading: loading }),
  setPreviewStartSceneIndex: (index) => set({ previewStartSceneIndex: index }),
  startPreview: (videoUrl, type) => set({ 
    previewMode: true, 
    previewVideoUrl: videoUrl, 
    previewType: type,
    previewLoading: false
  }),
  stopPreview: () => set({ 
    previewMode: false, 
    previewVideoUrl: null, 
    previewType: null,
    previewLoading: false,
    previewStartSceneIndex: null
  }),
  
  // Projection Screen Actions
  setProjectionScreen: (width, height) => set({ 
    projectionScreenWidth: width,
    projectionScreenHeight: height 
  }),
  
  reset: () => set({ ...initialDataState, ...initialUIState }),
}));
