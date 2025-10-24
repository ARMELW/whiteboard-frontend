import React, { useEffect, useCallback } from 'react';
import { Save, Download, Undo, Redo, FileVideo, Play, Clock, Library, BookmarkPlus, Camera, Plus, ZoomIn, ZoomOut, Lock, Unlock } from 'lucide-react';
import { useSceneStore } from '@/app/scenes';
import { useHistory } from '@/app/history';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Camera as CameraType } from '@/app/scenes/types';

interface AnimationHeaderProps {
  onOpenTemplateLibrary: () => void;
  onSaveAsTemplate: () => void;
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
  const setActiveTab = useSceneStore((state) => state.setActiveTab);
  const showHistoryPanel = useSceneStore((state) => state.showHistoryPanel);
  const setShowHistoryPanel = useSceneStore((state) => state.setShowHistoryPanel);
  
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
    // Switch to export tab in properties panel
    setActiveTab('export');
  };

  const handlePreviewClick = () => {
    // For now, just open the export tab
    // The actual preview will be triggered from VideoGenerationPanel
    setActiveTab('export');
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  return (
    <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
      {/* Left: Logo & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileVideo className="w-6 h-6 text-purple-500" />
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
                  {cameras.map((camera, index) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {index + 1}. {camera.name || `Camera ${camera.id}`} ({camera.zoom.toFixed(1)}x)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <button
              onClick={onAddCamera}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors text-sm"
              title="Ajouter une caméra"
            >
              <Plus className="w-4 h-4" />
            </button>
            
            <button
              onClick={onOpenCameraManager}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1.5 px-3 rounded flex items-center gap-1 transition-colors text-sm"
              title="Gérer les caméras"
            >
              Gérer
            </button>
            
            {/* Scene Zoom Controls */}
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
            
            {/* Camera Lock/Unlock (if camera selected and not default) */}
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
                <span className="text-xs">{selectedCamera.locked ? 'Verrouillé' : 'Déverrouillé'}</span>
              </button>
            )}
            
            <div className="h-6 w-px bg-gray-700" />
          </>
        )}
      </div>

      {/* Center: Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-2 rounded transition-colors ${
            canUndo
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
          className={`p-2 rounded transition-colors ${
            canRedo
              ? 'hover:bg-gray-800 text-gray-300'
              : 'text-gray-500 cursor-not-allowed'
          }`}
          title="Rétablir (Ctrl+Y)"
        >
          <Redo className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowHistoryPanel(!showHistoryPanel)}
          className={`p-2 rounded transition-colors ${
            showHistoryPanel
              ? 'bg-purple-600 text-white'
              : 'hover:bg-gray-800 text-gray-300'
          }`}
          title="Afficher l'historique"
        >
          <Clock className="w-5 h-5" />
        </button>
        <div className="h-6 w-px  mx-2" />
        <button
          onClick={handlePreviewClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          title="Prévisualiser"
        >
          <Play className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Save & Export */}
      <div className="flex items-center gap-2">
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
          className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
            hasCurrentScene
              ? 'hover:bg-gray-800 text-gray-300'
              : 'text-gray-500 cursor-not-allowed'
          }`}
          title="Sauvegarder comme template"
        >
          <BookmarkPlus className="w-4 h-4" />
        </button>
        <div className="h-6 w-px bg-gray-700 mx-2" />
        <button
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-gray-300 rounded transition-colors"
        >
          <Save className="w-4 h-4" />
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