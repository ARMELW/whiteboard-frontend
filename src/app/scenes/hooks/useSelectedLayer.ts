import { useSceneStore } from '../store';
import { useCurrentScene } from './useCurrentScene';

/**
 * Hook to get and set the selected layer ID for the current scene
 * @returns Object with selectedLayerId and setSelectedLayerId for the current scene
 */
export const useSelectedLayer = () => {
  const scene = useCurrentScene();
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  const getSelectedLayerId = useSceneStore((state) => state.getSelectedLayerId);

  const selectedLayerId = scene?.id ? getSelectedLayerId(scene.id) : null;

  const setSelectedLayerForCurrentScene = (layerId: string | null) => {
    if (scene?.id) {
      setSelectedLayerId(scene.id, layerId);
    }
  };

  return {
    selectedLayerId,
    setSelectedLayerId: setSelectedLayerForCurrentScene,
  };
};
