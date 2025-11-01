import React, { useState, useEffect, useRef } from 'react';
import {
  ShapeLibraryHeader,
  ShapeSearchBar,
  ShapeSortControls,
  ShapeCategoryFilter,
  ShapeGrid,
  useShapeLibraryStore
} from '../molecules/shape-library';
import { useSceneStore } from '@/app/scenes';
import { useShapes, useShapesActions } from '@/app/shapes';
import { ShapeAsset, ShapeCategory } from '@/app/shapes/api/shapesService';
import { toast } from 'sonner';

const ShapeLibrary: React.FC = () => {
  const setShowShapeLibrary = useSceneStore((state) => state.setShowShapeLibrary);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    sortBy,
    sortOrder,
    setSortOrder,
    selectedCategory,
    setSelectedCategory,
  } = useShapeLibraryStore();

  const { uploadShape, getShapeStats, isUploading } = useShapesActions();

  // Load shapes with filters
  const { shapes, loading, refetch } = useShapes({
    filter: searchQuery || undefined,
    category: selectedCategory as ShapeCategory | undefined,
    sortBy: sortBy,
    sortOrder: sortOrder,
    page: 1,
    limit: 100,
  });

  const stats = getShapeStats();

  // Get unique categories from shapes
  const categories = Array.from(new Set(shapes.map(s => s.category)));

  const handleShapeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSortByChange = (newSortBy: 'name' | 'uploadDate' | 'size' | 'usageCount') => {
    useShapeLibraryStore.setState({ sortBy: newSortBy });
  };

  useEffect(() => {
    refetch();
  }, [searchQuery, selectedCategory, sortBy, sortOrder, refetch]);

  const getHeaderStats = () => {
    if (!stats) return null;
    return {
      totalShapes: stats.totalShapes,
      totalSizeMB: stats.totalSizeMB,
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col border border-border">
        <ShapeLibraryHeader
          stats={getHeaderStats()}
          onClose={() => setShowShapeLibrary(false)}
          onAddShape={() => fileInputRef.current?.click()}
          fileInputRef={fileInputRef}
          onShapeUpload={handleShapeUpload}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="w-64 bg-gray-850 border-r border-border p-4 overflow-y-auto flex-shrink-0">
            <ShapeSortControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={handleSortByChange}
              onSortOrderChange={setSortOrder}
            />
            <ShapeCategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ShapeSearchBar
              searchQuery={searchQuery}
              selectedTags={selectedTags}
              onSearchChange={setSearchQuery}
            />

            {/* Shapes Grid */}
            <div className="flex-1 overflow-y-auto bg-white">
              {loading || isUploading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Chargement...</div>
                </div>
              ) : (
                <ShapeGrid 
                  shapes={shapes} 
                  onShapeChanged={() => refetch()} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeLibrary;
