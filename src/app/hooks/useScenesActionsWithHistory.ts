import { useHistoryActions } from '../history/hooks/useHistoryActions';
import { useScenesActions } from '../scenes/hooks/useScenesActions';
import { Scene, Layer, Camera } from '../scenes/types';
import { useSceneStore } from '../scenes/store';

/**
 * Enhanced scenes actions that automatically record history
 * This is a drop-in replacement for useScenesActions that adds history tracking
 */
export const useScenesActionsWithHistory = () => {
  // Get standard actions for non-history operations (like loading data)
  const standardActions = useScenesActions();
  
  // Get history-aware actions
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
    // Scene operations with history
    addScene: (scene: Scene) => addSceneWithHistory(scene),
    updateScene: (scene: Scene) => updateSceneWithHistory(scene),
    deleteScene: (sceneId: string) => deleteSceneWithHistory(sceneId),
    reorderScenes: (sceneIds: string[]) => reorderScenesWithHistory(sceneIds),
    
    // Layer operations with history
    addLayer: (params: { sceneId: string; layer: Layer }) => 
      addLayerWithHistory(params.sceneId, params.layer),
    updateLayer: (params: { sceneId: string; layer: Layer }) => 
      updateLayerWithHistory(params.sceneId, params.layer),
    deleteLayer: (params: { sceneId: string; layerId: string }) => 
      deleteLayerWithHistory(params.sceneId, params.layerId),
    moveLayer: (params: { sceneId: string; layerId?: string; from?: number; to?: number; direction?: 'up' | 'down' }) => {
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
      } else if (params.from !== undefined && params.to !== undefined) {
        moveLayerWithHistory(params.sceneId, params.from, params.to);
      }
    },
    duplicateLayer: (params: { sceneId: string; layerId?: string; layer?: Layer }) => {
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
      
      duplicateLayerWithHistory(params.sceneId, newLayer);
    },
    
    // Property operations with history
    // Note: Using 'any' for value type to support the flexible property system
    // where layers can have dynamic properties. Consider using a more specific
    // union type if the set of possible properties becomes well-defined.
    updateSceneProperty: (sceneId: string, property: string, value: any) => 
      updateScenePropertyWithHistory(sceneId, property, value),
    updateLayerProperty: (sceneId: string, layerId: string, property: string, value: any) => 
      updateLayerPropertyWithHistory(sceneId, layerId, property, value),
    
    // Camera operations with history
    addCamera: (params: { sceneId: string; camera: Camera }) => 
      addCameraWithHistory(params.sceneId, params.camera),
    
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
