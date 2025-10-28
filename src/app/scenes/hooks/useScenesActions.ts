import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSceneStore } from '../store';
import { ScenePayload, Layer, Camera } from '../types';
import scenesService from '../api/scenesService';
import { scenesKeys } from '../config';

export const useScenesActions = () => {
  const queryClient = useQueryClient();
  
  // UI state from store
  const addSceneToStore = useSceneStore((state) => state.addScene);
  const updateSceneInStore = useSceneStore((state) => state.updateScene);
  const updateSceneProperty = useSceneStore((state) => state.updateSceneProperty);
  const deleteSceneFromStore = useSceneStore((state) => state.deleteScene);
  const reorderScenesInStore = useSceneStore((state) => state.reorderScenes);
  const addLayerToStore = useSceneStore((state) => state.addLayer);
  const updateLayerInStore = useSceneStore((state) => state.updateLayer);
  const updateLayerProperty = useSceneStore((state) => state.updateLayerProperty);
  const deleteLayerFromStore = useSceneStore((state) => state.deleteLayer);
  const addCameraToStore = useSceneStore((state) => state.addCamera);
  const moveLayerInStore = useSceneStore((state) => state.moveLayer);
  const duplicateLayerInStore = useSceneStore((state) => state.duplicateLayer);

  const createMutation = useMutation({
    mutationFn: (payload?: ScenePayload) => scenesService.create(payload),
    onSuccess: (scene) => {
      queryClient.invalidateQueries({ queryKey: scenesKeys.lists() });
      addSceneToStore(scene);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      scenesService.update(id, data),
    onSuccess: (scene) => {
      queryClient.invalidateQueries({ queryKey: scenesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scenesKeys.detail(scene.id) });
      updateSceneInStore(scene);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => scenesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: scenesKeys.lists() });
      queryClient.removeQueries({ queryKey: scenesKeys.detail(id) });
      deleteSceneFromStore(id);
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => scenesService.duplicate(id),
    onSuccess: (scene, sceneId) => {
      queryClient.invalidateQueries({ queryKey: scenesKeys.lists() });
      const scenes = useSceneStore.getState().scenes;
      const sceneIndex = scenes.findIndex(s => s.id === sceneId);
      addSceneToStore(scene, sceneIndex);
    },
  });

  const addLayerMutation = useMutation({
    mutationFn: ({ sceneId, layer }: { sceneId: string; layer: Layer }) =>
      scenesService.addLayer(sceneId, layer),
    onSuccess: (scene) => {
      // Update the store with the returned scene (which includes the new layer)
      // This prevents the issue where refetch overwrites local changes
      updateSceneInStore(scene);
      
      // Invalidate queries to keep cache in sync, but don't auto-refetch
      // as we've already updated the store with the correct data
      queryClient.invalidateQueries({ 
        queryKey: scenesKeys.lists(),
        refetchType: 'none' // Don't auto-refetch, just mark as stale
      });
    },
  });

  const updateLayerMutation = useMutation({
    mutationFn: ({ sceneId, layerId, layerData }: { sceneId: string; layerId: string; layerData: Partial<Layer> }) =>
      scenesService.updateLayer(sceneId, layerId, layerData),
    onSuccess: (scene) => {
      // Update the store with the returned scene (which includes the updated layer)
      // This prevents the issue where refetch overwrites local changes
      updateSceneInStore(scene);
      
      // Invalidate queries to keep cache in sync, but don't auto-refetch
      queryClient.invalidateQueries({ 
        queryKey: scenesKeys.lists(),
        refetchType: 'none' // Don't auto-refetch, just mark as stale
      });
    },
  });

  const deleteLayerMutation = useMutation({
    mutationFn: ({ sceneId, layerId }: { sceneId: string; layerId: string }) =>
      scenesService.deleteLayer(sceneId, layerId),
    onSuccess: (scene) => {
      // Update the store with the returned scene (which excludes the deleted layer)
      // This prevents the issue where refetch overwrites local changes
      updateSceneInStore(scene);
      
      // Invalidate queries to keep cache in sync, but don't auto-refetch
      queryClient.invalidateQueries({ 
        queryKey: scenesKeys.lists(),
        refetchType: 'none' // Don't auto-refetch, just mark as stale
      });
    },
  });

  const addCameraMutation = useMutation({
    mutationFn: ({ sceneId, camera }: { sceneId: string; camera: Camera }) =>
      scenesService.addCamera(sceneId, camera),
    onSuccess: (scene) => {
      // Update the store with the returned scene (which includes the new camera)
      // This prevents the issue where refetch overwrites local changes
      updateSceneInStore(scene);
      
      // Invalidate queries to keep cache in sync, but don't auto-refetch
      queryClient.invalidateQueries({ 
        queryKey: scenesKeys.lists(),
        refetchType: 'none' // Don't auto-refetch, just mark as stale
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (sceneIds: string[]) => scenesService.reorder(sceneIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scenesKeys.lists() });
    },
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: scenesKeys.lists(),
      refetchType: 'all',
    });
  };

  return {
    createScene: async (payload?: ScenePayload) => {
      console.log('[useScenesActions] createScene with payload:', payload);
      return await createMutation.mutateAsync(payload);
    },
    updateScene: async (sceneOrUpdate: any) => {
      // Handle both formats: full scene object or { id, data } partial update
      if (sceneOrUpdate.data && sceneOrUpdate.id) {
        // Partial update format: { id, data: { field: value } }
        return await updateMutation.mutateAsync(sceneOrUpdate);
      } else {
        // Full scene object
        const { id, ...data } = sceneOrUpdate;
        return await updateMutation.mutateAsync({ id, data });
      }
    },
    updateSceneProperty: (sceneId: string, property: string, value: any) => {
      updateSceneProperty(sceneId, property, value);
      // Also update backend
      updateMutation.mutate({ id: sceneId, data: { [property]: value } });
    },
    deleteScene: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    reorderScenes: async (sceneIds: string[]) => {
      reorderScenesInStore(sceneIds);
      await reorderMutation.mutateAsync(sceneIds);
    },
    addLayer: async (params: { sceneId: string; layer: Layer }) => {
      // Note: Store update is handled by useScenesActionsWithHistory via addLayerWithHistory
      // The mutation's onSuccess will sync the final state from the API
      await addLayerMutation.mutateAsync(params);
    },
    updateLayer: async (params: { sceneId: string; layer: Layer }) => {
      // Note: Store update is handled by useScenesActionsWithHistory via updateLayerWithHistory
      // The mutation's onSuccess will sync the final state from the API
      await updateLayerMutation.mutateAsync({ 
        sceneId: params.sceneId, 
        layerId: params.layer.id, 
        layerData: params.layer 
      });
    },
    updateLayerProperty: (sceneId: string, layerId: string, property: string, value: any) => {
      updateLayerProperty(sceneId, layerId, property, value);
      // Also update backend
      updateLayerMutation.mutate({ 
        sceneId, 
        layerId, 
        layerData: { [property]: value } 
      });
    },
    deleteLayer: async (params: { sceneId: string; layerId: string }) => {
      // Note: Store update is handled by useScenesActionsWithHistory via deleteLayerWithHistory
      // The mutation's onSuccess will sync the final state from the API
      await deleteLayerMutation.mutateAsync(params);
    },
    addCamera: async (params: { sceneId: string; camera: Camera }) => {
      // Note: Store update is handled by useScenesActionsWithHistory via addCameraWithHistory
      // The mutation's onSuccess will sync the final state from the API
      await addCameraMutation.mutateAsync(params);
    },
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
        
        moveLayerInStore(params.sceneId, currentIndex, newIndex);
      } else if (params.from !== undefined && params.to !== undefined) {
        moveLayerInStore(params.sceneId, params.from, params.to);
      }
    },
    duplicateLayer: async (params: { sceneId: string; layerId?: string; layer?: Layer }) => {
      // Support both API styles: {layerId} or {layer}
      let layerToDuplicate: Layer | undefined;
      let layerIndex: number = -1;
      
      if (params.layerId) {
        const scenes = useSceneStore.getState().scenes;
        const scene = scenes.find(s => s.id === params.sceneId);
        if (scene?.layers) {
          layerIndex = scene.layers.findIndex(l => l.id === params.layerId);
          layerToDuplicate = scene.layers[layerIndex];
        }
      } else if (params.layer) {
        layerToDuplicate = params.layer;
        // Try to find the index of the layer in the scene
        const scenes = useSceneStore.getState().scenes;
        const scene = scenes.find(s => s.id === params.sceneId);
        if (scene?.layers) {
          layerIndex = scene.layers.findIndex(l => l.id === params.layer.id);
        }
      }
      
      if (!layerToDuplicate) return;
      
      // Deep copy the layer to ensure all nested properties are duplicated
      const newLayer: Layer = JSON.parse(JSON.stringify(layerToDuplicate));
      newLayer.id = `${Date.now()}-${Math.random()}`;
      newLayer.name = `${layerToDuplicate.name} (copie)`;
      // Offset position slightly to make it visible
      if (newLayer.position) {
        newLayer.position = {
          x: newLayer.position.x + 20,
          y: newLayer.position.y + 20
        };
      }
      
      // Insert the duplicated layer right after the original layer
      duplicateLayerInStore(params.sceneId, newLayer, layerIndex);
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDuplicating: duplicateMutation.isPending,
    isReordering: reorderMutation.isPending,
    invalidate,

    // Ajout duplication de scène
    duplicateScene: async (sceneId: string) => {
      return await duplicateMutation.mutateAsync(sceneId);
    },
  };
};
