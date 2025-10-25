import React, { useState, useCallback } from 'react';
import { LayersList } from '../molecules';
import LayerEditor from './LayerEditor';
import PropertiesPanel from './PropertiesPanel';
import AssetLibrary from './AssetLibrary';
import ShapeToolbar from './ShapeToolbar';
import ScenePanel from './ScenePanel';
import ContextTabs from './ContextTabs';
import VideoPreviewModal from './VideoPreviewModal';
import ExportModal from './ExportModal';
import { useScenes, useSceneStore, useCurrentScene } from '@/app/scenes';
import { Play, Download } from 'lucide-react';
import { Button } from '../atoms';

const AnimationContainer: React.FC = () => {
  const { scenes = [] } = useScenes();
  const currentScene = useCurrentScene();
  const showShapeToolbar = useSceneStore((state: any) => state.showShapeToolbar);
  const showAssetLibrary = useSceneStore((state: any) => state.showAssetLibrary);
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const [editedScene, setEditedScene] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showPreviewFromCurrent, setShowPreviewFromCurrent] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [canvasForExport, setCanvasForExport] = useState<HTMLCanvasElement | null>(null);

  const handleEditedSceneChange = useCallback((scene: any) => {
    setEditedScene(scene);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  const handleCloseFullPreview = useCallback(() => {
    setShowFullPreview(false);
  }, []);

  const handleClosePreviewFromCurrent = useCallback(() => {
    setShowPreviewFromCurrent(false);
  }, []);

  const handleCloseExportModal = useCallback(() => {
    setShowExportModal(false);
  }, []);

  return (
    <div className="animation-container">
      {showAssetLibrary && <AssetLibrary />}
      {showShapeToolbar && <ShapeToolbar />}
      
      {/* Video Preview Modal */}
      {showPreview && (
        <VideoPreviewModal
          isOpen={showPreview}
          onClose={handleClosePreview}
          sceneId={currentScene?.id}
          isFullPreview={false}
        />
      )}
      
      {/* Full Preview Modal */}
      {showFullPreview && (
        <VideoPreviewModal
          isOpen={showFullPreview}
          onClose={handleCloseFullPreview}
          isFullPreview={true}
          scenes={scenes}
        />
      )}
      
      {/* Preview From Current Scene Modal */}
      {showPreviewFromCurrent && (
        <VideoPreviewModal
          isOpen={showPreviewFromCurrent}
          onClose={handleClosePreviewFromCurrent}
          isFullPreview={true}
          startFromSceneIndex={selectedSceneIndex}
          scenes={scenes}
        />
      )}
      
      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={handleCloseExportModal}
          canvas={canvasForExport}
        />
      )}
      
      <div className="flex flex-col h-screen">
        {/* Header with Preview and Export buttons */}
        <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">Whiteboard Animation</h1>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!currentScene}
            >
              <Play className="w-4 h-4" />
              Prévisualiser la scène
            </Button>
            
            <Button
              onClick={() => setShowPreviewFromCurrent(true)}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={scenes.length === 0 || selectedSceneIndex < 0}
            >
              <Play className="w-4 h-4" />
              Depuis cette scène
            </Button>
            
            <Button
              onClick={() => setShowFullPreview(true)}
              variant="default"
              size="sm"
              className="gap-2"
              disabled={scenes.length === 0}
            >
              <Play className="w-4 h-4" />
              Prévisualisation complète
            </Button>
            
            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!currentScene}
            >
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          </div>
        </div>
        
        {/* Main content area with left context tabs, center editor, and right properties */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Context Tabs Panel */}
          <div className="w-64 flex-shrink-0">
            <ContextTabs />
          </div>
          
          {/* Center: Layer Editor */}
          <div className="flex-1 overflow-y-auto">
            {currentScene && <LayerEditor onEditedSceneChange={handleEditedSceneChange} />}
          </div>
          
          {/* Right: Properties Panel */}
          <div className="w-80 flex-shrink-0">
            {currentScene && <PropertiesPanel editedScene={editedScene} />}
          </div>
        </div>
        
        {/* Bottom: Scenes Panel */}
        <div className="h-48 border-t border-border overflow-y-auto flex-shrink-0">
          <ScenePanel />
        </div>
      </div>
    </div>
  );
};

export { AnimationContainer };