import { useHistoryStore } from '../store';
import { ActionType, HistoryAction } from '../types';
import { useSceneStore } from '../../scenes/store';
import { Scene, Layer, Camera } from '../../scenes/types';

export const useHistoryActions = () => {
  const pushAction = useHistoryStore((state) => state.pushAction);
  const sceneStore = useSceneStore.getState();
  
  const createHistoryAction = (
    type: ActionType,
    description: string,
    undo: () => void,
    redo: () => void
  ): HistoryAction => ({
    type,
    timestamp: Date.now(),
    description,
    undo,
    redo,
  });
  
  return {
    // Scene actions
    addSceneWithHistory: (scene: Scene, afterIndex?: number) => {
      const action = createHistoryAction(
        ActionType.ADD_SCENE,
        `Ajouter scène: ${scene.title}`,
        () => {
          sceneStore.deleteScene(scene.id);
        },
        () => {
          sceneStore.addScene(scene, afterIndex);
        }
      );
      
      sceneStore.addScene(scene, afterIndex);
      pushAction(action);
    },
    
    updateSceneWithHistory: (newScene: Scene) => {
      const scenes = useSceneStore.getState().scenes;
      const previousScene = scenes.find((s) => s.id === newScene.id);
      
      if (!previousScene) return;
      
      const action = createHistoryAction(
        ActionType.UPDATE_SCENE,
        `Modifier scène: ${newScene.title}`,
        () => {
          sceneStore.updateScene(previousScene);
        },
        () => {
          sceneStore.updateScene(newScene);
        }
      );
      
      sceneStore.updateScene(newScene);
      pushAction(action);
    },
    
    deleteSceneWithHistory: (sceneId: string) => {
      const scenes = useSceneStore.getState().scenes;
      const scene = scenes.find((s) => s.id === sceneId);
      const sceneIndex = scenes.findIndex((s) => s.id === sceneId);
      
      if (!scene) return;
      
      const action = createHistoryAction(
        ActionType.DELETE_SCENE,
        `Supprimer scène: ${scene.title}`,
        () => {
          const newScenes = [...useSceneStore.getState().scenes];
          newScenes.splice(sceneIndex, 0, scene);
          sceneStore.setScenes(newScenes);
        },
        () => {
          sceneStore.deleteScene(sceneId);
        }
      );
      
      sceneStore.deleteScene(sceneId);
      pushAction(action);
    },
    
    reorderScenesWithHistory: (newOrder: string[]) => {
      const previousOrder = useSceneStore.getState().scenes.map((s) => s.id);
      
      const action = createHistoryAction(
        ActionType.REORDER_SCENES,
        'Réorganiser les scènes',
        () => {
          sceneStore.reorderScenes(previousOrder);
        },
        () => {
          sceneStore.reorderScenes(newOrder);
        }
      );
      
      sceneStore.reorderScenes(newOrder);
      pushAction(action);
    },
    
    // Layer actions
    addLayerWithHistory: (sceneId: string, layer: Layer) => {
      const action = createHistoryAction(
        ActionType.ADD_LAYER,
        `Ajouter calque: ${layer.name}`,
        () => {
          sceneStore.deleteLayer(sceneId, layer.id);
        },
        () => {
          sceneStore.addLayer(sceneId, layer);
        }
      );
      
      sceneStore.addLayer(sceneId, layer);
      pushAction(action);
    },
    
    updateLayerWithHistory: (sceneId: string, newLayer: Layer) => {
      const scenes = useSceneStore.getState().scenes;
      const scene = scenes.find((s) => s.id === sceneId);
      const previousLayer = scene?.layers?.find((l) => l.id === newLayer.id);
      
      if (!previousLayer) return;
      
      const action = createHistoryAction(
        ActionType.UPDATE_LAYER,
        `Modifier calque: ${newLayer.name}`,
        () => {
          sceneStore.updateLayer(sceneId, previousLayer);
        },
        () => {
          sceneStore.updateLayer(sceneId, newLayer);
        }
      );
      
      sceneStore.updateLayer(sceneId, newLayer);
      pushAction(action);
    },
    
    deleteLayerWithHistory: (sceneId: string, layerId: string) => {
      const scenes = useSceneStore.getState().scenes;
      const scene = scenes.find((s) => s.id === sceneId);
      const layer = scene?.layers?.find((l) => l.id === layerId);
      const layerIndex = scene?.layers?.findIndex((l) => l.id === layerId) ?? -1;
      
      if (!layer) return;
      
      const action = createHistoryAction(
        ActionType.DELETE_LAYER,
        `Supprimer calque: ${layer.name}`,
        () => {
          const currentScene = useSceneStore.getState().scenes.find((s) => s.id === sceneId);
          if (currentScene) {
            const newLayers = [...(currentScene.layers || [])];
            newLayers.splice(layerIndex, 0, layer);
            sceneStore.updateScene({ ...currentScene, layers: newLayers });
          }
        },
        () => {
          sceneStore.deleteLayer(sceneId, layerId);
        }
      );
      
      sceneStore.deleteLayer(sceneId, layerId);
      pushAction(action);
    },
    
    moveLayerWithHistory: (sceneId: string, fromIndex: number, toIndex: number) => {
      const action = createHistoryAction(
        ActionType.MOVE_LAYER,
        'Déplacer calque',
        () => {
          sceneStore.moveLayer(sceneId, toIndex, fromIndex);
        },
        () => {
          sceneStore.moveLayer(sceneId, fromIndex, toIndex);
        }
      );
      
      sceneStore.moveLayer(sceneId, fromIndex, toIndex);
      pushAction(action);
    },
    
    duplicateLayerWithHistory: (sceneId: string, layer: Layer, afterIndex?: number) => {
      const action = createHistoryAction(
        ActionType.DUPLICATE_LAYER,
        `Dupliquer calque: ${layer.name}`,
        () => {
          sceneStore.deleteLayer(sceneId, layer.id);
        },
        () => {
          sceneStore.duplicateLayer(sceneId, layer, afterIndex);
        }
      );
      
      sceneStore.duplicateLayer(sceneId, layer, afterIndex);
      pushAction(action);
    },
    
    // Property actions
    updateScenePropertyWithHistory: (sceneId: string, property: string, newValue: any) => {
      const scenes = useSceneStore.getState().scenes;
      const scene = scenes.find((s) => s.id === sceneId);
      const previousValue = scene?.[property];
      
      const action = createHistoryAction(
        ActionType.UPDATE_SCENE_PROPERTY,
        `Modifier propriété de scène: ${property}`,
        () => {
          sceneStore.updateSceneProperty(sceneId, property, previousValue);
        },
        () => {
          sceneStore.updateSceneProperty(sceneId, property, newValue);
        }
      );
      
      sceneStore.updateSceneProperty(sceneId, property, newValue);
      pushAction(action);
    },
    
    updateLayerPropertyWithHistory: (sceneId: string, layerId: string, property: string, newValue: any) => {
      const scenes = useSceneStore.getState().scenes;
      const scene = scenes.find((s) => s.id === sceneId);
      const layer = scene?.layers?.find((l) => l.id === layerId);
      const previousValue = layer?.[property];
      
      const action = createHistoryAction(
        ActionType.UPDATE_LAYER_PROPERTY,
        `Modifier propriété de calque: ${property}`,
        () => {
          sceneStore.updateLayerProperty(sceneId, layerId, property, previousValue);
        },
        () => {
          sceneStore.updateLayerProperty(sceneId, layerId, property, newValue);
        }
      );
      
      sceneStore.updateLayerProperty(sceneId, layerId, property, newValue);
      pushAction(action);
    },
    
    // Camera actions
    addCameraWithHistory: (sceneId: string, camera: Camera) => {
      const action = createHistoryAction(
        ActionType.ADD_CAMERA,
        `Ajouter caméra: ${camera.name}`,
        () => {
          const currentScene = useSceneStore.getState().scenes.find((s) => s.id === sceneId);
          if (currentScene) {
            const newCameras = (currentScene.sceneCameras || []).filter((c) => c.id !== camera.id);
            sceneStore.updateScene({ ...currentScene, sceneCameras: newCameras });
          }
        },
        () => {
          sceneStore.addCamera(sceneId, camera);
        }
      );
      
      sceneStore.addCamera(sceneId, camera);
      pushAction(action);
    },
  };
};
