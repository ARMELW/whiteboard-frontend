/**
 * Audio Actions Hook
 * Handles audio file upload, deletion and management
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { audioKeys } from '../config';
import { audioMockService } from '../api/audioMockService';
import { useAudioLibraryStore } from '../store';
import { AudioUploadOptions } from '../types';

export const useAudioActions = () => {
  const queryClient = useQueryClient();
  const { addFile, removeFile, setUploading, setUploadProgress, setError } = useAudioLibraryStore();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, options }: { file: File; options?: AudioUploadOptions }) => {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      
      try {
        const audioFile = await audioMockService.uploadAudio(file, options);
        setUploadProgress(100);
        return audioFile;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Upload failed');
        throw error;
      } finally {
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    },
    onSuccess: (audioFile) => {
      addFile(audioFile);
      queryClient.invalidateQueries({ queryKey: audioKeys.lists() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await audioMockService.deleteAudioFile(id);
      return id;
    },
    onSuccess: (id) => {
      removeFile(id);
      queryClient.invalidateQueries({ queryKey: audioKeys.lists() });
    },
  });

  const storeIsUploading = useAudioLibraryStore((state) => state.isUploading);
  const uploadProgress = useAudioLibraryStore((state) => state.uploadProgress);
  const error = useAudioLibraryStore((state) => state.error);

  return {
    upload: uploadMutation.mutate,
    uploadAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending || storeIsUploading,
    uploadProgress,
    
    deleteAudio: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    
    error,
  };
};
