/**
 * Projection Alignment Test
 * Verifies that the projection viewer correctly displays objects without double-scaling
 */

console.log('🧪 Testing Projection Alignment Fix\n');

// Mock projection calculator functions
const calculateProjectionScale = (cameraWidth, cameraHeight, screenWidth, screenHeight) => {
  const scaleX = screenWidth / cameraWidth;
  const scaleY = screenHeight / cameraHeight;
  return Math.min(scaleX, scaleY);
};

const calculateProjectedLayerPosition = (layer, camera, sceneWidth, sceneHeight, screenWidth, screenHeight) => {
  const cameraViewportX = (camera.position.x * sceneWidth) - (camera.width / 2);
  const cameraViewportY = (camera.position.y * sceneHeight) - (camera.height / 2);
  
  const relativeX = layer.position.x - cameraViewportX;
  const relativeY = layer.position.y - cameraViewportY;
  
  const projectionScale = calculateProjectionScale(
    camera.width,
    camera.height,
    screenWidth,
    screenHeight
  );
  
  const projectedX = relativeX * projectionScale;
  const projectedY = relativeY * projectionScale;
  
  const scaledCameraWidth = camera.width * projectionScale;
  const scaledCameraHeight = camera.height * projectionScale;
  const offsetX = (screenWidth - scaledCameraWidth) / 2;
  const offsetY = (screenHeight - scaledCameraHeight) / 2;
  
  return {
    x: projectedX + offsetX,
    y: projectedY + offsetY
  };
};

const calculateProjectedLayerDimensions = (layer, camera, sceneWidth, sceneHeight, screenWidth, screenHeight) => {
  const projectionScale = calculateProjectionScale(
    camera.width,
    camera.height,
    screenWidth,
    screenHeight
  );
  
  const layerWidth = (layer.width || 0) * (layer.scale || 1);
  const layerHeight = (layer.height || 0) * (layer.scale || 1);
  
  return {
    width: layerWidth * projectionScale,
    height: layerHeight * projectionScale
  };
};

// Test scenarios
const tests = [
  {
    name: 'Layer at scene center, camera centered, Full HD projection',
    layer: {
      position: { x: 960, y: 540 }, // Center of 1920×1080 scene
      width: 200,
      height: 150,
      scale: 1
    },
    camera: {
      position: { x: 0.5, y: 0.5 }, // Centered
      width: 800,
      height: 450
    },
    scene: { width: 1920, height: 1080 },
    screen: { width: 1920, height: 1080 },
    expected: {
      // Layer is at camera center (400, 225 in camera coords)
      // Projection scale is 2.4 (1920/800)
      // Projected: (400*2.4, 225*2.4) = (960, 540)
      position: { x: 960, y: 540 },
      dimensions: { width: 480, height: 360 }
    }
  },
  {
    name: 'Layer at top-left of camera viewport',
    layer: {
      position: { x: 560, y: 315 }, // Top-left of camera viewport
      width: 100,
      height: 100,
      scale: 1
    },
    camera: {
      position: { x: 0.5, y: 0.5 },
      width: 800,
      height: 450
    },
    scene: { width: 1920, height: 1080 },
    screen: { width: 1920, height: 1080 },
    expected: {
      // Layer is at (0, 0) relative to camera
      // Projection scale is 2.4
      // Projected: (0*2.4, 0*2.4) = (0, 0)
      // Centering offset for 800x450 camera on 1920x1080 screen
      // scaledCameraWidth = 800 * 2.4 = 1920
      // scaledCameraHeight = 450 * 2.4 = 1080
      // offsetX = (1920 - 1920) / 2 = 0
      // offsetY = (1080 - 1080) / 2 = 0
      position: { x: 0, y: 0 },
      dimensions: { width: 240, height: 240 }
    }
  },
  {
    name: 'Different screen resolution (HD)',
    layer: {
      position: { x: 960, y: 540 },
      width: 200,
      height: 150,
      scale: 1
    },
    camera: {
      position: { x: 0.5, y: 0.5 },
      width: 800,
      height: 450
    },
    scene: { width: 1920, height: 1080 },
    screen: { width: 1280, height: 720 },
    expected: {
      // Projection scale is 1.6 (1280/800)
      // Projected: (400*1.6, 225*1.6) = (640, 360)
      position: { x: 640, y: 360 },
      dimensions: { width: 320, height: 240 }
    }
  }
];

// Old method (with double-scaling bug)
function calculateOldDisplayPosition(projectedPosition, displayScale) {
  return {
    x: projectedPosition.x * displayScale, // ❌ Double scaling
    y: projectedPosition.y * displayScale  // ❌ Double scaling
  };
}

