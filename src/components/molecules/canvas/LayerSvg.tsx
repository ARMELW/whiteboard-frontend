import React, { useRef } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
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

const LayerSvgComponent: React.FC<LayerSvgProps> = ({
  layer,
  isSelected,
  onSelect,
  onChange,
  selectedLayerIds = [],
  allLayers = [],
  sceneCameras = []
}) => {
  const [img] = useImage(layer.svg_path);
  const svgRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const dragStartPosRef = useRef<{ x: number; y: number; currentX?: number; currentY?: number } | null>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && svgRef.current && img) {
      transformerRef.current.nodes([svgRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected, img]);

  if (!img) return null;

  const defaultCamera = sceneCameras?.find((cam: any) => cam.isDefault);
  const cameraPixelX = defaultCamera ? (defaultCamera.position?.x ?? 0.5) * (defaultCamera.width ?? 1920) : 0;
  const cameraPixelY = defaultCamera ? (defaultCamera.position?.y ?? 0.5) * (defaultCamera.height ?? 1080) : 0;

  const cameraPosition = {
    x: (layer.position?.x ?? 0) - cameraPixelX,
    y: (layer.position?.y ?? 0) - cameraPixelY
  };

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = svgRef.current;
    if (!node) return pos;

    const currentScale = layer.scale || 1.0;
    const width = layer.width || (img.width * currentScale); 
    const height = layer.height || (img.height * currentScale);

    let newX = pos.x;
    let newY = pos.y;
    const stageWidth = 1920;
    const stageHeight = 1080;

    if (newX < 0) newX = 0;
    if (newX + width > stageWidth) newX = stageWidth - width;

    if (newY < 0) newY = 0;
    if (newY + height > stageHeight) newY = stageHeight - height;

    return { x: newX, y: newY };
  };

  return (
    <>
      <KonvaImage
        image={img}
        x={layer.position?.x || 0}
        y={layer.position?.y || 0}
        scaleX={(layer.scale || 1.0) * (layer.flipX ? -1 : 1)}
        scaleY={(layer.scale || 1.0) * (layer.flipY ? -1 : 1)}
        offsetX={layer.flipX ? img.width : 0}
        offsetY={layer.flipY ? img.height : 0}
        rotation={layer.rotation || 0}
        opacity={layer.opacity || 1.0}
        draggable={!layer.locked}
        dragBoundFunc={dragBoundFunc}
        onClick={(e) => onSelect(e)}
        onTap={(e) => onSelect(e)}
        ref={svgRef}
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
          const node = svgRef.current;
          if (!node) return;

          const newScale = Math.abs(node.scaleX()); 
          const newWidth = img.width * newScale;
          const newHeight = img.height * newScale;

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

          updatedLayer = updateLayerCameraPosition(updatedLayer, sceneCameras);
          
          onChange(updatedLayer);

          node.scaleX(layer.flipX ? -1 : 1);
          node.scaleY(layer.flipY ? -1 : 1);
        }}
      />
      {isSelected && !layer.locked && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }

            if (newBox.x < 0 || newBox.y < 0 ||
              newBox.x + newBox.width > 1920 ||
              newBox.y + newBox.height > 1080) {
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
  return (
    l1.id === l2.id &&
    l1.position?.x === l2.position?.x &&
    l1.position?.y === l2.position?.y &&
    l1.scale === l2.scale &&
    l1.width === l2.width &&
    l1.height === l2.height &&
    l1.rotation === l2.rotation &&
    l1.locked === l2.locked &&
    prevProps.isSelected === nextProps.isSelected
  );
}

export const LayerSvg = React.memo(LayerSvgComponent, areEqual);
