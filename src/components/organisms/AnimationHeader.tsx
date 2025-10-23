import React, { useEffect } from 'react';
import { Save, Download, Undo, Redo, FileVideo, Play } from 'lucide-react';
import { useSceneStore } from '@/app/scenes';
import { useHistory } from '@/app/hooks/useHistory';

const AnimationHeader: React.FC = () => {
  const scenes = useSceneStore((state) => state.scenes);
  const setScenes = useSceneStore((state) => state.setScenes);
  const setActiveTab = useSceneStore((state) => state.setActiveTab);
  
  const { undo, redo, canUndo, canRedo } = useHistory(scenes, 10);

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setScenes(previousState);
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setScenes(nextState);
    }
  };

  const handleExportClick = () => {
    // Switch to export tab in properties panel
    setActiveTab('export');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo]);

  return (
    <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
      {/* Left: Logo & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileVideo className="w-6 h-6 text-purple-500" />
        </div>
        <div className="h-6 w-px bg-gray-700" />
      </div>

      {/* Center: Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-2 rounded transition-colors ${
            canUndo
              ? 'hover:bg-gray-800 text-gray-300'
              : 'text-gray-500 cursor-not-allowed'
          }`}
          title="Annuler (Ctrl+Z)"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={`p-2 rounded transition-colors ${
            canRedo
              ? 'hover:bg-gray-800 text-gray-300'
              : 'text-gray-500 cursor-not-allowed'
          }`}
          title="Rétablir (Ctrl+Y)"
        >
          <Redo className="w-5 h-5" />
        </button>
        <div className="h-6 w-px  mx-2" />
        <button
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
        >
          <Play className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Save & Export */}
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-gray-300 rounded transition-colors"
        >
          <Save className="w-4 h-4" />
        </button>
        <button
          onClick={handleExportClick}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Exporter</span>
        </button>
      </div>
    </header>
  );
};

export default AnimationHeader;