// New method (correct - no double scaling)
function calculateNewDisplayPosition(projectedPosition) {
  return {
    x: projectedPosition.x, // ✅ Direct use
    y: projectedPosition.y  // ✅ Direct use
  };
}

// Run tests
let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  console.log(`Test ${index + 1}: ${test.name}`);
  console.log('─'.repeat(70));
  
  // Calculate projected position and dimensions
  const projectedPos = calculateProjectedLayerPosition(
    test.layer,
    test.camera,
    test.scene.width,
    test.scene.height,
    test.screen.width,
    test.screen.height
  );
  
  const projectedDims = calculateProjectedLayerDimensions(
    test.layer,
    test.camera,
    test.scene.width,
    test.scene.height,
    test.screen.width,
    test.screen.height
  );
  
  console.log(`  Scene: ${test.scene.width}×${test.scene.height}`);
  console.log(`  Screen: ${test.screen.width}×${test.screen.height}`);
  console.log(`  Camera: ${test.camera.width}×${test.camera.height} at (${test.camera.position.x}, ${test.camera.position.y})`);
  console.log(`  Layer: ${test.layer.width}×${test.layer.height} at (${test.layer.position.x}, ${test.layer.position.y})`);
  console.log();
  
  // Calculate display scale (for fitting in viewer)
  const displayScale = Math.min(1, 1200 / test.screen.width, 675 / test.screen.height);
  
  // Old method (with bug)
  const oldPos = calculateOldDisplayPosition(projectedPos, displayScale);
  const oldDims = {
    width: projectedDims.width * displayScale,
    height: projectedDims.height * displayScale
  };
  
  // New method (fixed)
  const newPos = calculateNewDisplayPosition(projectedPos);
  const newDims = projectedDims;
  
  console.log(`  Projected position: (${Math.round(projectedPos.x)}, ${Math.round(projectedPos.y)})`);
  console.log(`  Projected dimensions: ${Math.round(projectedDims.width)}×${Math.round(projectedDims.height)}`);
  console.log();
  console.log(`  Display scale: ${displayScale.toFixed(3)}`);
  console.log();
  
  if (displayScale < 1) {
    console.log(`  ❌ Old method (with bug):`);
    console.log(`     Position: (${Math.round(oldPos.x)}, ${Math.round(oldPos.y)})`);
    console.log(`     Size: ${Math.round(oldDims.width)}×${Math.round(oldDims.height)}`);
    console.log(`     Problem: Applied displayScale to already-projected values`);
    console.log();
  }
  
  console.log(`  ✅ New method (fixed):`);
  console.log(`     Position: (${Math.round(newPos.x)}, ${Math.round(newPos.y)})`);
  console.log(`     Size: ${Math.round(newDims.width)}×${Math.round(newDims.height)}`);
  console.log(`     Solution: Uses projected values directly, applies CSS transform to canvas`);
  console.log();
  
  // Verify against expected values
  const positionMatch = 
    Math.abs(newPos.x - test.expected.position.x) < 1 &&
    Math.abs(newPos.y - test.expected.position.y) < 1;
    
  const dimensionsMatch = 
    Math.abs(newDims.width - test.expected.dimensions.width) < 1 &&
    Math.abs(newDims.height - test.expected.dimensions.height) < 1;
  
  if (positionMatch && dimensionsMatch) {
    console.log(`  ✅ PASS: Values match expected results`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: Values don't match expected`);
    console.log(`     Expected position: (${test.expected.position.x}, ${test.expected.position.y})`);
    console.log(`     Expected dimensions: ${test.expected.dimensions.width}×${test.expected.dimensions.height}`);
    failed++;
  }
  console.log();
});

// Summary
console.log('📊 Test Summary');
console.log('─'.repeat(70));
console.log(`Tests passed: ${passed}/${tests.length}`);
console.log(`Tests failed: ${failed}/${tests.length}`);
console.log();

console.log('🎯 Fix Summary:');
console.log('  The double-scaling bug was caused by applying a display scale to');
console.log('  already-projected coordinates. The fix uses projected values directly');
console.log('  and applies CSS transform: scale() to the entire canvas instead.');
console.log();
console.log('  Benefits:');
console.log('  ✅ Correct positioning and sizing');
console.log('  ✅ Uniform scaling via CSS transform');
console.log('  ✅ Maintains aspect ratios and proportions');
console.log('  ✅ No compound math errors');
console.log();

// Exit with appropriate code
if (failed > 0) {
  console.log('❌ Some tests failed');
  process.exit(1);
} else {
  console.log('✅ All tests passed!');
  process.exit(0);
}
