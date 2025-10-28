import React, { useState, useEffect } from 'react';
import AnimationHeader from './AnimationHeader';
import { LayersList } from '../molecules';
import LayerEditor from './LayerEditor';
import PropertiesPanel from './PropertiesPanel';
import AssetLibrary from './AssetLibrary';
import ShapeToolbar from './ShapeToolbar';
import ScenePanel from './ScenePanel';
import ContextTabs from './ContextTabs';
import HistoryPanel from './HistoryPanel';
import TemplateLibrary from './TemplateLibrary';
import SaveAsTemplateDialog from './SaveAsTemplateDialog';
import CameraManagerModal from './CameraManagerModal';
import ExportModal from './ExportModal';
import ThumbnailMaker from './ThumbnailMaker';
import { AiWizardDialog } from './wizard';
import { useScenes, useSceneStore, useCurrentScene, useScenesActions } from '@/app/scenes';
import { useAssets, useAssetsActions } from '@/app/assets';
import { useFonts } from '@/app/text';
import type { Camera } from '@/app/scenes/types';

const AnimationContainer: React.FC = () => {
  const currentScene = useCurrentScene();

  const showShapeToolbar = useSceneStore((state: any) => state.showShapeToolbar);
  const showAssetLibrary = useSceneStore((state: any) => state.showAssetLibrary);
  const showHistoryPanel = useSceneStore((state: any) => state.showHistoryPanel);
  const setShowHistoryPanel = useSceneStore((state: any) => state.setShowHistoryPanel);
  
  // Load assets dynamically from API
  const { assets, loading: assetsLoading, loadAssets } = useAssets();
  const assetsActions = useAssetsActions();
  
  // Load fonts dynamically from API
  const { fonts, loading: fontsLoading } = useFonts();
  
  // Load scenes dynamically from API
  const { scenes, loading: scenesLoading, refetch: refetchScenes } = useScenes();
  const scenesActions = useScenesActions();
  
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false);
  const [showCameraManager, setShowCameraManager] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showThumbnailMaker, setShowThumbnailMaker] = useState(false);
  
  // Camera state lifted from SceneCanvas
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [sceneZoom, setSceneZoom] = useState<number>(0.8);
  const [cameraCallbacks, setCameraCallbacks] = useState<{
    onAddCamera?: () => void;
    onToggleLock?: (cameraId: string) => void;
    onSaveCameras?: (cameras: Camera[]) => Promise<void>;
  }>({});

  // Log loaded resources for debugging
  useEffect(() => {
    if (!assetsLoading && assets.length > 0) {
      console.log('[AnimationContainer] Assets loaded:', assets.length);
    }
  }, [assets, assetsLoading]);

  useEffect(() => {
    if (!fontsLoading && fonts.length > 0) {
      console.log('[AnimationContainer] Fonts loaded:', fonts.length);
    }
  }, [fonts, fontsLoading]);

  useEffect(() => {
    if (!scenesLoading && scenes.length > 0) {
      console.log('[AnimationContainer] Scenes loaded:', scenes.length);
    }
  }, [scenes, scenesLoading]);

  return (
    <div className="animation-container flex flex-col h-screen">
      {showAssetLibrary && <AssetLibrary />}
      {showShapeToolbar && <ShapeToolbar />}
      {showTemplateLibrary && (
        <TemplateLibrary 
          isOpen={showTemplateLibrary} 
          onClose={() => setShowTemplateLibrary(false)} 
        />
      )}
      {showSaveAsTemplate && currentScene && (
        <SaveAsTemplateDialog
          isOpen={showSaveAsTemplate}
          onClose={() => setShowSaveAsTemplate(false)}
          scene={currentScene}
        />
      )}
      {showCameraManager && (
        <CameraManagerModal
          cameras={cameras}
          onClose={() => setShowCameraManager(false)}
          onSave={async (updatedCameras) => {
            setCameras(updatedCameras);
            if (cameraCallbacks.onSaveCameras) {
              await cameraCallbacks.onSaveCameras(updatedCameras);
            }
          }}
        />
      )}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />
      )}
      {showThumbnailMaker && currentScene && (
        <ThumbnailMaker
          scene={currentScene}
          onClose={() => setShowThumbnailMaker(false)}
        />
      )}
      
      {/* AI Wizard Dialog */}
      <AiWizardDialog />
      
      {/* Header */}
      <AnimationHeader 
        onOpenTemplateLibrary={() => setShowTemplateLibrary(true)}
        onSaveAsTemplate={() => setShowSaveAsTemplate(true)}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenThumbnailMaker={() => setShowThumbnailMaker(true)}
        hasCurrentScene={!!currentScene}
        cameras={cameras}
        selectedCameraId={selectedCameraId}
        onAddCamera={cameraCallbacks.onAddCamera}
        onSelectCamera={setSelectedCameraId}
        onToggleLock={cameraCallbacks.onToggleLock}
        sceneZoom={sceneZoom}
        onSceneZoom={setSceneZoom}
        onOpenCameraManager={() => setShowCameraManager(true)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Main content area with left context tabs, center editor, and right properties */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Context Tabs Panel */}
          <div className="w-96 flex-shrink-0 border-r border-gray-700 bg-gray-50">
            <ContextTabs />
          </div>
          
          {/* Center: Layer Editor */}
          <div className="flex-1 overflow-y-auto bg-white">
            {currentScene && (
              <LayerEditor 
                sceneZoom={sceneZoom}
                onSceneZoomChange={setSceneZoom}
                selectedCameraId={selectedCameraId}
                onCameraStateChange={(state) => {
                  setCameras(state.cameras);
                  setSelectedCameraId(state.selectedCameraId);
                  // Don't set sceneZoom here since it's now controlled
                  setCameraCallbacks(state.callbacks);
                }}
              />
            )}
          </div>
          
          {/* Right: Properties Panel or History Panel */}
          <div className="w-80 flex-shrink-0 border-l border-gray-700 bg-gray-50">
            {showHistoryPanel ? (
              <HistoryPanel onClose={() => setShowHistoryPanel(false)} />
            ) : (
              currentScene && <PropertiesPanel />
            )}
          </div>
        </div>
        
        {/* Bottom: Scenes Panel */}
        <div className="h-48 border-t border-gray-700 overflow-y-auto flex-shrink-0 bg-gray-100">
          <ScenePanel 
            onOpenTemplateLibrary={() => setShowTemplateLibrary(true)}
          />
        </div>
      </div>
    </div>
  );
};

export { AnimationContainer };