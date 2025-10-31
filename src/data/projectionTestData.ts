/**
 * Test data for projection system
 * Provides concrete test cases to validate projection calculations
 */

import type { Scene, Layer, Camera } from '@/app/scenes/types';
import { LayerType, LayerMode } from '@/utils/projectionCalculator';

/**
 * Test Case 1: Simple centered scene
 * - Single text layer at center
 * - Camera centered on scene
 * - No zoom
 */
export const testSceneSimpleCentered: Scene = {
  id: 'test-scene-1',
  projectId: 'test-project',
  title: 'Test 1: Simple Centered',
  content: 'A single centered text element',
  duration: 5,
  animation: 'none',
  backgroundImage: null,
  backgroundColor: '#ffffff',
  sceneWidth: 1920,
  sceneHeight: 1080,
  layers: [
    {
      id: 'layer-1',
      name: 'Centered Text',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 960, y: 540 }, // Center of 1920x1080
      width: 400,
      height: 100,
      z_index: 1,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Centered Text',
      text_config: {
        fontSize: 32,
        fontFamily: 'Arial',
        color: '#000000',
        textAlign: 'center'
      }
    }
  ],
  cameras: [],
  sceneCameras: [
    {
      id: 'camera-1',
      name: 'Default Camera',
      position: { x: 0.5, y: 0.5 }, // Center (50%, 50%)
      zoom: 1,
      width: 1920,
      height: 1080,
      isDefault: true
    }
  ],
  multiTimeline: {},
  audio: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Test Case 2: Off-center elements
 * - Multiple layers at different positions
 * - Camera centered
 */
export const testSceneOffCenter: Scene = {
  id: 'test-scene-2',
  projectId: 'test-project',
  title: 'Test 2: Off-Center Elements',
  content: 'Multiple elements at different positions',
  duration: 5,
  animation: 'none',
  backgroundImage: null,
  backgroundColor: '#f0f0f0',
  sceneWidth: 1920,
  sceneHeight: 1080,
  layers: [
    {
      id: 'layer-top-left',
      name: 'Top Left',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 300, y: 200 },
      width: 200,
      height: 80,
      z_index: 1,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Top Left',
      text_config: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#ff0000'
      }
    },
    {
      id: 'layer-top-right',
      name: 'Top Right',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 1620, y: 200 },
      width: 200,
      height: 80,
      z_index: 2,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Top Right',
      text_config: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#00ff00'
      }
    },
    {
      id: 'layer-bottom-center',
      name: 'Bottom Center',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 960, y: 900 },
      width: 300,
      height: 80,
      z_index: 3,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Bottom Center',
      text_config: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#0000ff'
      }
    }
  ],
  cameras: [],
  sceneCameras: [
    {
      id: 'camera-1',
      name: 'Default Camera',
      position: { x: 0.5, y: 0.5 },
      zoom: 1,
      width: 1920,
      height: 1080,
      isDefault: true
    }
  ],
  multiTimeline: {},
  audio: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Test Case 3: Camera zoom test
 * - Centered elements
 * - Camera with 2x zoom (should magnify content)
 */
export const testSceneCameraZoom: Scene = {
  id: 'test-scene-3',
  projectId: 'test-project',
  title: 'Test 3: Camera Zoom 2x',
  content: 'Testing camera zoom effect',
  duration: 5,
  animation: 'none',
  backgroundImage: null,
  backgroundColor: '#e8f4f8',
  sceneWidth: 1920,
  sceneHeight: 1080,
  layers: [
    {
      id: 'layer-center',
      name: 'Center (Zoomed)',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 960, y: 540 },
      width: 300,
      height: 100,
      z_index: 1,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Zoomed 2x',
      text_config: {
        fontSize: 28,
        fontFamily: 'Arial',
        color: '#333333'
      }
    },
    {
      id: 'layer-small-top',
      name: 'Small Top',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 960, y: 300 },
      width: 150,
      height: 50,
      z_index: 2,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Small',
      text_config: {
        fontSize: 18,
        fontFamily: 'Arial',
        color: '#666666'
      }
    }
  ],
  cameras: [],
  sceneCameras: [
    {
      id: 'camera-1',
      name: 'Zoomed Camera',
      position: { x: 0.5, y: 0.5 },
      zoom: 2, // 2x zoom
      width: 1920,
      height: 1080,
      isDefault: true
    }
  ],
  multiTimeline: {},
  audio: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Test Case 4: Camera offset (panned camera)
 * - Camera panned to top-left quadrant
 * - Some elements should be outside viewport
 */
