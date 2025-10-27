# 🔐 Authentication & Subscription System

This document describes the authentication and subscription system implementation for Whiteboard Animation Frontend.

## 📋 Overview

The system provides:
- User authentication (login, signup, logout)
- JWT token management
- 4 subscription plans (Free, Starter, Pro, Enterprise)
- Plan-based feature limits
- Upgrade prompts and modals

## 🏗️ Architecture

### Module Structure

```
src/app/
├── auth/                           # Authentication module
│   ├── api/
│   │   └── authService.ts         # Auth API calls
│   ├── components/
│   │   ├── LoginForm.tsx          # Login form
│   │   ├── SignupForm.tsx         # Signup form
│   │   └── ProtectedRoute.tsx     # Route protection
│   ├── hooks/
│   │   ├── useAuth.ts             # Auth hook
│   │   └── useSession.ts          # Session hook
│   ├── schema.ts                   # Zod validation schemas
│   ├── types.ts                    # TypeScript types
│   ├── store.ts                    # Zustand store
│   └── config.ts                   # Configuration
│
└── subscription/                   # Subscription module
    ├── components/
    │   ├── UpgradePlanModal.tsx   # Upgrade prompt modal
    │   ├── LimitWarning.tsx       # Limit warning component
    │   ├── PlanBadge.tsx          # Plan badge display
    │   ├── UsageIndicator.tsx     # Usage progress bars
    │   └── WatermarkOverlay.tsx   # Watermark for free plan
    ├── hooks/
    │   ├── usePlanLimits.ts       # Plan limits hook
    │   └── useSceneCreationWithLimits.ts  # Scene creation with limits
    ├── config/
    │   └── plans.ts               # Plan configurations
    ├── types.ts                    # TypeScript types
    └── schema.ts                   # Zod validation schemas
```

## 🎯 Subscription Plans

### Free Plan (€0/month)
- 3 scenes per project
- 1 minute video duration
- 720p export with watermark
- 50+ basic assets
- Local storage only
- 1 audio track

### Starter Plan (€9/month)
- 10 scenes per project
- 5 minutes video duration
- 1080p export WITHOUT watermark
- 500+ assets
- Cloud storage (5 projects)
- 3 audio tracks
- Professional transitions

### Pro Plan (€29/month) ⭐ Popular
- Unlimited scenes
- Unlimited video duration
- 4K export
- 2000+ premium assets
- Unlimited cloud storage
- AI voice synthesis (50+ voices)
- AI script generator
- Collaboration (3 members)
- Priority support

### Enterprise Plan (€99+/month)
- All Pro features
- Unlimited users
- Custom branding
- SSO & 2FA
- Advanced analytics
- REST API access
- Dedicated account manager
- 4-hour support SLA

## 🔧 Usage Examples

### 1. Authentication

#### Login
```tsx
import { useAuth } from '@/app/auth';

function LoginComponent() {
  const { login, isLoggingIn } = useAuth();

  const handleLogin = (email: string, password: string) => {
    login({ email, password }, {
      onSuccess: (response) => {
        if (response.success) {
          // Navigate to dashboard
        }
      }
    });
  };
}
```

#### Check Authentication Status
```tsx
import { useSession } from '@/app/auth';

function ProtectedComponent() {
  const { isAuthenticated, user } = useSession();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome {user?.firstName}!</div>;
}
```

### 2. Plan Limits

#### Check Scene Limit
```tsx
import { usePlanLimits } from '@/app/subscription';

function SceneCreator() {
  const { checkSceneLimit } = usePlanLimits();
  
  const handleCreateScene = () => {
    const currentSceneCount = scenes.length;
    const limitCheck = checkSceneLimit(currentSceneCount);
    
    if (!limitCheck.allowed) {
      // Show upgrade modal
      showUpgradePrompt();
    } else {
      // Create scene
      createScene();
    }
  };
}
```

#### Check Export Quality
```tsx
import { usePlanLimits } from '@/app/subscription';

function ExportSettings() {
  const { canExportQuality, hasWatermark } = usePlanLimits();
  
  const qualities = ['720p', '1080p', '4k'];
  const availableQualities = qualities.filter(q => canExportQuality(q));
  
  const needsWatermark = hasWatermark();
}
```

### 3. Limit Warnings

```tsx
import { LimitWarning } from '@/app/subscription/components';
import { usePlanLimits } from '@/app/subscription';

function ProjectDashboard() {
  const { checkSceneLimit } = usePlanLimits();
  const currentScenes = scenes.length;
  const limitCheck = checkSceneLimit(currentScenes);

  return (
    <div>
      <LimitWarning
        title="Limite de scènes"
        message="Vous approchez de votre limite de scènes"
        current={limitCheck.current}
        limit={limitCheck.limit}
        percentage={limitCheck.percentage}
        onUpgrade={() => navigate('/pricing')}
      />
    </div>
  );
}
```

### 4. Usage Indicators

