import React, { useCallback, useMemo } from 'react';
import { Settings, Layers as LayersIcon, Film } from 'lucide-react';
import ScenePropertiesPanel from '../atoms/ScenePropertiesPanel';
import { LayerPropertiesForm, LayersListPanel } from '../molecules';
import { useCurrentScene, useSceneStore } from '@/app/scenes';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import VideoGenerationPanel from './VideoGenerationPanel';

type TabType = 'properties' | 'layers' | 'export';

const PropertiesPanel: React.FC = () => {
  const scene = useCurrentScene();
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  const selectedLayerIds = useSceneStore((state) => state.selectedLayerIds);
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  const activeTab = useSceneStore((state) => state.activeTab) as TabType;
  const setActiveTab = useSceneStore((state) => state.setActiveTab);

  const { updateScene, updateSceneProperty, updateLayerProperty, deleteLayer, moveLayer, duplicateLayer } = useScenesActionsWithHistory();

  if (!scene) {
    return (
      <div className="bg-white flex flex-col border-l border-border h-full">
        <div className="bg-secondary/30 px-4 py-3 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Propriétés</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-muted-foreground text-xs text-center">
            Sélectionnez une scène pour voir ses propriétés
          </p>
        </div>
      </div>
    );
  }

  const selectedLayer = useMemo(() => 
    scene.layers?.find((layer: any) => layer.id === selectedLayerId),
    [scene.layers, selectedLayerId]
  );

  const handleSceneChange = useCallback((field: string, value: any) => {
    if (!scene.id) return;
    updateSceneProperty(scene.id, field, value);
  }, [scene.id, updateSceneProperty]);

  const handleLayerPropertyChange = useCallback((layerId: string, property: string, value: any) => {
    if (!scene.id) return;
    updateLayerProperty(scene.id, layerId, property, value);
  }, [scene.id, updateLayerProperty]);

  const tabs = [
    { id: 'properties' as TabType, label: 'Properties', icon: Settings },
    { id: 'layers' as TabType, label: 'Layers', icon: LayersIcon },
    { id: 'export' as TabType, label: 'Export', icon: Film },
  ];

  return (
    <div className="bg-white flex flex-col border-l border-border overflow-hidden h-full">
      {/* Tabs Header */}
      <div className="flex border-b border-border bg-secondary/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 py-3 flex flex-col items-center justify-center gap-1 transition-colors text-xs font-medium ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-muted-foreground hover:bg-secondary/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'properties' && (
          <div className="space-y-4">
            {/* Show multi-selection info */}
            {selectedLayerIds.length > 1 && (
              <div className="bg-primary/10 border border-primary rounded-lg p-3">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Multiple Layers Selected
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedLayerIds.length} layers selected
                </p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <p>• Drag any layer to move all together</p>
                  <p>• Press Delete to remove all selected</p>
                </div>
              </div>
            )}
            
            {/* Show Scene Properties when no layer is selected */}
            {!selectedLayer && selectedLayerIds.length <= 1 && (
              <ScenePropertiesPanel scene={scene} handleSceneChange={handleSceneChange} />
            )}

            {/* Show Selected Layer Properties */}
            {selectedLayer && selectedLayerIds.length === 1 && (
              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Layer Properties</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedLayer.type === 'text' ? '📝 Text Layer' : 
                     selectedLayer.type === 'image' ? '🖼️ Image Layer' : 
                     selectedLayer.type === 'shape' ? '⬛ Shape Layer' : 'Layer'}
                  </p>
                </div>
                <LayerPropertiesForm
                  layer={selectedLayer}
                  onPropertyChange={handleLayerPropertyChange}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-4">
            <VideoGenerationPanel />
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-4">
            {scene && scene.layers && scene.layers.length > 0 ? (
              <LayersListPanel
                layers={scene.layers || []}
                selectedLayerId={selectedLayerId}
                onSelectLayer={setSelectedLayerId}
                onMoveLayer={(layerId, direction) => {
                  if (!scene.id) return;
                  moveLayer({ sceneId: scene.id, layerId, direction });
                }}
                onDuplicateLayer={(layerId) => {
                  if (!scene.id) return;
                  duplicateLayer({ sceneId: scene.id, layerId });
                }}
                onDeleteLayer={(layerId: string) => {
                  if (!scene.id) return;
                  deleteLayer({ sceneId: scene.id, layerId });
                }}
              />
            ) : (
              <div className="text-center py-8">
                <LayersIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No layers in this scene</p>
                <p className="text-xs text-muted-foreground mt-1">Add images or text from the left panel</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PropertiesPanel);
