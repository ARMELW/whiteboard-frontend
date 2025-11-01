export interface Point {
  x: number;
  y: number;
  id: string;
}

export interface SvgData {
  content: string;
  width: number;
  height: number;
  viewBox?: string;
}

export interface CanvasState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface PathEditorState {
  svgData: SvgData | null;
  points: Point[];
  selectedPointId: string | null;
  canvasState: CanvasState;
  history: Point[][];
  historyIndex: number;
}