export const testSceneCameraOffset: Scene = {
  id: 'test-scene-4',
  projectId: 'test-project',
  title: 'Test 4: Camera Offset',
  content: 'Camera panned to top-left, some elements hidden',
  duration: 5,
  animation: 'none',
  backgroundImage: null,
  backgroundColor: '#fff8dc',
  sceneWidth: 1920,
  sceneHeight: 1080,
  layers: [
    {
      id: 'layer-visible-1',
      name: 'Visible 1',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 480, y: 270 }, // Should be visible
      width: 200,
      height: 80,
      z_index: 1,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Visible 1',
      text_config: {
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#008000'
      }
    },
    {
      id: 'layer-visible-2',
      name: 'Visible 2',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 800, y: 400 }, // Should be visible
      width: 200,
      height: 80,
      z_index: 2,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Visible 2',
      text_config: {
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#008000'
      }
    },
    {
      id: 'layer-hidden-1',
      name: 'Hidden (Bottom-Right)',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 1600, y: 900 }, // Should be hidden (outside camera)
      width: 200,
      height: 80,
      z_index: 3,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Hidden',
      text_config: {
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#ff0000'
      }
    }
  ],
  cameras: [],
  sceneCameras: [
    {
      id: 'camera-1',
      name: 'Offset Camera',
      position: { x: 0.3, y: 0.3 }, // Top-left quadrant (30%, 30%)
      zoom: 1,
      width: 1920,
      height: 1080,
      isDefault: true
    }
  ],
  multiTimeline: {},
  audio: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Test Case 5: Complex scene with rotation and scale
 */
export const testSceneComplex: Scene = {
  id: 'test-scene-5',
  projectId: 'test-project',
  title: 'Test 5: Complex (Rotation & Scale)',
  content: 'Elements with rotation, scale, and opacity',
  duration: 5,
  animation: 'none',
  backgroundImage: null,
  backgroundColor: '#ffefd5',
  sceneWidth: 1920,
  sceneHeight: 1080,
  layers: [
    {
      id: 'layer-scaled',
      name: 'Scaled 2x',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 480, y: 300 },
      width: 150,
      height: 80,
      z_index: 1,
      scale: 2, // 2x scale
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Scaled 2x',
      text_config: {
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#4169e1'
      }
    },
    {
      id: 'layer-rotated',
      name: 'Rotated 45°',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 960, y: 540 },
      width: 200,
      height: 80,
      z_index: 2,
      scale: 1,
      opacity: 1,
      rotation: 45, // 45 degrees
      visible: true,
      text: 'Rotated 45°',
      text_config: {
        fontSize: 22,
        fontFamily: 'Arial',
        color: '#ff4500'
      }
    },
    {
      id: 'layer-semi-transparent',
      name: 'Semi-Transparent',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 1440, y: 780 },
      width: 200,
      height: 80,
      z_index: 3,
      scale: 1,
      opacity: 0.5, // 50% opacity
      rotation: 0,
      visible: true,
      text: 'Opacity 50%',
      text_config: {
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#800080'
      }
    }
  ],
  cameras: [],
  sceneCameras: [
    {
      id: 'camera-1',
      name: 'Default Camera',
      position: { x: 0.5, y: 0.5 },
      zoom: 1,
      width: 1920,
      height: 1080,
      isDefault: true
    }
  ],
  multiTimeline: {},
  audio: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Test Case 6: Smaller camera viewport (partial scene view)
 */
export const testSceneSmallCamera: Scene = {
  id: 'test-scene-6',
  projectId: 'test-project',
  title: 'Test 6: Small Camera Viewport',
  content: 'Camera captures only 800x450 area',
  duration: 5,
  animation: 'none',
  backgroundImage: null,
  backgroundColor: '#f5f5dc',
  sceneWidth: 1920,
  sceneHeight: 1080,
  layers: [
    {
      id: 'layer-in-viewport',
      name: 'In Viewport',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 960, y: 540 }, // Center - should be visible
      width: 200,
      height: 60,
      z_index: 1,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'In Viewport',
      text_config: {
        fontSize: 18,
        fontFamily: 'Arial',
        color: '#228b22'
      }
    },
    {
      id: 'layer-near-edge',
      name: 'Near Edge',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 1100, y: 650 }, // Near camera edge
      width: 150,
      height: 50,
      z_index: 2,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Edge',
      text_config: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#ff8c00'
      }
    },
    {
      id: 'layer-outside',
      name: 'Outside',
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 1600, y: 900 }, // Outside small camera - should be hidden
      width: 150,
      height: 50,
      z_index: 3,
      scale: 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      text: 'Outside',
      text_config: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#dc143c'
      }
    }
  ],
  cameras: [],
  sceneCameras: [
    {
      id: 'camera-1',
      name: 'Small Camera',
      position: { x: 0.5, y: 0.5 },
      zoom: 1,
      width: 800, // Smaller viewport
      height: 450,
      isDefault: true
    }
  ],
  multiTimeline: {},
  audio: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * All test scenes in a single array
 */
export const allTestScenes: Scene[] = [
  testSceneSimpleCentered,
  testSceneOffCenter,
  testSceneCameraZoom,
  testSceneCameraOffset,
  testSceneComplex,
  testSceneSmallCamera
];

/**
 * Get a test scene by ID
 */
export const getTestScene = (id: string): Scene | undefined => {
  return allTestScenes.find(scene => scene.id === id);
};

/**
 * Get test scene by index
 */
export const getTestSceneByIndex = (index: number): Scene | undefined => {
  return allTestScenes[index];
};
