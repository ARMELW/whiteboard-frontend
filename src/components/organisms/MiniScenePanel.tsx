import React, { useState } from 'react';
import { useSceneStore } from '@/app/scenes';
import { MiniScene, TransitionType, TransitionEasing } from '@/app/scenes/types';
import { Button, Card } from '../atoms';
import { Plus, Trash2, ChevronUp, ChevronDown, Film, Camera, Clock, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MiniScenePanelProps {
  sceneId: string;
}

const MiniScenePanel: React.FC<MiniScenePanelProps> = ({ sceneId }) => {
  const scenes = useSceneStore((state) => state.scenes);
  const selectedMiniSceneId = useSceneStore((state) => state.selectedMiniSceneId);
  const addMiniScene = useSceneStore((state) => state.addMiniScene);
  const updateMiniScene = useSceneStore((state) => state.updateMiniScene);
  const deleteMiniScene = useSceneStore((state) => state.deleteMiniScene);
  const reorderMiniScenes = useSceneStore((state) => state.reorderMiniScenes);
  const setSelectedMiniSceneId = useSceneStore((state) => state.setSelectedMiniSceneId);
  
  const [editingMiniScene, setEditingMiniScene] = useState<MiniScene | null>(null);

  const scene = scenes.find((s) => s.id === sceneId);
  const miniScenes = scene?.miniScenes || [];

  const handleAddMiniScene = () => {
    const newMiniScene: MiniScene = {
      id: uuidv4(),
      name: `Mini-Scene ${miniScenes.length + 1}`,
      duration: 5,
      camera: {
        id: uuidv4(),
        name: 'Camera',
        position: { x: 0, y: 0 },
        zoom: 1,
      },
      visibleLayerIds: scene?.layers.map(l => l.id) || [],
      transitionIn: {
        type: TransitionType.FADE,
        duration: 0.5,
        easing: TransitionEasing.EASE_IN_OUT,
      },
      transitionOut: {
        type: TransitionType.FADE,
        duration: 0.5,
        easing: TransitionEasing.EASE_IN_OUT,
      },
      order: miniScenes.length,
    };
    addMiniScene(sceneId, newMiniScene);
    setSelectedMiniSceneId(newMiniScene.id);
  };

  const handleDeleteMiniScene = (miniSceneId: string) => {
    deleteMiniScene(sceneId, miniSceneId);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...miniScenes];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    reorderMiniScenes(sceneId, newOrder.map(ms => ms.id));
  };

  const handleMoveDown = (index: number) => {
    if (index === miniScenes.length - 1) return;
    const newOrder = [...miniScenes];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    reorderMiniScenes(sceneId, newOrder.map(ms => ms.id));
  };

  const handleNameChange = (miniScene: MiniScene, newName: string) => {
    updateMiniScene(sceneId, { ...miniScene, name: newName });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Mini-Scenes</h2>
        </div>
        <Button
          size="small"
          onClick={handleAddMiniScene}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Mini-scenes list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {miniScenes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No mini-scenes yet</p>
            <p className="text-xs mt-1">Click "Add" to create your first mini-scene</p>
          </div>
        ) : (
          miniScenes.map((miniScene, index) => (
            <Card
              key={miniScene.id}
              className={`p-3 cursor-pointer transition-all border-2 ${
                selectedMiniSceneId === miniScene.id
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
              onClick={() => setSelectedMiniSceneId(miniScene.id)}
            >
              <div className="flex items-start gap-3">
                {/* Order number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name */}
                  <input
                    type="text"
                    value={miniScene.name}
                    onChange={(e) => handleNameChange(miniScene, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-transparent text-white font-medium mb-2 border-b border-transparent hover:border-gray-600 focus:border-purple-500 outline-none px-1 -mx-1"
                  />

                  {/* Info */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(miniScene.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>{miniScene.camera.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="w-3 h-3" />
                      <span>
                        {miniScene.transitionIn.type} → {miniScene.transitionOut.type}
                      </span>
                    </div>
                  </div>

                  {/* Layers indicator */}
                  <div className="mt-2 text-xs text-gray-500">
                    {miniScene.visibleLayerIds.length} layer(s) visible
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveUp(index);
                    }}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveDown(index);
                    }}
                    disabled={index === miniScenes.length - 1}
                    className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMiniScene(miniScene.id);
                    }}
                    className="p-1 rounded hover:bg-red-900/50 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Timeline summary */}
      {miniScenes.length > 0 && (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="text-xs text-gray-400 mb-2">Timeline</div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-700">
            {miniScenes.map((ms, index) => (
              <div
                key={ms.id}
                className={`transition-all ${
                  selectedMiniSceneId === ms.id ? 'bg-purple-500' : 'bg-purple-700'
                }`}
                style={{ flex: ms.duration }}
                title={`${ms.name} (${formatTime(ms.duration)})`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Total: {formatTime(miniScenes.reduce((sum, ms) => sum + ms.duration, 0))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniScenePanel;
