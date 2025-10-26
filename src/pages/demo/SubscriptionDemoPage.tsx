import { useState } from 'react';
import { 
  UpgradePlanModal, 
  LimitWarning, 
  PlanBadge, 
  UsageIndicator,
  WatermarkOverlay,
  PLANS 
} from '@/app/subscription';
import { Button } from '@/components/ui/button';

export function SubscriptionDemoPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Subscription System Demo
          </h1>
          <p className="text-gray-600">
            Interactive demonstration of all subscription components
          </p>
        </div>

        {/* Plan Badges */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Plan Badges</h2>
          <div className="flex flex-wrap gap-3">
            <PlanBadge planId="free" />
            <PlanBadge planId="starter" />
            <PlanBadge planId="pro" />
            <PlanBadge planId="enterprise" />
          </div>
        </section>

        {/* Usage Indicators */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Usage Indicators</h2>
          <div className="space-y-4 max-w-md">
            <UsageIndicator
              label="Scènes utilisées"
              current={2}
              limit={3}
              unit="scènes"
            />
            <UsageIndicator
              label="Durée vidéo"
              current={45}
              limit={60}
              unit="secondes"
            />
            <UsageIndicator
              label="Stockage cloud (Pro)"
              current={8}
              limit={-1}
              isUnlimited={true}
              unit="projets"
            />
            <UsageIndicator
              label="Stockage cloud (Starter)"
              current={4}
              limit={5}
              unit="projets"
            />
          </div>
        </section>

        {/* Limit Warnings */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Limit Warnings</h2>
          <div className="space-y-4 max-w-2xl">
            <LimitWarning
              title="Limite de scènes atteinte"
              message="Vous avez atteint votre limite de 3 scènes. Passez au plan Starter pour créer jusqu'à 10 scènes."
              current={3}
              limit={3}
              percentage={100}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
            <LimitWarning
              title="Attention: Limite proche"
              message="Vous approchez de votre limite de durée vidéo. 50 secondes sur 60 utilisées."
              current={50}
              limit={60}
              percentage={83}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          </div>
        </section>

        {/* Upgrade Modal Demo */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Upgrade Modal</h2>
          <Button onClick={() => setShowUpgradeModal(true)}>
            Ouvrir la modale d'upgrade
          </Button>
        </section>

        {/* Watermark Demo */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Watermark Overlay (Free Plan)</h2>
          <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-600">Aperçu de la vidéo exportée</p>
            <WatermarkOverlay />
          </div>
        </section>

        {/* Plan Comparison */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Plans Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Starter</th>
                  <th className="text-center py-3 px-4">Pro</th>
                  <th className="text-center py-3 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Prix</td>
                  <td className="text-center py-3 px-4">Gratuit</td>
                  <td className="text-center py-3 px-4">9€/mois</td>
                  <td className="text-center py-3 px-4">29€/mois</td>
                  <td className="text-center py-3 px-4">Sur devis</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Scènes</td>
                  <td className="text-center py-3 px-4">{PLANS.free.limits.scenes}</td>
                  <td className="text-center py-3 px-4">{PLANS.starter.limits.scenes}</td>
                  <td className="text-center py-3 px-4">∞</td>
                  <td className="text-center py-3 px-4">∞</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Durée</td>
                  <td className="text-center py-3 px-4">1 min</td>
                  <td className="text-center py-3 px-4">5 min</td>
                  <td className="text-center py-3 px-4">∞</td>
                  <td className="text-center py-3 px-4">∞</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Qualité</td>
                  <td className="text-center py-3 px-4">720p</td>
                  <td className="text-center py-3 px-4">1080p</td>
                  <td className="text-center py-3 px-4">4K</td>
                  <td className="text-center py-3 px-4">4K</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">IA Vocale</td>
                  <td className="text-center py-3 px-4">—</td>
                  <td className="text-center py-3 px-4">—</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Upgrade Modal */}
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlanId="free"
        feature="Créer plus de scènes et vidéos plus longues"
        requiredPlanId="starter"
      />
    </div>
  );
}
