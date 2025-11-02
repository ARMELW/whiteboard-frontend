import React, { useRef, useState, useEffect } from 'react';
import { Path, Transformer, Group } from 'react-konva';
import Konva from 'konva';
import { applyMultiLayerDrag } from '@/utils/multiLayerDrag';
import { updateLayerCameraPosition } from '@/utils/cameraAnimator';

export interface LayerSvgProps {
  layer: any;
  isSelected: boolean;
  onSelect: (e?: any) => void;
  onChange: (layer: any) => void;
  selectedLayerIds?: string[];
  allLayers?: any[];
  sceneCameras?: any[];
}

interface ParsedPath {
  data: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const LayerSvgComponent: React.FC<LayerSvgProps> = ({
  layer,
  isSelected,
  onSelect,
  onChange,
  selectedLayerIds = [],
  allLayers = [],
  sceneCameras = []
}) => {
  const [paths, setPaths] = useState<ParsedPath[]>([]);
  const [svgSize, setSvgSize] = useState({ width: 100, height: 100 });
  const [loading, setLoading] = useState(true);
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const dragStartPosRef = useRef<{ x: number; y: number; currentX?: number; currentY?: number } | null>(null);

  useEffect(() => {
    // Charger et parser le SVG depuis l'URL
    const loadSvg = async (url: string) => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const svgText = await response.text();
        
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
          // Obtenir les dimensions
          const width = parseFloat(svgElement.getAttribute('width') || '100');
          const height = parseFloat(svgElement.getAttribute('height') || '100');
          const viewBox = svgElement.getAttribute('viewBox');
          
          if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
            setSvgSize({ width: vbWidth || width, height: vbHeight || height });
          } else {
            setSvgSize({ width, height });
          }
          
          // Extraire tous les paths
          const pathElements = svgDoc.querySelectorAll('path');
          const parsedPaths: ParsedPath[] = [];
          
          pathElements.forEach((pathElement) => {
            const d = pathElement.getAttribute('d');
            if (d) {
              // Use shape_config colors if available, otherwise use SVG defaults
              const shapeConfig = layer.shape_config || {};
              const fill = shapeConfig.fill_color || pathElement.getAttribute('fill') || '#000000';
              const stroke = shapeConfig.color || pathElement.getAttribute('stroke') || undefined;
              const strokeWidth = shapeConfig.stroke_width !== undefined 
                ? shapeConfig.stroke_width 
                : parseFloat(pathElement.getAttribute('stroke-width') || '0');
              
              parsedPaths.push({
                data: d,
                fill,
                stroke,
                strokeWidth
              });
            }
          });
          
          if (parsedPaths.length === 0) {
            console.warn('No path elements found in SVG');
          }
          
          setPaths(parsedPaths);
        }
        setLoading(false);
      } catch (e) {
        console.error('Error loading SVG:', e);
        setLoading(false);
      }
    };

    if (layer.svg_path) {
      loadSvg(layer.svg_path);
    }
  }, [layer.svg_path, layer.shape_config]);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current && paths.length > 0) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, paths]);

  if (loading || paths.length === 0) return null;

  const STAGE_WIDTH = 1920;
  const STAGE_HEIGHT = 1080;

  // Calcul de la position absolue de la caméra par défaut en pixels
  const defaultCamera = sceneCameras?.find((cam: any) => cam.isDefault);
  const cameraPixelX = defaultCamera ? (defaultCamera.position?.x ?? 0.5) * (defaultCamera.width ?? 1920) : 0;
  const cameraPixelY = defaultCamera ? (defaultCamera.position?.y ?? 0.5) * (defaultCamera.height ?? 1080) : 0;

  // Position du layer relative à la caméra
  const cameraPosition = {
    x: (layer.position?.x ?? 0) - cameraPixelX,
    y: (layer.position?.y ?? 0) - cameraPixelY
  };

  const currentScale = layer.scale || 1.0;
  const width = layer.width || (svgSize.width * currentScale);
  const height = layer.height || (svgSize.height * currentScale);

  // Soft bounds margin to prevent mouse desync during dragging
  const DRAG_MARGIN = 500;
  
  // Allow dragging without strict bounds to prevent mouse desync issues
  const dragBoundFunc = (pos: { x: number; y: number }) => {
    // Only apply soft bounds - allow some overflow to maintain mouse tracking
    let newX = Math.max(-DRAG_MARGIN, Math.min(STAGE_WIDTH + DRAG_MARGIN, pos.x));
    let newY = Math.max(-DRAG_MARGIN, Math.min(STAGE_HEIGHT + DRAG_MARGIN, pos.y));

    return { x: newX, y: newY };
  };

  return (
    <>
      <Group
        x={layer.position?.x || 0}
        y={layer.position?.y || 0}
        scaleX={(layer.scale || 1.0) * (layer.flipX ? -1 : 1)}
        scaleY={(layer.scale || 1.0) * (layer.flipY ? -1 : 1)}
        offsetX={layer.flipX ? svgSize.width : 0}
        offsetY={layer.flipY ? svgSize.height : 0}
        rotation={layer.rotation || 0}
        opacity={layer.opacity || 1.0}
        draggable={!layer.locked}
        dragBoundFunc={dragBoundFunc}
        onClick={(e) => onSelect(e)}
        onTap={(e) => onSelect(e)}
        ref={groupRef}
        onDragStart={(e) => {
          dragStartPosRef.current = {
            x: e.target.x(),
            y: e.target.y(),
            currentX: e.target.x(),
            currentY: e.target.y()
          };
        }}
        onDragMove={(e) => {
          if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
            dragStartPosRef.current.currentX = e.target.x();
            dragStartPosRef.current.currentY = e.target.y();
          }
        }}
        onDragEnd={(e) => {
          const finalX = e.target.x();
          const finalY = e.target.y();

          let updatedLayer = {
            ...layer,
            position: {
              x: finalX,
              y: finalY,
            }
          };

          // Update camera_position based on new position
          updatedLayer = updateLayerCameraPosition(updatedLayer, sceneCameras);

          if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
            const deltaX = finalX - dragStartPosRef.current.x;
            const deltaY = finalY - dragStartPosRef.current.y;

            applyMultiLayerDrag(selectedLayerIds, layer.id, updatedLayer, allLayers, deltaX, deltaY, onChange, sceneCameras);
          } else {
            onChange(updatedLayer);
          }

          dragStartPosRef.current = null;
        }}
        onTransformEnd={() => {
          const node = groupRef.current;
          if (!node) return;

          // La nouvelle échelle est la valeur absolue de scaleX du node
          const newScale = Math.abs(node.scaleX()); 
          
          // Calcul des nouvelles dimensions affichées
          const newWidth = svgSize.width * newScale;
          const newHeight = svgSize.height * newScale;

          let updatedLayer = {
            ...layer,
            position: {
              x: node.x(),
              y: node.y(),
            },
            width: newWidth,
            height: newHeight,
            scale: newScale,
            rotation: node.rotation(),
          };

          // Update camera_position based on new position
          updatedLayer = updateLayerCameraPosition(updatedLayer, sceneCameras);
          
          onChange(updatedLayer);

          // Réinitialiser le scale du nœud Konva à l'état de base
          node.scaleX(layer.flipX ? -1 : 1);
          node.scaleY(layer.flipY ? -1 : 1);
        }}
      >
        {paths.map((path, index) => (
          <Path
            key={index}
            data={path.data}
            fill={path.fill}
            stroke={path.stroke}
            strokeWidth={path.strokeWidth}
          />
        ))}
      </Group>
      {isSelected && !layer.locked && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }

            if (newBox.x < 0 || newBox.y < 0 ||
              newBox.x + newBox.width > STAGE_WIDTH ||
              newBox.y + newBox.height > STAGE_HEIGHT) {
              return oldBox;
            }

            return newBox;
          }}
        />
      )}
    </>
  );
};

function areEqual(prevProps: LayerSvgProps, nextProps: LayerSvgProps) {
  const l1 = prevProps.layer;
  const l2 = nextProps.layer;
  
  // Compare shape_config properties individually for better performance
  const config1 = l1.shape_config || {};
  const config2 = l2.shape_config || {};
  const shapeConfigEqual = 
    config1.color === config2.color &&
    config1.fill_color === config2.fill_color &&
    config1.stroke_width === config2.stroke_width;
  
  return (
    l1.id === l2.id &&
    l1.svg_path === l2.svg_path &&
    l1.position?.x === l2.position?.x &&
    l1.position?.y === l2.position?.y &&
    l1.scale === l2.scale &&
    l1.width === l2.width &&
    l1.height === l2.height &&
    l1.rotation === l2.rotation &&
    l1.locked === l2.locked &&
    shapeConfigEqual &&
    prevProps.isSelected === nextProps.isSelected
  );
}

export const LayerSvg = React.memo(LayerSvgComponent, areEqual);