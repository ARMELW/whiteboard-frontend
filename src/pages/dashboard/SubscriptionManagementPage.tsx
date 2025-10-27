import { useSession } from '@/app/auth';
import { PLANS } from '@/app/subscription';
import {
  useCancelSubscription,
  useUpgradeSubscription,
  useDowngradeSubscription,
} from '@/app/subscription/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SubscriptionManagementPage() {
  const { user, isLoading: sessionLoading } = useSession();
  const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription();
  const { mutate: upgradeSubscription, isPending: isUpgrading } = useUpgradeSubscription();
  const { mutate: downgradeSubscription, isPending: isDowngrading } = useDowngradeSubscription();

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-600">
          Vous devez être connecté pour gérer votre abonnement.
        </p>
      </div>
    );
  }

  const currentPlan = PLANS[user.planId];
  const planOrder = ['free', 'starter', 'pro', 'enterprise'];
  const currentPlanIndex = planOrder.indexOf(user.planId);

  const handleUpgrade = (newPlanId: string) => {
    upgradeSubscription(newPlanId);
  };

  const handleDowngrade = (newPlanId: string) => {
    downgradeSubscription(newPlanId);
  };

  const handleCancel = () => {
    cancelSubscription();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion de l'abonnement</h1>

      {/* Current Plan Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Plan actuel: {currentPlan.name}</CardTitle>
          <CardDescription>{currentPlan.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold">
              {currentPlan.price === 0 ? 'Gratuit' : `${currentPlan.price}€`}
            </span>
            {currentPlan.price > 0 && (
              <span className="text-gray-500 ml-2">/mois</span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Fonctionnalités incluses:</h3>
              <ul className="space-y-2">
                {currentPlan.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Limites actuelles:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  Scènes:{' '}
                  {currentPlan.limits.scenes === -1
                    ? 'Illimité'
                    : `${currentPlan.limits.scenes} par projet`}
                </li>
                <li>
                  Durée vidéo:{' '}
                  {currentPlan.limits.duration === -1
                    ? 'Illimitée'
                    : `${Math.floor(currentPlan.limits.duration / 60)} min`}
                </li>
                <li>Qualité d'export: {currentPlan.limits.quality}</li>
                <li>
                  Stockage:{' '}
                  {currentPlan.limits.storage === -1
                    ? 'Illimité'
                    : currentPlan.limits.storage === 0
                    ? 'Local uniquement'
                    : `${currentPlan.limits.storage} projets cloud`}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            {user.planId !== 'free' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isCanceling}>
                    {isCanceling ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Annulation...
                      </>
                    ) : (
                      'Annuler l\'abonnement'
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Votre abonnement sera annulé à la fin de la période de facturation
                      actuelle. Vous conserverez l'accès aux fonctionnalités premium
                      jusqu'à cette date.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel}>
                      Confirmer l'annulation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Link to="/pricing">
              <Button variant="outline">Voir tous les plans</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade/Downgrade Options */}
      <h2 className="text-2xl font-bold mb-4">Changer de plan</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {planOrder.map((planId, index) => {
          if (planId === user.planId) return null;
          
          const plan = PLANS[planId as keyof typeof PLANS];
          const isUpgrade = index > currentPlanIndex;
          const isProcessing = isUpgrading || isDowngrading;

          return (
            <Card key={planId}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-bold">
                    {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 ml-2">/mois</span>
                  )}
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() =>
                    isUpgrade ? handleUpgrade(planId) : handleDowngrade(planId)
                  }
                  variant={isUpgrade ? 'default' : 'outline'}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Traitement...
                    </>
                  ) : isUpgrade ? (
                    'Passer à ce plan'
                  ) : (
                    'Rétrograder'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
