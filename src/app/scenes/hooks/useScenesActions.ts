import { useSceneStore } from '../store';
import { ScenePayload, Layer, Camera } from '../types';
import scenesService from '../api/scenesService';

export const useScenesActions = () => {
  const addScene = useSceneStore((state) => state.addScene);
  const updateScene = useSceneStore((state) => state.updateScene);
  const deleteScene = useSceneStore((state) => state.deleteScene);
  const reorderScenes = useSceneStore((state) => state.reorderScenes);
  const addLayer = useSceneStore((state) => state.addLayer);
  const updateLayer = useSceneStore((state) => state.updateLayer);
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
    updateScene: async (scene: any) => updateScene(scene),
    deleteScene,
    reorderScenes,
    addLayer: async (params: { sceneId: string; layer: Layer }) => addLayer(params.sceneId, params.layer),
    updateLayer: async (params: { sceneId: string; layer: Layer }) => updateLayer(params.sceneId, params.layer),
    deleteLayer: async (params: { sceneId: string; layerId: string }) => deleteLayer(params.sceneId, params.layerId),
    addCamera: async (params: { sceneId: string; camera: Camera }) => addCamera(params.sceneId, params.camera),
    moveLayer: async (params: { sceneId: string; from: number; to: number }) => moveLayer(params.sceneId, params.from, params.to),
    duplicateLayer: async (params: { sceneId: string; layer: Layer }) => duplicateLayer(params.sceneId, params.layer),
    isCreating: loading,
    isUpdating: loading,
    isDeleting: loading,
    isDuplicating: loading,
    isReordering: loading,
    invalidate: () => Promise.resolve(), // No longer needed with Zustand
  };
};
