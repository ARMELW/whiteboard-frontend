/**
 * Audio Mock Service
 * Simulates backend API for audio file management
 * Uses FileReader and blob URLs for local file handling
 */

import { AudioFile, AudioUploadOptions, AudioFilter, AudioCategory, AudioTrimConfig, AudioFadeConfig } from '../types';
import { AUDIO_CONFIG } from '../config';

class AudioMockService {
  private audioFiles: Map<string, AudioFile> = new Map();
  private blobUrls: Set<string> = new Set();

  /**
   * Upload and process an audio file
   */
  async uploadAudio(file: File, options?: AudioUploadOptions): Promise<AudioFile> {
    const maxSizeMB = options?.maxSizeMB || AUDIO_CONFIG.MAX_FILE_SIZE_MB;
    const allowedFormats = options?.allowedFormats || AUDIO_CONFIG.ALLOWED_FORMATS;

    this.validateFile(file, maxSizeMB, allowedFormats);

    await this.simulateDelay(300);

    const duration = await this.getAudioDuration(file);
    const fileUrl = URL.createObjectURL(file);
    
    this.blobUrls.add(fileUrl);

    const audioFile: AudioFile = {
      id: this.generateId(),
      fileName: file.name,
      fileUrl,
      file,
      duration,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      category: AudioCategory.OTHER,
      tags: [],
      isFavorite: false,
      segments: [],
    };

    this.audioFiles.set(audioFile.id, audioFile);
    return audioFile;
  }

  /**
   * Get all uploaded audio files with optional filters
   */
  async listAudioFiles(filter?: AudioFilter): Promise<AudioFile[]> {
    await this.simulateDelay(100);
    let files = Array.from(this.audioFiles.values());

    if (filter) {
      if (filter.category) {
        files = files.filter(f => f.category === filter.category);
      }

      if (filter.favoritesOnly) {
        files = files.filter(f => f.isFavorite);
      }

      if (filter.tags && filter.tags.length > 0) {
        files = files.filter(f => 
          f.tags && filter.tags!.some(tag => f.tags!.includes(tag))
        );
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        files = files.filter(f =>
          f.fileName.toLowerCase().includes(searchLower) ||
          (f.tags && f.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
    }

    return files;
  }

  /**
   * Get a specific audio file by ID
   */
  async getAudioFile(id: string): Promise<AudioFile | null> {
    await this.simulateDelay(50);
    return this.audioFiles.get(id) || null;
  }

  /**
   * Update audio file metadata
   */
  async updateAudioFile(id: string, updates: Partial<AudioFile>): Promise<AudioFile | null> {
    await this.simulateDelay(100);
    const audioFile = this.audioFiles.get(id);
    if (!audioFile) return null;

    const updated = { ...audioFile, ...updates };
    this.audioFiles.set(id, updated);
    return updated;
  }

  /**
   * Update audio trim configuration
   */
  async updateTrimConfig(id: string, trimConfig: AudioTrimConfig): Promise<AudioFile | null> {
    return this.updateAudioFile(id, { trimConfig });
  }

  /**
   * Update audio fade configuration
   */
  async updateFadeConfig(id: string, fadeConfig: AudioFadeConfig): Promise<AudioFile | null> {
    return this.updateAudioFile(id, { fadeConfig });
  }

  /**
   * Delete an audio file and cleanup blob URL
   */
  async deleteAudioFile(id: string): Promise<void> {
    const audioFile = this.audioFiles.get(id);
    if (audioFile) {
      this.cleanupBlobUrl(audioFile.fileUrl);
      this.audioFiles.delete(id);
    }
    await this.simulateDelay(100);
  }

  /**
   * Cleanup all blob URLs (call on unmount)
   */
  cleanup(): void {
    this.blobUrls.forEach(url => URL.revokeObjectURL(url));
    this.blobUrls.clear();
    this.audioFiles.clear();
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
      const isValidExtension = AUDIO_CONFIG.ALLOWED_EXTENSIONS.some(
        ext => ext === `.${extension}`
      );
      
      if (!isValidExtension) {
        throw new Error(`File format not supported. Allowed: ${AUDIO_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`);
      }
    }
  }

  /**
   * Extract audio duration using HTMLAudioElement
   */
  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load audio metadata'));
      });

      audio.src = url;
    });
  }

  /**
   * Generate unique ID for audio file
   */
  private generateId(): string {
    return `audio_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Simulate network delay
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const audioMockService = new AudioMockService();
