import { useMutation, useQueryClient } from '@tanstack/react-query';
import scenesService from '../api/scenesService';
import { scenesKeys } from '../config';
import { Scene, ScenePayload, Layer, Camera } from '../types';
import { generateSceneThumbnail } from '../../../utils/sceneThumbnail';

export const useScenesActions = () => {
  const queryClient = useQueryClient();

  const invalidateScenes = () => {
    // Maintenu pour compatibilité mais évité autant que possible.
    return queryClient.invalidateQueries({
      queryKey: scenesKeys.lists(),
      refetchType: 'all'
    });
  };

  const updateSceneThumbnail = async (scene: Scene): Promise<Scene | null> => {
    try {
      const thumbnail = await generateSceneThumbnail(scene);
      if (thumbnail) {
        const updated = await scenesService.update(scene.id, { sceneImage: thumbnail });
        return updated;
      }
      return null;
    } catch (error) {
      console.error('Failed to generate scene thumbnail:', error);
      return null;
    }
  };

  const createScene = useMutation({
    mutationFn: (payload: ScenePayload = {}) => scenesService.create(payload),
    onSuccess: async (scene) => {
      // Ajouter la nouvelle scène au cache s'il existe
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return [scene];
        return [...old, scene];
      });

      const updated = await updateSceneThumbnail(scene);
      if (updated) {
        queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(s => s.id === updated.id ? updated : s);
        });
      }
    },
  });

  const updateScene = useMutation({
    mutationFn: (variables: { id: string; data: Partial<Scene>; skipCacheUpdate?: boolean }) => 
      scenesService.update(variables.id, variables.data),
    // Optimistic update (skipped when skipCacheUpdate is true)
    onMutate: async (variables: { id: string; data: Partial<Scene>; skipCacheUpdate?: boolean }) => {
      const { id, data, skipCacheUpdate } = variables;
      if (skipCacheUpdate) {
        return { skipped: true };
      }
      await queryClient.cancelQueries({ queryKey: scenesKeys.lists() });
      const previous = queryClient.getQueryData<Scene[] | undefined>(scenesKeys.lists());
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return old;
        return old.map(s => s.id === id ? { ...s, ...data } : s);
      });
      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(scenesKeys.lists(), context.previous);
      }
    },
    onSuccess: async (scene, variables: { id: string; data: Partial<Scene>; skipCacheUpdate?: boolean }) => {
      if ((variables as any)?.skipCacheUpdate) return;
      // Mettre à jour le cache avec la version renvoyée par le service
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return old;
        return old.map(s => s.id === scene.id ? scene : s);
      });

      // Mettre à jour la miniature et le cache si nécessaire
      const updated = await updateSceneThumbnail(scene);
      if (updated) {
        queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(s => s.id === updated.id ? updated : s);
        });
      }
    },
  });

  const deleteScene = useMutation({
    mutationFn: (id: string) => scenesService.delete(id),
    onSuccess: async (resp: any) => {
      // retirer du cache
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return old;
        return old.filter(s => s.id !== resp.id);
      });
    },
  });

  const duplicateScene = useMutation({
    mutationFn: (id: string) => scenesService.duplicate(id),
    onSuccess: async (scene) => {
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return [scene];
        return [...old, scene];
      });
      const updated = await updateSceneThumbnail(scene);
      if (updated) {
        queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(s => s.id === updated.id ? updated : s);
        });
      }
    },
  });

  const reorderScenes = useMutation({
    mutationFn: (sceneIds: string[]) => scenesService.reorder(sceneIds),
    onSuccess: async (scenes) => {
      // scenesService.reorder renvoie la nouvelle liste
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), () => scenes as Scene[]);
    },
  });

  const addLayer = useMutation({
    mutationFn: ({ sceneId, layer }: { sceneId: string; layer: Layer }) => 
      scenesService.addLayer(sceneId, layer),
    onSuccess: async (scene) => {
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return [scene];
        return old.map(s => s.id === scene.id ? scene : s);
      });
      const updated = await updateSceneThumbnail(scene);
      if (updated) {
        queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(s => s.id === updated.id ? updated : s);
        });
      }
    },
  });

  const updateLayer = useMutation({
    mutationFn: ({ sceneId, layerId, data }: { sceneId: string; layerId: string; data: Partial<Layer> }) => 
      scenesService.updateLayer(sceneId, layerId, data),
    onSuccess: async (scene) => {
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return [scene];
        return old.map(s => s.id === scene.id ? scene : s);
      });
      const updated = await updateSceneThumbnail(scene);
      if (updated) {
        queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(s => s.id === updated.id ? updated : s);
        });
      }
    },
  });

  const deleteLayer = useMutation({
    mutationFn: ({ sceneId, layerId }: { sceneId: string; layerId: string }) => 
      scenesService.deleteLayer(sceneId, layerId),
    onSuccess: async (scene) => {
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return [scene];
        return old.map(s => s.id === scene.id ? scene : s);
      });
      const updated = await updateSceneThumbnail(scene);
      if (updated) {
        queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(s => s.id === updated.id ? updated : s);
        });
      }
    },
  });

  const addCamera = useMutation({
    mutationFn: ({ sceneId, camera }: { sceneId: string; camera: Camera }) => 
      scenesService.addCamera(sceneId, camera),
    onSuccess: async (scene) => {
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return [scene];
        return old.map(s => s.id === scene.id ? scene : s);
      });
    },
  });

  const moveLayer = useMutation({
    mutationFn: async ({ sceneId, layerId, direction }: { sceneId: string; layerId: string; direction: 'up' | 'down' }) => {
      const scene = await scenesService.detail(sceneId);
      if (!scene || !scene.layers) return scene;
      
      const layers = [...scene.layers];
      const idx = layers.findIndex(l => l.id === layerId);
      if (idx === -1) return scene;
      
      const newIdx = direction === 'up' ? Math.max(0, idx - 1) : Math.min(layers.length - 1, idx + 1);
      if (newIdx === idx) return scene;
      
      // Move layer
      const [moved] = layers.splice(idx, 1);
      layers.splice(newIdx, 0, moved);
      
      // Update z_index for all layers
      layers.forEach((l, i) => {
        l.z_index = i + 1;
      });
      
      return scenesService.update(sceneId, { ...scene, layers });
    },
    onSuccess: async (scene) => {
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return [scene];
        return old.map(s => s.id === scene.id ? scene : s);
      });
      const updated = await updateSceneThumbnail(scene);
      if (updated) {
        queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(s => s.id === updated.id ? updated : s);
        });
      }
    },
  });

  const duplicateLayer = useMutation({
    mutationFn: async ({ sceneId, layerId }: { sceneId: string; layerId: string }) => {
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
      
      return scenesService.update(sceneId, {
        ...scene,
        layers: [...scene.layers, newLayer],
      });
    },
    onSuccess: async (scene) => {
      queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
        if (!old) return [scene];
        return old.map(s => s.id === scene.id ? scene : s);
      });
      const updated = await updateSceneThumbnail(scene);
      if (updated) {
        queryClient.setQueryData<Scene[] | undefined>(scenesKeys.lists(), (old) => {
          if (!old) return old;
          return old.map(s => s.id === updated.id ? updated : s);
        });
      }
    },
  });

  return {
    createScene: createScene.mutateAsync,
    isCreating: createScene.isPending,
    updateScene: updateScene.mutateAsync,
    isUpdating: updateScene.isPending,
    deleteScene: deleteScene.mutateAsync,
    isDeleting: deleteScene.isPending,
    duplicateScene: duplicateScene.mutateAsync,
    isDuplicating: duplicateScene.isPending,
    reorderScenes: reorderScenes.mutateAsync,
    isReordering: reorderScenes.isPending,
    addLayer: addLayer.mutateAsync,
    updateLayer: updateLayer.mutateAsync,
    deleteLayer: deleteLayer.mutateAsync,
    addCamera: addCamera.mutateAsync,
    moveLayer: moveLayer.mutateAsync,
    duplicateLayer: duplicateLayer.mutateAsync,
    invalidate: invalidateScenes,
  };
};
