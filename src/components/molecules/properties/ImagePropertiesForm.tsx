import React, { useState } from 'react';
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
import { Move, Sliders, RotateCw, Zap, FlipHorizontal, FlipVertical, Lock, Unlock, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HandLibraryDialog, HandType } from '@/components/organisms/HandLibraryDialog';

interface ImagePropertiesFormProps {
  layer: any;
  onPropertyChange: (layerId: string, property: string, value: any) => void;
}

export const ImagePropertiesForm: React.FC<ImagePropertiesFormProps> = React.memo(({ layer, onPropertyChange }) => {
  const [showHandLibrary, setShowHandLibrary] = useState(false);
  
  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    const newPosition = { ...layer.position, [axis]: value };
    onPropertyChange(layer.id, 'position', newPosition);
  };

  const handleHandSelect = (handType: HandType) => {
    onPropertyChange(layer.id, 'hand_type', handType);
  };

  const getHandLabel = (handType?: string) => {
    switch (handType) {
      case 'hand_1': return 'Main droite - Claire';
      case 'hand_2': return 'Main droite - Medium';
      case 'hand_3': return 'Main droite - Foncée';
      case 'hand_4': return 'Main gauche - Claire';
      case 'hand_5': return 'Main gauche - Medium';
      case 'hand_6': return 'Main gauche - Foncée';
      default: return 'Aucune main';
    }
  };

  return (
    <>
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
            <div className="flex items-center justify-between pt-2">
              <label className="text-foreground text-xs font-medium">
                {layer.locked ? 'Verrouillé' : 'Déverrouillé'}
              </label>
              <Button
                variant={layer.locked ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyChange(layer.id, 'locked', !layer.locked)}
                className="h-8 px-3"
              >
                {layer.locked ? (
                  <><Lock className="w-4 h-4 mr-1" /> Verrouillé</>
                ) : (
                  <><Unlock className="w-4 h-4 mr-1" /> Déverrouillé</>
                )}
              </Button>
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
                  disabled={layer.locked}
                />
              </div>
              <div>
                <label className="block text-foreground text-xs mb-1.5">Position Y</label>
                <input
                  type="number"
                  value={Math.round(layer.position?.y || 0)}
                  onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                  className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={layer.locked}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-foreground text-xs mb-1.5">Width</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  value={Math.round(layer.width || 0)}
                  onChange={(e) => onPropertyChange(layer.id, 'width', Number(e.target.value))}
                  className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={layer.locked}
                />
              </div>
              <div>
                <label className="block text-foreground text-xs mb-1.5">Height</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  value={Math.round(layer.height || 0)}
                  onChange={(e) => onPropertyChange(layer.id, 'height', Number(e.target.value))}
                  className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={layer.locked}
                />
              </div>
            </div>
            {layer.camera_position && (
              <div className="p-3 bg-secondary/50 rounded border border-border">
                <label className="block text-foreground text-xs font-medium mb-2">
                  Position relative to camera
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-muted-foreground text-xs mb-1">Camera X</label>
                    <div className="bg-background text-foreground border border-border rounded px-3 py-2 text-sm font-mono">
                      {Math.round(layer.camera_position.x)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-muted-foreground text-xs mb-1">Camera Y</label>
                    <div className="bg-background text-foreground border border-border rounded px-3 py-2 text-sm font-mono">
                      {Math.round(layer.camera_position.y)}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                disabled={layer.locked}
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
                disabled={layer.locked}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-foreground text-xs mb-1.5">
                  Scale X: <span className="font-mono">{(layer.scaleX || 1.0).toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={layer.scaleX || 1.0}
                  onChange={(e) => onPropertyChange(layer.id, 'scaleX', Number(e.target.value))}
                  className="w-full"
                  disabled={layer.locked}
                />
              </div>
              <div>
                <label className="block text-foreground text-xs mb-1.5">
                  Scale Y: <span className="font-mono">{(layer.scaleY || 1.0).toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={layer.scaleY || 1.0}
                  onChange={(e) => onPropertyChange(layer.id, 'scaleY', Number(e.target.value))}
                  className="w-full"
                  disabled={layer.locked}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={layer.flipX ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyChange(layer.id, 'flipX', !layer.flipX)}
                className="w-full"
                disabled={layer.locked}
              >
                <FlipHorizontal className="w-4 h-4 mr-2" />
                Flip H
              </Button>
              <Button
                variant={layer.flipY ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyChange(layer.id, 'flipY', !layer.flipY)}
                className="w-full"
                disabled={layer.locked}
              >
                <FlipVertical className="w-4 h-4 mr-2" />
                Flip V
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Animation */}
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
              <label className="block text-foreground text-xs mb-1.5">Type d'animation</label>
              <Select
                value={layer.animation_type || 'none'}
                onValueChange={(value) => onPropertyChange(layer.id, 'animation_type', value)}
              >
                <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  <SelectItem value="draw">Draw (dessin)</SelectItem>
                  <SelectItem value="fade">Fade In</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="bounce">Bounce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Vitesse d'animation: <span className="font-mono">{layer.animation_speed || 1}x</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={layer.animation_speed || 1}
                onChange={(e) => onPropertyChange(layer.id, 'animation_speed', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">Skip Rate (Drawing Speed)</label>
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
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Délai de fin (secondes): <span className="font-mono">{layer.end_delay || 0}s</span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={layer.end_delay || 0}
                onChange={(e) => onPropertyChange(layer.id, 'end_delay', Number(e.target.value))}
                className="w-full"
              />
              <p className="text-gray-500 text-xs mt-1">Pause après l'animation</p>
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">Type de main</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHandLibrary(true)}
                className="w-full justify-start"
              >
                <Hand className="w-4 h-4 mr-2" />
                {getHandLabel(layer.hand_type)}
              </Button>
              <p className="text-gray-500 text-xs mt-1">Main utilisée pour l'animation d'écriture</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <HandLibraryDialog
      isOpen={showHandLibrary}
      onClose={() => setShowHandLibrary(false)}
      onSelectHand={handleHandSelect}
      currentHandType={(layer.hand_type as HandType) || HandType.NONE}
    />
    </>
  );
});
