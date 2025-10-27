import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export interface CreateCheckoutRequest {
  planId: string;
  billingPeriod: 'monthly' | 'yearly';
  stripePriceId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export function useCreateCheckout(): UseMutationResult<
  any,
  Error,
  CreateCheckoutRequest
> {
  return useMutation({
    mutationFn: async (data: CreateCheckoutRequest) => {
      const upgradeParams: any = {
        successUrl: data.successUrl || window.location.origin + '/?checkout=success',
        cancelUrl: data.cancelUrl || window.location.origin + '/pricing?checkout=cancel',
        plan: data.stripePriceId,
        annual: data.billingPeriod === 'yearly',
      };

      const result = await authClient.subscription.upgrade(upgradeParams);
      return result;
    },
    onSuccess: (data) => {
      console.log('Checkout success data:', data);
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de la session de paiement');
      console.error('Checkout error:', error);
    },
  });
}

export function useCancelSubscription(): UseMutationResult<
  any,
  Error,
  { subscriptionId?: string }
> {
  return useMutation({
    mutationFn: async (params) => {
      const result = await authClient.subscription.cancel({
        returnUrl: window.location.origin + '/',
        subscriptionId: params?.subscriptionId,
      });
      return result;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.success('Abonnement annulé avec succès');
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'annulation de l\'abonnement');
      console.error('Cancel subscription error:', error);
    },
  });
}

export function useRestoreSubscription(): UseMutationResult<
  any,
  Error,
  { subscriptionId?: string }
> {
  return useMutation({
    mutationFn: async (params) => {
      const result = await authClient.subscription.restore({
        subscriptionId: params?.subscriptionId,
      });
      return result;
    },
    onSuccess: () => {
      toast.success('Abonnement restauré avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la restauration de l\'abonnement');
      console.error('Restore subscription error:', error);
    },
  });
}

export function useUpgradeSubscription(): UseMutationResult<
  any,
  Error,
  { planId: string; annual?: boolean; stripePriceId?: string }
> {
  return useMutation({
    mutationFn: async (data) => {
      const upgradeParams: any = {
        successUrl: window.location.origin + '/?upgrade=success',
        cancelUrl: window.location.origin + '/?upgrade=cancel',
      };

      // If stripePriceId is provided, use it directly; otherwise use plan name
      if (data.stripePriceId) {
        upgradeParams.priceId = data.stripePriceId;
      } else {
        upgradeParams.plan = data.planId;
        upgradeParams.annual = data.annual;
      }

      const result = await authClient.subscription.upgrade(upgradeParams);
      return result;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.success('Abonnement mis à niveau avec succès');
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à niveau de l\'abonnement');
      console.error('Upgrade subscription error:', error);
    },
  });
}

export function useBillingPortal(): UseMutationResult<
  any,
  Error,
  void
> {
  return useMutation({
    mutationFn: async () => {
      const result = await authClient.subscription.billingPortal({
        returnUrl: window.location.origin + '/',
      });
      return result;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'accès au portail de facturation');
      console.error('Billing portal error:', error);
    },
  });
}
