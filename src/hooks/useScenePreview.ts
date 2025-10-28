/**
 * Hook for managing scene preview
 */

import { useState, useCallback } from 'react';
import { previewService } from '@/services/api/previewService';
import { Scene } from '@/app/scenes/types';
import { useSceneStore } from '@/app/scenes/store';
import { toast } from 'sonner';

export interface UseScenePreviewOptions {
  onSuccess?: (videoUrl: string) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export const useScenePreview = (options?: UseScenePreviewOptions) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const { startPreview, setPreviewLoading } = useSceneStore();

  const generatePreview = useCallback(async (scene: Scene) => {
    setIsGenerating(true);
    setProgress(0);
    setPreviewLoading(true);

    try {
      // Start preview generation
      const id = await previewService.previewScene(scene);
      setPreviewId(id);

      // Poll for completion
      const videoUrl = await previewService.pollPreviewStatus(
        id,
        (p) => {
          setProgress(p);
          options?.onProgress?.(p);
        }
      );

      // Success - start preview player
      startPreview(videoUrl, 'scene');
      options?.onSuccess?.(videoUrl);
      toast.success('Prévisualisation générée avec succès');
    } catch (error) {
      console.error('Error generating scene preview:', error);
      options?.onError?.(error as Error);
      toast.error('Erreur lors de la génération de la prévisualisation');
    } finally {
      setIsGenerating(false);
      setPreviewLoading(false);
      setPreviewId(null);
    }
  }, [startPreview, setPreviewLoading, options]);

  const cancelPreview = useCallback(async () => {
    if (previewId) {
      try {
        await previewService.cancelPreview(previewId);
        setIsGenerating(false);
        setPreviewLoading(false);
        setPreviewId(null);
        toast.info('Prévisualisation annulée');
      } catch (error) {
        console.error('Error canceling preview:', error);
      }
    }
  }, [previewId, setPreviewLoading]);

  return {
    generatePreview,
    cancelPreview,
    isGenerating,
    progress,
  };
};
