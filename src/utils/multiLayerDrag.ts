/**
 * Utility functions for multi-layer drag operations
 */

import type { Layer } from '@/app/scenes/types';

/**
 * Updates the position of a layer based on a delta, handling different layer types
 * @param targetLayer - The layer to update
 * @param deltaX - The change in X position
 * @param deltaY - The change in Y position
 * @param onChange - Callback to apply the changes
 */
export const updateLayerPosition = (
  targetLayer: Layer,
  deltaX: number,
  deltaY: number,
  onChange: (layer: Layer) => void
) => {
  if (targetLayer.type === 'shape' && targetLayer.shape_config) {
    // For shape layers
    onChange({
      ...targetLayer,
      shape_config: {
        ...targetLayer.shape_config,
        x: (targetLayer.shape_config.x || 0) + deltaX,
        y: (targetLayer.shape_config.y || 0) + deltaY
      }
    });
  } else {
    // For image/text layers
    onChange({
      ...targetLayer,
      position: {
        x: (targetLayer.position?.x || 0) + deltaX,
        y: (targetLayer.position?.y || 0) + deltaY
      }
    });
  }
};

/**
 * Applies a position delta to all selected layers except the current one
 * @param selectedLayerIds - Array of selected layer IDs
 * @param currentLayerId - ID of the layer being dragged
 * @param allLayers - Array of all layers in the scene
 * @param deltaX - The change in X position
 * @param deltaY - The change in Y position
 * @param onChange - Callback to apply the changes
 */
export const applyMultiLayerDrag = (
  selectedLayerIds: string[],
  currentLayerId: string,
  allLayers: Layer[],
  deltaX: number,
  deltaY: number,
  onChange: (layer: Layer) => void
) => {
  selectedLayerIds.forEach((layerId) => {
    if (layerId !== currentLayerId) {
      const targetLayer = allLayers.find(l => l.id === layerId);
      if (targetLayer) {
        updateLayerPosition(targetLayer, deltaX, deltaY, onChange);
      }
    }
  });
};
