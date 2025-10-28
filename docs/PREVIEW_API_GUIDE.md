# Preview API Usage Guide

This document explains how to use the new preview API functionality that was added to the frontend.

## Overview

The preview functionality allows generating previews for:
1. **Single Scene Preview** - Preview a specific scene
2. **Complete Video Preview** - Preview all scenes in sequence

The preview system sends minimal scene data to the backend API, which generates a video preview and returns a video URL.

## API Endpoints

The following endpoints have been added to the API configuration:

```typescript
preview: {
  scene: `${prefix}/v1/preview/scene`,
  complete: `${prefix}/v1/preview/complete`,
  status: (previewId: string) => `${prefix}/v1/preview/status/${previewId}`,
  cancel: (previewId: string) => `${prefix}/v1/preview/cancel/${previewId}`,
}
```

## Services

### PreviewService

Located at: `src/services/api/previewService.ts`

The service provides methods to:
- Generate scene preview: `previewService.previewScene(scene)`
- Generate complete preview: `previewService.previewComplete(projectId, scenes, config)`
- Get preview status: `previewService.getPreviewStatus(previewId)`
- Cancel preview: `previewService.cancelPreview(previewId)`
- Poll for completion: `previewService.pollPreviewStatus(previewId, onProgress)`

### Data Extraction

The service extracts only the necessary data for preview generation:

```typescript
export interface PreviewScenePayload {
  sceneId: string;
  duration: number;
  layers: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    scale: number;
    opacity: number;
    image_path?: string;
    text_config?: any;
    shape_config?: any;
    z_index: number;
  }>;
  cameras: Array<{
    id: string;
    position: { x: number; y: number };
    width?: number;
    height?: number;
    zoom?: number;
    isDefault?: boolean;
  }>;
  backgroundColor?: string;
  backgroundImage?: string | null;
  audio?: {
    fileId?: string;
    volume?: number;
  } | null;
}
```

## Hooks

### useScenePreview

Located at: `src/hooks/useScenePreview.ts`

Hook for generating single scene previews.

**Usage:**

```typescript
import { useScenePreview } from '@/hooks/useScenePreview';

function MyComponent() {
  const { generatePreview, cancelPreview, isGenerating, progress } = useScenePreview({
    onSuccess: (videoUrl) => {
      console.log('Preview ready:', videoUrl);
    },
    onError: (error) => {
      console.error('Preview failed:', error);
    },
    onProgress: (progress) => {
      console.log('Progress:', progress);
    }
  });

  const handlePreview = async (scene) => {
    await generatePreview(scene);
  };

  return (
    <button onClick={() => handlePreview(currentScene)} disabled={isGenerating}>
      {isGenerating ? `Generating... ${progress}%` : 'Preview Scene'}
    </button>
  );
}
```

### useCompletePreview

Located at: `src/hooks/useCompletePreview.ts`

Hook for generating complete video previews (all scenes).

**Usage:**

```typescript
import { useCompletePreview } from '@/hooks/useCompletePreview';

function MyComponent() {
  const { generatePreview, cancelPreview, isGenerating, progress } = useCompletePreview({
    onSuccess: (videoUrl) => {
      console.log('Preview ready:', videoUrl);
    },
    onError: (error) => {
      console.error('Preview failed:', error);
    },
    onProgress: (progress) => {
      console.log('Progress:', progress);
    },
    width: 1920,
    height: 1080,
    fps: 30
  });

  const handlePreview = async () => {
    await generatePreview(projectId, scenes);
  };

  return (
    <button onClick={handlePreview} disabled={isGenerating}>
      {isGenerating ? `Generating... ${progress}%` : 'Preview All Scenes'}
    </button>
  );
}
```

## Integration Example: ScenePanel

The `ScenePanel` component has been updated to use the new preview API:

