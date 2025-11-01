import { create } from 'zustand';
import { Point, SvgData, CanvasState } from './types';
import { SVG_PATH_EDITOR_CONFIG } from './config';

interface PathEditorStore {
  svgData: SvgData | null;
  points: Point[];
  selectedPointId: string | null;
  canvasState: CanvasState;
  history: Point[][];
  historyIndex: number;
  
  setSvgData: (svgData: SvgData | null) => void;
  addPoint: (point: Point) => void;
  updatePoint: (id: string, x: number, y: number) => void;
  savePointsToHistory: () => void;
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

const initialCanvasState: CanvasState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export const usePathEditorStore = create<PathEditorStore>((set, get) => ({
  svgData: null,
  points: [],
  selectedPointId: null,
  canvasState: initialCanvasState,
  history: [[]],
  historyIndex: 0,

  setSvgData: (svgData) => set({ svgData, points: [], history: [[]], historyIndex: 0 }),

  addPoint: (point) => set((state) => {
    const newPoints = [...state.points, point];
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(newPoints);
    
    if (newHistory.length > SVG_PATH_EDITOR_CONFIG.maxHistorySize) {
      newHistory.shift();
      return {
        points: newPoints,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    
    return {
      points: newPoints,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }),

  updatePoint: (id, x, y) => set((state) => {
    const newPoints = state.points.map(p => 
      p.id === id ? { ...p, x, y } : p
    );
    return { points: newPoints };
  }),
  
  savePointsToHistory: () => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([...state.points]);
    
    if (newHistory.length > SVG_PATH_EDITOR_CONFIG.maxHistorySize) {
      newHistory.shift();
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }),

  deletePoint: (id) => set((state) => {
    const newPoints = state.points.filter(p => p.id !== id);
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(newPoints);
    
    if (newHistory.length > SVG_PATH_EDITOR_CONFIG.maxHistorySize) {
      newHistory.shift();
      return {
        points: newPoints,
        selectedPointId: null,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
    
    return {
      points: newPoints,
      selectedPointId: null,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }),

  selectPoint: (id) => set({ selectedPointId: id }),

  clearPoints: () => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([]);
    
    return {
      points: [],
      selectedPointId: null,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }),

  setCanvasState: (newState) => set((state) => ({
    canvasState: { ...state.canvasState, ...newState },
  })),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return {
        points: state.history[newIndex],
        historyIndex: newIndex,
        selectedPointId: null,
      };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      return {
        points: state.history[newIndex],
        historyIndex: newIndex,
        selectedPointId: null,
      };
    }
    return state;
  }),

  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },

  reset: () => set({
    svgData: null,
    points: [],
    selectedPointId: null,
    canvasState: initialCanvasState,
    history: [[]],
    historyIndex: 0,
  }),
}));
