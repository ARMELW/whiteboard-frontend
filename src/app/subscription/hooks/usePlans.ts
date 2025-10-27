import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { plansService } from '../services/plansService';
import type { ApiPlan } from '../plans-api-types';

export const PLANS_QUERY_KEYS = {
  all: ['plans'] as const,
  list: () => [...PLANS_QUERY_KEYS.all, 'list'] as const,
};

/**
 * Hook to fetch all active and public plans from the /v1/plans API
 */
export function usePlans(): UseQueryResult<ApiPlan[], Error> {
  return useQuery({
    queryKey: PLANS_QUERY_KEYS.list(),
    queryFn: async () => {
      console.log('[usePlans] Fetching plans...');
      try {
        const plans = await plansService.getPlans();
        console.log('[usePlans] Successfully fetched plans:', plans.length);
        return plans;
      } catch (error) {
        console.error('[usePlans] Error fetching plans:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
