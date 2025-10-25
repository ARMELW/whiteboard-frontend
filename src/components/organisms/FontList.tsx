/**
 * FontList Component
 * Displays a list of available fonts that can be selected
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AVAILABLE_FONTS, WEB_SAFE_FONTS, GOOGLE_FONTS } from '@/app/text';
import { Search, Type } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FontListProps {
  onSelectFont?: (fontFamily: string) => void;
}

export const FontList: React.FC<FontListProps> = ({ onSelectFont }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFont, setSelectedFont] = useState<string | null>(null);

  const filteredFonts = AVAILABLE_FONTS.filter(font =>
    font.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFontClick = (font: string) => {
    setSelectedFont(font);
    if (onSelectFont) {
      onSelectFont(font);
    }
  };

  const isFontWebSafe = (font: string) => {
    return WEB_SAFE_FONTS.includes(font as any);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Type className="w-5 h-5" />
          Liste de Polices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher une police..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Font Count */}
        <div className="text-xs text-muted-foreground">
          {filteredFonts.length} police{filteredFonts.length > 1 ? 's' : ''} disponible{filteredFonts.length > 1 ? 's' : ''}
        </div>

        {/* Font List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredFonts.map((font) => (
            <button
              key={font}
              onClick={() => handleFontClick(font)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:border-primary/50 hover:shadow-sm ${
                selectedFont === font
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{font}</span>
                {isFontWebSafe(font) && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    Web Safe
                  </span>
                )}
              </div>
              <div
                className="text-lg text-foreground mt-1"
                style={{ fontFamily: font }}
              >
                The quick brown fox jumps over the lazy dog
              </div>
              <div
                className="text-xs text-muted-foreground mt-1"
                style={{ fontFamily: font }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
              </div>
            </button>
          ))}
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground border-t border-border pt-3 mt-3">
          <p className="mb-1">
            <strong>Astuce:</strong> Cliquez sur une police pour la sélectionner.
          </p>
          <p>
            Les polices "Web Safe" sont garanties d'être disponibles sur tous les navigateurs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
