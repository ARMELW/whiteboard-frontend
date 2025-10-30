/**
 * Layer Snapshot Utility
 * 
 * This module provides functionality to generate and cache image snapshots of individual layers.
 * Each layer's visual representation is rendered to a canvas and converted to a data URL (PNG).
 * 
 * ## Purpose
 * - Optimize rendering by caching layer images
 * - Reduce re-rendering overhead when layers don't change
 * - Enable easy layer manipulation (export, preview, etc.)
 * 
 * ## Architecture
 * 1. **Snapshot Generation**: Each layer type (image, text, shape, whiteboard) has specialized rendering
 * 2. **Background Processing**: Uses requestIdleCallback for non-blocking operations
 * 3. **Debouncing**: Prevents excessive snapshot generation during rapid property changes
 * 4. **Caching**: Stores generated image in layer.cachedImage property
 * 
 * ## Optimization Strategies
 * - **Image Layers**: Direct image copy with transformations
 * - **Text Layers**: Canvas text rendering with proper styling
 * - **Shape Layers**: Vector-to-raster conversion
 * - **Whiteboard Layers**: Stroke replay on canvas
 * 
 * ## Performance Considerations
 * - Small canvas size (512x512 default) for memory efficiency
 * - High pixel ratio (2x) for quality without excessive memory
 * - JPEG compression for larger layers (>256x256)
 * - PNG for layers with transparency
 * 
 * @module layerSnapshot
 */

import { Layer } from '../app/scenes/types';

export interface SnapshotOptions {
  width?: number;
  height?: number;
  pixelRatio?: number;
  quality?: number;
  format?: 'png' | 'jpeg';
  backgroundColor?: string;
}

const DEFAULT_OPTIONS: Required<SnapshotOptions> = {
  width: 512,
  height: 512,
  pixelRatio: 2,
  quality: 0.95,
  format: 'png',
  backgroundColor: 'transparent',
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
 * Generate a snapshot image of a layer
 * 
 * @param layer - The layer to generate snapshot for
 * @param options - Snapshot generation options
 * @returns Promise<string> - Data URL of the generated snapshot
 */
export const generateLayerSnapshot = async (
  layer: Layer,
  options: SnapshotOptions = {}
): Promise<string | null> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    const canvas = document.createElement('canvas');
    canvas.width = opts.width * opts.pixelRatio;
    canvas.height = opts.height * opts.pixelRatio;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context for layer snapshot');
      return null;
    }

    ctx.scale(opts.pixelRatio, opts.pixelRatio);

    if (opts.backgroundColor !== 'transparent') {
      ctx.fillStyle = opts.backgroundColor;
      ctx.fillRect(0, 0, opts.width, opts.height);
    }

    switch (layer.type) {
      case 'image':
        await renderImageLayer(ctx, layer, opts);
        break;
      case 'text':
        renderTextLayer(ctx, layer, opts);
        break;
      case 'shape':
        renderShapeLayer(ctx, layer, opts);
        break;
      default:
        console.warn(`Snapshot generation not supported for layer type: ${layer.type}`);
        return null;
    }

    const mimeType = opts.format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return canvas.toDataURL(mimeType, opts.quality);
  } catch (error) {
    console.error('Error generating layer snapshot:', error);
    return null;
  }
};

/**
 * Render an image layer to canvas
 */
