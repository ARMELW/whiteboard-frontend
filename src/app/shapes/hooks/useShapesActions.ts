import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import shapesService, { 
  ShapeAsset, 
  UploadShapeData, 
  UpdateShapeData,
  ShapeStats 
} from '../api/shapesService';
import { shapesKeys } from '../config';
import { toast } from 'sonner';

export const useShapesActions = () => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata?: UploadShapeData }) =>
      shapesService.upload(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shapesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...shapesKeys.all, 'stats'] });
      toast.success('Shape uploaded successfully');
    },
    onError: (error: any) => {
      console.error('Error uploading shape:', error);
      const errorMessage = error.response?.data?.error || 'Failed to upload shape';
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateShapeData }) =>
      shapesService.update(id, updates),
    onSuccess: (shape) => {
      queryClient.invalidateQueries({ queryKey: shapesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shapesKeys.detail(shape.id) });
      queryClient.invalidateQueries({ queryKey: [...shapesKeys.all, 'stats'] });
      toast.success('Shape updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating shape:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update shape';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => shapesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: shapesKeys.lists() });
      queryClient.removeQueries({ queryKey: shapesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: [...shapesKeys.all, 'stats'] });
      toast.success('Shape deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting shape:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete shape';
      toast.error(errorMessage);
    },
  });

  const statsQuery = useQuery({
    queryKey: [...shapesKeys.all, 'stats'],
    queryFn: () => shapesService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: shapesKeys.lists(),
      refetchType: 'all',
    });
  };

  return {
    uploadShape: async (file: File, metadata?: UploadShapeData): Promise<ShapeAsset> => {
      return await uploadMutation.mutateAsync({ file, metadata });
    },
    updateShape: async (id: string, updates: UpdateShapeData): Promise<ShapeAsset> => {
      return await updateMutation.mutateAsync({ id, updates });
    },
    deleteShape: async (id: string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
    },
    getShapeStats: (): ShapeStats | undefined => statsQuery.data,
    isUploading: uploadMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isLoadingStats: statsQuery.isLoading,
    invalidate,
  };
};
