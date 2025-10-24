import { useSceneStore } from '../store';
import { ScenePayload, Layer, Camera } from '../types';
import scenesService from '../api/scenesService';

export const useScenesActions = () => {
  const addScene = useSceneStore((state) => state.addScene);
  const updateScene = useSceneStore((state) => state.updateScene);
  const updateSceneProperty = useSceneStore((state) => state.updateSceneProperty);
  const deleteScene = useSceneStore((state) => state.deleteScene);
  const reorderScenes = useSceneStore((state) => state.reorderScenes);
  const addLayer = useSceneStore((state) => state.addLayer);
  const updateLayer = useSceneStore((state) => state.updateLayer);
  const updateLayerProperty = useSceneStore((state) => state.updateLayerProperty);
  const deleteLayer = useSceneStore((state) => state.deleteLayer);
  const addCamera = useSceneStore((state) => state.addCamera);
  const moveLayer = useSceneStore((state) => state.moveLayer);
  const duplicateLayer = useSceneStore((state) => state.duplicateLayer);
  const loading = useSceneStore((state) => state.loading);

  return {
    createScene: async (payload?: ScenePayload) => {
      const scene = await scenesService.create(payload);
      addScene(scene);
      return scene;
    },
    updateScene: async (sceneOrUpdate: any) => {
      // Handle both formats: full scene object or { id, data } partial update
      if (sceneOrUpdate.data && sceneOrUpdate.id) {
        // Partial update format: { id, data: { field: value } }
        const scenes = useSceneStore.getState().scenes;
        const currentScene = scenes.find(s => s.id === sceneOrUpdate.id);
        if (currentScene) {
          const updatedScene = { ...currentScene, ...sceneOrUpdate.data };
          updateScene(updatedScene);
        }
      } else {
        // Full scene object
        updateScene(sceneOrUpdate);
      }
    },
    updateSceneProperty: (sceneId: string, property: string, value: any) => updateSceneProperty(sceneId, property, value),
    deleteScene,
    reorderScenes,
    addLayer: async (params: { sceneId: string; layer: Layer }) => addLayer(params.sceneId, params.layer),
    updateLayer: async (params: { sceneId: string; layer: Layer }) => updateLayer(params.sceneId, params.layer),
    updateLayerProperty: (sceneId: string, layerId: string, property: string, value: any) => updateLayerProperty(sceneId, layerId, property, value),
    deleteLayer: async (params: { sceneId: string; layerId: string }) => deleteLayer(params.sceneId, params.layerId),
    addCamera: async (params: { sceneId: string; camera: Camera }) => addCamera(params.sceneId, params.camera),
    moveLayer: async (params: { sceneId: string; layerId?: string; from?: number; to?: number; direction?: 'up' | 'down' }) => {
      // Support both API styles: {from, to} indices or {layerId, direction}
      if (params.layerId && params.direction) {
        const scenes = useSceneStore.getState().scenes;
        const scene = scenes.find(s => s.id === params.sceneId);
        if (!scene?.layers) return;
        
        const currentIndex = scene.layers.findIndex(l => l.id === params.layerId);
        if (currentIndex === -1) return;
        
        const newIndex = params.direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= scene.layers.length) return;
        
        moveLayer(params.sceneId, currentIndex, newIndex);
      } else if (params.from !== undefined && params.to !== undefined) {
        moveLayer(params.sceneId, params.from, params.to);
      }
    },
    duplicateLayer: async (params: { sceneId: string; layerId?: string; layer?: Layer }) => {
      // Support both API styles: {layerId} or {layer}
      let layerToDuplicate: Layer | undefined;
      
      if (params.layerId) {
        const scenes = useSceneStore.getState().scenes;
        const scene = scenes.find(s => s.id === params.sceneId);
        layerToDuplicate = scene?.layers?.find(l => l.id === params.layerId);
      } else if (params.layer) {
        layerToDuplicate = params.layer;
      }
      
      if (!layerToDuplicate) return;
      
      // Create a duplicate with a new ID
      const newLayer = {
        ...layerToDuplicate,
        id: `${Date.now()}-${Math.random()}`,
        name: `${layerToDuplicate.name} (copie)`,
      };
      
      duplicateLayer(params.sceneId, newLayer);
    },
    isCreating: loading,
    isUpdating: loading,
    isDeleting: loading,
    isDuplicating: loading,
    isReordering: loading,
    invalidate: () => Promise.resolve(), // No longer needed with Zustand

    // Ajout duplication de scène
    duplicateScene: async (sceneId: string) => {
  const duplicated = await scenesService.duplicate(sceneId);
  console.log('[duplicateScene] duplicated:', duplicated);
  addScene(duplicated);
  return duplicated;
    },
  };
};
