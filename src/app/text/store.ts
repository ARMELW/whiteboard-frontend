/**
 * Text Library Store
 * Global state management for text items
 */

import { create } from 'zustand';
import { TextLibraryItem } from './types';
import { textMockService } from './api/textMockService';

interface TextLibraryState {
  items: TextLibraryItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items: TextLibraryItem[]) => void;
  addItem: (item: TextLibraryItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<TextLibraryItem>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  loadItems: () => Promise<void>;
}

export const useTextLibraryStore = create<TextLibraryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  
  setItems: (items) => set({ items }),
  
  addItem: (item) => set((state) => ({
    items: [item, ...state.items]
  })),
  
  removeItem: (id) => {
    textMockService.deleteText(id).catch(console.error);
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }));
  },
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await textMockService.listTexts();
      set({ items, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load text library',
        isLoading: false 
      });
    }
  },
}));
