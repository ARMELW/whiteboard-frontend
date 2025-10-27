# Pricing Page - Debug Guide

## Problem Fixed

The pricing page was always showing fake/local data instead of real API data, with no indication to the user about the data source.

## Solution

Added visual indicators and debugging capabilities to clearly show whether the pricing data comes from the API or from local fallback data.

## Features Added

### 1. Visual Indicators

#### When API Data Loads Successfully
A green banner appears at the top showing:
```
✓ Prix à jour chargés depuis l'API
```

#### When Fallback Data is Used
A yellow warning banner appears showing:
```
⚠️ Mode hors ligne: Impossible de charger les tarifs depuis l'API.
Les prix affichés sont indicatifs et peuvent ne pas être à jour.
Erreur: [error message if available]
```

### 2. Console Debugging

The application now logs detailed information in the browser console:

#### From `PricingPage.tsx`:
```javascript
[PricingPage] Data source: {
  isUsingApiData: true/false,
  isUsingFallbackData: true/false,
  apiPlansCount: number,
  error: "error message" or undefined,
  displayPlansCount: number
}
```

#### From `usePlans.ts`:
```javascript
[usePlans] Fetching plans...
[usePlans] Successfully fetched plans: 4
// OR
[usePlans] Error fetching plans: [error details]
```

#### From `PlansService`:
```javascript
[PlansService] Fetching plans from: http://localhost:3000/api/v1/plans
[PlansService] API Response: {
  success: true,
  plansCount: 4,
  plans: [...]
}
// OR
[PlansService] API returned empty plans array
[PlansService] Failed to fetch plans: [error]
```

## How to Test

### Scenario 1: API is Available and Returns Data
1. Ensure backend API is running at the configured URL
2. Navigate to `/pricing`
3. **Expected Result**: 
   - Green success banner appears
   - Console shows `isUsingApiData: true`
   - Plans displayed are from API

### Scenario 2: API is Unavailable
1. Stop backend API or configure wrong API URL
2. Navigate to `/pricing`
3. **Expected Result**:
   - Yellow warning banner appears with error details
   - Console shows `isUsingApiData: false` and `isUsingFallbackData: true`
   - Plans displayed are from local PLANS constant
   - Retry attempts logged in console (2 retries with exponential backoff)

### Scenario 3: API Returns Empty Array
1. Configure API to return empty plans array
2. Navigate to `/pricing`
3. **Expected Result**:
   - Yellow warning banner appears
   - Console shows `apiPlansCount: 0`
   - Plans displayed are from local PLANS constant

## Technical Changes

### `src/pages/pricing/PricingPage.tsx`
- Added `isUsingApiData` flag: checks if API data is available and valid
- Added `isUsingFallbackData` flag: checks if using local fallback data
- Changed condition from `apiPlans?.length` to explicit `isUsingApiData` check
- Added warning banner component for fallback data
- Added success banner component for API data
- Added console logging for debugging

### `src/app/subscription/services/plansService.ts`
- Added comprehensive logging for API requests
- Added validation for API response structure
- Added error handling with descriptive messages
- Added warning for empty API responses

### `src/app/subscription/hooks/usePlans.ts`
- Added retry logic (2 retries with exponential backoff)
- Added detailed logging in query function
- Improved error propagation

## API Endpoint

The pricing page fetches data from:
```
GET /api/v1/plans
```

Expected response format:
```json
{
  "success": true,
  "data": [
    {
      "id": "plan-id",
      "name": "Plan Name",
      "slug": "free|starter|pro|enterprise",
      "description": "Plan description",
      "pricing": {
        "monthly": 0,
        "yearly": 0
      },
      "features": { ... },
      "isActive": true,
      "isPublic": true,
      "sortOrder": 1
    }
  ]
}
```

## Troubleshooting

### "Always showing fallback data"
1. Check browser console for error messages
2. Verify API URL in environment variables (`VITE_API_URL`)
3. Check if backend API is running
4. Verify `/v1/plans` endpoint returns data
5. Check network tab in DevTools for failed requests

### "No visual indicator appears"
1. Check if page is in loading state (Loader2 spinner shows)
2. Verify React Query cache isn't stale (refresh page)
3. Check console logs to see data source detection

### "API data not updating"
1. Clear browser cache and React Query cache
2. Check `staleTime` setting in `usePlans.ts` (default: 5 minutes)
3. Force refresh by disabling cache in DevTools
