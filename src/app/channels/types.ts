export interface BrandKit {
  logo_url: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  intro_video_url: string | null;
  outro_video_url: string | null;
  custom_fonts: string[] | null;
}

export interface Channel {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  youtube_url: string | null;
  brand_kit: BrandKit;
  project_count: number;
  total_videos_exported: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ChannelPayload {
  name: string;
  description?: string | null;
  youtube_url?: string | null;
}

export interface ChannelStats {
  channel_id: string;
  total_projects: number;
  projects_by_status: {
    draft: number;
    in_progress: number;
    completed: number;
  };
  total_videos_exported: number;
  total_duration_minutes: number;
  last_activity: string;
  most_used_assets: Array<{
    asset_id: string;
    name: string;
    usage_count: number;
  }>;
}

export interface ChannelPlanLimits {
  total: number;
  used: number;
  limit: number;
  plan: 'free' | 'creator' | 'pro' | 'agency';
}
