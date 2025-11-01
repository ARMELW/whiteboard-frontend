/**
 * Shapes Tab Component
 * Tab for managing SVG shapes in the context panel
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Upload, Trash2, Search, Shapes as ShapesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useShapes, useShapesActions } from '@/app/shapes';
import { ShapeAsset, ShapeCategory } from '@/app/shapes/api/shapesService';
import { useCurrentScene } from '@/app/scenes/hooks/useCurrentScene';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import { useSceneStore } from '@/app/scenes';
import { LayerType, LayerMode } from '@/app/scenes/types';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';

const ShapesTab: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Shape Library
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState<ShapeCategory | null>(null);
  
  const { shapes, loading, refetch } = useShapes({
    filter: debouncedSearchQuery || undefined,
    category: selectedCategory || undefined,
    sortBy: 'uploadDate',
    sortOrder: 'desc',
    page: 1,
    limit: 100,
  });
  
  const { uploadShape, deleteShape, isUploading } = useShapesActions();
  
  // Scene integration
  const currentScene = useCurrentScene();
  const { addLayer } = useScenesActionsWithHistory();
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const scenes = useSceneStore((state) => state.scenes);
  
  const categories: ShapeCategory[] = ['basic', 'arrow', 'callout', 'banner', 'icon', 'decorative', 'other'];
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    for (const file of Array.from(files)) {
      if (!file.type.includes('svg')) {
        toast.error(`${file.name} n'est pas un fichier SVG valide`);
        continue;
      }
      
      try {
        await uploadShape(file, {
          name: file.name.replace('.svg', ''),
          category: 'other',
          tags: [],
        });
      } catch (error) {
        console.error('Error uploading shape:', error);
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Refresh shapes list
    refetch();
  };
  
  const handleAddShapeToScene = (shape: ShapeAsset) => {
    if (!currentScene) {
      toast.error('Aucune scène sélectionnée');
      return;
    }
    
    const newLayer = {
      id: uuidv4(),
      type: LayerType.SHAPE,
      name: shape.name,
      mode: LayerMode.DRAW,
      svg_path: shape.url,
      svg_sampling_rate: 1,
      svg_reverse: false,
      position: {
        x: 200,
        y: 150,
      },
      width: shape.width || 200,
      height: shape.height || 200,
      scale: 1,
      opacity: 1,
      rotation: 0,
      shape_config: {
        color: '#222222',
        fill_color: '#222222',
        stroke_width: 5,
      },
      z_index: currentScene.layers.length,
      skip_rate: 5,
      visible: true,
      locked: false,
    };
    
    addLayer(currentScene.id, newLayer);
    toast.success(`Forme "${shape.name}" ajoutée à la scène`);
  };
  
  const handleDeleteShape = async (shapeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette forme ?')) return;
    
    try {
      await deleteShape(shapeId);
      refetch();
    } catch (error) {
      console.error('Error deleting shape:', error);
    }
  };
  
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShapesIcon className="w-5 h-5" />
            Formes SVG
          </h3>
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="sm"
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une forme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        {/* Category Filter */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Shapes Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading || isUploading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : shapes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShapesIcon className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-sm text-center">Aucune forme trouvée</p>
            <p className="text-xs text-center mt-1">Importez des fichiers SVG pour commencer</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {shapes.map((shape) => (
              <div
                key={shape.id}
                className="group relative bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleAddShapeToScene(shape)}
              >
                {/* Shape Preview */}
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                  {shape.thumbnailUrl ? (
                    <img
                      src={shape.thumbnailUrl}
                      alt={shape.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={shape.url}
                      alt={shape.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                
                {/* Shape Info */}
                <div className="p-2 bg-white">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {shape.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatSize(shape.size)}
                  </p>
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteShape(shape.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapesTab;
