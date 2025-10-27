import type { ApiPlan } from '../plans-api-types';

/**
 * Get the Stripe price ID for a plan based on the billing period
 * 
 * @param plan - The API plan object
 * @param billingPeriod - 'monthly' or 'yearly'
 * @returns The Stripe price ID if found, undefined otherwise
 */
export function getStripePriceId(
  plan: ApiPlan | undefined,
  billingPeriod: 'monthly' | 'yearly'
): string | undefined {
  if (!plan) {
    return undefined;
  }

  // First check the top-level stripePriceIds field
  if (plan.stripePriceIds) {
    return billingPeriod === 'yearly' 
      ? plan.stripePriceIds.yearly 
      : plan.stripePriceIds.monthly;
  }

  // Fallback to metadata
  if (plan.metadata?.stripePriceIds) {
    return billingPeriod === 'yearly'
      ? plan.metadata.stripePriceIds.yearly
      : plan.metadata.stripePriceIds.monthly;
  }

  return undefined;
}

/**
 * Get the Stripe price ID from a plan ID and billing period
 * This is a convenience function for use with the plans service
 * 
 * @param planId - The plan ID (slug)
 * @param billingPeriod - 'monthly' or 'yearly'
 * @param plans - Array of API plans
 * @returns The Stripe price ID if found, undefined otherwise
 */
export function getStripePriceIdByPlanId(
  planId: string,
  billingPeriod: 'monthly' | 'yearly',
  plans: ApiPlan[]
): string | undefined {
  const plan = plans.find(p => p.slug === planId || p.id === planId);
  return getStripePriceId(plan, billingPeriod);
}
