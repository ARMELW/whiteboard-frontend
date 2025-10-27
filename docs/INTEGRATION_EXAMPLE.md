# Integration Example: Adding Subscription Pages to Routes

This document shows how to integrate the subscription pages into your application router.

## React Router Setup

```tsx
// src/routes/index.tsx or src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PricingPage, BillingHistoryPage } from '@/pages/pricing';
import { SubscriptionManagementPage } from '@/pages/dashboard';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscription" element={<SubscriptionManagementPage />} />
          <Route path="/billing" element={<BillingHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Protected Route Component

```tsx
// src/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/app/auth';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
```

## Navigation Menu Integration

```tsx
// src/components/layout/Navigation.tsx
import { Link } from 'react-router-dom';
import { useSession } from '@/app/auth';
import { CreditCard, FileText, Settings } from 'lucide-react';

export function Navigation() {
  const { isAuthenticated, user } = useSession();

  return (
    <nav className="flex items-center gap-4">
      {/* Always visible */}
      <Link to="/pricing" className="flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        Tarifs
      </Link>

      {/* Only for authenticated users */}
      {isAuthenticated && (
        <>
          <Link to="/subscription" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Mon abonnement
          </Link>
          
          <Link to="/billing" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Factures
          </Link>

          {/* Show current plan badge */}
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
            Plan {user?.planId}
          </span>
        </>
      )}
    </nav>
  );
}
```

## Dashboard Integration

```tsx
// src/pages/dashboard/Dashboard.tsx
import { useSession } from '@/app/auth';
import { usePlanLimits } from '@/app/subscription';
import { Link } from 'react-router-dom';
import { ArrowUpCircle } from 'lucide-react';

export function Dashboard() {
  const { user } = useSession();
  const { plan, limits } = usePlanLimits();

  return (
    <div className="p-6">
      <h1>Dashboard</h1>
      
      {/* Plan info card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Plan actuel: {plan.name}</h2>
            <p className="text-gray-600">{plan.description}</p>
          </div>
          
          {user?.planId !== 'enterprise' && (
            <Link to="/subscription">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <ArrowUpCircle className="h-5 w-5" />
                Améliorer
              </button>
            </Link>
          )}
        </div>

        {/* Quick limits display */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {limits.scenes === -1 ? '∞' : limits.scenes}
            </p>
            <p className="text-sm text-gray-600">Scènes/projet</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{limits.quality}</p>
            <p className="text-sm text-gray-600">Qualité export</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {limits.storage === -1 ? '∞' : limits.storage}
            </p>
            <p className="text-sm text-gray-600">Projets cloud</p>
          </div>
        </div>
      </div>

      {/* Rest of dashboard content */}
    </div>
  );
}
```

## Checkout Success Handler

```tsx
// src/pages/CheckoutSuccess.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');

  useEffect(() => {
    if (checkoutStatus === 'success') {
      toast.success('Abonnement activé avec succès!', {
        description: 'Votre paiement a été traité. Bienvenue!',
      });
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 3000);
    } else if (checkoutStatus === 'cancel') {
      toast.error('Paiement annulé', {
        description: 'Vous pouvez réessayer à tout moment.',
      });
    }
  }, [checkoutStatus, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {checkoutStatus === 'success' ? (
        <>
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Paiement réussi!</h1>
          <p className="text-gray-600">Redirection vers votre dashboard...</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2">Paiement annulé</h1>
          <p className="text-gray-600 mb-4">Aucun montant n'a été débité</p>
          <button
            onClick={() => navigate('/pricing')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retour aux tarifs
          </button>
        </>
      )}
    </div>
  );
}
```

## Complete Route Configuration

```tsx
// src/routes/index.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PricingPage, BillingHistoryPage } from '@/pages/pricing';
import { SubscriptionManagementPage } from '@/pages/dashboard';
import { CheckoutSuccess } from '@/pages/CheckoutSuccess';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Subscription Management */}
          <Route path="/subscription" element={<SubscriptionManagementPage />} />
          <Route path="/billing" element={<BillingHistoryPage />} />
          
          {/* Checkout Success/Cancel Handler */}
          <Route path="/checkout" element={<CheckoutSuccess />} />

          {/* Other protected routes */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Usage in Main App

```tsx
// src/main.tsx or src/App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { AppRouter } from './routes';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

## Environment Variables

```env
# .env
VITE_API_URL=https://api.doodlio.com/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
```

## TypeScript Configuration

Make sure your `tsconfig.json` includes path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

And your `vite.config.ts` has the resolve alias:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Testing the Integration

1. Start your dev server: `npm run dev`
2. Navigate to `/pricing`
3. Select a plan (logged out) → should redirect to login
4. Login and return to `/pricing`
5. Select a plan → should create checkout and redirect
6. After payment, return to app via success URL
7. Check `/subscription` to manage subscription
8. Check `/billing` to view invoice history

## Troubleshooting

### Checkout not redirecting
- Check that `VITE_API_URL` is set correctly
- Verify authentication token is being sent in headers
- Check browser console for errors

### Plans not loading
- Verify API endpoint is accessible
- Check network tab for failed requests
- Ensure fallback to local plans is working

### Authentication issues
- Clear localStorage and cookies
- Check session token expiration
- Verify better-auth configuration

## Next Steps

1. Add webhook handler for subscription events
2. Implement usage tracking and limits display
3. Add email notifications for subscription changes
4. Create admin panel for subscription management
