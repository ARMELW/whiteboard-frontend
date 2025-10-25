import { Scene } from '../scenes/types';

export enum WizardStep {
  PROMPT = 'prompt',
  IMPORT = 'import',
  CONFIGURATION = 'configuration',
  GENERATION = 'generation',
  REVIEW = 'review',
}

export enum VoiceType {
  MALE = 'male',
  FEMALE = 'female',
  NEUTRAL = 'neutral',
}

export enum DoodleStyle {
  MINIMAL = 'minimal',
  DETAILED = 'detailed',
  CARTOON = 'cartoon',
  SKETCH = 'sketch',
  PROFESSIONAL = 'professional',
}

export enum Language {
  FR = 'fr',
  EN = 'en',
  ES = 'es',
  DE = 'de',
}

export enum ImagePlacementStrategy {
  AUTO = 'auto',
  CENTERED = 'centered',
  GRID = 'grid',
  SCATTERED = 'scattered',
  MANUAL = 'manual',
}

export enum TextImageBalance {
  TEXT_HEAVY = 'text_heavy',
  BALANCED = 'balanced',
  IMAGE_HEAVY = 'image_heavy',
  AUTO = 'auto',
}

export interface WizardConfiguration {
  voiceType: VoiceType;
  doodleStyle: DoodleStyle;
  language: Language;
  generateVoiceover: boolean;
  generateImages: boolean;
  autoGenerateScenes: boolean;
  sceneDuration: number; // seconds per scene
  // Advanced settings
  imagePlacementStrategy: ImagePlacementStrategy;
  textImageBalance: TextImageBalance;
  minImagesPerScene: number;
  maxImagesPerScene: number;
  useTextLayers: boolean;
  imageSize: 'small' | 'medium' | 'large';
}

export interface GeneratedScript {
  id: string;
  fullScript: string;
  scenes: ScriptScene[];
  estimatedDuration: number;
}

export interface ScriptScene {
  id: string;
  title: string;
  content: string;
  duration: number;
  suggestedVisuals: string[];
  voiceoverText: string;
  // AI Decision details
  aiDecisions?: {
    imageCount: number;
    imagePositions: Array<{ x: number; y: number; reason: string }>;
    textLayers: Array<{ content: string; position: { x: number; y: number }; reason: string }>;
    styleChoices: {
      colorScheme: string;
      fontChoice: string;
      layoutReason: string;
    };
  };
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'doodle' | 'audio';
  url: string;
  sceneId: string;
  description?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  reasoning?: string;
}

export interface WizardState {
  isOpen: boolean;
  currentStep: WizardStep;
  prompt: string;
  configuration: WizardConfiguration;
  generatedScript: GeneratedScript | null;
  generatedAssets: GeneratedAsset[];
  generatedScenes: Scene[];
  isGenerating: boolean;
  error: string | null;
}

export const defaultWizardConfiguration: WizardConfiguration = {
  voiceType: VoiceType.NEUTRAL,
  doodleStyle: DoodleStyle.PROFESSIONAL,
  language: Language.FR,
  generateVoiceover: true,
  generateImages: true,
  autoGenerateScenes: true,
  sceneDuration: 10,
  imagePlacementStrategy: ImagePlacementStrategy.AUTO,
  textImageBalance: TextImageBalance.AUTO,
  minImagesPerScene: 1,
  maxImagesPerScene: 4,
  useTextLayers: true,
  imageSize: 'medium',
};
