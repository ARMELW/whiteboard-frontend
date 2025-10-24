import React from 'react';
import { useWizard } from '@/app/wizard';
import { CheckCircle2, Clock, Image, Mic, ArrowLeft } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const WizardReviewStep: React.FC = () => {
  const { 
    generatedScript, 
    generatedAssets, 
    generatedScenes,
    applyGeneratedScenes,
    previousStep,
    closeWizard 
  } = useWizard();

  if (!generatedScript) {
    return null;
  }

  const doodleCount = generatedAssets.filter(a => a.type === 'doodle').length;
  const audioCount = generatedAssets.filter(a => a.type === 'audio').length;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          Assistant IA - Aperçu du Projet
        </DialogTitle>
        <DialogDescription>
          Votre projet a été généré avec succès! Vérifiez le contenu avant de l'appliquer.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-900">Scènes</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{generatedScenes.length}</p>
            <p className="text-xs text-blue-700 mt-1">
              ~{generatedScript.estimatedDuration}s au total
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-900">Images</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{doodleCount}</p>
            <p className="text-xs text-purple-700 mt-1">Illustrations générées</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-900">Audio</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{audioCount}</p>
            <p className="text-xs text-green-700 mt-1">Pistes voix-off</p>
          </div>
        </div>

        <Separator />

        {/* Scenes Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Aperçu des scènes</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {generatedScript.scenes.map((scene, index) => {
              const sceneAssets = generatedAssets.filter(a => a.sceneId === scene.id);
              const sceneDoodles = sceneAssets.filter(a => a.type === 'doodle');
              
              return (
                <div key={scene.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-gray-900">{scene.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{scene.content}</p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                      {scene.duration}s
                    </span>
                  </div>
                  
                  {sceneDoodles.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {sceneDoodles.slice(0, 3).map((doodle) => (
                        <div
                          key={doodle.id}
                          className="w-16 h-12 rounded border border-gray-200 bg-gray-50 overflow-hidden"
                        >
                          <img
                            src={doodle.url}
                            alt={doodle.description}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {sceneDoodles.length > 3 && (
                        <div className="w-16 h-12 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          +{sceneDoodles.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Vous pourrez modifier chaque scène individuellement après l'application.
            Les images et audios sont générés automatiquement par l'IA.
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={closeWizard}
        >
          Annuler
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              // Reset to configuration to regenerate
              previousStep();
              previousStep();
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Modifier la config
          </Button>
          <Button
            onClick={applyGeneratedScenes}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Appliquer les scènes
          </Button>
        </div>
      </div>
    </>
  );
};
