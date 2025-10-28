import React, { useRef } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';

export interface LayerImageProps {
  layer: any;
  isSelected: boolean;
  onSelect: (e?: any) => void;
  onChange: (layer: any) => void;
  selectedLayerIds?: string[];
  allLayers?: any[];
}

export const LayerImage: React.FC<LayerImageProps> = ({ 
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

    const scale = (layer.scale || 1.0) * (layer.scaleX || 1.0);
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
            y: e.target.y()
          };
        }}
        onDragMove={(e) => {
          // Update drag start position during drag for multi-layer support
          // but don't call onChange during drag to avoid excessive updates
          if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
            dragStartPosRef.current = {
              x: e.target.x(),
              y: e.target.y()
            };
          }
        }}
        onDragEnd={(e) => {
          const finalX = e.target.x();
          const finalY = e.target.y();
          
          // Update main layer position
          onChange({
            ...layer,
            position: {
              x: finalX,
              y: finalY,
            }
          });
          
          // If multiple layers were selected, update their positions as well
          if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
            const deltaX = finalX - dragStartPosRef.current.x;
            const deltaY = finalY - dragStartPosRef.current.y;
            
            // Update all other selected layers
            selectedLayerIds.forEach((layerId) => {
              if (layerId !== layer.id) {
                const targetLayer = allLayers.find(l => l.id === layerId);
                if (targetLayer) {
                  onChange({
                    ...targetLayer,
                    position: {
                      x: (targetLayer.position?.x || 0) + deltaX,
                      y: (targetLayer.position?.y || 0) + deltaY
                    }
                  });
                }
              }
            });
          }
          
          dragStartPosRef.current = null;
        }}
        onTransformEnd={() => {
          const node = imageRef.current;
          if (!node) return;
          
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const currentScale = layer.scale || 1.0;
          const currentScaleX = layer.scaleX || 1.0;
          const currentScaleY = layer.scaleY || 1.0;
          
          const newScale = currentScale * currentScaleX * scaleX;

          onChange({
            ...layer,
            position: {
              x: node.x(),
              y: node.y(),
            },
            scale: newScale,
            scaleX: 1.0,
            scaleY: 1.0,
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
