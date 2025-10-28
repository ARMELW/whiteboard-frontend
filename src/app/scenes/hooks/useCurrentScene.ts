import { useSceneStore } from '../store';

/**
 * Hook to get the currently selected scene
 * @returns The currently selected scene or null if no scene is selected
 * 
 * Optimized to prevent unnecessary re-renders by using a stable selector
 * that only updates when the actual selected scene changes
 */
export const useCurrentScene = () => {
  // Use a selector that returns only the current scene, not the entire array
  // This prevents re-renders when other scenes in the array change
  return useSceneStore((state) => {
    const scene = state.scenes[state.selectedSceneIndex];
    return scene || null;
  });
};
