/**
 * Types for the /v1/plans API endpoint
 * Based on the API specification
 */

export interface PlanFeatures {
  maxScenes: number; // -1 for unlimited
  maxDuration: number; // -1 for unlimited, in seconds
  exportQuality: '720p' | '1080p' | '4k';
  hasWatermark: boolean;
  storageType: 'local' | 'cloud';
  cloudProjectsLimit: number; // -1 for unlimited, 0 for none
  maxAudioTracks: number; // -1 for unlimited
  assetsLibrarySize: number; // -1 for unlimited
  customFonts: number; // -1 for unlimited
  hasAIVoice: boolean;
  hasAIScriptGenerator: boolean;
  hasAIImageGenerator: boolean;
  hasAIMusic: boolean;
  aiVideoLimit: number; // -1 for unlimited
  maxCollaborators: number; // -1 for unlimited, 0 for none
  supportLevel: 'community' | 'email_48h' | 'priority_24h' | 'premium_4h';
  hasTemplates: boolean;
  hasBranding: boolean;
  hasAPI: boolean;
  hasSSO: boolean;
  hasDedicatedSupport: boolean;
  hasCustomBranding: boolean;
  hasSLA: boolean;
}

export interface PlanPricing {
  monthly: number; // Price in cents
  yearly: number; // Price in cents
}

export interface PlanMetadata {
  [key: string]: any;
}

export interface ApiPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing: PlanPricing;
  features: PlanFeatures;
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
  metadata?: PlanMetadata;
}

export interface PlansApiResponse {
  success: boolean;
  data: ApiPlan[];
}
