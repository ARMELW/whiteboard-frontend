import { PLANS, type PlanId } from '../config/plans';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Gift } from 'lucide-react';

interface PlanBadgeProps {
  planId: PlanId;
  className?: string;
}

export function PlanBadge({ planId, className = '' }: PlanBadgeProps) {
  const plan = PLANS[planId];

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
    switch (planId) {
      case 'free':
        return <Gift className="h-3 w-3" />;
      case 'starter':
        return <Zap className="h-3 w-3" />;
      case 'pro':
        return <Crown className="h-3 w-3" />;
      case 'enterprise':
        return <Crown className="h-3 w-3" />;
    }
  };

  const getColor = () => {
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

  return (
    <Badge
      variant={getVariant()}
      className={`inline-flex items-center gap-1 ${getColor()} ${className}`}
    >
      {getIcon()}
      <span className="font-medium">{plan.name}</span>
    </Badge>
  );
}
