# Backend Implementation Guide: Mini-Scenes Feature (English)

## Overview

This document describes the backend implementation required to support the **mini-scenes** feature with dedicated cameras and transitions. This feature allows splitting a main scene into multiple mini-scenes, each with its own camera, duration, and entrance/exit transitions.

## Quick Reference

### API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/scenes/{sceneId}/mini-scenes` | List all mini-scenes for a scene |
| POST | `/api/v1/scenes/{sceneId}/mini-scenes` | Create a new mini-scene |
| PUT | `/api/v1/scenes/{sceneId}/mini-scenes/{miniSceneId}` | Update a mini-scene |
| DELETE | `/api/v1/scenes/{sceneId}/mini-scenes/{miniSceneId}` | Delete a mini-scene |
| PUT | `/api/v1/scenes/{sceneId}/mini-scenes/reorder` | Reorder mini-scenes |

### Data Models

```
Scene
  ├─ miniScenes[]
       ├─ id (UUID)
       ├─ name (string)
       ├─ duration (float)
       ├─ camera (Camera object)
       ├─ visibleLayerIds[] (array of UUIDs)
       ├─ transitionIn (MiniSceneTransition)
       ├─ transitionOut (MiniSceneTransition)
       ├─ order (integer)
       ├─ startTime (float, calculated)
       └─ endTime (float, calculated)
```

## TypeScript Types (Frontend Reference)

The frontend expects these structures from the API:

```typescript
enum TransitionType {
  NONE = 'none',
  FADE = 'fade',
  WIPE_LEFT = 'wipe_left',
  WIPE_RIGHT = 'wipe_right',
  WIPE_UP = 'wipe_up',
  WIPE_DOWN = 'wipe_down',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out',
  FADE_BLACK = 'fade_black',
  FADE_WHITE = 'fade_white',
  SLIDE_LEFT = 'slide_left',
  SLIDE_RIGHT = 'slide_right',
  SLIDE_UP = 'slide_up',
  SLIDE_DOWN = 'slide_down',
}

enum TransitionEasing {
  LINEAR = 'linear',
  EASE_IN = 'ease_in',
  EASE_OUT = 'ease_out',
  EASE_IN_OUT = 'ease_in_out',
}

interface MiniSceneTransition {
  type: TransitionType;
  duration: number; // in seconds
  easing: TransitionEasing;
  direction?: 'left' | 'right' | 'up' | 'down';
}

interface MiniScene {
  id: string;
  name: string;
  duration: number; // in seconds
  camera: Camera;
  visibleLayerIds: string[];
  transitionIn: MiniSceneTransition;
  transitionOut: MiniSceneTransition;
  order: number;
  startTime?: number; // auto-calculated
  endTime?: number; // auto-calculated
}
```

## Database Schema

### PostgreSQL Schema

```sql
-- Transitions table
CREATE TABLE mini_scene_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    duration DECIMAL(5,2) NOT NULL DEFAULT 0.5,
    easing VARCHAR(50) NOT NULL DEFAULT 'ease_in_out',
    direction VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mini-scenes table
CREATE TABLE mini_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    duration DECIMAL(8,2) NOT NULL DEFAULT 5.0,
    camera_id UUID REFERENCES cameras(id) ON DELETE SET NULL,
    transition_in_id UUID REFERENCES mini_scene_transitions(id) ON DELETE SET NULL,
    transition_out_id UUID REFERENCES mini_scene_transitions(id) ON DELETE SET NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    start_time DECIMAL(8,2),
    end_time DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(scene_id, order_index)
);

-- Visible layers junction table
CREATE TABLE mini_scene_visible_layers (
    mini_scene_id UUID NOT NULL REFERENCES mini_scenes(id) ON DELETE CASCADE,
    layer_id UUID NOT NULL REFERENCES layers(id) ON DELETE CASCADE,
    PRIMARY KEY (mini_scene_id, layer_id)
);

-- Indexes for performance
CREATE INDEX idx_mini_scenes_scene_id ON mini_scenes(scene_id);
CREATE INDEX idx_mini_scenes_order ON mini_scenes(scene_id, order_index);
CREATE INDEX idx_mini_scene_layers ON mini_scene_visible_layers(mini_scene_id);
```

