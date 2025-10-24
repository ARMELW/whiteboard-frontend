import { useCallback } from 'react';
import { useWizardStore } from '../store';
import { WizardStep } from '../types';
import { generateFullProject } from '../api/mockAiService';
import { useScenesActionsWithHistory } from '../../hooks/useScenesActionsWithHistory';
import { toast } from 'sonner';

export const useWizard = () => {
  const store = useWizardStore();
  const { createScene } = useScenesActionsWithHistory();

  const startGeneration = useCallback(async () => {
    const { prompt, configuration } = store;

    if (!prompt.trim()) {
      toast.error('Veuillez entrer un prompt');
      return;
    }

    store.setIsGenerating(true);
    store.setError(null);
    store.setCurrentStep(WizardStep.GENERATION);

    try {
      const result = await generateFullProject(
        prompt,
        configuration,
        (step, progress) => {
          // Could update a progress indicator here
          console.log(`${step} - ${progress}%`);
        }
      );

      store.setGeneratedScript(result.script);
      store.setGeneratedAssets(result.assets);
      store.setGeneratedScenes(result.scenes);
      store.setIsGenerating(false);
      store.setCurrentStep(WizardStep.REVIEW);

      toast.success('Projet généré avec succès!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      store.setError(errorMessage);
      store.setIsGenerating(false);
      toast.error(errorMessage);
    }
  }, [store]);

  const applyGeneratedScenes = useCallback(async () => {
    const { generatedScenes } = store;

    if (generatedScenes.length === 0) {
      toast.error('Aucune scène à appliquer');
      return;
    }

    try {
      // Create all scenes
      for (const scene of generatedScenes) {
        await createScene(scene);
      }

      toast.success(`${generatedScenes.length} scène(s) créée(s) avec succès!`);
      store.closeWizard();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création des scènes';
      toast.error(errorMessage);
    }
  }, [store, createScene]);

  return {
    ...store,
    startGeneration,
    applyGeneratedScenes,
  };
};
