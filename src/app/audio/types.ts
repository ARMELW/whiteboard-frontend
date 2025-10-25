/**
 * Audio Management Types
 * Defines the structure for audio files and scene audio configuration
 */

export enum AudioCategory {
  MUSIC = 'music',
  SFX = 'sfx',
  VOICEOVER = 'voiceover',
  AMBIENT = 'ambient',
  OTHER = 'other',
}

export interface AudioTrimConfig {
  startTime: number;
  endTime: number;
}

export interface AudioFadeConfig {
  fadeIn: number;
  fadeOut: number;
}

export interface AudioSegment {
  id: string;
  startTime: number;
  endTime: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface AudioFile {
  id: string;
  fileName: string;
  fileUrl: string;
  file: File;
  duration: number;
  uploadedAt: string;
  size: number;
  category?: AudioCategory;
  tags?: string[];
  isFavorite?: boolean;
  trimConfig?: AudioTrimConfig;
  fadeConfig?: AudioFadeConfig;
  segments?: AudioSegment[];
}

export interface SceneAudioConfig {
  fileId: string;
  fileName: string;
  fileUrl: string;
  volume: number;
  duration: number;
  trimConfig?: AudioTrimConfig;
  fadeConfig?: AudioFadeConfig;
}

export interface AudioUploadOptions {
  maxSizeMB?: number;
  allowedFormats?: string[];
}

export interface AudioLibraryState {
  files: AudioFile[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export interface AudioFilter {
  category?: AudioCategory;
  tags?: string[];
  search?: string;
  favoritesOnly?: boolean;
}
