/**
 * TextEditor Component
 * Main component for creating and editing text items
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TextStyleControls } from '@/components/molecules/text/TextStyleControls';
import { TextPreview } from '@/components/molecules/text/TextPreview';
import { useTextActions, DEFAULT_TEXT_STYLE, TextStyle } from '@/app/text';
import { Check, X } from 'lucide-react';

interface TextEditorProps {
  initialContent?: string;
  initialStyle?: Partial<TextStyle>;
  onSave?: () => void;
  onCancel?: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  initialContent = '',
  initialStyle = {},
  onSave,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);
  const [style, setStyle] = useState<TextStyle>({
    ...DEFAULT_TEXT_STYLE,
    ...initialStyle,
  });

  const { create, isCreating } = useTextActions();

  const handleStyleChange = (updates: Partial<TextStyle>) => {
    setStyle(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Le contenu du texte ne peut pas être vide');
      return;
    }

    try {
      await create({ content, style });
      
      // Reset form
      setContent('');
      setStyle(DEFAULT_TEXT_STYLE);
      
      onSave?.();
    } catch (error) {
      console.error('Error creating text:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la création du texte');
    }
  };

  const handleCancel = () => {
    setContent('');
    setStyle(DEFAULT_TEXT_STYLE);
    onCancel?.();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Nouveau texte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Content Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Contenu</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Entrez votre texte ici..."
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {content.length} caractères
          </p>
        </div>

        <Separator />

        {/* Preview */}
        <TextPreview content={content} style={style} />

        <Separator />

        {/* Style Controls */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Style</Label>
          <TextStyleControls style={style} onChange={handleStyleChange} />
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isCreating}
          >
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={isCreating || !content.trim()}
          >
            <Check className="w-4 h-4 mr-2" />
            {isCreating ? 'Création...' : 'Enregistrer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
