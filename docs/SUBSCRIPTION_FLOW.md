# Subscription Flow Integration

## Overview

This document describes the subscription flow integration for the Whiteboard Frontend application, based on the API specifications from `FRONTEND_API_GUIDE.md`.

## Architecture

### Services Layer

#### PricingService (`src/app/subscription/services/pricingService.ts`)
Handles API calls for pricing and billing:
- `getAllPlans()` - Fetch all subscription plans
- `getPlanById(planId)` - Get specific plan details
- `getBillingHistory(page, limit)` - Retrieve invoice history

#### SubscriptionService (`src/app/subscription/services/subscriptionService.ts`)
Manages subscription actions:
- `createCheckoutSession(data)` - Initialize payment flow
- `cancelSubscription()` - Cancel user's subscription
- `upgradeSubscription(planId)` - Upgrade to higher tier
- `downgradeSubscription(planId)` - Downgrade to lower tier

### React Query Hooks

#### Query Hooks (`src/app/subscription/hooks/usePricing.ts`)
- `usePricingPlans()` - Fetch and cache all plans
- `usePricingPlan(planId)` - Get specific plan with caching
- `useBillingHistory(page, limit)` - Paginated invoice history

#### Mutation Hooks (`src/app/subscription/hooks/useSubscriptionActions.ts`)
- `useCreateCheckout()` - Create checkout session with auto-redirect
- `useCancelSubscription()` - Cancel with confirmation
- `useUpgradeSubscription()` - Upgrade plan with toast feedback
- `useDowngradeSubscription()` - Downgrade with period-end scheduling

### Types & Interfaces

#### Pricing Types (`src/app/subscription/pricing-types.ts`)
```typescript
interface PricingPlan {
  id: string;
  title: string;
  description: string;
  prices: {
    monthly: number;
    yearly: number;
  };
  features: Record<string, any>;
}

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  planId: string;
  invoiceUrl?: string;
}
```

## Pages & Components

### PricingPage (`src/pages/pricing/PricingPage.tsx`)

**Features:**
- Displays all subscription plans in grid layout
- Monthly/Yearly billing period toggle
- Real-time API data with fallback to local plans
- Authentication-aware checkout flow
- Current plan indication
- Loading and error states

**User Flow:**
1. User selects billing period (monthly/yearly)
2. Views plans with pricing adjusted to selected period
3. Clicks "Choose Plan" button
4. If not authenticated → redirects to login
5. If authenticated → creates checkout session and redirects to payment

### BillingHistoryPage (`src/pages/pricing/BillingHistoryPage.tsx`)

**Features:**
- Displays invoice history in table format
- Pagination support
- Status badges (paid/pending/failed)
- PDF download links
- Empty state handling
- Date formatting (French locale)

**Usage:**
```tsx
import { BillingHistoryPage } from '@/pages/pricing';

// In your router:
<Route path="/billing-history" element={<BillingHistoryPage />} />
```

### SubscriptionManagementPage (`src/pages/dashboard/SubscriptionManagementPage.tsx`)

**Features:**
- Current plan overview with features and limits
- Cancel subscription with confirmation dialog
- Upgrade/downgrade options for all other plans
- Visual distinction between upgrades and downgrades
- Loading states during mutations
- Plan comparison cards

**User Actions:**
1. **Cancel Subscription:** Shows alert dialog, schedules cancellation for period end
2. **Upgrade Plan:** Immediately applies with pro-rated billing
3. **Downgrade Plan:** Schedules for next billing cycle

## API Integration

### Endpoints Used

From `src/config/api.ts`:

```typescript
pricing: {
  plans: `${prefix}/v1/pricing/plans`,
  planDetail: (planId: string) => `${prefix}/v1/pricing/plans/${planId}`,
  billingHistory: `${prefix}/v1/pricing/billing-history`,
}

subscription: {
  checkout: `${prefix}/subscription/checkout`,
  cancel: `${prefix}/subscription/cancel`,
  upgrade: `${prefix}/subscription/upgrade`,
  downgrade: `${prefix}/subscription/downgrade`,
}
```