```tsx
import { UsageIndicator } from '@/app/subscription/components';
import { usePlanLimits } from '@/app/subscription';

function Dashboard() {
  const { limits, checkSceneLimit, checkStorageLimit } = usePlanLimits();
  
  return (
    <div className="space-y-4">
      <UsageIndicator
        label="Scènes utilisées"
        current={scenes.length}
        limit={limits.scenes}
        isUnlimited={limits.scenes === -1}
      />
      
      <UsageIndicator
        label="Stockage cloud"
        current={cloudProjects.length}
        limit={limits.storage}
        isUnlimited={limits.storage === -1}
        unit="projets"
      />
    </div>
  );
}
```

### 5. Upgrade Modal

```tsx
import { UpgradePlanModal } from '@/app/subscription/components';
import { useSession } from '@/app/auth';

function FeatureGate() {
  const { user } = useSession();
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <>
      <button onClick={() => setShowUpgrade(true)}>
        Use AI Voice
      </button>
      
      <UpgradePlanModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentPlanId={user?.planId || 'free'}
        feature="Synthèse vocale IA avec 50+ voix"
        requiredPlanId="pro"
      />
    </>
  );
}
```

### 6. Scene Creation with Limits

```tsx
import { useSceneCreationWithLimits } from '@/app/subscription/hooks';

function SceneManager() {
  const { attemptCreateScene, UpgradeModal, limitCheck } = useSceneCreationWithLimits();

  const handleAddScene = () => {
    attemptCreateScene(() => {
      // Actually create the scene
      addScene(newScene);
    });
  };

  return (
    <>
      <button 
        onClick={handleAddScene}
        disabled={!limitCheck.allowed}
      >
        Ajouter une scène
      </button>
      
      <UpgradeModal />
    </>
  );
}
```

### 7. Plan Badge Display

```tsx
import { PlanBadge } from '@/app/subscription/components';
import { useSession } from '@/app/auth';

function UserMenu() {
  const { user } = useSession();

  return (
    <div className="flex items-center gap-2">
      <span>{user?.email}</span>
      <PlanBadge planId={user?.planId || 'free'} />
    </div>
  );
}
```

### 8. Watermark on Exports

```tsx
import { WatermarkOverlay } from '@/app/subscription/components';
import { usePlanLimits } from '@/app/subscription';

function VideoExporter() {
  const { hasWatermark } = usePlanLimits();

  return (
    <div className="relative">
      {/* Your video content */}
      <canvas ref={canvasRef} />
      
      {/* Show watermark for free plan */}
      {hasWatermark() && (
        <WatermarkOverlay
          text="Whiteboard Animation"
          position="bottom-right"
          opacity={0.3}
        />
      )}
    </div>
  );
}
```

## 🔌 API Integration

### Backend Endpoints Required

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password

// Subscription
GET  /api/subscription/plans
GET  /api/subscription/current
POST /api/subscription/checkout
POST /api/subscription/cancel
POST /api/subscription/upgrade
POST /api/subscription/downgrade
GET  /api/subscription/invoices
```

### HTTP Client Configuration

The HTTP client automatically adds authentication tokens to requests:

```typescript
// httpClient.ts
this.client.interceptors.request.use((config) => {
  const token = localStorage.getItem('whiteboard_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🎨 Styling & Theming

All components use Tailwind CSS and follow the existing design system:
- Radix UI primitives for dialogs, badges, etc.
- Consistent color schemes per plan
- Responsive design
- Accessible components

## 🔒 Security Considerations

1. **Token Storage**: JWT tokens stored in localStorage
2. **Token Refresh**: Automatic token refresh before expiration
3. **Protected Routes**: Use `ProtectedRoute` wrapper
4. **Form Validation**: Zod schemas for input validation
5. **HTTPS Only**: All API calls should use HTTPS in production

## 🚀 Next Steps

### Backend Integration
1. Implement backend authentication endpoints
2. Set up Stripe for payment processing
3. Create subscription management API
4. Implement webhook handlers for subscription events

### Frontend Enhancements
1. Add OAuth providers (Google, GitHub)
2. Implement password reset flow
3. Add email verification
4. Create subscription management page
5. Add billing history view
6. Implement usage analytics dashboard

### Testing
1. Unit tests for hooks and utilities
2. Integration tests for auth flow
3. E2E tests for subscription upgrade flow
4. Visual regression tests for components

## 📚 Dependencies

- `zod` - Schema validation
- `@hookform/resolvers` - Form validation integration
- `react-hook-form` - Form management
- `zustand` - State management
- `@tanstack/react-query` - Server state management
- `@radix-ui/react-dialog` - Dialog primitives
- `lucide-react` - Icons

## 🐛 Known Limitations

1. **Backend Not Implemented**: Auth requires backend API
2. **Route Protection**: Currently disabled to allow development
3. **Stripe Integration**: Payment flow not yet implemented
4. **Email Notifications**: Not implemented
5. **OAuth Providers**: Not implemented

## 💡 Tips

1. Always check plan limits before allowing actions
2. Provide clear upgrade paths to users
3. Show usage indicators to encourage upgrades
4. Test limits with different plan configurations
5. Handle edge cases (unlimited limits = -1)

## 📖 Additional Resources

- [SUBSCRIPTION_PLAN.md](../SUBSCRIPTION_PLAN.md) - Detailed plan specifications
- [PLAN_IMPLEMENTATION_FEATURES.md](../PLAN_IMPLEMENTATION_FEATURES.md) - Implementation roadmap
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
