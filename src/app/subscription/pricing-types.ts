export interface PricingPlan {
  id: string;
  title: string;
  description: string;
  prices: {
    monthly: number;
    yearly: number;
  };
  features: Record<string, any>;
}

export interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  planId: string;
  invoiceUrl?: string;
}

export interface ListBillingHistoryResponse {
  success: boolean;
  data: BillingRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface PricingPlansResponse {
  success: boolean;
  data: PricingPlan[];
}

export interface PricingPlanResponse {
  success: boolean;
  data: PricingPlan;
}
