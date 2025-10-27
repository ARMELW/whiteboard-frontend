# Subscription Features Documentation

## Overview

This document describes the new subscription-related features added to the whiteboard frontend application.

## Features Implemented

### 1. Plan Comparison Modal

A comprehensive modal that displays all available subscription plans side-by-side with detailed feature comparisons.

**Component:** `PlanComparisonModal`

**Location:** `src/app/subscription/components/PlanComparisonModal.tsx`

**Features:**
- Side-by-side plan comparison
- Detailed feature comparison table
- Highlights current user's plan
- Shows recommended plan for the user
- Direct upgrade buttons
- Responsive grid layout

**Usage:**
```tsx
import { PlanComparisonModal } from '@/app/subscription';

<PlanComparisonModal
  open={isOpen}
  onOpenChange={setIsOpen}
  highlightPlan="pro"
  onUpgrade={(planId) => handleUpgrade(planId)}
/>
```

### 2. Enhanced Plan Badge with Trial Countdown

The PlanBadge component now displays trial period countdowns and usage metrics.

**Component:** `PlanBadge` (Enhanced)

**Location:** `src/app/subscription/components/PlanBadge.tsx`

**Features:**
- Shows trial days remaining in badge text
- Yellow-themed styling for trial badges
- Clock icon for trial status
- Date formatting for trial end date

**Usage:**
```tsx
import { PlanBadge } from '@/app/subscription';

// Trial badge
const trialEnd = new Date('2025-11-15');
<PlanBadge 
  planId="pro" 
  trialEnd={trialEnd}
/>
```

### 3. Usage Metrics in Badge Tooltip

Hover over any plan badge to see detailed usage metrics and recommendations.

**Features:**
- Current scenes vs limit
- Cloud storage usage
- Total video duration
- Visual warnings when approaching limits (80%+)
- Upgrade recommendations
- Trial countdown in tooltip
- Click to open comparison modal

**Usage:**
```tsx
<PlanBadge 
  planId="free"
  showUsageMetrics={true}
  currentScenes={2}
  currentProjects={0}
  totalDuration={45}
/>
```

### 4. Onboarding Wizard

A multi-step wizard to guide new users through the platform setup.

**Component:** `OnboardingWizard`

**Location:** `src/app/subscription/components/OnboardingWizard.tsx`

**Steps:**
1. **Welcome** - Platform introduction with key features
2. **Plan Selection** - Choose a subscription plan with recommendations
3. **Features Tour** - Highlights of main capabilities
4. **Complete** - Summary and next steps

**Features:**
- Progress indicator
- Plan recommendations based on user profile
- Responsive design
- Stores completion status in localStorage
- Can be reset for testing

**Usage:**
```tsx
import { OnboardingWizard } from '@/app/subscription';

<OnboardingWizard
  open={showWizard}
  onOpenChange={setShowWizard}
  onComplete={(selectedPlan) => {
    console.log('User selected:', selectedPlan);
  }}
/>
```

### 5. Usage-Based Plan Recommendations

Intelligent plan recommendations based on user behavior and needs.

**Hooks:** `usePlanRecommendation`, `useUsageAnalytics`

**Location:** `src/app/subscription/hooks/useOnboarding.ts`

**Recommendation Logic:**

- **Free → Starter:**
  - Average scenes > 3
  - Total projects > 5
  - Needs cloud storage

- **Starter → Pro:**
  - Average scenes > 7
  - Needs AI features
  - Requires collaboration
  - Total scenes > 20

- **Pro → Enterprise:**
  - Unlimited collaboration needs
  - Custom branding required
  - API access needed

**Urgency Levels:**
- **High:** User consistently hitting limits, productivity blocked
- **Medium:** Approaching limits or requesting features
- **Low:** Nice-to-have features for better experience

**Usage:**
```tsx
import { usePlanRecommendation, useUsageAnalytics } from '@/app/subscription';

const analytics = useUsageAnalytics();
const recommendation = usePlanRecommendation(analytics);

if (recommendation) {
  console.log('Recommended plan:', recommendation.recommendedPlan);
  console.log('Reason:', recommendation.reason);
  console.log('Urgency:', recommendation.urgency);
}
```

## Hooks

### `useOnboarding()`

Manages onboarding state and completion tracking.

```tsx
const { 
  hasCompletedOnboarding,
  shouldShowOnboarding,
  completeOnboarding,
  resetOnboarding 
} = useOnboarding();
```

**Returns:**
- `hasCompletedOnboarding`: boolean - Whether user completed onboarding
- `shouldShowOnboarding`: boolean - Whether to show wizard now
- `completeOnboarding`: () => void - Mark onboarding as complete
- `resetOnboarding`: () => void - Reset for testing

### `useUsageAnalytics()`

Fetches and provides user usage metrics.

```tsx
const analytics = useUsageAnalytics();
```

