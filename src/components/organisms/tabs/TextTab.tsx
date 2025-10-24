import React from 'react';
import { Button } from '../../atoms';
import { Plus, Type } from 'lucide-react';
import { useCurrentScene, useSceneStore } from '@/app/scenes';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import { useLayerCreation } from '../../molecules/layer-management';

const TextTab: React.FC = () => {
  const scene = useCurrentScene();
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  const { addLayer } = useScenesActionsWithHistory();
  const { createTextLayer } = useLayerCreation({
    sceneWidth: 1920,
    sceneHeight: 1080,
    selectedCamera: null
  });

  const handleAddText = async () => {
    if (!scene?.id) return;
    try {
      const newTextLayer = createTextLayer(scene.layers?.length || 0);
      await addLayer({ sceneId: scene.id, layer: newTextLayer as any });
      setSelectedLayerId(newTextLayer.id);
    } catch (error) {
      console.error('Error adding text layer:', error);
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">Text Tools</h3>
        <Button
          onClick={handleAddText}
          size="sm"
          className="gap-1"
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground mb-3">
          Add and format text layers for your scene
        </p>
        <Button
          onClick={handleAddText}
          variant="outline"
          className="w-full gap-2"
          size="sm"
        >
          <Type className="w-4 h-4" />
          Add Text Layer
        </Button>
      </div>
    </div>
  );
};

export default TextTab;
