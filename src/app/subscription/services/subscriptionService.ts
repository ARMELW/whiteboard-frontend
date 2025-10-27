import { authClient } from '@/lib/auth-client';

export interface CreateCheckoutRequest {
  planId: string;
  billingPeriod: 'monthly' | 'yearly';
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    url: string;
    planId: string;
    priceId: string;
  };
}

export interface SubscriptionActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class SubscriptionService {
  async createCheckoutSession(
    data: CreateCheckoutRequest
  ): Promise<CheckoutSessionResponse['data']> {
    const result = await authClient.subscription.upgrade({
      plan: data.planId,
      annual: data.billingPeriod === 'yearly',
      successUrl: data.successUrl || window.location.origin + '/?checkout=success',
      cancelUrl: data.cancelUrl || window.location.origin + '/pricing?checkout=cancel',
    });
    
    return {
      sessionId: result.id || '',
      url: result.url || '',
      planId: data.planId,
      priceId: result.id || '',
    };
  }

  async cancelSubscription(subscriptionId?: string): Promise<SubscriptionActionResponse> {
    const result = await authClient.subscription.cancel({
      returnUrl: window.location.origin + '/',
      subscriptionId,
    });
    
    return {
      success: true,
      message: 'Abonnement annulé avec succès',
    };
  }

  async upgradeSubscription(newPlanId: string, annual?: boolean): Promise<SubscriptionActionResponse> {
    const result = await authClient.subscription.upgrade({
      plan: newPlanId,
      annual,
      successUrl: window.location.origin + '/?upgrade=success',
      cancelUrl: window.location.origin + '/?upgrade=cancel',
    });
    
    if (result?.url) {
      window.location.href = result.url;
    }
    
    return {
      success: true,
      message: 'Abonnement mis à niveau avec succès',
    };
  }

  async restoreSubscription(subscriptionId?: string): Promise<SubscriptionActionResponse> {
    await authClient.subscription.restore({
      subscriptionId,
    });
    
    return {
      success: true,
      message: 'Abonnement restauré avec succès',
    };
  }

  async openBillingPortal(): Promise<{ url: string }> {
    const result = await authClient.subscription.billingPortal({
      returnUrl: window.location.origin + '/',
    });
    
    return result;
  }
}

export const subscriptionService = new SubscriptionService();
