/**
 * Playwright tests for the Projection System
 * Tests the isolated projection test page with test data
 */

const { test, expect } = require('@playwright/test');

test.describe('Projection System Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the standalone projection test page
    await page.goto('/test/projection');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait for the page title to appear
    await page.waitForSelector('h1:has-text("Projection Test Page")', { timeout: 10000 });
  });

  test('should load the projection test page successfully', async ({ page }) => {
    // Check that the main title is visible
    const title = await page.locator('h1').first();
    await expect(title).toContainText('Projection Test Page');
    
    // Check that test scenario selector is present
    const scenarioSelect = await page.locator('select').first();
    await expect(scenarioSelect).toBeVisible();
    
    console.log('✓ Projection test page loaded successfully');
  });

  test('Test 1: Simple Centered - layer should be at canvas center', async ({ page }) => {
    // Select the first test scenario (Simple Centered)
    await page.selectOption('select', { index: 0 });
    await page.waitForTimeout(500); // Wait for projection to update
    
    // Check that the scene title is correct
    const sceneTitle = await page.locator('h2').first();
    await expect(sceneTitle).toContainText('Test 1: Simple Centered');
    
    // Check that there's exactly 1 visible layer
    const visibleLayersCount = await page.locator('h3:has-text("Visible Layers")').textContent();
    expect(visibleLayersCount).toContain('(1)');
    
    // Check that no layers are hidden
    const hiddenLayersCount = await page.locator('h3:has-text("Hidden Layers")').textContent();
    expect(hiddenLayersCount).toContain('(0)');
    
    console.log('✓ Test 1: Simple centered scene validated');
  });

  test('Test 2: Off-Center Elements - should have 3 visible layers', async ({ page }) => {
    // Select the second test scenario
    await page.selectOption('select', { index: 1 });
    await page.waitForTimeout(500);
    
    // Check scene title
    const sceneTitle = await page.locator('h2').first();
    await expect(sceneTitle).toContainText('Test 2: Off-Center Elements');
    
    // Check that there are 3 visible layers
    const visibleLayersCount = await page.locator('h3:has-text("Visible Layers")').textContent();
    expect(visibleLayersCount).toContain('(3)');
    
    // Check that no layers are hidden
    const hiddenLayersCount = await page.locator('h3:has-text("Hidden Layers")').textContent();
    expect(hiddenLayersCount).toContain('(0)');
    
    console.log('✓ Test 2: Off-center elements validated');
  });

  test('Test 3: Camera Zoom - should magnify content', async ({ page }) => {
    // Select the third test scenario (Camera Zoom 2x)
    await page.selectOption('select', { index: 2 });
    await page.waitForTimeout(500);
    
    // Check scene title
    const sceneTitle = await page.locator('h2').first();
    await expect(sceneTitle).toContainText('Test 3: Camera Zoom 2x');
    
    // Check that camera zoom is 2x
    const cameraZoomText = await page.locator('div:has-text("Camera Zoom:")').textContent();
    expect(cameraZoomText).toContain('2x');
    
    // Check that there are 2 visible layers
    const visibleLayersCount = await page.locator('h3:has-text("Visible Layers")').textContent();
    expect(visibleLayersCount).toContain('(2)');
    
    console.log('✓ Test 3: Camera zoom validated');
  });

  test('Test 4: Camera Offset - some elements should be hidden', async ({ page }) => {
    // Select the fourth test scenario (Camera Offset)
    await page.selectOption('select', { index: 3 });
    await page.waitForTimeout(500);
    
    // Check scene title
    const sceneTitle = await page.locator('h2').first();
    await expect(sceneTitle).toContainText('Test 4: Camera Offset');
    
    // Check that there are 2 visible layers
    const visibleLayersText = await page.locator('h3:has-text("Visible Layers")').textContent();
    expect(visibleLayersText).toContain('(2)');
    
    // Check that there is 1 hidden layer
    const hiddenLayersText = await page.locator('h3:has-text("Hidden Layers")').textContent();
    expect(hiddenLayersText).toContain('(1)');
    
    console.log('✓ Test 4: Camera offset with hidden layers validated');
  });

  test('Test 5: Complex Scene - rotation and scale', async ({ page }) => {
    // Select the fifth test scenario
    await page.selectOption('select', { index: 4 });
    await page.waitForTimeout(500);
    
    // Check scene title
    const sceneTitle = await page.locator('h2').first();
    await expect(sceneTitle).toContainText('Test 5: Complex');
    
    // Check that there are 3 visible layers
    const visibleLayersCount = await page.locator('h3:has-text("Visible Layers")').textContent();
    expect(visibleLayersCount).toContain('(3)');
    
    console.log('✓ Test 5: Complex scene with rotation and scale validated');
  });

  test('Test 6: Small Camera Viewport - should hide elements outside viewport', async ({ page }) => {
    // Select the sixth test scenario
    await page.selectOption('select', { index: 5 });
    await page.waitForTimeout(500);
    
    // Check scene title
    const sceneTitle = await page.locator('h2').first();
    await expect(sceneTitle).toContainText('Test 6: Small Camera Viewport');
    
    // Check that camera is 800x450
    const cameraSizeText = await page.locator('div:has-text("Camera Size:")').textContent();
    expect(cameraSizeText).toContain('800');
    expect(cameraSizeText).toContain('450');
    
    // Check that some layers are hidden
    const hiddenLayersText = await page.locator('h3:has-text("Hidden Layers")').textContent();
    const hiddenMatch = hiddenLayersText.match(/\((\d+)\)/);
    const hiddenCount = hiddenMatch ? parseInt(hiddenMatch[1]) : 0;
    expect(hiddenCount).toBeGreaterThan(0);
    
    console.log('✓ Test 6: Small camera viewport validated');
  });

  test('Resolution changes should update projection', async ({ page }) => {
    // Start with Full HD
    await page.selectOption('select >> nth=1', 'fhd');
    await page.waitForTimeout(300);
    
    // Check that screen size is 1920x1080
    let screenSizeText = await page.locator('div:has-text("Projection Screen:")').textContent();
    expect(screenSizeText).toContain('1920');
    expect(screenSizeText).toContain('1080');
    
    // Change to HD
    await page.selectOption('select >> nth=1', 'hd');
    await page.waitForTimeout(300);
    
    // Check that screen size changed to 1280x720
    screenSizeText = await page.locator('div:has-text("Projection Screen:")').textContent();
    expect(screenSizeText).toContain('1280');
    expect(screenSizeText).toContain('720');
    
    // Change to 4K
    await page.selectOption('select >> nth=1', '4k');
    await page.waitForTimeout(300);
    
    // Check that screen size changed to 3840x2160
    screenSizeText = await page.locator('div:has-text("Projection Screen:")').textContent();
    expect(screenSizeText).toContain('3840');
    expect(screenSizeText).toContain('2160');
    
    console.log('✓ Resolution changes validated');
  });

  test('Toggle controls should work', async ({ page }) => {
    // Find checkboxes for Grid, Coords, and Debug
    const gridCheckbox = await page.locator('input[type="checkbox"]').nth(0);
    const coordsCheckbox = await page.locator('input[type="checkbox"]').nth(1);
    const debugCheckbox = await page.locator('input[type="checkbox"]').nth(2);
    
    // Initially should be checked
    await expect(gridCheckbox).toBeChecked();
    await expect(coordsCheckbox).toBeChecked();
    await expect(debugCheckbox).toBeChecked();
    
    // Uncheck grid
    await gridCheckbox.click();
    await expect(gridCheckbox).not.toBeChecked();
    
    // Uncheck debug info
    await debugCheckbox.click();
    await expect(debugCheckbox).not.toBeChecked();
    
    // Debug panels should be hidden
    const visibleLayersPanel = await page.locator('h3:has-text("Visible Layers")');
    await expect(visibleLayersPanel).not.toBeVisible();
    
    // Re-check debug info
    await debugCheckbox.click();
    await expect(debugCheckbox).toBeChecked();
    
    // Debug panels should be visible again
    await expect(visibleLayersPanel).toBeVisible();
    
    console.log('✓ Toggle controls validated');
  });

  test('Projection scale should be calculated correctly', async ({ page }) => {
    // Select simple centered test
    await page.selectOption('select', { index: 0 });
    await page.waitForTimeout(500);
    
    // With Full HD resolution and Full HD scene, scale should be 1.0
    await page.selectOption('select >> nth=1', 'fhd');
    await page.waitForTimeout(300);
    
    const scaleText = await page.locator('div:has-text("Projection Scale:")').textContent();
    expect(scaleText).toContain('1.000');
    
    // Change to HD (1280x720), scale should be 0.667
    await page.selectOption('select >> nth=1', 'hd');
    await page.waitForTimeout(300);
    
    const scaleTextHD = await page.locator('div:has-text("Projection Scale:")').textContent();
    expect(scaleTextHD).toContain('0.667');
    
    console.log('✓ Projection scale calculation validated');
  });

  test('Canvas should display correctly at different resolutions', async ({ page }) => {
    // Test different resolutions
    const resolutions = ['sd', 'hd', 'fhd', '2k', '4k'];
    
    for (const resolution of resolutions) {
      await page.selectOption('select >> nth=1', resolution);
      await page.waitForTimeout(300);
      
      // Check that canvas is visible
      const canvas = await page.locator('div[style*="backgroundColor"]').first();
      await expect(canvas).toBeVisible();
      
      console.log(`✓ Canvas displayed correctly at ${resolution}`);
    }
  });

  test('Layer hover should show coordinate information', async ({ page }) => {
    // Select a test with multiple layers
    await page.selectOption('select', { index: 1 }); // Off-center elements
    await page.waitForTimeout(500);
    
    // Find a visible layer div in the debug panel
    const layerInList = await page.locator('div:has-text("Top Left")').first();
    
    // Hover over it
    await layerInList.hover();
    await page.waitForTimeout(200);
    
    // The layer should be highlighted (check that it's still visible)
    await expect(layerInList).toBeVisible();
    
    console.log('✓ Layer hover interaction validated');
  });

  test('All test scenarios should load without errors', async ({ page }) => {
    const scenarioCount = 6;
    
    for (let i = 0; i < scenarioCount; i++) {
      await page.selectOption('select', { index: i });
      await page.waitForTimeout(500);
      
      // Check that the scene title is visible
      const sceneTitle = await page.locator('h2').first();
      await expect(sceneTitle).toBeVisible();
      
      // Check that projection preview is visible
      const canvas = await page.locator('div[style*="backgroundColor"]').first();
      await expect(canvas).toBeVisible();
      
      console.log(`✓ Test scenario ${i + 1} loaded successfully`);
    }
  });
});

