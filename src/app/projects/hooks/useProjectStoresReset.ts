import { useSceneStore } from '@/app/scenes';
import { useProjectStore } from '@/app/projects/store';
import { useImageLibraryStore } from '@/app/images/store';
import { useAudioLibraryStore } from '@/app/audio/store';
import { useHistoryStore } from '@/app/history/store';
import { useTextLibraryStore } from '@/app/text/store';
import { useChannelStore } from '@/app/channels/store';

/**
 * Reset all Zustand stores related to project/session
 * À appeler avant de charger un nouveau projet
 */
export function useProjectStoresReset() {
  const resetSceneStore = useSceneStore((state) => state.reset);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const cleanupImageStore = useImageLibraryStore((state) => state.cleanup);
  const cleanupAudioStore = useAudioLibraryStore((state) => state.cleanup);
  const clearHistory = useHistoryStore((state) => state.clear);
  // Text/Channel stores: pas de reset, on peut vider manuellement si besoin
  const setTextItems = useTextLibraryStore((state) => state.setItems);
  const setChannels = useChannelStore((state) => state.setChannels);

  return () => {
    resetSceneStore();
    setCurrentProject(null);
    cleanupImageStore();
    cleanupAudioStore();
    clearHistory();
    setTextItems([]);
    setChannels([]);
  };
}
