import React from 'react';
import { TextLibrary } from '../TextLibrary';
import { useCurrentScene, useSceneStore } from '@/app/scenes';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import { useLayerCreation } from '../../molecules/layer-management';
import { TextLibraryItem } from '@/app/text';

const TextTab: React.FC = () => {
  const scene = useCurrentScene();
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  const { addLayer } = useScenesActionsWithHistory();
  const { createTextLayer } = useLayerCreation({
    sceneWidth: 1920,
    sceneHeight: 1080,
    selectedCamera: null
  });

  const handleAddTextToScene = async (textItem: TextLibraryItem) => {
    if (!scene?.id) return;
    
    try {
      // Create a text layer with the library item's style
      const newTextLayer = createTextLayer(scene.layers?.length || 0);
      
      // Apply the text library item's content and style
      newTextLayer.text_config = {
        text: textItem.content,
        font: textItem.style.fontFamily,
        size: textItem.style.fontSize,
        color: hexToRgb(textItem.style.color),
        style: getTextStyle(textItem.style),
        line_height: textItem.style.lineHeight,
        align: textItem.style.textAlign,
      };
      
      await addLayer({ sceneId: scene.id, layer: newTextLayer as any });
      setSelectedLayerId(newTextLayer.id);
    } catch (error) {
      console.error('Error adding text layer:', error);
    }
  };

  // Helper to convert hex color to RGB array
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  };

  // Helper to get text style string
  const getTextStyle = (style: TextLibraryItem['style']): string => {
    if (style.fontWeight === 'bold' && style.fontStyle === 'italic') return 'bold_italic';
    if (style.fontWeight === 'bold') return 'bold';
    if (style.fontStyle === 'italic') return 'italic';
    return 'normal';
  };

  return (
    <div className="p-3">
      <TextLibrary onAddToScene={handleAddTextToScene} />
    </div>
  );
};

export default TextTab;
