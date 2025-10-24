/**
 * useImageLibrary Hook
 * Provides access to image library state
 */

import { useImageLibraryStore } from '../store';

export const useImageLibrary = () => {
  const files = useImageLibraryStore((state) => state.files);
  const isUploading = useImageLibraryStore((state) => state.isUploading);
  const uploadProgress = useImageLibraryStore((state) => state.uploadProgress);
  const error = useImageLibraryStore((state) => state.error);

  return {
    files,
    isUploading,
    uploadProgress,
    error,
  };
};
