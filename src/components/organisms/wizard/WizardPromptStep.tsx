import React, { useState } from 'react';
import { useWizard } from '@/app/wizard';
import { Sparkles, Lightbulb } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const examplePrompts = [
  "Créer une vidéo éducative sur les bases de la photographie",
  "Expliquer comment fonctionne le marketing digital en 5 étapes",
  "Tutoriel pour apprendre à créer un site web",
  "Présentation de notre nouvelle application mobile",
];

export const WizardPromptStep: React.FC = () => {
  const { prompt, setPrompt, nextStep } = useWizard();
  const [localPrompt, setLocalPrompt] = useState(prompt);

  const handleContinue = () => {
    setPrompt(localPrompt);
    nextStep();
  };

  const handleUseExample = (example: string) => {
    setLocalPrompt(example);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Assistant IA - Étape 1: Votre Projet
        </DialogTitle>
        <DialogDescription>
          Décrivez votre projet en quelques phrases. L'IA générera automatiquement le script, les visuels et les animations.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-6">
        <div className="space-y-3">
          <Label htmlFor="prompt" className="text-base font-medium">
            Que souhaitez-vous créer ?
          </Label>
          <textarea
            id="prompt"
            value={localPrompt}
            onChange={(e) => setLocalPrompt(e.target.value)}
            placeholder="Ex: Créer une vidéo éducative expliquant comment..."
            className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <p className="text-sm text-gray-500">
            Soyez aussi détaillé que possible pour de meilleurs résultats.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Lightbulb className="w-4 h-4" />
            <span>Exemples de prompts</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleUseExample(example)}
                className="text-left p-3 text-sm border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          onClick={handleContinue}
          disabled={!localPrompt.trim()}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Continuer
        </Button>
      </div>
    </>
  );
};
