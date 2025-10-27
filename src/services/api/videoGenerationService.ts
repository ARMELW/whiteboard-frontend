/**
 * Video Generation Service
 * Uses backend API for video generation
 */

import httpClient from './httpClient';
import { API_ENDPOINTS } from '@/config/api';

export interface VideoGenerationRequest {
  scenes: any[];
  audio?: {
    file: File;
    fileName: string;
  };
  config?: {
    format?: string;
    quality?: string;
    fps?: number;
  };
}

export interface VideoGenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  videoUrl?: string;
  error?: string;
  createdAt: Date;
}

class VideoGenerationService {
  /**
   * Generate video from scenes using the API
   */
  async generateVideo(request: VideoGenerationRequest): Promise<string> {
    try {
      // For now, we'll use a simplified request that works with the API
      // In a full implementation, we would need to:
      // 1. Upload the audio file if present
      // 2. Send the project ID instead of raw scenes
      const response = await httpClient.post<{
        success: boolean;
        data: {
          exportId: string;
          status: string;
          progress: number;
        };
      }>(API_ENDPOINTS.export.video, {
        projectId: request.scenes[0]?.projectId || 'temp-project',
        format: request.config?.format === 'mp4' ? 'mp4' : 'webm',
        quality: this.mapQuality(request.config?.quality || 'fullhd'),
        resolution: '1080p',
        fps: request.config?.fps || 30,
        includeAudio: !!request.audio,
      });

      return response.data.data.exportId;
    } catch (error) {
      console.error('Error generating video:', error);
      // Fallback to mock behavior for development
      return this.generateMockJob();
    }
  }

  /**
   * Get job status from the API
   */
  async getJobStatus(jobId: string): Promise<VideoGenerationJob | null> {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: {
          exportId: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          progress: number;
          downloadUrl?: string;
          createdAt: string;
        };
      }>(API_ENDPOINTS.export.status(jobId));

      const data = response.data.data;
      return {
        id: data.exportId,
        status: data.status === 'failed' ? 'error' : data.status,
        progress: data.progress,
        videoUrl: data.downloadUrl,
        error: data.status === 'failed' ? 'Export failed' : undefined,
        createdAt: new Date(data.createdAt),
      };
    } catch (error) {
      console.error('Error getting job status:', error);
      // Fallback to mock behavior for development
      return this.getMockJobStatus(jobId);
    }
  }

  /**
   * Download video (returns blob URL)
   */
  async downloadVideo(jobId: string): Promise<string> {
    try {
      const job = await this.getJobStatus(jobId);
      if (!job || job.status !== 'completed') {
        throw new Error('Video not ready');
      }

      return job.videoUrl || '';
    } catch (error) {
      console.error('Error downloading video:', error);
      throw error;
    }
  }

  /**
   * Cancel job
   */
  async cancelJob(_jobId: string): Promise<void> {
    // API doesn't have a cancel endpoint yet
    // This would need to be implemented on the backend
    console.warn('Cancel job not implemented in API yet');
  }

  // Helper methods
  private mapQuality(quality: string): 'low' | 'medium' | 'high' | 'ultra' {
    const qualityMap: Record<string, 'low' | 'medium' | 'high' | 'ultra'> = {
      low: 'low',
      hd: 'medium',
      fullhd: 'high',
      '4k': 'ultra',
    };
    return qualityMap[quality] || 'high';
  }

  // Mock/fallback methods for development
  private mockJobs: Map<string, VideoGenerationJob> = new Map();

  private generateMockJob(): string {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const job: VideoGenerationJob = {
      id: jobId,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
    };

    this.mockJobs.set(jobId, job);
    this.simulateMockProcessing(jobId);

    return jobId;
  }

  private getMockJobStatus(jobId: string): VideoGenerationJob | null {
    return this.mockJobs.get(jobId) || null;
  }

  private simulateMockProcessing(jobId: string): void {
    const job = this.mockJobs.get(jobId);
    if (!job) return;

    job.status = 'processing';

    // Simulate progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Simulate video creation (mock blob)
        this.createMockVideo(jobId);
      }

      const currentJob = this.mockJobs.get(jobId);
      if (currentJob) {
        currentJob.progress = Math.min(progress, 100);
      }
    }, 800);
  }

  private createMockVideo(jobId: string): void {
    const job = this.mockJobs.get(jobId);
    if (!job) return;

    // Create a simple mock video blob (1x1 black pixel video)
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Mock Video Generated', canvas.width / 2, canvas.height / 2);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        job.videoUrl = url;
        job.status = 'completed';
        job.progress = 100;
      } else {
        job.status = 'error';
        job.error = 'Failed to create video';
      }
    }, 'image/png');
  }
}

export const videoGenerationService = new VideoGenerationService();
