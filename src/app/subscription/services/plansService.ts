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
    const response = await httpClient.get<PlansApiResponse>(
      API_ENDPOINTS.plans.list
    );
    return response.data.data;
  }
}

export const plansService = new PlansService();
