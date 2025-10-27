import type { ApiPlan } from '../plans-api-types';
import type { Plan, PlanId } from '../config/plans';

/**
 * Convert API plan to local Plan format for backward compatibility
 */
export function convertApiPlanToLocalPlan(apiPlan: ApiPlan): Plan & { id: string } {
  const features = apiPlan.features;
  
  // Build feature list
  const featuresList: string[] = [];
  
  // Add basic features
  if (features.maxScenes === -1) {
    featuresList.push('Scènes illimitées');
  } else if (features.maxScenes > 0) {
    featuresList.push(`${features.maxScenes} scènes par projet`);
  }
  
  if (features.maxDuration === -1) {
    featuresList.push('Vidéos illimitées');
  } else if (features.maxDuration > 0) {
    const minutes = Math.floor(features.maxDuration / 60);
    featuresList.push(`Vidéos jusqu'à ${minutes} minute${minutes > 1 ? 's' : ''}`);
  }
  
  featuresList.push(`Export ${features.exportQuality.toUpperCase()}`);
  
  if (!features.hasWatermark) {
    featuresList.push('Sans watermark');
  } else {
    featuresList.push('Avec watermark');
  }
  
  // Storage
  if (features.storageType === 'cloud') {
    if (features.cloudProjectsLimit === -1) {
      featuresList.push('Stockage cloud illimité');
    } else if (features.cloudProjectsLimit > 0) {
      featuresList.push(`Stockage cloud (${features.cloudProjectsLimit} projets)`);
    }
  } else {
    featuresList.push('Sauvegarde locale');
  }
  
  // Assets
  if (features.assetsLibrarySize > 0) {
    featuresList.push(`${features.assetsLibrarySize}+ assets`);
  }
  
  // Audio tracks
  if (features.maxAudioTracks === -1) {
    featuresList.push('Pistes audio illimitées');
  } else if (features.maxAudioTracks > 0) {
    featuresList.push(`${features.maxAudioTracks} piste${features.maxAudioTracks > 1 ? 's' : ''} audio`);
  }
  
  // Fonts
  if (features.customFonts === -1) {
    featuresList.push('Toutes les polices');
  } else if (features.customFonts > 0) {
    featuresList.push(`${features.customFonts}+ polices`);
  }
  
  // AI Features
  if (features.hasAIVoice) {
    featuresList.push('IA Synthèse vocale');
  }
  
  if (features.hasAIScriptGenerator) {
    featuresList.push('Générateur de script IA');
  }
  
  if (features.hasAIImageGenerator) {
    featuresList.push('Générateur d\'images IA');
  }
  
  if (features.hasAIMusic) {
    featuresList.push('Musique IA');
  }
  
  // Collaboration
  if (features.maxCollaborators === -1) {
    featuresList.push('Collaboration illimitée');
  } else if (features.maxCollaborators > 0) {
    featuresList.push(`Collaboration (${features.maxCollaborators} membres)`);
  }
  
  // Support
  const supportLabels = {
    community: 'Support communauté',
    email_48h: 'Support email (48h)',
    priority_24h: 'Support prioritaire (24h)',
    premium_4h: 'Support premium (4h)',
  };
  featuresList.push(supportLabels[features.supportLevel]);
  
  // Premium features
  if (features.hasTemplates) {
    featuresList.push('Templates premium');
  }
  
  if (features.hasAPI) {
    featuresList.push('API REST complète');
  }
  
  if (features.hasSSO) {
    featuresList.push('SSO');
  }
  
  if (features.hasCustomBranding) {
    featuresList.push('Branding personnalisé');
  }
  
  if (features.hasSLA) {
    featuresList.push('SLA garanti');
  }
  
  if (features.hasDedicatedSupport) {
    featuresList.push('Account Manager dédié');
  }
  
  // Convert pricing from cents to euros
  const monthlyPrice = apiPlan.pricing.monthly / 100;
  const yearlyPrice = apiPlan.pricing.yearly / 100;
  
  return {
    id: apiPlan.slug as PlanId,
    name: apiPlan.name,
    description: apiPlan.description,
    price: monthlyPrice,
    stripePriceIds: apiPlan.stripePriceIds,
    priceYearly: yearlyPrice > 0 ? yearlyPrice : undefined,
    popular: apiPlan.sortOrder === 2, // Typically the middle plan is popular
    limits: {
      scenes: features.maxScenes,
      duration: features.maxDuration,
      quality: features.exportQuality,
      storage: features.cloudProjectsLimit,
      audioTracks: features.maxAudioTracks,
      watermark: features.hasWatermark,
      aiVoice: features.hasAIVoice,
      aiScript: features.hasAIScriptGenerator,
      collaboration: features.maxCollaborators > 0 ? features.maxCollaborators : false,
      assets: features.assetsLibrarySize,
      fonts: features.customFonts,
      api: features.hasAPI,
      customBranding: features.hasCustomBranding,
    },
    features: featuresList,
  };
}

/**
 * Convert array of API plans to local plans map
 */
export function convertApiPlansToLocalPlans(apiPlans: ApiPlan[]): Record<string, Plan> {
  const plansMap: Record<string, Plan> = {};
  
  apiPlans.forEach(apiPlan => {
    const localPlan = convertApiPlanToLocalPlan(apiPlan);
    plansMap[apiPlan.slug] = localPlan;
  });
  
  return plansMap;
}
