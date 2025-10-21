import { useSceneStore } from '../store';
import { ScenePayload, Layer, Camera } from '../types';

export const useScenesActions = () => {
  const createScene = useSceneStore((state) => state.createScene);
  const updateScene = useSceneStore((state) => state.updateScene);
  const deleteScene = useSceneStore((state) => state.deleteScene);
  const duplicateScene = useSceneStore((state) => state.duplicateScene);
  const reorderScenes = useSceneStore((state) => state.reorderScenes);
  const addLayer = useSceneStore((state) => state.addLayer);
  const updateLayer = useSceneStore((state) => state.updateLayer);
  const deleteLayer = useSceneStore((state) => state.deleteLayer);
  const addCamera = useSceneStore((state) => state.addCamera);
  const moveLayer = useSceneStore((state) => state.moveLayer);
  const duplicateLayer = useSceneStore((state) => state.duplicateLayer);
  const loading = useSceneStore((state) => state.loading);

  return {
    createScene: async (payload?: ScenePayload) => createScene(payload),
    updateScene: async (variables: { id: string; data: any; skipCacheUpdate?: boolean }) => 
      updateScene(variables.id, variables.data, variables.skipCacheUpdate),
    deleteScene,
    duplicateScene,
    reorderScenes,
    addLayer: async (params: { sceneId: string; layer: Layer }) => 
      addLayer(params.sceneId, params.layer),
    updateLayer: async (params: { sceneId: string; layerId: string; data: Partial<Layer> }) => 
      updateLayer(params.sceneId, params.layerId, params.data),
    deleteLayer: async (params: { sceneId: string; layerId: string }) => 
      deleteLayer(params.sceneId, params.layerId),
    addCamera: async (params: { sceneId: string; camera: Camera }) => 
      addCamera(params.sceneId, params.camera),
    moveLayer: async (params: { sceneId: string; layerId: string; direction: 'up' | 'down' }) => 
      moveLayer(params.sceneId, params.layerId, params.direction),
    duplicateLayer: async (params: { sceneId: string; layerId: string }) => 
      duplicateLayer(params.sceneId, params.layerId),
    isCreating: loading,
    isUpdating: loading,
    isDeleting: loading,
    isDuplicating: loading,
    isReordering: loading,
    invalidate: () => Promise.resolve(), // No longer needed with Zustand
  };
};
