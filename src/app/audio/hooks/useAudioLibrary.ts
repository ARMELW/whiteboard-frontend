/**
 * Audio Library Hook
 * Manages audio file library operations
 */

import { useQuery } from '@tanstack/react-query';
import { audioKeys } from '../config';
import { audioMockService } from '../api/audioMockService';
import { useAudioLibraryStore } from '../store';

export const useAudioLibrary = () => {
  const setFiles = useAudioLibraryStore((state) => state.setFiles);
  
  const query = useQuery({
    queryKey: audioKeys.lists(),
    queryFn: async () => {
      const files = await audioMockService.listAudioFiles();
      setFiles(files);
      return files;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    files: useAudioLibraryStore((state) => state.files),
  };
};
