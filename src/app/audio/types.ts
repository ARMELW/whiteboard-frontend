/**
 * Audio Management Types
 * Defines the structure for audio files and scene audio configuration
 */

export interface AudioFile {
  id: string;
  fileName: string;
  fileUrl: string;
  file: File;
  duration: number;
  uploadedAt: string;
  size: number;
}

export interface SceneAudioConfig {
  fileId: string;
  fileName: string;
  fileUrl: string;
  volume: number;
  duration: number;
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
