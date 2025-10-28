import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import assetsService, { Asset, UploadAssetData, AssetStats } from '../api/assetsService';
import { assetsKeys } from '../config';
import { toast } from 'sonner';

export const useAssetsActions = () => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options?: UploadAssetData }) =>
      assetsService.upload(file, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetsKeys.lists() });
      toast.success('Asset uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading asset:', error);
      toast.error('Failed to upload asset');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Asset> }) =>
      assetsService.update(id, data),
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: assetsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assetsKeys.detail(asset.id) });
      toast.success('Asset updated successfully');
    },
    onError: (error) => {
      console.error('Error updating asset:', error);
      toast.error('Failed to update asset');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: assetsKeys.lists() });
      queryClient.removeQueries({ queryKey: assetsKeys.detail(id) });
      toast.success('Asset deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    },
  });

  const statsQuery = useQuery({
    queryKey: [...assetsKeys.all, 'stats'],
    queryFn: () => assetsService.getStats(),
    staleTime: 30000, // 30 seconds
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: assetsKeys.lists(),
      refetchType: 'all',
    });
  };

  return {
    uploadAsset: async (file: File, options?: UploadAssetData): Promise<Asset> => {
      return await uploadMutation.mutateAsync({ file, options });
    },
    updateAsset: async (id: string, data: Partial<Asset>): Promise<Asset> => {
      return await updateMutation.mutateAsync({ id, data });
    },
    deleteAsset: async (id: string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
    },
    getAssetStats: (): AssetStats | undefined => statsQuery.data,
    isUploading: uploadMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    invalidate,
  };
};
