import { create } from 'zustand';

interface SceneState {
  // UI state only - no data operations
  selectedSceneIndex: number;
  selectedLayerIdByScene: Record<string, string | null>; // Map of sceneId -> selectedLayerId
  showAssetLibrary: boolean;
  showShapeToolbar: boolean;
  showCropModal: boolean;
  pendingImageData: any | null;
  
  // UI Actions only
  setSelectedSceneIndex: (index: number) => void;
  setSelectedLayerId: (sceneId: string, layerId: string | null) => void;
  getSelectedLayerId: (sceneId: string) => string | null;
  setShowAssetLibrary: (show: boolean) => void;
  setShowShapeToolbar: (show: boolean) => void;
  setShowCropModal: (show: boolean) => void;
  setPendingImageData: (data: any | null) => void;
  
  // Reset all state
  reset: () => void;
}

const initialState = {
  selectedSceneIndex: 0,
  selectedLayerIdByScene: {},
  showAssetLibrary: false,
  showShapeToolbar: false,
  showCropModal: false,
  pendingImageData: null,
};

export const useSceneStore = create<SceneState>((set, get) => ({
  ...initialState,
  
  // UI Actions only
  setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),
  setSelectedLayerId: (sceneId, layerId) => 
    set((state) => ({
      selectedLayerIdByScene: {
        ...state.selectedLayerIdByScene,
        [sceneId]: layerId,
      },
    })),
  getSelectedLayerId: (sceneId) => {
    const state = get();
    return state.selectedLayerIdByScene[sceneId] ?? null;
  },
  setShowAssetLibrary: (show) => set({ showAssetLibrary: show }),
  setShowShapeToolbar: (show) => set({ showShapeToolbar: show }),
  setShowCropModal: (show) => set({ showCropModal: show }),
  setPendingImageData: (data) => set({ pendingImageData: data }),
  
  reset: () => set(initialState),
}));
