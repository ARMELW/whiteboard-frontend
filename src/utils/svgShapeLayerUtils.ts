/**
 * SVG Shape Layer Utilities
 * Helper functions for creating layers from SVG shape assets
 */

import { v4 as uuidv4 } from 'uuid';
import { LayerType, LayerMode, Layer } from '@/app/scenes/types';
import type { ShapeAsset } from '@/app/shapes/api/shapesService';

/**
 * Create a new layer from an SVG shape asset
 * @param shape - The shape asset to convert to a layer
 * @param currentLayersCount - Number of existing layers in the scene (for z-index)
 * @returns A new layer object ready to be added to the scene
 */
export function createLayerFromShapeAsset(
  shape: ShapeAsset,
  currentLayersCount: number = 0
): Layer {
  const layer: Layer = {
    id: uuidv4(),
    type: LayerType.SHAPE,
    name: shape.name,
    mode: LayerMode.DRAW,
    position: {
      x: 200,
      y: 150,
    },
    width: shape.width || 200,
    height: shape.height || 200,
    scale: 1,
    opacity: 1,
    rotation: 0,
    shape_config: {
      color: '#222222',
      fill_color: '#222222',
      stroke_width: 5,
    },
    z_index: currentLayersCount,
    skip_rate: 5,
    visible: true,
    locked: false,
    // SVG-specific properties (supported via Layer's index signature)
    svg_path: shape.url,
    svg_sampling_rate: 1,
    svg_reverse: false,
  };
  
  return layer;
}
