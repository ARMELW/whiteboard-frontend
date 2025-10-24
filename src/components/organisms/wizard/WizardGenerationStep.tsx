import React from 'react';
import { useWizard } from '@/app/wizard';
import { Loader2, Wand2 } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export const WizardGenerationStep: React.FC = () => {
  const { isGenerating } = useWizard();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <Wand2 className="w-6 h-6 text-purple-500" />
          Assistant IA - Génération en cours
        </DialogTitle>
        <DialogDescription>
          L'IA crée votre projet. Cela peut prendre quelques instants...
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center py-16 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-purple-200 rounded-full animate-pulse"></div>
          </div>
          <div className="relative flex items-center justify-center w-32 h-32">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Génération de votre projet...
          </h3>
          <p className="text-gray-600">
            L'IA analyse votre demande et crée le contenu
          </p>
        </div>

        <div className="w-full max-w-md space-y-3">
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">Génération du script...</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg opacity-50">
            <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Génération des illustrations...</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg opacity-50">
            <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Génération de la voix-off...</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg opacity-50">
            <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Assemblage des scènes...</span>
          </div>
        </div>
      </div>
    </>
  );
};
