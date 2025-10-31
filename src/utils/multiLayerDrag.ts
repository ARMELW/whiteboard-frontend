/**
 * Utility functions for multi-layer drag operations
 */

import type { Layer } from '@/app/scenes/types';
import { updateLayerCameraPosition } from './cameraAnimator';

/**
 * Updates the position of a layer based on a delta, handling different layer types
 * Returns a new layer object with updated position
 * @param targetLayer - The layer to update
 * @param deltaX - The change in X position
 * @param deltaY - The change in Y position
 * @param sceneCameras - Array of cameras in the scene (optional)
 * @returns Updated layer object
 */
export const updateLayerPosition = (
  targetLayer: Layer,
  deltaX: number,
  deltaY: number,
  sceneCameras: any[] = []
): Layer => {
  let updatedLayer: Layer;
  
  if (targetLayer.type === 'shape' && targetLayer.shape_config) {
    // For shape layers
    const newX = (targetLayer.shape_config.x || 0) + deltaX;
    const newY = (targetLayer.shape_config.y || 0) + deltaY;
    updatedLayer = {
      ...targetLayer,
      shape_config: {
        ...targetLayer.shape_config,
        x: newX,
        y: newY
      },
      position: {
        x: newX,
        y: newY
      }
    };
  } else {
    // For image/text layers
    updatedLayer = {
      ...targetLayer,
      position: {
        x: (targetLayer.position?.x || 0) + deltaX,
        y: (targetLayer.position?.y || 0) + deltaY
      }
    };
  }

  // Update camera_position based on new position
  return updateLayerCameraPosition(updatedLayer, sceneCameras);
};

/**
 * Applies a position delta to all selected layers INCLUDING the dragged one
 * Batches all updates to ensure simultaneous movement
 * @param selectedLayerIds - Array of selected layer IDs
 * @param currentLayerId - ID of the layer being dragged
 * @param currentLayer - The layer being dragged with its new position
 * @param allLayers - Array of all layers in the scene
 * @param deltaX - The change in X position
 * @param deltaY - The change in Y position
 * @param onChange - Callback to apply the changes
 * @param sceneCameras - Array of cameras in the scene (optional)
 */
export const applyMultiLayerDrag = (
  selectedLayerIds: string[],
  currentLayerId: string,
  currentLayer: Layer,
  allLayers: Layer[],
  deltaX: number,
  deltaY: number,
  onChange: (layer: Layer) => void,
  sceneCameras: any[] = []
) => {
  // Batch all layer updates to ensure simultaneous movement
  const updatedLayers: Layer[] = [currentLayer]; // Include the dragged layer
  
  selectedLayerIds.forEach((layerId) => {
    if (layerId !== currentLayerId) {
      const targetLayer = allLayers.find(l => l.id === layerId);
      if (targetLayer) {
        const updatedLayer = updateLayerPosition(targetLayer, deltaX, deltaY, sceneCameras);
        updatedLayers.push(updatedLayer);
      }
    }
  });
  
  // Apply all updates in quick succession within the same event handler
  // React will automatically batch these updates into a single render cycle
  updatedLayers.forEach(layer => onChange(layer));
};