**Returns UsageAnalytics:**
```typescript
{
  totalScenes: number;
  totalProjects: number;
  totalDuration: number;
  averageSceneCount: number;
  needsCloudStorage: boolean;
  needsCollaboration: boolean;
  needsAIFeatures: boolean;
}
```

### `usePlanRecommendation(analytics)`

Analyzes usage and provides plan recommendations.

```tsx
const recommendation = usePlanRecommendation(analytics);
```

**Returns PlanRecommendation | null:**
```typescript
{
  recommendedPlan: PlanId;
  reason: string;
  benefits: string[];
  urgency: 'low' | 'medium' | 'high';
}
```

## Demo Page

A comprehensive demo page showcasing all features is available at:

**URL:** `/demo/subscription`

**Location:** `src/pages/demo/SubscriptionFeaturesDemo.tsx`

The demo page includes:
- All plan badges in different states
- Trial period badge example
- High usage badge with warnings
- Comparison modal trigger
- Onboarding wizard launcher
- Usage analytics documentation
- Technical implementation notes

## Integration Examples

### Example 1: Dashboard with Onboarding

```tsx
import { useState, useEffect } from 'react';
import { useOnboarding } from '@/app/subscription';
import { OnboardingWizard } from '@/app/subscription';

export function Dashboard() {
  const { shouldShowOnboarding, completeOnboarding } = useOnboarding();
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    if (shouldShowOnboarding) {
      setShowWizard(true);
    }
  }, [shouldShowOnboarding]);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Dashboard content */}
      
      <OnboardingWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onComplete={(selectedPlan) => {
          completeOnboarding();
          // Handle plan selection
        }}
      />
    </div>
  );
}
```

### Example 2: Header with Plan Badge

```tsx
import { PlanBadge } from '@/app/subscription';
import { useSession } from '@/app/auth';
import { useUsageAnalytics } from '@/app/subscription';

export function Header() {
  const { user } = useSession();
  const analytics = useUsageAnalytics();

  return (
    <header>
      <nav>
        {/* Navigation items */}
      </nav>
      
      {user && (
        <PlanBadge
          planId={user.planId}
          trialEnd={user.trialEnd}
          currentScenes={analytics.totalScenes}
          currentProjects={analytics.totalProjects}
          totalDuration={analytics.totalDuration}
        />
      )}
    </header>
  );
}
```

### Example 3: Usage Warning

```tsx
import { usePlanRecommendation, useUsageAnalytics } from '@/app/subscription';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function UsageWarning() {
  const analytics = useUsageAnalytics();
  const recommendation = usePlanRecommendation(analytics);

  if (!recommendation || recommendation.urgency === 'low') {
    return null;
  }

  return (
    <Alert variant={recommendation.urgency === 'high' ? 'destructive' : 'default'}>
      <AlertDescription>
        <p className="font-semibold">{recommendation.reason}</p>
        <ul className="mt-2 space-y-1">
          {recommendation.benefits.slice(0, 3).map((benefit, idx) => (
            <li key={idx}>• {benefit}</li>
          ))}
        </ul>
        <Button className="mt-3" size="sm">
          Upgrade to {recommendation.recommendedPlan}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
```

## Dependencies

The features use the following external dependencies:

- **@radix-ui/react-tooltip** - Tooltip primitives
- **@radix-ui/react-dialog** - Dialog/modal primitives
- **date-fns** - Date manipulation and formatting
- **lucide-react** - Icons
- **zustand** - State management (existing)
- **react-router-dom** - Routing (existing)

## Testing

To test the features:

1. **Visit the demo page:** Navigate to `/demo/subscription`
2. **Test plan badges:** Hover over different badges to see tooltips
3. **Test comparison modal:** Click any badge to open the modal
4. **Test onboarding:** Click the "Launch Onboarding Wizard" button
5. **Reset onboarding:** Use browser console: `localStorage.removeItem('whiteboard_onboarding_completed')`

## Future Enhancements

Potential improvements for future iterations:

1. **Analytics API Integration:** Connect `useUsageAnalytics` to real backend API
2. **A/B Testing:** Test different recommendation strategies
3. **Email Notifications:** Send upgrade suggestions via email
4. **In-app Nudges:** Show contextual upgrade prompts
5. **Plan Comparison Export:** Allow users to download comparison as PDF
6. **Custom Branding:** Allow enterprise users to customize wizard
7. **Localization:** Add translations for all text content
8. **Animation Effects:** Enhance transitions and animations
9. **Mobile Optimization:** Further optimize for mobile devices
10. **Accessibility Audit:** Comprehensive WCAG compliance check

## Support

For questions or issues related to these features, please:

1. Check this documentation first
2. Review the demo page at `/demo/subscription`
3. Examine the component source code
4. Contact the development team

---

**Last Updated:** October 27, 2025
**Version:** 1.0.0
