import React from 'react';
import { Sparkles } from 'lucide-react';
import { THUMBNAIL_TEMPLATES, ThumbnailTemplate } from '../../../types/thumbnailTemplates';

interface ThumbnailTemplatesProps {
  onSelectTemplate: (template: ThumbnailTemplate) => void;
}

export const ThumbnailTemplates: React.FC<ThumbnailTemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Templates prédéfinis
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {THUMBNAIL_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="group relative overflow-hidden rounded-lg border-2 border-border hover:border-blue-500 transition-all duration-200 bg-secondary/50 hover:bg-secondary/70"
          >
            {/* Template preview background */}
            <div 
              className="w-full h-20 flex items-center justify-center p-2"
              style={{ backgroundColor: template.backgroundColor }}
            >
              <div className="text-center">
                {/* Show preview of first text layer */}
                {template.layers.find(l => l.type === 'text') && (
                  <div 
                    className="text-xs font-bold line-clamp-2"
                    style={{ 
                      color: (template.layers.find(l => l.type === 'text') as any)?.fill || '#fff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {(template.layers.find(l => l.type === 'text') as any)?.text || template.name}
                  </div>
                )}
              </div>
            </div>
            
            {/* Template name */}
            <div className="bg-secondary/80 p-2 text-center">
              <p className="text-white text-xs font-semibold">{template.name}</p>
              <p className="text-gray-400 text-[10px] line-clamp-1">{template.description}</p>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        ))}
      </div>
      
      <p className="text-gray-400 text-xs mt-3 text-center">
        Cliquez sur un template pour l'appliquer
      </p>
    </div>
  );
};
