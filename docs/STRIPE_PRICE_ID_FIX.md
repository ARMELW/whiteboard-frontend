# Stripe Price ID Integration Fix

## Problem Description

The application was encountering the error `SUBSCRIPTION_PLAN_NOT_FOUND` when attempting to create a subscription checkout session. This occurred because the Better Auth Stripe plugin requires Stripe price IDs to be properly configured and passed when creating checkout sessions.

### Error Message
```json
{
  "code": "SUBSCRIPTION_PLAN_NOT_FOUND",
  "message": "Subscription plan not found"
}
```

### API Call Example
```typescript
POST http://localhost:3000/api/auth/subscription/upgrade

{
  "plan": "starter",
  "annual": false,
  "successUrl": "http://localhost:5173/?checkout=success",
  "cancelUrl": "http://localhost:5173/pricing?checkout=cancel"
}
```

## Root Cause

The Better Auth Stripe plugin needs to map plan names to Stripe price IDs. There are two ways to handle this:

1. **Backend Configuration**: The backend must configure plans with Stripe price IDs
2. **Direct Price ID Passing**: The frontend can pass the Stripe price ID directly

The error occurred because neither approach was properly implemented.

## Solution

We implemented support for passing Stripe price IDs directly from the frontend. This provides more flexibility and allows the frontend to explicitly specify which Stripe price to use based on the billing period (monthly/yearly).

### Changes Overview

1. **Type Definitions**: Added `stripePriceIds` field to plan types
2. **Utility Functions**: Created helpers to extract price IDs from plans
3. **Service Layer**: Updated to accept and pass Stripe price IDs
4. **UI Layer**: Modified pricing page to use price IDs

## Implementation Details

### 1. Type Definitions

#### ApiPlan Type (`src/app/subscription/plans-api-types.ts`)

```typescript
export interface ApiPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing: PlanPricing;
  features: PlanFeatures;
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
  metadata?: PlanMetadata;
  stripePriceIds?: {
    monthly?: string;
    yearly?: string;
  };
}
```

The plan can now include Stripe price IDs either:
- At the top level: `plan.stripePriceIds.monthly`
- In metadata: `plan.metadata.stripePriceIds.monthly`

### 2. Utility Functions

#### Get Stripe Price ID (`src/app/subscription/utils/getStripePriceId.ts`)

```typescript
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
```

### 3. Service Layer Updates

#### Subscription Service (`src/app/subscription/services/subscriptionService.ts`)

```typescript
export interface CreateCheckoutRequest {
  planId: string;
  billingPeriod: 'monthly' | 'yearly';
  stripePriceId?: string;  // NEW: Optional Stripe price ID
  successUrl?: string;
  cancelUrl?: string;
}

async createCheckoutSession(data: CreateCheckoutRequest) {
  const upgradeParams: any = {
    successUrl: data.successUrl || window.location.origin + '/?checkout=success',
    cancelUrl: data.cancelUrl || window.location.origin + '/pricing?checkout=cancel',
  };

  // If stripePriceId is provided, use it directly
  if (data.stripePriceId) {
    upgradeParams.priceId = data.stripePriceId;
  } else {
    // Fall back to plan name + annual flag
    upgradeParams.plan = data.planId;
    upgradeParams.annual = data.billingPeriod === 'yearly';
  }
  
  const result = await authClient.subscription.upgrade(upgradeParams);
  // ...
}
```

### 4. UI Updates

#### Pricing Page (`src/pages/pricing/PricingPage.tsx`)

```typescript
const handleSelectPlan = (planId: string) => {
  // ... authentication checks ...

  // Find the API plan to get the Stripe price ID
  const apiPlan = apiPlans?.find(p => p.slug === planId || p.id === planId);
  const stripePriceId = apiPlan ? getStripePriceId(apiPlan, selectedBilling) : undefined;

  console.log('[PricingPage] Creating checkout:', {
    planId,
    billingPeriod: selectedBilling,
    stripePriceId,
    hasApiPlan: !!apiPlan,
  });

  createCheckout({
    planId,
    billingPeriod: selectedBilling,
    stripePriceId,  // Pass the Stripe price ID
    successUrl: window.location.origin + '/?checkout=success',
    cancelUrl: window.location.origin + '/pricing?checkout=cancel',
  });
};
```

## Backend Requirements

For this solution to work, the backend API must return plans with Stripe price IDs:

### Option 1: API Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "plan_123",
      "name": "Starter",
      "slug": "starter",
      "description": "Perfect for beginners",
      "pricing": {
        "monthly": 900,
        "yearly": 9000
      },
      "stripePriceIds": {
        "monthly": "price_1234567890",
        "yearly": "price_0987654321"
      },
      "features": { ... }
    }
  ]
}
```

### Option 2: Better Auth Configuration

Alternatively, configure the Better Auth Stripe plugin on the backend:

```typescript
stripe({
  stripeClient,
  subscription: {
    enabled: true,
    plans: [
      {
        name: "starter",
        priceId: "price_1234567890",
        annualDiscountPriceId: "price_0987654321",
      },
      {
        name: "pro",
        priceId: "price_pro_monthly",
        annualDiscountPriceId: "price_pro_yearly",
      },
    ],
  },
})
```

## Testing

### 1. Check Plan Data

Verify that the API returns Stripe price IDs:

```bash
curl http://localhost:3000/api/v1/plans
```

Expected response should include `stripePriceIds` field.

### 2. Test Checkout Flow

1. Navigate to `/pricing`
2. Select a billing period (monthly/yearly)
3. Click "Choose Plan" on a paid plan
4. Check browser console for logged information
5. Verify redirect to Stripe Checkout

### 3. Console Logging

The pricing page now logs checkout creation details:

```javascript
[PricingPage] Creating checkout: {
  planId: "starter",
  billingPeriod: "monthly",
  stripePriceId: "price_1234567890",
  hasApiPlan: true
}
```

## Backward Compatibility

The implementation maintains backward compatibility:

- **With Price ID**: Uses `priceId` parameter for Better Auth
- **Without Price ID**: Falls back to `plan` + `annual` parameters

This ensures the application works whether or not Stripe price IDs are available.

## Error Handling

If Stripe price IDs are not available:

1. The system will attempt to use plan name + billing period
2. If the backend doesn't have the plan configured, it will return an error
3. The frontend displays a toast error message

## Future Improvements

1. **Validation**: Add validation to ensure price IDs exist before attempting checkout
2. **Fallback UI**: Show warning if price IDs are missing
3. **Admin Panel**: Allow configuring Stripe price IDs through UI
4. **Type Safety**: Create stricter types for Better Auth parameters

## References

- [Better Auth Stripe Plugin](https://www.better-auth.com/docs/plugins/stripe)
- [Stripe Price Objects](https://stripe.com/docs/api/prices)
- [Better Auth Subscription Flow](https://www.better-auth.com/docs/plugins/stripe#subscription)

## Related Files

- `src/app/subscription/plans-api-types.ts` - Type definitions
- `src/app/subscription/utils/getStripePriceId.ts` - Utility functions
- `src/app/subscription/services/subscriptionService.ts` - Service layer
- `src/app/subscription/hooks/useSubscriptionActions.ts` - React hooks
- `src/pages/pricing/PricingPage.tsx` - UI implementation
- `docs/STRIPE_INTEGRATION.md` - Stripe integration docs
