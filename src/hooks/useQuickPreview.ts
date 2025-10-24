import { useState, useCallback } from 'react';
import { useSceneStore } from '@/app/scenes';
import { createQuickPreview } from '@/utils/quickPreview';
import { toast } from 'sonner';

/**
 * Hook for quick preview generation
 * Provides instant preview without backend processing
 */
export function useQuickPreview() {
  const scenes = useSceneStore((state) => state.scenes);
  const startPreview = useSceneStore((state) => state.startPreview);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate and show quick preview
   */
  const generatePreview = useCallback(async () => {
    if (scenes.length === 0) {
      toast.error('Aucune scène à prévisualiser');
      setError('Aucune scène à prévisualiser');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate quick preview video
      const videoUrl = await createQuickPreview(scenes, {
        width: 1920,
        height: 1080,
        fps: 30,
        sceneDuration: 3
      });

      // Start preview mode with the generated video
      startPreview(videoUrl, 'full');
      
      toast.success('Prévisualisation prête!');
    } catch (err: any) {
      console.error('Preview generation error:', err);
      const errorMessage = err.message || 'Échec de la génération de la prévisualisation';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [scenes, startPreview]);

  return {
    generatePreview,
    isGenerating,
    error
  };
}
