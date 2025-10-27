import { PLANS, type PlanId } from '../config/plans';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, Crown, Zap, Gift, Sparkles } from 'lucide-react';
import { useSession } from '@/app/auth';

interface PlanComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightPlan?: PlanId;
  onUpgrade?: (planId: PlanId) => void;
}

export function PlanComparisonModal({
  open,
  onOpenChange,
  highlightPlan,
  onUpgrade,
}: PlanComparisonModalProps) {
  const { user } = useSession();
  const currentPlanId = user?.planId || 'free';

  const planOrder: PlanId[] = ['free', 'starter', 'pro', 'enterprise'];

  const getIcon = (planId: PlanId) => {
    switch (planId) {
      case 'free':
        return <Gift className="h-5 w-5" />;
      case 'starter':
        return <Zap className="h-5 w-5" />;
      case 'pro':
        return <Crown className="h-5 w-5" />;
      case 'enterprise':
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getColor = (planId: PlanId) => {
    switch (planId) {
      case 'free':
        return 'text-gray-600';
      case 'starter':
        return 'text-blue-600';
      case 'pro':
        return 'text-purple-600';
      case 'enterprise':
        return 'text-orange-600';
    }
  };

  const getFeatureValue = (planId: PlanId, featureKey: keyof typeof PLANS.free.limits) => {
    const plan = PLANS[planId];
    const value = plan.limits[featureKey];
    
    if (value === -1) return <Check className="h-5 w-5 text-green-600" />;
    if (value === false || value === 0) return <X className="h-5 w-5 text-gray-400" />;
    if (typeof value === 'boolean') return value ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-gray-400" />;
    return <span className="text-sm">{value}</span>;
  };

  const featureLabels: Array<{ key: keyof typeof PLANS.free.limits; label: string }> = [
    { key: 'scenes', label: 'Scènes par projet' },
    { key: 'duration', label: 'Durée vidéo (sec)' },
    { key: 'quality', label: 'Qualité export' },
    { key: 'storage', label: 'Stockage cloud' },
    { key: 'audioTracks', label: 'Pistes audio' },
    { key: 'watermark', label: 'Sans watermark' },
    { key: 'aiVoice', label: 'IA Voix' },
    { key: 'aiScript', label: 'IA Script' },
    { key: 'collaboration', label: 'Collaboration' },
    { key: 'assets', label: 'Assets' },
    { key: 'fonts', label: 'Polices' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Comparaison des Plans</DialogTitle>
          <DialogDescription>
            Choisissez le plan qui correspond le mieux à vos besoins
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {planOrder.map((planId) => {
            const plan = PLANS[planId];
            const isCurrentPlan = planId === currentPlanId;
            const isHighlighted = planId === highlightPlan;

            return (
              <div
                key={planId}
                className={`
                  rounded-lg border-2 p-4 transition-all
                  ${isHighlighted ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}
                  ${isCurrentPlan ? 'bg-blue-50' : 'bg-white'}
                `}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={getColor(planId)}>
                    {getIcon(planId)}
                  </div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                </div>

                {isCurrentPlan && (
                  <div className="mb-3">
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      Plan actuel
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-3xl font-bold">
                    {plan.price === 0 ? (
                      'Gratuit'
                    ) : (
                      <>
                        {plan.price}€
                        <span className="text-sm text-gray-600 font-normal">/mois</span>
                      </>
                    )}
                  </div>
                  {plan.priceYearly && (
                    <div className="text-sm text-gray-600 mt-1">
                      ou {plan.priceYearly}€/an
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                  {plan.description}
                </p>

                {!isCurrentPlan && onUpgrade && (
                  <Button
                    onClick={() => onUpgrade(planId)}
                    className="w-full mb-4"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {planOrder.indexOf(planId) > planOrder.indexOf(currentPlanId)
                      ? 'Passer à ce plan'
                      : 'Nous contacter'}
                  </Button>
                )}

                <div className="space-y-2 pt-4 border-t">
                  <p className="font-semibold text-sm mb-2">Caractéristiques:</p>
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <p className="text-xs text-gray-500 italic">
                      +{plan.features.length - 4} autres fonctionnalités
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h4 className="font-bold text-lg mb-4">Tableau comparatif détaillé</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border-b font-semibold">Fonctionnalité</th>
                  {planOrder.map((planId) => (
                    <th
                      key={planId}
                      className={`p-3 border-b text-center ${
                        planId === currentPlanId ? 'bg-blue-100' : ''
                      }`}
                    >
                      <div className={`flex items-center justify-center gap-2 ${getColor(planId)}`}>
                        {getIcon(planId)}
                        <span className="font-semibold">{PLANS[planId].name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureLabels.map(({ key, label }) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="p-3 border-b text-sm">{label}</td>
                    {planOrder.map((planId) => (
                      <td
                        key={planId}
                        className={`p-3 border-b text-center ${
                          planId === currentPlanId ? 'bg-blue-50' : ''
                        }`}
                      >
                        {getFeatureValue(planId, key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
