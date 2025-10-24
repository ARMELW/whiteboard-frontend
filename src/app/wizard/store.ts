import { create } from 'zustand';
import { 
  WizardState, 
  WizardStep, 
  WizardConfiguration, 
  GeneratedScript,
  GeneratedAsset,
  defaultWizardConfiguration 
} from './types';
import { Scene } from '../scenes/types';

interface WizardStore extends WizardState {
  openWizard: () => void;
  closeWizard: () => void;
  setCurrentStep: (step: WizardStep) => void;
  setPrompt: (prompt: string) => void;
  setConfiguration: (config: Partial<WizardConfiguration>) => void;
  setGeneratedScript: (script: GeneratedScript | null) => void;
  setGeneratedAssets: (assets: GeneratedAsset[]) => void;
  setGeneratedScenes: (scenes: Scene[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  resetWizard: () => void;
  nextStep: () => void;
  previousStep: () => void;
}

const initialState: WizardState = {
  isOpen: false,
  currentStep: WizardStep.PROMPT,
  prompt: '',
  configuration: defaultWizardConfiguration,
  generatedScript: null,
  generatedAssets: [],
  generatedScenes: [],
  isGenerating: false,
  error: null,
};

export const useWizardStore = create<WizardStore>((set, get) => ({
  ...initialState,

  openWizard: () => set({ isOpen: true, currentStep: WizardStep.PROMPT }),
  
  closeWizard: () => {
    const state = get();
    set({ isOpen: false });
    // Reset after closing animation
    setTimeout(() => {
      set(initialState);
    }, 300);
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  setPrompt: (prompt) => set({ prompt }),

  setConfiguration: (config) => 
    set((state) => ({ 
      configuration: { ...state.configuration, ...config } 
    })),

  setGeneratedScript: (script) => set({ generatedScript: script }),

  setGeneratedAssets: (assets) => set({ generatedAssets: assets }),

  setGeneratedScenes: (scenes) => set({ generatedScenes: scenes }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setError: (error) => set({ error }),

  resetWizard: () => set(initialState),

  nextStep: () => {
    const { currentStep } = get();
    const steps = [
      WizardStep.PROMPT,
      WizardStep.CONFIGURATION,
      WizardStep.GENERATION,
      WizardStep.REVIEW,
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      set({ currentStep: steps[currentIndex + 1] });
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    const steps = [
      WizardStep.PROMPT,
      WizardStep.CONFIGURATION,
      WizardStep.GENERATION,
      WizardStep.REVIEW,
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: steps[currentIndex - 1] });
    }
  },
}));
