# Plans API Integration

## Overview
This implementation integrates the `/v1/plans` API endpoint to fetch and display plans dynamically instead of using static data.

## API Endpoint
**GET** `/v1/plans`

Returns all active and public plans with their features and pricing.

## Files Modified/Created

### New Files
1. **src/app/subscription/plans-api-types.ts**
   - Type definitions for the API response
   - Includes `ApiPlan`, `PlanFeatures`, `PlanPricing`, etc.

2. **src/app/subscription/services/plansService.ts**
   - Service to fetch plans from the API
   - Uses the httpClient for API calls

3. **src/app/subscription/hooks/usePlans.ts**
   - React Query hook for fetching plans
   - Implements caching and automatic refetching

4. **src/app/subscription/utils/planConverter.ts**
   - Utility to convert API plan format to local Plan format
   - Ensures backward compatibility with existing components

### Modified Files
1. **src/config/api.ts**
   - Added `plans.list` endpoint configuration

2. **src/pages/pricing/PricingPage.tsx**
   - Updated to use `usePlans()` hook instead of `usePricingPlans()`
   - Converts API plans to local format using `convertApiPlanToLocalPlan()`

3. **src/app/subscription/hooks/index.ts**
   - Exports the new `usePlans` hook

4. **src/app/subscription/index.ts**
   - Exports the new types from `plans-api-types`

## Usage

```typescript
import { usePlans } from '@/app/subscription/hooks';
import { convertApiPlanToLocalPlan } from '@/app/subscription/utils/planConverter';

function MyComponent() {
  const { data: apiPlans, isLoading, error } = usePlans();
  
  // Convert API plans to local format
  const plans = apiPlans?.map(convertApiPlanToLocalPlan) || [];
  
  // Use the plans...
}
```

## Features

- **Dynamic Plan Fetching**: Plans are fetched from the API instead of hardcoded
- **Automatic Conversion**: API format is automatically converted to the existing local format
- **Backward Compatibility**: All existing components continue to work without changes
- **Fallback Support**: Falls back to static PLANS if API is unavailable
- **Caching**: Plans are cached for 5 minutes to reduce API calls
- **Type Safety**: Full TypeScript support with detailed type definitions

## API Response Format

The API returns plans with the following structure:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Pro",
      "slug": "pro",
      "description": "Professional plan",
      "pricing": {
        "monthly": 900,    // in cents
        "yearly": 9000     // in cents
      },
      "features": {
        "maxScenes": -1,   // -1 = unlimited
        "maxDuration": -1,
        "exportQuality": "4k",
        "hasWatermark": false,
        // ... more features
      },
      "isActive": true,
      "isPublic": true,
      "sortOrder": 2
    }
  ]
}
```

## Notes

- Pricing is in cents in the API but converted to euros for display
- `-1` represents unlimited in feature limits
- The `slug` field is used as the plan ID for backward compatibility
- Plans are sorted by `sortOrder` field
