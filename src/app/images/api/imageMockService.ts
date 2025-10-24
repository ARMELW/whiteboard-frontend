/**
 * Image Mock Service
 * Simulates backend API for image file management
 * Uses FileReader and blob URLs for local file handling
 */

import { ImageFile, ImageUploadOptions } from '../types';
import { IMAGE_CONFIG } from '../config';

class ImageMockService {
  private imageFiles: Map<string, ImageFile> = new Map();
  private blobUrls: Set<string> = new Set();

  /**
   * Upload and process an image file
   */
  async uploadImage(file: File, options?: ImageUploadOptions): Promise<ImageFile> {
    const maxSizeMB = options?.maxSizeMB || IMAGE_CONFIG.MAX_FILE_SIZE_MB;
    const allowedFormats = options?.allowedFormats || IMAGE_CONFIG.ALLOWED_FORMATS;

    this.validateFile(file, maxSizeMB, allowedFormats);

    await this.simulateDelay(300);

    const { width, height } = await this.getImageDimensions(file);
    const fileUrl = URL.createObjectURL(file);
    
    this.blobUrls.add(fileUrl);

    const imageFile: ImageFile = {
      id: this.generateId(),
      fileName: file.name,
      fileUrl,
      file,
      width,
      height,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      usageCount: 0,
    };

    this.imageFiles.set(imageFile.id, imageFile);
    return imageFile;
  }

  /**
   * Get all uploaded image files
   */
  async listImageFiles(): Promise<ImageFile[]> {
    await this.simulateDelay(100);
    return Array.from(this.imageFiles.values());
  }

  /**
   * Get a specific image file by ID
   */
  async getImageFile(id: string): Promise<ImageFile | null> {
    await this.simulateDelay(50);
    return this.imageFiles.get(id) || null;
  }

  /**
   * Update usage count for an image
   */
  updateUsageCount(id: string, count: number): void {
    const imageFile = this.imageFiles.get(id);
    if (imageFile) {
      imageFile.usageCount = count;
    }
  }

  /**
   * Delete an image file and cleanup blob URL
   */
  async deleteImageFile(id: string): Promise<void> {
    const imageFile = this.imageFiles.get(id);
    if (imageFile) {
      this.cleanupBlobUrl(imageFile.fileUrl);
      this.imageFiles.delete(id);
    }
    await this.simulateDelay(100);
  }

  /**
   * Cleanup all blob URLs (call on unmount)
   */
  cleanup(): void {
    this.blobUrls.forEach(url => URL.revokeObjectURL(url));
    this.blobUrls.clear();
    this.imageFiles.clear();
  }

  /**
   * Cleanup a specific blob URL
   */
  private cleanupBlobUrl(url: string): void {
    if (this.blobUrls.has(url)) {
      URL.revokeObjectURL(url);
      this.blobUrls.delete(url);
    }
  }

  /**
   * Validate file size and format
   */
  private validateFile(file: File, maxSizeMB: number, allowedFormats: string[]): void {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    }

    if (!allowedFormats.includes(file.type)) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const isValidExtension = IMAGE_CONFIG.ALLOWED_EXTENSIONS.some(
        ext => ext === `.${extension}`
      );
      
      if (!isValidExtension) {
        throw new Error(`File format not supported. Allowed: ${IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`);
      }
    }
  }

  /**
   * Extract image dimensions using HTMLImageElement
   */
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  /**
   * Generate unique ID for image file
   */
  private generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Simulate network delay
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const imageMockService = new ImageMockService();
