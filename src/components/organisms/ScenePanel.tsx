import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Button, Card } from '../atoms';
import { Plus, ArrowLeft, ArrowRight, Copy, Trash2, Download, MoreVertical, Music, BookmarkPlus, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScenes, useSceneStore } from '@/app/scenes';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import { useWizardStore } from '@/app/wizard';
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
  const openWizard = useWizardStore((state) => state.openWizard);
  
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false);
  const [sceneToSaveAsTemplate, setSceneToSaveAsTemplate] = useState<any>(null);
  const [showNewSceneDialog, setShowNewSceneDialog] = useState(false);
  
  // Refs for scene navigation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Remove imageInputRef and importInputRef, handled in asset library
  
  // Use actions from useScenesActionsWithHistory hook for history tracking
  const { createScene, deleteScene, duplicateScene, reorderScenes } = useScenesActionsWithHistory();

  // Auto-center on scene change
  useEffect(() => {
    if (scrollContainerRef.current && sceneRefs.current[selectedSceneIndex]) {
      const container = scrollContainerRef.current;
      const sceneElement = sceneRefs.current[selectedSceneIndex];
      
      if (sceneElement) {
        const containerWidth = container.clientWidth;
        const sceneLeft = sceneElement.offsetLeft;
        const sceneWidth = sceneElement.clientWidth;
        
        // Center the scene in the viewport
        const scrollPosition = sceneLeft - (containerWidth / 2) + (sceneWidth / 2);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedSceneIndex]);

  // Navigate to previous scene
  const handleNavigatePrevious = useCallback(() => {
    if (selectedSceneIndex > 0) {
      setSelectedSceneIndex(selectedSceneIndex - 1);
    }
  }, [selectedSceneIndex, setSelectedSceneIndex]);

  // Navigate to next scene
  const handleNavigateNext = useCallback(() => {
    if (selectedSceneIndex < scenes.length - 1) {
      setSelectedSceneIndex(selectedSceneIndex + 1);
    }
  }, [selectedSceneIndex, scenes.length, setSelectedSceneIndex]);

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

  const handleCreateFromWizard = useCallback(() => {
    // Open AI Wizard
    openWizard();
  }, [openWizard]);

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
    
    // Set loading state in store
    useSceneStore.getState().setPreviewLoading(true);
    useSceneStore.getState().setPreviewMode(true);
    
    // Set the starting scene index for preview
    useSceneStore.getState().setPreviewStartSceneIndex(index);
    
    // Simulate video generation/retrieval (mock)
    // In a real implementation, this would call the backend to generate a preview
    // or use a pre-generated preview URL from the scene data
    
    // Mock delay to simulate video processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock video URL
    const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    
    // Start preview with the mock URL (this will set loading to false)
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
    <div className="bg-white flex h-full shadow-sm relative">
      {/* Left Navigation Button */}
      <button
        onClick={handleNavigatePrevious}
        disabled={selectedSceneIndex === 0}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg border border-gray-200 transition-all ${
          selectedSceneIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
        }`}
        title="Scène précédente"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={handleNavigateNext}
        disabled={selectedSceneIndex >= scenes.length - 1}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg border border-gray-200 transition-all ${
          selectedSceneIndex >= scenes.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
        }`}
        title="Scène suivante"
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </button>

      {/* Scene Container - Hide Scrollbar */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto p-3 scrollbar-hide"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
      >
        <div className="flex gap-4 h-full items-start">
          {/* Render all scenes without chapters */}
          {scenes.map((scene, index) => (
            <Card
              key={scene.id}
              ref={(el) => (sceneRefs.current[index] = el)}
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
                        Prévisualiser depuis ici
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
        onCreateFromWizard={handleCreateFromWizard}
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