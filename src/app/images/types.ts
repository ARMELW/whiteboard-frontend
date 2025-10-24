/**
 * Image Management Types
 * Defines the structure for image files and layer image configuration
 */

export interface ImageFile {
  id: string;
  fileName: string;
  fileUrl: string;
  file: File;
  width: number;
  height: number;
  size: number;
  uploadedAt: string;
  usageCount?: number;
}

export interface ImageLayerProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  scaleX: number;
  scaleY: number;
  flipX: boolean;
  flipY: boolean;
}

export interface ImageUploadOptions {
  maxSizeMB?: number;
  allowedFormats?: string[];
}

export interface ImageLibraryState {
  files: ImageFile[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}
