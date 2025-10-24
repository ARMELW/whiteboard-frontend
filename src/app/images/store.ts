/**
 * Image Library Store
 * Global state management for image files
 */

import { create } from 'zustand';
import { ImageFile } from './types';
import { imageMockService } from './api/imageMockService';

interface ImageLibraryState {
  files: ImageFile[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  
  // Actions
  setFiles: (files: ImageFile[]) => void;
  addFile: (file: ImageFile) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<ImageFile>) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  cleanup: () => void;
}

export const useImageLibraryStore = create<ImageLibraryState>((set, get) => ({
  files: [],
  isUploading: false,
  uploadProgress: 0,
  error: null,
  
  setFiles: (files) => set({ files }),
  
  addFile: (file) => set((state) => ({
    files: [...state.files, file]
  })),
  
  removeFile: (id) => {
    const file = get().files.find(f => f.id === id);
    if (file) {
      imageMockService.deleteImageFile(id);
    }
    set((state) => ({
      files: state.files.filter(f => f.id !== id)
    }));
  },
  
  updateFile: (id, updates) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, ...updates } : f)
  })),
  
  setUploading: (isUploading) => set({ isUploading }),
  
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  
  setError: (error) => set({ error }),
  
  cleanup: () => {
    imageMockService.cleanup();
    set({
      files: [],
      isUploading: false,
      uploadProgress: 0,
      error: null,
    });
  },
}));
