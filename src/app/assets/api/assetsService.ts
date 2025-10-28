import BaseService from '@/services/api/baseService';
import httpClient from '@/services/api/httpClient';
import API_ENDPOINTS from '@/config/api';

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
    super(API_ENDPOINTS.assets);
  }

  async upload(file: File, options?: UploadAssetData): Promise<Asset>;
  async upload(assetData: UploadAssetData): Promise<Asset>;
  async upload(fileOrData: File | UploadAssetData, options?: UploadAssetData): Promise<Asset> {
    // Handle File upload
    if (fileOrData instanceof File) {
      const file = fileOrData;
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

  async getStats(userId?: string): Promise<AssetStats> {
    try {
      // Build URL with optional userId query parameter
      let url = API_ENDPOINTS.assets.stats;
      
      // If userId is provided, add it as a query parameter
      // The backend expects this as 'id' parameter based on validation error
      if (userId) {
        url = `${url}?id=${userId}`;
      } else {
        // Try to get user ID from stored auth session
        try {
          const authServiceModule = await import('../../auth/api/authService');
          const session = authServiceModule.default.getStoredSession();
          if (session?.user?.id) {
            url = `${url}?id=${session.user.id}`;
          }
        } catch (err) {
          console.warn('[AssetsService] Could not retrieve user session for stats', err);
        }
      }
      
      const response = await httpClient.get<{ success: boolean; data: AssetStats }>(url);
      return response.data.data;
    } catch (error: any) {
      // If backend validation fails due to missing/invalid id, return empty stats
      if (error.response?.data?.error?.issues?.some((issue: any) => 
        issue.path?.includes('id') && (issue.code === 'invalid_string' || issue.validation === 'uuid')
      )) {
        console.warn('[AssetsService] Backend requires valid user UUID for stats:', error.response?.data?.error);
        // Return default/empty stats rather than failing
        return {
          totalAssets: 0,
          totalSize: 0,
          byCategory: {}
        };
      }
      throw error;
    }
  }
}

export default new AssetsService();
