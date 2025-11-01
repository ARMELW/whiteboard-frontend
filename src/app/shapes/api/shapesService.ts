import BaseService from '@/services/api/baseService';
import httpClient from '@/services/api/httpClient';
import API_ENDPOINTS from '@/config/api';
import authService from '@/app/auth/api/authService';

export type ShapeType = 'svg' | 'path' | 'geometric';

export type ShapeCategory = 
  | 'basic' 
  | 'arrow' 
  | 'callout' 
  | 'banner' 
  | 'icon' 
  | 'decorative' 
  | 'other';

export interface ShapeData {
  svgContent?: string;
  pathData?: string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  isEditable?: boolean;
}

export interface ShapeAsset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: ShapeType;
  size: number;
  width?: number;
  height?: number;
  tags: string[];
  category: ShapeCategory;
  shapeData?: ShapeData;
  uploadedAt: string;
  userId: string;
  usageCount: number;
  lastUsedAt?: string;
}

export interface UploadShapeData {
  name?: string;
  category?: ShapeCategory;
  tags?: string[];
}

export interface UpdateShapeData {
  name?: string;
  tags?: string[];
  category?: ShapeCategory;
  shapeData?: Partial<ShapeData>;
}

export interface ListShapesParams {
  page?: number;
  limit?: number;
  filter?: string;
  category?: ShapeCategory;
  tags?: string[];
  sortBy?: 'name' | 'uploadDate' | 'size' | 'usageCount';
  sortOrder?: 'asc' | 'desc';
}

export interface ShapeStats {
  totalShapes: number;
  totalSize: number;
  totalSizeMB: string;
  shapesByCategory: {
    basic: number;
    arrow: number;
    callout: number;
    banner: number;
    icon: number;
    decorative: number;
    other: number;
  };
  mostUsedShapes?: ShapeAsset[];
  recentlyUploaded?: ShapeAsset[];
}

export interface ListShapesResponse {
  success: true;
  data: ShapeAsset[];
  total: number;
  page: number;
  limit: number;
}

export interface UploadShapeResponse {
  success: true;
  data: ShapeAsset;
}

export interface GetShapeResponse {
  success: true;
  data: ShapeAsset;
}

export interface UpdateShapeResponse {
  success: true;
  data: ShapeAsset;
}

export interface DeleteShapeResponse {
  success: true;
  id: string;
  message: string;
}

export interface ShapeStatsResponse {
  success: true;
  data: ShapeStats;
}

class ShapesService extends BaseService<ShapeAsset> {
  constructor() {
    super(API_ENDPOINTS.shapes);
  }

  async upload(file: File, metadata?: UploadShapeData): Promise<ShapeAsset> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata?.name) {
      formData.append('name', metadata.name);
    }
    
    if (metadata?.category) {
      formData.append('category', metadata.category);
    }
    
    if (metadata?.tags && metadata.tags.length > 0) {
      formData.append('tags', JSON.stringify(metadata.tags));
    }

    const response = await httpClient.post<UploadShapeResponse>(
      API_ENDPOINTS.shapes.upload,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  }

  async list(params: ListShapesParams = {}): Promise<ListShapesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.filter) queryParams.append('filter', params.filter);
    if (params.category) queryParams.append('category', params.category);
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach(tag => queryParams.append('tags', tag));
    }
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${API_ENDPOINTS.shapes.list}?${queryParams.toString()}`;
    const response = await httpClient.get<ListShapesResponse>(url);
    
    return response.data;
  }

  async detail(id: string): Promise<ShapeAsset> {
    const response = await httpClient.get<GetShapeResponse>(
      API_ENDPOINTS.shapes.detail(id)
    );
    return response.data.data;
  }

  async update(id: string, updates: UpdateShapeData): Promise<ShapeAsset> {
    const response = await httpClient.put<UpdateShapeResponse>(
      API_ENDPOINTS.shapes.update(id),
      updates
    );
    return response.data.data;
  }

  async delete(id: string): Promise<DeleteShapeResponse> {
    const response = await httpClient.delete<DeleteShapeResponse>(
      API_ENDPOINTS.shapes.delete(id)
    );
    return response.data;
  }

  private isUserIdValidationError(error: any): boolean {
    return error.response?.data?.error?.issues?.some((issue: any) => 
      issue.path?.includes('id') && (issue.code === 'invalid_string' || issue.validation === 'uuid')
    );
  }

  private getEmptyStats(): ShapeStats {
    return {
      totalShapes: 0,
      totalSize: 0,
      totalSizeMB: '0.00',
      shapesByCategory: {
        basic: 0,
        arrow: 0,
        callout: 0,
        banner: 0,
        icon: 0,
        decorative: 0,
        other: 0
      }
    };
  }

  async getStats(userId?: string): Promise<ShapeStats> {
    try {
      let url = API_ENDPOINTS.shapes.stats;
      
      if (userId) {
        url = `${url}?id=${userId}`;
      } else {
        const session = authService.getStoredSession();
        if (session?.user?.id) {
          url = `${url}?id=${session.user.id}`;
        }
      }
      
      const response = await httpClient.get<ShapeStatsResponse>(url);
      return response.data.data;
    } catch (error: any) {
      if (this.isUserIdValidationError(error)) {
        return this.getEmptyStats();
      }
      throw error;
    }
  }

  async getByCategory(category: ShapeCategory, limit: number = 100): Promise<ShapeAsset[]> {
    const result = await this.list({ category, page: 1, limit });
    return result.data;
  }

  async search(query: string, limit: number = 100): Promise<ShapeAsset[]> {
    const result = await this.list({ filter: query, page: 1, limit });
    return result.data;
  }
}

export default new ShapesService();
