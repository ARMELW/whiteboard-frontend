import { create } from 'zustand';
import { ShapeAsset } from '@/app/shapes/api/shapesService';

interface ShapeLibraryState {
  selectedShapeId: string | null;
  editingShapeId: string | null;
  editName: string;
  editTags: string;
  editCategory: string;
  handleSelectShape: (shape: ShapeAsset) => void;
  handleEditShape: (shape: ShapeAsset, e: React.MouseEvent) => void;
  handleDeleteShape: (shapeId: string, e: React.MouseEvent, onComplete?: () => void) => void;
  handleSaveEdit: (shapeId: string, e: React.MouseEvent, onComplete?: () => void) => void;
  handleCancelEdit: (e: React.MouseEvent) => void;
  setEditName: (name: string) => void;
  setEditTags: (tags: string) => void;
  setEditCategory: (category: string) => void;
  formatSize: (bytes: number) => string;
  formatDate: (timestamp: string) => string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
  setAllTags: (tags: string[]) => void;
  sortBy: 'name' | 'uploadDate' | 'size' | 'usageCount';
  setSortBy: (s: 'name' | 'uploadDate' | 'size' | 'usageCount') => void;
  sortOrder: 'desc' | 'asc';
  setSortOrder: (o: 'desc' | 'asc') => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
}

export const useShapeLibraryStore = create<ShapeLibraryState>((set, get) => ({
  selectedShapeId: null,
  editingShapeId: null,
  editName: '',
  editTags: '',
  editCategory: 'other',
  handleSelectShape: (shape) => set({ selectedShapeId: shape.id }),
  handleEditShape: (shape, e) => {
    e.stopPropagation();
    set({ 
      editingShapeId: shape.id, 
      editName: shape.name, 
      editTags: shape.tags.join(', '),
      editCategory: shape.category 
    });
  },
  handleDeleteShape: (shapeId, e, onComplete) => {
    e.stopPropagation();
    set({ selectedShapeId: null });
    onComplete?.();
  },
  handleSaveEdit: (shapeId, e, onComplete) => {
    e.stopPropagation();
    set({ editingShapeId: null });
    onComplete?.();
  },
  handleCancelEdit: (e) => {
    e.stopPropagation();
    set({ editingShapeId: null });
  },
  setEditName: (name) => set({ editName: name }),
  setEditTags: (tags) => set({ editTags: tags }),
  setEditCategory: (category) => set({ editCategory: category }),
  formatSize: (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  },
  formatDate: (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  },
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectedTags: [],
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  allTags: [],
  setAllTags: (tags) => set({ allTags: tags }),
  sortBy: 'uploadDate',
  setSortBy: (s) => set({ sortBy: s }),
  sortOrder: 'desc',
  setSortOrder: (o) => set({ sortOrder: o }),
  selectedCategory: null,
  setSelectedCategory: (c) => set({ selectedCategory: c }),
}));
