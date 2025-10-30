import React, { useRef } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { applyMultiLayerDrag } from '@/utils/multiLayerDrag';

export interface LayerImageProps {
  layer: any;
  isSelected: boolean;
  onSelect: (e?: any) => void;
  onChange: (layer: any) => void;
  selectedLayerIds?: string[];
  allLayers?: any[];
}

const LayerImageComponent: React.FC<LayerImageProps> = ({ 
  layer, 
  isSelected, 
  onSelect, 
  onChange,
  selectedLayerIds = [],
  allLayers = []
}) => {
  const [img] = useImage(layer.image_path);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current && img) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected, img]);

  if (!img) return null;

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = imageRef.current;
    if (!node) return pos;

    const scale = layer.scale || 1.0;
    const width = img.width * scale;
    const height = img.height * scale;
    
    let newX = pos.x;
    let newY = pos.y;

    if (newX < 0) newX = 0;
    if (newX + width > 1920) newX = 1920 - width;

    if (newY < 0) newY = 0;
    if (newY + height > 1080) newY = 1080 - height;

    return { x: newX, y: newY };
  };

  return (
    <>
      <KonvaImage
        image={img}
        x={layer.position?.x || 0}
        y={layer.position?.y || 0}
        scaleX={(layer.scale || 1.0) * (layer.scaleX || 1.0) * (layer.flipX ? -1 : 1)}
        scaleY={(layer.scale || 1.0) * (layer.scaleY || 1.0) * (layer.flipY ? -1 : 1)}
        offsetX={layer.flipX ? img.width : 0}
        offsetY={layer.flipY ? img.height : 0}
        rotation={layer.rotation || 0}
        opacity={layer.opacity || 1.0}
        draggable={!layer.locked}
        dragBoundFunc={dragBoundFunc}
        onClick={(e) => onSelect(e)}
        onTap={(e) => onSelect(e)}
        ref={imageRef}
        onDragStart={(e) => {
          // Store initial position for multi-layer drag
          dragStartPosRef.current = {
            x: e.target.x(),
            y: e.target.y(),
            currentX: e.target.x(),
            currentY: e.target.y()
          };
        }}
        onDragMove={(e) => {
          // Just track position, don't update other layers yet (will do it in onDragEnd)
          if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
            // Track current position for the final update
            dragStartPosRef.current.currentX = e.target.x();
            dragStartPosRef.current.currentY = e.target.y();
          }
        }}
        onDragEnd={(e) => {
          const finalX = e.target.x();
          const finalY = e.target.y();
          
          const updatedLayer = {
            ...layer,
            position: {
              x: finalX,
              y: finalY,
            }
          };
          
          // If multiple layers were selected, batch all updates together
          if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
            const deltaX = finalX - dragStartPosRef.current.x;
            const deltaY = finalY - dragStartPosRef.current.y;
            
            applyMultiLayerDrag(selectedLayerIds, layer.id, updatedLayer, allLayers, deltaX, deltaY, onChange);
          } else {
            // Single layer drag
            onChange(updatedLayer);
          }
          
          dragStartPosRef.current = null;
        }}
        onTransformEnd={() => {
          const node = imageRef.current;
          if (!node) return;
          
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          // Calculate new dimensions after transform
          // Strategy: Absorb transform scale into width/height, keep layer.scale the same
          // This ensures width/height always reflect the actual base dimensions
          const currentWidth = layer.width || img.width;
          const currentHeight = layer.height || img.height;
          
          // New base dimensions = current dimensions * transform scale
          const newWidth = currentWidth * scaleX;
          const newHeight = currentHeight * scaleY;

          onChange({
            ...layer,
            position: {
              x: node.x(),
              y: node.y(),
            },
            width: newWidth,
            height: newHeight,
            scale: layer.scale || 1.0, // Keep original scale
            rotation: node.rotation(),
          });
          
          node.scaleX(1);
          node.scaleY(1);
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

function areEqual(prevProps: LayerImageProps, nextProps: LayerImageProps) {
  // Compare layer id, position, scale, rotation, isSelected, locked
  const l1 = prevProps.layer;
  const l2 = nextProps.layer;
  return (
    l1.id === l2.id &&
    l1.position?.x === l2.position?.x &&
    l1.position?.y === l2.position?.y &&
    l1.scale === l2.scale &&
    l1.rotation === l2.rotation &&
    l1.locked === l2.locked &&
    prevProps.isSelected === nextProps.isSelected
  );
}

export const LayerImage = React.memo(LayerImageComponent, areEqual);