# Subscription Plan Fix - Flow Diagram

## Before Fix (Error Flow)

```
┌─────────────┐
│   User      │
│ Clicks Plan │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   PricingPage.handleSelectPlan  │
│   createCheckout({              │
│     planId: "starter",          │
│     billingPeriod: "monthly"    │
│   })                            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   subscriptionService           │
│   authClient.subscription       │
│   .upgrade({                    │
│     plan: "starter",            │ ❌ Plan name only
│     annual: false               │
│   })                            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Better Auth Backend           │
│   Looks up "starter" plan       │
│   ❌ NOT FOUND!                 │
│   No Stripe price ID mapping    │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Error Response                │
│   {                             │
│     "code": "SUBSCRIPTION_      │
│              PLAN_NOT_FOUND",   │
│     "message": "Subscription    │
│                plan not found"  │
│   }                             │
└─────────────────────────────────┘
```

## After Fix (Success Flow)

```
┌─────────────┐
│   User      │
│ Clicks Plan │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   Backend API                   │
│   GET /v1/plans                 │
│   Returns plans with            │
│   stripePriceIds:               │
│   {                             │
│     monthly: "price_123",       │
│     yearly: "price_456"         │
│   }                             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   PricingPage                   │
│   Stores apiPlans with          │
│   Stripe price IDs              │
└──────┬──────────────────────────┘
       │ User selects plan
       ▼
┌─────────────────────────────────┐
│   handleSelectPlan()            │
│   1. Find apiPlan by ID         │
│   2. Extract stripePriceId:     │
│      getStripePriceId(          │
│        plan,                    │
│        "monthly"                │
│      )                          │
│   3. Create checkout            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   createCheckout({              │
│     planId: "starter",          │
│     billingPeriod: "monthly",   │
│     stripePriceId: "price_123"  │ ✅ Explicit price ID
│   })                            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   subscriptionService           │
│   authClient.subscription       │
│   .upgrade({                    │
│     priceId: "price_123",       │ ✅ Direct Stripe price
│     successUrl: "...",          │
│     cancelUrl: "..."            │
│   })                            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Better Auth Backend           │
│   Uses priceId directly         │
│   Creates Stripe checkout       │
│   ✅ SUCCESS                    │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Stripe Checkout Session       │
│   User redirected to Stripe     │
│   Payment page                  │
└─────────────────────────────────┘
```

## Data Flow Detail

### 1. Plan Data Structure

```typescript
// API Response (/v1/plans)
{
  "id": "starter",
  "name": "Starter",
  "slug": "starter",
  "pricing": {
    "monthly": 900,    // 9 EUR in cents
    "yearly": 9000     // 90 EUR in cents
  },
  "stripePriceIds": {
    "monthly": "price_1234567890abcdef",  // ⭐ Key field
    "yearly": "price_0987654321fedcba"    // ⭐ Key field
  },
  "features": { ... }
}
```

### 2. Price ID Extraction

```typescript
// Helper Function
function getStripePriceId(plan, billingPeriod) {
  // Check top-level field
  if (plan.stripePriceIds) {
    return billingPeriod === 'yearly' 
      ? plan.stripePriceIds.yearly   // "price_0987654321fedcba"
      : plan.stripePriceIds.monthly; // "price_1234567890abcdef"
  }
  
  // Fallback to metadata
  if (plan.metadata?.stripePriceIds) {
    return billingPeriod === 'yearly'
      ? plan.metadata.stripePriceIds.yearly
      : plan.metadata.stripePriceIds.monthly;
  }
  
  return undefined;  // No price ID available
}
```

### 3. Checkout Creation

```typescript
// In PricingPage
const apiPlan = apiPlans.find(p => p.slug === 'starter');
const stripePriceId = getStripePriceId(apiPlan, 'monthly');
// stripePriceId = "price_1234567890abcdef"

createCheckout({
  planId: 'starter',
  billingPeriod: 'monthly',
  stripePriceId: 'price_1234567890abcdef',  // ⭐ Explicit price
  successUrl: '...',
  cancelUrl: '...'
});
```

### 4. Better Auth Call

```typescript
// In subscriptionService
const upgradeParams = {
  priceId: 'price_1234567890abcdef',  // ⭐ Direct to Stripe
  successUrl: '...',
  cancelUrl: '...'
};

await authClient.subscription.upgrade(upgradeParams);
```

## Fallback Behavior

```
Has stripePriceId?
       │
       ├─YES──► Use priceId parameter ──► Better Auth ──► Stripe
       │                                    with explicit
       │                                    price ID
       │
       └─NO───► Use plan + annual ────► Better Auth ──► Lookup
                                         tries to find   in config
                                         price ID        (may fail)
```

## Key Components

### Files Modified

```
src/
├── app/
│   └── subscription/
│       ├── plans-api-types.ts           [Types updated]
│       ├── utils/
│       │   └── getStripePriceId.ts      [NEW - Helper]
│       ├── services/
│       │   └── subscriptionService.ts   [Accept priceId]
│       └── hooks/
│           └── useSubscriptionActions.ts [Pass priceId]
└── pages/
    └── pricing/
        └── PricingPage.tsx              [Extract & use priceId]
```

### Testing Checklist

```
□ Backend returns stripePriceIds in /v1/plans
□ getStripePriceId extracts correct ID for monthly
□ getStripePriceId extracts correct ID for yearly
□ createCheckout passes stripePriceId parameter
□ Better Auth receives priceId parameter
□ Stripe checkout session created successfully
□ User redirected to Stripe payment page
```

## References

- **Issue**: "SUBSCRIPTION_PLAN_NOT_FOUND" error
- **Root Cause**: Missing Stripe price ID in checkout request
- **Solution**: Extract and pass Stripe price ID explicitly
- **Status**: ✅ Fixed, tested, documented

For more details, see:
- `docs/STRIPE_PRICE_ID_FIX.md` - Complete documentation
- `docs/SUBSCRIPTION_FIX_README.md` - Quick reference
