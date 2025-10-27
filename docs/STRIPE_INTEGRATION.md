# Better Auth Stripe Integration

This document explains how the frontend integrates with Better Auth's Stripe plugin for subscription management.

## Overview

The application uses the official [Better Auth Stripe plugin](https://www.better-auth.com/docs/plugins/stripe) to handle subscription management. This provides a streamlined way to integrate Stripe subscriptions with user authentication.

## Frontend Implementation

### Installation

```bash
npm install @better-auth/stripe
```

### Auth Client Configuration

The auth client is configured with the Stripe plugin in `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});
```

### Available Client Methods

The Stripe client plugin adds the following methods to `authClient.subscription`:

#### 1. Upgrade Subscription
Creates a Stripe Checkout session for upgrading/subscribing to a plan:

```typescript
const result = await authClient.subscription.upgrade({
  plan: 'pro',              // Plan name/ID
  annual: true,             // Optional: yearly billing
  successUrl: '/success',   // Redirect after successful payment
  cancelUrl: '/cancel',     // Redirect if checkout is cancelled
  metadata: {},             // Optional: custom metadata
  seats: 5,                 // Optional: number of seats for team plans
});

// Result contains checkout session URL
if (result?.url) {
  window.location.href = result.url;
}
```

#### 2. Cancel Subscription
Cancels an active subscription:

```typescript
await authClient.subscription.cancel({
  returnUrl: '/dashboard',      // Redirect URL after cancellation
  subscriptionId: 'sub_123',    // Optional: specific subscription ID
});
```

#### 3. Restore Subscription
Restores a cancelled subscription before period end:

```typescript
await authClient.subscription.restore({
  subscriptionId: 'sub_123',    // Optional: specific subscription ID
});
```

#### 4. Billing Portal
Opens Stripe's customer portal for subscription management:

```typescript
const result = await authClient.subscription.billingPortal({
  returnUrl: '/dashboard',      // Return URL after portal actions
});

if (result?.url) {
  window.location.href = result.url;
}
```

## Backend Requirements

The backend needs to configure the Better Auth Stripe plugin. Here's a minimal example:

```typescript
// Backend: auth.ts
import { betterAuth } from "better-auth";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

export const auth = betterAuth({
  // ... other auth config
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "free",
            // No priceId for free plan
          },
          {
            name: "starter",
            priceId: "price_starter_monthly",
            annualDiscountPriceId: "price_starter_yearly",
          },
          {
            name: "pro",
            priceId: "price_pro_monthly",
            annualDiscountPriceId: "price_pro_yearly",
          },
          {
            name: "enterprise",
            priceId: "price_enterprise_monthly",
            // Custom pricing, contact sales
          },
        ],
      },
    }),
  ],
});
```

### Required Environment Variables

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Webhook Setup

Better Auth's Stripe plugin automatically handles webhooks at:

```
POST /api/stripe/webhook
```

Configure this URL in your Stripe Dashboard under Webhooks.

### Session Data

The subscription data is automatically added to the user session by Better Auth:

```typescript
// User session will include subscription information
{
  user: {
    id: "...",
    email: "...",
    stripeCustomerId: "cus_...",
    // ... other user data
  },
  subscription: {
    id: "...",
    plan: "pro",
    status: "active",
    stripeSubscriptionId: "sub_...",
    periodStart: Date,
    periodEnd: Date,
    cancelAtPeriodEnd: false,
    // ... other subscription data
  }
}
```

## Plan Configuration

Plans are configured in `src/app/subscription/config/plans.ts` and should match the backend configuration:

```typescript
export const PLANS = {
  free: {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    // ... features and limits
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 9,
    priceYearly: 90,
    // Stripe price IDs should match backend
    // ... features and limits
  },
  // ... other plans
};
```

## Subscription Lifecycle Callbacks

The backend can configure callbacks for subscription events:

```typescript
subscription: {
  enabled: true,
  plans: [...],
  onSubscriptionComplete: async (data, ctx) => {
    // Called when a subscription is successfully created/renewed
    console.log('New subscription:', data.subscription);
  },
  onSubscriptionCancel: async (data) => {
    // Called when a subscription is cancelled
    console.log('Cancelled subscription:', data.subscription);
  },
  onSubscriptionUpdate: async (data) => {
    // Called when a subscription is updated
    console.log('Updated subscription:', data.subscription);
  },
}
```

## Frontend Hooks

The frontend provides React hooks for easy subscription management:

- `useCreateCheckout()` - Create a checkout session
- `useCancelSubscription()` - Cancel a subscription
- `useRestoreSubscription()` - Restore a cancelled subscription
- `useUpgradeSubscription()` - Upgrade to a different plan
- `useBillingPortal()` - Open Stripe customer portal

Example usage:

```typescript
import { useUpgradeSubscription } from '@/app/subscription/hooks';

function UpgradeButton() {
  const { mutate: upgrade, isPending } = useUpgradeSubscription();
  
  return (
    <button 
      onClick={() => upgrade({ planId: 'pro', annual: true })}
      disabled={isPending}
    >
      Upgrade to Pro
    </button>
  );
}
```

## Testing

For testing, use Stripe's test mode and test card numbers:

- Success: `4242 4242 4242 4242`
- Requires authentication: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`

## References

- [Better Auth Stripe Plugin Documentation](https://www.better-auth.com/docs/plugins/stripe)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
