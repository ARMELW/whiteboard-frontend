import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { subscriptionService, type CreateCheckoutRequest } from '../services/subscriptionService';
import { toast } from 'sonner';

export function useCreateCheckout(): UseMutationResult<
  { sessionId: string; url: string; planId: string; priceId: string },
  Error,
  CreateCheckoutRequest
> {
  return useMutation({
    mutationFn: (data: CreateCheckoutRequest) =>
      subscriptionService.createCheckoutSession(data),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de la session de paiement');
      console.error('Checkout error:', error);
    },
  });
}

export function useCancelSubscription(): UseMutationResult<
  { success: boolean; message?: string },
  Error,
  void
> {
  return useMutation({
    mutationFn: () => subscriptionService.cancelSubscription(),
    onSuccess: (data) => {
      toast.success(data.message || 'Abonnement annulé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'annulation de l\'abonnement');
      console.error('Cancel subscription error:', error);
    },
  });
}

export function useUpgradeSubscription(): UseMutationResult<
  { success: boolean; message?: string },
  Error,
  string
> {
  return useMutation({
    mutationFn: (newPlanId: string) =>
      subscriptionService.upgradeSubscription(newPlanId),
    onSuccess: (data) => {
      toast.success(data.message || 'Abonnement mis à niveau avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à niveau de l\'abonnement');
      console.error('Upgrade subscription error:', error);
    },
  });
}

export function useDowngradeSubscription(): UseMutationResult<
  { success: boolean; message?: string },
  Error,
  string
> {
  return useMutation({
    mutationFn: (newPlanId: string) =>
      subscriptionService.downgradeSubscription(newPlanId),
    onSuccess: (data) => {
      toast.success(
        data.message || 'Votre abonnement sera rétrogradé à la fin de la période actuelle'
      );
    },
    onError: (error) => {
      toast.error('Erreur lors de la rétrogradation de l\'abonnement');
      console.error('Downgrade subscription error:', error);
    },
  });
}
