import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer as KonvaLayer, Rect, Text as KonvaText, Group } from 'react-konva';
import Konva from 'konva';
import { LayerImage } from './canvas/LayerImage';
import { LayerText } from './canvas/LayerText';
import LayerShape from '../LayerShape';
import { ShapeLayer } from '../../utils/shapeUtils';
import type { Scene, Layer, Camera } from '../../app/scenes/types';

interface RealScenePreviewProps {
  scene: Scene;
  selectedCamera?: Camera;
  sceneWidth: number;
  sceneHeight: number;
  zoom: number;
  showDebugInfo?: boolean;
}

/**
 * RealScenePreview Component
 * Shows the scene exactly as it will be rendered in the final export/video,
 * with optional debugging information overlay
 */
const RealScenePreview: React.FC<RealScenePreviewProps> = ({
  scene,
  selectedCamera,
  sceneWidth,
  sceneHeight,
  zoom,
  showDebugInfo = true
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [cameraViewport, setCameraViewport] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Calculate camera viewport in scene coordinates
  useEffect(() => {
    if (!selectedCamera) {
      setCameraViewport(null);
      return;
    }

    const cameraWidth = selectedCamera.width || 800;
    const cameraHeight = selectedCamera.height || 450;
    const cameraZoom = selectedCamera.zoom || 1;
    
    // Camera position is normalized (0-1), convert to pixels
    const cameraCenterX = (selectedCamera.position?.x || 0.5) * sceneWidth;
    const cameraCenterY = (selectedCamera.position?.y || 0.5) * sceneHeight;
    
    // Calculate viewport dimensions with zoom
    const viewportWidth = cameraWidth / cameraZoom;
    const viewportHeight = cameraHeight / cameraZoom;
    
    // Calculate top-left corner of viewport
    const viewportX = cameraCenterX - viewportWidth / 2;
    const viewportY = cameraCenterY - viewportHeight / 2;
    
    setCameraViewport({
      x: viewportX,
      y: viewportY,
      width: viewportWidth,
      height: viewportHeight
    });
  }, [selectedCamera, sceneWidth, sceneHeight]);

  // Sort layers by z_index
  const sortedLayers = [...(scene.layers || [])].sort((a: Layer, b: Layer) => 
    (a.z_index || 0) - (b.z_index || 0)
  );

  const scaledSceneWidth = sceneWidth * zoom;
  const scaledSceneHeight = sceneHeight * zoom;

  return (
    <div className="relative">
      <Stage
        width={sceneWidth}
        height={sceneHeight}
        scaleX={zoom}
        scaleY={zoom}
        style={{
          width: `${scaledSceneWidth}px`,
          height: `${scaledSceneHeight}px`,
          backgroundImage: scene.backgroundImage 
            ? `url(${scene.backgroundImage})` 
            : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        ref={stageRef}
      >
        {/* Main Content Layer */}
        <KonvaLayer>
          {sortedLayers.map((layer: Layer) => {
            if (layer.type === 'text') {
              return (
                <LayerText
                  key={layer.id}
                  layer={layer}
                  isSelected={false}
                  onSelect={() => {}}
                  onChange={() => {}}
                />
              );
            } else if (layer.type === 'shape') {
              return (
                <LayerShape
                  key={layer.id}
                  layer={layer as ShapeLayer}
                  isSelected={false}
                  onSelect={() => {}}
                  onChange={() => {}}
                />
              );
            } else {
              return (
                <LayerImage
                  key={layer.id}
                  layer={layer}
                  isSelected={false}
                  onSelect={() => {}}
                  onChange={() => {}}
                />
              );
            }
          })}
        </KonvaLayer>

        {/* Debug Overlay Layer */}
        {showDebugInfo && (
          <KonvaLayer listening={false}>
            {/* Camera Viewport Highlight */}
            {cameraViewport && selectedCamera && (
              <Group>
                {/* Semi-transparent overlay outside camera */}
                <Rect
                  x={0}
                  y={0}
                  width={sceneWidth}
                  height={sceneHeight}
                  fill="rgba(0, 0, 0, 0.5)"
                />
                
                {/* Clear area inside camera viewport */}
                <Rect
                  x={cameraViewport.x}
                  y={cameraViewport.y}
                  width={cameraViewport.width}
                  height={cameraViewport.height}
                  fill="rgba(0, 0, 0, 0)"
                  globalCompositeOperation="destination-out"
                />
                
                {/* Camera viewport border */}
                <Rect
                  x={cameraViewport.x}
                  y={cameraViewport.y}
                  width={cameraViewport.width}
                  height={cameraViewport.height}
                  stroke="#22c55e"
                  strokeWidth={4 / zoom}
                  dash={[10 / zoom, 10 / zoom]}
                  listening={false}
                />
                
                {/* Camera label */}
                <Rect
                  x={cameraViewport.x}
                  y={cameraViewport.y - 30 / zoom}
                  width={200 / zoom}
                  height={25 / zoom}
                  fill="#22c55e"
                  cornerRadius={4 / zoom}
                />
                <KonvaText
                  x={cameraViewport.x + 5 / zoom}
                  y={cameraViewport.y - 28 / zoom}
                  text={`📹 ${selectedCamera.name || 'Camera'} (${selectedCamera.zoom}x)`}
                  fontSize={14 / zoom}
                  fill="white"
                  fontFamily="Inter, sans-serif"
                  fontStyle="bold"
                />
              </Group>
            )}

            {/* Layer Position Markers */}
            {sortedLayers.map((layer: Layer) => {
              const pos = layer.position || { x: sceneWidth / 2, y: sceneHeight / 2 };
              const isInView = cameraViewport 
                ? pos.x >= cameraViewport.x && 
                  pos.x <= cameraViewport.x + cameraViewport.width &&
                  pos.y >= cameraViewport.y && 
                  pos.y <= cameraViewport.y + cameraViewport.height
                : true;

              return (
                <Group key={`debug-${layer.id}`}>
                  {/* Position crosshair */}
                  <Rect
                    x={pos.x - 10 / zoom}
                    y={pos.y - 1 / zoom}
                    width={20 / zoom}
                    height={2 / zoom}
                    fill={isInView ? "#ef4444" : "#94a3b8"}
                  />
                  <Rect
                    x={pos.x - 1 / zoom}
                    y={pos.y - 10 / zoom}
                    width={2 / zoom}
                    height={20 / zoom}
                    fill={isInView ? "#ef4444" : "#94a3b8"}
                  />
                  
                  {/* Position info label */}
                  <Rect
                    x={pos.x + 12 / zoom}
                    y={pos.y - 10 / zoom}
                    width={150 / zoom}
                    height={18 / zoom}
                    fill="rgba(0, 0, 0, 0.8)"
                    cornerRadius={3 / zoom}
                  />
                  <KonvaText
                    x={pos.x + 15 / zoom}
                    y={pos.y - 8 / zoom}
                    text={`${layer.name || layer.type} (${Math.round(pos.x)}, ${Math.round(pos.y)})`}
                    fontSize={12 / zoom}
                    fill={isInView ? "#22c55e" : "#94a3b8"}
                    fontFamily="monospace"
                  />
                </Group>
              );
            })}
          </KonvaLayer>
        )}
      </Stage>
    </div>
  );
};

export default RealScenePreview;