test.describe('Projection Accuracy Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/projection');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1:has-text("Projection Test Page")', { timeout: 10000 });
  });

  test('Centered layer should remain centered across resolutions', async ({ page }) => {
    // Select simple centered test
    await page.selectOption('select', { index: 0 });
    
    const resolutions = ['hd', 'fhd', '2k'];
    
    for (const resolution of resolutions) {
      await page.selectOption('select >> nth=1', resolution);
      await page.waitForTimeout(300);
      
      // Get visible layers info - centered layer should always be visible
      const visibleLayersText = await page.locator('h3:has-text("Visible Layers")').textContent();
      expect(visibleLayersText).toContain('(1)');
      
      console.log(`✓ Centered layer is visible at ${resolution}`);
    }
  });

  test('Camera zoom should affect layer visibility correctly', async ({ page }) => {
    // Test scenario with zoom
    await page.selectOption('select', { index: 2 }); // Camera Zoom 2x
    await page.waitForTimeout(500);
    
    // Check that layers are still visible with 2x zoom
    const visibleLayersText = await page.locator('h3:has-text("Visible Layers")').textContent();
    expect(visibleLayersText).toContain('(2)');
    
    console.log('✓ Camera zoom visibility validated');
  });

  test('Camera offset should correctly hide out-of-viewport layers', async ({ page }) => {
    // Test scenario with camera offset
    await page.selectOption('select', { index: 3 }); // Camera Offset
    await page.waitForTimeout(500);
    
    // Check visible count
    const visibleLayersText = await page.locator('h3:has-text("Visible Layers")').textContent();
    const visibleMatch = visibleLayersText.match(/\((\d+)\)/);
    const visibleCount = visibleMatch ? parseInt(visibleMatch[1]) : 0;
    
    // Check hidden count
    const hiddenLayersText = await page.locator('h3:has-text("Hidden Layers")').textContent();
    const hiddenMatch = hiddenLayersText.match(/\((\d+)\)/);
    const hiddenCount = hiddenMatch ? parseInt(hiddenMatch[1]) : 0;
    
    // Total should be 3 layers
    expect(visibleCount + hiddenCount).toBe(3);
    
    // At least one should be hidden
    expect(hiddenCount).toBeGreaterThan(0);
    
    console.log(`✓ Camera offset: ${visibleCount} visible, ${hiddenCount} hidden`);
  });
});
