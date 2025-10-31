import { useRef, useEffect } from 'react';
import Konva from 'konva';
import { ShapeType, ShapeLayer } from '../../../utils/shapeUtils';
import { applyMultiLayerDrag } from '../../../utils/multiLayerDrag';
import { updateLayerCameraPosition } from '../../../utils/cameraAnimator';

export const useShapeTransform = (
  isSelected: boolean,
  layer: ShapeLayer,
  onChange: (layer: ShapeLayer) => void,
  selectedLayerIds: string[] = [],
  allLayers: any[] = [],
  sceneCameras: any[] = []
) => {
  const shapeRef = useRef<any>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragStart = (e: any) => {
    dragStartPosRef.current = {
      x: e.target.x(),
      y: e.target.y()
    };
  };

  const handleDragEnd = (e: any) => {
    const finalX = e.target.x();
    const finalY = e.target.y();
    const shapeConfig = layer.shape_config;
    
    const newConfig = {
      ...shapeConfig,
      x: finalX,
      y: finalY,
    };
    let updatedLayer: any = {
      ...layer,
      shape_config: newConfig,
      position: {
        x: finalX,
        y: finalY
      }
    };

    // Update camera_position based on new position
    updatedLayer = updateLayerCameraPosition(updatedLayer, sceneCameras);
    
    // If multiple layers were selected, batch all updates together
    if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
      const deltaX = finalX - dragStartPosRef.current.x;
      const deltaY = finalY - dragStartPosRef.current.y;
      
      applyMultiLayerDrag(selectedLayerIds, layer.id, updatedLayer, allLayers, deltaX, deltaY, onChange, sceneCameras);
    } else {
      // Single layer drag
      onChange(updatedLayer);
    }
    
    dragStartPosRef.current = null;
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const shapeConfig = layer.shape_config;
    const shapeType = shapeConfig.shape;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

    let newConfig = { ...shapeConfig };
    let newLayerWidth = layer.width;
    let newLayerHeight = layer.height;

    if (shapeType === ShapeType.RECTANGLE || shapeType === ShapeType.SQUARE || 
        shapeType === ShapeType.TEXT_BOX || shapeType === ShapeType.HIGHLIGHT ||
        shapeType === ShapeType.CLOUD || shapeType === ShapeType.BUBBLE ||
        shapeType === ShapeType.THOUGHT_BUBBLE || shapeType === ShapeType.ORG_NODE ||
        shapeType === ShapeType.FRAME_DOODLE || shapeType === ShapeType.FRAME_RECT_DOODLE ||
        shapeType === ShapeType.FRAME_CLOUD_DOODLE || shapeType === ShapeType.HIGHLIGHT_DOODLE ||
        shapeType === ShapeType.BUBBLE_DOODLE || shapeType === ShapeType.CLOUD_DOODLE ||
        shapeType === ShapeType.RECTANGLE_DOODLE) {
      newConfig.width = Math.max(5, (shapeConfig.width || 100) * scaleX);
      newConfig.height = Math.max(5, (shapeConfig.height || 100) * scaleY);
      newConfig.x = node.x();
      newConfig.y = node.y();
      newConfig.rotation = rotation;
      // Update layer dimensions
      newLayerWidth = newConfig.width;
      newLayerHeight = newConfig.height;
    } else if (shapeType === ShapeType.CIRCLE || shapeType === ShapeType.CIRCLE_CONCENTRIC ||
               shapeType === ShapeType.FRAME_CIRCLE_DOODLE || shapeType === ShapeType.CIRCLE_SKETCH) {
      newConfig.radius = Math.max(5, shapeConfig.radius * scaleX);
      if (shapeType === ShapeType.CIRCLE_CONCENTRIC && shapeConfig.radiuses) {
        newConfig.radiuses = shapeConfig.radiuses.map((r: number) => Math.max(5, r * scaleX));
      }
      newConfig.x = node.x();
      newConfig.y = node.y();
      // Update layer dimensions for circle (diameter)
      newLayerWidth = newConfig.radius * 2;
      newLayerHeight = newConfig.radius * 2;
    } else if (shapeType === ShapeType.ELLIPSE) {
      newConfig.radiusX = Math.max(5, shapeConfig.radiusX * scaleX);
      newConfig.radiusY = Math.max(5, shapeConfig.radiusY * scaleY);
      newConfig.x = node.x();
      newConfig.y = node.y();
      newConfig.rotation = rotation;
      // Update layer dimensions for ellipse
      newLayerWidth = newConfig.radiusX * 2;
      newLayerHeight = newConfig.radiusY * 2;
    } else if (shapeType === ShapeType.TRIANGLE || shapeType === ShapeType.POLYGON || 
               shapeType === ShapeType.HEXAGON || shapeType === ShapeType.TRIANGLE_DOODLE) {
      newConfig.radius = Math.max(5, shapeConfig.radius * scaleX);
      newConfig.x = node.x();
      newConfig.y = node.y();
      newConfig.rotation = rotation;
      // Update layer dimensions (bounding box is radius * 2)
      newLayerWidth = newConfig.radius * 2;
      newLayerHeight = newConfig.radius * 2;
    } else if (shapeType === ShapeType.STAR) {
      newConfig.innerRadius = Math.max(5, shapeConfig.innerRadius * scaleX);
      newConfig.outerRadius = Math.max(5, shapeConfig.outerRadius * scaleX);
      newConfig.x = node.x();
      newConfig.y = node.y();
      newConfig.rotation = rotation;
      // Update layer dimensions (use outer radius)
      newLayerWidth = newConfig.outerRadius * 2;
      newLayerHeight = newConfig.outerRadius * 2;
    } else if (shapeType === ShapeType.BANNER || shapeType === ShapeType.TIMELINE) {
      newConfig.width = Math.max(5, (shapeConfig.width || 100) * scaleX);
      newConfig.height = Math.max(5, (shapeConfig.height || 60) * scaleY);
      newConfig.x = node.x();
      newConfig.y = node.y();
      newConfig.rotation = rotation;
      // Update layer dimensions
      newLayerWidth = newConfig.width;
      newLayerHeight = newConfig.height;
    } else if (shapeType === ShapeType.ICON || shapeType === ShapeType.DECORATIVE_SHAPE) {
      newConfig.size = Math.max(5, (shapeConfig.size || 80) * scaleX);
      newConfig.x = node.x();
      newConfig.y = node.y();
      newConfig.rotation = rotation;
      // Update layer dimensions (square)
      newLayerWidth = newConfig.size;
      newLayerHeight = newConfig.size;
    } else if (shapeType === ShapeType.LINE || shapeType === ShapeType.ARROW || 
               shapeType === ShapeType.ARROW_DOUBLE || shapeType === ShapeType.ARROW_CURVE ||
               shapeType === ShapeType.CONNECTOR || shapeType === ShapeType.UNDERLINE_ANIMATED ||
               shapeType === ShapeType.ARROW_DOODLE || shapeType === ShapeType.ARROW_CURVE_DOODLE ||
               shapeType === ShapeType.LINE_WAVE_DOODLE) {
      const points = shapeConfig.points || [0, 0, 100, 100];
      newConfig.points = points.map((val: number, idx: number) => 
        idx % 2 === 0 ? val * scaleX : val * scaleY
      );
      newConfig.x = node.x();
      newConfig.y = node.y();
      newConfig.rotation = rotation;
      // Calculate bounding box for line-based shapes
      if (newConfig.points && newConfig.points.length >= 2) {
        const xCoords = newConfig.points.filter((_: number, i: number) => i % 2 === 0);
        const yCoords = newConfig.points.filter((_: number, i: number) => i % 2 === 1);
        newLayerWidth = Math.max(...xCoords) - Math.min(...xCoords);
        newLayerHeight = Math.max(...yCoords) - Math.min(...yCoords);
      }
    }

    let updatedLayer: any = {
      ...layer,
      width: newLayerWidth,
      height: newLayerHeight,
      shape_config: newConfig,
      position: {
        x: newConfig.x,
        y: newConfig.y
      }
    };

    // Update camera_position based on new position
    updatedLayer = updateLayerCameraPosition(updatedLayer, sceneCameras);

    onChange(updatedLayer);

    node.scaleX(1);
    node.scaleY(1);
  };

  return {
    shapeRef,
    transformerRef,
    handleDragStart,
    handleDragEnd,
    handleTransformEnd,
  };
};
