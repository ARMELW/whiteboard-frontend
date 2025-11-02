import React, { useRef, useState, useEffect } from 'react';
import { Path, Transformer, Group } from 'react-konva';
import Konva from 'konva';

export interface ThumbnailSvgLayerProps {
  layer: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: any) => void;
}

interface ParsedPath {
  data: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export const ThumbnailSvgLayer: React.FC<ThumbnailSvgLayerProps> = ({
  layer,
  isSelected,
  onSelect,
  onChange
}) => {
  const [paths, setPaths] = useState<ParsedPath[]>([]);
  const [svgSize, setSvgSize] = useState({ width: 100, height: 100 });
  const [loading, setLoading] = useState(true);
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    const loadSvg = async (url: string) => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const svgText = await response.text();
        
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
          const width = parseFloat(svgElement.getAttribute('width') || '100');
          const height = parseFloat(svgElement.getAttribute('height') || '100');
          const viewBox = svgElement.getAttribute('viewBox');
          
          if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
            setSvgSize({ width: vbWidth || width, height: vbHeight || height });
          } else {
            setSvgSize({ width, height });
          }
          
          const pathElements = svgDoc.querySelectorAll('path');
          const parsedPaths: ParsedPath[] = [];
          
          pathElements.forEach((pathElement) => {
            const d = pathElement.getAttribute('d');
            if (d) {
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

  const handleDragEnd = (e: any) => {
    onChange({
      ...layer,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = groupRef.current;
    if (!node) return;

    const newScale = Math.abs(node.scaleX()); 
    const newWidth = svgSize.width * newScale;
    const newHeight = svgSize.height * newScale;

    onChange({
      ...layer,
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
      scaleX: newScale,
      scaleY: newScale,
      rotation: node.rotation(),
    });

    node.scaleX(1);
    node.scaleY(1);
  };

  return (
    <>
      <Group
        x={layer.x || 0}
        y={layer.y || 0}
        scaleX={(layer.scaleX || 1) * (layer.flipX ? -1 : 1)}
        scaleY={(layer.scaleY || 1) * (layer.flipY ? -1 : 1)}
        offsetX={layer.flipX ? svgSize.width : 0}
        offsetY={layer.flipY ? svgSize.height : 0}
        rotation={layer.rotation || 0}
        opacity={layer.opacity || 1.0}
        draggable={!layer.locked}
        onClick={onSelect}
        onTap={onSelect}
        ref={groupRef}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
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
            return newBox;
          }}
        />
      )}
    </>
  );
};
