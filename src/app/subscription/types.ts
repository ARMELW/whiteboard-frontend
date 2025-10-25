import type { PlanId } from './config/plans';

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanId;
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
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
