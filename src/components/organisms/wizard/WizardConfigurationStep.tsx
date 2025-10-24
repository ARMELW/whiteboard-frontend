import React from 'react';
import { useWizard } from '@/app/wizard';
import { VoiceType, DoodleStyle, Language } from '@/app/wizard/types';
import { Settings, ArrowLeft } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export const WizardConfigurationStep: React.FC = () => {
  const { configuration, setConfiguration, previousStep, startGeneration } = useWizard();

  const handleContinue = () => {
    startGeneration();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <Settings className="w-6 h-6 text-purple-500" />
          Assistant IA - Étape 2: Configuration
        </DialogTitle>
        <DialogDescription>
          Personnalisez les paramètres de génération pour votre projet
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-6">
        {/* Voice Type */}
        <div className="space-y-3">
          <Label htmlFor="voiceType" className="text-base font-medium">
            Type de voix
          </Label>
          <Select
            value={configuration.voiceType}
            onValueChange={(value) => setConfiguration({ voiceType: value as VoiceType })}
          >
            <SelectTrigger id="voiceType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={VoiceType.MALE}>Voix masculine</SelectItem>
              <SelectItem value={VoiceType.FEMALE}>Voix féminine</SelectItem>
              <SelectItem value={VoiceType.NEUTRAL}>Voix neutre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Doodle Style */}
        <div className="space-y-3">
          <Label htmlFor="doodleStyle" className="text-base font-medium">
            Style des illustrations
          </Label>
          <Select
            value={configuration.doodleStyle}
            onValueChange={(value) => setConfiguration({ doodleStyle: value as DoodleStyle })}
          >
            <SelectTrigger id="doodleStyle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DoodleStyle.MINIMAL}>Minimal</SelectItem>
              <SelectItem value={DoodleStyle.DETAILED}>Détaillé</SelectItem>
              <SelectItem value={DoodleStyle.CARTOON}>Cartoon</SelectItem>
              <SelectItem value={DoodleStyle.SKETCH}>Sketch</SelectItem>
              <SelectItem value={DoodleStyle.PROFESSIONAL}>Professionnel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <div className="space-y-3">
          <Label htmlFor="language" className="text-base font-medium">
            Langue
          </Label>
          <Select
            value={configuration.language}
            onValueChange={(value) => setConfiguration({ language: value as Language })}
          >
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Language.FR}>Français</SelectItem>
              <SelectItem value={Language.EN}>English</SelectItem>
              <SelectItem value={Language.ES}>Español</SelectItem>
              <SelectItem value={Language.DE}>Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Scene Duration */}
        <div className="space-y-3">
          <Label htmlFor="sceneDuration" className="text-base font-medium">
            Durée par scène (secondes)
          </Label>
          <input
            id="sceneDuration"
            type="number"
            min="5"
            max="60"
            value={configuration.sceneDuration}
            onChange={(e) => setConfiguration({ sceneDuration: parseInt(e.target.value) || 10 })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Toggle Options */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="generateVoiceover" className="text-base font-medium">
                Générer la voix-off
              </Label>
              <p className="text-sm text-gray-500">
                L'IA créera automatiquement la narration audio
              </p>
            </div>
            <Switch
              id="generateVoiceover"
              checked={configuration.generateVoiceover}
              onCheckedChange={(checked) => setConfiguration({ generateVoiceover: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="generateImages" className="text-base font-medium">
                Générer les illustrations
              </Label>
              <p className="text-sm text-gray-500">
                L'IA créera automatiquement les visuels doodle
              </p>
            </div>
            <Switch
              id="generateImages"
              checked={configuration.generateImages}
              onCheckedChange={(checked) => setConfiguration({ generateImages: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoGenerateScenes" className="text-base font-medium">
                Générer les scènes automatiquement
              </Label>
              <p className="text-sm text-gray-500">
                L'IA organisera automatiquement le contenu en scènes
              </p>
            </div>
            <Switch
              id="autoGenerateScenes"
              checked={configuration.autoGenerateScenes}
              onCheckedChange={(checked) => setConfiguration({ autoGenerateScenes: checked })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={previousStep}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Générer le projet
        </Button>
      </div>
    </>
  );
};
