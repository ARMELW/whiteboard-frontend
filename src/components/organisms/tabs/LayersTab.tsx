import React, { useRef, useCallback } from 'react';
import { Button } from '../../atoms';
import { Upload, Plus } from 'lucide-react';
import { useCurrentScene, useSceneStore } from '@/app/scenes';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import { LayersListPanel } from '../../molecules/properties';
import { useLayerCreation } from '../../molecules/layer-management';

const LayersTab: React.FC = () => {
  const scene = useCurrentScene();
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { deleteLayer, moveLayer, duplicateLayer, addLayer } = useScenesActionsWithHistory();
  const { createTextLayer, createImageLayer } = useLayerCreation({
    sceneWidth: 1920,
    sceneHeight: 1080,
    selectedCamera: null
  });

  const handleAddText = useCallback(async () => {
    if (!scene?.id) return;
    try {
      const newTextLayer = createTextLayer(scene.layers?.length || 0);
      await addLayer({ sceneId: scene.id, layer: newTextLayer as any });
      setSelectedLayerId(newTextLayer.id);
    } catch (error) {
      console.error('Error adding text layer:', error);
    }
  }, [scene?.id, scene?.layers?.length, createTextLayer, addLayer, setSelectedLayerId]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !scene?.id) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }
    // ...image upload logic (can be refactored in a utility)
    e.target.value = '';
  }, [scene?.id]);

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3 py-2 border-b border-gray-200">
        <h3 className="text-md font-bold">Layers</h3>
      </div>
      {scene && scene.layers && scene.layers.length > 0 ? (
        <LayersListPanel
          layers={scene.layers || []}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onMoveLayer={(layerId, direction) => {
            if (!scene.id) return;
            moveLayer({ sceneId: scene.id, layerId, direction });
          }}
          onDuplicateLayer={(layerId) => {
            if (!scene.id) return;
            duplicateLayer({ sceneId: scene.id, layerId });
          }}
          onDeleteLayer={(layerId: string) => {
            if (!scene.id) return;
            deleteLayer({ sceneId: scene.id, layerId });
          }}
        />
      ) : (
        <p className="text-xs text-muted-foreground text-center py-8">
          No layers in this scene. Add images or text to get started.
        </p>
      )}
    </div>
  );
};

export default React.memo(LayersTab);
