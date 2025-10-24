/**
 * Audio Library Store
 * Global state management for audio files
 */

import { create } from 'zustand';
import { AudioFile } from './types';
import { audioMockService } from './api/audioMockService';

interface AudioLibraryState {
  files: AudioFile[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  currentlyPlaying: string | null;
  
  // Actions
  setFiles: (files: AudioFile[]) => void;
  addFile: (file: AudioFile) => void;
  removeFile: (id: string) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setCurrentlyPlaying: (id: string | null) => void;
  cleanup: () => void;
}

export const useAudioLibraryStore = create<AudioLibraryState>((set, get) => ({
  files: [],
  isUploading: false,
  uploadProgress: 0,
  error: null,
  currentlyPlaying: null,
  
  setFiles: (files) => set({ files }),
  
  addFile: (file) => set((state) => ({
    files: [...state.files, file]
  })),
  
  removeFile: (id) => {
    const file = get().files.find(f => f.id === id);
    if (file) {
      audioMockService.deleteAudioFile(id);
    }
    set((state) => ({
      files: state.files.filter(f => f.id !== id),
      currentlyPlaying: state.currentlyPlaying === id ? null : state.currentlyPlaying
    }));
  },
  
  setUploading: (isUploading) => set({ isUploading }),
  
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  
  setError: (error) => set({ error }),
  
  setCurrentlyPlaying: (id) => set({ currentlyPlaying: id }),
  
  cleanup: () => {
    audioMockService.cleanup();
    set({
      files: [],
      isUploading: false,
      uploadProgress: 0,
      error: null,
      currentlyPlaying: null,
    });
  },
}));
