/**
 * Test to verify shape layer positioning fixes
 * This tests that shapes are positioned correctly at camera center
 */

import { createLayerFromShapeAsset } from '../src/utils/svgShapeLayerUtils.ts';
import { createDefaultCamera } from '../src/utils/cameraAnimator.ts';

console.log('Testing shape layer positioning...\n');

let passed = 0;
let failed = 0;

// Mock shape asset
const mockShape = {
  id: 'test-shape',
  name: 'Test Shape',
  url: 'https://example.com/shape.svg',
  width: 200,
  height: 200,
  category: 'basic',
};

// Test 1: Shape positioned at scene center with default camera
console.log('Test 1: Shape positioned at scene center with default camera');
try {
  const defaultCamera = createDefaultCamera('16:9');
  const layer = createLayerFromShapeAsset(mockShape, 0, {
    sceneWidth: 1920,
    sceneHeight: 1080,
    selectedCamera: defaultCamera,
    sceneCameras: [defaultCamera],
  });

  // Default camera is at center (0.5, 0.5) = (960, 540)
  // Shape should be centered at (960 - 100, 540 - 100) = (860, 440)
  const expectedX = 960 - (200 / 2);
  const expectedY = 540 - (200 / 2);
  
  if (Math.abs(layer.position.x - expectedX) < 1 && Math.abs(layer.position.y - expectedY) < 1) {
    console.log(`  ✓ Shape position is correct: (${layer.position.x}, ${layer.position.y})`);
    passed++;
  } else {
    console.log(`  ✗ Shape position is incorrect: expected (${expectedX}, ${expectedY}), got (${layer.position.x}, ${layer.position.y})`);
    failed++;
  }

  // Verify camera_position is calculated
  if (layer.camera_position) {
    console.log(`  ✓ camera_position is calculated: (${layer.camera_position.x}, ${layer.camera_position.y})`);
    passed++;
  } else {
    console.log(`  ✗ camera_position is missing`);
    failed++;
  }

  // Verify layer has required properties
  if (layer.svg_path === mockShape.url) {
    console.log(`  ✓ svg_path is set correctly`);
    passed++;
  } else {
    console.log(`  ✗ svg_path is incorrect`);
    failed++;
  }
} catch (error) {
  console.log(`  ✗ Test failed with error: ${error.message}`);
  failed++;
}

// Test 2: Shape positioned with custom camera
console.log('\nTest 2: Shape positioned with custom camera');
try {
  const customCamera = {
    ...createDefaultCamera('16:9'),
    position: { x: 0.7, y: 0.3 },
    zoom: 1.5,
  };
  
  const layer = createLayerFromShapeAsset(mockShape, 0, {
    sceneWidth: 1920,
    sceneHeight: 1080,
    selectedCamera: customCamera,
    sceneCameras: [createDefaultCamera('16:9'), customCamera],
  });

  // Custom camera is at (0.7 * 1920, 0.3 * 1080) = (1344, 324)
  // Shape should be scaled by zoom (200 * 1.5 = 300)
  // Centered at (1344 - 150, 324 - 150) = (1194, 174)
  const expectedX = 1344 - (300 / 2);
  const expectedY = 324 - (300 / 2);
  
  if (Math.abs(layer.position.x - expectedX) < 1 && Math.abs(layer.position.y - expectedY) < 1) {
    console.log(`  ✓ Shape position is correct with custom camera: (${layer.position.x}, ${layer.position.y})`);
    passed++;
  } else {
    console.log(`  ✗ Shape position is incorrect: expected (${expectedX}, ${expectedY}), got (${layer.position.x}, ${layer.position.y})`);
    failed++;
  }

  // Verify scale is applied
  if (layer.scale === 1.5) {
    console.log(`  ✓ Scale is applied correctly: ${layer.scale}`);
    passed++;
  } else {
    console.log(`  ✗ Scale is incorrect: expected 1.5, got ${layer.scale}`);
    failed++;
  }
} catch (error) {
  console.log(`  ✗ Test failed with error: ${error.message}`);
  failed++;
}

// Test 3: Shape with no camera options (fallback)
console.log('\nTest 3: Shape with no camera options (fallback)');
try {
  const layer = createLayerFromShapeAsset(mockShape, 0);
  
  // Should use scene center as default
  const expectedX = 1920 / 2 - (200 / 2);
  const expectedY = 1080 / 2 - (200 / 2);
  
  if (Math.abs(layer.position.x - expectedX) < 1 && Math.abs(layer.position.y - expectedY) < 1) {
    console.log(`  ✓ Fallback positioning works correctly: (${layer.position.x}, ${layer.position.y})`);
    passed++;
  } else {
    console.log(`  ✗ Fallback positioning is incorrect: expected (${expectedX}, ${expectedY}), got (${layer.position.x}, ${layer.position.y})`);
    failed++;
  }
} catch (error) {
  console.log(`  ✗ Test failed with error: ${error.message}`);
  failed++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${passed}`);
console.log(`Tests failed: ${failed}`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
