import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { pricingService } from '../services/pricingService';
import type { PricingPlan, ListBillingHistoryResponse } from '../pricing-types';

export const PRICING_QUERY_KEYS = {
  all: ['pricing'] as const,
  plans: () => [...PRICING_QUERY_KEYS.all, 'plans'] as const,
  plan: (id: string) => [...PRICING_QUERY_KEYS.all, 'plan', id] as const,
  billingHistory: (page: number, limit: number) =>
    [...PRICING_QUERY_KEYS.all, 'billing-history', page, limit] as const,
};

export function usePricingPlans(): UseQueryResult<PricingPlan[], Error> {
  return useQuery({
    queryKey: PRICING_QUERY_KEYS.plans(),
    queryFn: () => pricingService.getAllPlans(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePricingPlan(
  planId: string
): UseQueryResult<PricingPlan, Error> {
  return useQuery({
    queryKey: PRICING_QUERY_KEYS.plan(planId),
    queryFn: () => pricingService.getPlanById(planId),
    staleTime: 5 * 60 * 1000,
    enabled: !!planId,
  });
}

export function useBillingHistory(
  page: number = 1,
  limit: number = 20
): UseQueryResult<ListBillingHistoryResponse, Error> {
  return useQuery({
    queryKey: PRICING_QUERY_KEYS.billingHistory(page, limit),
    queryFn: () => pricingService.getBillingHistory(page, limit),
    staleTime: 60 * 1000,
  });
}
