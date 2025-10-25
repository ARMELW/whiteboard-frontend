import React from 'react';
import { Layers, ImageIcon, Type, Trash2, Square } from 'lucide-react';

interface Layer {
  id: string;
  type: 'image' | 'text' | 'shape';
  text?: string;
  name?: string;
  shape_config?: {
    shape?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface ThumbnailLayersListProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onMoveLayer: (layerId: string, direction: 'up' | 'down') => void;
  onDeleteLayer: (layerId: string) => void;
}

export const ThumbnailLayersList: React.FC<ThumbnailLayersListProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onMoveLayer,
  onDeleteLayer
}) => {
  const getLayerIcon = (layer: Layer) => {
    switch (layer.type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'shape':
        return <Square className="w-4 h-4" />;
      case 'text':
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getLayerLabel = (layer: Layer) => {
    switch (layer.type) {
      case 'image':
        return layer.name || 'Image';
      case 'shape':
        if (layer.shape_config?.shape) {
          const shapeName = layer.shape_config.shape
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return shapeName;
        }
        return layer.name || 'Forme';
      case 'text':
        return layer.text?.substring(0, 20) || 'Texte';
      default:
        return layer.name || 'Calque';
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Layers className="w-4 h-4 text-purple-400" />
        Calques ({layers.length})
      </h3>
      
      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {layers.slice().reverse().map((layer, index) => (
          <div
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              layer.id === selectedLayerId
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-900/50 text-gray-300 hover:bg-gray-900/80 border border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getLayerIcon(layer)}
                <span className="text-sm font-medium">
                  {getLayerLabel(layer)}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'up');
                  }}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  disabled={index === 0}
                  title="Monter le calque"
                >
                  <span className="text-xs">▲</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'down');
                  }}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  disabled={index === layers.length - 1}
                  title="Descendre le calque"
                >
                  <span className="text-xs">▼</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  className="p-1 hover:bg-red-600 rounded transition-colors"
                  title="Supprimer le calque"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {layers.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          Aucun calque. Ajoutez une image, du texte ou une forme.
        </p>
      )}
    </div>
  );
};
