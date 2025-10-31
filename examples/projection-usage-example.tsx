/**
 * Example: Using the Projection System
 * Shows how to use projection calculations for scene preview
 */

import React, { useEffect } from 'react';
import { useSceneStore } from '../src/app/scenes/store';
import { useProjection, useSceneProjection } from '../src/hooks/useProjection';
import { useCurrentScene } from '../src/app/scenes';
import type { Layer } from '../src/app/scenes/types';

/**
 * Example 1: Basic projection setup
 */
export const BasicProjectionExample = () => {
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  
  useEffect(() => {
    // Set projection screen to Full HD (1920×1080)
    setProjectionScreen(1920, 1080);
  }, [setProjectionScreen]);
  
  return <div>Projection screen configured to 1920×1080</div>;
};

/**
 * Example 2: Responsive projection screen
 */
export const ResponsiveProjectionExample = () => {
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  
  useEffect(() => {
    const updateProjectionScreen = () => {
      // Adapt to window size
      setProjectionScreen(window.innerWidth, window.innerHeight);
    };
    
    updateProjectionScreen();
    window.addEventListener('resize', updateProjectionScreen);
    
    return () => window.removeEventListener('resize', updateProjectionScreen);
  }, [setProjectionScreen]);
  
  return <div>Projection screen adapts to window size</div>;
};

/**
 * Example 3: Scene preview with projected layers
 */
export const ScenePreviewExample = () => {
  const scene = useCurrentScene();
  const {
    screenWidth,
    screenHeight,
    projectionScale,
    projectedLayers
  } = useSceneProjection(scene);
  
  return (
    <div 
      style={{ 
        width: screenWidth, 
        height: screenHeight,
        position: 'relative',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: 10, position: 'absolute', top: 0, left: 0, zIndex: 1000 }}>
        <h3>Scene Preview</h3>
        <p>Screen: {screenWidth}×{screenHeight}</p>
        <p>Scale: {projectionScale.toFixed(2)}</p>
        <p>Visible layers: {projectedLayers.filter(l => l.isVisible).length}/{projectedLayers.length}</p>
      </div>
      
      {projectedLayers.map(layer => (
        layer.isVisible && (
          <div
            key={layer.id}
            style={{
              position: 'absolute',
              left: layer.position.x,
              top: layer.position.y,
              width: layer.width,
              height: layer.height,
              opacity: layer.opacity,
              transform: `rotate(${layer.rotation || 0}deg)`,
              border: '1px solid blue',
              backgroundColor: 'rgba(173, 216, 230, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12
            }}
          >
            Layer {layer.id}
          </div>
        )
      ))}
    </div>
  );
};

/**
 * Example 4: Layer visibility check
 */
export const LayerVisibilityExample = ({ layers }: { layers: Layer[] }) => {
  const scene = useCurrentScene();
  const defaultCamera = scene?.sceneCameras?.find(cam => cam.isDefault);
  const { isLayerVisible } = useProjection({ 
    camera: defaultCamera,
    sceneWidth: scene?.sceneWidth,
    sceneHeight: scene?.sceneHeight
  });
  
  return (
    <div>
      <h3>Layer Visibility</h3>
      <ul>
        {layers.map(layer => (
          <li key={layer.id} style={{ color: isLayerVisible(layer) ? 'green' : 'red' }}>
            {layer.name}: {isLayerVisible(layer) ? '✓ Visible' : '✗ Hidden'}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Example 5: Multiple resolution preview selector
 */
export const ResolutionSelectorExample = () => {
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  const [selectedResolution, setSelectedResolution] = React.useState<string>('fhd');
  
  const resolutions = {
    sd: { width: 640, height: 480, label: 'SD (640×480)' },
    hd: { width: 1280, height: 720, label: 'HD (1280×720)' },
    fhd: { width: 1920, height: 1080, label: 'Full HD (1920×1080)' },
    '4k': { width: 3840, height: 2160, label: '4K (3840×2160)' }
  };
  
  const handleResolutionChange = (resolution: string) => {
    setSelectedResolution(resolution);
    const res = resolutions[resolution as keyof typeof resolutions];
    if (res) {
      setProjectionScreen(res.width, res.height);
    }
  };
  
  return (
    <div>
      <h3>Select Preview Resolution</h3>
      <select 
        value={selectedResolution}
        onChange={(e) => handleResolutionChange(e.target.value)}
      >
        {Object.entries(resolutions).map(([key, value]) => (
          <option key={key} value={key}>{value.label}</option>
        ))}
      </select>
    </div>
  );
};

/**
 * Example 6: Projected layer positions display
 */
export const ProjectedPositionsExample = () => {
  const scene = useCurrentScene();
  const defaultCamera = scene?.sceneCameras?.find(cam => cam.isDefault);
  const { projectLayer } = useProjection({
    camera: defaultCamera,
    sceneWidth: scene?.sceneWidth,
    sceneHeight: scene?.sceneHeight
  });
  
  if (!scene?.layers) return null;
  
  return (
    <div>
      <h3>Layer Positions (Scene vs Projected)</h3>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Layer Name</th>
            <th>Scene Position</th>
            <th>Projected Position</th>
            <th>Projected Size</th>
          </tr>
        </thead>
        <tbody>
          {scene.layers.map(layer => {
            const projected = projectLayer(layer);
            return (
              <tr key={layer.id}>
                <td>{layer.name}</td>
                <td>({Math.round(layer.position.x)}, {Math.round(layer.position.y)})</td>
                <td>
                  ({Math.round(projected.position.x)}, {Math.round(projected.position.y)})
                </td>
                <td>
                  {Math.round(projected.width)}×{Math.round(projected.height)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Example 7: Full screen preview with aspect ratio preservation
 */
export const FullScreenPreviewExample = () => {
  const scene = useCurrentScene();
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  const { projectedLayers, projectionScale } = useSceneProjection(scene);
  
  useEffect(() => {
    // Calculate dimensions maintaining 16:9 aspect ratio
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const targetRatio = 16 / 9;
    
    let width = maxWidth;
    let height = maxWidth / targetRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = maxHeight * targetRatio;
    }
    
    setProjectionScreen(width, height);
  }, [setProjectionScreen]);
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000'
    }}>
      <div style={{ position: 'relative' }}>
        <ScenePreviewExample />
        <div style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 10,
          borderRadius: 5
        }}>
          Scale: {projectionScale.toFixed(2)}x
        </div>
      </div>
    </div>
  );
};

/**
 * Example 8: Export configuration
 */
export const ExportConfigExample = () => {
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  
  const exportConfigs = [
    { name: 'YouTube (1080p)', width: 1920, height: 1080 },
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'TikTok', width: 1080, height: 1920 },
    { name: 'Twitter', width: 1200, height: 675 }
  ];
  
  const handleExportConfig = (config: typeof exportConfigs[0]) => {
    setProjectionScreen(config.width, config.height);
    console.log(`Export configured for ${config.name}`);
  };
  
  return (
    <div>
      <h3>Export Platform Configuration</h3>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {exportConfigs.map(config => (
          <button
            key={config.name}
            onClick={() => handleExportConfig(config)}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            {config.name}<br />
            <small>{config.width}×{config.height}</small>
          </button>
        ))}
      </div>
    </div>
  );
};

export default {
  BasicProjectionExample,
  ResponsiveProjectionExample,
  ScenePreviewExample,
  LayerVisibilityExample,
  ResolutionSelectorExample,
  ProjectedPositionsExample,
  FullScreenPreviewExample,
  ExportConfigExample
};
