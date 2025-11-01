# Shape Management System - Usage Guide

## Overview

The Shape Management System provides a complete frontend implementation for managing SVG shape assets in the whiteboard application. It follows the same architectural patterns as the existing assets module.

## Features

- ✅ Upload SVG files with metadata (name, category, tags)
- ✅ List shapes with pagination, filtering, and sorting
- ✅ Get individual shape details
- ✅ Update shape metadata and properties
- ✅ Delete shapes
- ✅ Get shape statistics
- ✅ Automatic cache invalidation with React Query
- ✅ Toast notifications for all operations
- ✅ Full TypeScript support

## Installation

The shapes module is already integrated into the project. Import from:

```typescript
import {
  useShapes,
  useShape,
  useShapesActions,
  shapesService,
  type ShapeAsset,
  type ShapeCategory,
  // ... other types
} from '@/app/shapes';
```

## API Endpoints

All endpoints are configured in `/src/config/api.ts`:

- `POST /v1/shapes/upload` - Upload SVG file
- `GET /v1/shapes` - List shapes with filters
- `GET /v1/shapes/{id}` - Get shape by ID
- `PUT /v1/shapes/{id}` - Update shape
- `DELETE /v1/shapes/{id}` - Delete shape
- `GET /v1/shapes/stats` - Get statistics

## Type Definitions

### ShapeAsset
```typescript
interface ShapeAsset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: 'svg' | 'path' | 'geometric';
  size: number;
  width?: number;
  height?: number;
  tags: string[];
  category: ShapeCategory;
  shapeData?: ShapeData;
  uploadedAt: string;
  userId: string;
  usageCount: number;
  lastUsedAt?: string;
}
```

### ShapeCategory
```typescript
type ShapeCategory = 
  | 'basic'       // Formes basiques (cercle, carré, triangle)
  | 'arrow'       // Flèches directionnelles
  | 'callout'     // Bulles de texte
  | 'banner'      // Bannières et rubans
  | 'icon'        // Icônes vectorielles
  | 'decorative'  // Éléments décoratifs
  | 'other';      // Autres formes
```

### ShapeData
```typescript
interface ShapeData {
  svgContent?: string;    // Contenu SVG complet
  pathData?: string;      // Données du path SVG
  viewBox?: string;       // ViewBox SVG (ex: "0 0 100 100")
  fill?: string;          // Couleur de remplissage
  stroke?: string;        // Couleur du contour
  strokeWidth?: number;   // Épaisseur du contour
  isEditable?: boolean;   // Si les couleurs sont éditables
}
```

## React Hooks

### 1. useShapes - List and Query Shapes

```typescript
import { useShapes } from '@/app/shapes';

function ShapesList() {
  const { shapes, total, loading, error, refetch, invalidate } = useShapes({
    page: 1,
    limit: 20,
    filter: 'circle',
    category: 'basic',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading shapes</div>;

  return (
    <div>
      <p>Total shapes: {total}</p>
      {shapes.map(shape => (
        <div key={shape.id}>
          <img src={shape.thumbnailUrl || shape.url} alt={shape.name} />
          <h3>{shape.name}</h3>
          <p>Category: {shape.category}</p>
          <p>Used {shape.usageCount} times</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. useShape - Get Single Shape

```typescript
import { useShape } from '@/app/shapes';

