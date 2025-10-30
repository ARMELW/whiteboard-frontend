# Layer Snapshot System - Examples

This directory contains practical examples demonstrating how to use the Layer Snapshot System in your application.

## What is the Layer Snapshot System?

The Layer Snapshot System automatically generates and caches **full scene images** (1920x1080) with each layer positioned at its real location. This provides:

- ✅ Visual previews of layers in context
- ✅ Export-ready images
- ✅ Optimized rendering with cached images
- ✅ Background processing (non-blocking)

## Key Concept

**Each layer snapshot = Full scene background + Layer at real position**

Unlike isolated layer thumbnails, these snapshots show exactly how the layer appears in the scene, including the background and proper positioning.

## Available Examples

All examples are in `layer-snapshot-usage.tsx`.

### 1. LayerThumbnailList

Display all layers in a scene with their snapshot previews.

```tsx
import { LayerThumbnailList } from './examples/layer-snapshot-usage';

<LayerThumbnailList sceneId="scene-123" />
```

**Use case**: Layer panel sidebar, quick navigation

### 2. ExportLayerButton

Export a layer snapshot (full scene) as a downloadable PNG file.

```tsx
import { ExportLayerButton } from './examples/layer-snapshot-usage';

<ExportLayerButton layer={currentLayer} />
```

**Use case**: Export individual layers for sharing, archiving

### 3. LayerHistory

Track layer changes over time with visual snapshots.

```tsx
import { LayerHistory } from './examples/layer-snapshot-usage';

<LayerHistory layerId="layer-456" sceneId="scene-123" />
```

**Use case**: Undo/redo functionality, change tracking

### 4. LayerComparison

Compare two layer states side-by-side with visual previews.

```tsx
import { LayerComparison } from './examples/layer-snapshot-usage';

<LayerComparison 
  layerBefore={originalLayer} 
  layerAfter={modifiedLayer} 
/>
```

**Use case**: Review changes, A/B testing, quality control

### 5. LayerGallery

Searchable gallery of all layers with visual previews.

```tsx
import { LayerGallery } from './examples/layer-snapshot-usage';

<LayerGallery sceneId="scene-123" />
```

**Use case**: Asset browser, layer search, visual navigation

### 6. SnapshotStatus

Monitor snapshot generation progress across all layers.

```tsx
import { SnapshotStatus } from './examples/layer-snapshot-usage';

<SnapshotStatus sceneId="scene-123" />
```

**Use case**: Loading indicators, system status monitoring

### 7. LayerManagementPanel (Complete Example)

Full-featured layer management interface combining multiple features.

```tsx
import { LayerManagementPanel } from './examples/layer-snapshot-usage';

<LayerManagementPanel sceneId="scene-123" />
```

**Use case**: Professional layer editor, comprehensive management interface

## How It Works

### Automatic Generation

Snapshots are automatically generated when:

```typescript
// Adding a new layer
useSceneStore.getState().addLayer(sceneId, newLayer);
// → Snapshot generated in background

// Updating a layer
useSceneStore.getState().updateLayer(sceneId, modifiedLayer);
// → Snapshot regenerated

// Changing layer properties
useSceneStore.getState().updateLayerProperty(sceneId, layerId, 'opacity', 0.5);
// → Snapshot regenerated if visual property changed
```

### Accessing Snapshots

```typescript
const scene = useSceneStore(state => state.scenes.find(s => s.id === sceneId));
const layer = scene?.layers?.find(l => l.id === layerId);

// The snapshot is available as a data URL
if (layer?.cachedImage) {
  console.log('Snapshot ready:', layer.cachedImage);
  // Use it in <img src={layer.cachedImage} />
}
```

### Manual Generation

```typescript
import { generateLayerSnapshot } from '@/utils/layerSnapshot';

const snapshot = await generateLayerSnapshot(layer, {
  sceneWidth: 1920,
  sceneHeight: 1080,
  sceneBackgroundImage: scene.backgroundImage,
  pixelRatio: 2  // High quality
});
```

## Important Notes

### 1. Snapshot Size

Each snapshot is a full scene image (1920x1080 by default, 3840x2160 at 2x pixel ratio):

