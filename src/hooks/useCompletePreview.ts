/**
 * Hook for managing complete video preview (all scenes)
 */

import { useState, useCallback } from 'react';
import { previewService } from '@/services/api/previewService';
import { Scene } from '@/app/scenes/types';
import { useSceneStore } from '@/app/scenes/store';
import { toast } from 'sonner';

export interface UseCompletePreviewOptions {
  onSuccess?: (videoUrl: string) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
  width?: number;
  height?: number;
  fps?: number;
}

export const useCompletePreview = (options?: UseCompletePreviewOptions) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const { startPreview, setPreviewLoading } = useSceneStore();

  const generatePreview = useCallback(async (projectId: string, scenes: Scene[]) => {
    if (!scenes || scenes.length === 0) {
      toast.error('Aucune scène à prévisualiser');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setPreviewLoading(true);

    try {
      // Start preview generation
      const id = await previewService.previewComplete(projectId, scenes, {
        width: options?.width,
        height: options?.height,
        fps: options?.fps,
      });
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
      startPreview(videoUrl, 'full');
      options?.onSuccess?.(videoUrl);
      toast.success('Prévisualisation complète générée avec succès');
    } catch (error) {
      console.error('Error generating complete preview:', error);
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
