import React, { useState } from 'react';
import { useWizard } from '@/app/wizard';
import { FileText, ArrowLeft, Upload, Clipboard } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export const WizardImportStep: React.FC = () => {
  const { setPrompt, previousStep, nextStep } = useWizard();
  const [importedText, setImportedText] = useState('');
  const [importMode, setImportMode] = useState<'paste' | 'file'>('paste');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportedText(content);
      toast.success('Fichier importé avec succès');
    };
    reader.onerror = () => {
      toast.error('Erreur lors de la lecture du fichier');
    };
    reader.readAsText(file);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setImportedText(text);
      toast.success('Texte collé depuis le presse-papiers');
    } catch (error) {
      toast.error('Impossible de lire le presse-papiers');
    }
  };

  const handleContinue = () => {
    if (!importedText.trim()) {
      toast.error('Veuillez importer ou coller un scénario');
      return;
    }
    setPrompt(importedText);
    nextStep();
  };

  const handleSkip = () => {
    previousStep();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <FileText className="w-6 h-6 text-purple-500" />
          Assistant IA - Import de Scénario
        </DialogTitle>
        <DialogDescription>
          Importez ou collez un scénario existant. L'IA analysera le contenu et générera automatiquement les visuels appropriés.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-6">
        <Tabs value={importMode} onValueChange={(v) => setImportMode(v as 'paste' | 'file')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">
              <Clipboard className="w-4 h-4 mr-2" />
              Coller
            </TabsTrigger>
            <TabsTrigger value="file">
              <Upload className="w-4 h-4 mr-2" />
              Fichier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="pastedText" className="text-base font-medium">
                  Scénario
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePasteFromClipboard}
                  className="text-xs"
                >
                  <Clipboard className="w-3 h-3 mr-1" />
                  Coller depuis presse-papiers
                </Button>
              </div>
              <textarea
                id="pastedText"
                value={importedText}
                onChange={(e) => setImportedText(e.target.value)}
                placeholder="Collez votre scénario ici...&#10;&#10;Exemple:&#10;Scène 1: Introduction&#10;Présenter le sujet principal&#10;&#10;Scène 2: Développement&#10;Expliquer les concepts clés..."
                className="w-full min-h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <p className="text-sm text-gray-500">
                L'IA analysera votre scénario pour déterminer le nombre de scènes, images et textes nécessaires.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label htmlFor="fileUpload" className="text-base font-medium">
                Importer depuis un fichier
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  id="fileUpload"
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Cliquez pour importer un fichier
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formats supportés: TXT, MD, JSON
                    </p>
                  </div>
                </label>
              </div>
              {importedText && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Fichier importé ({importedText.length} caractères)
                  </p>
                  <div className="mt-2 p-2 bg-white rounded border border-green-100 max-h-32 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {importedText.substring(0, 200)}
                      {importedText.length > 200 && '...'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Comment l'IA analyse votre scénario
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Structure:</strong> Détecte automatiquement les scènes et sections</li>
            <li>• <strong>Images:</strong> Détermine le nombre d'images selon la complexité du contenu</li>
            <li>• <strong>Positionnement:</strong> Place les éléments selon la hiérarchie visuelle</li>
            <li>• <strong>Texte vs Images:</strong> Équilibre basé sur le type de contenu (narratif, didactique, etc.)</li>
            <li>• <strong>Style:</strong> Adapte la stylisation selon le ton du scénario</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleSkip}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!importedText.trim()}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Analyser et Continuer
        </Button>
      </div>
    </>
  );
};
