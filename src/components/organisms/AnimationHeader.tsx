import React, { useEffect, useCallback } from 'react';
import { Save, Download, Undo, Redo, FileVideo, Play, Clock, Library, BookmarkPlus, Camera, Plus, ZoomIn, ZoomOut, Lock, Unlock, Sparkles, Loader2, ImageIcon, Check, Film } from 'lucide-react';
import { useSceneStore, useSaveScene } from '@/app/scenes';
import { useWizardStore } from '@/app/wizard';
import { useHistory } from '@/app/history';
import { useQuickPreview } from '@/hooks/useQuickPreview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Camera as CameraType } from '@/app/scenes/types';
import { useNavigate } from 'react-router-dom';

interface AnimationHeaderProps {
  onOpenTemplateLibrary: () => void;
  onSaveAsTemplate: () => void;
  onOpenExportModal: () => void;
  onOpenThumbnailMaker?: () => void;
  hasCurrentScene: boolean;
  cameras?: CameraType[];
  selectedCameraId?: string | null;
  onAddCamera?: () => void;
  onSelectCamera?: (id: string | null) => void;
  onToggleLock?: (cameraId: string) => void;
  sceneZoom?: number;
  onSceneZoom?: (zoom: number) => void;
  onOpenCameraManager?: () => void;
}

