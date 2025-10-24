import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Type, Palette, AlignLeft, Zap, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AVAILABLE_FONTS, TEXT_CONSTRAINTS } from '@/app/text';

export interface TextPropertiesFormProps {
  layer: any;
  onPropertyChange: (layerId: string, property: string, value: any) => void;
}

export const TextPropertiesForm: React.FC<TextPropertiesFormProps> = ({
  layer,
  onPropertyChange
}) => {
  if (!layer || !layer.text_config) return null;

  const textConfig = layer.text_config;
  const layerId = layer.id;

  const handleTextConfigChange = (property: string, value: any) => {
    const updatedTextConfig = { ...textConfig, [property]: value };
    onPropertyChange(layerId, 'text_config', updatedTextConfig);
  };

  const handleColorChange = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    handleTextConfigChange('color', [r, g, b]);
  };

  const getColorHex = (colorArr: number[] | string) => {
    if (Array.isArray(colorArr)) {
      return `#${colorArr.map((c: number) => c.toString(16).padStart(2, '0')).join('')}`;
    }
    return colorArr || '#000000';
  };

  return (
    <Accordion type="multiple" defaultValue={["content", "typography", "style", "spacing", "animation"]} className="w-full">
      {/* Text Content */}
      <AccordionItem value="content">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span>Text Content</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Texte
              </label>
              <textarea
                value={textConfig.text || ''}
                onChange={(e) => handleTextConfigChange('text', e.target.value)}
                className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Entrez votre texte ici..."
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="text-foreground text-xs font-medium">
                {layer.locked ? 'Verrouillé' : 'Déverrouillé'}
              </label>
              <Button
                variant={layer.locked ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyChange(layerId, 'locked', !layer.locked)}
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

      {/* Typography */}
      <AccordionItem value="typography">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span>Typography</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Police
              </label>
              <Select
                value={textConfig.font || 'Arial'}
                onValueChange={(value) => handleTextConfigChange('font', value)}
              >
                <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Sélectionner une police" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FONTS.map((font) => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Taille: <span className="font-mono">{textConfig.size || 48}px</span>
              </label>
              <Slider
                value={[textConfig.size || 48]}
                onValueChange={([value]) => handleTextConfigChange('size', value)}
                min={TEXT_CONSTRAINTS.fontSize.min}
                max={TEXT_CONSTRAINTS.fontSize.max}
                step={1}
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Style
              </label>
              <Select
                value={textConfig.style || 'normal'}
                onValueChange={(value) => handleTextConfigChange('style', value)}
              >
                <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Sélectionner un style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Gras</SelectItem>
                  <SelectItem value="italic">Italique</SelectItem>
                  <SelectItem value="bold_italic">Gras Italique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Style */}
      <AccordionItem value="style">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Style</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Couleur du texte
              </label>
              <input
                type="color"
                value={getColorHex(textConfig.color)}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-border"
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Alignement
              </label>
              <Select
                value={textConfig.align || 'left'}
                onValueChange={(value) => handleTextConfigChange('align', value)}
              >
                <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Sélectionner l'alignement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Gauche</SelectItem>
                  <SelectItem value="center">Centre</SelectItem>
                  <SelectItem value="right">Droite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Spacing */}
      <AccordionItem value="spacing">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <AlignLeft className="w-4 h-4" />
            <span>Spacing</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Interligne: <span className="font-mono">{(textConfig.line_height || 1.2).toFixed(1)}</span>
              </label>
              <Slider
                value={[textConfig.line_height || 1.2]}
                onValueChange={([value]) => handleTextConfigChange('line_height', value)}
                min={TEXT_CONSTRAINTS.lineHeight.min}
                max={TEXT_CONSTRAINTS.lineHeight.max}
                step={TEXT_CONSTRAINTS.lineHeight.step}
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Espacement lettres: <span className="font-mono">{textConfig.letter_spacing || 0}px</span>
              </label>
              <Slider
                value={[textConfig.letter_spacing || 0]}
                onValueChange={([value]) => handleTextConfigChange('letter_spacing', value)}
                min={TEXT_CONSTRAINTS.letterSpacing.min}
                max={TEXT_CONSTRAINTS.letterSpacing.max}
                step={TEXT_CONSTRAINTS.letterSpacing.step}
              />
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
                onValueChange={(value) => onPropertyChange(layerId, 'animation_type', value)}
              >
                <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  <SelectItem value="draw">Draw (écriture)</SelectItem>
                  <SelectItem value="fade">Fade In</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="typewriter">Typewriter</SelectItem>
                  <SelectItem value="bounce">Bounce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Vitesse d'animation: <span className="font-mono">{layer.animation_speed || 1}x</span>
              </label>
              <Slider
                value={[layer.animation_speed || 1]}
                onValueChange={([value]) => onPropertyChange(layerId, 'animation_speed', value)}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Délai de fin (secondes): <span className="font-mono">{layer.end_delay || 0}s</span>
              </label>
              <Slider
                value={[layer.end_delay || 0]}
                onValueChange={([value]) => onPropertyChange(layerId, 'end_delay', value)}
                min={0}
                max={5}
                step={0.1}
              />
              <p className="text-gray-500 text-xs mt-1">Pause après l'animation</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
