import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LimitWarningProps {
  title: string;
  message: string;
  current: number;
  limit: number;
  percentage: number;
  onUpgrade?: () => void;
}

export function LimitWarning({
  title,
  message,
  current,
  limit,
  percentage,
  onUpgrade,
}: LimitWarningProps) {
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  if (!isNearLimit) return null;

  return (
    <div
      className={`p-4 rounded-lg border ${
        isAtLimit
          ? 'bg-red-50 border-red-300'
          : 'bg-yellow-50 border-yellow-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
            isAtLimit ? 'text-red-600' : 'text-yellow-600'
          }`}
        />
        <div className="flex-1 space-y-2">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm text-gray-700">{message}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>
                {current} / {limit}
              </span>
              <span>{Math.round(percentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isAtLimit ? 'bg-red-600' : 'bg-yellow-600'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
          {onUpgrade && isAtLimit && (
            <Button
              size="sm"
              onClick={onUpgrade}
              className="mt-2"
            >
              Passer au plan supérieur
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