const AnimationHeader: React.FC<AnimationHeaderProps> = ({
  onOpenTemplateLibrary,
  onSaveAsTemplate,
  onOpenExportModal,
  onOpenThumbnailMaker,
  hasCurrentScene,
  cameras = [],
  selectedCameraId = null,
  onAddCamera,
  onSelectCamera,
  onToggleLock,
  sceneZoom = 1.0,
  onSceneZoom,
  onOpenCameraManager,
}) => {
  const showHistoryPanel = useSceneStore((state) => state.showHistoryPanel);
  const setShowHistoryPanel = useSceneStore((state) => state.setShowHistoryPanel);
  const showMiniScenePanel = useSceneStore((state) => state.showMiniScenePanel);
  const setShowMiniScenePanel = useSceneStore((state) => state.setShowMiniScenePanel);
  const openWizard = useWizardStore((state) => state.openWizard);
  const { generatePreview, isGenerating } = useQuickPreview();
  const { saveAllScenes, isSaving, lastSaved } = useSaveScene();
  const navigate = useNavigate();
  const { undo, redo, canUndo, canRedo } = useHistory();

  const effectiveSelectedCameraId = selectedCameraId || (cameras.length > 0 ? cameras[0].id : null);
  const selectedCamera = cameras.find(c => c.id === effectiveSelectedCameraId);

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  const handleExportClick = () => {
    // Open export modal
    onOpenExportModal();
  };

  const handlePreviewClick = async () => {
    // Generate and show quick preview immediately
    await generatePreview();
  };

  const handleSaveClick = async () => {
    // Sauvegarder toutes les scènes vers le backend
    await saveAllScenes();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
      // Ctrl+S or Cmd+S for save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);


  return (
    <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
      {/* Left: Logo & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => navigate(-1)}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 16L7.5 10L12.5 4" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Retour</span>
          </button>
        </div>
        <div className="h-6 w-px bg-gray-700" />

        {/* Camera Controls */}
        {hasCurrentScene && cameras.length > 0 && (
          <>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-500" />
              <Select
                value={selectedCameraId || 'none'}
                onValueChange={(value) => onSelectCamera && onSelectCamera(value === 'none' ? null : value)}
              >
                <SelectTrigger className="bg-white text-foreground border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary max-w-[200px]">
                  <SelectValue placeholder="Aucune sélection" />
                </SelectTrigger>
                <SelectContent style={{ maxHeight: '300px' }}>
                  <SelectItem value="none">Aucune sélection</SelectItem>
                  {cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {camera.name || `Camera ${camera.id}`} ({camera.zoom ? camera.zoom.toFixed(1) : '1.0'}x)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Camera count badge */}
              {cameras.filter(c => !c.isDefault).length > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                  {cameras.filter(c => !c.isDefault).length} caméra{cameras.filter(c => !c.isDefault).length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <button
              onClick={onAddCamera}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors text-sm"
              title="Ajouter une caméra"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Caméra</span>
            </button>
            
            <button
              onClick={onOpenCameraManager}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors text-sm"
              title="Gérer les caméras"
            >
              <span>Gérer</span>
            </button>
            
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => onSceneZoom && onSceneZoom(Math.max(0.5, sceneZoom - 0.1))}
                className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded transition-colors"
                title="Dézoom scène"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-gray-700 font-semibold text-xs min-w-[3rem] text-center">
                {(sceneZoom * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => onSceneZoom && onSceneZoom(Math.min(1.0, sceneZoom + 0.1))}
                className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded transition-colors"
                title="Zoom scène"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {selectedCamera && !selectedCamera.isDefault && (
              <button
                onClick={() => onToggleLock && onToggleLock(selectedCamera.id)}
                className={`${
                  selectedCamera.locked 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                } text-white p-1 rounded transition-colors flex items-center gap-1`}
                title={selectedCamera.locked ? 'Déverrouiller caméra' : 'Verrouiller caméra'}
              >
                {selectedCamera.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span className="text-xs hidden md:inline">{selectedCamera.locked ? 'Verrouillé' : 'Déverrouillé'}</span>
              </button>
            )}
            
            <div className="h-6 w-px bg-gray-700" />
          </>
        )}

        {/* Center: Quick Actions */}
        {/* AI Wizard Button 
        <button
          onClick={openWizard}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded transition-all shadow-md hover:shadow-lg"
          title="Assistant IA - Créer un projet automatiquement"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">Assistant IA</span>
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        */}
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-2 rounded transition-colors ${!canUndo
              ? 'hover:bg-gray-800 text-gray-300'
              : 'text-gray-500 cursor-not-allowed'
            }`}
          title="Annuler (Ctrl+Z)"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={`p-2 rounded transition-colors ${!canRedo
              ? 'hover:bg-gray-800 text-gray-300'
              : 'text-gray-500 cursor-not-allowed'
            }`}
          title="Rétablir (Ctrl+Y)"
        >
          <Redo className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowHistoryPanel(!showHistoryPanel)}
          className={`p-2 rounded transition-colors ${showHistoryPanel
              ? 'bg-purple-600 text-white'
              : 'hover:bg-gray-800 text-gray-300'
            }`}
          title="Afficher l'historique"
        >
          <Clock className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowMiniScenePanel(!showMiniScenePanel)}
          disabled={!hasCurrentScene}
          className={`p-2 rounded transition-colors ${
            !hasCurrentScene
              ? 'text-gray-500 cursor-not-allowed'
              : showMiniScenePanel
              ? 'bg-purple-600 text-white'
              : 'hover:bg-gray-800 text-gray-300'
            }`}
          title="Mini-scènes"
        >
          <Film className="w-5 h-5" />
        </button>
        <div className="h-6 w-px  mx-2" />

      </div>

      {/* Right: Save & Export */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePreviewClick}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${isGenerating
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          title={isGenerating ? "Génération en cours..." : "Prévisualiser"}
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isGenerating ? 'Génération...' : ''}
        </button>
        <button
          onClick={onOpenTemplateLibrary}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-gray-300 rounded transition-colors"
          title="Bibliothèque de templates"
        >
          <Library className="w-4 h-4" />
          <span className="text-sm">Templates</span>
        </button>
        <button
          onClick={onSaveAsTemplate}
          disabled={!hasCurrentScene}
          className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${hasCurrentScene
              ? 'hover:bg-gray-800 text-gray-300'
              : 'text-gray-500 cursor-not-allowed'
            }`}
          title="Sauvegarder comme template"
        >
          <BookmarkPlus className="w-4 h-4" />
        </button>
        {onOpenThumbnailMaker && (
          <button
            onClick={onOpenThumbnailMaker}
            disabled={!hasCurrentScene}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${hasCurrentScene
                ? 'hover:bg-gray-800 text-gray-300'
                : 'text-gray-500 cursor-not-allowed'
              }`}
            title="Créer une miniature YouTube"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm">Miniature</span>
          </button>
        )}
        <div className="h-6 w-px bg-gray-700 mx-2" />
        <button
          onClick={handleSaveClick}
          disabled={isSaving || !hasCurrentScene}
          className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${isSaving
              ? 'bg-gray-600 cursor-wait'
              : lastSaved
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : hasCurrentScene
                  ? 'hover:bg-gray-800 text-gray-300'
                  : 'text-gray-500 cursor-not-allowed'
            }`}
          title={
            isSaving
              ? 'Sauvegarde en cours...'
              : lastSaved
                ? `Dernière sauvegarde: ${lastSaved.toLocaleTimeString()}`
                : 'Sauvegarder (Ctrl+S)'
          }
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : lastSaved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving && <span className="text-xs">Sauvegarde...</span>}
        </button>
        <button
          onClick={handleExportClick}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Exporter</span>
        </button>
      </div>
    </header>
  );
};

export default AnimationHeader;