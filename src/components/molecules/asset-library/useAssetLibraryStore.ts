import { create } from 'zustand';
import { Asset } from './types';
import { deleteAsset, updateAsset } from '../../../utils/assetManager';

interface AssetLibraryState {
  // Asset selection/editing (already present)
  selectedAssetId: string | null;
  editingAssetId: string | null;
  editName: string;
  editTags: string;
  handleSelectAsset: (asset: Asset) => void;
  handleEditAsset: (asset: Asset, e: React.MouseEvent) => void;
  handleDeleteAsset: (assetId: string, e: React.MouseEvent, onComplete?: () => void) => void;
  handleSaveEdit: (assetId: string, e: React.MouseEvent, onComplete?: () => void) => void;
  handleCancelEdit: (e: React.MouseEvent) => void;
  setEditName: (name: string) => void;
  setEditTags: (tags: string) => void;
  formatSize: (bytes: number) => string;
  formatDate: (timestamp: number) => string;
  // AssetLibrary UI state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
  setAllTags: (tags: string[]) => void;
  sortBy: 'uploadDate' | 'name' | 'lastUsed' | 'usageCount' | 'size';
  setSortBy: (s: 'uploadDate' | 'name' | 'lastUsed' | 'usageCount' | 'size') => void;
  sortOrder: 'desc' | 'asc';
  setSortOrder: (o: 'desc' | 'asc') => void;
  viewMode: 'all' | 'cached' | 'recent';
  setViewMode: (v: 'all' | 'cached' | 'recent') => void;
  showCropModal: boolean;
  setShowCropModal: (b: boolean) => void;
  pendingImageData: any;
  setPendingImageData: (d: any) => void;
}

export const useAssetLibraryStore = create<AssetLibraryState>((set) => ({
  // Asset selection/editing
  selectedAssetId: null,
  editingAssetId: null,
  editName: '',
  editTags: '',
  handleSelectAsset: (asset) => set({ selectedAssetId: asset.id }),
  handleEditAsset: (asset, e) => {
    e.stopPropagation();
    set({ editingAssetId: asset.id, editName: asset.name, editTags: asset.tags.join(', ') });
  },
  handleDeleteAsset: (assetId, e, onComplete) => {
    e.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cet asset ?')) {
      const success = deleteAsset(assetId);
      if (success) {
        set({ selectedAssetId: null });
        onComplete?.();
      } else {
        alert('Erreur lors de la suppression de l\'asset');
      }
    }
  },
  handleSaveEdit: (assetId, e, onComplete) => {
    e.stopPropagation();
    const { editName, editTags } = useAssetLibraryStore.getState();
    const tags = editTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const updatedAsset = updateAsset(assetId, { name: editName, tags });
    if (updatedAsset) {
      set({ editingAssetId: null });
      onComplete?.();
    } else {
      alert('Erreur lors de la mise à jour de l\'asset');
    }
  },
  handleCancelEdit: (e) => {
    e.stopPropagation();
    set({ editingAssetId: null });
  },
  setEditName: (name) => set({ editName: name }),
  setEditTags: (tags) => set({ editTags: tags }),
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
  // AssetLibrary UI state
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
  viewMode: 'all',
  setViewMode: (v) => set({ viewMode: v }),
  showCropModal: false,
  setShowCropModal: (b) => set({ showCropModal: b }),
  pendingImageData: null,
  setPendingImageData: (d) => set({ pendingImageData: d }),
}));