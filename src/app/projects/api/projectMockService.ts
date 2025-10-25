import { Project, ProjectPayload } from '../types';

const MOCK_USER_ID = 'user_123';

const mockProjects: Project[] = [
  {
    id: 'prj_123',
    user_id: MOCK_USER_ID,
    channel_id: 'chn_456',
    title: 'Recette Pâtes Carbonara',
    description: 'Tuto recette pâtes carbonara authentique',
    thumbnail_url: 'https://storage.example.com/thumbnails/prj_123.jpg',
    resolution: '1080p',
    aspect_ratio: '16:9',
    fps: 30,
    duration: 120,
    status: 'draft',
    created_at: '2025-10-20T10:00:00Z',
    updated_at: '2025-10-25T14:30:00Z',
    deleted_at: null,
  },
  {
    id: 'prj_124',
    user_id: MOCK_USER_ID,
    channel_id: 'chn_456',
    title: 'Gâteau au Chocolat',
    description: null,
    thumbnail_url: null,
    resolution: '1080p',
    aspect_ratio: '16:9',
    fps: 30,
    duration: 180,
    status: 'in_progress',
    created_at: '2025-10-18T09:30:00Z',
    updated_at: '2025-10-24T16:20:00Z',
    deleted_at: null,
  },
  {
    id: 'prj_125',
    user_id: MOCK_USER_ID,
    channel_id: 'chn_789',
    title: 'iPhone 15 Review',
    description: 'Review complet du nouveau iPhone',
    thumbnail_url: 'https://storage.example.com/thumbnails/prj_125.jpg',
    resolution: '1080p',
    aspect_ratio: '16:9',
    fps: 60,
    duration: 300,
    status: 'completed',
    created_at: '2025-10-10T08:00:00Z',
    updated_at: '2025-10-22T11:45:00Z',
    deleted_at: null,
  },
];

class ProjectMockService {
  private projects: Project[] = [...mockProjects];
  private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async list(channelId: string): Promise<{
    success: boolean;
    data: {
      projects: Project[];
      total: number;
    };
  }> {
    await this.delay(300);
    const channelProjects = this.projects.filter(
      (p) => p.channel_id === channelId && !p.deleted_at
    );
    return {
      success: true,
      data: {
        projects: channelProjects,
        total: channelProjects.length,
      },
    };
  }

  async listAll(): Promise<{
    success: boolean;
    data: {
      projects: Project[];
      total: number;
    };
  }> {
    await this.delay(300);
    const activeProjects = this.projects.filter((p) => !p.deleted_at);
    return {
      success: true,
      data: {
        projects: activeProjects,
        total: activeProjects.length,
      },
    };
  }

  async detail(id: string): Promise<{ success: boolean; data: Project }> {
    await this.delay(200);
    const project = this.projects.find((p) => p.id === id && !p.deleted_at);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return { success: true, data: project };
  }

  async create(
    channelId: string,
    payload: ProjectPayload
  ): Promise<{ success: boolean; data: Project }> {
    await this.delay(400);

    const newProject: Project = {
      id: `prj_${Date.now()}`,
      user_id: MOCK_USER_ID,
      channel_id: channelId,
      title: payload.title,
      description: null,
      thumbnail_url: null,
      resolution: payload.resolution || '1080p',
      aspect_ratio: payload.aspect_ratio || '16:9',
      fps: payload.fps || 30,
      duration: 0,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };

    this.projects.push(newProject);
    return { success: true, data: newProject };
  }

  async update(
    id: string,
    payload: Partial<ProjectPayload> & { status?: Project['status'] }
  ): Promise<{ success: boolean; data: Project }> {
    await this.delay(300);

    const projectIndex = this.projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }

    const project = this.projects[projectIndex];
    const updatedProject: Project = {
      ...project,
      ...payload,
      updated_at: new Date().toISOString(),
    };

    this.projects[projectIndex] = updatedProject;
    return { success: true, data: updatedProject };
  }

  async duplicate(
    id: string,
    payload: { new_title: string; channel_id?: string }
  ): Promise<{ success: boolean; data: Project }> {
    await this.delay(500);

    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }

    const duplicatedProject: Project = {
      ...project,
      id: `prj_${Date.now()}`,
      title: payload.new_title,
      channel_id: payload.channel_id || project.channel_id,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.projects.push(duplicatedProject);
    return { success: true, data: duplicatedProject };
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    await this.delay(300);

    const projectIndex = this.projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }

    this.projects[projectIndex] = {
      ...this.projects[projectIndex],
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { success: true, message: 'Project moved to trash' };
  }

  async autosave(
    id: string,
    _data: { scenes: any[]; audio_tracks: any[] }
  ): Promise<{ success: boolean; saved_at: string }> {
    await this.delay(200);

    const projectIndex = this.projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }

    this.projects[projectIndex].updated_at = new Date().toISOString();

    return {
      success: true,
      saved_at: new Date().toISOString(),
    };
  }
}

export const projectMockService = new ProjectMockService();
