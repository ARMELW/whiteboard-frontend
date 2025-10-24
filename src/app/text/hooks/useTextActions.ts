/**
 * useTextActions Hook
 * Provides mutation functions for text library operations
 */

import { useState, useCallback } from 'react';
import { textMockService } from '../api/textMockService';
import { useTextLibraryStore } from '../store';
import { CreateTextPayload, UpdateTextPayload, TextLibraryItem } from '../types';

export const useTextActions = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const addItem = useTextLibraryStore((state) => state.addItem);
  const updateItem = useTextLibraryStore((state) => state.updateItem);
  const removeItem = useTextLibraryStore((state) => state.removeItem);

  const create = useCallback(async (payload: CreateTextPayload): Promise<TextLibraryItem> => {
    setIsCreating(true);
    try {
      const item = await textMockService.createText(payload);
      addItem(item);
      return item;
    } finally {
      setIsCreating(false);
    }
  }, [addItem]);

  const update = useCallback(async (payload: UpdateTextPayload): Promise<TextLibraryItem> => {
    setIsUpdating(true);
    try {
      const item = await textMockService.updateText(payload);
      updateItem(payload.id, item);
      return item;
    } finally {
      setIsUpdating(false);
    }
  }, [updateItem]);

  const deleteText = useCallback(async (id: string): Promise<void> => {
    setIsDeleting(true);
    try {
      await textMockService.deleteText(id);
      removeItem(id);
    } finally {
      setIsDeleting(false);
    }
  }, [removeItem]);

  const duplicate = useCallback(async (id: string): Promise<TextLibraryItem> => {
    setIsDuplicating(true);
    try {
      const item = await textMockService.duplicateText(id);
      addItem(item);
      return item;
    } finally {
      setIsDuplicating(false);
    }
  }, [addItem]);

  const updateUsageCount = useCallback((id: string, count: number) => {
    textMockService.updateUsageCount(id, count);
    updateItem(id, { usageCount: count });
  }, [updateItem]);

  return {
    create,
    update,
    deleteText,
    duplicate,
    updateUsageCount,
    isCreating,
    isUpdating,
    isDeleting,
    isDuplicating,
  };
};
