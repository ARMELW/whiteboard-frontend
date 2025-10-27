export type PlanId = 'free' | 'starter' | 'pro' | 'enterprise';

export interface PlanLimits {
  scenes: number;
  duration: number; // in seconds
  quality: '720p' | '1080p' | '4k';
  storage: number; // number of cloud projects, 0 = local only, -1 = unlimited
  audioTracks: number; // -1 = unlimited
  watermark: boolean;
  aiVoice: boolean;
  aiScript: boolean;
  collaboration: number | false; // number of members or false
  assets: number;
  fonts: number; // -1 = unlimited
  api?: boolean;
  customBranding?: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: number; // monthly price in euros
  priceYearly?: number; // yearly price in euros
  popular?: boolean;
  // Add optional stripePriceIds to allow runtime mapping from API plans
  stripePriceIds?: {
    monthly?: string;
    yearly?: string;
  };
  limits: PlanLimits;
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Gratuit',
    description: 'Parfait pour découvrir et tester',
    price: 0,
    limits: {
      scenes: 3,
      duration: 60, // 1 minute
      quality: '720p',
      storage: 0, // local only
      audioTracks: 1,
      watermark: true,
      aiVoice: false,
      aiScript: false,
      collaboration: false,
      assets: 50,
      fonts: 10,
    },
    features: [
      'Projets illimités (local)',
      '3 scènes par projet',
      'Vidéos jusqu\'à 1 minute',
      'Export 720p avec watermark',
      '50+ assets de base',
      '10 polices',
      '1 piste audio',
      'Sauvegarde locale',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Pour créateurs de contenu débutants',
    price: 9,
    priceYearly: 90,
    limits: {
      scenes: 10,
      duration: 300, // 5 minutes
      quality: '1080p',
      storage: 5, // 5 cloud projects
      audioTracks: 3,
      watermark: false,
      aiVoice: false,
      aiScript: false,
      collaboration: false,
      assets: 500,
      fonts: 50,
    },
    features: [
      'Tout du plan Gratuit',
      '10 scènes par projet',
      'Vidéos jusqu\'à 5 minutes',
      'Export HD 1080p SANS watermark',
      'Stockage cloud (5 projets)',
      '500+ assets',
      '50+ polices premium',
      '3 pistes audio',
      'Transitions professionnelles',
      'Support email (48h)',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Pour professionnels et agences',
    price: 29,
    priceYearly: 290,
    popular: true,
    limits: {
      scenes: -1, // unlimited
      duration: -1, // unlimited
      quality: '4k',
      storage: -1, // unlimited
      audioTracks: -1, // unlimited
      watermark: false,
      aiVoice: true,
      aiScript: true,
      collaboration: 3,
      assets: 2000,
      fonts: -1, // unlimited
    },
    features: [
      'Tout du plan Starter',
      'Scènes illimitées',
      'Vidéos illimitées',
      'Export 4K Ultra HD',
      'Stockage cloud illimité',
      '2000+ assets premium',
      'Toutes les polices',
      'Pistes audio illimitées',
      'IA Synthèse vocale (50+ voix)',
      'Générateur de script IA',
      'Collaboration (3 membres)',
      'Support prioritaire (24h)',
      'Templates premium illimités',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Entreprise',
    description: 'Solution complète sur-mesure',
    price: 99, // Starting price, actual price is custom
    limits: {
      scenes: -1,
      duration: -1,
      quality: '4k',
      storage: -1,
      audioTracks: -1,
      watermark: false,
      aiVoice: true,
      aiScript: true,
      collaboration: -1, // unlimited
      assets: 2000,
      fonts: -1,
      api: true,
      customBranding: true,
    },
    features: [
      'Tout du plan Pro',
      'Utilisateurs illimités',
      'Gestion d\'équipe avancée',
      'Branding personnalisé',
      'Watermark personnalisé',
      'Sécurité renforcée (SSO, 2FA)',
      'Analytiques avancées',
      'API REST complète',
      'Account Manager dédié',
      'Support premium (4h)',
      'Formation sur site/visio',
      'SLA garanti (99.9%)',
    ],
  },
};

export function getPlan(planId: PlanId): Plan {
  return PLANS[planId];
}

export function canUsePlanFeature(
  currentPlanId: PlanId,
  requiredPlanId: PlanId
): boolean {
  const planOrder: PlanId[] = ['free', 'starter', 'pro', 'enterprise'];
  const currentIndex = planOrder.indexOf(currentPlanId);
  const requiredIndex = planOrder.indexOf(requiredPlanId);
  return currentIndex >= requiredIndex;
}
