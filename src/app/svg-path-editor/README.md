# SVG Path Editor Feature

## Architecture

This feature follows the project's standard architecture pattern located at `src/app/[feature]/`.

### Structure

```
src/app/svg-path-editor/
├── components/
│   ├── SvgPathEditorCanvas.tsx    # Main interactive Konva canvas
│   ├── SvgPathEditorToolbar.tsx   # Toolbar with controls
│   └── index.ts                    # Component exports
├── types.ts                        # TypeScript type definitions
├── config.ts                       # Configuration constants
├── store.ts                        # Zustand state management
├── index.ts                        # Public API exports
└── README.md                       # This file

src/pages/svg-path-editor/
└── SvgPathEditorPage.tsx          # Main page component
```

## Features

### Canvas (SvgPathEditorCanvas.tsx)
- **SVG Display**: Renders uploaded SVG with automatic scaling
- **Point Management**: 
  - Click to add points
  - Drag to move points
  - Delete key to remove points
  - Visual feedback (numbered, colored states)
- **Path Visualization**: Real-time line drawing between points
- **Keyboard Shortcuts**: Delete, Escape, Ctrl+Z, Ctrl+Y
- **Responsive**: Auto-scales SVG to fit canvas

### Toolbar (SvgPathEditorToolbar.tsx)
- **File Upload**: SVG file input with validation
- **Undo/Redo**: History navigation with disabled states
- **Clear Points**: Remove all points while keeping SVG
- **Export JSON**: Download points as JSON array
- **Reset**: Clear everything
- **Status Display**: Shows point count

### State Management (store.ts)
- **Zustand Store**: Manages all editor state
- **Features**:
  - SVG data storage
  - Points array with history
  - Selected point tracking
  - Canvas state (scale, offset)
  - Undo/redo with 50-level history
  - Automatic history management

## Technologies Used

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Konva + React-Konva**: Canvas manipulation
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **uuid**: Point ID generation

## Usage

### Import the Feature
```typescript
import { usePathEditorStore } from '@/app/svg-path-editor';
```

### Access the Page
Navigate to `/svg-path-editor` in the application.

### Export Format
Points are exported as:
```json
[
  { "x": 50, "y": 200 },
  { "x": 120, "y": 180 },
  { "x": 200, "y": 160 }
]
```

Coordinates are in SVG coordinate space (not pixels).

## Configuration

Edit `config.ts` to customize:
- Canvas dimensions
- Point appearance (size, colors)
- Line style
- Zoom limits
- History size

## State Structure

```typescript
interface PathEditorStore {
  svgData: SvgData | null;           // Uploaded SVG info
  points: Point[];                    // Array of path points
  selectedPointId: string | null;    // Currently selected point
  canvasState: CanvasState;          // Scale, offset for canvas
  history: Point[][];                // Undo/redo history
  historyIndex: number;              // Current position in history
  
  // Actions
  setSvgData: (svgData: SvgData | null) => void;
  addPoint: (point: Point) => void;
  updatePoint: (id: string, x: number, y: number) => void;
  deletePoint: (id: string) => void;
  selectPoint: (id: string | null) => void;
  clearPoints: () => void;
  setCanvasState: (state: Partial<CanvasState>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
}
```

## Integration with Animation System

The exported JSON can be used to:
1. Animate a hand/pen cursor along the path
2. Create drawing reveal effects
3. Coordinate multiple animated elements
4. Generate timing data for animations

Example:
```typescript
import pathPoints from './exported-path.json';

// Use with animation library
pathPoints.forEach((point, index) => {
  animateHandTo(point.x, point.y, index * duration);
});
```

## Future Enhancements

Potential improvements:
- [ ] Zoom/pan with mouse wheel and drag
- [ ] Grid and snap-to-grid
- [ ] Point editing sidebar with coordinate input
- [ ] Bezier curve support
- [ ] Path smoothing/simplification
- [ ] Multiple path support
- [ ] SVG layer selection
- [ ] Import existing JSON paths
- [ ] Path preview animation
- [ ] Copy/paste points

## Testing

Test the feature by:
1. Upload `docs/svg-path-editor-sample.svg`
2. Add points along the arrow path
3. Test drag, delete, undo/redo
4. Export and verify JSON format
5. Test keyboard shortcuts

## Dependencies

No additional dependencies were added. All required packages (Konva, Zustand, etc.) were already installed in the project.
