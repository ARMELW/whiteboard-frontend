import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Move, Sliders, RotateCw, Zap, FlipHorizontal, FlipVertical, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShapePropertiesFormProps {
  layer: any;
  onPropertyChange: (layerId: string, property: string, value: any) => void;
}

export const ShapePropertiesForm: React.FC<ShapePropertiesFormProps> = React.memo(({ layer, onPropertyChange }) => {
  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    const newPosition = { ...layer.position, [axis]: value };
    onPropertyChange(layer.id, 'position', newPosition);
  };

  const isSvgShape = !!(layer as any).svg_path;

  return (
    <Accordion type="multiple" defaultValue={["basic", "transform"]} className="w-full">
      {/* Basic Properties */}
      <AccordionItem value="basic">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Propriétés de base</span>
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
                placeholder="Nom de la forme"
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
                onChange={(e) => onPropertyChange(layer.id, 'opacity', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Échelle: <span className="font-mono">{((layer.scale || 1.0) * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={layer.scale || 1.0}
                onChange={(e) => onPropertyChange(layer.id, 'scale', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-foreground text-xs">Verrouillé</span>
              <Button
                onClick={() => onPropertyChange(layer.id, 'locked', !layer.locked)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Transform Properties */}
      <AccordionItem value="transform">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4" />
            <span>Transformation</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">Position X</label>
              <input
                type="number"
                value={Math.round(layer.position?.x || 0)}
                onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">Position Y</label>
              <input
                type="number"
                value={Math.round(layer.position?.y || 0)}
                onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Rotation: <span className="font-mono">{Math.round(layer.rotation || 0)}°</span>
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={layer.rotation || 0}
                onChange={(e) => onPropertyChange(layer.id, 'rotation', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            {isSvgShape && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground text-xs">Miroir horizontal</span>
                  <Button
                    onClick={() => onPropertyChange(layer.id, 'flipX', !(layer as any).flipX)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground text-xs">Miroir vertical</span>
                  <Button
                    onClick={() => onPropertyChange(layer.id, 'flipY', !(layer as any).flipY)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <FlipVertical className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Animation Properties */}
      <AccordionItem value="animation">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Animation</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">Mode d'animation</label>
              <Select
                value={layer.mode || 'draw'}
                onValueChange={(value) => onPropertyChange(layer.id, 'mode', value)}
              >
                <SelectTrigger className="w-full bg-secondary text-foreground border border-border">
                  <SelectValue placeholder="Sélectionner un mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draw">Dessin</SelectItem>
                  <SelectItem value="fade">Fondu</SelectItem>
                  <SelectItem value="slide">Glissement</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Taux d'échantillonnage: <span className="font-mono">{layer.skip_rate || 5}</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={layer.skip_rate || 5}
                onChange={(e) => onPropertyChange(layer.id, 'skip_rate', parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Plus la valeur est faible, plus l'animation est fluide (mais plus lente à générer)
              </p>
            </div>
            {isSvgShape && (
              <>
                <div>
                  <label className="block text-foreground text-xs mb-1.5">
                    Taux d'échantillonnage SVG: <span className="font-mono">{(layer as any).svg_sampling_rate || 1}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={(layer as any).svg_sampling_rate || 1}
                    onChange={(e) => onPropertyChange(layer.id, 'svg_sampling_rate', parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Contrôle la fréquence d'échantillonnage du chemin SVG lors de l'animation
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground text-xs">Inverser le sens du dessin</span>
                  <Button
                    onClick={() => onPropertyChange(layer.id, 'svg_reverse', !(layer as any).svg_reverse)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3"
                  >
                    {(layer as any).svg_reverse ? 'Activé' : 'Désactivé'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* SVG Style Properties */}
      {isSvgShape && (
        <AccordionItem value="style">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Style SVG</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div>
                <label className="block text-foreground text-xs mb-1.5">Couleur du trait</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={layer.shape_config?.color || '#222222'}
                    onChange={(e) => {
                      const newConfig = { ...layer.shape_config, color: e.target.value };
                      onPropertyChange(layer.id, 'shape_config', newConfig);
                    }}
                    className="w-12 h-10 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={layer.shape_config?.color || '#222222'}
                    onChange={(e) => {
                      const newConfig = { ...layer.shape_config, color: e.target.value };
                      onPropertyChange(layer.id, 'shape_config', newConfig);
                    }}
                    className="flex-1 bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    placeholder="#222222"
                  />
                </div>
              </div>
              <div>
                <label className="block text-foreground text-xs mb-1.5">Couleur de remplissage</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={layer.shape_config?.fill_color || '#222222'}
                    onChange={(e) => {
                      const newConfig = { ...layer.shape_config, fill_color: e.target.value };
                      onPropertyChange(layer.id, 'shape_config', newConfig);
                    }}
                    className="w-12 h-10 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={layer.shape_config?.fill_color || '#222222'}
                    onChange={(e) => {
                      const newConfig = { ...layer.shape_config, fill_color: e.target.value };
                      onPropertyChange(layer.id, 'shape_config', newConfig);
                    }}
                    className="flex-1 bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    placeholder="#222222"
                  />
                </div>
              </div>
              <div>
                <label className="block text-foreground text-xs mb-1.5">
                  Épaisseur du trait: <span className="font-mono">{layer.shape_config?.stroke_width || 5}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={layer.shape_config?.stroke_width || 5}
                  onChange={(e) => {
                    const newConfig = { ...layer.shape_config, stroke_width: parseFloat(e.target.value) };
                    onPropertyChange(layer.id, 'shape_config', newConfig);
                  }}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
});
