import { useCallback } from 'react';
import { Scene } from '../scenes';
import { useSceneStore } from '../scenes/store';

interface UseSceneActionsProps {
  scenes: Scene[];
  setSelectedSceneIndex: (index: number) => void;
}

export function useSceneActions({
  scenes,
  setSelectedSceneIndex,
}: UseSceneActionsProps) {
  const createScene = useSceneStore((state) => state.createScene);
  const updateScene = useSceneStore((state) => state.updateScene);
  const deleteScene = useSceneStore((state) => state.deleteScene);
  const duplicateScene = useSceneStore((state) => state.duplicateScene);
  const reorderScenes = useSceneStore((state) => state.reorderScenes);

  // Ajout d'une scène
  const addScene = useCallback(async () => {
    try {
      await createScene({ duration: 10, layers: [], sceneCameras: [] });
    } catch (error: any) {
      alert('Erreur lors de la création de la scène: ' + error.message);
    }
  }, [createScene]);

  // Suppression d'une scène
  const deleteSceneAction = useCallback(async (index: number) => {
    const sceneId = scenes[index]?.id;
    if (!sceneId) return;
    try {
      await deleteScene(sceneId);
    } catch (error: any) {
      alert(error.message);
    }
  }, [deleteScene, scenes]);

  // Duplication d'une scène
  const duplicateSceneAction = useCallback(async (index: number) => {
    const sceneId = scenes[index]?.id;
    if (!sceneId) return;
    try {
      await duplicateScene(sceneId);
    } catch (error: any) {
      alert('Erreur lors de la duplication: ' + error.message);
    }
  }, [duplicateScene, scenes]);

  // Mise à jour d'une scène
  const updateSceneAction = useCallback(async (index: number, updatedScene: Partial<Scene>) => {
    const sceneId = scenes[index]?.id;
    if (!sceneId) return;
    try {
      await updateScene(sceneId, updatedScene);
    } catch (error) {
      console.error('Error updating scene:', error);
    }
  }, [updateScene, scenes]);

  // Déplacement d'une scène
  const moveScene = useCallback(async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === scenes.length - 1)) {
      return;
    }
    const newScenes = [...scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newScenes[index], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[index]];
    const sceneIds = newScenes.map((scene) => scene.id);
    try {
      await reorderScenes(sceneIds);
      setSelectedSceneIndex(targetIndex);
    } catch (error) {
      console.error('Error reordering scenes:', error);
    }
  }, [reorderScenes, scenes, setSelectedSceneIndex]);

  return {
    addScene,
    deleteScene: deleteSceneAction,
    duplicateScene: duplicateSceneAction,
    updateScene: updateSceneAction,
    moveScene,
  };
}
