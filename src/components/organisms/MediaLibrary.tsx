/**
 * MediaLibrary Component
 * Unified component that combines Assets and Images functionality
 * Provides upload, preview, tagging, filtering, and scene integration
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Upload, Trash2, Plus, Tag, X, Search, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useImageLibrary, useImageActions, IMAGE_CONFIG } from '@/app/images';
import { useCurrentScene } from '@/app/scenes/hooks/useCurrentScene';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import { useSceneStore } from '@/app/scenes';
import { LayerType, LayerMode } from '@/app/scenes/types';
import { ImageCropModal } from '../molecules';
import { v4 as uuidv4 } from 'uuid';
import { searchAssetsAsync, getAllTags, Asset } from '@/utils/assetManager';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

const MediaLibrary: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Image Library
  const { files: imageFiles } = useImageLibrary();
  const { upload, isUploading, uploadProgress, deleteImage, error } = useImageActions();
  
  // Asset Library
  const [assets, setAssets] = useState<Asset[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  
  // Scene integration
  const currentScene = useCurrentScene();
  const { addLayer } = useScenesActionsWithHistory();
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const scenes = useSceneStore((state) => state.scenes);
  
  // Crop modal
  const showCropModal = useSceneStore((state) => state.showCropModal);
  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const pendingImageData = useSceneStore((state) => state.pendingImageData);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);

  // Load assets and tags
  useEffect(() => {
    setAllTags(getAllTags());
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      setAssetsLoading(true);
      try {
        const results = await searchAssetsAsync({
          tags: selectedTags.length ? selectedTags : undefined,
          query: debouncedSearchQuery ? debouncedSearchQuery : undefined,
          sortBy: 'uploadDate',
          sortOrder: 'desc'
        });
        setAssets(results);
      } catch (error) {
        console.error('Error loading assets:', error);
        setAssets([]);
        toast.error('Failed to load assets');
      } finally {
        setAssetsLoading(false);
      }
    };
    loadAssets();
  }, [selectedTags, debouncedSearchQuery]);

  // Combine all media items
  const allMedia = useMemo(() => {
    const assetItems = assets.map(asset => ({
      id: asset.id,
      type: 'asset' as const,
      name: asset.name,
      url: asset.dataUrl,
      width: asset.width,
      height: asset.height,
      size: asset.size,
      tags: asset.tags,
      data: asset
    }));
    
    const imageItems = imageFiles.map(file => ({
      id: file.id,
      type: 'image' as const,
      name: file.fileName,
      url: file.fileUrl,
      width: file.width,
      height: file.height,
      size: file.size,
      tags: [] as string[],
      data: file
    }));
    
    return [...assetItems, ...imageItems];
  }, [assets, imageFiles]);

  // Filter media by search query
  const filteredMedia = useMemo(() => {
    if (!debouncedSearchQuery) return allMedia;
    const query = debouncedSearchQuery.toLowerCase();
    return allMedia.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [allMedia, debouncedSearchQuery]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImageData({
        imageUrl: event.target?.result,
        fileName: file.name,
        originalUrl: event.target?.result,
        fileType: file.type
      });
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const calculateLayerPosition = useCallback((width: number, height: number, scale: number = 1) => {
    const scene = scenes[selectedSceneIndex];
    if (!scene) return { x: 100, y: 100, scale: 1 };
    
    const sceneWidth = 1920;
    const sceneHeight = 1080;
    
    const defaultCamera = (scene.sceneCameras || []).find((c) => c.isDefault) || 
                         (scene.cameras || []).find((c) => c.isDefault);
    
    let cameraCenterX = sceneWidth / 2;
    let cameraCenterY = sceneHeight / 2;
    
    if (defaultCamera && defaultCamera.position) {
      cameraCenterX = defaultCamera.position.x * sceneWidth;
      cameraCenterY = defaultCamera.position.y * sceneHeight;
    }
    
    const cameraWidth = defaultCamera?.width || 800;
    const cameraHeight = defaultCamera?.height || 450;
    const cameraZoom = Math.max(0.1, defaultCamera?.zoom || 1);
    
    const viewportWidth = cameraWidth / cameraZoom;
    const viewportHeight = cameraHeight / cameraZoom;
    
    const maxWidth = viewportWidth * 0.8;
    const maxHeight = viewportHeight * 0.8;
    
    const scaleX = maxWidth / width;
    const scaleY = maxHeight / height;
    const finalScale = Math.min(scaleX, scaleY, 1.0);
    
    const scaledImageWidth = width * finalScale;
    const scaledImageHeight = height * finalScale;
    
    const positionX = cameraCenterX - (scaledImageWidth / 2);
    const positionY = cameraCenterY - (scaledImageHeight / 2);
    
    return { x: positionX, y: positionY, scale: finalScale };
  }, [scenes, selectedSceneIndex]);

  const handleAddToScene = useCallback((item: typeof filteredMedia[0]) => {
    if (!currentScene) {
      toast.error('Please select a scene first');
      return;
    }

    const { x, y, scale } = calculateLayerPosition(item.width, item.height);
    
    const newLayer = {
      id: uuidv4(),
      name: item.name,
      type: LayerType.IMAGE,
      mode: LayerMode.STATIC,
      position: { x, y },
      z_index: currentScene.layers.length,
      scale,
      opacity: 1.0,
      rotation: 0,
      image_path: item.url,
      imageId: item.type === 'image' ? item.id : undefined,
      fileName: item.name,
      scaleX: 1.0,
      scaleY: 1.0,
      flipX: false,
      flipY: false,
    };

    addLayer({ sceneId: currentScene.id, layer: newLayer });
    toast.success(`Added "${item.name}" to scene`);
  }, [currentScene, addLayer, calculateLayerPosition]);

  const handleDelete = async (item: typeof filteredMedia[0]) => {
    if (item.type !== 'image') return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );
    if (confirmed) {
      try {
        await deleteImage(item.id);
        toast.success(`Deleted "${item.name}"`);
      } catch (err) {
        console.error('Failed to delete image:', err);
        toast.error(`Failed to delete "${item.name}"`);
      }
    }
  };

  const handleCropComplete = useCallback((croppedImageUrl: string, imageDimensions?: { width: number; height: number }) => {
    const scene = scenes[selectedSceneIndex];
    if (!scene) return;
    
    let position = { x: 100, y: 100 };
    let scale = 1;
    
    if (imageDimensions) {
      const result = calculateLayerPosition(imageDimensions.width, imageDimensions.height);
      position = { x: result.x, y: result.y };
      scale = result.scale;
    }
    
    const newLayer = {
      id: uuidv4(),
      name: pendingImageData?.fileName || 'Image',
      type: LayerType.IMAGE,
      mode: LayerMode.STATIC,
      position,
      z_index: (scene.layers?.length || 0) + 1,
      scale,
      opacity: 1,
      image_path: croppedImageUrl,
    };
    
    addLayer({ sceneId: scene.id, layer: newLayer });
    setShowCropModal(false);
    setPendingImageData(null);
    toast.success('Image added to scene');
  }, [scenes, selectedSceneIndex, pendingImageData, addLayer, setShowCropModal, setPendingImageData, calculateLayerPosition]);

  const handleCropCancel = useCallback(() => {
    setShowCropModal(false);
    setPendingImageData(null);
  }, [setShowCropModal, setPendingImageData]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isLoading = isUploading || assetsLoading;
  const hasMedia = filteredMedia.length > 0;
  const hasFilters = selectedTags.length > 0 || searchQuery.length > 0;

  return (
    <>
      {showCropModal && pendingImageData && (
        <ImageCropModal
          imageUrl={pendingImageData.imageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      
      <div className="flex flex-col h-full">
        {/* Header with Upload Button */}
        <div className="p-3 border-b border-gray-200 space-y-3">
          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Media'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Supported: {IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')} (max {IMAGE_CONFIG.MAX_FILE_SIZE_MB}MB)
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="p-3 border-b border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Tag className="w-3.5 h-3.5" />
                <span>Tags</span>
              </div>
              {hasFilters && (
                <button
                  onClick={() => {
                    setSelectedTags([]);
                    setSearchQuery('');
                  }}
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
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    selectedTags.includes(tag)
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

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-2 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !hasMedia ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Plus className="h-12 w-12 mb-2" />
              <p className="text-sm">
                {hasFilters ? 'No media matches your filters' : 'No media uploaded'}
              </p>
              <p className="text-xs mt-1">Click "Upload Media" to add files</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-contain bg-white"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddToScene(item)}
                        className="h-8 px-2"
                        title="Add to current scene"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      {item.type === 'image' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                          className="h-8 w-8 p-0"
                          title="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-900 truncate" title={item.name}>
                      {item.name}
                    </div>
                   
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg hover:scale-105 transition-all"
            aria-label="Add media"
          >
            <ImagePlus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(MediaLibrary);
