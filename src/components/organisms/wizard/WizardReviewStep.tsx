import React, { useState } from 'react';
import { useWizard } from '@/app/wizard';
import { CheckCircle2, Clock, Image, Mic, ArrowLeft, Info, Lightbulb, Eye } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const WizardReviewStep: React.FC = () => {
  const { 
    generatedScript, 
    generatedAssets, 
    generatedScenes,
    applyGeneratedScenes,
    previousStep,
    closeWizard 
  } = useWizard();
  const [selectedScene, setSelectedScene] = useState<string | null>(null);

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
                  
                  {/* AI Decisions for this scene */}
                  {scene.aiDecisions && (
                    <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-semibold text-purple-900">Décisions IA pour cette scène</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-purple-800">
                        <div className="flex items-start gap-2">
                          <Image className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span><strong>{scene.aiDecisions.imageCount} image(s)</strong> générée(s)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{scene.aiDecisions.styleChoices.layoutReason}</span>
                        </div>
                        {scene.aiDecisions.textLayers.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Eye className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span><strong>{scene.aiDecisions.textLayers.length} calque(s) de texte</strong> pour renforcer les messages</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Show positioning details */}
                      <Accordion type="single" collapsible className="mt-2">
                        <AccordionItem value="details" className="border-none">
                          <AccordionTrigger className="text-xs text-purple-700 py-2 hover:no-underline">
                            Voir les détails de positionnement
                          </AccordionTrigger>
                          <AccordionContent className="text-xs space-y-2">
                            {scene.aiDecisions.imagePositions.map((pos, idx) => (
                              <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded">
                                <span className="font-semibold text-purple-900">Image {idx + 1}:</span>
                                <div>
                                  <div className="text-gray-700">Position: ({Math.round(pos.x)}, {Math.round(pos.y)})</div>
                                  <div className="text-purple-700 italic">{pos.reason}</div>
                                </div>
                              </div>
                            ))}
                            {scene.aiDecisions.textLayers.map((layer, idx) => (
                              <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded">
                                <span className="font-semibold text-purple-900">Texte {idx + 1}:</span>
                                <div>
                                  <div className="text-gray-700">"{layer.content}"</div>
                                  <div className="text-purple-700 italic">{layer.reason}</div>
                                </div>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                  
                  {sceneDoodles.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {sceneDoodles.slice(0, 3).map((doodle) => (
                        <div
                          key={doodle.id}
                          className="relative group"
                        >
                          <div className="w-16 h-12 rounded border border-gray-200 bg-gray-50 overflow-hidden">
                            <img
                              src={doodle.url}
                              alt={doodle.description}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {doodle.reasoning && (
                            <div className="absolute bottom-full mb-2 left-0 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                              {doodle.reasoning}
                            </div>
                          )}
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
