import { create } from 'zustand';

export interface Chapter {
  id: string;
  name: string;
  sceneIndices: number[];
  isExpanded: boolean;
}

interface SceneState {
  // UI state only - no data operations
  selectedSceneIndex: number;
  selectedLayerId: string | null;
  showAssetLibrary: boolean;
  showShapeToolbar: boolean;
  showCropModal: boolean;
  pendingImageData: any | null;
  chapters: Chapter[];
  
  // UI Actions only
  setSelectedSceneIndex: (index: number) => void;
  setSelectedLayerId: (id: string | null) => void;
  setShowAssetLibrary: (show: boolean) => void;
  setShowShapeToolbar: (show: boolean) => void;
  setShowCropModal: (show: boolean) => void;
  setPendingImageData: (data: any | null) => void;
  setChapters: (chapters: Chapter[]) => void;
  
  // Reset all state
  reset: () => void;
}

const initialState = {
  selectedSceneIndex: 0,
  selectedLayerId: null,
  showAssetLibrary: false,
  showShapeToolbar: false,
  showCropModal: false,
  pendingImageData: null,
  chapters: [
    {
      id: 'chapter-1',
      name: 'Introduction',
      sceneIndices: [0],
      isExpanded: true
    },
    {
      id: 'chapter-2',
      name: 'Développement',
      sceneIndices: [],
      isExpanded: true
    },
    {
      id: 'chapter-3',
      name: 'Conclusion',
      sceneIndices: [],
      isExpanded: true
    }
  ] as Chapter[],
};

export const useSceneStore = create<SceneState>((set) => ({
  ...initialState,
  
  // UI Actions only
  setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setShowAssetLibrary: (show) => set({ showAssetLibrary: show }),
  setShowShapeToolbar: (show) => set({ showShapeToolbar: show }),
  setShowCropModal: (show) => set({ showCropModal: show }),
  setPendingImageData: (data) => set({ pendingImageData: data }),
  setChapters: (chapters) => set({ chapters }),
  
  reset: () => set(initialState),
}));
