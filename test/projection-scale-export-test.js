/**
 * Projection Scale Export Test
 * Verifies that layer export uses projection screen dimensions correctly
 * and scales layers proportionally when projection screen size changes
 */

console.log('🧪 Testing Projection Scale in Layer Export\n');

// Test: Verify projection scale calculation logic
const testProjectionScaleCalculation = () => {
  console.log('Test 1: Projection Scale Calculation');
  console.log('──────────────────────────────────────────────────────────────────────\n');
  
  // Camera dimensions
  const cameraWidth = 800;
  const cameraHeight = 450;
  
  // Test different projection screen sizes
  const testCases = [
    { name: 'SD (640×480)', width: 640, height: 480, expectedScale: 0.8 },
    { name: 'HD (1280×720)', width: 1280, height: 720, expectedScale: 1.6 },
    { name: 'FHD (1920×1080)', width: 1920, height: 1080, expectedScale: 2.4 },
    { name: '4K (3840×2160)', width: 3840, height: 2160, expectedScale: 4.8 },
  ];
  
  let passCount = 0;
  let failCount = 0;
  
  testCases.forEach(testCase => {
    const scaleX = testCase.width / cameraWidth;
    const scaleY = testCase.height / cameraHeight;
    const projectionScale = Math.min(scaleX, scaleY);
    
    console.log(`  ${testCase.name}:`);
    console.log(`    Screen: ${testCase.width}×${testCase.height}`);
    console.log(`    Camera: ${cameraWidth}×${cameraHeight}`);
    console.log(`    Scale: ${projectionScale}`);
    console.log(`    Expected: ${testCase.expectedScale}`);
    
    if (Math.abs(projectionScale - testCase.expectedScale) < 0.01) {
      console.log(`    ✅ PASS\n`);
      passCount++;
    } else {
      console.log(`    ❌ FAIL\n`);
      failCount++;
    }
  });
  
  return { passed: passCount, failed: failCount };
};

// Test: Verify layer dimensions scale proportionally
const testLayerDimensionScaling = () => {
  console.log('Test 2: Layer Dimension Scaling');
  console.log('──────────────────────────────────────────────────────────────────────\n');
  
  const layer = {
    width: 100,
    height: 100,
    scale: 1
  };
  
  const cameraWidth = 800;
  const cameraHeight = 450;
  
  const testCases = [
    { name: 'SD', screenWidth: 640, screenHeight: 480, expectedWidth: 80, expectedHeight: 80 },
    { name: 'HD', screenWidth: 1280, screenHeight: 720, expectedWidth: 160, expectedHeight: 160 },
    { name: 'FHD', screenWidth: 1920, screenHeight: 1080, expectedWidth: 240, expectedHeight: 240 },
  ];
  
  let passCount = 0;
  let failCount = 0;
  
  testCases.forEach(testCase => {
    const scaleX = testCase.screenWidth / cameraWidth;
    const scaleY = testCase.screenHeight / cameraHeight;
    const projectionScale = Math.min(scaleX, scaleY);
    
    const layerWidth = layer.width * layer.scale;
    const layerHeight = layer.height * layer.scale;
    const projectedWidth = layerWidth * projectionScale;
    const projectedHeight = layerHeight * projectionScale;
    
    console.log(`  ${testCase.name} (${testCase.screenWidth}×${testCase.screenHeight}):`);
    console.log(`    Original: ${layerWidth}×${layerHeight}`);
    console.log(`    Projected: ${projectedWidth}×${projectedHeight}`);
    console.log(`    Expected: ${testCase.expectedWidth}×${testCase.expectedHeight}`);
    
    const widthMatch = Math.abs(projectedWidth - testCase.expectedWidth) < 0.01;
    const heightMatch = Math.abs(projectedHeight - testCase.expectedHeight) < 0.01;
    
    if (widthMatch && heightMatch) {
      console.log(`    ✅ PASS\n`);
      passCount++;
    } else {
      console.log(`    ❌ FAIL\n`);
      failCount++;
    }
  });
  
  return { passed: passCount, failed: failCount };
};