- **File size**: ~400-800KB per snapshot (PNG format, 1920x1080 full scene with background and layer)
- **Memory impact**: Consider this when displaying many snapshots simultaneously
- **Solution**: Use CSS to scale images down for thumbnails while keeping original resolution

```tsx
<img 
  src={layer.cachedImage} 
  style={{ width: '150px', height: 'auto' }}  // Scale down for display
/>
```

### 2. Generation Time

Snapshots are generated in the background (times may vary based on hardware, browser, and image complexity):

- **Image layers**: ~100-200ms (tested on Intel i5, Chrome, medium complexity images)
- **Text layers**: ~50-80ms (tested on Intel i5, Chrome, standard fonts)
- **Shape layers**: ~40-70ms (tested on Intel i5, Chrome, basic shapes)

Always check if `layer.cachedImage` exists before using it, as generation is asynchronous.

### 3. Scene Context Required

Snapshots include the scene background and use real layer positions. Make sure:

- Scene has proper `sceneWidth` and `sceneHeight`
- Scene `backgroundImage` URL is accessible (CORS-enabled)
- Layer positions are set correctly

### 4. Visual Properties

These properties trigger snapshot regeneration:

- `position` (x, y)
- `scale`
- `opacity`
- `rotation`
- `image_path` (for image layers)
- `text`, `text_config` (for text layers)
- `shape_config` (for shape layers)
- `visible`

Non-visual properties like `name`, `locked`, etc. don't trigger regeneration.

## Performance Tips

### 1. Lazy Loading for Large Lists

```tsx
import { Virtuoso } from 'react-virtuoso';

<Virtuoso
  data={layers}
  itemContent={(index, layer) => (
    <LayerThumbnail layer={layer} />
  )}
/>
```

### 2. Debounced Updates

The system automatically debounces snapshot generation (300ms default). For rapid changes:

```typescript
// Multiple quick changes won't trigger multiple regenerations
updateLayerProperty(sceneId, layerId, 'opacity', 0.8);
updateLayerProperty(sceneId, layerId, 'scale', 1.2);
updateLayerProperty(sceneId, layerId, 'rotation', 45);
// → Only one snapshot generated after 300ms of no changes
```

### 3. Progressive Enhancement

Show a placeholder while snapshot generates:

```tsx
{layer.cachedImage ? (
  <img src={layer.cachedImage} alt={layer.name} />
) : (
  <div className="placeholder">
    <Spinner />
    <span>Generating preview...</span>
  </div>
)}
```

## Styling Examples

### Thumbnail Grid

```css
.layer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.layer-thumbnail {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.layer-thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}
```

### Selected State

```css
.layer-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.layer-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.layer-item.selected {
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}
```

### Loading State

```css
.snapshot-loading {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## Troubleshooting

### Snapshot not generating?

1. Check if layer type is supported (image, text, shape)
2. Verify scene has proper dimensions
3. Check console for errors
4. Ensure CORS is configured for external images

### Poor quality snapshots?

Increase pixel ratio:

```typescript
// In store.ts, modify the snapshot generation call:
generateLayerSnapshotDebounced(layer, callback, 300, {
  sceneWidth: scene.sceneWidth || 1920,
  sceneHeight: scene.sceneHeight || 1080,
  sceneBackgroundImage: scene.backgroundImage || null,
  pixelRatio: 3  // Increase from 2 to 3
});
```

### Slow performance?

1. Reduce number of simultaneous snapshots displayed
2. Use virtual scrolling for long lists
3. Consider lower pixel ratio for thumbnails
4. Clear old snapshots from memory when not needed

## Further Reading

- [Layer Snapshot System Documentation](../docs/LAYER_SNAPSHOT_SYSTEM.md) - Complete technical documentation
- [Layer Exporter Utility](../src/utils/layerExporter.ts) - Underlying export functionality
- [Scene Store](../src/app/scenes/store.ts) - Store implementation with automatic generation

## Questions?

For issues or questions about the Layer Snapshot System:

1. Check the [documentation](../docs/LAYER_SNAPSHOT_SYSTEM.md)
2. Review these examples
3. Look at the console for error messages
4. Create an issue on GitHub
