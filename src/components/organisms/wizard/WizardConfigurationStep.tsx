import React, { useState } from 'react';
import { useWizard } from '@/app/wizard';
import { VoiceType, DoodleStyle, Language, ImagePlacementStrategy, TextImageBalance } from '@/app/wizard/types';
import { Settings, ArrowLeft, Info, ChevronDown, ChevronUp } from 'lucide-react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const WizardConfigurationStep: React.FC = () => {
  const { configuration, setConfiguration, previousStep, startGeneration } = useWizard();
  const [showAdvanced, setShowAdvanced] = useState(false);

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
            onChange={(e) => setConfiguration({ sceneDuration: parseInt(e.target.value, 10) || 10 })}
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

        {/* Advanced Settings Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-base font-medium">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Paramètres Avancés
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              {/* Image Placement Strategy */}
              <div className="space-y-3">
                <Label htmlFor="imagePlacement" className="text-base font-medium flex items-center gap-2">
                  Stratégie de placement des images
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      Détermine comment l'IA positionne les images dans chaque scène
                    </div>
                  </div>
                </Label>
                <Select
                  value={configuration.imagePlacementStrategy}
                  onValueChange={(value) => setConfiguration({ imagePlacementStrategy: value as ImagePlacementStrategy })}
                >
                  <SelectTrigger id="imagePlacement">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ImagePlacementStrategy.AUTO}>Automatique (recommandé)</SelectItem>
                    <SelectItem value={ImagePlacementStrategy.CENTERED}>Centré</SelectItem>
                    <SelectItem value={ImagePlacementStrategy.GRID}>Grille</SelectItem>
                    <SelectItem value={ImagePlacementStrategy.SCATTERED}>Dispersé</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {configuration.imagePlacementStrategy === ImagePlacementStrategy.AUTO && "L'IA choisit automatiquement le meilleur placement selon le contenu"}
                  {configuration.imagePlacementStrategy === ImagePlacementStrategy.CENTERED && "Images centrées pour un impact maximum"}
                  {configuration.imagePlacementStrategy === ImagePlacementStrategy.GRID && "Disposition en grille pour la clarté"}
                  {configuration.imagePlacementStrategy === ImagePlacementStrategy.SCATTERED && "Disposition naturelle et dynamique"}
                </p>
              </div>

              {/* Text/Image Balance */}
              <div className="space-y-3">
                <Label htmlFor="textImageBalance" className="text-base font-medium flex items-center gap-2">
                  Équilibre Texte/Image
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      Contrôle la proportion de texte vs images dans les scènes
                    </div>
                  </div>
                </Label>
                <Select
                  value={configuration.textImageBalance}
                  onValueChange={(value) => setConfiguration({ textImageBalance: value as TextImageBalance })}
                >
                  <SelectTrigger id="textImageBalance">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TextImageBalance.AUTO}>Automatique</SelectItem>
                    <SelectItem value={TextImageBalance.TEXT_HEAVY}>Priorité texte (70/30)</SelectItem>
                    <SelectItem value={TextImageBalance.BALANCED}>Équilibré (50/50)</SelectItem>
                    <SelectItem value={TextImageBalance.IMAGE_HEAVY}>Priorité images (30/70)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Images per Scene */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Nombre d'images par scène</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minImages" className="text-sm">Minimum</Label>
                    <input
                      id="minImages"
                      type="number"
                      min="0"
                      max="10"
                      value={configuration.minImagesPerScene}
                      onChange={(e) => setConfiguration({ minImagesPerScene: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxImages" className="text-sm">Maximum</Label>
                    <input
                      id="maxImages"
                      type="number"
                      min="1"
                      max="10"
                      value={configuration.maxImagesPerScene}
                      onChange={(e) => setConfiguration({ maxImagesPerScene: parseInt(e.target.value, 10) || 1 })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  L'IA ajustera le nombre exact selon la complexité du contenu
                </p>
              </div>

              {/* Image Size */}
              <div className="space-y-3">
                <Label htmlFor="imageSize" className="text-base font-medium">
                  Taille des images
                </Label>
                <Select
                  value={configuration.imageSize}
                  onValueChange={(value) => setConfiguration({ imageSize: value as 'small' | 'medium' | 'large' })}
                >
                  <SelectTrigger id="imageSize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite (400x300)</SelectItem>
                    <SelectItem value="medium">Moyenne (600x450)</SelectItem>
                    <SelectItem value="large">Grande (800x600)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Use Text Layers */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="useTextLayers" className="text-base font-medium">
                    Utiliser des calques de texte
                  </Label>
                  <p className="text-sm text-gray-500">
                    Ajoute du texte superposé aux images pour renforcer les messages clés
                  </p>
                </div>
                <Switch
                  id="useTextLayers"
                  checked={configuration.useTextLayers}
                  onCheckedChange={(checked) => setConfiguration({ useTextLayers: checked })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* AI Decision Info Panel */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Comment l'IA prend ses décisions
          </h4>
          <ul className="text-sm text-purple-800 space-y-1.5">
            <li>• <strong>Analyse du contenu:</strong> L'IA analyse le ton, la structure et les mots-clés de votre scénario</li>
            <li>• <strong>Nombre d'images:</strong> Déterminé par la densité d'information et la durée de la scène</li>
            <li>• <strong>Positionnement:</strong> Basé sur la hiérarchie visuelle et le flux de lecture naturel</li>
            <li>• <strong>Choix texte/image:</strong> Les concepts abstraits utilisent plus de texte, les concepts concrets plus d'images</li>
            <li>• <strong>Style:</strong> Adapté au contexte (professionnel, éducatif, créatif, etc.)</li>
          </ul>
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
