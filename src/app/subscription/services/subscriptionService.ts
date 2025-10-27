import { authClient } from '@/lib/auth-client';

export interface CreateCheckoutRequest {
  planId: string;
  billingPeriod: 'monthly' | 'yearly';
  stripePriceId?: string;
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
    const upgradeParams: any = {
      successUrl: data.successUrl || window.location.origin + '/?checkout=success',
      cancelUrl: data.cancelUrl || window.location.origin + '/pricing?checkout=cancel',
    };

    // If stripePriceId is provided, use it directly; otherwise use plan name
    if (data.stripePriceId) {
      upgradeParams.priceId = data.stripePriceId;
    } else {
      upgradeParams.plan = data.planId;
      upgradeParams.annual = data.billingPeriod === 'yearly';
    }
    
    const result = await authClient.subscription.upgrade(upgradeParams);
    
    return {
      sessionId: result.id || '',
      url: result.url || '',
      planId: data.planId,
      priceId: data.stripePriceId || result.id || '',
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

  async upgradeSubscription(
    newPlanId: string, 
    annual?: boolean,
    stripePriceId?: string
  ): Promise<SubscriptionActionResponse> {
    const upgradeParams: any = {
      successUrl: window.location.origin + '/?upgrade=success',
      cancelUrl: window.location.origin + '/?upgrade=cancel',
    };

    // If stripePriceId is provided, use it directly; otherwise use plan name
    if (stripePriceId) {
      upgradeParams.priceId = stripePriceId;
    } else {
      upgradeParams.plan = newPlanId;
      upgradeParams.annual = annual;
    }
    
    const result = await authClient.subscription.upgrade(upgradeParams);
    
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
