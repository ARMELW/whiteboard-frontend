import React, { useRef, useState, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { applyMultiLayerDrag } from '@/utils/multiLayerDrag';
import { updateLayerCameraPosition } from '@/utils/cameraAnimator';

export interface LayerTextProps {
  layer: any;
  isSelected: boolean;
  onSelect: (e?: any) => void;
  onChange: (layer: any) => void;
  onStartEditing?: () => void;
  onStopEditing?: () => void;
  selectedLayerIds?: string[];
  allLayers?: any[];
  sceneCameras?: any[];
}

export const LayerText: React.FC<LayerTextProps> = ({ 
  layer, 
  isSelected, 
  onSelect, 
  onChange,
  onStartEditing,
  onStopEditing,
  selectedLayerIds = [],
  allLayers = [],
  sceneCameras = []
}) => {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [textOffsets, setTextOffsets] = useState({ offsetX: 0, offsetY: 0 });
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (textRef.current) {
      const node = textRef.current;
      const scale = layer.scale || 1.0;
      const align = layer.text_config?.align || 'left';
      
      const width = node.width();
      const height = node.height();
      
      setTextOffsets({
        offsetX: align === 'center' ? width / 2 : 0,
        offsetY: height / 2
      });
    }
  }, [layer.text_config?.text, layer.text_config?.size, layer.text_config?.font, layer.text_config?.align, layer.scale]);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const textConfig = layer.text_config || {};
  const text = textConfig.text || 'Texte';
  const fontSize = textConfig.size || 48;
  const fontFamily = textConfig.font || 'Arial';
  
  let fontStyle = 'normal';
  if (textConfig.style === 'bold') fontStyle = 'bold';
  else if (textConfig.style === 'italic') fontStyle = 'italic';
  else if (textConfig.style === 'bold_italic') fontStyle = 'bold italic';
  
  let fill = '#000000';
  if (Array.isArray(textConfig.color)) {
    fill = `#${textConfig.color.map((c: number) => c.toString(16).padStart(2, '0')).join('')}`;
  } else if (typeof textConfig.color === 'string') {
    fill = textConfig.color;
  }

  const align = textConfig.align || 'left';
  const lineHeight = textConfig.line_height || 1.2;

  const handleDoubleClick = () => {
    // Notify parent that editing has started
    if (onStartEditing) onStartEditing();
  };

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = textRef.current;
    if (!node) return pos;

    const scale = layer.scale || 1.0;
    const scaleX = layer.scaleX || 1.0;
    const scaleY = layer.scaleY || 1.0;
    const width = node.width() * scale * scaleX;
    const height = node.height() * scale * scaleY;
    
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
      <Text
        text={text}
        x={layer.position?.x || 0}
        y={layer.position?.y || 0}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontStyle={fontStyle}
        fill={fill}
        align={align}
        lineHeight={lineHeight}
        rotation={layer.rotation || 0}
        scaleX={(layer.scale || 1.0) * (layer.scaleX || 1.0)}
        scaleY={(layer.scale || 1.0) * (layer.scaleY || 1.0)}
        opacity={layer.opacity || 1.0}
        offsetX={textOffsets.offsetX}
        offsetY={textOffsets.offsetY}
        draggable={!layer.locked}
        dragBoundFunc={dragBoundFunc}
        onClick={(e) => onSelect(e)}
        onTap={(e) => onSelect(e)}
        onDblClick={handleDoubleClick}
        onDblTap={handleDoubleClick}
        ref={textRef}
        onDragStart={(e) => {
          dragStartPosRef.current = {
            x: e.target.x(),
            y: e.target.y(),
            currentX: e.target.x(),
            currentY: e.target.y()
          };
        }}
        onDragMove={(e) => {
          // Just track position for the final update
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
        }}
        onTransformEnd={() => {
          const node = textRef.current;
          if (!node) return;
          const transformScaleX = node.scaleX();
          const transformScaleY = node.scaleY();
          
          // Strategy: Keep base width/height and scale constant
          // Update scaleX/scaleY to reflect the resize transformation
          const textWidth = node.width();
          const textHeight = node.height();
          const currentScaleX = layer.scaleX || 1.0;
          const currentScaleY = layer.scaleY || 1.0;
          
          const newScaleX = currentScaleX * transformScaleX;
          const newScaleY = currentScaleY * transformScaleY;
          
          let updatedLayer = {
            ...layer,
            position: {
              x: node.x(),
              y: node.y(),
            },
            width: textWidth, // Keep intrinsic text width
            height: textHeight, // Keep intrinsic text height
            scale: layer.scale || 1.0, // Keep scale constant (don't change on resize)
            scaleX: newScaleX, // Update scaleX to reflect resize
            scaleY: newScaleY, // Update scaleY to reflect resize
            rotation: node.rotation(),
          };

          // Update camera_position based on new position
          updatedLayer = updateLayerCameraPosition(updatedLayer, sceneCameras);
          
          onChange(updatedLayer);
          node.scaleX(1);
          node.scaleY(1);
          // Keep selection after transform
          if (typeof onSelect === 'function') onSelect();
        }}
      />
      {isSelected && !layer.locked && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) {
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
