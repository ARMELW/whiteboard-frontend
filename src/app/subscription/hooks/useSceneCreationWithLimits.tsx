import { useState } from 'react';
import { usePlanLimits } from '@/app/subscription';
import { UpgradePlanModal } from '@/app/subscription/components';
import { useSceneStore } from '@/app/scenes/store';

export function useSceneCreationWithLimits() {
  const { checkSceneLimit } = usePlanLimits();
  const scenes = useSceneStore((state) => state.scenes);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const canCreateScene = () => {
    const limitCheck = checkSceneLimit(scenes.length);
    return limitCheck.allowed;
  };

  const attemptCreateScene = (onSuccess: () => void) => {
    if (canCreateScene()) {
      onSuccess();
    } else {
      setShowUpgradeModal(true);
    }
  };

  const UpgradeModal = () => {
    return (
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlanId="free"
        feature="Créer plus de scènes"
        requiredPlanId="starter"
      />
    );
  };

  return {
    canCreateScene,
    attemptCreateScene,
    UpgradeModal,
    limitCheck: checkSceneLimit(scenes.length),
  };
}
