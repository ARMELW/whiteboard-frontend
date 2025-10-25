import React, { useRef, useState } from 'react';
import { Button, Card } from '../atoms';
import { Plus, ArrowUp, ArrowDown, Copy, Trash2, Download, Upload, MoreVertical, ChevronLeft, ChevronRight, FolderKanban } from 'lucide-react';
import { useScenes, useSceneStore, useScenesActions } from '@/app/scenes';
import { THUMBNAIL_CONFIG } from '@/utils/sceneThumbnail';
import ChapterManager, { Chapter } from './ChapterManager';

const SceneCard: React.FC<{
  scene: any;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}> = ({
  scene,
  index,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  const formatSceneDuration = (duration: number): string => {
    const totalSeconds = Math.floor(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      className={`flex-shrink-0 w-64 cursor-pointer transition-all hover:shadow-md relative group ${isSelected
          ? 'border-primary shadow-md ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50'
        }`}
      onClick={onSelect}
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
            <span className="text-4xl">📄</span>
          )}
        </div>

        {/* Scene number badge - top left */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
          {index + 1}
        </div>

        {/* Scene duration badge - bottom left */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
          <span>{formatSceneDuration(scene.duration)}</span>
        </div>

        {/* Actions dropdown - top right, visible on hover or when selected */}
        <div 
          ref={menuRef}
          className={`absolute top-2 right-2 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
        >
          <button
            className="inline-flex items-center justify-center h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-border z-50">
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp();
                    setIsMenuOpen(false);
                  }}
                  disabled={!canMoveUp}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Déplacer à gauche
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown();
                    setIsMenuOpen(false);
                  }}
                  disabled={!canMoveDown}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Déplacer à droite
                </button>
                <div className="my-1 h-px bg-border"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 flex items-center"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Dupliquer
                </button>
                <div className="my-1 h-px bg-border"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 flex items-center text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const ScenePanel: React.FC = () => {
  // Pour ouvrir asset library et shape toolbar
  // const setShowAssetLibrary = useSceneStore((state) => state.setShowAssetLibrary); // No longer used for direct image upload
  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);
  const setShowShapeToolbar = useSceneStore((state) => state.setShowShapeToolbar);
  const { scenes } = useScenes();
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const setSelectedSceneIndex = useSceneStore((state) => state.setSelectedSceneIndex);
  const chapters = useSceneStore((state) => state.chapters);
  const setChapters = useSceneStore((state) => state.setChapters);
  const importInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scenesScrollRef = useRef<HTMLDivElement>(null);
  const [useChapterView, setUseChapterView] = useState(false);
  
  // Use actions from useScenesActions hook
  const { createScene, deleteScene, duplicateScene, reorderScenes } = useScenesActions();

  const handleAddScene = async () => {
    const currentLength = scenes.length;
    await createScene({});
    // After creation, the new scene will be at the end of the array
    // React Query will refetch and scenes array will have +1 length
    // So we set to currentLength which will be the new scene's index
    setSelectedSceneIndex(currentLength);
  };

  const handleMoveScene = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= scenes.length) return;

    const reorderedScenes = [...scenes];
    const [movedScene] = reorderedScenes.splice(index, 1);
    reorderedScenes.splice(newIndex, 0, movedScene);

    await reorderScenes(reorderedScenes.map(s => s.id));
    setSelectedSceneIndex(newIndex);
  };

  const handleDuplicateScene = async (index: number) => {
    const scene = scenes[index];
    const currentLength = scenes.length;
    await duplicateScene(scene.id);
    // After duplication, the new scene will be at the end of the array
    setSelectedSceneIndex(currentLength);
  };

  const handleDeleteScene = async (index: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette scène ?')) return;
    
    const scene = scenes[index];
    await deleteScene(scene.id);
    
    // Adjust selected index after deletion
    if (selectedSceneIndex >= scenes.length - 1) {
      setSelectedSceneIndex(Math.max(0, scenes.length - 2));
    }
  };

  // Handle image file selection for direct upload/crop
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImageData({
        imageUrl: event.target?.result,
        fileName: file.name,
        originalUrl: event.target?.result,
        fileType: file.type
      });
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Scroll navigation functions
  const scrollScenes = (direction: 'left' | 'right') => {
    if (!scenesScrollRef.current) return;
    const scrollAmount = 300; // Scroll by 300px
    const newScrollLeft = scenesScrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
    scenesScrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Navigate to specific scene and scroll into view
  const navigateToScene = (index: number) => {
    setSelectedSceneIndex(index);
    // Auto-scroll to center the selected scene
    if (scenesScrollRef.current) {
      const sceneCards = scenesScrollRef.current.querySelectorAll('.scene-card');
      const selectedCard = sceneCards[index] as HTMLElement;
      if (selectedCard) {
        const containerWidth = scenesScrollRef.current.offsetWidth;
        const cardLeft = selectedCard.offsetLeft;
        const cardWidth = selectedCard.offsetWidth;
        const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
        scenesScrollRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="bg-white flex h-full shadow-sm">
      {/* Header - Now on the left side */}
      <div className="w-64 p-3 border-r border-border bg-secondary/30 flex flex-col flex-shrink-0">
       
        <Button
          onClick={handleAddScene}
          className="w-full gap-2 mb-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
        <Button
          onClick={() => imageInputRef.current?.click()}
          className="w-full gap-2 mb-2"
          size="sm"
          variant="outline"
        >
          <Upload className="w-4 h-4" />
          Ajouter une image
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="hidden"
        />
        <Button
          onClick={() => setShowShapeToolbar(true)}
          className="w-full gap-2 mb-2"
          size="sm"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          Ajouter une forme
        </Button>
        
        <div className="h-px bg-border my-2"></div>
        
        {/* Toggle Chapter View */}
        <Button
          onClick={() => setUseChapterView(!useChapterView)}
          className="w-full gap-2 mb-2"
          size="sm"
          variant={useChapterView ? 'default' : 'outline'}
        >
          <FolderKanban className="w-4 h-4" />
          {useChapterView ? 'Vue chapitres' : 'Vue simple'}
        </Button>
        
        <div className="h-px bg-border my-2"></div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => { }}
            variant="outline"
            className="flex-1 gap-2"
            size="sm"
            title="Exporter la configuration"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button
            onClick={() => importInputRef.current?.click()}
            variant="outline"
            className="flex-1 gap-2"
            size="sm"
            title="Importer une configuration"
          >
            <Upload className="w-3.5 h-3.5" />
          </Button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            onChange={() => { }}
            className="hidden"
          />
        </div>
      </div>

      {/* Navigation buttons and Scenes List */}
      <div className="flex-1 flex items-center overflow-hidden">
        {!useChapterView && (
          <>
            {/* Left Navigation Button */}
            <button
              onClick={() => scrollScenes('left')}
              className="flex-shrink-0 p-2 hover:bg-secondary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={scenes.length === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Scenes List - Now horizontal with hidden scrollbar */}
            <div 
              ref={scenesScrollRef}
              className="flex-1 overflow-x-auto p-3 hide-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="flex gap-3 h-full">
              {scenes.map((scene: any, index: number) => (
                <div key={scene.id} className="scene-card">
                  <SceneCard
                    scene={scene}
                    index={index}
                    isSelected={selectedSceneIndex === index}
                    onSelect={() => navigateToScene(index)}
                    onMoveUp={() => handleMoveScene(index, 'up')}
                    onMoveDown={() => handleMoveScene(index, 'down')}
                    onDuplicate={() => handleDuplicateScene(index)}
                    onDelete={() => handleDeleteScene(index)}
                    canMoveUp={index !== 0}
                    canMoveDown={index !== scenes.length - 1}
                  />
                </div>
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

            {/* Right Navigation Button */}
            <button
              onClick={() => scrollScenes('right')}
              className="flex-shrink-0 p-2 hover:bg-secondary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={scenes.length === 0}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Chapter View */}
        {useChapterView && (
          <div className="flex-1 overflow-y-auto p-3">
            <ChapterManager
              chapters={chapters}
              totalScenes={scenes.length}
              onChaptersChange={setChapters}
              onSelectScene={navigateToScene}
              selectedSceneIndex={selectedSceneIndex}
              renderSceneCard={(index: number) => {
                const scene = scenes[index];
                if (!scene) return null;
                return (
                  <SceneCard
                    scene={scene}
                    index={index}
                    isSelected={selectedSceneIndex === index}
                    onSelect={() => navigateToScene(index)}
                    onMoveUp={() => handleMoveScene(index, 'up')}
                    onMoveDown={() => handleMoveScene(index, 'down')}
                    onDuplicate={() => handleDuplicateScene(index)}
                    onDelete={() => handleDeleteScene(index)}
                    canMoveUp={index !== 0}
                    canMoveDown={index !== scenes.length - 1}
                  />
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenePanel;