```typescript
import { useScenePreview } from '@/hooks/useScenePreview';

const ScenePanel: React.FC<ScenePanelProps> = ({ onOpenTemplateLibrary }) => {
  // ... other code ...
  
  // Preview hook
  const { generatePreview: generateScenePreview, isGenerating: isGeneratingPreview } = useScenePreview();
  
  const handlePreviewScene = useCallback(async (index: number) => {
    const scene = storedScenes[index];
    
    if (!scene) {
      return;
    }
    
    // Set preview mode and starting scene index
    useSceneStore.getState().setPreviewMode(true);
    useSceneStore.getState().setPreviewStartSceneIndex(index);
    
    // Use the preview service to generate the preview
    await generateScenePreview(scene);
  }, [storedScenes, generateScenePreview]);
  
  // ... rest of component ...
};
```

## Preview Flow

1. **User Action**: User clicks preview button
2. **Hook Called**: `generatePreview()` is called with scene data
3. **API Request**: Service sends minimal scene data to backend endpoint
4. **Preview ID Returned**: Backend returns a preview ID
5. **Polling**: Service polls the status endpoint for completion
6. **Progress Updates**: Optional progress callback is triggered during polling
7. **Video Ready**: When complete, video URL is returned
8. **Preview Displayed**: The preview player shows the video

## Local vs API Preview

The application supports two types of preview:

### Local Preview (Quick Preview)
- **Hook**: `useQuickPreview` (existing)
- **Location**: `src/hooks/useQuickPreview.ts`
- **Method**: Client-side rendering using canvas
- **Speed**: Instant but limited quality
- **Use case**: Quick feedback during editing

### API Preview (New)
- **Hooks**: `useScenePreview`, `useCompletePreview`
- **Location**: `src/hooks/useScenePreview.ts`, `src/hooks/useCompletePreview.ts`
- **Method**: Backend rendering
- **Speed**: Takes time but higher quality
- **Use case**: Final preview before export

## Backend Requirements

The backend needs to implement the following endpoints:

### POST /v1/preview/scene
Generate preview for a single scene.

**Request Body:**
```json
{
  "sceneId": "scene-123",
  "duration": 5,
  "layers": [...],
  "cameras": [...],
  "backgroundColor": "#FFFFFF",
  "backgroundImage": "https://...",
  "audio": {
    "fileId": "audio-456",
    "volume": 0.8
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "previewId": "preview-789",
    "status": "pending",
    "progress": 0
  }
}
```

### POST /v1/preview/complete
Generate preview for complete video (all scenes).

**Request Body:**
```json
{
  "projectId": "project-123",
  "scenes": [
    { /* scene 1 data */ },
    { /* scene 2 data */ }
  ],
  "config": {
    "width": 1920,
    "height": 1080,
    "fps": 30
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "previewId": "preview-789",
    "status": "pending",
    "progress": 0
  }
}
```

### GET /v1/preview/status/:previewId
Get the status of a preview generation.

**Response:**
```json
{
  "success": true,
  "data": {
    "previewId": "preview-789",
    "status": "completed",
    "progress": 100,
    "videoUrl": "https://cdn.example.com/previews/preview-789.mp4"
  }
}
```

Status values: `pending`, `processing`, `completed`, `error`

### POST /v1/preview/cancel/:previewId
Cancel an in-progress preview generation.

**Response:**
```json
{
  "success": true
}
```

## Testing

To test the preview functionality:

1. Ensure the backend implements the required endpoints
2. Create or load a scene with content
3. Click the preview button in the ScenePanel
4. The preview should generate and display automatically
5. Monitor the progress in the console or UI

## Error Handling

The preview hooks automatically handle errors and display toast notifications:

- **No scenes to preview**: Error toast displayed
- **API request fails**: Error toast with message
- **Timeout**: Error after max polling attempts
- **Backend error**: Error toast with backend message

## Future Enhancements

Potential improvements:
- Caching of preview videos
- Offline preview fallback
- Preview quality settings
- Preview duration customization
- Background preview generation
- Preview thumbnail generation
