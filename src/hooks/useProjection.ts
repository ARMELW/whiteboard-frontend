/**
 * Custom hook for layer projection calculations
 * Provides easy access to projection screen dimensions and layer projection utilities
 */

import { useMemo } from 'react';
import { useSceneStore } from '@/app/scenes/store';
import type { Layer, Camera, Scene } from '@/app/scenes/types';
import {
  projectLayersToScreen,
  calculateProjectedLayerPosition,
  calculateProjectedLayerDimensions,
  isLayerVisibleInCamera,
  calculateProjectionScale,
  type ProjectedLayer
} from '@/utils/projectionCalculator';

export interface UseProjectionOptions {
  camera?: Camera;
  sceneWidth?: number;
  sceneHeight?: number;
}

export interface ProjectionHelpers {
  screenWidth: number;
  screenHeight: number;
  projectionScale: number;
  setProjectionScreen: (width: number, height: number) => void;
  projectLayers: (layers: Layer[]) => ProjectedLayer[];
  projectLayer: (layer: Layer) => ProjectedLayer;
  isLayerVisible: (layer: Layer) => boolean;
}

/**
 * Hook to access projection screen dimensions and calculations
 */
export const useProjection = (options: UseProjectionOptions = {}): ProjectionHelpers => {
  const {
    camera,
    sceneWidth = 1920,
    sceneHeight = 1080
  } = options;

  const screenWidth = useSceneStore(state => state.projectionScreenWidth);
  const screenHeight = useSceneStore(state => state.projectionScreenHeight);
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);

  // Calculate projection scale
  const projectionScale = useMemo(() => {
    if (!camera) return 1;
    return calculateProjectionScale(
      camera.width || sceneWidth,
      camera.height || sceneHeight,
      screenWidth,
      screenHeight
    );
  }, [camera, sceneWidth, sceneHeight, screenWidth, screenHeight]);

  // Project all layers
  const projectLayers = useMemo(() => {
    return (layers: Layer[]): ProjectedLayer[] => {
      if (!camera) return [];
      return projectLayersToScreen(
        layers,
        camera,
        sceneWidth,
        sceneHeight,
        screenWidth,
        screenHeight
      );
    };
  }, [camera, sceneWidth, sceneHeight, screenWidth, screenHeight]);

  // Project single layer
  const projectLayer = useMemo(() => {
    return (layer: Layer): ProjectedLayer => {
      if (!camera) {
        return {
          id: layer.id,
          position: { x: 0, y: 0 },
          width: 0,
          height: 0,
          scale: layer.scale || 1,
          opacity: layer.opacity || 1,
          rotation: layer.rotation,
          isVisible: false
        };
      }

      const position = calculateProjectedLayerPosition(
        layer,
        camera,
        sceneWidth,
        sceneHeight,
        screenWidth,
        screenHeight
      );

      const dimensions = calculateProjectedLayerDimensions(
        layer,
        camera,
        sceneWidth,
        sceneHeight,
        screenWidth,
        screenHeight
      );

      const isVisible = isLayerVisibleInCamera(
        layer,
        camera,
        sceneWidth,
        sceneHeight
      );

      return {
        id: layer.id,
        position,
        width: dimensions.width,
        height: dimensions.height,
        scale: layer.scale || 1,
        opacity: layer.opacity || 1,
        rotation: layer.rotation,
        isVisible
      };
    };
  }, [camera, sceneWidth, sceneHeight, screenWidth, screenHeight]);

  // Check if layer is visible
  const isLayerVisible = useMemo(() => {
    return (layer: Layer): boolean => {
      if (!camera) return false;
      return isLayerVisibleInCamera(
        layer,
        camera,
        sceneWidth,
        sceneHeight
      );
    };
  }, [camera, sceneWidth, sceneHeight]);

  return {
    screenWidth,
    screenHeight,
    projectionScale,
    setProjectionScreen,
    projectLayers,
    projectLayer,
    isLayerVisible
  };
};

/**
 * Hook to project layers for current scene
 */
export const useSceneProjection = (scene?: Scene): ProjectionHelpers & { projectedLayers: ProjectedLayer[] } => {
  const defaultCamera = useMemo(() => {
    return scene?.sceneCameras?.find(cam => cam.isDefault) || null;
  }, [scene?.sceneCameras]);

  const projection = useProjection({
    camera: defaultCamera || undefined,
    sceneWidth: scene?.sceneWidth || 1920,
    sceneHeight: scene?.sceneHeight || 1080
  });

  const projectedLayers = useMemo(() => {
    if (!scene?.layers || !defaultCamera) return [];
    return projection.projectLayers(scene.layers);
  }, [scene?.layers, defaultCamera, projection]);

  return {
    ...projection,
    projectedLayers
  };
};

export default useProjection;
