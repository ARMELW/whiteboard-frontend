import { httpClient } from '@/services/api/httpClient';
import { API_ENDPOINTS } from '@/config/api';
import type { PlansApiResponse, ApiPlan } from '../plans-api-types';

/**
 * Service for fetching plans from the /v1/plans API endpoint
 */
export class PlansService {
  /**
   * Fetch all active and public plans from the API
   */
  async getPlans(): Promise<ApiPlan[]> {
    try {
      console.log('[PlansService] Fetching plans from:', API_ENDPOINTS.plans.list);

      const response = await httpClient.get<PlansApiResponse>(
        API_ENDPOINTS.plans.list
      );

      console.log('[PlansService] API Response:', {
        success: response.data.success,
        plansCount: response.data.data?.length ?? 0,
        plans: response.data.data,
      });

      if (!response.data.success) {
        throw new Error('API returned success: false');
      }

      if (!response.data.data || response.data.data.length === 0) {
        console.warn('[PlansService] API returned empty plans array');
        return [];
      }

      const plans = response.data.data;

      for (const plan of plans) {
        plan.stripePriceIds = plan.stripePriceIds ?? {};
        const monthly = (plan as any).stripePriceIdMonthly ?? null;
        const yearly = (plan as any).stripePriceIdYearly ?? null;

        plan.stripePriceIds.monthly = monthly;
        plan.stripePriceIds.yearly = yearly;
      }

      return plans;
    } catch (error) {
      console.error('[PlansService] Failed to fetch plans:', error);
      throw error;
    }
  }
}

export const plansService = new PlansService();
