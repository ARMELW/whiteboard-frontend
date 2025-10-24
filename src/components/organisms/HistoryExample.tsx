import React from 'react';
import { useHistory } from '@/app/history';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import { useCurrentScene } from '@/app/scenes';
import { LayerType, LayerMode } from '@/app/scenes/types';
import { v4 as uuidv4 } from 'uuid';
import { Undo, Redo, Plus, Trash2 } from 'lucide-react';

/**
 * Example component demonstrating the history system
 * This shows how to use history-aware actions and undo/redo
 */
const HistoryExample: React.FC = () => {
  const { undo, redo, canUndo, canRedo, undoStack } = useHistory();
  const currentScene = useCurrentScene();
  const { addLayer, deleteLayer, updateLayerProperty } = useScenesActionsWithHistory();
  
  const handleAddTestLayer = () => {
    if (!currentScene) return;
    
    const newLayer = {
      id: uuidv4(),
      name: `Test Layer ${Date.now()}`,
      type: LayerType.TEXT,
      mode: LayerMode.STATIC,
      position: { x: 0.5, y: 0.5 },
      z_index: (currentScene.layers?.length || 0) + 1,
      scale: 1,
      opacity: 1,
      text: 'Test Layer',
    };
    
    // This will add the layer AND record it in history
    addLayer({ sceneId: currentScene.id, layer: newLayer });
  };
  
  const handleDeleteLastLayer = () => {
    if (!currentScene || !currentScene.layers || currentScene.layers.length === 0) return;
    
    const lastLayer = currentScene.layers[currentScene.layers.length - 1];
    
    // This will delete the layer AND record it in history
    deleteLayer({ sceneId: currentScene.id, layerId: lastLayer.id });
  };
  
  const handleChangeOpacity = () => {
    if (!currentScene || !currentScene.layers || currentScene.layers.length === 0) return;
    
    const lastLayer = currentScene.layers[currentScene.layers.length - 1];
    const newOpacity = Math.random(); // Random opacity for demo
    
    // This will update the property AND record it in history
    updateLayerProperty(currentScene.id, lastLayer.id, 'opacity', newOpacity);
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md">
      <h2 className="text-lg font-bold mb-4">History System Example</h2>
      
      {/* Action Buttons */}
      <div className="space-y-2 mb-4">
        <button
          onClick={handleAddTestLayer}
          disabled={!currentScene}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Test Layer
        </button>
        
        <button
          onClick={handleDeleteLastLayer}
          disabled={!currentScene || !currentScene.layers || currentScene.layers.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Delete Last Layer
        </button>
        
        <button
          onClick={handleChangeOpacity}
          disabled={!currentScene || !currentScene.layers || currentScene.layers.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Change Opacity (Random)
        </button>
      </div>
      
      {/* Undo/Redo Controls */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">History Controls</h3>
        <div className="flex gap-2 mb-4">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Undo className="w-4 h-4" />
            Undo
          </button>
          
          <button
            onClick={redo}
            disabled={!canRedo}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Redo className="w-4 h-4" />
            Redo
          </button>
        </div>
        
        {/* History Info */}
        <div className="text-sm text-gray-600">
          <p>Actions in history: {undoStack.length}</p>
          <p>Can undo: {canUndo ? 'Yes' : 'No'}</p>
          <p>Can redo: {canRedo ? 'Yes' : 'No'}</p>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <p className="font-semibold mb-1">How to test:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Click "Add Test Layer" to add layers</li>
          <li>Click "Delete Last Layer" to remove them</li>
          <li>Use Undo/Redo buttons or keyboard shortcuts (Ctrl+Z/Ctrl+Y)</li>
          <li>Open History Panel (Clock icon) to see all actions</li>
        </ol>
      </div>
    </div>
  );
};

export default HistoryExample;
