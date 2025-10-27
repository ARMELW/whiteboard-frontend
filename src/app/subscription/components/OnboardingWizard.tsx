import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Crown, 
  Zap, 
  Video, 
  Cloud,
  Palette,
  Users
} from 'lucide-react';
import { PLANS, type PlanId } from '../config/plans';
import { useSession } from '@/app/auth';

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (selectedPlan?: PlanId) => void;
}

type WizardStep = 'welcome' | 'plan-selection' | 'features' | 'complete';

export function OnboardingWizard({
  open,
  onOpenChange,
  onComplete,
}: OnboardingWizardProps) {
  const { user } = useSession();
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('free');

  const handleNext = () => {
    const steps: WizardStep[] = ['welcome', 'plan-selection', 'features', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: WizardStep[] = ['welcome', 'plan-selection', 'features', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = () => {
    onComplete?.(selectedPlan);
    onOpenChange(false);
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="rounded-full bg-blue-100 p-6">
          <Rocket className="h-16 w-16 text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">
          Bienvenue {user?.firstName ? `${user.firstName}` : 'sur notre plateforme'} !
        </h2>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Créez des vidéos d'animation professionnelles en quelques minutes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
        <div className="p-4 bg-blue-50 rounded-lg">
          <Video className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Animation facile</h3>
          <p className="text-sm text-gray-600">Interface intuitive pour créer vos vidéos</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <Palette className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Assets premium</h3>
          <p className="text-sm text-gray-600">Bibliothèque riche d'éléments visuels</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <Cloud className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Cloud & Partage</h3>
          <p className="text-sm text-gray-600">Sauvegarde et collaboration en ligne</p>
        </div>
      </div>

      <div className="pt-6">
        <Button onClick={handleNext} size="lg" className="px-8">
          Commencer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderPlanSelectionStep = () => {
    const recommendedPlan = getRecommendedPlan();
    
    return (
      <div className="space-y-6 py-6">
        <div className="text-center space-y-2">
          <Target className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="text-2xl font-bold">Choisissez votre plan</h2>
          <p className="text-gray-600">
            Sélectionnez le plan qui correspond le mieux à vos besoins
          </p>
        </div>

        {recommendedPlan && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm font-semibold text-blue-900">
              💡 Recommandation: Nous vous suggérons le plan <span className="font-bold">{PLANS[recommendedPlan].name}</span> basé sur votre profil
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {(['free', 'starter', 'pro', 'enterprise'] as PlanId[]).map((planId) => {
            const plan = PLANS[planId];
            const isSelected = selectedPlan === planId;
            const isRecommended = planId === recommendedPlan;

            return (
              <div
                key={planId}
                onClick={() => setSelectedPlan(planId)}
                className={`
                  relative p-6 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300'
                  }
                  ${isRecommended && !isSelected ? 'border-yellow-400' : ''}
                `}
              >
                {isRecommended && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      Recommandé
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  {planId === 'pro' && <Crown className="h-6 w-6 text-purple-600" />}
                  {planId === 'starter' && <Zap className="h-6 w-6 text-blue-600" />}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                <div className="mb-3">
                  <div className="text-3xl font-bold">
                    {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                    {plan.price > 0 && <span className="text-sm text-gray-600 font-normal">/mois</span>}
                  </div>
                  {plan.priceYearly && (
                    <p className="text-sm text-gray-600 mt-1">
                      ou {plan.priceYearly}€/an (2 mois offerts)
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                <ul className="space-y-2">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                      <CheckCircle2 className="h-5 w-5" />
                      Plan sélectionné
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-6">
          <Button onClick={handleBack} variant="outline">
            Retour
          </Button>
          <Button onClick={handleNext} size="lg">
            Continuer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderFeaturesStep = () => {
    const features = [
      {
        icon: <Video className="h-8 w-8" />,
        title: 'Création de scènes',
        description: 'Créez plusieurs scènes et organisez votre storytelling',
        color: 'text-blue-600 bg-blue-50',
      },
      {
        icon: <Palette className="h-8 w-8" />,
        title: 'Bibliothèque d\'assets',
        description: 'Accédez à des milliers d\'images, icônes et formes',
        color: 'text-purple-600 bg-purple-50',
      },
      {
        icon: <Cloud className="h-8 w-8" />,
        title: 'Sauvegarde cloud',
        description: 'Vos projets sont automatiquement sauvegardés',
        color: 'text-green-600 bg-green-50',
      },
      {
        icon: <Users className="h-8 w-8" />,
        title: 'Collaboration',
        description: 'Travaillez en équipe sur vos projets (plans Pro+)',
        color: 'text-orange-600 bg-orange-50',
      },
    ];

    return (
      <div className="space-y-6 py-6">
        <div className="text-center space-y-2">
          <Zap className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="text-2xl font-bold">Découvrez les fonctionnalités</h2>
          <p className="text-gray-600">
            Tout ce dont vous avez besoin pour créer des vidéos exceptionnelles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6">
          <Button onClick={handleBack} variant="outline">
            Retour
          </Button>
          <Button onClick={handleNext} size="lg">
            Continuer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderCompleteStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-6">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Vous êtes prêt !</h2>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Commencez à créer votre première vidéo d'animation dès maintenant
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold mb-2">Plan sélectionné:</h3>
        <div className="text-2xl font-bold text-blue-600 mb-2">
          {PLANS[selectedPlan].name}
        </div>
        <p className="text-sm text-gray-600">
          {PLANS[selectedPlan].description}
        </p>
        {selectedPlan !== 'free' && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-gray-700">
              Vous pourrez activer votre abonnement depuis la page de gestion
            </p>
          </div>
        )}
      </div>

      <div className="pt-6">
        <Button onClick={handleComplete} size="lg" className="px-8">
          Commencer à créer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const getRecommendedPlan = (): PlanId | null => {
    // Simple recommendation logic
    // In a real app, this would analyze user profile, industry, etc.
    if (user?.email?.includes('enterprise') || user?.email?.includes('company')) {
      return 'pro';
    }
    // Default recommendation for most users
    return 'starter';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Assistant de démarrage</DialogTitle>
          <DialogDescription className="sr-only">
            Configurez votre compte et découvrez les fonctionnalités
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {(['welcome', 'plan-selection', 'features', 'complete'] as WizardStep[]).map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`
                      w-3 h-3 rounded-full transition-colors
                      ${currentStep === step 
                        ? 'bg-blue-600 scale-125' 
                        : (['welcome', 'plan-selection', 'features', 'complete'] as WizardStep[]).indexOf(currentStep) > idx
                          ? 'bg-blue-400'
                          : 'bg-gray-300'
                      }
                    `}
                  />
                  {idx < 3 && (
                    <div
                      className={`
                        w-12 h-0.5 transition-colors
                        ${(['welcome', 'plan-selection', 'features', 'complete'] as WizardStep[]).indexOf(currentStep) > idx
                          ? 'bg-blue-400'
                          : 'bg-gray-300'
                        }
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          {currentStep === 'welcome' && renderWelcomeStep()}
          {currentStep === 'plan-selection' && renderPlanSelectionStep()}
          {currentStep === 'features' && renderFeaturesStep()}
          {currentStep === 'complete' && renderCompleteStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
