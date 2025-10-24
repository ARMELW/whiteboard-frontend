import React, { useState } from 'react';
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
import { useScenes, useSceneStore, useCurrentScene } from '@/app/scenes';

const AnimationContainer: React.FC = () => {
  const currentScene = useCurrentScene();
  const showShapeToolbar = useSceneStore((state: any) => state.showShapeToolbar);
  const showAssetLibrary = useSceneStore((state: any) => state.showAssetLibrary);
  const showHistoryPanel = useSceneStore((state: any) => state.showHistoryPanel);
  const setShowHistoryPanel = useSceneStore((state: any) => state.setShowHistoryPanel);
  
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false);

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
      
      {/* Header */}
      <AnimationHeader 
        onOpenTemplateLibrary={() => setShowTemplateLibrary(true)}
        onSaveAsTemplate={() => setShowSaveAsTemplate(true)}
        hasCurrentScene={!!currentScene}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Main content area with left context tabs, center editor, and right properties */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Context Tabs Panel */}
          <div className="w-80 flex-shrink-0 border-r border-gray-700 bg-gray-50">
            <ContextTabs />
          </div>
          
          {/* Center: Layer Editor */}
          <div className="flex-1 overflow-y-auto bg-white">
            {currentScene && <LayerEditor />}
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
          <ScenePanel />
        </div>
      </div>
    </div>
  );
};

export { AnimationContainer };