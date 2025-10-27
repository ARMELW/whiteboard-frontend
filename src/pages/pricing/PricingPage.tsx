import { PLANS, type Plan, type PlanId } from '@/app/subscription';
import { usePricingPlans, useCreateCheckout } from '@/app/subscription/hooks';
import { useSession } from '@/app/auth';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PricingPage() {
  const navigate = useNavigate();
  const { data: apiPlans, isLoading, error } = usePricingPlans();
  const { mutate: createCheckout, isPending: isCreatingCheckout } = useCreateCheckout();
  const { user, isAuthenticated } = useSession();
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const planOrder: PlanId[] = ['free', 'starter', 'pro', 'enterprise'];

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    if (planId === 'free') {
      navigate('/');
      return;
    }

    createCheckout({
      planId,
      billingPeriod: selectedBilling,
      successUrl: window.location.origin + '/?checkout=success',
      cancelUrl: window.location.origin + '/pricing?checkout=cancel',
    });
  };

  const displayPlans = apiPlans?.length
    ? apiPlans
    : planOrder.map((id) => PLANS[id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('Failed to load pricing from API, using local plans:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-600">
            Démarrez gratuitement, upgradez quand vous êtes prêt
          </p>

          {isAuthenticated && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="text-sm"
              >
                Continuer avec le plan gratuit →
              </Button>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedBilling === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setSelectedBilling('yearly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedBilling === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Annuel
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPlans.map((plan: any) => {
            const localPlan = PLANS[plan.id as PlanId];
            const currentPlan = localPlan || plan;
            const isCurrentPlan = user?.planId === plan.id;
            
            return (
              <PricingCard
                key={plan.id}
                plan={currentPlan}
                billingPeriod={selectedBilling}
                onSelect={() => handleSelectPlan(plan.id)}
                isLoading={isCreatingCheckout}
                isCurrentPlan={isCurrentPlan}
              />
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Comparaison détaillée
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ComparisonTable />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PricingCardProps {
  plan: Plan;
  billingPeriod: 'monthly' | 'yearly';
  onSelect: () => void;
  isLoading: boolean;
  isCurrentPlan: boolean;
}

function PricingCard({ plan, billingPeriod, onSelect, isLoading, isCurrentPlan }: PricingCardProps) {
  const price = billingPeriod === 'yearly' && plan.priceYearly
    ? plan.priceYearly
    : plan.price;
  
  const displayPrice = billingPeriod === 'yearly' && plan.priceYearly
    ? Math.round(plan.priceYearly / 12)
    : plan.price;

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm p-6 flex flex-col ${
        plan.popular ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
          POPULAIRE
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">
            {displayPrice === 0 ? 'Gratuit' : `${displayPrice}€`}
          </span>
          {displayPrice > 0 && (
            <span className="text-gray-500 ml-2">/mois</span>
          )}
        </div>
        {billingPeriod === 'yearly' && plan.priceYearly && plan.priceYearly > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Facturé {plan.priceYearly}€/an
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSelect}
        variant={plan.popular ? 'default' : 'outline'}
        className="w-full"
        disabled={isLoading || isCurrentPlan}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Chargement...
          </>
        ) : isCurrentPlan ? (
          'Plan actuel'
        ) : plan.price === 0 ? (
          'Commencer gratuitement'
        ) : (
          'Choisir ce plan'
        )}
      </Button>
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Fonctionnalité</th>
            <th className="text-center py-3 px-4">Gratuit</th>
            <th className="text-center py-3 px-4">Starter</th>
            <th className="text-center py-3 px-4">Pro</th>
            <th className="text-center py-3 px-4">Entreprise</th>
          </tr>
        </thead>
        <tbody>
          <ComparisonRow
            feature="Scènes par projet"
            free="3"
            starter="10"
            pro="Illimité"
            enterprise="Illimité"
          />
          <ComparisonRow
            feature="Durée vidéo"
            free="1 min"
            starter="5 min"
            pro="Illimité"
            enterprise="Illimité"
          />
          <ComparisonRow
            feature="Qualité export"
            free="720p"
            starter="1080p"
            pro="4K"
            enterprise="4K"
          />
          <ComparisonRow
            feature="Watermark"
            free="✓"
            starter="—"
            pro="—"
            enterprise="—"
          />
          <ComparisonRow
            feature="Assets disponibles"
            free="50+"
            starter="500+"
            pro="2000+"
            enterprise="2000+"
          />
          <ComparisonRow
            feature="Stockage cloud"
            free="Local"
            starter="5 projets"
            pro="Illimité"
            enterprise="Illimité"
          />
          <ComparisonRow
            feature="IA Synthèse vocale"
            free="—"
            starter="—"
            pro="✓"
            enterprise="✓"
          />
          <ComparisonRow
            feature="Collaboration"
            free="—"
            starter="—"
            pro="3 membres"
            enterprise="Illimité"
          />
          <ComparisonRow
            feature="Support"
            free="Forum"
            starter="Email 48h"
            pro="Priorité 24h"
            enterprise="Premium 4h"
          />
          <ComparisonRow
            feature="API"
            free="—"
            starter="—"
            pro="—"
            enterprise="✓"
          />
        </tbody>
      </table>
    </div>
  );
}

interface ComparisonRowProps {
  feature: string;
  free: string;
  starter: string;
  pro: string;
  enterprise: string;
}

function ComparisonRow({ feature, free, starter, pro, enterprise }: ComparisonRowProps) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 font-medium">{feature}</td>
      <td className="py-3 px-4 text-center">{free}</td>
      <td className="py-3 px-4 text-center">{starter}</td>
      <td className="py-3 px-4 text-center">{pro}</td>
      <td className="py-3 px-4 text-center">{enterprise}</td>
    </tr>
  );
}
