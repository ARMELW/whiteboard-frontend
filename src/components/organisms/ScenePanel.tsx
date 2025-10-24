import React, { useCallback, useState } from 'react';
import { Button, Card } from '../atoms';
import { Plus, ArrowLeft, ArrowRight, Copy, Trash2, Download, MoreVertical, Music, BookmarkPlus, Play } from 'lucide-react';
import { useScenes, useSceneStore } from '@/app/scenes';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THUMBNAIL_CONFIG } from '@/utils/sceneThumbnail';
import EmbeddedAssetLibraryPanel from './EmbeddedAssetLibraryPanel';
import SaveAsTemplateDialog from './SaveAsTemplateDialog';
import { NewSceneDialog } from './NewSceneDialog';

interface ScenePanelProps {
  onOpenTemplateLibrary?: () => void;
}

const ScenePanel: React.FC<ScenePanelProps> = ({ onOpenTemplateLibrary }) => {
  // Pour ouvrir asset library et shape toolbar
  // const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary);
  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);
  const setShowShapeToolbar = useSceneStore((state) => state.setShowShapeToolbar);
  const { scenes } = useScenes();
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const setSelectedSceneIndex = useSceneStore((state) => state.setSelectedSceneIndex);
  
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false);
  const [sceneToSaveAsTemplate, setSceneToSaveAsTemplate] = useState<any>(null);
  const [showNewSceneDialog, setShowNewSceneDialog] = useState(false);
  
  // Remove imageInputRef and importInputRef, handled in asset library
  
  // Use actions from useScenesActionsWithHistory hook for history tracking
  const { createScene, deleteScene, duplicateScene, reorderScenes } = useScenesActionsWithHistory();

  const handleAddScene = useCallback(async () => {
    // Show dialog to choose between blank and template
    setShowNewSceneDialog(true);
  }, []);

  const handleCreateBlankScene = useCallback(async () => {
    const currentLength = scenes.length;
    await createScene({});
    // After creation, the new scene will be at the end of the array
    // React Query will refetch and scenes array will have +1 length
    // So we set to currentLength which will be the new scene's index
    setSelectedSceneIndex(currentLength);
  }, [scenes.length, createScene, setSelectedSceneIndex]);

  const handleCreateFromTemplate = useCallback(() => {
    // Open template library via parent callback
    if (onOpenTemplateLibrary) {
      onOpenTemplateLibrary();
    }
  }, [onOpenTemplateLibrary]);

  const handleMoveScene = useCallback(async (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= scenes.length) return;

    const reorderedScenes = [...scenes];
    const [movedScene] = reorderedScenes.splice(index, 1);
    reorderedScenes.splice(newIndex, 0, movedScene);

    await reorderScenes(reorderedScenes.map(s => s.id));
    setSelectedSceneIndex(newIndex);
  }, [scenes, reorderScenes, setSelectedSceneIndex]);

  const handleDuplicateScene = useCallback(async (index: number) => {
    const scene = scenes[index];
    await duplicateScene(scene.id);
    // After duplication, the new scene is inserted right after the current one
    setSelectedSceneIndex(index + 1);
  }, [scenes, duplicateScene, setSelectedSceneIndex]);

  const handleDeleteScene = useCallback(async (index: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette scène ?')) return;
    
    const scene = scenes[index];
    await deleteScene(scene.id);
    
    // Adjust selected index after deletion
    if (selectedSceneIndex >= scenes.length - 1) {
      setSelectedSceneIndex(Math.max(0, scenes.length - 2));
    }
  }, [scenes, selectedSceneIndex, deleteScene, setSelectedSceneIndex]);

  const handleSaveAsTemplate = useCallback((index: number) => {
    const scene = scenes[index];
    setSceneToSaveAsTemplate(scene);
    setShowSaveAsTemplate(true);
  }, [scenes]);

  const handlePreviewScene = useCallback(async (index: number) => {
    const scene = scenes[index];
    
    // For now, we'll use a mock video URL
    // In a real implementation, this would call the backend to generate a preview
    // or use a pre-generated preview URL from the scene data
    
    // Mock video generation for single scene
    const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    
    // Start preview with the mock URL
    useSceneStore.getState().startPreview(mockVideoUrl, 'scene');
  }, [scenes]);

  const formatSceneDuration = (duration: number): string => {
    if (typeof duration !== 'number' || isNaN(duration) || !isFinite(duration)) {
      return '--:--';
    }
    const totalSeconds = Math.floor(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white flex h-full shadow-sm">
      <div className="flex-1 overflow-x-auto p-3">
        <div className="flex gap-3 h-full">
        {scenes.map((scene: any, index: number) => (
          <Card
            key={scene.id}
            className={`aspect-video flex-shrink-0 w-64 cursor-pointer transition-all hover:shadow-md relative group ${selectedSceneIndex === index
                ? 'border-primary shadow-md ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
              }`}
            onClick={() => setSelectedSceneIndex(index)}
          >
            <div className="p-0 relative">
              {/* Thumbnail - Full card */}
              <div className="w-full aspect-video bg-secondary rounded-lg flex items-center justify-center text-muted-foreground text-xs overflow-hidden border border-border">
                {scene.sceneImage ? (
                  <img
                    src={scene.sceneImage}
                    alt={`Scene ${index + 1}`}
                    className="w-full h-full object-contain"
                    style={{ backgroundColor: THUMBNAIL_CONFIG.BACKGROUND_COLOR }}
                  />
                ) : scene.backgroundImage ? (
                  <img
                    src={scene.backgroundImage}
                    alt={`Scene ${index + 1}`}
                    className="w-full h-full object-contain"
                    style={{ backgroundColor: THUMBNAIL_CONFIG.BACKGROUND_COLOR }}
                  />
                ) : (
                  <span className="w-full h-full block" style={{ background: '#fff' }}></span>
                )}
              </div>

              {/* Scene number badge - top left */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                {index + 1}
              </div>

              {/* Audio indicator badge - top right of thumbnail (always visible, but moves down if actions menu visible) */}
              {scene.sceneAudio && (
                <div className={`absolute ${selectedSceneIndex === index ? 'top-12' : 'top-2 group-hover:top-12'} right-2 bg-blue-600/90 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1 transition-all z-10`}>
                  <Music className="h-3 w-3" />
                  <span>{Math.floor(scene.sceneAudio.duration)}s</span>
                </div>
              )}

              {/* Scene duration badge - bottom left */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                <span>{formatSceneDuration(scene.duration)}</span>
              </div>

              {/* Navigation buttons - centered bottom, visible on hover or when selected */}
              <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 ${selectedSceneIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg border border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveScene(index, 'left');
                    }}
                    disabled={index === 0}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                  <div className="h-4 w-px bg-border/50" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveScene(index, 'right');
                    }}
                    disabled={index === scenes.length - 1}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Actions dropdown - top right, visible on hover or when selected */}
              <div className={`absolute top-2 right-2 ${selectedSceneIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewScene(index);
                      }}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Prévisualiser
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateScene(index);
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveAsTemplate(index);
                      }}
                    >
                      <BookmarkPlus className="mr-2 h-4 w-4" />
                      Sauvegarder comme template
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteScene(index);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
        
        {/* Add Scene Card */}
        <Card
          className="flex-shrink-0 w-64 cursor-pointer transition-all hover:shadow-md border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50"
          onClick={handleAddScene}
        >
          <div className="p-0 relative">
            <div className="w-full aspect-video bg-secondary/30 rounded-lg flex flex-col items-center justify-center text-muted-foreground gap-2 hover:text-primary transition-colors">
              <Plus className="w-12 h-12" />
              <span className="text-sm font-medium">Nouvelle scène</span>
            </div>
          </div>
        </Card>
        </div>
      </div>
      
      {/* New Scene Dialog */}
      <NewSceneDialog
        isOpen={showNewSceneDialog}
        onClose={() => setShowNewSceneDialog(false)}
        onCreateBlank={handleCreateBlankScene}
        onCreateFromTemplate={handleCreateFromTemplate}
      />
      
      {/* Save as Template Dialog */}
      {showSaveAsTemplate && sceneToSaveAsTemplate && (
        <SaveAsTemplateDialog
          isOpen={showSaveAsTemplate}
          onClose={() => {
            setShowSaveAsTemplate(false);
            setSceneToSaveAsTemplate(null);
          }}
          scene={sceneToSaveAsTemplate}
        />
      )}
    </div>
  );
};

export default React.memo(ScenePanel);