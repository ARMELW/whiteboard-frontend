import { create } from 'zustand';
import { HistoryAction } from './types';

interface HistoryState {
  // History stacks
  undoStack: HistoryAction[];
  redoStack: HistoryAction[];
  
  // Configuration
  maxHistorySize: number;
  
  // State
  isUndoing: boolean;
  isRedoing: boolean;
  
  // Actions
  pushAction: (action: HistoryAction) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  setMaxHistorySize: (size: number) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  maxHistorySize: 50,
  isUndoing: false,
  isRedoing: false,
  
  pushAction: (action: HistoryAction) => {
    const { undoStack, maxHistorySize, isUndoing, isRedoing } = get();
    
    // Don't add to history if we're currently undoing or redoing
    if (isUndoing || isRedoing) {
      return;
    }
    
    // Add action to undo stack
    const newUndoStack = [...undoStack, action];
    
    // Limit stack size
    if (newUndoStack.length > maxHistorySize) {
      newUndoStack.shift();
    }
    
    // Clear redo stack when new action is pushed
    set({
      undoStack: newUndoStack,
      redoStack: [],
    });
  },
  
  undo: () => {
    const { undoStack, redoStack } = get();
    
    if (undoStack.length === 0) {
      return;
    }
    
    // Get last action from undo stack
    const action = undoStack[undoStack.length - 1];
    
    // Set undoing flag
    set({ isUndoing: true });
    
    try {
      // Execute undo
      action.undo();
      
      // Move action to redo stack
      set({
        undoStack: undoStack.slice(0, -1),
        redoStack: [...redoStack, action],
      });
    } finally {
      // Reset undoing flag
      set({ isUndoing: false });
    }
  },
  
  redo: () => {
    const { undoStack, redoStack } = get();
    
    if (redoStack.length === 0) {
      return;
    }
    
    // Get last action from redo stack
    const action = redoStack[redoStack.length - 1];
    
    // Set redoing flag
    set({ isRedoing: true });
    
    try {
      // Execute redo
      action.redo();
      
      // Move action back to undo stack
      set({
        redoStack: redoStack.slice(0, -1),
        undoStack: [...undoStack, action],
      });
    } finally {
      // Reset redoing flag
      set({ isRedoing: false });
    }
  },
  
  clear: () => {
    set({
      undoStack: [],
      redoStack: [],
    });
  },
  
  canUndo: () => {
    return get().undoStack.length > 0;
  },
  
  canRedo: () => {
    return get().redoStack.length > 0;
  },
  
  setMaxHistorySize: (size: number) => {
    set({ maxHistorySize: size });
  },
}));