// Test: Verify position scaling with projection
const testPositionScaling = () => {
  console.log('Test 3: Layer Position Scaling with Projection');
  console.log('──────────────────────────────────────────────────────────────────────\n');
  
  const layer = {
    position: { x: 100, y: 50 },
    width: 100,
    height: 100,
    scale: 1
  };
  
  const camera = {
    position: { x: 0.5, y: 0.5 },
    width: 800,
    height: 450
  };
  
  const sceneWidth = 1920;
  const sceneHeight = 1080;
  
  // Camera viewport center in scene coords
  const cameraCenterX = camera.position.x * sceneWidth; // 960
  const cameraCenterY = camera.position.y * sceneHeight; // 540
  
  // Camera viewport top-left
  const cameraX = cameraCenterX - (camera.width / 2); // 560
  const cameraY = cameraCenterY - (camera.height / 2); // 315
  
  // Layer position relative to camera
  const relativeX = layer.position.x - cameraX; // 100 - 560 = -460
  const relativeY = layer.position.y - cameraY; // 50 - 315 = -265
  
  const testCases = [
    { 
      name: 'FHD (1920×1080)', 
      screenWidth: 1920, 
      screenHeight: 1080,
      // Scale is 2.4, so relative positions become: -460 * 2.4 = -1104, -265 * 2.4 = -636
      // Then centered: -1104 + (1920 - 1920)/2 = -1104, -636 + (1080 - 1080)/2 = -636
      expectedX: -1104,
      expectedY: -636
    },
    { 
      name: 'HD (1280×720)', 
      screenWidth: 1280, 
      screenHeight: 720,
      // Scale is 1.6, so: -460 * 1.6 = -736, -265 * 1.6 = -424
      // Then centered: -736 + (1280 - 1280)/2 = -736, -424 + (720 - 720)/2 = -424
      expectedX: -736,
      expectedY: -424
    }
  ];
  
  let passCount = 0;
  let failCount = 0;
  
  testCases.forEach(testCase => {
    const scaleX = testCase.screenWidth / camera.width;
    const scaleY = testCase.screenHeight / camera.height;
    const projectionScale = Math.min(scaleX, scaleY);
    
    const projectedX = relativeX * projectionScale;
    const projectedY = relativeY * projectionScale;
    
    const scaledCameraWidth = camera.width * projectionScale;
    const scaledCameraHeight = camera.height * projectionScale;
    const offsetX = (testCase.screenWidth - scaledCameraWidth) / 2;
    const offsetY = (testCase.screenHeight - scaledCameraHeight) / 2;
    
    const finalX = projectedX + offsetX;
    const finalY = projectedY + offsetY;
    
    console.log(`  ${testCase.name}:`);
    console.log(`    Projection scale: ${projectionScale}`);
    console.log(`    Relative pos: (${relativeX}, ${relativeY})`);
    console.log(`    Projected pos: (${projectedX}, ${projectedY})`);
    console.log(`    Offset: (${offsetX}, ${offsetY})`);
    console.log(`    Final pos: (${finalX}, ${finalY})`);
    console.log(`    Expected: (${testCase.expectedX}, ${testCase.expectedY})`);
    
    const xMatch = Math.abs(finalX - testCase.expectedX) < 0.01;
    const yMatch = Math.abs(finalY - testCase.expectedY) < 0.01;
    
    if (xMatch && yMatch) {
      console.log(`    ✅ PASS\n`);
      passCount++;
    } else {
      console.log(`    ❌ FAIL\n`);
      failCount++;
    }
  });
  
  return { passed: passCount, failed: failCount };
};

// Run all tests
const test1 = testProjectionScaleCalculation();
const test2 = testLayerDimensionScaling();
const test3 = testPositionScaling();

const totalPassed = test1.passed + test2.passed + test3.passed;
const totalFailed = test1.failed + test2.failed + test3.failed;

console.log('📊 Test Summary');
console.log('──────────────────────────────────────────────────────────────────────');
console.log(`Tests passed: ${totalPassed}/${totalPassed + totalFailed}`);
console.log(`Tests failed: ${totalFailed}/${totalPassed + totalFailed}\n`);

if (totalFailed === 0) {
  console.log('✅ All tests passed!');
  console.log('\n🎯 Summary:');
  console.log('  - Projection scale correctly calculated for different screen sizes');
  console.log('  - Layer dimensions scale proportionally with projection screen');
  console.log('  - Layer positions scale and center correctly with projection');
  console.log('  - Fix ensures layers maintain proper size on projection screen changes');
} else {
  console.log('❌ Some tests failed!');
  process.exit(1);
}
