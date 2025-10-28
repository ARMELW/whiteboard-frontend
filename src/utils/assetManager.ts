/**
 * Asset Manager - Compatibility layer for React Query-based asset management
 * This file provides backward compatibility for components still using the old assetManager API
 */

import assetsService, { Asset as ServiceAsset } from '@/app/assets/api/assetsService';

// Legacy Asset interface for backward compatibility
export interface Asset {
  id: string;
  name: string;
  dataUrl: string;
  type: string;
  size: number;
  width: number;
  height: number;
  tags: string[];
  uploadDate: number;
  lastUsed: number;
  usageCount: number;
}

export interface AssetData {
  name: string;
  dataUrl: string;
  type: string;
  tags?: string[];
}

export interface SearchCriteria {
  query?: string;
  tags?: string[];
  sortBy?: 'name' | 'uploadDate' | 'lastUsed' | 'usageCount' | 'size';
  sortOrder?: 'asc' | 'desc';
}

export interface AssetStats {
  totalCount: number;
  totalSize: number;
  totalSizeMB: string;
  uniqueTags: number;
  mostUsed: Asset | null;
}

/**
 * Convert new Asset format to legacy format
 */
function convertToLegacyAsset(serviceAsset: ServiceAsset): Asset {
  return {
    id: serviceAsset.id,
    name: serviceAsset.name,
    dataUrl: serviceAsset.dataUrl || serviceAsset.url || '',
    type: serviceAsset.type,
    size: serviceAsset.size,
    width: serviceAsset.width || serviceAsset.dimensions?.width || 0,
    height: serviceAsset.height || serviceAsset.dimensions?.height || 0,
    tags: serviceAsset.tags || [],
    uploadDate: serviceAsset.uploadedAt ? new Date(serviceAsset.uploadedAt).getTime() : Date.now(),
    lastUsed: Date.now(),
    usageCount: 0,
  };
}

/**
 * Get all assets from backend (async)
 */
export async function getAllAssetsAsync(): Promise<Asset[]> {
  try {
    const result = await assetsService.list({ page: 1, limit: 1000 });
    return result.data.map(convertToLegacyAsset);
  } catch (error) {
    console.error('Error loading assets:', error);
    return [];
  }
}

/**
 * Search assets with criteria (async)
 */
export async function searchAssetsAsync(criteria: SearchCriteria): Promise<Asset[]> {
  try {
    const result = await assetsService.list({ page: 1, limit: 1000 });
    let assets = result.data.map(convertToLegacyAsset);

    // Filter by query
    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      assets = assets.filter(asset => 
        asset.name.toLowerCase().includes(query) ||
        asset.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tags
    if (criteria.tags && criteria.tags.length > 0) {
      assets = assets.filter(asset =>
        criteria.tags!.every(tag => asset.tags.includes(tag))
      );
    }

    // Sort
    if (criteria.sortBy) {
      assets.sort((a, b) => {
        const aVal = a[criteria.sortBy!];
        const bVal = b[criteria.sortBy!];
        const order = criteria.sortOrder === 'desc' ? -1 : 1;
        return aVal > bVal ? order : -order;
      });
    }

    return assets;
  } catch (error) {
    console.error('Error searching assets:', error);
    return [];
  }
}

/**
 * Get all unique tags from assets
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const result = await assetsService.list({ page: 1, limit: 1000 });
    const tagsSet = new Set<string>();
    result.data.forEach(asset => {
      asset.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  } catch (error) {
    console.error('Error loading tags:', error);
    return [];
  }
}

/**
 * Add a new asset
 */
export async function addAsset(assetData: AssetData): Promise<Asset> {
  try {
    // Create asset through service
    const created = await assetsService.create({
      name: assetData.name,
      type: assetData.type,
      dataUrl: assetData.dataUrl,
      tags: assetData.tags || [],
      size: 0, // Will be calculated by backend
    });
    
    return convertToLegacyAsset(created);
  } catch (error) {
    console.error('Error adding asset:', error);
    throw error;
  }
}

/**
 * Delete an asset
 */
export async function deleteAsset(id: string): Promise<void> {
  try {
    await assetsService.delete(id);
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
}

/**
 * Get asset statistics
 */
export async function getAssetStats(): Promise<AssetStats> {
  try {
    const stats = await assetsService.getStats();
    
    return {
      totalCount: stats.totalAssets,
      totalSize: stats.totalSize,
      totalSizeMB: (stats.totalSize / (1024 * 1024)).toFixed(2),
      uniqueTags: Object.keys(stats.byCategory).length,
      mostUsed: null, // Not tracked anymore
    };
  } catch (error) {
    console.error('Error getting asset stats:', error);
    return {
      totalCount: 0,
      totalSize: 0,
      totalSizeMB: '0.00',
      uniqueTags: 0,
      mostUsed: null,
    };
  }
}

// Legacy sync functions (deprecated, return empty data)
export function getAllAssets(): Asset[] {
  console.warn('getAllAssets is deprecated, use getAllAssetsAsync instead');
  return [];
}

export default {
  getAllAssets,
  getAllAssetsAsync,
  searchAssetsAsync,
  getAllTags,
  addAsset,
  deleteAsset,
  getAssetStats,
};

/**
 * Update an existing asset
 */
export async function updateAsset(id: string, updates: Partial<AssetData>): Promise<Asset> {
  try {
    const updated = await assetsService.update(id, {
      name: updates.name,
      type: updates.type,
      tags: updates.tags,
    });
    return convertToLegacyAsset(updated);
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
}

/**
 * Get cached assets (async) - now just fetches from backend
 */
export async function getCachedAssetsAsync(): Promise<Asset[]> {
  return getAllAssetsAsync();
}