### MongoDB Schema

```javascript
{
  _id: ObjectId("..."),
  projectId: ObjectId("..."),
  title: "Main Scene",
  // ... other existing fields
  
  miniScenes: [
    {
      id: "uuid-v4",
      name: "Mini-Scene 1",
      duration: 5.0,
      camera: {
        id: "camera-uuid",
        name: "Camera 1",
        position: { x: 0, y: 0 },
        zoom: 1.5
      },
      visibleLayerIds: ["layer-id-1", "layer-id-2"],
      transitionIn: {
        type: "fade",
        duration: 0.5,
        easing: "ease_in_out"
      },
      transitionOut: {
        type: "slide_left",
        duration: 0.8,
        easing: "ease_out"
      },
      order: 0,
      startTime: 0,
      endTime: 5.0
    }
  ]
}
```

## API Specification

### 1. List Mini-Scenes

```http
GET /api/v1/scenes/{sceneId}/mini-scenes
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "mini-scene-uuid-1",
      "sceneId": "scene-uuid",
      "name": "Mini-Scene 1",
      "duration": 5.0,
      "camera": {
        "id": "camera-uuid",
        "name": "Camera 1",
        "position": { "x": 0, "y": 0 },
        "zoom": 1.5
      },
      "visibleLayerIds": ["layer-1", "layer-2"],
      "transitionIn": {
        "type": "fade",
        "duration": 0.5,
        "easing": "ease_in_out"
      },
      "transitionOut": {
        "type": "slide_left",
        "duration": 0.8,
        "easing": "ease_out"
      },
      "order": 0,
      "startTime": 0,
      "endTime": 5.0,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### 2. Create Mini-Scene

```http
POST /api/v1/scenes/{sceneId}/mini-scenes
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Mini-Scene 1",
  "duration": 5.0,
  "camera": {
    "name": "Camera 1",
    "position": { "x": 0, "y": 0 },
    "zoom": 1.5
  },
  "visibleLayerIds": ["layer-1", "layer-2"],
  "transitionIn": {
    "type": "fade",
    "duration": 0.5,
    "easing": "ease_in_out"
  },
  "transitionOut": {
    "type": "fade",
    "duration": 0.5,
    "easing": "ease_in_out"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "mini-scene-uuid-1",
    "sceneId": "scene-uuid",
    "name": "Mini-Scene 1",
    "duration": 5.0,
    "camera": {
      "id": "camera-uuid-generated",
      "name": "Camera 1",
      "position": { "x": 0, "y": 0 },
      "zoom": 1.5
    },
    "visibleLayerIds": ["layer-1", "layer-2"],
    "transitionIn": {
      "type": "fade",
      "duration": 0.5,
      "easing": "ease_in_out"
    },
    "transitionOut": {
      "type": "fade",
      "duration": 0.5,
      "easing": "ease_in_out"
    },
    "order": 0,
    "startTime": 0,
    "endTime": 5.0,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

### 3. Update Mini-Scene

```http
PUT /api/v1/scenes/{sceneId}/mini-scenes/{miniSceneId}
Content-Type: application/json
```

**Request Body (partial update allowed):**
```json
{
  "name": "Mini-Scene 1 (updated)",
  "duration": 7.5,
  "camera": {
    "id": "camera-uuid",
    "name": "Camera 1 Updated",
    "position": { "x": 50, "y": 25 },
    "zoom": 2.0
  },
  "visibleLayerIds": ["layer-1", "layer-2", "layer-3"],
  "transitionIn": {
    "type": "slide_left",
    "duration": 0.8,
    "easing": "ease_in"
  },
  "transitionOut": {
    "type": "zoom_out",
    "duration": 1.0,
    "easing": "ease_out"
  }
}
```

### 4. Delete Mini-Scene

```http
DELETE /api/v1/scenes/{sceneId}/mini-scenes/{miniSceneId}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Mini-scene deleted successfully"
}
```

### 5. Reorder Mini-Scenes

```http
PUT /api/v1/scenes/{sceneId}/mini-scenes/reorder
Content-Type: application/json
```

**Request Body:**
```json
{
  "miniSceneIds": [
    "mini-scene-uuid-2",
    "mini-scene-uuid-1",
    "mini-scene-uuid-3"
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "mini-scene-uuid-2",
      "order": 0,
      "startTime": 0,
      "endTime": 7.5
    },
    {
      "id": "mini-scene-uuid-1",
      "order": 1,
      "startTime": 7.5,
      "endTime": 12.5
    },
    {
      "id": "mini-scene-uuid-3",
      "order": 2,
      "startTime": 12.5,
      "endTime": 18.0
    }
  ]
}
```

## Business Logic

### Auto-calculation of startTime and endTime

The `startTime` and `endTime` must be automatically calculated based on mini-scene order and duration:

```javascript
// Node.js Example
function recalculateMiniSceneTimes(miniScenes) {
  // Sort by order
  miniScenes.sort((a, b) => a.order - b.order);
  
  let currentTime = 0;
  
  return miniScenes.map(miniScene => {
    const startTime = currentTime;
    const endTime = currentTime + miniScene.duration;
    currentTime = endTime;
    
    return {
      ...miniScene,
      startTime,
      endTime
    };
  });
}
```

```python
# Python Example
def recalculate_mini_scene_times(mini_scenes):
    """Recalculates startTime and endTime for all mini-scenes"""
    mini_scenes.sort(key=lambda ms: ms.order)
    
    current_time = 0.0
    
    for mini_scene in mini_scenes:
        mini_scene.start_time = current_time
        mini_scene.end_time = current_time + mini_scene.duration
        current_time = mini_scene.end_time
    
    return mini_scenes
```

### Validation

```javascript
// Node.js Validation
const VALID_TRANSITION_TYPES = [
  'none', 'fade', 'wipe_left', 'wipe_right', 'wipe_up', 'wipe_down',
  'zoom_in', 'zoom_out', 'fade_black', 'fade_white',
  'slide_left', 'slide_right', 'slide_up', 'slide_down'
];

const VALID_EASING_TYPES = ['linear', 'ease_in', 'ease_out', 'ease_in_out'];

function validateTransition(transition) {
  if (!VALID_TRANSITION_TYPES.includes(transition.type)) {
    throw new Error(`Invalid transition type: ${transition.type}`);
  }
  
  if (!VALID_EASING_TYPES.includes(transition.easing)) {
    throw new Error(`Invalid easing type: ${transition.easing}`);
  }
  
  if (transition.duration < 0) {
    throw new Error('Transition duration must be positive');
  }
  
  return true;
}
```

## Video Generation Integration

When generating video with mini-scenes:

1. **Load mini-scenes** in order
2. **For each mini-scene:**
   - Apply entrance transition
   - Configure camera
   - Show only visible layers
   - Animate for specified duration
   - Apply exit transition
3. **Concatenate** to next mini-scene automatically

```javascript
// Pseudo-code for video generation
async function generateVideoWithMiniScenes(scene) {
  const videoClips = [];
  
  // If no mini-scenes, use classic generation
  if (!scene.miniScenes || scene.miniScenes.length === 0) {
    return generateClassicVideo(scene);
  }
  
  for (const miniScene of scene.miniScenes) {
    // 1. Create clip for this mini-scene
    let clip = await createMiniSceneClip(
      scene,
      miniScene,
      miniScene.duration
    );
    
    // 2. Apply entrance transition
    if (miniScene.transitionIn.type !== 'none') {
      clip = applyTransitionIn(clip, miniScene.transitionIn);
    }
    
    // 3. Apply exit transition
    if (miniScene.transitionOut.type !== 'none') {
      clip = applyTransitionOut(clip, miniScene.transitionOut);
    }
    
    videoClips.push(clip);
  }
  
  // Concatenate all clips
  const finalVideo = await concatenateClips(videoClips);
  
  return finalVideo;
}

async function createMiniSceneClip(scene, miniScene, duration) {
  // Load only visible layers
  const visibleLayers = scene.layers.filter(
    layer => miniScene.visibleLayerIds.includes(layer.id)
  );
  
  // Apply mini-scene camera
  const camera = miniScene.camera;
  
  // Render with layers and camera
  const clip = await renderLayersWithCamera(
    visibleLayers,
    camera,
    duration,
    scene.backgroundImage
  );
  
  return clip;
}
```

## Example Implementation (Node.js/Express)

```javascript
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Get all mini-scenes for a scene
router.get('/api/v1/scenes/:sceneId/mini-scenes', async (req, res) => {
  try {
    const { sceneId } = req.params;
    
    const miniScenes = await MiniScene.findAll({
      where: { sceneId },
      include: [
        { model: Camera },
        { model: MiniSceneTransition, as: 'transitionIn' },
        { model: MiniSceneTransition, as: 'transitionOut' },
        { model: Layer, through: { attributes: [] } }
      ],
      order: [['order', 'ASC']]
    });
    
    res.json({
      success: true,
      data: miniScenes.map(ms => ms.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a new mini-scene
router.post('/api/v1/scenes/:sceneId/mini-scenes', async (req, res) => {
  try {
    const { sceneId } = req.params;
    const data = req.body;
    
    // Validate scene exists
    const scene = await Scene.findByPk(sceneId);
    if (!scene) {
      return res.status(404).json({
        success: false,
        error: 'Scene not found'
      });
    }
    
    // Create or get camera
    const camera = await createOrGetCamera(data.camera, sceneId);
    
    // Create transitions
    const transitionIn = await MiniSceneTransition.create({
      id: uuidv4(),
      type: data.transitionIn.type,
      duration: data.transitionIn.duration,
      easing: data.transitionIn.easing,
      direction: data.transitionIn.direction
    });
    
    const transitionOut = await MiniSceneTransition.create({
      id: uuidv4(),
      type: data.transitionOut.type,
      duration: data.transitionOut.duration,
      easing: data.transitionOut.easing,
      direction: data.transitionOut.direction
    });
    
    // Get max order
    const maxOrder = await MiniScene.max('order', {
      where: { sceneId }
    }) || -1;
    
    // Create mini-scene
    const miniScene = await MiniScene.create({
      id: uuidv4(),
      sceneId,
      name: data.name,
      duration: data.duration || 5.0,
      cameraId: camera.id,
      transitionInId: transitionIn.id,
      transitionOutId: transitionOut.id,
      order: maxOrder + 1
    });
    
    // Add visible layers
    if (data.visibleLayerIds && data.visibleLayerIds.length > 0) {
      const layers = await Layer.findAll({
        where: {
          id: data.visibleLayerIds
        }
      });
      await miniScene.setLayers(layers);
    }
    
    // Recalculate times
    await recalculateTimes(sceneId);
    
    // Reload with associations
    await miniScene.reload({
      include: [
        { model: Camera },
        { model: MiniSceneTransition, as: 'transitionIn' },
        { model: MiniSceneTransition, as: 'transitionOut' },
        { model: Layer, through: { attributes: [] } }
      ]
    });
    
    res.status(201).json({
      success: true,
      data: miniScene.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update mini-scene
router.put('/api/v1/scenes/:sceneId/mini-scenes/:miniSceneId', async (req, res) => {
  try {
    const { sceneId, miniSceneId } = req.params;
    const data = req.body;
    
    const miniScene = await MiniScene.findOne({
      where: { id: miniSceneId, sceneId }
    });
    
    if (!miniScene) {
      return res.status(404).json({
        success: false,
        error: 'Mini-scene not found'
      });
    }
    
    // Update fields
    if (data.name) miniScene.name = data.name;
    if (data.duration !== undefined) miniScene.duration = data.duration;
    
    // Update camera if provided
    if (data.camera) {
      const camera = await createOrGetCamera(data.camera, sceneId);
      miniScene.cameraId = camera.id;
    }
    
    // Update transitions
    if (data.transitionIn) {
      await MiniSceneTransition.update(
        data.transitionIn,
        { where: { id: miniScene.transitionInId } }
      );
    }
    
    if (data.transitionOut) {
      await MiniSceneTransition.update(
        data.transitionOut,
        { where: { id: miniScene.transitionOutId } }
      );
    }
    
    // Update visible layers
    if (data.visibleLayerIds) {
      const layers = await Layer.findAll({
        where: { id: data.visibleLayerIds }
      });
      await miniScene.setLayers(layers);
    }
    
    await miniScene.save();
    
    // Recalculate times
    await recalculateTimes(sceneId);
    
    // Reload with associations
    await miniScene.reload({
      include: [
        { model: Camera },
        { model: MiniSceneTransition, as: 'transitionIn' },
        { model: MiniSceneTransition, as: 'transitionOut' },
        { model: Layer, through: { attributes: [] } }
      ]
    });
    
    res.json({
      success: true,
      data: miniScene.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete mini-scene
router.delete('/api/v1/scenes/:sceneId/mini-scenes/:miniSceneId', async (req, res) => {
  try {
    const { sceneId, miniSceneId } = req.params;
    
    const miniScene = await MiniScene.findOne({
      where: { id: miniSceneId, sceneId }
    });
    
    if (!miniScene) {
      return res.status(404).json({
        success: false,
        error: 'Mini-scene not found'
      });
    }
    
    await miniScene.destroy();
    
    // Recalculate times
    await recalculateTimes(sceneId);
    
    res.json({
      success: true,
      message: 'Mini-scene deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Reorder mini-scenes
router.put('/api/v1/scenes/:sceneId/mini-scenes/reorder', async (req, res) => {
  try {
    const { sceneId } = req.params;
    const { miniSceneIds } = req.body;
    
    // Update order for each mini-scene
    for (let i = 0; i < miniSceneIds.length; i++) {
      await MiniScene.update(
        { order: i },
        { where: { id: miniSceneIds[i], sceneId } }
      );
    }
    
    // Recalculate times
    const miniScenes = await recalculateTimes(sceneId);
    
    res.json({
      success: true,
      data: miniScenes.map(ms => ({
        id: ms.id,
        order: ms.order,
        startTime: ms.startTime,
        endTime: ms.endTime
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper: Recalculate times
async function recalculateTimes(sceneId) {
  const miniScenes = await MiniScene.findAll({
    where: { sceneId },
    order: [['order', 'ASC']]
  });
  
  let currentTime = 0;
  
  for (const miniScene of miniScenes) {
    miniScene.startTime = currentTime;
    miniScene.endTime = currentTime + miniScene.duration;
    currentTime = miniScene.endTime;
    await miniScene.save();
  }
  
  return miniScenes;
}

// Helper: Create or get camera
async function createOrGetCamera(cameraData, sceneId) {
  if (cameraData.id) {
    const camera = await Camera.findByPk(cameraData.id);
    if (!camera) {
      throw new Error(`Camera ${cameraData.id} not found`);
    }
    
    // Update properties if needed
    if (cameraData.name) camera.name = cameraData.name;
    if (cameraData.position) {
      camera.positionX = cameraData.position.x;
      camera.positionY = cameraData.position.y;
    }
    if (cameraData.zoom !== undefined) camera.zoom = cameraData.zoom;
    
    await camera.save();
    return camera;
  } else {
    // Create new camera
    const camera = await Camera.create({
      id: uuidv4(),
      sceneId,
      name: cameraData.name || 'Camera',
      positionX: cameraData.position?.x || 0,
      positionY: cameraData.position?.y || 0,
      zoom: cameraData.zoom || 1.0
    });
    
    return camera;
  }
}

module.exports = router;
```

## Testing

### Unit Tests Example (Jest)

```javascript
describe('Mini-Scenes API', () => {
  let testScene;
  
  beforeEach(async () => {
    // Create test scene
    testScene = await Scene.create({
      id: uuidv4(),
      title: 'Test Scene'
    });
  });
  
  afterEach(async () => {
    // Cleanup
    await MiniScene.destroy({ where: { sceneId: testScene.id } });
    await Scene.destroy({ where: { id: testScene.id } });
  });
  
  test('Create mini-scene', async () => {
    const response = await request(app)
      .post(`/api/v1/scenes/${testScene.id}/mini-scenes`)
      .send({
        name: 'Test Mini-Scene',
        duration: 5.0,
        camera: {
          name: 'Test Camera',
          position: { x: 0, y: 0 },
          zoom: 1.5
        },
        visibleLayerIds: [],
        transitionIn: {
          type: 'fade',
          duration: 0.5,
          easing: 'ease_in_out'
        },
        transitionOut: {
          type: 'fade',
          duration: 0.5,
          easing: 'ease_in_out'
        }
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Mini-Scene');
  });
  
  test('Reorder mini-scenes', async () => {
    // Create 3 mini-scenes
    const ms1 = await MiniScene.create({
      id: 'ms1',
      sceneId: testScene.id,
      name: 'MS1',
      order: 0
    });
    const ms2 = await MiniScene.create({
      id: 'ms2',
      sceneId: testScene.id,
      name: 'MS2',
      order: 1
    });
    const ms3 = await MiniScene.create({
      id: 'ms3',
      sceneId: testScene.id,
      name: 'MS3',
      order: 2
    });
    
    // Reorder: 3, 1, 2
    const response = await request(app)
      .put(`/api/v1/scenes/${testScene.id}/mini-scenes/reorder`)
      .send({
        miniSceneIds: ['ms3', 'ms1', 'ms2']
      });
    
    expect(response.status).toBe(200);
    
    // Verify order
    const miniScenes = await MiniScene.findAll({
      where: { sceneId: testScene.id },
      order: [['order', 'ASC']]
    });
    
    expect(miniScenes[0].id).toBe('ms3');
    expect(miniScenes[1].id).toBe('ms1');
    expect(miniScenes[2].id).toBe('ms2');
  });
  
  test('Time calculation', async () => {
    // Create 2 mini-scenes with different durations
    await MiniScene.create({
      id: 'ms1',
      sceneId: testScene.id,
      name: 'MS1',
      duration: 5.0,
      order: 0
    });
    
    await MiniScene.create({
      id: 'ms2',
      sceneId: testScene.id,
      name: 'MS2',
      duration: 7.5,
      order: 1
    });
    
    // Recalculate times
    await recalculateTimes(testScene.id);
    
    // Verify
    const ms1 = await MiniScene.findByPk('ms1');
    const ms2 = await MiniScene.findByPk('ms2');
    
    expect(ms1.startTime).toBe(0);
    expect(ms1.endTime).toBe(5.0);
    expect(ms2.startTime).toBe(5.0);
    expect(ms2.endTime).toBe(12.5);
  });
});
```

## Performance Considerations

1. **Database indexes**: Create indexes on `scene_id` and `order_index`
2. **Pagination**: For scenes with many mini-scenes
3. **Caching**: Cache frequently accessed mini-scenes
4. **Lazy loading**: Load cameras and transitions only when needed
5. **Batch operations**: Use transactions for multiple updates

## Implementation Checklist

- [ ] Create database tables/schema
- [ ] Implement ORM models
- [ ] Create REST API endpoints
- [ ] Implement time calculation logic
- [ ] Add data validation
- [ ] Implement camera management
- [ ] Integrate with video generation system
- [ ] Write unit tests
- [ ] Document API (Swagger/OpenAPI)
- [ ] Test integration with frontend
- [ ] Add performance optimizations
- [ ] Deploy to staging environment

---

**Version**: 1.0  
**Date**: 2025-01-15  
**Author**: Frontend Team
