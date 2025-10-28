import BaseService from '@/services/api/baseService';
import httpClient from '@/services/api/httpClient';
import API_ENDPOINTS from '@/config/api';
import { STORAGE_KEYS } from '@/config/constants';

export interface Asset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  tags?: string[];
  category?: string;
  uploadedAt?: string;
  userId?: string;
  dataUrl?: string;
  dimensions?: { width: number; height: number } | null;
}

export interface UploadAssetData {
  name?: string;
  type?: string;
  dataUrl?: string;
  size?: number;
  dimensions?: { width: number; height: number } | null;
  category?: 'illustration' | 'icon' | 'background' | 'other';
  tags?: string[];
}

export interface AssetStats {
  totalAssets: number;
  totalSize: number;
  byCategory: Record<string, number>;
}

class AssetsService extends BaseService<Asset> {
  constructor() {
    super(STORAGE_KEYS.ASSETS, API_ENDPOINTS.assets);
  }

  async upload(file: File, options?: UploadAssetData): Promise<Asset>;
  async upload(assetData: UploadAssetData): Promise<Asset>;
  async upload(fileOrData: File | UploadAssetData, options?: UploadAssetData): Promise<Asset> {
    // Handle File upload
    if (fileOrData instanceof File) {
      const file = fileOrData;
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        if (options?.name) {
          formData.append('name', options.name);
        }
        
        if (options?.category) {
          formData.append('category', options.category);
        }
        
        if (options?.tags) {
          formData.append('tags', JSON.stringify(options.tags));
        }

        const response = await httpClient.post<{ success: boolean; data: Asset }>(
          API_ENDPOINTS.assets.upload,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        return response.data.data;
      } catch (error) {
        console.warn('Failed to upload asset to API, falling back to localStorage', error);
        return this.createLocalAsset(fileOrData, options);
      }
    }

    // Handle legacy data object upload (backward compatibility)
    const assetData = fileOrData;
    const asset: Partial<Asset> = {
      id: `asset-${Date.now()}`,
      name: assetData.name || 'Unnamed Asset',
      type: assetData.type || 'image',
      dataUrl: assetData.dataUrl,
      size: assetData.size || 0,
  dimensions: assetData.dimensions || null,
      tags: assetData.tags || [],
      category: assetData.category,
      uploadedAt: new Date().toISOString(),
    };

    return super.create(asset);
  }

  private async createLocalAsset(file: File, options?: UploadAssetData): Promise<Asset> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        
        const asset: Partial<Asset> = {
          id: `asset-${Date.now()}`,
          name: options?.name || file.name,
          type: file.type,
          dataUrl,
          url: dataUrl,
          size: file.size,
          tags: options?.tags || [],
          category: options?.category,
          uploadedAt: new Date().toISOString(),
        };

        try {
          const created = await super.create(asset);
          resolve(created);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  async getByType(type: string): Promise<Asset[]> {
    await this.delay();
    const result = await this.list({ page: 1, limit: 1000 });
    return result.data.filter((asset) => asset.type === type);
  }

  async search(query: string): Promise<Asset[]> {
    await this.delay();
    const result = await this.list({ page: 1, limit: 1000 });
    return result.data.filter((asset) =>
      asset.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getStats(): Promise<AssetStats> {
    try {
      const response = await httpClient.get<{ success: boolean; data: AssetStats }>(
        API_ENDPOINTS.assets.stats
      );
      return response.data.data;
    } catch (error) {
      console.warn('Failed to fetch asset stats from API, calculating from localStorage', error);
      const result = await this.list({ page: 1, limit: 10000 });
      const assets = result.data;

      const byCategory: Record<string, number> = {};
      let totalSize = 0;

      assets.forEach((asset) => {
        if (asset.category) {
          byCategory[asset.category] = (byCategory[asset.category] || 0) + 1;
        }
        totalSize += asset.size || 0;
      });

      return {
        totalAssets: assets.length,
        totalSize,
        byCategory,
      };
    }
  }
}

export default new AssetsService();
