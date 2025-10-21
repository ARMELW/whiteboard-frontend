import { useCallback } from 'react';
import { Scene } from '../scenes';
import scenesService from '../scenes/api/scenesService';
import { useSceneStore } from '../scenes/store';

export function useImportConfig() {
  const loadScenes = useSceneStore((state) => state.loadScenes);
  
  // Importe une configuration JSON de scènes
  const handleImportConfig = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        if (config.scenes && Array.isArray(config.scenes)) {
          await scenesService.bulkUpdate(config.scenes);
          await loadScenes();
        } else {
          alert('Format de fichier invalide. Le fichier doit contenir un tableau "scenes".');
        }
      } catch (error: any) {
        alert('Erreur lors de la lecture du fichier JSON: ' + error.message);
      }
    };
    reader.readAsText(file);
  }, [loadScenes]);

  return { handleImportConfig };
}
