import React from 'react';
import { Type } from 'lucide-react';

interface TextLayer {
  id: string;
  type: 'text';
  text: string;
  fontSize: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  shadowEnabled: boolean;
  [key: string]: any;
}

interface ThumbnailTextPropertiesProps {
  layer: TextLayer;
  onTextChange: (property: string, value: any) => void;
}

export const ThumbnailTextProperties: React.FC<ThumbnailTextPropertiesProps> = ({
  layer,
  onTextChange
}) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Type className="w-4 h-4 text-purple-400" />
        Propriétés du texte
      </h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Texte</label>
          <input
            type="text"
            value={layer.text}
            onChange={(e) => onTextChange('text', e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Taille: {Math.round(layer.fontSize)}px
          </label>
          <input
            type="range"
            min="12"
            max="120"
            value={layer.fontSize}
            onChange={(e) => onTextChange('fontSize', parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Couleur</label>
            <input
              type="color"
              value={layer.fill}
              onChange={(e) => onTextChange('fill', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Contour</label>
            <input
              type="color"
              value={layer.stroke}
              onChange={(e) => onTextChange('stroke', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer border border-gray-600"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Épaisseur contour: {layer.strokeWidth}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={layer.strokeWidth}
            onChange={(e) => onTextChange('strokeWidth', parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={layer.shadowEnabled}
              onChange={(e) => onTextChange('shadowEnabled', e.target.checked)}
              className="w-4 h-4 accent-purple-500 rounded"
            />
            Ombre portée
          </label>
        </div>
      </div>
    </div>
  );
};
