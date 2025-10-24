/**
 * useTextLibrary Hook
 * Provides access to text library state
 */

import { useEffect } from 'react';
import { useTextLibraryStore } from '../store';

export const useTextLibrary = () => {
  const items = useTextLibraryStore((state) => state.items);
  const isLoading = useTextLibraryStore((state) => state.isLoading);
  const error = useTextLibraryStore((state) => state.error);
  const loadItems = useTextLibraryStore((state) => state.loadItems);

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    isLoading,
    error,
    refresh: loadItems,
  };
};
