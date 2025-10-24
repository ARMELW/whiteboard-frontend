import { useHistoryStore } from '../store';

export const useHistory = () => {
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const canUndo = useHistoryStore((state) => state.canUndo());
  const canRedo = useHistoryStore((state) => state.canRedo());
  const clear = useHistoryStore((state) => state.clear);
  const undoStack = useHistoryStore((state) => state.undoStack);
  const redoStack = useHistoryStore((state) => state.redoStack);
  
  return {
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    undoStack,
    redoStack,
  };
};
