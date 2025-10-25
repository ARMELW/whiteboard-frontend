import { Channel, ChannelPayload, ChannelStats, ChannelPlanLimits } from '../types';

const MOCK_USER_ID = 'user_123';
const CURRENT_PLAN: ChannelPlanLimits['plan'] = 'creator';

const PLAN_LIMITS: Record<ChannelPlanLimits['plan'], number> = {
  free: 1,
  creator: 3,
  pro: 10,
  agency: 999999,
};

const mockChannels: Channel[] = [
  {
    id: 'chn_456',
    user_id: MOCK_USER_ID,
    name: 'Ma Chaîne Cuisine',
    description: 'Recettes faciles et délicieuses',
    youtube_url: 'https://youtube.com/@cuisine',
    brand_kit: {
      logo_url: 'https://storage.example.com/logos/cuisine.png',
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
      },
      intro_video_url: null,
      outro_video_url: null,
      custom_fonts: null,
    },
    project_count: 12,
    total_videos_exported: 45,
    status: 'active',
    created_at: '2025-09-15T10:30:00Z',
    updated_at: '2025-10-24T16:45:00Z',
  },
  {
    id: 'chn_789',
    user_id: MOCK_USER_ID,
    name: 'Tech Reviews FR',
    description: null,
    youtube_url: null,
    brand_kit: {
      logo_url: null,
      colors: {
        primary: '#3498DB',
        secondary: '#E74C3C',
        accent: '#F39C12',
      },
      intro_video_url: null,
      outro_video_url: null,
      custom_fonts: null,
    },
    project_count: 8,
    total_videos_exported: 23,
    status: 'active',
    created_at: '2025-10-01T14:20:00Z',
    updated_at: '2025-10-20T09:15:00Z',
  },
];

class ChannelMockService {
  private channels: Channel[] = [...mockChannels];
  private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async list(): Promise<{
    success: boolean;
    data: {
      channels: Channel[];
      meta: ChannelPlanLimits;
    };
  }> {
    await this.delay(300);
    const activeChannels = this.channels.filter((c) => c.status === 'active');
    return {
      success: true,
      data: {
        channels: activeChannels,
        meta: {
          total: activeChannels.length,
          used: activeChannels.length,
          limit: PLAN_LIMITS[CURRENT_PLAN],
          plan: CURRENT_PLAN,
        },
      },
    };
  }

  async detail(id: string): Promise<{ success: boolean; data: Channel }> {
    await this.delay(200);
    const channel = this.channels.find((c) => c.id === id);
    if (!channel) {
      throw new Error(`Channel with id ${id} not found`);
    }
    return { success: true, data: channel };
  }

