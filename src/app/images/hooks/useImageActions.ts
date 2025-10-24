/**
 * useImageActions Hook
 * Provides actions for managing images in the library
 */

import { useCallback } from 'react';
import { useImageLibraryStore } from '../store';
import { imageMockService } from '../api/imageMockService';
import { ImageUploadOptions } from '../types';

interface UploadParams {
  file: File;
  options?: ImageUploadOptions;
}

export const useImageActions = () => {
  const {
    addFile,
    removeFile,
    updateFile,
    setUploading,
    setUploadProgress,
    setError,
  } = useImageLibraryStore();

  const upload = useCallback(
    async ({ file, options }: UploadParams) => {
      try {
        setError(null);
        setUploading(true);
        setUploadProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 50);

        const imageFile = await imageMockService.uploadImage(file, options);

        clearInterval(progressInterval);
        setUploadProgress(100);

        addFile(imageFile);

        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 300);

        return imageFile;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        setUploading(false);
        setUploadProgress(0);
        throw err;
      }
    },
    [addFile, setError, setUploading, setUploadProgress]
  );

  const deleteImage = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await imageMockService.deleteImageFile(id);
        removeFile(id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Delete failed';
        setError(errorMessage);
        throw err;
      }
    },
    [removeFile, setError]
  );

  const updateUsageCount = useCallback(
    (id: string, count: number) => {
      imageMockService.updateUsageCount(id, count);
      updateFile(id, { usageCount: count });
    },
    [updateFile]
  );

  return {
    upload,
    deleteImage,
    updateUsageCount,
    isUploading: useImageLibraryStore((state) => state.isUploading),
    uploadProgress: useImageLibraryStore((state) => state.uploadProgress),
    error: useImageLibraryStore((state) => state.error),
  };
};
