/**
 * TextLibraryItem Component
 * Displays a single text item in the library
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Trash2, Plus } from 'lucide-react';
import { TextLibraryItem as TextItem } from '@/app/text';

interface TextLibraryItemProps {
  item: TextItem;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddToScene?: (item: TextItem) => void;
}

export const TextLibraryItemCard: React.FC<TextLibraryItemProps> = ({
  item,
  onDelete,
  onDuplicate,
  onAddToScene,
}) => {
  const textStyles: React.CSSProperties = {
    fontFamily: item.style.fontFamily,
    fontSize: `${Math.min(item.style.fontSize, 24)}px`,
    fontWeight: item.style.fontWeight,
    fontStyle: item.style.fontStyle,
    textDecoration: item.style.textDecoration,
    color: item.style.color,
    textAlign: item.style.textAlign,
    lineHeight: item.style.lineHeight,
    letterSpacing: `${item.style.letterSpacing}px`,
    opacity: item.style.opacity,
  };

  const truncatedContent = item.content.length > 100 
    ? item.content.substring(0, 100) + '...' 
    : item.content;

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Preview */}
        <div 
          className="mb-3 p-3 bg-secondary/20 rounded border border-border overflow-hidden"
          style={{ minHeight: '60px' }}
        >
          <p style={textStyles} className="break-words">
            {truncatedContent}
          </p>
        </div>

        {/* Info */}
        <div className="mb-3 text-xs text-muted-foreground space-y-1">
          <p>
            <span className="font-medium">Police:</span> {item.style.fontFamily} ({item.style.fontSize}px)
          </p>
          <p>
            <span className="font-medium">Utilisé:</span> {item.usageCount || 0} fois
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onAddToScene && (
            <Button
              size="sm"
              onClick={() => onAddToScene(item)}
              className="flex-1"
            >
              <Plus className="w-3 h-3 mr-1" />
              Ajouter
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDuplicate(item.id)}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
