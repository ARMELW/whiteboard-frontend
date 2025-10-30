import { Layer, LayerType } from '../app/scenes/types';

/**
 * Default dimensions for different layer types
 * Based on the API migration guide recommendations
 */
export const DEFAULT_LAYER_DIMENSIONS: Record<string, { width: number; height: number }> = {
  [LayerType.TEXT]: { width: 300, height: 100 },
  [LayerType.IMAGE]: { width: 1920, height: 1080 },
  [LayerType.SHAPE]: { width: 200, height: 200 },
  [LayerType.VIDEO]: { width: 1920, height: 1080 },
  [LayerType.AUDIO]: { width: 0, height: 0 },
};

/**
 * Validates that a layer has valid width and height properties
 * @param layer - The layer to validate
 * @returns true if valid, false otherwise
 */
export function validateLayerDimensions(layer: any): layer is Layer {
  // Check that width and height exist and are numbers
  if (typeof layer.width !== 'number') {
    console.error(`Layer ${layer.id} is missing valid width property`);
    return false;
  }
  
  if (typeof layer.height !== 'number') {
    console.error(`Layer ${layer.id} is missing valid height property`);
    return false;
  }
  
  // Check that values are non-negative
  if (layer.width < 0 || layer.height < 0) {
    console.error(`Layer ${layer.id} has negative dimensions: width=${layer.width}, height=${layer.height}`);
    return false;
  }
  
  return true;
}

/**
 * Ensures a layer has width and height, adding defaults if missing
 * This is useful for migrating existing layer data
 * @param layer - The layer to ensure dimensions for
 * @returns Layer with guaranteed width and height
 */
export function ensureLayerDimensions(layer: any): Layer {
  const layerType = layer.type as LayerType;
  
  // If width and height are already valid, return as-is
  if (typeof layer.width === 'number' && typeof layer.height === 'number' && 
      layer.width >= 0 && layer.height >= 0) {
    return layer as Layer;
  }
  
  // Calculate appropriate dimensions based on layer type
  let width: number;
  let height: number;
  
  if (layerType === LayerType.TEXT && layer.text_config) {
    // For text layers, try to estimate from text config
    const fontSize = layer.text_config.size || 48;
    const text = layer.text_config.text || 'Votre texte ici';
    const lineHeight = layer.text_config.line_height || 1.2;
    
    const avgCharWidth = fontSize * 0.6;
    const lines = text.split('\n');
    const maxLineLength = Math.max(...lines.map((line: string) => line.length));
    
    width = maxLineLength * avgCharWidth;
    height = lines.length * fontSize * lineHeight;
  } else if (layerType === LayerType.SHAPE && layer.shape_config) {
    // For shape layers, try to get dimensions from shape_config
    const config = layer.shape_config;
    width = config.width || (config.radius ? config.radius * 2 : null) || config.size || DEFAULT_LAYER_DIMENSIONS[layerType].width;
    height = config.height || (config.radius ? config.radius * 2 : null) || config.size || DEFAULT_LAYER_DIMENSIONS[layerType].height;
  } else {
    // Use defaults for the layer type
    const defaults = DEFAULT_LAYER_DIMENSIONS[layerType] || DEFAULT_LAYER_DIMENSIONS[LayerType.IMAGE];
    width = defaults.width;
    height = defaults.height;
  }
  
  return {
    ...layer,
    width,
    height,
  };
}

/**
 * Validates and fixes a batch of layers
 * @param layers - Array of layers to validate
 * @returns Array of layers with guaranteed valid dimensions
 */
export function validateAndFixLayers(layers: any[]): Layer[] {
  return layers.map(layer => ensureLayerDimensions(layer));
}

/**
 * Validates layers before API submission
 * Throws an error if any layer is invalid
 * @param layers - Array of layers to validate
 */
export function validateLayersForAPI(layers: any[]): void {
  const invalidLayers: string[] = [];
  
  layers.forEach(layer => {
    if (!validateLayerDimensions(layer)) {
      invalidLayers.push(layer.id || 'unknown');
    }
  });
  
  if (invalidLayers.length > 0) {
    throw new Error(`Invalid layers detected (missing or invalid width/height): ${invalidLayers.join(', ')}`);
  }
}
