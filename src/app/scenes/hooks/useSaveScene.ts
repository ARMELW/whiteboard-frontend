import { useState, useCallback } from 'react';
import { useSceneStore } from '../store';
import scenesService from '../api/scenesService';
import { toast } from 'sonner';

interface SaveStatus {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
}

/**
 * Hook pour gérer la sauvegarde des scènes vers le backend
 * Fournit des méthodes pour sauvegarder manuellement ou automatiquement
 */
export const useSaveScene = () => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    isSaving: false,
    lastSaved: null,
    error: null,
  });

  const scenes = useSceneStore((state) => state.scenes);

  /**
   * Sauvegarde toutes les scènes vers le backend
   */
  const saveAllScenes = useCallback(async () => {
    if (scenes.length === 0) {
      toast.warning('Aucune scène à sauvegarder');
      return false;
    }

    setSaveStatus(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      // Sauvegarder chaque scène
      console.log('[useSaveScene] Saving all scenes', scenes);
      const savePromises = scenes.map(scene => 
        scenesService.update(scene.id, scene)
      );

      await Promise.all(savePromises);

      setSaveStatus({
        isSaving: false,
        lastSaved: new Date(),
        error: null,
      });

      toast.success(`${scenes.length} scène(s) sauvegardée(s) avec succès`);
      return true;
    } catch (error) {
      const err = error as Error;
      setSaveStatus({
        isSaving: false,
        lastSaved: null,
        error: err,
      });

      toast.error(`Erreur lors de la sauvegarde: ${err.message}`);
      return false;
    }
  }, [scenes]);

  /**
   * Sauvegarde une scène spécifique par son ID
   */
  const saveScene = useCallback(async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    
    if (!scene) {
      toast.error('Scène non trouvée');
      return false;
    }

    setSaveStatus(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      await scenesService.update(scene.id, scene);

      setSaveStatus({
        isSaving: false,
        lastSaved: new Date(),
        error: null,
      });

      toast.success('Scène sauvegardée avec succès');
      return true;
    } catch (error) {
      const err = error as Error;
      setSaveStatus({
        isSaving: false,
        lastSaved: null,
        error: err,
      });

      toast.error(`Erreur lors de la sauvegarde: ${err.message}`);
      return false;
    }
  }, [scenes]);

  /**
   * Sauvegarde la scène actuellement sélectionnée
   */
  const saveCurrentScene = useCallback(async () => {
    const selectedIndex = useSceneStore.getState().selectedSceneIndex;
    const currentScene = scenes[selectedIndex];

    if (!currentScene) {
      toast.error('Aucune scène sélectionnée');
      return false;
    }

    return saveScene(currentScene.id);
  }, [scenes, saveScene]);

  /**
   * Synchronise toutes les données du store avec le backend
   */
  const syncToBackend = useCallback(async () => {
    if (scenes.length === 0) {
      return true;
    }

    setSaveStatus(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      // Utilise bulkUpdate si disponible, sinon sauvegarde individuelle
      await scenesService.bulkUpdate(scenes);

      setSaveStatus({
        isSaving: false,
        lastSaved: new Date(),
        error: null,
      });

      toast.success('Données synchronisées avec le backend');
      return true;
    } catch (error) {
      const err = error as Error;
      console.warn('Bulk update failed, trying individual saves', error);
      
      // Fallback: sauvegarde individuelle
      return saveAllScenes();
    }
  }, [scenes, saveAllScenes]);

  return {
    // Status
    isSaving: saveStatus.isSaving,
    lastSaved: saveStatus.lastSaved,
    error: saveStatus.error,
    hasUnsavedChanges: saveStatus.lastSaved === null && scenes.length > 0,

    // Actions
    saveAllScenes,
    saveScene,
    saveCurrentScene,
    syncToBackend,
  };
};
