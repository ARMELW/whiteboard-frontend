import React from 'react';
import { FontList } from '../FontList';
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

  const handleSelectFont = async (fontFamily: string) => {
    if (!scene?.id) return;
    
    try {
      // Create a text layer with the selected font
      const newTextLayer = createTextLayer(scene.layers?.length || 0);
      
      // Apply the selected font
      newTextLayer.text_config = {
        text: 'Votre texte ici',
        font: fontFamily,
        size: 48,
        color: [0, 0, 0],
        style: 'normal',
        line_height: 1.2,
        align: 'center',
      };
      
      await addLayer({ sceneId: scene.id, layer: newTextLayer as any });
      setSelectedLayerId(newTextLayer.id);
    } catch (error) {
      console.error('Error adding text layer:', error);
    }
  };

  return (
    <div className="p-3">
      <FontList onSelectFont={handleSelectFont} />
    </div>
  );
};

export default TextTab;
