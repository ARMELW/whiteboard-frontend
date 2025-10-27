import { httpClient } from '@/services/api/httpClient';
import { API_ENDPOINTS } from '@/config/api';

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
    const response = await httpClient.post<CheckoutSessionResponse>(
      API_ENDPOINTS.subscription.checkout,
      data
    );
    return response.data.data;
  }

  async cancelSubscription(): Promise<SubscriptionActionResponse> {
    const response = await httpClient.post<SubscriptionActionResponse>(
      API_ENDPOINTS.subscription.cancel
    );
    return response.data;
  }

  async upgradeSubscription(newPlanId: string): Promise<SubscriptionActionResponse> {
    const response = await httpClient.post<SubscriptionActionResponse>(
      API_ENDPOINTS.subscription.upgrade,
      { planId: newPlanId }
    );
    return response.data;
  }

  async downgradeSubscription(newPlanId: string): Promise<SubscriptionActionResponse> {
    const response = await httpClient.post<SubscriptionActionResponse>(
      API_ENDPOINTS.subscription.downgrade,
      { planId: newPlanId }
    );
    return response.data;
  }
}

export const subscriptionService = new SubscriptionService();
