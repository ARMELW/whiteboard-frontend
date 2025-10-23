import React, { useCallback } from 'react';
import { MoveUp, MoveDown, Copy, Trash2, Layers } from 'lucide-react';

export interface LayersListPanelProps {
  layers: any[];
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onMoveLayer: (layerId: string, direction: 'up' | 'down') => void;
  onDuplicateLayer: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
}

// LayerListItem: subcomponent for a single layer row
interface LayerListItemProps {
  layer: any;
  index: number;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: (layerId: string) => void;
  onMoveUp: (e: React.MouseEvent, layerId: string) => void;
  onMoveDown: (e: React.MouseEvent, layerId: string) => void;
  onDuplicate: (e: React.MouseEvent, layerId: string) => void;
  onDelete: (e: React.MouseEvent, layerId: string) => void;
}

const LayerListItem: React.FC<LayerListItemProps> = React.memo(({
  layer, index, isSelected, isFirst, isLast, onSelect, onMoveUp, onMoveDown, onDuplicate, onDelete
}) => (
  <div
    className={`p-2 rounded cursor-pointer transition-all group border ${
      isSelected ? 'bg-primary/20 border-primary' : 'bg-secondary hover:bg-secondary/70 border-border'
    }`}
    onClick={() => onSelect(layer.id)}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm truncate flex-1 text-foreground">
        {layer.name || `Couche ${index + 1}`}
      </span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => onMoveUp(e, layer.id)}
          disabled={isFirst}
          className="p-1 hover:bg-primary/10 rounded disabled:opacity-30"
          title="Monter"
        >
          <MoveUp className="w-3.5 h-3.5 text-primary" />
        </button>
        <button
          onClick={(e) => onMoveDown(e, layer.id)}
          disabled={isLast}
          className="p-1 hover:bg-primary/10 rounded disabled:opacity-30"
          title="Descendre"
        >
          <MoveDown className="w-3.5 h-3.5 text-primary" />
        </button>
        <button
          onClick={(e) => onDuplicate(e, layer.id)}
          className="p-1 hover:bg-primary/10 rounded"
          title="Dupliquer"
        >
          <Copy className="w-3.5 h-3.5 text-primary" />
        </button>
        <button
          onClick={(e) => onDelete(e, layer.id)}
          className="p-1 hover:bg-red-600/20 rounded"
          title="Supprimer"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>
    </div>
  </div>
));

export const LayersListPanel: React.FC<LayersListPanelProps> = React.memo(({
  layers,
  selectedLayerId,
  onSelectLayer,
  onMoveLayer,
  onDuplicateLayer,
  onDeleteLayer
}) => {
  // Memoize click handlers to prevent re-creating them on every render
  const handleMoveUp = useCallback((e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onMoveLayer(layerId, 'up');
  }, [onMoveLayer]);

  const handleMoveDown = useCallback((e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onMoveLayer(layerId, 'down');
  }, [onMoveLayer]);

  const handleDuplicate = useCallback((e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onDuplicateLayer(layerId);
  }, [onDuplicateLayer]);

  const handleDelete = useCallback((e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onDeleteLayer(layerId);
  }, [onDeleteLayer]);

  const handleSelect = useCallback((layerId: string) => {
    onSelectLayer(layerId);
  }, [onSelectLayer]);

  return (
    <div className="bg-secondary/40 rounded-lg p-4 border border-border">
      <h3 className="text-foreground font-semibold mb-3 text-sm flex items-center gap-2">
        <Layers className="w-4 h-4 text-primary" />
        Couches ({layers?.length || 0})
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {(!layers || layers.length === 0) ? (
          <p className="text-muted-foreground text-xs italic text-center py-4">
            Aucune couche pour le moment.<br />
            Cliquez sur "+" pour ajouter une image.
          </p>
        ) : (
          layers
            .map((layer, index) => ({ layer, index }))
            .filter(({ layer }) => !!layer && typeof layer.id !== 'undefined')
            .map(({ layer, index }) => (
              <LayerListItem
                key={layer.id}
                layer={layer}
                index={index}
                isSelected={selectedLayerId === layer.id}
                isFirst={index === 0}
                isLast={index === layers.length - 1}
                onSelect={handleSelect}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))
        )}
      </div>
    </div>
  );
});

// Demo component
export default function Demo() {
  const [layers, setLayers] = React.useState([
    { id: '1', name: 'Background', z_index: 1 },
    { id: '2', name: 'Main Image', z_index: 2 },
    { id: '3', name: 'Overlay', z_index: 3 },
  ]);
  const [selectedLayerId, setSelectedLayerId] = React.useState('2');

  const handleMoveLayer = (layerId: string, direction: 'up' | 'down') => {
    const index = layers.findIndex(l => l.id === layerId);
    if (index === -1) return;
    
    const newLayers = [...layers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newLayers.length) return;
    
    [newLayers[index], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[index]];
    setLayers(newLayers);
  };

  const handleDuplicate = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    
    const newLayer = {
      ...layer,
      id: Date.now().toString(),
      name: `${layer.name} (copie)`
    };
    setLayers([...layers, newLayer]);
  };

  const handleDelete = (layerId: string) => {
    setLayers(layers.filter(l => l.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId(layers[0]?.id || null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <LayersListPanel
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onMoveLayer={handleMoveLayer}
          onDuplicateLayer={handleDuplicate}
          onDeleteLayer={handleDelete}
        />
      </div>
    </div>
  );
}