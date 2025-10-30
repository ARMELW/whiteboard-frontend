/**
 * Layer Snapshot Utility
 * 
 * This module provides functionality to generate and cache image snapshots of individual layers.
 * Each layer is rendered in the context of the full scene at its actual position with the scene background.
 * 
 * ## Purpose
 * - Generate snapshots of layers positioned within the full scene context
 * - Include scene background in layer snapshots
 * - Cache layer images for optimized rendering
 * - Enable easy layer manipulation (export, preview, etc.)
 * 
 * ## Architecture
 * 1. **Full Scene Export**: Uses exportLayerFromJSON with useFullScene=true to render layer at real position
 * 2. **Background Processing**: Uses requestIdleCallback for non-blocking operations
 * 3. **Debouncing**: Prevents excessive snapshot generation during rapid property changes
 * 4. **Caching**: Stores generated image in layer.cachedImage property
 * 
 * ## Snapshot Rendering
 * Each snapshot includes:
 * - Scene background image (if present)
 * - Layer rendered at its actual scene position
 * - Full scene dimensions (default 1920x1080)
 * - All layer transformations (scale, rotation, opacity)
 * 
 * ## Performance Considerations
 * - Configurable scene size for memory efficiency
 * - High pixel ratio (2x) for quality without excessive memory
 * - JPEG compression for opaque layers
 * - PNG for layers with transparency
 * - Background processing to avoid blocking UI
 * 
 * @module layerSnapshot
 */

import { Layer, Scene } from '../app/scenes/types';
import { exportLayerFromJSON } from './layerExporter';

export interface SnapshotOptions {
  sceneWidth?: number;
  sceneHeight?: number;
  pixelRatio?: number;
  sceneBackgroundImage?: string | null;
}

const DEFAULT_OPTIONS: Required<SnapshotOptions> = {
  sceneWidth: 1920,
  sceneHeight: 1080,
  pixelRatio: 2,
  sceneBackgroundImage: null,
};

/**
 * Queue for managing layer snapshot generation tasks
 * Ensures background processing doesn't block the UI
 */
class SnapshotQueue {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private idleCallback: number | null = null;

  add(task: () => Promise<void>) {
    this.queue.push(task);
    this.process();
  }

  private process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    const processNext = () => {
      if (this.queue.length === 0) {
        this.processing = false;
        return;
      }

      const task = this.queue.shift();
      if (task) {
        task()
          .catch(error => console.error('Error processing snapshot task:', error))
          .finally(() => {
            this.scheduleNext();
          });
      }
    };

    this.scheduleNext = () => {
      if (typeof requestIdleCallback !== 'undefined') {
        this.idleCallback = requestIdleCallback(
          () => processNext(),
          { timeout: 1000 }
        );
      } else {
        setTimeout(() => processNext(), 16);
      }
    };

    this.scheduleNext();
  }

  private scheduleNext: () => void = () => {};

  clear() {
    this.queue = [];
    if (this.idleCallback !== null && typeof cancelIdleCallback !== 'undefined') {
      cancelIdleCallback(this.idleCallback);
      this.idleCallback = null;
    }
    this.processing = false;
  }
}

const snapshotQueue = new SnapshotQueue();

/**
 * Generate a snapshot image of a layer in full scene context
 * 
 * This function renders the layer at its actual position within the full scene,
 * including the scene background if present. The resulting image shows exactly
 * how the layer appears in the whiteboard editor.
 * 
 * @param layer - The layer to generate snapshot for
 * @param options - Snapshot generation options
 * @returns Promise<string> - Data URL of the generated snapshot (full scene with layer)
 */
export const generateLayerSnapshot = async (
  layer: Layer,
  options: SnapshotOptions = {}
): Promise<string | null> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Use exportLayerFromJSON with useFullScene to render layer at real position
    const dataUrl = await exportLayerFromJSON(layer, {
      sceneWidth: opts.sceneWidth,
      sceneHeight: opts.sceneHeight,
      pixelRatio: opts.pixelRatio,
      background: 'transparent',
      sceneBackgroundImage: opts.sceneBackgroundImage,
      useFullScene: true,
    });

    return dataUrl;
  } catch (error) {
    console.error('Error generating layer snapshot:', error);
    return null;
  }
};

/**
 * Debounced snapshot generation
 * Prevents excessive regeneration during rapid property changes
 */
const debounceTimers = new Map<string, NodeJS.Timeout>();

export const generateLayerSnapshotDebounced = (
  layer: Layer,
  onComplete: (dataUrl: string | null) => void,
  delay = 300,
  options: SnapshotOptions = {}
): void => {
  const timerId = debounceTimers.get(layer.id);
  if (timerId) {
    clearTimeout(timerId);
  }

  const newTimer = setTimeout(() => {
    snapshotQueue.add(async () => {
      const dataUrl = await generateLayerSnapshot(layer, options);
      onComplete(dataUrl);
    });
    debounceTimers.delete(layer.id);
  }, delay);

  debounceTimers.set(layer.id, newTimer);
};

/**
 * Clear all pending snapshot generation tasks
 */
export const clearSnapshotQueue = (): void => {
  snapshotQueue.clear();
  debounceTimers.forEach((timer) => clearTimeout(timer));
  debounceTimers.clear();
};

/**
 * Determine if a layer property change should trigger snapshot regeneration
 */
export const shouldRegenerateSnapshot = (
  property: string,
  layerType: string
): boolean => {
  const visualProperties = [
    'position',
    'scale',
    'opacity',
    'rotation',
    'image_path',
    'text',
    'text_config',
    'shape_config',
    'visible',
  ];

  return visualProperties.includes(property);
};
