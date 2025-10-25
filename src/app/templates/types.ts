import { Scene } from '../scenes/types';

export enum TemplateType {
  EDUCATION = 'education',
  MARKETING = 'marketing',
  PRESENTATION = 'presentation',
  TUTORIAL = 'tutorial',
  ENTERTAINMENT = 'entertainment',
  WHITEBOARD = 'whiteboard',
  TECHNICAL = 'technical',
  EXPLANATORY = 'explanatory',
  PROMOTIONAL = 'promotional',
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

export enum TemplateComplexity {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface TemplateMetadata {
  layerCount: number;
  cameraCount: number;
  hasAudio: boolean;
  hasBackground: boolean;
  complexity?: TemplateComplexity;
  estimatedDuration?: number;
  recommendedUseCase?: string;
}

export interface TemplateRating {
  average: number;
  count: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  style: TemplateStyle;
  tags: string[];
  thumbnail: string | null;
  previewAnimation?: string | null;
  metadata: TemplateMetadata;
  rating?: TemplateRating;
  popularity?: number;
  sceneData: Scene;
  createdAt: string;
  updatedAt: string;
  version?: string;
}

export interface TemplatePayload {
  name?: string;
  description?: string;
  type?: TemplateType;
  style?: TemplateStyle;
  tags?: string[];
  thumbnail?: string | null;
  previewAnimation?: string | null;
  metadata?: TemplateMetadata;
  rating?: TemplateRating;
  popularity?: number;
  sceneData?: Scene;
  version?: string;
}

export interface TemplateFilter {
  type?: TemplateType;
  style?: TemplateStyle;
  complexity?: TemplateComplexity;
  tags?: string[];
  search?: string;
  minRating?: number;
  sortByPopularity?: boolean;
}

export interface TemplateExportFormat {
  version: string;
  template: Template;
  exportedAt: string;
}

export interface TemplateImportValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  needsMigration: boolean;
  sourceVersion?: string;
  targetVersion?: string;
}
