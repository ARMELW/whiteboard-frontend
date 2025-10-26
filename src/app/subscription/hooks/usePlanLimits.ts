import { useSession } from '@/app/auth';
import { getPlan, type PlanLimits } from '../config/plans';

interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  percentage: number;
  isUnlimited: boolean;
}

export function usePlanLimits() {
  const { user } = useSession();
  const planId = user?.planId || 'free';
  const plan = getPlan(planId);
  const limits = plan.limits;

  const checkSceneLimit = (currentScenes: number): LimitCheckResult => {
    const limit = limits.scenes;
    const isUnlimited = limit === -1;
    
    return {
      allowed: isUnlimited || currentScenes < limit,
      current: currentScenes,
      limit: limit,
      percentage: isUnlimited ? 0 : (currentScenes / limit) * 100,
      isUnlimited,
    };
  };

  const checkDurationLimit = (durationSeconds: number): LimitCheckResult => {
    const limit = limits.duration;
    const isUnlimited = limit === -1;
    
    return {
      allowed: isUnlimited || durationSeconds <= limit,
      current: durationSeconds,
      limit: limit,
      percentage: isUnlimited ? 0 : (durationSeconds / limit) * 100,
      isUnlimited,
    };
  };

  const checkStorageLimit = (currentProjects: number): LimitCheckResult => {
    const limit = limits.storage;
    const isUnlimited = limit === -1;
    const hasCloudStorage = limit > 0 || isUnlimited;
    
    return {
      allowed: isUnlimited || currentProjects < limit,
      current: currentProjects,
      limit: limit,
      percentage: isUnlimited ? 0 : (currentProjects / limit) * 100,
      isUnlimited,
    };
  };

  const checkAudioTracksLimit = (currentTracks: number): LimitCheckResult => {
    const limit = limits.audioTracks;
    const isUnlimited = limit === -1;
    
    return {
      allowed: isUnlimited || currentTracks < limit,
      current: currentTracks,
      limit: limit,
      percentage: isUnlimited ? 0 : (currentTracks / limit) * 100,
      isUnlimited,
    };
  };

  const canExportQuality = (quality: '720p' | '1080p' | '4k'): boolean => {
    const qualityOrder = ['720p', '1080p', '4k'];
    const planQualityIndex = qualityOrder.indexOf(limits.quality);
    const requestedQualityIndex = qualityOrder.indexOf(quality);
    return requestedQualityIndex <= planQualityIndex;
  };

  const hasWatermark = (): boolean => {
    return limits.watermark;
  };

  const canUseAIVoice = (): boolean => {
    return limits.aiVoice;
  };

  const canUseAIScript = (): boolean => {
    return limits.aiScript;
  };

  const getCollaborationLimit = (): number | false => {
    return limits.collaboration;
  };

  const canAddCollaborator = (currentCollaborators: number): boolean => {
    const limit = limits.collaboration;
    if (limit === false) return false;
    if (limit === -1) return true;
    return currentCollaborators < limit;
  };

  const hasCloudStorage = (): boolean => {
    return limits.storage !== 0;
  };

  const hasAPI = (): boolean => {
    return limits.api === true;
  };

  const hasCustomBranding = (): boolean => {
    return limits.customBranding === true;
  };

  return {
    planId,
    plan,
    limits,

    // Check functions
    checkSceneLimit,
    checkDurationLimit,
    checkStorageLimit,
    checkAudioTracksLimit,
    canExportQuality,

    // Feature checks
    hasWatermark,
    canUseAIVoice,
    canUseAIScript,
    getCollaborationLimit,
    canAddCollaborator,
    hasCloudStorage,
    hasAPI,
    hasCustomBranding,
  };
}
