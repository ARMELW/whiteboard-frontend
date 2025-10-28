import { useSceneStore } from '@/app/scenes';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import { useState, useCallback, useEffect, useRef } from 'react';

export interface LayerEditorState {
  editedScene: any;
  showThumbnailMaker: boolean;
}

export interface LayerEditorOptions {
  scene: any;
  selectedLayerId?: string | null;
  onSelectLayer?: (layerId: string | null) => void;
}

export const useLayerEditor = ({ 
  scene, 
  selectedLayerId: externalSelectedLayerId,
  onSelectLayer: externalOnSelectLayer 
}: LayerEditorOptions) => {
  const [editedScene, setEditedScene] = useState(scene);
  const [internalSelectedLayerId, setInternalSelectedLayerId] = useState<string | null>(null);
  const [showThumbnailMaker, setShowThumbnailMaker] = useState(false);
  const { updateSceneProperty, updateLayer, addLayer } = useScenesActionsWithHistory();
  
  // Track pending layer updates to debounce API calls
  const pendingLayerUpdatesRef = useRef<Map<string, any>>(new Map());
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedLayerId = externalSelectedLayerId !== undefined ? externalSelectedLayerId : internalSelectedLayerId;
  
  const setSelectedLayerId = useCallback((layerId: string | null) => {
    if (externalOnSelectLayer) {
      externalOnSelectLayer(layerId);
    } else {
      setInternalSelectedLayerId(layerId);
    }
  }, [externalOnSelectLayer]);

  // Track the current scene ID to detect scene changes
  const currentSceneIdRef = useRef<string | null>(null);
  const isMountedRef = useRef<boolean>(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    // Only flush and update when the scene ID actually changes
    const sceneId = scene?.id;
    
    if (currentSceneIdRef.current !== sceneId) {
      const previousSceneId = currentSceneIdRef.current;
      currentSceneIdRef.current = sceneId;
      
      // Flush any pending layer updates before switching scenes
      const flushPendingUpdates = async () => {
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
          updateTimerRef.current = null;
        }
        
        const updates = Array.from(pendingLayerUpdatesRef.current.values());
        pendingLayerUpdatesRef.current.clear();
        
        // Execute updates sequentially to avoid race conditions
        for (const update of updates) {
          // Check if component is still mounted and scene hasn't changed again
          if (!isMountedRef.current || currentSceneIdRef.current !== sceneId) {
            console.log('[useLayerEditor] Cancelling flush - scene changed or component unmounted');
            break;
          }
          
          try {
            await updateLayer(update);
          } catch (error) {
            console.error('[useLayerEditor] Failed to flush pending update:', error);
          }
        }
      };
      
      flushPendingUpdates().then(() => {
        // Only update state if still mounted and on the same scene
        if (isMountedRef.current && currentSceneIdRef.current === sceneId) {
          setEditedScene(scene);
          // Clear selection when scene changes - it will be handled by the store
          setSelectedLayerId(null);
        }
      });
    } else {
      // Scene ID hasn't changed, just update the scene data
      setEditedScene(scene);
      // If the selected layer is no longer in the scene, deselect it
      if (selectedLayerId && !scene?.layers?.some((l: any) => l.id === selectedLayerId)) {
        setSelectedLayerId(null);
      }
    }
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [scene, selectedLayerId, setSelectedLayerId, updateLayer]);

  const handleChange = useCallback((field: string, value: any) => {
    setEditedScene((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const handleUpdateScene = useCallback((updates: any) => {
    setEditedScene((prev: any) => {
      const newScene = { ...prev, ...updates };
      
      // Persist sceneCameras to store if they are updated (with history tracking)
      if (updates.sceneCameras && prev.id) {
        updateSceneProperty(prev.id, 'sceneCameras', updates.sceneCameras);
      }
      
      return newScene;
    });
  }, [updateSceneProperty]);

  const handleUpdateLayer = useCallback((updatedLayer: any) => {
    setEditedScene((prev: any) => {
      const newLayers = prev.layers.map((layer: any) =>
        layer.id === updatedLayer.id ? updatedLayer : layer
      );
      const newScene = { ...prev, layers: newLayers };
      
      // Debounce layer updates to avoid excessive API calls during drag/transform
      if (prev.id) {
        // Store the pending update - this ensures only the latest update per layer is kept
        pendingLayerUpdatesRef.current.set(updatedLayer.id, { sceneId: prev.id, layer: updatedLayer });
        
        // Clear existing timer
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
        }
        
        // Set new timer to batch updates
        updateTimerRef.current = setTimeout(async () => {
          // Process all pending updates
          const updates = Array.from(pendingLayerUpdatesRef.current.values());
          pendingLayerUpdatesRef.current.clear();
          updateTimerRef.current = null;
          
          // Execute updates sequentially to avoid race conditions
          for (const update of updates) {
            try {
              await updateLayer(update);
            } catch (error) {
              console.error('[useLayerEditor] Failed to update layer:', error);
            }
          }
        }, 100); // 100ms debounce
      }
      
      return newScene;
    });
  }, [updateLayer]);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
        updateTimerRef.current = null;
      }
      
      // Flush any pending updates synchronously on unmount
      // Note: We can't use async in cleanup, so we trigger the updates without waiting
      const updates = Array.from(pendingLayerUpdatesRef.current.values());
      pendingLayerUpdatesRef.current.clear();
      
      updates.forEach((update) => {
        updateLayer(update).catch(error => {
          console.error('[useLayerEditor] Failed to flush update on unmount:', error);
        });
      });
    };
  }, [updateLayer]);

  const handleAddLayer = useCallback(async (newLayer: any) => {
    // First, update local state immediately for responsive UI
    setEditedScene((prev: any) => {
      const updated = {
        ...prev,
        layers: [...prev.layers, newLayer]
      };
      return updated;
    });
    setSelectedLayerId(newLayer.id);
    
    // Then persist to backend (ensuring completion before allowing scene changes)
    // This is wrapped in a try-catch to handle errors gracefully
    try {
      const sceneId = useSceneStore.getState().scenes[useSceneStore.getState().selectedSceneIndex]?.id;
      if (sceneId) {
        await addLayer({ sceneId, layer: newLayer });
      }
    } catch (error) {
      console.error('[useLayerEditor] Failed to persist layer:', error);
      // Optionally: show error toast to user
      // For now, layer remains in local state even if backend fails
    }
  }, [setSelectedLayerId, addLayer]);

  const handleDeleteLayer = useCallback((layerId: string) => {
    setEditedScene((prev: any) => ({
      ...prev,
      layers: prev.layers.filter((layer: any) => layer.id !== layerId)
    }));
    setSelectedLayerId(null);
  }, [setSelectedLayerId]);

  const handleDuplicateLayer = useCallback((layerId: string) => {
    setEditedScene((prev: any) => {
      const layerToDuplicate = prev.layers.find((l: any) => l.id === layerId);
      if (!layerToDuplicate) return prev;

      const duplicatedLayer = {
        ...layerToDuplicate,
        id: `layer-${Date.now()}`,
        name: `${layerToDuplicate.name} (Copie)`,
        position: {
          x: (layerToDuplicate.position?.x || 0) + 20,
          y: (layerToDuplicate.position?.y || 0) + 20,
        }
      };

      return {
        ...prev,
        layers: [...prev.layers, duplicatedLayer]
      };
    });
  }, []);

  const handleMoveLayer = useCallback((layerId: string, direction: 'up' | 'down') => {
    setEditedScene((prev: any) => {
      const currentIndex = prev.layers.findIndex((l: any) => l.id === layerId);
      if (currentIndex === -1) return prev;

      const newLayers = [...prev.layers];
      if (direction === 'up' && currentIndex > 0) {
        [newLayers[currentIndex], newLayers[currentIndex - 1]] = 
          [newLayers[currentIndex - 1], newLayers[currentIndex]];
      } else if (direction === 'down' && currentIndex < newLayers.length - 1) {
        [newLayers[currentIndex], newLayers[currentIndex + 1]] = 
          [newLayers[currentIndex + 1], newLayers[currentIndex]];
      }

      newLayers.forEach((layer, index) => {
        layer.z_index = index + 1;
      });

      return {
        ...prev,
        layers: newLayers
      };
    });
  }, []);

  const handleLayerPropertyChange = useCallback((layerId: string, property: string, value: any) => {
    setEditedScene((prev: any) => {
      const newLayers = prev.layers.map((layer: any) =>
        layer.id === layerId ? { ...layer, [property]: value } : layer
      );
      const newScene = { ...prev, layers: newLayers };

      // Debounce property updates similar to layer updates
      if (prev.id) {
        const updatedLayer = newLayers.find((l: any) => l.id === layerId);
        if (updatedLayer) {
          // Store the pending update - this ensures only the latest update per layer is kept
          pendingLayerUpdatesRef.current.set(layerId, { sceneId: prev.id, layer: updatedLayer });
          
          // Clear existing timer
          if (updateTimerRef.current) {
            clearTimeout(updateTimerRef.current);
          }
          
          // Set new timer to batch updates
          updateTimerRef.current = setTimeout(async () => {
            // Process all pending updates
            const updates = Array.from(pendingLayerUpdatesRef.current.values());
            pendingLayerUpdatesRef.current.clear();
            updateTimerRef.current = null;
            
            // Execute updates sequentially to avoid race conditions
            for (const update of updates) {
              try {
                await updateLayer(update);
              } catch (error) {
                console.error('[useLayerEditor] Failed to update layer property:', error);
              }
            }
          }, 100); // 100ms debounce
        }
      }
      
      return newScene;
    });
  }, [updateLayer]);

  const selectedLayer = editedScene?.layers?.find((layer: any) => layer.id === selectedLayerId);

  return {
    editedScene,
    setEditedScene,
    selectedLayerId,
    setSelectedLayerId,
    selectedLayer,
    showThumbnailMaker,
    setShowThumbnailMaker,
    handleChange,
    handleUpdateScene,
    handleUpdateLayer,
    handleAddLayer,
    handleDeleteLayer,
    handleDuplicateLayer,
    handleMoveLayer,
    handleLayerPropertyChange
  };
};