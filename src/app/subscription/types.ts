import type { PlanId } from './config/plans';

export interface Subscription {
  id: string;
  plan: string;
  referenceId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'paused' | 'trialing' | 'unpaid';
  periodStart?: Date;
  periodEnd?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  seats?: number;
  groupId?: string;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
  planId: PlanId;
  priceId: string;
}

export interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
  planName: string;
}

export interface SubscriptionResponse {
  success: boolean;
  subscription?: Subscription;
  message?: string;
  error?: string;
}
