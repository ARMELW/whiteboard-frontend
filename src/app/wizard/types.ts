import { Scene } from '../scenes/types';

export enum WizardStep {
  PROMPT = 'prompt',
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

export interface WizardConfiguration {
  voiceType: VoiceType;
  doodleStyle: DoodleStyle;
  language: Language;
  generateVoiceover: boolean;
  generateImages: boolean;
  autoGenerateScenes: boolean;
  sceneDuration: number; // seconds per scene
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
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'doodle' | 'audio';
  url: string;
  sceneId: string;
  description?: string;
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
};
