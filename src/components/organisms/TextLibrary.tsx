/**
 * TextLibrary Component
 * Displays the library of saved text items
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextLibraryItemCard } from '@/components/molecules/text/TextLibraryItem';
import { TextEditor } from './TextEditor';
import { useTextLibrary, useTextActions, TextLibraryItem } from '@/app/text';
import { Plus, Library } from 'lucide-react';

interface TextLibraryProps {
  onAddToScene?: (item: TextLibraryItem) => void;
}

export const TextLibrary: React.FC<TextLibraryProps> = ({ onAddToScene }) => {
  const { items, isLoading, error } = useTextLibrary();
  const { deleteText, duplicate } = useTextActions();
  const [activeTab, setActiveTab] = useState<'library' | 'create'>('library');

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce texte ?')) {
      try {
        await deleteText(id);
      } catch (error) {
        console.error('Error deleting text:', error);
        alert('Erreur lors de la suppression du texte');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicate(id);
    } catch (error) {
      console.error('Error duplicating text:', error);
      alert('Erreur lors de la duplication du texte');
    }
  };

  const handleSave = () => {
    setActiveTab('library');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Library className="w-5 h-5" />
          Bibliothèque de textes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'library' | 'create')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="library">
              <Library className="w-4 h-4 mr-2" />
              Bibliothèque ({items.length})
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-0">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement...
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Aucun texte enregistré
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer votre premier texte
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <TextLibraryItemCard
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onAddToScene={onAddToScene}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <TextEditor onSave={handleSave} onCancel={() => setActiveTab('library')} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
