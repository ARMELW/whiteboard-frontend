/**
 * Projection Test Page
 * Page for testing and verifying projection coordinate accuracy
 */

import React from 'react';
import { ProjectionViewer } from '@/components/organisms/ProjectionViewer';
import { useCurrentScene } from '@/app/scenes';

export const ProjectionTestPage: React.FC = () => {
  const scene = useCurrentScene();

  if (!scene) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 20
      }}>
        <h1>Projection Tester</h1>
        <p style={{ color: '#666' }}>Please select a scene to test projection</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <div style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '20px 40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>🎯 Projection Coordinate Tester</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.8 }}>
          Verify layer positions and dimensions on different screen projections
        </p>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: 20, 
          marginBottom: 20,
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 15px 0' }}>Scene: {scene.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <div>
              <strong>Scene Dimensions:</strong>
              <div style={{ color: '#666', marginTop: 5 }}>
                {scene.sceneWidth || 1920} × {scene.sceneHeight || 1080} px
              </div>
            </div>
            <div>
              <strong>Total Layers:</strong>
              <div style={{ color: '#666', marginTop: 5 }}>
                {scene.layers?.length || 0}
              </div>
            </div>
            <div>
              <strong>Cameras:</strong>
              <div style={{ color: '#666', marginTop: 5 }}>
                {scene.sceneCameras?.length || 0} 
                {scene.sceneCameras?.some(c => c.isDefault) && ' (1 default)'}
              </div>
            </div>
          </div>
        </div>

        <ProjectionViewer 
          scene={scene}
          showGrid={true}
          showCoordinates={true}
          showBounds={true}
        />

        <div style={{ 
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          padding: 15,
          marginTop: 20,
          borderRadius: 8
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>💡 Tips:</h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#856404' }}>
            <li>Hover over layers to see detailed coordinate information</li>
            <li>Green border indicates hovered layer on canvas</li>
            <li>Red dashed lines show the center of the projection screen</li>
            <li>Grid helps visualize position accuracy (50px squares)</li>
            <li>Change resolution to test different screen sizes</li>
            <li>Hidden layers are those outside the camera viewport</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectionTestPage;
