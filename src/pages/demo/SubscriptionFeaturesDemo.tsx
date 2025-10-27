import { useState } from 'react';
import { PlanBadge, OnboardingWizard, PlanComparisonModal } from '@/app/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type PlanId } from '@/app/subscription/config/plans';

export function SubscriptionFeaturesDemo() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Mock trial date (7 days from now)
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Subscription Features Demo</h1>
        <p className="text-gray-600">
          Demonstration of all new subscription-related features
        </p>
      </div>

      {/* Plan Badges with Different States */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Badges</CardTitle>
          <CardDescription>
            Click on any badge to open the plan comparison modal. Hover to see usage metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Standard Plans</h3>
            <div className="flex flex-wrap gap-4">
              <PlanBadge 
                planId="free" 
                currentScenes={2}
                currentProjects={0}
                totalDuration={45}
              />
              <PlanBadge 
                planId="starter"
                currentScenes={7}
                currentProjects={3}
                totalDuration={240}
              />
              <PlanBadge 
                planId="pro"
                currentScenes={25}
                currentProjects={12}
                totalDuration={900}
              />
              <PlanBadge 
                planId="enterprise"
                currentScenes={100}
                currentProjects={50}
                totalDuration={3600}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Trial Period Badge</h3>
            <PlanBadge 
              planId="pro" 
              trialEnd={trialEnd}
              currentScenes={5}
              currentProjects={2}
              totalDuration={120}
            />
            <p className="text-sm text-gray-600 mt-2">
              This badge shows a trial period countdown (7 days remaining)
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">High Usage (Near Limits)</h3>
            <PlanBadge 
              planId="free" 
              currentScenes={3}
              currentProjects={0}
              totalDuration={55}
            />
            <p className="text-sm text-gray-600 mt-2">
              This badge shows usage at limits (hover to see warning)
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Badge Without Comparison</h3>
            <PlanBadge 
              planId="starter" 
              showComparison={false}
              currentScenes={5}
              currentProjects={2}
              totalDuration={150}
            />
            <p className="text-sm text-gray-600 mt-2">
              This badge has the comparison modal disabled
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison Modal */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison Modal</CardTitle>
          <CardDescription>
            Compare all available plans side-by-side with detailed features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowComparison(true)}>
            Open Plan Comparison
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Features:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside mt-2 space-y-1">
            <li>Side-by-side plan comparison</li>
            <li>Detailed feature comparison table</li>
            <li>Highlights current plan</li>
            <li>Shows recommended plan</li>
            <li>Direct upgrade buttons</li>
          </ul>
        </CardContent>
      </Card>

      {/* Onboarding Wizard */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Wizard</CardTitle>
          <CardDescription>
            Multi-step wizard for new users to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowOnboarding(true)}>
            Launch Onboarding Wizard
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Features:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside mt-2 space-y-1">
            <li>Welcome screen with platform overview</li>
            <li>Plan selection with recommendations</li>
            <li>Feature tour highlighting key capabilities</li>
            <li>Completion screen with selected plan summary</li>
            <li>Progress indicator throughout the flow</li>
            <li>Stores completion status in localStorage</li>
          </ul>
        </CardContent>
      </Card>

      {/* Usage Analytics & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Usage-Based Recommendations</CardTitle>
          <CardDescription>
            Smart plan recommendations based on user behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Recommendation Logic</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <strong>Free → Starter:</strong> Triggered when user creates more than 3 scenes on average,
                has 5+ projects, or needs cloud storage
              </li>
              <li>
                <strong>Starter → Pro:</strong> Triggered when user has 7+ average scenes, needs AI features,
                or requires collaboration
              </li>
              <li>
                <strong>Pro → Enterprise:</strong> Triggered for unlimited collaboration needs or custom branding
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Urgency Levels</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-16 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                  High
                </span>
                <span className="text-gray-600">
                  User consistently hitting limits, blocking productivity
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-16 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                  Medium
                </span>
                <span className="text-gray-600">
                  User approaching limits or requesting features
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-16 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                  Low
                </span>
                <span className="text-gray-600">
                  Nice-to-have features that would enhance experience
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Usage Metrics Tracked</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Total scenes created across all projects</li>
              <li>Average scenes per project</li>
              <li>Total projects created</li>
              <li>Total video duration</li>
              <li>Cloud storage usage</li>
              <li>Collaboration requests</li>
              <li>AI feature usage attempts</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            How the new features work under the hood
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Components Created</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li><code className="bg-gray-100 px-1 rounded">PlanComparisonModal.tsx</code> - Full plan comparison UI</li>
              <li><code className="bg-gray-100 px-1 rounded">OnboardingWizard.tsx</code> - Multi-step onboarding flow</li>
              <li>Enhanced <code className="bg-gray-100 px-1 rounded">PlanBadge.tsx</code> with tooltips and modal trigger</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Hooks Created</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li><code className="bg-gray-100 px-1 rounded">useOnboarding</code> - Manages onboarding state and completion</li>
              <li><code className="bg-gray-100 px-1 rounded">usePlanRecommendation</code> - Analyzes usage and suggests plans</li>
              <li><code className="bg-gray-100 px-1 rounded">useUsageAnalytics</code> - Tracks and fetches usage metrics</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Radix UI tooltips for rich hover interactions</li>
              <li>Date-fns for trial period calculations</li>
              <li>localStorage for onboarding persistence</li>
              <li>Responsive design for mobile compatibility</li>
              <li>Accessible with ARIA labels and semantic HTML</li>
              <li>Type-safe with TypeScript throughout</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PlanComparisonModal
        open={showComparison}
        onOpenChange={setShowComparison}
        highlightPlan="pro"
        onUpgrade={(planId: PlanId) => {
          console.log('Upgrade to:', planId);
          setShowComparison(false);
        }}
      />

      <OnboardingWizard
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={(selectedPlan) => {
          console.log('Onboarding completed with plan:', selectedPlan);
        }}
      />
    </div>
  );
}
