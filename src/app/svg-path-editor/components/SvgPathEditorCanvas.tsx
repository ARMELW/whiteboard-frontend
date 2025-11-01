import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Circle, Line, Text, Image as KonvaImage } from 'react-konva';
import { usePathEditorStore } from '../store';
import { SVG_PATH_EDITOR_CONFIG } from '../config';
import { Point } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const SvgPathEditorCanvas: React.FC = () => {
  const {
    svgData,
    points,
    selectedPointId,
    canvasState,
    addPoint,
    updatePoint,
    selectPoint,
    deletePoint,
    setCanvasState,
  } = usePathEditorStore();

  const [svgImage, setSvgImage] = useState<HTMLImageElement | null>(null);
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (svgData) {
      const img = new window.Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData.content);
      img.onload = () => {
        setSvgImage(img);
        
        const scaleX = (SVG_PATH_EDITOR_CONFIG.canvas.width * 0.8) / svgData.width;
        const scaleY = (SVG_PATH_EDITOR_CONFIG.canvas.height * 0.8) / svgData.height;
        const scale = Math.min(scaleX, scaleY, 1);
        
        const offsetX = (SVG_PATH_EDITOR_CONFIG.canvas.width - svgData.width * scale) / 2;
        const offsetY = (SVG_PATH_EDITOR_CONFIG.canvas.height - svgData.height * scale) / 2;
        
        setCanvasState({ scale, offsetX, offsetY });
      };
    }
  }, [svgData, setCanvasState]);

  useEffect(() => {
    const { undo: undoAction, redo: redoAction } = usePathEditorStore.getState();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedPointId) {
        deletePoint(selectedPointId);
      } else if (e.key === 'Escape') {
        selectPoint(null);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoAction();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redoAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPointId, deletePoint, selectPoint]);

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage() || e.target.getClassName() === 'Image') {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      
      if (pointerPosition && svgData) {
        const x = (pointerPosition.x - canvasState.offsetX) / canvasState.scale;
        const y = (pointerPosition.y - canvasState.offsetY) / canvasState.scale;
        
        if (x >= 0 && x <= svgData.width && y >= 0 && y <= svgData.height) {
          const newPoint: Point = {
            id: uuidv4(),
            x,
            y,
          };
          addPoint(newPoint);
          selectPoint(newPoint.id);
        }
      }
    }
  };

  const handlePointDragStart = (pointId: string) => {
    setDraggingPointId(pointId);
    selectPoint(pointId);
  };

  const handlePointDragMove = (pointId: string, e: any) => {
    const x = (e.target.x() - canvasState.offsetX) / canvasState.scale;
    const y = (e.target.y() - canvasState.offsetY) / canvasState.scale;
    updatePoint(pointId, x, y);
  };

  const handlePointDragEnd = () => {
    setDraggingPointId(null);
  };

  const handlePointClick = (pointId: string) => {
    selectPoint(pointId);
  };

  const renderLines = () => {
    if (points.length < 2) return null;

    const linePoints: number[] = [];
    points.forEach((point) => {
      linePoints.push(
        point.x * canvasState.scale + canvasState.offsetX,
        point.y * canvasState.scale + canvasState.offsetY
      );
    });

    return (
      <Line
        points={linePoints}
        stroke={SVG_PATH_EDITOR_CONFIG.line.stroke}
        strokeWidth={SVG_PATH_EDITOR_CONFIG.line.strokeWidth}
        dash={SVG_PATH_EDITOR_CONFIG.line.dash}
        listening={false}
      />
    );
  };

  const renderPoints = () => {
    return points.map((point, index) => {
      const isSelected = point.id === selectedPointId;
      const isDragging = point.id === draggingPointId;

      return (
        <React.Fragment key={point.id}>
          <Circle
            x={point.x * canvasState.scale + canvasState.offsetX}
            y={point.y * canvasState.scale + canvasState.offsetY}
            radius={SVG_PATH_EDITOR_CONFIG.point.radius}
            fill={
              isSelected
                ? SVG_PATH_EDITOR_CONFIG.point.selectedFill
                : SVG_PATH_EDITOR_CONFIG.point.fill
            }
            stroke={SVG_PATH_EDITOR_CONFIG.point.stroke}
            strokeWidth={SVG_PATH_EDITOR_CONFIG.point.strokeWidth}
            draggable
            onDragStart={() => handlePointDragStart(point.id)}
            onDragMove={(e) => handlePointDragMove(point.id, e)}
            onDragEnd={handlePointDragEnd}
            onClick={() => handlePointClick(point.id)}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                container.style.cursor = 'pointer';
              }
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                container.style.cursor = 'default';
              }
            }}
            shadowColor={isSelected ? 'rgba(239, 68, 68, 0.5)' : 'rgba(59, 130, 246, 0.3)'}
            shadowBlur={isSelected ? 10 : 5}
            shadowOpacity={isDragging ? 0.8 : 0.5}
          />
          <Text
            x={point.x * canvasState.scale + canvasState.offsetX + 12}
            y={point.y * canvasState.scale + canvasState.offsetY - 8}
            text={String(index + 1)}
            fontSize={14}
            fill="#ffffff"
            listening={false}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
      <Stage
        ref={stageRef}
        width={SVG_PATH_EDITOR_CONFIG.canvas.width}
        height={SVG_PATH_EDITOR_CONFIG.canvas.height}
        onClick={handleStageClick}
      >
        <Layer>
          {svgImage && svgData && (
            <KonvaImage
              image={svgImage}
              x={canvasState.offsetX}
              y={canvasState.offsetY}
              width={svgData.width * canvasState.scale}
              height={svgData.height * canvasState.scale}
              listening={true}
            />
          )}
          {renderLines()}
          {renderPoints()}
        </Layer>
      </Stage>
      
      {!svgData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-lg mb-2">No SVG loaded</p>
            <p className="text-sm">Upload an SVG file to start editing</p>
          </div>
        </div>
      )}
      
      {svgData && points.length === 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm">Click on the SVG to add points</p>
        </div>
      )}
    </div>
  );
};
