export const SVG_PATH_EDITOR_CONFIG = {
  canvas: {
    width: 1200,
    height: 800,
    backgroundColor: '#1a1a1a',
  },
  point: {
    radius: 8,
    fill: '#3b82f6',
    stroke: '#ffffff',
    strokeWidth: 2,
    selectedFill: '#ef4444',
    hoveredFill: '#60a5fa',
  },
  line: {
    stroke: '#3b82f6',
    strokeWidth: 2,
    dash: [5, 5],
  },
  zoom: {
    min: 0.1,
    max: 5,
    step: 0.1,
  },
  maxHistorySize: 50,
} as const;
