import { useCallback } from 'react';
import assetsService, { Asset, UploadAssetData, AssetStats } from '../api/assetsService';

export const useAssetsActions = () => {
  const uploadAsset = useCallback(async (file: File, options?: UploadAssetData): Promise<Asset> => {
    return assetsService.upload(file, options);
  }, []);

  const updateAsset = useCallback(async (id: string, data: Partial<Asset>): Promise<Asset> => {
    return assetsService.update(id, data);
  }, []);

  const deleteAsset = useCallback(async (id: string): Promise<void> => {
    await assetsService.delete(id);
  }, []);

  const getAssetStats = useCallback(async (): Promise<AssetStats> => {
    return assetsService.getStats();
  }, []);

  return {
    uploadAsset,
    updateAsset,
    deleteAsset,
    getAssetStats,
  };
};
