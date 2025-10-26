import { z } from 'zod';

export const subscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  planId: z.enum(['free', 'starter', 'pro', 'enterprise']),
  status: z.enum(['active', 'cancelled', 'expired', 'trialing']),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
