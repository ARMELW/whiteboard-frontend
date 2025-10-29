import React, { useCallback, useMemo } from 'react';
import { Settings } from 'lucide-react';
import ScenePropertiesPanel from '../atoms/ScenePropertiesPanel';
import { LayerPropertiesForm } from '../molecules';
import { useCurrentScene, useSceneStore } from '@/app/scenes';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';

type TabType = 'properties';

const PropertiesPanel: React.FC = () => {
  const scene = useCurrentScene();
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  const selectedLayerIds = useSceneStore((state) => state.selectedLayerIds);
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);

  const { updateScene, updateSceneProperty, updateLayerProperty } = useScenesActionsWithHistory();

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
    
    // If multiple layers are selected, apply changes to all of them
    if (selectedLayerIds.length > 1) {
      selectedLayerIds.forEach((selectedId) => {
        updateLayerProperty(scene.id, selectedId, property, value);
      });
    } else {
      updateLayerProperty(scene.id, layerId, property, value);
    }
  }, [scene.id, updateLayerProperty, selectedLayerIds]);

  return (
    <div className="bg-white flex flex-col border-l border-border overflow-hidden h-full">
      {/* Header */}
      <div className="bg-secondary/10 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">Propriétés</h2>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3">
        {!scene ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-xs text-center">
              Sélectionnez une scène pour voir ses propriétés
            </p>
          </div>
        ) : (
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
                  <p>• Property changes apply to all selected</p>
                  <p>• Press Delete to remove all selected</p>
                </div>
              </div>
            )}
            
            {/* Show Scene Properties when no layer is selected */}
            {!selectedLayer && selectedLayerIds.length === 0 && (
              <ScenePropertiesPanel scene={scene} handleSceneChange={handleSceneChange} />
            )}

            {/* Show Selected Layer Properties (works for single or multiple selection) */}
            {selectedLayer && (
              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {selectedLayerIds.length > 1 ? 'Common Properties' : 'Layer Properties'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedLayer.type === 'text' ? '📝 Text Layer' : 
                     selectedLayer.type === 'image' ? '🖼️ Image Layer' : 
                     selectedLayer.type === 'shape' ? '⬛ Shape Layer' : 'Layer'}
                    {selectedLayerIds.length > 1 && ' (editing all selected)'}
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
      </div>
    </div>
  );
};

export default React.memo(PropertiesPanel);
