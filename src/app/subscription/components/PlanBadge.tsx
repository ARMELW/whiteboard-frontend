import { useState } from 'react';
import { PLANS, type PlanId } from '../config/plans';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Gift, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PlanComparisonModal } from './PlanComparisonModal';
import { useSession } from '@/app/auth';
import { usePlanLimits } from '../hooks/usePlanLimits';
import { differenceInDays, format } from 'date-fns';

interface PlanBadgeProps {
  planId: PlanId;
  className?: string;
  showComparison?: boolean;
  showUsageMetrics?: boolean;
  trialEnd?: Date;
  currentScenes?: number;
  currentProjects?: number;
  totalDuration?: number;
}

export function PlanBadge({
  planId,
  className = '',
  showComparison = true,
  showUsageMetrics = true,
  trialEnd,
  currentScenes = 0,
  currentProjects = 0,
  totalDuration = 0,
}: PlanBadgeProps) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useSession();
  const { checkSceneLimit, checkStorageLimit, checkDurationLimit } = usePlanLimits();
  const plan = PLANS[planId];

  const isTrialing = trialEnd && new Date(trialEnd) > new Date();
  const trialDaysLeft = isTrialing ? differenceInDays(new Date(trialEnd), new Date()) : 0;

  const sceneCheck = checkSceneLimit(currentScenes);
  const storageCheck = checkStorageLimit(currentProjects);
  const durationCheck = checkDurationLimit(totalDuration);

  const getVariant = () => {
    switch (planId) {
      case 'free':
        return 'secondary';
      case 'starter':
        return 'default';
      case 'pro':
        return 'default';
      case 'enterprise':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getIcon = () => {
    if (isTrialing) {
      return <Clock className="h-3 w-3" />;
    }
    switch (planId) {
      case 'free':
        return <Gift className="h-3 w-3" />;
      case 'starter':
        return <Zap className="h-3 w-3" />;
      case 'pro':
        return <Crown className="h-3 w-3" />;
      case 'enterprise':
        return <Sparkles className="h-3 w-3" />;
    }
  };

  const getColor = () => {
    if (isTrialing) {
      return 'bg-yellow-100 text-yellow-900 border-yellow-300';
    }
    switch (planId) {
      case 'free':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'starter':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pro':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'enterprise':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-900 border-orange-300';
    }
  };

  const handleUpgrade = (newPlanId: PlanId) => {
    setShowModal(false);
    // Redirect to subscription page or trigger upgrade flow
    window.location.href = `/subscription?upgrade=${newPlanId}`;
  };

  const getUsageTooltipContent = () => {
    return (
      <div className="space-y-2 p-2">
        <div className="font-semibold text-sm border-b pb-2 mb-2">
          Utilisation actuelle
        </div>
        
        {showUsageMetrics && (
          <>
            <div className="flex items-center justify-between gap-4 text-xs">
              <span>Scènes:</span>
              <span className={sceneCheck.percentage > 80 ? 'text-orange-400 font-semibold' : ''}>
                {sceneCheck.isUnlimited 
                  ? `${currentScenes} (illimité)` 
                  : `${currentScenes}/${sceneCheck.limit}`}
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-4 text-xs">
              <span>Projets cloud:</span>
              <span className={storageCheck.percentage > 80 ? 'text-orange-400 font-semibold' : ''}>
                {storageCheck.isUnlimited 
                  ? `${currentProjects} (illimité)` 
                  : storageCheck.limit === 0 
                    ? 'Non disponible'
                    : `${currentProjects}/${storageCheck.limit}`}
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-4 text-xs">
              <span>Durée totale:</span>
              <span className={durationCheck.percentage > 80 ? 'text-orange-400 font-semibold' : ''}>
                {durationCheck.isUnlimited 
                  ? `${Math.round(totalDuration / 60)}min (illimité)` 
                  : `${Math.round(totalDuration / 60)}/${Math.round(durationCheck.limit / 60)}min`}
              </span>
            </div>

            {(sceneCheck.percentage > 80 || storageCheck.percentage > 80 || durationCheck.percentage > 80) && (
              <div className="mt-2 pt-2 border-t flex items-center gap-1 text-orange-400">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-semibold">Envisagez une mise à niveau</span>
              </div>
            )}
          </>
        )}
        
        {isTrialing && (
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-yellow-400">
              <Clock className="h-3 w-3" />
              <span className="font-semibold">Essai: {trialDaysLeft} jour(s) restant(s)</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Fin: {format(new Date(trialEnd), 'dd/MM/yyyy')}
            </div>
          </div>
        )}
        
        {showComparison && (
          <div className="mt-2 pt-2 border-t text-xs text-blue-400 cursor-pointer hover:text-blue-300">
            Cliquez pour comparer les plans
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              onClick={() => showComparison && setShowModal(true)}
              className={showComparison ? 'cursor-pointer' : ''}
            >
              <Badge
                variant={getVariant()}
                className={`inline-flex items-center gap-1 ${getColor()} ${className}`}
              >
                {getIcon()}
                <span className="font-medium">
                  {plan.name}
                  {isTrialing && ` (Essai: ${trialDaysLeft}j)`}
                </span>
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className="w-64 bg-gray-900 text-gray-100 border-gray-700"
          >
            {getUsageTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showComparison && (
        <PlanComparisonModal
          open={showModal}
          onOpenChange={setShowModal}
          highlightPlan={planId}
          onUpgrade={handleUpgrade}
        />
      )}
    </>
  );
}
