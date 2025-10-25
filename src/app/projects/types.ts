export interface Project {
  id: string;
  user_id: string;
  channel_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  resolution: '720p' | '1080p' | '4k';
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:5';
  fps: 24 | 30 | 60;
  duration: number;
  status: 'draft' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProjectPayload {
  title: string;
  aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:5';
  resolution?: '720p' | '1080p' | '4k';
  fps?: 24 | 30 | 60;
}

export interface ProjectScene {
  id: string;
  project_id: string;
  order: number;
  duration: number;
  name: string;
  background_color: string;
  background_image_url: string | null;
  transition_type: 'none' | 'fade' | 'slide';
  transition_duration: number;
  created_at: string;
  updated_at: string;
}

export interface SceneElement {
  id: string;
  scene_id: string;
  type: 'text' | 'image' | 'shape' | 'doodle';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  z_index: number;
  content: any;
  animation_type: 'none' | 'draw' | 'fade_in' | 'slide_in';
  animation_duration: number;
  created_at: string;
  updated_at: string;
}

export interface AudioTrack {
  id: string;
  project_id: string;
  type: 'voiceover' | 'music' | 'sfx';
  audio_url: string;
  duration: number;
  start_time: number;
  volume: number;
  created_at: string;
}
