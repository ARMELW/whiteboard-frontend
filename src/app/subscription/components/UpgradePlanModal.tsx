import { PLANS, type PlanId } from '@/app/subscription';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId: PlanId;
  feature: string;
  requiredPlanId?: PlanId;
}

export function UpgradePlanModal({
  isOpen,
  onClose,
  currentPlanId,
  feature,
  requiredPlanId = 'pro',
}: UpgradePlanModalProps) {
  const navigate = useNavigate();
  const currentPlan = PLANS[currentPlanId];
  const requiredPlan = PLANS[requiredPlanId];

  const handleUpgrade = () => {
    navigate('/pricing');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Crown className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center">
            Fonctionnalité Premium
          </DialogTitle>
          <DialogDescription className="text-center">
            Cette fonctionnalité nécessite un plan supérieur
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">
              {feature}
            </p>
            <p className="text-xs text-blue-700">
              Disponible avec le plan <strong>{requiredPlan.name}</strong> ou supérieur
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Votre plan actuel :</p>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{currentPlan.name}</span>
              <span className="text-sm text-gray-600">
                {currentPlan.price === 0 ? 'Gratuit' : `${currentPlan.price}€/mois`}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Passez au plan {requiredPlan.name} :</p>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold">{requiredPlan.name}</span>
                <span className="text-2xl font-bold text-blue-600">
                  {requiredPlan.price}€<span className="text-sm font-normal">/mois</span>
                </span>
              </div>
              <ul className="space-y-2">
                {requiredPlan.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Plus tard
          </Button>
          <Button onClick={handleUpgrade} className="flex-1">
            Voir les plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