  async create(
    payload: ChannelPayload
  ): Promise<{ success: boolean; data: Channel } | { success: false; error: any }> {
    await this.delay(400);
    
    const activeChannels = this.channels.filter((c) => c.status === 'active');
    if (activeChannels.length >= PLAN_LIMITS[CURRENT_PLAN]) {
      return {
        success: false,
        error: {
          code: 'CHANNEL_LIMIT_REACHED',
          message: `Vous avez atteint la limite de ${PLAN_LIMITS[CURRENT_PLAN]} chaînes pour votre plan ${CURRENT_PLAN}`,
          current_count: activeChannels.length,
          limit: PLAN_LIMITS[CURRENT_PLAN],
          upgrade_url: `/pricing?from=${CURRENT_PLAN}&to=pro`,
        },
      };
    }

    const newChannel: Channel = {
      id: `chn_${Date.now()}`,
      user_id: MOCK_USER_ID,
      name: payload.name,
      description: payload.description || null,
      youtube_url: payload.youtube_url || null,
      brand_kit: {
        logo_url: null,
        colors: {
          primary: '#3498DB',
          secondary: '#E74C3C',
          accent: '#F39C12',
        },
        intro_video_url: null,
        outro_video_url: null,
        custom_fonts: null,
      },
      project_count: 0,
      total_videos_exported: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.channels.push(newChannel);
    return { success: true, data: newChannel };
  }

  async update(
    id: string,
    payload: Partial<ChannelPayload> & { brand_kit?: Partial<Channel['brand_kit']> }
  ): Promise<{ success: boolean; data: Channel }> {
    await this.delay(300);
    
    const channelIndex = this.channels.findIndex((c) => c.id === id);
    if (channelIndex === -1) {
      throw new Error(`Channel with id ${id} not found`);
    }

    const channel = this.channels[channelIndex];
    const updatedChannel: Channel = {
      ...channel,
      ...payload,
      brand_kit: payload.brand_kit
        ? { ...channel.brand_kit, ...payload.brand_kit }
        : channel.brand_kit,
      updated_at: new Date().toISOString(),
    };

    this.channels[channelIndex] = updatedChannel;
    return { success: true, data: updatedChannel };
  }

  async archive(id: string): Promise<{ success: boolean; message: string }> {
    await this.delay(200);
    
    const channelIndex = this.channels.findIndex((c) => c.id === id);
    if (channelIndex === -1) {
      throw new Error(`Channel with id ${id} not found`);
    }

    this.channels[channelIndex] = {
      ...this.channels[channelIndex],
      status: 'archived',
      updated_at: new Date().toISOString(),
    };

    return { success: true, message: 'Channel archived successfully' };
  }

  async delete(
    id: string
  ): Promise<{ success: boolean; message?: string } | { success: false; error: any }> {
    await this.delay(300);
    
    const channel = this.channels.find((c) => c.id === id);
    if (!channel) {
      throw new Error(`Channel with id ${id} not found`);
    }

    if (channel.project_count > 0) {
      return {
        success: false,
        error: {
          code: 'CHANNEL_HAS_ACTIVE_PROJECTS',
          message: 'Impossible de supprimer une chaîne contenant des projets actifs',
          active_projects_count: channel.project_count,
          suggestion: "Archivez ou supprimez d'abord les projets de cette chaîne",
        },
      };
    }

    this.channels = this.channels.filter((c) => c.id !== id);
    return { success: true, message: 'Channel deleted successfully' };
  }

  async getStats(id: string): Promise<{ success: boolean; data: ChannelStats }> {
    await this.delay(200);
    
    const channel = this.channels.find((c) => c.id === id);
    if (!channel) {
      throw new Error(`Channel with id ${id} not found`);
    }

    const stats: ChannelStats = {
      channel_id: id,
      total_projects: channel.project_count,
      projects_by_status: {
        draft: Math.floor(channel.project_count * 0.3),
        in_progress: Math.floor(channel.project_count * 0.2),
        completed: Math.floor(channel.project_count * 0.5),
      },
      total_videos_exported: channel.total_videos_exported,
      total_duration_minutes: channel.project_count * 5,
      last_activity: channel.updated_at,
      most_used_assets: [
        { asset_id: 'ast_001', name: 'Character', usage_count: 8 },
        { asset_id: 'ast_002', name: 'Logo', usage_count: 6 },
      ],
    };

    return { success: true, data: stats };
  }

  async uploadLogo(
    id: string,
    _file: File
  ): Promise<{ success: boolean; data: { logo_url: string; uploaded_at: string } }> {
    await this.delay(1000);
    
    const channelIndex = this.channels.findIndex((c) => c.id === id);
    if (channelIndex === -1) {
      throw new Error(`Channel with id ${id} not found`);
    }

    const logoUrl = `https://storage.example.com/logos/${id}_logo.png`;
    this.channels[channelIndex].brand_kit.logo_url = logoUrl;
    this.channels[channelIndex].updated_at = new Date().toISOString();

    return {
      success: true,
      data: {
        logo_url: logoUrl,
        uploaded_at: new Date().toISOString(),
      },
    };
  }
}

export const channelMockService = new ChannelMockService();