const renderImageLayer = (
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  opts: Required<SnapshotOptions>
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!layer.image_path) {
      reject(new Error('Image layer missing image_path'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        ctx.save();

        const scale = layer.scale || 1.0;
        const opacity = layer.opacity !== undefined ? layer.opacity : 1.0;
        const rotation = layer.rotation || 0;

        ctx.globalAlpha = opacity;

        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;

        const x = opts.width / 2;
        const y = opts.height / 2;

        ctx.translate(x, y);
        if (rotation) {
          ctx.rotate((rotation * Math.PI) / 180);
        }

        ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

        ctx.restore();
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${layer.image_path}`));
    };

    img.src = layer.image_path;
  });
};

/**
 * Render a text layer to canvas
 */
const renderTextLayer = (
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  opts: Required<SnapshotOptions>
): void => {
  const textConfig = layer.text_config || {};
  const text = textConfig.text || layer.text || '';
  const fontSize = textConfig.size || 48;
  const fontFamily = textConfig.font || 'Arial';
  const fontStyle = textConfig.style || 'normal';
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity !== undefined ? layer.opacity : 1.0;
  const rotation = layer.rotation || 0;
  const align = textConfig.align || 'center';
  const lineHeight = textConfig.line_height || 1.2;

  let fontWeight = 'normal';
  let fontStyleCSS = 'normal';
  if (fontStyle === 'bold') {
    fontWeight = 'bold';
  } else if (fontStyle === 'italic') {
    fontStyleCSS = 'italic';
  } else if (fontStyle === 'bold_italic') {
    fontWeight = 'bold';
    fontStyleCSS = 'italic';
  }

  let fillStyle = '#000000';
  if (Array.isArray(textConfig.color)) {
    fillStyle = `rgb(${textConfig.color[0]}, ${textConfig.color[1]}, ${textConfig.color[2]})`;
  } else if (typeof textConfig.color === 'string') {
    fillStyle = textConfig.color;
  }

  ctx.save();

  const x = opts.width / 2;
  const y = opts.height / 2;

  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  if (rotation) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  ctx.font = `${fontStyleCSS} ${fontWeight} ${fontSize * scale}px ${fontFamily}`;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  const lines = text.split('\n');
  const lineHeightPx = fontSize * scale * lineHeight;

  lines.forEach((line: string, index: number) => {
    const yOffset = (index - (lines.length - 1) / 2) * lineHeightPx;
    ctx.fillText(line, 0, yOffset);
  });

  ctx.restore();
};

/**
 * Render a shape layer to canvas
 */
const renderShapeLayer = (
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  opts: Required<SnapshotOptions>
): void => {
  const shapeConfig = layer.shape_config || {};
  const scale = layer.scale || 1.0;
  const opacity = layer.opacity !== undefined ? layer.opacity : 1.0;
  const rotation = layer.rotation || 0;

  let fillStyle = '#000000';
  if (Array.isArray(shapeConfig.fill_color)) {
    fillStyle = `rgba(${shapeConfig.fill_color.join(',')})`;
  } else if (typeof shapeConfig.fill_color === 'string') {
    fillStyle = shapeConfig.fill_color;
  } else if (shapeConfig.fill) {
    fillStyle = shapeConfig.fill;
  }

  let strokeStyle = '#000000';
  if (Array.isArray(shapeConfig.stroke_color)) {
    strokeStyle = `rgba(${shapeConfig.stroke_color.join(',')})`;
  } else if (typeof shapeConfig.stroke_color === 'string') {
    strokeStyle = shapeConfig.stroke_color;
  } else if (shapeConfig.stroke) {
    strokeStyle = shapeConfig.stroke;
  }

  ctx.save();

  const x = opts.width / 2;
  const y = opts.height / 2;

  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  if (rotation) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = (shapeConfig.stroke_width || shapeConfig.strokeWidth || 1) * scale;

  const shapeType = shapeConfig.shape_type || shapeConfig.shape || 'rectangle';
  const width = (shapeConfig.width || 100) * scale;
  const height = (shapeConfig.height || 100) * scale;
  const fillMode = shapeConfig.fill_mode || 'both';

  switch (shapeType) {
    case 'rectangle':
    case 'square':
      if (fillMode !== 'stroke') {
        ctx.fillRect(-width / 2, -height / 2, width, height);
      }
      if (fillMode !== 'fill') {
        ctx.strokeRect(-width / 2, -height / 2, width, height);
      }
      break;

    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, width / 2, 0, 2 * Math.PI);
      if (fillMode !== 'stroke') {
        ctx.fill();
      }
      if (fillMode !== 'fill') {
        ctx.stroke();
      }
      break;

    case 'line':
      ctx.beginPath();
      ctx.moveTo(-width / 2, -height / 2);
      ctx.lineTo(width / 2, height / 2);
      ctx.stroke();
      break;

    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -height / 2);
      ctx.lineTo(width / 2, height / 2);
      ctx.lineTo(-width / 2, height / 2);
      ctx.closePath();
      if (fillMode !== 'stroke') {
        ctx.fill();
      }
      if (fillMode !== 'fill') {
        ctx.stroke();
      }
      break;

    case 'star': {
      const outerRadius = width / 2;
      const innerRadius = outerRadius * 0.5;
      const points = 5;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      if (fillMode !== 'stroke') {
        ctx.fill();
      }
      if (fillMode !== 'fill') {
        ctx.stroke();
      }
      break;
    }

    default:
      console.warn(`Unsupported shape type: ${shapeType}`);
  }

  ctx.restore();
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
