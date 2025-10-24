import { Scene } from '../scenes/types';

export enum TemplateType {
  EDUCATION = 'education',
  MARKETING = 'marketing',
  PRESENTATION = 'presentation',
  TUTORIAL = 'tutorial',
  ENTERTAINMENT = 'entertainment',
  OTHER = 'other',
}

export enum TemplateStyle {
  MINIMAL = 'minimal',
  COLORFUL = 'colorful',
  PROFESSIONAL = 'professional',
  CREATIVE = 'creative',
  DARK = 'dark',
  LIGHT = 'light',
}

export interface TemplateMetadata {
  layerCount: number;
  cameraCount: number;
  hasAudio: boolean;
  hasBackground: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  style: TemplateStyle;
  tags: string[];
  thumbnail: string | null;
  metadata: TemplateMetadata;
  sceneData: Scene;
  createdAt: string;
  updatedAt: string;
}

export interface TemplatePayload {
  name?: string;
  description?: string;
  type?: TemplateType;
  style?: TemplateStyle;
  tags?: string[];
  thumbnail?: string | null;
  metadata?: TemplateMetadata;
  sceneData?: Scene;
}

export interface TemplateFilter {
  type?: TemplateType;
  style?: TemplateStyle;
  tags?: string[];
  search?: string;
}
