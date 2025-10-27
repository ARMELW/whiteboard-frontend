# Subscription Plan Fix - Quick Reference

## Issue
```
POST http://localhost:3000/api/auth/subscription/upgrade
{"code":"SUBSCRIPTION_PLAN_NOT_FOUND","message":"Subscription plan not found"}
```

## Solution
Added support for passing Stripe price IDs to Better Auth Stripe plugin.

## What Changed

### Frontend Changes
1. **Type System** - Added `stripePriceIds` field to plan types
2. **Utilities** - Created `getStripePriceId()` helper function
3. **Service Layer** - Accept and pass Stripe price IDs
4. **UI** - Extract and use price IDs when creating checkouts

### Backend Requirements
Return plans with Stripe price IDs:

```json
{
  "id": "starter",
  "name": "Starter",
  "stripePriceIds": {
    "monthly": "price_1234567890",
    "yearly": "price_0987654321"
  }
}
```

## Quick Test

1. Check API response includes price IDs:
```bash
curl http://localhost:3000/api/v1/plans | jq '.[0].stripePriceIds'
```

2. Open browser console and navigate to `/pricing`
3. Select a plan and check console output:
```
[PricingPage] Creating checkout: {
  planId: "starter",
  stripePriceId: "price_1234567890"
}
```

## Files Modified
- `src/app/subscription/plans-api-types.ts`
- `src/app/subscription/utils/getStripePriceId.ts` ⭐ NEW
- `src/app/subscription/services/subscriptionService.ts`
- `src/app/subscription/hooks/useSubscriptionActions.ts`
- `src/pages/pricing/PricingPage.tsx`

## Full Documentation
See [STRIPE_PRICE_ID_FIX.md](./STRIPE_PRICE_ID_FIX.md) for complete details.
