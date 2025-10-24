import React, { useRef, useState, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';

export interface LayerTextProps {
  layer: any;
  isSelected: boolean;
  onSelect: (e?: any) => void;
  onChange: (layer: any) => void;
  onStartEditing?: () => void;
  onStopEditing?: () => void;
  selectedLayerIds?: string[];
  allLayers?: any[];
}

export const LayerText: React.FC<LayerTextProps> = ({ 
  layer, 
  isSelected, 
  onSelect, 
  onChange,
  onStartEditing,
  onStopEditing,
  selectedLayerIds = [],
  allLayers = []
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
    const width = node.width() * scale;
    const height = node.height() * scale;
    
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
        scaleX={layer.scale || 1.0}
        scaleY={layer.scale || 1.0}
        opacity={layer.opacity || 1.0}
        offsetX={textOffsets.offsetX}
        offsetY={textOffsets.offsetY}
        draggable
        dragBoundFunc={dragBoundFunc}
        onClick={(e) => onSelect(e)}
        onTap={(e) => onSelect(e)}
        onDblClick={handleDoubleClick}
        onDblTap={handleDoubleClick}
        ref={textRef}
        onDragStart={(e) => {
          dragStartPosRef.current = {
            x: e.target.x(),
            y: e.target.y()
          };
        }}
        onDragMove={(e) => {
          if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
            const deltaX = e.target.x() - dragStartPosRef.current.x;
            const deltaY = e.target.y() - dragStartPosRef.current.y;
            
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
            
            dragStartPosRef.current = {
              x: e.target.x(),
              y: e.target.y()
            };
          }
        }}
        onDragEnd={(e) => {
          onChange({
            ...layer,
            position: {
              x: e.target.x(),
              y: e.target.y(),
            }
          });
          dragStartPosRef.current = null;
        }}
        onTransformEnd={() => {
          const node = textRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          onChange({
            ...layer,
            position: {
              x: node.x(),
              y: node.y(),
            },
            scale: scaleX,
            rotation: node.rotation(),
          });
          node.scaleX(1);
          node.scaleY(1);
          // Keep selection after transform
          if (typeof onSelect === 'function') onSelect();
        }}
      />
      {isSelected && (
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
