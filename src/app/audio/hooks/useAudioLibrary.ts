/**
 * Audio Library Hook
 * Manages audio file library operations with filtering
 */

import { useQuery } from '@tanstack/react-query';
import { audioKeys } from '../config';
import { audioMockService } from '../api/audioMockService';
import { useAudioLibraryStore } from '../store';
import { AudioFilter } from '../types';

export const useAudioLibrary = (filter?: AudioFilter) => {
  const setFiles = useAudioLibraryStore((state) => state.setFiles);
  
  const query = useQuery({
    queryKey: filter ? [...audioKeys.lists(), filter] : audioKeys.lists(),
    queryFn: async () => {
      const files = await audioMockService.listAudioFiles(filter);
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
