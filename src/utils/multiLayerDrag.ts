/**
 * Utility functions for multi-layer drag operations
 */

import type { Layer } from '@/app/scenes/types';

/**
 * Updates the position of a layer based on a delta, handling different layer types
 * Returns a new layer object with updated position
 * @param targetLayer - The layer to update
 * @param deltaX - The change in X position
 * @param deltaY - The change in Y position
 * @returns Updated layer object
 */
export const updateLayerPosition = (
  targetLayer: Layer,
  deltaX: number,
  deltaY: number
): Layer => {
  if (targetLayer.type === 'shape' && targetLayer.shape_config) {
    // For shape layers
    return {
      ...targetLayer,
      shape_config: {
        ...targetLayer.shape_config,
        x: (targetLayer.shape_config.x || 0) + deltaX,
        y: (targetLayer.shape_config.y || 0) + deltaY
      }
    };
  } else {
    // For image/text layers
    return {
      ...targetLayer,
      position: {
        x: (targetLayer.position?.x || 0) + deltaX,
        y: (targetLayer.position?.y || 0) + deltaY
      }
    };
  }
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
 */
export const applyMultiLayerDrag = (
  selectedLayerIds: string[],
  currentLayerId: string,
  currentLayer: Layer,
  allLayers: Layer[],
  deltaX: number,
  deltaY: number,
  onChange: (layer: Layer) => void
) => {
  // Batch all layer updates to ensure simultaneous movement
  const updatedLayers: Layer[] = [currentLayer]; // Include the dragged layer first
  
  selectedLayerIds.forEach((layerId) => {
    if (layerId !== currentLayerId) {
      const targetLayer = allLayers.find(l => l.id === layerId);
      if (targetLayer) {
        const updatedLayer = updateLayerPosition(targetLayer, deltaX, deltaY);
        updatedLayers.push(updatedLayer);
      }
    }
  });
  
  // Apply all updates synchronously but in quick succession
  // React 18+ will automatically batch these updates
  updatedLayers.forEach(layer => onChange(layer));
};
