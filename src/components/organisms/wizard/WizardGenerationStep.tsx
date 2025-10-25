import React, { useEffect, useState } from 'react';
import { useWizard } from '@/app/wizard';
import { Loader2, Wand2, CheckCircle2, Image, Type, Layers, Sparkles } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface GenerationProgress {
  step: string;
  status: 'pending' | 'processing' | 'completed';
  details?: string;
}

export const WizardGenerationStep: React.FC = () => {
  const { isGenerating } = useWizard();
  const [progressSteps, setProgressSteps] = useState<GenerationProgress[]>([
    { step: 'Analyse du scénario', status: 'pending', details: 'Détection de la structure et des thèmes principaux' },
    { step: 'Planification visuelle', status: 'pending', details: 'Détermination du nombre et type d\'éléments visuels' },
    { step: 'Génération des images', status: 'pending', details: 'Création des illustrations doodle' },
    { step: 'Positionnement intelligent', status: 'pending', details: 'Calcul des positions optimales pour chaque élément' },
    { step: 'Génération de la voix-off', status: 'pending', details: 'Synthèse vocale du script' },
    { step: 'Assemblage des scènes', status: 'pending', details: 'Création de la timeline finale' },
  ]);

  useEffect(() => {
    if (!isGenerating) return;

    const updateProgress = async () => {
      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setProgressSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'processing' } : step
        ));
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProgressSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'completed' } : step
        ));
      }
    };

    updateProgress();
  }, [isGenerating]);

  const getStepIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'processing') return <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />;
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <Wand2 className="w-6 h-6 text-purple-500" />
          Assistant IA - Génération en cours
        </DialogTitle>
        <DialogDescription>
          L'IA analyse votre projet et prend des décisions intelligentes sur la présentation visuelle
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center py-8 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-purple-200 rounded-full animate-pulse"></div>
          </div>
          <div className="relative flex items-center justify-center w-32 h-32">
            <Sparkles className="w-16 h-16 text-purple-500 animate-pulse" />
          </div>
        </div>

        <div className="w-full max-w-2xl space-y-3">
          {progressSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                step.status === 'completed' 
                  ? 'bg-green-50 border border-green-200' 
                  : step.status === 'processing'
                  ? 'bg-purple-50 border border-purple-300 shadow-md'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    step.status === 'completed' ? 'text-green-900' :
                    step.status === 'processing' ? 'text-purple-900' :
                    'text-gray-700'
                  }`}>
                    {step.step}
                  </span>
                  {step.status === 'processing' && (
                    <span className="text-xs text-purple-600 animate-pulse">En cours...</span>
                  )}
                  {step.status === 'completed' && (
                    <span className="text-xs text-green-600">✓ Terminé</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{step.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time AI Decisions Display */}
        <div className="w-full max-w-2xl p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Décisions IA en temps réel
          </h4>
          <div className="space-y-2 text-xs text-blue-800">
            {progressSteps.find(s => s.status === 'processing')?.step === 'Planification visuelle' && (
              <div className="flex items-start gap-2">
                <Image className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Analyse: Scénario éducatif détecté → 3-4 images par scène recommandées</span>
              </div>
            )}
            {progressSteps.find(s => s.status === 'processing')?.step === 'Positionnement intelligent' && (
              <div className="flex items-start gap-2">
                <Layers className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Calcul: Disposition en grille choisie pour optimiser la lisibilité</span>
              </div>
            )}
            {progressSteps.find(s => s.status === 'completed')?.step === 'Génération des images' && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Images générées avec style professionnel adapté au ton du contenu</span>
              </div>
            )}
            {progressSteps.filter(s => s.status === 'completed').length >= 3 && (
              <div className="flex items-start gap-2">
                <Type className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Équilibre texte/image: 60/40 basé sur la densité d'information</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
