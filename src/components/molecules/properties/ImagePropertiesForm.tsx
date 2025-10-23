import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Move, Sliders, RotateCw, Zap } from 'lucide-react';

interface ImagePropertiesFormProps {
  layer: any;
  onPropertyChange: (layerId: string, property: string, value: any) => void;
}

export const ImagePropertiesForm: React.FC<ImagePropertiesFormProps> = ({ layer, onPropertyChange }) => {
  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    const newPosition = { ...layer.position, [axis]: value };
    onPropertyChange(layer.id, 'position', newPosition);
  };

  return (
    <Accordion type="multiple" defaultValue={["basic", "transform", "animation"]} className="w-full">
      {/* Basic Properties */}
      <AccordionItem value="basic">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Basic</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">Nom</label>
              <input
                type="text"
                value={layer.name || ''}
                onChange={(e) => onPropertyChange(layer.id, 'name', e.target.value)}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nom de la couche"
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Opacité: <span className="font-mono">{Math.round((layer.opacity || 1.0) * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layer.opacity || 1.0}
                onChange={(e) => onPropertyChange(layer.id, 'opacity', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Transform */}
      <AccordionItem value="transform">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4" />
            <span>Transform</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-foreground text-xs mb-1.5">Position X</label>
                <input
                  type="number"
                  value={Math.round(layer.position?.x || 0)}
                  onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                  className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-foreground text-xs mb-1.5">Position Y</label>
                <input
                  type="number"
                  value={Math.round(layer.position?.y || 0)}
                  onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                  className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Échelle: <span className="font-mono">{(layer.scale || 1.0).toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={layer.scale || 1.0}
                onChange={(e) => onPropertyChange(layer.id, 'scale', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Rotation: <span className="font-mono">{Math.round(layer.rotation || 0)}°</span>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={layer.rotation || 0}
                onChange={(e) => onPropertyChange(layer.id, 'rotation', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Drawing Speed */}
      <AccordionItem value="animation">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Drawing speed</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">Skip Rate</label>
              <input
                type="number"
                min="1"
                max="50"
                value={layer.skip_rate || 10}
                onChange={(e) => onPropertyChange(layer.id, 'skip_rate', Number(e.target.value))}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-gray-500 text-xs mt-1">Plus élevé = dessin plus rapide</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
