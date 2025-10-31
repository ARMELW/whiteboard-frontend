// Test utility to set up scenes for testing the Real Scene Preview feature
// Run this in browser console to create test scenes

function setupTestScenes() {
  const testScenes = [
    {
      id: 'test-scene-1',
      title: 'Test Scene - Position Debug',
      content: 'Scene to test position debugging',
      duration: 5,
      backgroundImage: null,
      animation: 'fade',
      layers: [
        {
          id: 'layer-text-1',
          name: 'Center Text',
          type: 'text',
          text: 'Hello World',
          position: { x: 960, y: 540 },
          fontSize: 48,
          fontFamily: 'Inter',
          fill: '#000000',
          align: 'center',
          z_index: 1,
          opacity: 1,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        {
          id: 'layer-text-2',
          name: 'Top Left Text',
          type: 'text',
          text: 'Top Left',
          position: { x: 200, y: 150 },
          fontSize: 36,
          fontFamily: 'Inter',
          fill: '#3b82f6',
          align: 'left',
          z_index: 2,
          opacity: 1,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        {
          id: 'layer-text-3',
          name: 'Bottom Right Text',
          type: 'text',
          text: 'Bottom Right',
          position: { x: 1720, y: 930 },
          fontSize: 36,
          fontFamily: 'Inter',
          fill: '#ef4444',
          align: 'right',
          z_index: 3,
          opacity: 1,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        }
      ],
      cameras: [],
      sceneCameras: [
        {
          id: 'default-camera',
          name: 'Vue par défaut',
          isDefault: true,
          width: 800,
          height: 450,
          position: { x: 0.5, y: 0.5 },
          zoom: 0.8,
          duration: 2,
          transition_duration: 1,
          easing: 'ease_out',
          locked: false,
          pauseDuration: 0,
          movementType: 'ease_out',
          scale: 1
        },
        {
          id: 'camera-closeup',
          name: 'Close-up Center',
          isDefault: false,
          width: 800,
          height: 450,
          position: { x: 0.5, y: 0.5 },
          zoom: 1.5,
          duration: 2,
          transition_duration: 1,
          easing: 'ease_out',
          locked: false,
          pauseDuration: 0,
          movementType: 'ease_out',
          scale: 1
        },
        {
          id: 'camera-topleft',
          name: 'Top Left Focus',
          isDefault: false,
          width: 800,
          height: 450,
          position: { x: 0.2, y: 0.2 },
          zoom: 1.2,
          duration: 2,
          transition_duration: 1,
          easing: 'ease_out',
          locked: false,
          pauseDuration: 0,
          movementType: 'ease_out',
          scale: 1
        }
      ],
      multiTimeline: {
        version: '1.0',
        timeline: [],
        duration: 5
      },
      audio: {
        backgroundMusic: null,
        volume: 1,
        fadeIn: 0,
        fadeOut: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  localStorage.setItem('scenes', JSON.stringify(testScenes));
  console.log('✅ Test scenes created! Reload the page to see them.');
  console.log('Scenes created:', testScenes.length);
}

// Run the setup
setupTestScenes();
