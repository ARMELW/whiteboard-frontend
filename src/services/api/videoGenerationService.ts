/**
 * Mock Video Generation Service
 * Simulates backend API for video generation
 */

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
  private jobs: Map<string, VideoGenerationJob> = new Map();

  /**
   * Mock: Generate video from scenes
   */
  async generateVideo(request: VideoGenerationRequest): Promise<string> {
    // Simulate API delay
    await this.delay(500);

    const jobId = this.generateJobId();
    const job: VideoGenerationJob = {
      id: jobId,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
    };

    this.jobs.set(jobId, job);

    // Simulate async processing
    this.simulateProcessing(jobId);

    return jobId;
  }

  /**
   * Mock: Get job status
   */
  async getJobStatus(jobId: string): Promise<VideoGenerationJob | null> {
    await this.delay(100);
    return this.jobs.get(jobId) || null;
  }

  /**
   * Mock: Download video (returns blob URL)
   */
  async downloadVideo(jobId: string): Promise<string> {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'completed') {
      throw new Error('Video not ready');
    }

    await this.delay(300);
    return job.videoUrl || '';
  }

  /**
   * Mock: Cancel job
   */
  async cancelJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (job && job.status !== 'completed') {
      job.status = 'error';
      job.error = 'Job cancelled by user';
    }
  }

  /**
   * Private: Simulate video processing
   */
  private simulateProcessing(jobId: string): void {
    const job = this.jobs.get(jobId);
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

      const currentJob = this.jobs.get(jobId);
      if (currentJob) {
        currentJob.progress = Math.min(progress, 100);
      }
    }, 800);
  }

  /**
   * Private: Create mock video file
   */
  private createMockVideo(jobId: string): void {
    const job = this.jobs.get(jobId);
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
        // Note: In real implementation, this would be a video/* mime type
        // For mock purposes, we use image/png to represent the video file
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

  /**
   * Private: Generate unique job ID
   */
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Private: Simulate delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const videoGenerationService = new VideoGenerationService();
