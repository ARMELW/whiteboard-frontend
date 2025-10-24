import { Scene, Layer } from '../scenes/types';

export enum ActionType {
  // Scene actions
  ADD_SCENE = 'ADD_SCENE',
  UPDATE_SCENE = 'UPDATE_SCENE',
  DELETE_SCENE = 'DELETE_SCENE',
  REORDER_SCENES = 'REORDER_SCENES',
  
  // Layer actions
  ADD_LAYER = 'ADD_LAYER',
  UPDATE_LAYER = 'UPDATE_LAYER',
  DELETE_LAYER = 'DELETE_LAYER',
  MOVE_LAYER = 'MOVE_LAYER',
  DUPLICATE_LAYER = 'DUPLICATE_LAYER',
  
  // Property changes
  UPDATE_SCENE_PROPERTY = 'UPDATE_SCENE_PROPERTY',
  UPDATE_LAYER_PROPERTY = 'UPDATE_LAYER_PROPERTY',
  
  // Camera actions
  ADD_CAMERA = 'ADD_CAMERA',
  UPDATE_CAMERA = 'UPDATE_CAMERA',
  DELETE_CAMERA = 'DELETE_CAMERA',
}

export interface HistoryAction {
  type: ActionType;
  timestamp: number;
  description: string;
  undo: () => void;
  redo: () => void;
}

export interface AddSceneAction extends HistoryAction {
  type: ActionType.ADD_SCENE;
  scene: Scene;
}

export interface UpdateSceneAction extends HistoryAction {
  type: ActionType.UPDATE_SCENE;
  sceneId: string;
  previousScene: Scene;
  newScene: Scene;
}

export interface DeleteSceneAction extends HistoryAction {
  type: ActionType.DELETE_SCENE;
  scene: Scene;
  sceneIndex: number;
}

export interface ReorderScenesAction extends HistoryAction {
  type: ActionType.REORDER_SCENES;
  previousOrder: string[];
  newOrder: string[];
}

export interface AddLayerAction extends HistoryAction {
  type: ActionType.ADD_LAYER;
  sceneId: string;
  layer: Layer;
}

export interface UpdateLayerAction extends HistoryAction {
  type: ActionType.UPDATE_LAYER;
  sceneId: string;
  layerId: string;
  previousLayer: Layer;
  newLayer: Layer;
}

export interface DeleteLayerAction extends HistoryAction {
  type: ActionType.DELETE_LAYER;
  sceneId: string;
  layer: Layer;
  layerIndex: number;
}

export interface MoveLayerAction extends HistoryAction {
  type: ActionType.MOVE_LAYER;
  sceneId: string;
  fromIndex: number;
  toIndex: number;
}

export interface UpdatePropertyAction extends HistoryAction {
  type: ActionType.UPDATE_SCENE_PROPERTY | ActionType.UPDATE_LAYER_PROPERTY;
  sceneId: string;
  layerId?: string;
  property: string;
  previousValue: any;
  newValue: any;
}
