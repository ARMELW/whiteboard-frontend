import { create } from 'zustand';
import { Project } from './types';

/**
 * UI-only store for project state
 * Data is managed by React Query, this store only handles UI state
 */
interface ProjectState {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
}));
