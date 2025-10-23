import { useState, useCallback, useEffect } from 'react';
import { videoGenerationService, VideoGenerationJob } from '@/services/api/videoGenerationService';
import { useSceneStore } from '@/app/scenes';

export function useVideoGeneration() {
  const scenes = useSceneStore((state) => state.scenes);
  const [currentJob, setCurrentJob] = useState<VideoGenerationJob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = useCallback(
    async (audioFile?: File) => {
      if (scenes.length === 0) {
        setError('No scenes to export');
        return;
      }

      setIsGenerating(true);
      setError(null);
      setCurrentJob(null);

      try {
        const request = {
          scenes: scenes,
          audio: audioFile
            ? {
                file: audioFile,
                fileName: audioFile.name,
              }
            : undefined,
          config: {
            format: 'mp4',
            quality: 'hd',
            fps: 30,
          },
        };

        const jobId = await videoGenerationService.generateVideo(request);

        // Poll for job status
        const pollInterval = setInterval(async () => {
          const job = await videoGenerationService.getJobStatus(jobId);
          if (job) {
            setCurrentJob(job);

            if (job.status === 'completed' || job.status === 'error') {
              clearInterval(pollInterval);
              setIsGenerating(false);

              if (job.status === 'error') {
                setError(job.error || 'Video generation failed');
              }
            }
          }
        }, 1000);
      } catch (err: any) {
        setError(err.message || 'Failed to start video generation');
        setIsGenerating(false);
      }
    },
    [scenes]
  );

  const downloadVideo = useCallback(async () => {
    if (!currentJob || !currentJob.videoUrl) {
      setError('No video available for download');
      return;
    }

    try {
      // Download the video
      const link = document.createElement('a');
      link.href = currentJob.videoUrl;
      link.download = `whiteboard-video-${currentJob.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError('Failed to download video');
    }
  }, [currentJob]);

  const reset = useCallback(() => {
    setCurrentJob(null);
    setIsGenerating(false);
    setError(null);
  }, []);

  return {
    generateVideo,
    downloadVideo,
    reset,
    currentJob,
    isGenerating,
    error,
    progress: currentJob?.progress || 0,
  };
}
