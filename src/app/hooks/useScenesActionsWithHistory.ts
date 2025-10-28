import { useHistoryActions } from '../history/hooks/useHistoryActions';
import { useScenesActions } from '../scenes/hooks/useScenesActions';
import { Scene, Layer, Camera } from '../scenes/types';
import { useSceneStore } from '../scenes/store';
import { v4 as uuidv4 } from 'uuid';

// Constants for layer duplication
const DUPLICATE_LAYER_OFFSET = { x: 20, y: 20 };

/**
 * Enhanced scenes actions that automatically record history
 * This is a drop-in replacement for useScenesActions that adds history tracking
 */
export const useScenesActionsWithHistory = () => {
  // Get standard actions for API operations
  const standardActions = useScenesActions();
  
  // Get history-aware actions for local store updates
  const {
    addSceneWithHistory,
    updateSceneWithHistory,
    deleteSceneWithHistory,
    reorderScenesWithHistory,
    addLayerWithHistory,
    updateLayerWithHistory,
    deleteLayerWithHistory,
    moveLayerWithHistory,
    duplicateLayerWithHistory,
    updateScenePropertyWithHistory,
    updateLayerPropertyWithHistory,
    addCameraWithHistory,
  } = useHistoryActions();
  
  return {
    // Scene operations with history - calls both history tracking AND API
    addScene: async (scene: Scene) => {
      addSceneWithHistory(scene);
      // Note: createScene is handled by standardActions.createScene
    },
    updateScene: async (scene: Scene) => {
      updateSceneWithHistory(scene);
      await standardActions.updateScene(scene);
    },
    deleteScene: async (sceneId: string) => {
      deleteSceneWithHistory(sceneId);
      await standardActions.deleteScene(sceneId);
    },
    reorderScenes: async (sceneIds: string[]) => {
      reorderScenesWithHistory(sceneIds);
      await standardActions.reorderScenes(sceneIds);
    },
    
    // Layer operations with history - calls both history tracking AND API
    addLayer: async (params: { sceneId: string; layer: Layer }) => {
      addLayerWithHistory(params.sceneId, params.layer);
      await standardActions.addLayer(params);
    },
    updateLayer: async (params: { sceneId: string; layer: Layer }) => {
      updateLayerWithHistory(params.sceneId, params.layer);
      await standardActions.updateLayer(params);
    },
    deleteLayer: async (params: { sceneId: string; layerId: string }) => {
      deleteLayerWithHistory(params.sceneId, params.layerId);
      await standardActions.deleteLayer(params);
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
        
        moveLayerWithHistory(params.sceneId, currentIndex, newIndex);
        await standardActions.moveLayer(params);
      } else if (params.from !== undefined && params.to !== undefined) {
        moveLayerWithHistory(params.sceneId, params.from, params.to);
        await standardActions.moveLayer(params);
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
      
      // Create a duplicate with a new ID
      const newLayer = {
        ...layerToDuplicate,
        id: uuidv4(),
        name: `${layerToDuplicate.name} (copie)`,
        // Offset position slightly to make it visible
        position: layerToDuplicate.position ? {
          x: layerToDuplicate.position.x + DUPLICATE_LAYER_OFFSET.x,
          y: layerToDuplicate.position.y + DUPLICATE_LAYER_OFFSET.y
        } : undefined
      };
      
      // Insert the duplicated layer right after the original layer
      // This will handle both history tracking AND store update
      duplicateLayerWithHistory(params.sceneId, newLayer, layerIndex);
      
      // Note: We don't call standardActions.duplicateLayer here because
      // duplicateLayerWithHistory already handles the store update
      // Calling both would create duplicate layers
    },
    
    // Property operations with history - calls both history tracking AND API
    updateSceneProperty: (sceneId: string, property: string, value: any) => {
      updateScenePropertyWithHistory(sceneId, property, value);
      standardActions.updateSceneProperty(sceneId, property, value);
    },
    updateLayerProperty: (sceneId: string, layerId: string, property: string, value: any) => {
      updateLayerPropertyWithHistory(sceneId, layerId, property, value);
      standardActions.updateLayerProperty(sceneId, layerId, property, value);
    },
    
    // Camera operations with history - calls both history tracking AND API
    addCamera: async (params: { sceneId: string; camera: Camera }) => {
      addCameraWithHistory(params.sceneId, params.camera);
      await standardActions.addCamera(params);
    },
    
    // Re-export other actions from standard hook that don't need history
    createScene: standardActions.createScene,
    duplicateScene: standardActions.duplicateScene,
    
    // Loading states
    isCreating: standardActions.isCreating,
    isUpdating: standardActions.isUpdating,
    isDeleting: standardActions.isDeleting,
    isDuplicating: standardActions.isDuplicating,
    isReordering: standardActions.isReordering,
    
    invalidate: standardActions.invalidate,
  };
};