function ShapeDetail({ shapeId }: { shapeId: string }) {
  const { shape, loading, error, invalidate } = useShape(shapeId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading shape</div>;
  if (!shape) return <div>Shape not found</div>;

  return (
    <div>
      <h2>{shape.name}</h2>
      <img src={shape.url} alt={shape.name} />
      <p>Size: {(shape.size / 1024).toFixed(2)} KB</p>
      <p>Dimensions: {shape.width} x {shape.height}</p>
      <p>Tags: {shape.tags.join(', ')}</p>
      {shape.shapeData?.fill && <p>Fill: {shape.shapeData.fill}</p>}
      {shape.shapeData?.stroke && <p>Stroke: {shape.shapeData.stroke}</p>}
    </div>
  );
}
```

### 3. useShapesActions - Mutations

```typescript
import { useShapesActions } from '@/app/shapes';
import { useState } from 'react';

function ShapeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const { uploadShape, isUploading, deleteShape, updateShape } = useShapesActions();

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      const shape = await uploadShape(file, {
        name: 'My Custom Shape',
        category: 'icon',
        tags: ['custom', 'vector']
      });
      
      console.log('Shape uploaded:', shape);
      // Success toast is shown automatically
    } catch (error) {
      // Error toast is shown automatically
      console.error('Upload failed:', error);
    }
  };

  const handleUpdate = async (shapeId: string) => {
    try {
      await updateShape(shapeId, {
        name: 'Updated Name',
        tags: ['updated', 'modified'],
        shapeData: {
          fill: '#FF0000',
          stroke: '#000000',
          strokeWidth: 2
        }
      });
      // Success toast is shown automatically
    } catch (error) {
      // Error toast is shown automatically
    }
  };

  const handleDelete = async (shapeId: string) => {
    if (confirm('Delete this shape?')) {
      try {
        await deleteShape(shapeId);
        // Success toast is shown automatically
      } catch (error) {
        // Error toast is shown automatically
      }
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".svg"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button 
        onClick={handleUpload}
        disabled={!file || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Shape'}
      </button>
    </div>
  );
}
```

### 4. Shape Statistics

```typescript
import { useShapesActions } from '@/app/shapes';

function ShapeStats() {
  const { getShapeStats, isLoadingStats } = useShapesActions();
  const stats = getShapeStats();

  if (isLoadingStats) return <div>Loading stats...</div>;
  if (!stats) return null;

  return (
    <div>
      <h3>Shape Statistics</h3>
      <p>Total Shapes: {stats.totalShapes}</p>
      <p>Total Size: {stats.totalSizeMB} MB</p>
      
      <h4>By Category:</h4>
      <ul>
        {Object.entries(stats.shapesByCategory).map(([category, count]) => (
          <li key={category}>{category}: {count}</li>
        ))}
      </ul>

      {stats.mostUsedShapes && (
        <div>
          <h4>Most Used Shapes:</h4>
          {stats.mostUsedShapes.map(shape => (
            <div key={shape.id}>
              {shape.name} - {shape.usageCount} uses
            </div>
          ))}
        </div>
      )}

      {stats.recentlyUploaded && (
        <div>
          <h4>Recently Uploaded:</h4>
          {stats.recentlyUploaded.map(shape => (
            <div key={shape.id}>{shape.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Direct Service Usage

If you need to bypass React Query hooks:

```typescript
import { shapesService } from '@/app/shapes';

// Upload
const shape = await shapesService.upload(file, {
  name: 'My Shape',
  category: 'icon',
  tags: ['custom']
});

// List
const result = await shapesService.list({
  page: 1,
  limit: 20,
  filter: 'circle',
  category: 'basic'
});

// Get by ID
const shape = await shapesService.detail('shape-id');

// Update
const updatedShape = await shapesService.update('shape-id', {
  name: 'New Name',
  tags: ['updated']
});

// Delete
await shapesService.delete('shape-id');

// Get stats
const stats = await shapesService.getStats();

// Search
const results = await shapesService.search('circle');

// Get by category
const basicShapes = await shapesService.getByCategory('basic');
```

## Complete Upload Component Example

```typescript
import React, { useState } from 'react';
import { useShapes, useShapesActions, type ShapeCategory } from '@/app/shapes';

const CATEGORIES: ShapeCategory[] = [
  'basic', 'arrow', 'callout', 'banner', 'icon', 'decorative', 'other'
];

export function ShapeUploadManager() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ShapeCategory>('other');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { shapes, loading, invalidate } = useShapes();
  const { uploadShape, isUploading, deleteShape } = useShapesActions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'image/svg+xml') {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.replace('.svg', ''));
      }
    } else {
      alert('Please select an SVG file');
    }
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadShape(file, {
        name: name || file.name,
        category,
        tags
      });

      // Reset form
      setFile(null);
      setName('');
      setCategory('other');
      setTags([]);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDelete = async (shapeId: string) => {
    if (confirm('Delete this shape?')) {
      await deleteShape(shapeId);
    }
  };

  return (
    <div>
      <h2>Upload Shape</h2>
      
      <div>
        <label>
          SVG File:
          <input
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {file && (
        <>
          <div>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shape name"
              />
            </label>
          </div>

          <div>
            <label>
              Category:
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShapeCategory)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Tags:
              <div>
                {tags.map(tag => (
                  <span key={tag}>
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag"
              />
              <button onClick={handleAddTag}>Add Tag</button>
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Shape'}
          </button>
        </>
      )}

      <h2>My Shapes</h2>
      {loading ? (
        <div>Loading shapes...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {shapes.map(shape => (
            <div key={shape.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
              <img
                src={shape.thumbnailUrl || shape.url}
                alt={shape.name}
                style={{ width: '100%', height: '100px', objectFit: 'contain' }}
              />
              <h4>{shape.name}</h4>
              <p>Category: {shape.category}</p>
              <p>Size: {(shape.size / 1024).toFixed(2)} KB</p>
              <p>Used: {shape.usageCount} times</p>
              {shape.tags.length > 0 && (
                <p>Tags: {shape.tags.join(', ')}</p>
              )}
              <button onClick={() => handleDelete(shape.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Filtering and Sorting Examples

```typescript
// Filter by name
const { shapes } = useShapes({ filter: 'circle' });

// Filter by category
const { shapes } = useShapes({ category: 'arrow' });

// Sort by usage count
const { shapes } = useShapes({
  sortBy: 'usageCount',
  sortOrder: 'desc'
});

// Pagination
const { shapes, total } = useShapes({
  page: 2,
  limit: 10
});

// Combine filters
const { shapes } = useShapes({
  filter: 'star',
  category: 'icon',
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  limit: 20
});

// Filter by tags (multiple)
const { shapes } = useShapes({
  tags: ['geometric', 'simple']
});
```

## Error Handling

All mutations automatically show toast notifications for success/error states. Errors include:

- `400` - Invalid file format or validation error
- `401` - Not authenticated
- `404` - Shape not found
- `413` - File too large (>5MB)

```typescript
const { uploadShape } = useShapesActions();

try {
  await uploadShape(file, metadata);
  // Success toast shown automatically: "Shape uploaded successfully"
} catch (error) {
  // Error toast shown automatically with specific message
  // e.g., "File must be an SVG" or "File size must be less than 5MB"
}
```

## Cache Management

React Query automatically manages caching with these strategies:

- **Lists**: 5 minutes stale time (matches backend cache)
- **Details**: 10 minutes stale time
- **Stats**: 5 minutes stale time
- **Auto-invalidation**: All relevant queries invalidated after mutations

Manual cache invalidation:

```typescript
const { invalidate } = useShapes();
await invalidate(); // Refetch all shapes

const { invalidate: invalidateShape } = useShape(id);
await invalidateShape(); // Refetch specific shape
```

## Architecture Notes

This module follows the established patterns in the codebase:

1. **Service Layer** (`shapesService.ts`): Extends `BaseService` for CRUD operations
2. **Query Hooks** (`useShapes.ts`): React Query integration for data fetching
3. **Mutation Hooks** (`useShapesActions.ts`): React Query mutations with cache invalidation
4. **Type Safety**: Complete TypeScript definitions for all API interactions
5. **Error Handling**: Centralized error handling with toast notifications
6. **Caching**: Intelligent caching strategy matching backend capabilities

## Testing

To test the implementation:

1. Use the upload component to upload an SVG file
2. Verify it appears in the list with correct metadata
3. Test filtering and sorting
4. Update shape metadata
5. Check statistics update correctly
6. Delete a shape and verify cache invalidation

## Backend Requirements

Ensure your backend implements these endpoints according to the API specification in the issue. The frontend expects:

- Multipart form data for uploads
- JSON responses with `{ success: true, data: {...} }` structure
- Proper error responses with error messages
- Authentication via Bearer token

## Support

For issues or questions:
- Check the assets module (`src/app/assets`) for similar patterns
- Review React Query documentation for caching strategies
- Verify API endpoints match backend implementation
