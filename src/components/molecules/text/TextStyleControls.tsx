/**
 * TextStyleControls Component
 * Form controls for styling text (font, size, color, etc.)
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { TextStyle, AVAILABLE_FONTS, TEXT_CONSTRAINTS } from '@/app/text';

interface TextStyleControlsProps {
  style: TextStyle;
  onChange: (updates: Partial<TextStyle>) => void;
}

export const TextStyleControls: React.FC<TextStyleControlsProps> = ({ style, onChange }) => {
  const handleColorChange = (hex: string) => {
    onChange({ color: hex });
  };

  const toggleBold = () => {
    onChange({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' });
  };

  const toggleItalic = () => {
    onChange({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' });
  };

  const toggleUnderline = () => {
    onChange({ textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline' });
  };

  const setAlignment = (align: 'left' | 'center' | 'right') => {
    onChange({ textAlign: align });
  };

  return (
    <div className="space-y-4">
      {/* Font Family */}
      <div className="space-y-2">
        <Label className="text-xs">Police</Label>
        <Select
          value={style.fontFamily}
          onValueChange={(value) => onChange({ fontFamily: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
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

      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs">Taille</Label>
          <span className="text-xs font-mono">{style.fontSize}px</span>
        </div>
        <Slider
          value={[style.fontSize]}
          onValueChange={([value]) => onChange({ fontSize: value })}
          min={TEXT_CONSTRAINTS.fontSize.min}
          max={TEXT_CONSTRAINTS.fontSize.max}
          step={1}
        />
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label className="text-xs">Couleur</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={style.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-16 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={style.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Text Style Buttons */}
      <div className="space-y-2">
        <Label className="text-xs">Style</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={style.fontWeight === 'bold' ? 'default' : 'outline'}
            size="sm"
            onClick={toggleBold}
            className="flex-1"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={style.fontStyle === 'italic' ? 'default' : 'outline'}
            size="sm"
            onClick={toggleItalic}
            className="flex-1"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={style.textDecoration === 'underline' ? 'default' : 'outline'}
            size="sm"
            onClick={toggleUnderline}
            className="flex-1"
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <Label className="text-xs">Alignement</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={style.textAlign === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAlignment('left')}
            className="flex-1"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={style.textAlign === 'center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAlignment('center')}
            className="flex-1"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={style.textAlign === 'right' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAlignment('right')}
            className="flex-1"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Line Height */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs">Interligne</Label>
          <span className="text-xs font-mono">{style.lineHeight.toFixed(1)}</span>
        </div>
        <Slider
          value={[style.lineHeight]}
          onValueChange={([value]) => onChange({ lineHeight: value })}
          min={TEXT_CONSTRAINTS.lineHeight.min}
          max={TEXT_CONSTRAINTS.lineHeight.max}
          step={TEXT_CONSTRAINTS.lineHeight.step}
        />
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs">Espacement lettres</Label>
          <span className="text-xs font-mono">{style.letterSpacing}px</span>
        </div>
        <Slider
          value={[style.letterSpacing]}
          onValueChange={([value]) => onChange({ letterSpacing: value })}
          min={TEXT_CONSTRAINTS.letterSpacing.min}
          max={TEXT_CONSTRAINTS.letterSpacing.max}
          step={TEXT_CONSTRAINTS.letterSpacing.step}
        />
      </div>

      {/* Text Opacity */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs">Opacité du texte</Label>
          <span className="text-xs font-mono">{Math.round(style.opacity * 100)}%</span>
        </div>
        <Slider
          value={[style.opacity]}
          onValueChange={([value]) => onChange({ opacity: value })}
          min={TEXT_CONSTRAINTS.opacity.min}
          max={TEXT_CONSTRAINTS.opacity.max}
          step={TEXT_CONSTRAINTS.opacity.step}
        />
      </div>
    </div>
  );
};
