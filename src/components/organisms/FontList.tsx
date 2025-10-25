/**
 * FontList Component
 * Displays available fonts in a grid layout with minimal text
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AVAILABLE_FONTS, WEB_SAFE_FONTS } from '@/app/text';
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
          Polices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Font Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredFonts.map((font) => (
            <button
              key={font}
              onClick={() => handleFontClick(font)}
              className={`relative p-3 rounded-lg border-2 transition-all hover:border-primary/50 hover:shadow-sm text-left ${
                selectedFont === font
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white'
              }`}
            >
              <div className="text-xs font-medium text-foreground mb-1 truncate">
                {font}
              </div>
              <div
                className="text-sm text-foreground"
                style={{ fontFamily: font }}
              >
                Abc
              </div>
              {isFontWebSafe(font) && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" title="Web Safe" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
