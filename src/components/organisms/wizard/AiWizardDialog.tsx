import React from 'react';
import { useWizard } from '@/app/wizard';
import { WizardStep } from '@/app/wizard/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { WizardPromptStep } from './WizardPromptStep';
import { WizardImportStep } from './WizardImportStep';
import { WizardConfigurationStep } from './WizardConfigurationStep';
import { WizardGenerationStep } from './WizardGenerationStep';
import { WizardReviewStep } from './WizardReviewStep';

export const AiWizardDialog: React.FC = () => {
  const { isOpen, currentStep, closeWizard } = useWizard();

  const renderStep = () => {
    switch (currentStep) {
      case WizardStep.PROMPT:
        return <WizardPromptStep />;
      case WizardStep.IMPORT:
        return <WizardImportStep />;
      case WizardStep.CONFIGURATION:
        return <WizardConfigurationStep />;
      case WizardStep.GENERATION:
        return <WizardGenerationStep />;
      case WizardStep.REVIEW:
        return <WizardReviewStep />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeWizard}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};
