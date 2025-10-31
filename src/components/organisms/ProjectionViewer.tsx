/**
 * ProjectionViewer Component
 * Displays layers projected onto the screen to verify coordinate accuracy
 */

import React, { useState } from 'react';
import { useSceneStore } from '@/app/scenes';
import { useSceneProjection } from '@/hooks/useProjection';
import type { Scene } from '@/app/scenes/types';

interface ProjectionViewerProps {
  scene: Scene;
  showGrid?: boolean;
  showCoordinates?: boolean;
  showBounds?: boolean;
}

export const ProjectionViewer: React.FC<ProjectionViewerProps> = ({
  scene,
  showGrid = true,
  showCoordinates = true,
  showBounds = true
}) => {
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<string>('fhd');
  
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  const {
    screenWidth,
    screenHeight,
    projectionScale,
    projectedLayers
  } = useSceneProjection(scene);

  const resolutions = {
    sd: { width: 640, height: 480, label: 'SD (640×480)' },
    hd: { width: 1280, height: 720, label: 'HD (1280×720)' },
    fhd: { width: 1920, height: 1080, label: 'Full HD (1920×1080)' },
    '2k': { width: 2560, height: 1440, label: '2K (2560×1440)' },
    '4k': { width: 3840, height: 2160, label: '4K (3840×2160)' }
  };

  const handleResolutionChange = (resolution: string) => {
    setSelectedResolution(resolution);
    const res = resolutions[resolution as keyof typeof resolutions];
    if (res) {
      setProjectionScreen(res.width, res.height);
    }
  };

  const visibleLayers = projectedLayers.filter(l => l.isVisible);
  const hiddenLayers = projectedLayers.filter(l => !l.isVisible);

  return (
    <div className="projection-viewer" style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      {/* Controls */}
      <div style={{ 
        marginBottom: 20, 
        display: 'flex', 
        gap: 20, 
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <label style={{ marginRight: 10, fontWeight: 'bold' }}>Resolution:</label>
          <select 
            value={selectedResolution}
            onChange={(e) => handleResolutionChange(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              borderRadius: 4, 
              border: '1px solid #ddd',
              cursor: 'pointer'
            }}
          >
            {Object.entries(resolutions).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: '#666' }}>
            <strong>Screen:</strong> {screenWidth}×{screenHeight}px
          </div>
          <div style={{ fontSize: 14, color: '#666' }}>
            <strong>Scale:</strong> {projectionScale.toFixed(3)}x
          </div>
        </div>
        
        <div>
          <div style={{ fontSize: 14, color: 'green', fontWeight: 'bold' }}>
            ✓ Visible: {visibleLayers.length}
          </div>
          <div style={{ fontSize: 14, color: 'red' }}>
            ✗ Hidden: {hiddenLayers.length}
          </div>
        </div>
      </div>

      {/* Projection Canvas */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: 20,
        backgroundColor: '#e0e0e0',
        padding: 20,
        borderRadius: 8
      }}>
        <div style={{ 
          position: 'relative',
          width: Math.min(screenWidth, 1200),
          height: Math.min(screenHeight, 675),
          backgroundColor: scene.backgroundColor || '#ffffff',
          backgroundImage: scene.backgroundImage ? `url(${scene.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}>
          {/* Grid */}
          {showGrid && (
            <svg 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                pointerEvents: 'none'
              }}
            >
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Center cross */}
              <line 
                x1="50%" 
                y1="0" 
                x2="50%" 
                y2="100%" 
                stroke="rgba(255,0,0,0.3)" 
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <line 
                x1="0" 
                y1="50%" 
                x2="100%" 
                y2="50%" 
                stroke="rgba(255,0,0,0.3)" 
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          )}

          {/* Projected Layers */}
          {projectedLayers.map(layer => {
            const isHovered = hoveredLayerId === layer.id;
            const displayScale = Math.min(screenWidth, 1200) / screenWidth;
            
            return layer.isVisible && (
              <div
                key={layer.id}
                onMouseEnter={() => setHoveredLayerId(layer.id)}
                onMouseLeave={() => setHoveredLayerId(null)}
                style={{
                  position: 'absolute',
                  left: layer.position.x * displayScale,
                  top: layer.position.y * displayScale,
                  width: layer.width * displayScale,
                  height: layer.height * displayScale,
                  opacity: layer.opacity,
                  transform: `rotate(${layer.rotation || 0}deg)`,
                  border: isHovered ? '2px solid #00ff00' : '1px dashed rgba(0,123,255,0.5)',
                  backgroundColor: isHovered ? 'rgba(0,255,0,0.1)' : 'rgba(173,216,230,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: Math.max(10, 12 * displayScale),
                  fontWeight: 'bold',
                  color: isHovered ? '#00ff00' : '#0066cc',
                  textShadow: '0 0 3px white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  padding: 5
                }}
              >
                {/* Find original layer to get name */}
                {scene.layers?.find(l => l.id === layer.id)?.name || layer.id}
                
                {/* Coordinates tooltip */}
                {showCoordinates && isHovered && (
                  <div style={{
                    position: 'absolute',
                    top: -60,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: 4,
                    fontSize: 11,
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    pointerEvents: 'none'
                  }}>
                    <div>Projected: ({Math.round(layer.position.x)}, {Math.round(layer.position.y)})</div>
                    <div>Size: {Math.round(layer.width)}×{Math.round(layer.height)}</div>
                    <div>Opacity: {(layer.opacity * 100).toFixed(0)}%</div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bounds indicator */}
          {showBounds && (
            <div style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'monospace'
            }}>
              Canvas: {Math.min(screenWidth, 1200)}×{Math.min(screenHeight, 675)}
            </div>
          )}
        </div>
      </div>

      {/* Layer List */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 20 
      }}>
        {/* Visible Layers */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: 15, 
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#28a745' }}>
            ✓ Visible Layers ({visibleLayers.length})
          </h3>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {visibleLayers.map(layer => {
              const originalLayer = scene.layers?.find(l => l.id === layer.id);
              return (
                <div
                  key={layer.id}
                  onMouseEnter={() => setHoveredLayerId(layer.id)}
                  onMouseLeave={() => setHoveredLayerId(null)}
                  style={{
                    padding: 10,
                    marginBottom: 8,
                    backgroundColor: hoveredLayerId === layer.id ? '#e7f7ff' : '#f8f9fa',
                    borderRadius: 4,
                    cursor: 'pointer',
                    border: hoveredLayerId === layer.id ? '2px solid #00ff00' : '1px solid #dee2e6',
                    fontSize: 12
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: 5 }}>
                    {originalLayer?.name || layer.id}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, color: '#666' }}>
                    <div>Scene: ({Math.round(originalLayer?.position.x || 0)}, {Math.round(originalLayer?.position.y || 0)})</div>
                    <div>Projected: ({Math.round(layer.position.x)}, {Math.round(layer.position.y)})</div>
                    <div>Size: {Math.round(originalLayer?.width || 0)}×{Math.round(originalLayer?.height || 0)}</div>
                    <div>Proj Size: {Math.round(layer.width)}×{Math.round(layer.height)}</div>
                  </div>
                  {originalLayer?.camera_position && (
                    <div style={{ marginTop: 5, color: '#007bff', fontSize: 11 }}>
                      Camera Rel: ({Math.round(originalLayer.camera_position.x)}, {Math.round(originalLayer.camera_position.y)})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hidden Layers */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: 15, 
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#dc3545' }}>
            ✗ Hidden Layers ({hiddenLayers.length})
          </h3>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {hiddenLayers.map(layer => {
              const originalLayer = scene.layers?.find(l => l.id === layer.id);
              return (
                <div
                  key={layer.id}
                  style={{
                    padding: 10,
                    marginBottom: 8,
                    backgroundColor: '#fff5f5',
                    borderRadius: 4,
                    border: '1px solid #f8d7da',
                    fontSize: 12
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: 5, color: '#721c24' }}>
                    {originalLayer?.name || layer.id}
                  </div>
                  <div style={{ color: '#856404', fontSize: 11 }}>
                    Outside camera viewport
                  </div>
                  <div style={{ color: '#666', fontSize: 11, marginTop: 3 }}>
                    Scene pos: ({Math.round(originalLayer?.position.x || 0)}, {Math.round(originalLayer?.position.y || 0)})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionViewer;
