/**
 * Standalone Projection Test Page
 * Tests projection system with isolated test data (no backend dependency)
 * 
 * This page allows testing the projection calculator with predefined test cases
 * to validate coordinate calculations and visual accuracy.
 */

import React, { useState, useEffect } from 'react';
import { useSceneStore } from '@/app/scenes/store';
import { useSceneProjection } from '@/hooks/useProjection';
import type { Scene } from '@/app/scenes/types';
import { allTestScenes } from '@/data/projectionTestData';

export const ProjectionTestPageStandalone: React.FC = () => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [selectedResolution, setSelectedResolution] = useState<string>('fhd');
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  const scene: Scene = allTestScenes[selectedSceneIndex];
  
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

  // Set initial resolution
  useEffect(() => {
    const res = resolutions[selectedResolution as keyof typeof resolutions];
    if (res) {
      setProjectionScreen(res.width, res.height);
    }
  }, [selectedResolution, setProjectionScreen]);

  const handleResolutionChange = (resolution: string) => {
    setSelectedResolution(resolution);
    const res = resolutions[resolution as keyof typeof resolutions];
    if (res) {
      setProjectionScreen(res.width, res.height);
    }
  };

  const visibleLayers = projectedLayers.filter(l => l.isVisible);
  const hiddenLayers = projectedLayers.filter(l => !l.isVisible);

  // Calculate display scale to fit in viewer
  const maxDisplayWidth = 1200;
  const maxDisplayHeight = 675;
  const displayScale = Math.min(
    1,
    maxDisplayWidth / screenWidth,
    maxDisplayHeight / screenHeight
  );

  const defaultCamera = scene.sceneCameras?.find(cam => cam.isDefault);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: 20
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '20px 30px',
        borderRadius: 8,
        marginBottom: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>
          🧪 Projection Test Page (Standalone)
        </h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: 14 }}>
          Testing projection system with isolated test data - No backend dependency
        </p>
      </div>

      {/* Test Scene Selector */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: 20, 
        marginBottom: 20,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
              Test Scenario:
            </label>
            <select 
              value={selectedSceneIndex}
              onChange={(e) => setSelectedSceneIndex(Number(e.target.value))}
              style={{ 
                width: '100%',
                padding: '10px 12px', 
                borderRadius: 4, 
                border: '1px solid #ddd',
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              {allTestScenes.map((s, index) => (
                <option key={s.id} value={index}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 8 }}>
              Resolution:
            </label>
            <select 
              value={selectedResolution}
              onChange={(e) => handleResolutionChange(e.target.value)}
              style={{ 
                width: '100%',
                padding: '10px 12px', 
                borderRadius: 4, 
                border: '1px solid #ddd',
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              {Object.entries(resolutions).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: 15,
            alignItems: 'center'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              Grid
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={showCoordinates}
                onChange={(e) => setShowCoordinates(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              Coords
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={showDebugInfo}
                onChange={(e) => setShowDebugInfo(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              Debug
            </label>
          </div>
        </div>
      </div>

      {/* Scene Info */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: 20, 
        marginBottom: 20,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: 20 }}>
          📋 {scene.title}
        </h2>
        <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: 14 }}>
          {scene.content}
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 15,
          fontSize: 13
        }}>
          <div>
            <strong>Scene Size:</strong>
            <div style={{ color: '#666', marginTop: 3 }}>
              {scene.sceneWidth} × {scene.sceneHeight} px
            </div>
          </div>
          <div>
            <strong>Camera Size:</strong>
            <div style={{ color: '#666', marginTop: 3 }}>
              {defaultCamera?.width || scene.sceneWidth} × {defaultCamera?.height || scene.sceneHeight} px
            </div>
          </div>
          <div>
            <strong>Camera Position:</strong>
            <div style={{ color: '#666', marginTop: 3 }}>
              ({((defaultCamera?.position?.x || 0.5) * 100).toFixed(0)}%, {((defaultCamera?.position?.y || 0.5) * 100).toFixed(0)}%)
            </div>
          </div>
          <div>
            <strong>Camera Zoom:</strong>
            <div style={{ color: '#666', marginTop: 3 }}>
              {defaultCamera?.zoom || 1}x
            </div>
          </div>
          <div>
            <strong>Projection Screen:</strong>
            <div style={{ color: '#666', marginTop: 3 }}>
              {screenWidth} × {screenHeight} px
            </div>
          </div>
          <div>
            <strong>Projection Scale:</strong>
            <div style={{ color: '#666', marginTop: 3 }}>
              {projectionScale.toFixed(3)}x
            </div>
          </div>
          <div>
            <strong>Total Layers:</strong>
            <div style={{ color: '#666', marginTop: 3 }}>
              {scene.layers?.length || 0}
            </div>
          </div>
          <div>
            <strong>Visible / Hidden:</strong>
            <div style={{ marginTop: 3 }}>
              <span style={{ color: 'green', fontWeight: 'bold' }}>✓ {visibleLayers.length}</span>
              {' / '}
              <span style={{ color: 'red' }}>✗ {hiddenLayers.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projection Canvas */}
      <div style={{ 
        backgroundColor: 'white',
        padding: 20,
        marginBottom: 20,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: 18 }}>
          🎬 Projection Preview
        </h3>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          backgroundColor: '#e0e0e0',
          padding: 20,
          borderRadius: 4
        }}>
          {/* Wrapper for scaled dimensions */}
          <div style={{
            width: `${screenWidth * displayScale}px`,
            height: `${screenHeight * displayScale}px`,
            position: 'relative'
          }}>
            {/* Canvas with CSS transform */}
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${screenWidth}px`,
              height: `${screenHeight}px`,
              backgroundColor: scene.backgroundColor || '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              transform: `scale(${displayScale})`,
              transformOrigin: 'top left'
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
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                >
                  <defs>
                    <pattern id="grid-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  
                  {/* Center cross */}
                  <line 
                    x1="50%" y1="0" x2="50%" y2="100%" 
                    stroke="rgba(255,0,0,0.4)" 
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <line 
                    x1="0" y1="50%" x2="100%" y2="50%" 
                    stroke="rgba(255,0,0,0.4)" 
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </svg>
              )}

              {/* Projected Layers */}
              {projectedLayers.map(layer => {
                const originalLayer = scene.layers?.find(l => l.id === layer.id);
                const isHovered = hoveredLayerId === layer.id;
                const isImage = originalLayer?.type === 'image';
                const isText = originalLayer?.type === 'text';

                // Helper to convert color array to CSS color
                const getColorFromConfig = (colorConfig: string | number[] | undefined): string => {
                  if (typeof colorConfig === 'string') return colorConfig;
                  if (Array.isArray(colorConfig) && colorConfig.length >= 3) {
                    return `rgb(${colorConfig[0]}, ${colorConfig[1]}, ${colorConfig[2]})`;
                  }
                  return '#000000';
                };

                return layer.isVisible && (
                  <div
                    key={layer.id}
                    onMouseEnter={() => setHoveredLayerId(layer.id)}
                    onMouseLeave={() => setHoveredLayerId(null)}
                    style={{
                      position: 'absolute',
                      left: `${layer.position.x}px`,
                      top: `${layer.position.y}px`,
                      width: `${layer.width}px`,
                      height: `${layer.height}px`,
                      opacity: layer.opacity,
                      transform: `rotate(${layer.rotation || 0}deg)`,
                      transformOrigin: 'center center',
                      border: isHovered ? '3px solid #00ff00' : (isImage || isText ? '1px solid rgba(0,123,255,0.3)' : '2px dashed rgba(0,123,255,0.6)'),
                      backgroundColor: isHovered ? 'rgba(0,255,0,0.15)' : (isImage || isText ? 'transparent' : 'rgba(173,216,230,0.3)'),
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: originalLayer?.z_index || 1,
                      overflow: 'visible'
                    }}
                  >
                    {/* Image content */}
                    {isImage && originalLayer?.image_path && (
                      <>
                        {!failedImages.has(layer.id) ? (
                          <img
                            src={originalLayer.image_path}
                            alt={originalLayer.name || 'Layer image'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              pointerEvents: 'none'
                            }}
                            onError={() => {
                              setFailedImages(prev => new Set(prev).add(layer.id));
                            }}
                          />
                        ) : (
                          <div style={{
                            fontSize: '12px',
                            color: '#666',
                            textAlign: 'center'
                          }}>
                            {originalLayer.fileName || originalLayer.name || 'Image'}
                          </div>
                        )}
                      </>
                    )}

                    {/* Text content */}
                    {isText && originalLayer?.text_config && (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: originalLayer.text_config.align === 'center' ? 'center' : 
                                       originalLayer.text_config.align === 'right' ? 'flex-end' : 'flex-start',
                        fontSize: `${originalLayer.text_config.size || 16}px`,
                        fontFamily: originalLayer.text_config.font || 'Arial',
                        fontStyle: originalLayer.text_config.style || 'normal',
                        color: getColorFromConfig(originalLayer.text_config.color),
                        textAlign: originalLayer.text_config.align || 'left',
                        lineHeight: originalLayer.text_config.line_height || 1.2,
                        padding: '5px',
                        boxSizing: 'border-box',
                        wordWrap: 'break-word',
                        overflow: 'hidden'
                      }}>
                        {originalLayer.text_config.text || originalLayer.text || ''}
                      </div>
                    )}

                    {/* Fallback for other layer types */}
                    {!isImage && !isText && (
                      <div style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#666',
                        textAlign: 'center',
                        padding: 5
                      }}>
                        {originalLayer?.name || `Layer ${layer.id.substring(0, 8)}`}
                      </div>
                    )}

                    {/* Coordinates tooltip */}
                    {showCoordinates && isHovered && (
                      <div style={{
                        position: 'absolute',
                        top: -90,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: 4,
                        fontSize: 11,
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        pointerEvents: 'none',
                        fontFamily: 'monospace',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
                      }}>
                        <div><strong>{originalLayer?.name}</strong></div>
                        <div>Type: {originalLayer?.type}</div>
                        <div>Scene: ({Math.round(originalLayer?.position.x || 0)}, {Math.round(originalLayer?.position.y || 0)})</div>
                        <div>Camera Pos: ({Math.round(originalLayer?.camera_position?.x || 0)}, {Math.round(originalLayer?.camera_position?.y || 0)})</div>
                        <div>Projected: ({Math.round(layer.position.x)}, {Math.round(layer.position.y)})</div>
                        <div>Scene Size: {Math.round(originalLayer?.width || 0)}×{Math.round(originalLayer?.height || 0)}</div>
                        <div>Proj Size: {Math.round(layer.width)}×{Math.round(layer.height)}</div>
                        <div>Layer Scale: {layer.scale}x</div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Canvas info overlay */}
              <div style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: 'rgba(0,0,0,0.75)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: 4,
                fontSize: 11,
                fontFamily: 'monospace',
                pointerEvents: 'none'
              }}>
                Canvas: {screenWidth}×{screenHeight}
                {displayScale < 1 && ` (display: ${(displayScale * 100).toFixed(0)}%)`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {showDebugInfo && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 20,
          marginBottom: 20
        }}>
          {/* Visible Layers */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: 15, 
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#28a745', fontSize: 16 }}>
              ✓ Visible Layers ({visibleLayers.length})
            </h3>
            <div style={{ maxHeight: 300, overflowY: 'auto', fontSize: 12 }}>
              {visibleLayers.map(layer => {
                const originalLayer = scene.layers?.find(l => l.id === layer.id);
                const isHovered = hoveredLayerId === layer.id;
                
                return (
                  <div
                    key={layer.id}
                    onMouseEnter={() => setHoveredLayerId(layer.id)}
                    onMouseLeave={() => setHoveredLayerId(null)}
                    style={{
                      padding: 10,
                      marginBottom: 8,
                      backgroundColor: isHovered ? '#e7f7ff' : '#f8f9fa',
                      borderRadius: 4,
                      cursor: 'pointer',
                      border: isHovered ? '2px solid #00ff00' : '1px solid #dee2e6'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: 5 }}>
                      {originalLayer?.name || layer.id}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, color: '#666' }}>
                      <div>Scene: ({Math.round(originalLayer?.position.x || 0)}, {Math.round(originalLayer?.position.y || 0)})</div>
                      <div>Projected: ({Math.round(layer.position.x)}, {Math.round(layer.position.y)})</div>
                      <div>Size: {originalLayer?.width}×{originalLayer?.height}</div>
                      <div>Proj: {Math.round(layer.width)}×{Math.round(layer.height)}</div>
                      {originalLayer && (
                        <>
                          <div>Scale: {originalLayer.scale}</div>
                          <div>Opacity: {(layer.opacity * 100).toFixed(0)}%</div>
                        </>
                      )}
                    </div>
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
            <h3 style={{ margin: '0 0 15px 0', color: '#dc3545', fontSize: 16 }}>
              ✗ Hidden Layers ({hiddenLayers.length})
            </h3>
            <div style={{ maxHeight: 300, overflowY: 'auto', fontSize: 12 }}>
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
                      border: '1px solid #f8d7da'
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
      )}

      {/* Instructions */}
      <div style={{ 
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        padding: 15,
        borderRadius: 8
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#856404', fontSize: 16 }}>
          💡 Instructions
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#856404', fontSize: 13 }}>
          <li>Select different test scenarios to validate projection calculations</li>
          <li>Change resolution to test how layers scale on different screens</li>
          <li>Hover over layers to see detailed coordinate information</li>
          <li>Green border indicates hovered layer</li>
          <li>Red dashed lines show canvas center (50%, 50%)</li>
          <li>Grid helps visualize position accuracy (50px squares)</li>
          <li>Check that visible layers match expectations for each test case</li>
          <li>Verify that hidden layers are correctly identified as outside camera viewport</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectionTestPageStandalone;
