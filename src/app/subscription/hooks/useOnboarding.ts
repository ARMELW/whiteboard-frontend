import { useState, useEffect } from 'react';
import { useSession } from '@/app/auth';
import { type PlanId } from '../config/plans';
import { usePlanLimits } from './usePlanLimits';

interface UsageAnalytics {
  totalScenes: number;
  totalProjects: number;
  totalDuration: number;
  averageSceneCount: number;
  needsCloudStorage: boolean;
  needsCollaboration: boolean;
  needsAIFeatures: boolean;
}

interface PlanRecommendation {
  recommendedPlan: PlanId;
  reason: string;
  benefits: string[];
  urgency: 'low' | 'medium' | 'high';
}

const ONBOARDING_KEY = 'whiteboard_onboarding_completed';

export function useOnboarding() {
  const { user } = useSession();
  const { checkSceneLimit, checkStorageLimit, checkDurationLimit } = usePlanLimits();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  });

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setHasCompletedOnboarding(false);
  };

  const shouldShowOnboarding = !hasCompletedOnboarding && !!user;

  return {
    hasCompletedOnboarding,
    shouldShowOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}

export function usePlanRecommendation(analytics?: UsageAnalytics): PlanRecommendation | null {
  const { user } = useSession();
  const currentPlanId = user?.planId || 'free';

  if (!analytics) {
    return null;
  }

  // If already on enterprise, no recommendation needed
  if (currentPlanId === 'enterprise') {
    return null;
  }

  const {
    totalScenes,
    totalProjects,
    totalDuration,
    averageSceneCount,
    needsCloudStorage,
    needsCollaboration,
    needsAIFeatures,
  } = analytics;

  // High usage patterns - recommend Pro
  if (
    (averageSceneCount > 7 || totalScenes > 20) &&
    (needsAIFeatures || needsCollaboration)
  ) {
    return {
      recommendedPlan: 'pro',
      reason: 'Votre utilisation intensive nécessite des fonctionnalités avancées',
      benefits: [
        'Scènes illimitées pour vos projets complexes',
        'IA pour la synthèse vocale et génération de scripts',
        'Collaboration en équipe (3 membres)',
        'Export 4K Ultra HD',
        'Stockage cloud illimité',
      ],
      urgency: 'high',
    };
  }

  // Medium usage - recommend Starter
  if (
    currentPlanId === 'free' &&
    (averageSceneCount > 3 || totalProjects > 5 || needsCloudStorage)
  ) {
    return {
      recommendedPlan: 'starter',
      reason: 'Passez au plan Starter pour débloquer plus de fonctionnalités',
      benefits: [
        'Jusqu\'à 10 scènes par projet',
        'Export HD 1080p sans watermark',
        'Stockage cloud (5 projets)',
        'Vidéos jusqu\'à 5 minutes',
        '500+ assets premium',
      ],
      urgency: 'medium',
    };
  }

  // Collaboration needs
  if (needsCollaboration && currentPlanId !== 'pro' && currentPlanId !== 'enterprise') {
    return {
      recommendedPlan: 'pro',
      reason: 'Travaillez en équipe avec le plan Pro',
      benefits: [
        'Collaboration avec 3 membres',
        'Stockage cloud illimité',
        'Toutes les fonctionnalités avancées',
      ],
      urgency: 'medium',
    };
  }

  // AI features needed
  if (needsAIFeatures && currentPlanId !== 'pro' && currentPlanId !== 'enterprise') {
    return {
      recommendedPlan: 'pro',
      reason: 'Accédez aux fonctionnalités IA pour gagner du temps',
      benefits: [
        'IA Synthèse vocale (50+ voix)',
        'Générateur de script IA',
        'Export 4K Ultra HD',
      ],
      urgency: 'low',
    };
  }

  return null;
}

export function useUsageAnalytics(): UsageAnalytics {
  const { user } = useSession();
  const [analytics, setAnalytics] = useState<UsageAnalytics>({
    totalScenes: 0,
    totalProjects: 0,
    totalDuration: 0,
    averageSceneCount: 0,
    needsCloudStorage: false,
    needsCollaboration: false,
    needsAIFeatures: false,
  });

  useEffect(() => {
    // In a real app, fetch this from an API or analytics service
    const fetchUsageData = async () => {
      try {
        // Mock data for now
        // TODO: Replace with actual API call
        const mockData: UsageAnalytics = {
          totalScenes: 12,
          totalProjects: 4,
          totalDuration: 180, // 3 minutes
          averageSceneCount: 3,
          needsCloudStorage: true,
          needsCollaboration: false,
          needsAIFeatures: false,
        };

        setAnalytics(mockData);
      } catch (error) {
        console.error('Error fetching usage analytics:', error);
      }
    };

    if (user) {
      fetchUsageData();
    }
  }, [user]);

  return analytics;
}
