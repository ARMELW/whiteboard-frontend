import { httpClient } from '@/services/api/httpClient';
import { API_ENDPOINTS } from '@/config/api';
import type {
  PricingPlansResponse,
  PricingPlanResponse,
  PricingPlan,
  ListBillingHistoryResponse,
} from '../pricing-types';

export class PricingService {
  async getAllPlans(): Promise<PricingPlan[]> {
    const response = await httpClient.get<PricingPlansResponse>(
      API_ENDPOINTS.pricing.plans
    );
    return response.data.data;
  }

  async getPlanById(planId: string): Promise<PricingPlan> {
    const response = await httpClient.get<PricingPlanResponse>(
      API_ENDPOINTS.pricing.planDetail(planId)
    );
    return response.data.data;
  }

  async getBillingHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<ListBillingHistoryResponse> {
    const response = await httpClient.get<ListBillingHistoryResponse>(
      `${API_ENDPOINTS.pricing.billingHistory}?page=${page}&limit=${limit}`
    );
    return response.data;
  }
}

export const pricingService = new PricingService();
