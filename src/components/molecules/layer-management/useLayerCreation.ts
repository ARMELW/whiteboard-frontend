import { useCallback } from 'react';

// Minimum camera zoom to prevent division by zero and extreme viewport calculations
const MIN_CAMERA_ZOOM = 0.1;

/**
 * Estimate text dimensions based on font size and text content
 * This is a rough approximation - actual dimensions may vary
 */
const estimateTextDimensions = (text: string, fontSize: number, fontFamily: string = 'Arial'): { width: number; height: number } => {
  // Average character width is roughly 0.6 * fontSize for most fonts
  const avgCharWidth = fontSize * 0.6;
  const lines = text.split('\n');
  const maxLineLength = Math.max(...lines.map(line => line.length));
  
  // Estimate width based on longest line
  const width = maxLineLength * avgCharWidth;
  
  // Estimate height based on number of lines and line height
  const lineHeight = 1.2; // Default line height
  const height = lines.length * fontSize * lineHeight;
  
  return { width, height };
};

export interface LayerCreationOptions {
  sceneWidth?: number;
  sceneHeight?: number;
  selectedCamera?: any;
}

export const useLayerCreation = ({ 
  sceneWidth = 1920, 
  sceneHeight = 1080,
  selectedCamera 
}: LayerCreationOptions = {}) => {
  
  const getCameraPosition = useCallback(() => {
    let cameraCenterX = sceneWidth / 2;
    let cameraCenterY = sceneHeight / 2;
    let cameraWidth = 800;
    let cameraHeight = 450;
    let cameraZoom = 1;
    
    if (selectedCamera && selectedCamera.position) {
      cameraCenterX = selectedCamera.position.x * sceneWidth;
      cameraCenterY = selectedCamera.position.y * sceneHeight;
      cameraWidth = selectedCamera.width || 800;
      cameraHeight = selectedCamera.height || 450;
      // Ensure zoom is never zero or too small to prevent division issues
      cameraZoom = Math.max(MIN_CAMERA_ZOOM, selectedCamera.zoom || 1);
    }
    
    return { cameraCenterX, cameraCenterY, cameraWidth, cameraHeight, cameraZoom };
  }, [sceneWidth, sceneHeight, selectedCamera]);

  const createTextLayer = useCallback((layersLength: number) => {
    const { cameraCenterX, cameraCenterY, cameraZoom } = getCameraPosition();
    
    const text = 'Votre texte ici';
    const fontSize = 48;
    const fontFamily = 'Arial';
    
    const initialX = cameraCenterX;
    const initialY = cameraCenterY;
    
    // Estimate text dimensions
    const { width, height } = estimateTextDimensions(text, fontSize, fontFamily);
    
    return {
      id: `layer-${Date.now()}`,
      name: 'Texte',
      position: { x: initialX, y: initialY },
      width,
      height,
      z_index: layersLength + 1,
      skip_rate: 12,
      scale: cameraZoom,
      opacity: 1.0,
      mode: 'draw',
      type: 'text',
      text_config: {
        text: text,
        font: fontFamily,
        size: fontSize,
        color: [0, 0, 0],
        style: 'normal',
        line_height: 1.2,
        align: 'center'
      },
      audio: {
        narration: null,
        soundEffects: [],
        typewriter: null,
        drawing: null,
      }
    };
  }, [getCameraPosition]);

  const createImageLayer = useCallback((
    imageUrl: string, 
    fileName: string, 
    imageDimensions: { width: number; height: number } | null,
    layersLength: number
  ) => {
    const { cameraCenterX, cameraCenterY, cameraWidth, cameraHeight, cameraZoom } = getCameraPosition();
    
    let calculatedScale = 1.0;
    let baseWidth = 0;
    let baseHeight = 0;
    
    if (imageDimensions) {
      baseWidth = imageDimensions.width;
      baseHeight = imageDimensions.height;
      
      // Camera zoom semantics: lower values mean zoomed out (larger viewport)
      // e.g., zoom = 0.8 means camera sees 800/0.8 = 1000 units of scene width
      // Account for camera zoom when calculating the viewport size in scene coordinates
      const viewportWidth = cameraWidth / cameraZoom;
      const viewportHeight = cameraHeight / cameraZoom;

      // Fit image within 100% of the camera's actual viewport
      const maxWidth = viewportWidth * 1;
      const maxHeight = viewportHeight * 1;
      
      const scaleX = maxWidth / imageDimensions.width;
      const scaleY = maxHeight / imageDimensions.height;
      
      // Use the minimum scale to ensure the image fits within the viewport
      calculatedScale = Math.min(scaleX, scaleY, 1.0);
    }
    
    const scaledImageWidth = imageDimensions ? imageDimensions.width * calculatedScale : 0;
    const scaledImageHeight = imageDimensions ? imageDimensions.height * calculatedScale : 0;
    
    const initialX = cameraCenterX - (scaledImageWidth / 2);
    const initialY = cameraCenterY - (scaledImageHeight / 2);
    
    return {
      id: `layer-${Date.now()}`,
      image_path: imageUrl,
      name: fileName,
      position: { x: initialX, y: initialY },
      width: baseWidth,
      height: baseHeight,
      z_index: layersLength + 1,
      skip_rate: 10,
      scale: calculatedScale,
      opacity: 1.0,
      mode: 'draw',
      type: 'image',
      audio: {
        narration: null,
        soundEffects: [],
        typewriter: null,
        drawing: null,
      }
    };
  }, [getCameraPosition]);

  const createShapeLayer = useCallback((shapeLayer: any, layersLength: number) => {
    const { cameraCenterX, cameraCenterY, cameraZoom } = getCameraPosition();
    
    const shapeConfig = shapeLayer.shape_config;
    const scaledShapeConfig = { ...shapeConfig };
    
    if (shapeConfig.width !== undefined) {
      scaledShapeConfig.width = shapeConfig.width * cameraZoom;
    }
    if (shapeConfig.height !== undefined) {
      scaledShapeConfig.height = shapeConfig.height * cameraZoom;
    }
    if (shapeConfig.radius !== undefined) {
      scaledShapeConfig.radius = shapeConfig.radius * cameraZoom;
    }
    if (shapeConfig.radiusX !== undefined) {
      scaledShapeConfig.radiusX = shapeConfig.radiusX * cameraZoom;
    }
    if (shapeConfig.radiusY !== undefined) {
      scaledShapeConfig.radiusY = shapeConfig.radiusY * cameraZoom;
    }
    if (shapeConfig.innerRadius !== undefined) {
      scaledShapeConfig.innerRadius = shapeConfig.innerRadius * cameraZoom;
    }
    if (shapeConfig.outerRadius !== undefined) {
      scaledShapeConfig.outerRadius = shapeConfig.outerRadius * cameraZoom;
    }
    if (shapeConfig.size !== undefined) {
      scaledShapeConfig.size = shapeConfig.size * cameraZoom;
    }
    
    const shapeWidth = scaledShapeConfig.width || scaledShapeConfig.radius || scaledShapeConfig.size || 100;
    const shapeHeight = scaledShapeConfig.height || scaledShapeConfig.radius || scaledShapeConfig.size || 100;
    
    scaledShapeConfig.x = cameraCenterX - (shapeWidth / 2);
    scaledShapeConfig.y = cameraCenterY - (shapeHeight / 2);
    
    // Calculate base width and height for the layer
    // Use the original (unscaled) dimensions from the shape config
    const baseWidth = shapeConfig.width || (shapeConfig.radius ? shapeConfig.radius * 2 : null) || shapeConfig.size || 100;
    const baseHeight = shapeConfig.height || (shapeConfig.radius ? shapeConfig.radius * 2 : null) || shapeConfig.size || 100;
    
    return {
      ...shapeLayer,
      width: baseWidth,
      height: baseHeight,
      z_index: layersLength + 1,
      skip_rate: 12,
      shape_config: scaledShapeConfig,
      audio: {
        narration: null,
        soundEffects: [],
        typewriter: null,
        drawing: null,
      }
    };
  }, [getCameraPosition]);

  return {
    createTextLayer,
    createImageLayer,
    createShapeLayer
  };
};