### Request/Response Examples

#### Create Checkout Session
```typescript
// Request
POST /subscription/checkout
{
  "planId": "pro",
  "billingPeriod": "yearly",
  "successUrl": "https://app.com/dashboard?checkout=success",
  "cancelUrl": "https://app.com/pricing?checkout=cancel"
}

// Response
{
  "success": true,
  "data": {
    "sessionId": "cs_xxx",
    "url": "https://checkout.stripe.com/...",
    "planId": "pro",
    "priceId": "price_xxx"
  }
}
```

#### Get Billing History
```typescript
// Request
GET /v1/pricing/billing-history?page=1&limit=20

// Response
{
  "success": true,
  "data": [
    {
      "id": "inv_123",
      "date": "2025-01-15T10:00:00.000Z",
      "amount": 29,
      "currency": "USD",
      "status": "paid",
      "planId": "pro",
      "invoiceUrl": "https://..."
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

## Usage Examples

### Displaying Pricing Plans

```tsx
import { usePricingPlans } from '@/app/subscription/hooks';

function MyComponent() {
  const { data: plans, isLoading, error } = usePricingPlans();
  
  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;
  
  return (
    <div>
      {plans?.map(plan => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
```

### Creating a Checkout

```tsx
import { useCreateCheckout } from '@/app/subscription/hooks';

function UpgradeButton({ planId }: { planId: string }) {
  const { mutate: checkout, isPending } = useCreateCheckout();
  
  const handleUpgrade = () => {
    checkout({
      planId,
      billingPeriod: 'monthly',
      successUrl: window.location.origin + '/dashboard',
      cancelUrl: window.location.origin + '/pricing',
    });
  };
  
  return (
    <Button onClick={handleUpgrade} disabled={isPending}>
      {isPending ? 'Processing...' : 'Upgrade Now'}
    </Button>
  );
}
```

### Managing Subscription

```tsx
import { useCancelSubscription } from '@/app/subscription/hooks';

function CancelButton() {
  const { mutate: cancel, isPending } = useCancelSubscription();
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Cancel Subscription</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your subscription will be cancelled at the end of the current period.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, keep it</AlertDialogCancel>
          <AlertDialogAction onClick={() => cancel()}>
            Yes, cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## Error Handling

All hooks include error handling with user feedback:

```typescript
// Automatic toast notifications
onError: (error) => {
  toast.error('Error message');
  console.error('Detailed error:', error);
}

// Success notifications
onSuccess: (data) => {
  toast.success(data.message || 'Success!');
}
```

## Caching Strategy

- **Pricing Plans:** 5 minutes stale time, no refetch on window focus
- **Billing History:** 1 minute stale time
- **Mutations:** Auto-invalidate related queries after success

## Testing Checklist

### Manual Testing
- [ ] Pricing page loads with all plans
- [ ] Monthly/Yearly toggle updates prices
- [ ] Checkout creates session and redirects
- [ ] Unauthenticated users redirect to login
- [ ] Current plan is highlighted
- [ ] Billing history displays correctly
- [ ] Pagination works
- [ ] Invoice PDFs download
- [ ] Subscription management shows current plan
- [ ] Upgrade/downgrade mutations work
- [ ] Cancel subscription shows confirmation
- [ ] Loading states display correctly
- [ ] Error states show appropriate messages

### Integration Testing
- [ ] API endpoints return expected data
- [ ] Authentication token is included in requests
- [ ] Errors are handled gracefully
- [ ] Fallback to local plans works when API fails

## Future Enhancements

1. **Webhook Integration**
   - Handle subscription.updated events
   - Handle payment.succeeded events
   - Sync subscription status in real-time

2. **Usage Tracking**
   - Display current usage vs. limits
   - Warning notifications when approaching limits
   - Visual progress bars

3. **Promo Codes**
   - Apply discount codes at checkout
   - Display active promotions

4. **Team Management** (Enterprise)
   - Invite team members
   - Manage seats
   - Role-based permissions

## Support

For backend API documentation, see `FRONTEND_API_GUIDE.md`.

For questions or issues, contact the development team.
