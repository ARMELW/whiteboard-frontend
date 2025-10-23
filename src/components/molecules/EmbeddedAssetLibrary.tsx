import React, { useState, useEffect } from 'react';
import { searchAssetsAsync, getAllTags } from '@/utils/assetManager';
import { Filter, Plus, Search, Tag, X } from 'lucide-react';
import { Button } from '../atoms';
import type { Asset } from '@/utils/assetManager';

interface EmbeddedAssetLibraryProps {
  onBrowseAssets?: () => void;
  onSelectAsset?: (asset: Asset) => void;
}

const EmbeddedAssetLibrary: React.FC<EmbeddedAssetLibraryProps> = ({
  onBrowseAssets,
  onSelectAsset,
}) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAllTags(getAllTags());
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        const results = await searchAssetsAsync({
          tags: selectedTags.length ? selectedTags : undefined,
          sortBy: 'uploadDate',
          sortOrder: 'desc'
        });
        setAssets(results);
      } catch (error) {
        console.error('Error loading assets:', error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, [selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasAssets = assets.length > 0;
  const hasFilters = selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <Tag className="w-3.5 h-3.5" />
              <span>Tags</span>
            </div>
            {hasFilters && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 font-medium transition-all ${selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Assets Grid or Empty State */}
      {!hasAssets ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            {hasFilters ? 'No assets match these tags' : 'No assets yet'}
          </p>
          <Button onClick={onBrowseAssets} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Assets
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => onSelectAsset?.(asset)}
              className="group cursor-pointer border border-gray-300 shadow-sm transition-all"
            >
              <div className="relative aspect-square">
                <img
                  src={asset.dataUrl}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-xs text-gray-700 truncate font-medium">
                {asset.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmbeddedAssetLibrary;