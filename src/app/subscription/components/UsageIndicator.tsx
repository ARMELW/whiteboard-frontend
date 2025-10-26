interface UsageIndicatorProps {
  label: string;
  current: number;
  limit: number;
  isUnlimited?: boolean;
  unit?: string;
  className?: string;
}

export function UsageIndicator({
  label,
  current,
  limit,
  isUnlimited = false,
  unit = '',
  className = '',
}: UsageIndicatorProps) {
  const percentage = isUnlimited ? 0 : (current / limit) * 100;
  const isNearLimit = percentage >= 80 && !isUnlimited;
  const isAtLimit = percentage >= 100 && !isUnlimited;

  const getProgressColor = () => {
    if (isUnlimited) return 'bg-blue-500';
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">
          {isUnlimited ? (
            <span className="text-blue-600 font-medium">Illimité</span>
          ) : (
            <>
              {current} / {limit} {unit}
            </>
          )}
        </span>
      </div>
      {!isUnlimited && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
