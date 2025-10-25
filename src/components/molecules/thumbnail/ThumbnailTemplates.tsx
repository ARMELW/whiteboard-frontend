import React from 'react';
import { Sparkles } from 'lucide-react';
import type { ThumbnailLayer } from '../../organisms/ThumbnailMaker';

export interface ThumbnailTemplate {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  layers: ThumbnailLayer[];
  preview?: string;
}

export const thumbnailTemplates: ThumbnailTemplate[] = [
  {
    id: 'youtube-bold',
    name: 'YouTube Bold',
    description: 'Style YouTube classique avec titre imposant',
    backgroundColor: '#ff0000',
    layers: [
      {
        id: 'text-title',
        type: 'text',
        text: 'TITRE ACCROCHEUR',
        x: 640,
        y: 360,
        fontSize: 90,
        fontFamily: 'Impact',
        fontStyle: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 10,
        shadowEnabled: true,
        align: 'center',
      },
      {
        id: 'text-subtitle',
        type: 'text',
        text: 'Sous-titre explicatif',
        x: 640,
        y: 500,
        fontSize: 42,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        fill: '#ffff00',
        stroke: '#000000',
        strokeWidth: 6,
        shadowEnabled: true,
        align: 'center',
      },
    ],
  },
  {
    id: 'minimalist',
    name: 'Minimaliste',
    description: 'Design épuré et moderne',
    backgroundColor: '#1a1a2e',
    layers: [
      {
        id: 'text-title',
        type: 'text',
        text: 'Titre Élégant',
        x: 640,
        y: 300,
        fontSize: 72,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        fill: '#ffffff',
        stroke: '#7c3aed',
        strokeWidth: 4,
        shadowEnabled: false,
        align: 'center',
      },
      {
        id: 'shape-accent',
        type: 'shape',
        x: 640,
        y: 380,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        shape_config: {
          shape: 'rectangle',
          width: 400,
          height: 8,
          fill: '#7c3aed',
          stroke: '#7c3aed',
          strokeWidth: 0,
          opacity: 1,
          cornerRadius: 4,
          fillMode: 'fill',
        },
      },
      {
        id: 'text-subtitle',
        type: 'text',
        text: 'Description concise',
        x: 640,
        y: 450,
        fontSize: 36,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fill: '#a0a0a0',
        stroke: 'transparent',
        strokeWidth: 0,
        shadowEnabled: false,
        align: 'center',
      },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Style dynamique pour contenu gaming',
    backgroundColor: '#0a0e27',
    layers: [
      {
        id: 'shape-bg',
        type: 'shape',
        x: 640,
        y: 360,
        scaleX: 1.2,
        scaleY: 1.2,
        rotation: 5,
        shape_config: {
          shape: 'rectangle',
          width: 900,
          height: 350,
          fill: 'transparent',
          stroke: '#00ff88',
          strokeWidth: 8,
          opacity: 0.8,
          cornerRadius: 20,
          fillMode: 'stroke',
        },
      },
      {
        id: 'text-title',
        type: 'text',
        text: 'GAMEPLAY ÉPIQUE',
        x: 640,
        y: 300,
        fontSize: 85,
        fontFamily: 'Arial Black',
        fontStyle: 'bold',
        fill: '#00ff88',
        stroke: '#000000',
        strokeWidth: 8,
        shadowEnabled: true,
        align: 'center',
      },
      {
        id: 'text-subtitle',
        type: 'text',
        text: '⚡ Nouveau contenu ⚡',
        x: 640,
        y: 420,
        fontSize: 48,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 5,
        shadowEnabled: true,
        align: 'center',
      },
    ],
  },
  {
    id: 'professional',
    name: 'Professionnel',
    description: 'Pour contenus éducatifs et professionnels',
    backgroundColor: '#ffffff',
    layers: [
      {
        id: 'shape-header',
        type: 'shape',
        x: 640,
        y: 120,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        shape_config: {
          shape: 'rectangle',
          width: 1280,
          height: 180,
          fill: '#1e40af',
          stroke: '#1e40af',
          strokeWidth: 0,
          opacity: 1,
          cornerRadius: 0,
          fillMode: 'fill',
        },
      },
      {
        id: 'text-title',
        type: 'text',
        text: 'Titre Professionnel',
        x: 640,
        y: 120,
        fontSize: 64,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        fill: '#ffffff',
        stroke: 'transparent',
        strokeWidth: 0,
        shadowEnabled: false,
        align: 'center',
      },
      {
        id: 'text-subtitle',
        type: 'text',
        text: 'Formation • Tutorial • Conseils',
        x: 640,
        y: 400,
        fontSize: 42,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fill: '#1e40af',
        stroke: 'transparent',
        strokeWidth: 0,
        shadowEnabled: false,
        align: 'center',
      },
    ],
  },
];

interface ThumbnailTemplatesProps {
  onSelectTemplate: (template: ThumbnailTemplate) => void;
}

export const ThumbnailTemplates: React.FC<ThumbnailTemplatesProps> = ({
  onSelectTemplate,
}) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        Templates Prédéfinis
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {thumbnailTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="group relative overflow-hidden rounded-lg border border-gray-600 hover:border-purple-500 transition-all text-left hover:shadow-lg"
          >
            {/* Preview miniature */}
            <div 
              className="h-20 flex items-center justify-center relative"
              style={{ 
                background: template.backgroundColor,
              }}
            >
              <div className="text-white text-xs font-bold opacity-50">
                {template.name}
              </div>
            </div>
            
            {/* Info */}
            <div className="bg-gray-900/80 p-2 border-t border-gray-700">
              <h4 className="text-white font-semibold text-sm">{template.name}</h4>
              <p className="text-gray-400 text-xs mt-0.5">{template.description}</p>
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-purple-600 px-4 py-2 rounded-lg shadow-lg">
                Appliquer
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-gray-400 text-xs">
          💡 Astuce: Personnalisez chaque template après application
        </p>
      </div>
    </div>
  );
};
