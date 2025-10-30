import httpClient from '@/services/api/httpClient';
import { API_ENDPOINTS } from '@/config/api';
import {
  GeneratedScript,
  ScriptScene,
  GeneratedAsset,
  WizardConfiguration,
} from '../types';
import { Scene } from '../../scenes/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service API pour la génération AI via le wizard
 * Utilise les endpoints AI du backend
 */
class AIService {
  /**
   * Générer un script à partir d'un prompt
   */
  async generateScript(
    prompt: string,
    config: WizardConfiguration
  ): Promise<GeneratedScript> {
    try {
      const response = await httpClient.post<{
        success: boolean;
        data: {
          script: string;
          scenes: Array<{
            title: string;
            content: string;
            duration: number;
          }>;
          estimatedDuration: number;
          wordCount: number;
          provider: string;
        };
      }>(API_ENDPOINTS.ai.generateScript, {
        topic: prompt,
        duration: config.sceneDuration * 5, // Estimation basée sur la durée par scène
        tone: 'professional',
        targetAudience: 'beginners',
      });

      // Transformer la réponse API au format attendu
      const apiData = response.data.data;
      const scenes: ScriptScene[] = apiData.scenes.map((scene) => ({
        id: uuidv4(),
        title: scene.title,
        content: scene.content,
        duration: config.sceneDuration,
        suggestedVisuals: this.generateSuggestedVisuals(scene.title),
        voiceoverText: scene.content,
        aiDecisions: {
          imageCount: Math.floor(
            Math.random() * (config.maxImagesPerScene - config.minImagesPerScene + 1)
          ) + config.minImagesPerScene,
          imagePositions: [],
          textLayers: [],
          styleChoices: {
            colorScheme: this.getColorSchemeForStyle(config.doodleStyle),
            fontChoice: this.getFontForStyle(config.doodleStyle),
            layoutReason: 'Disposition optimale calculée par l\'IA',
          },
        },
      }));

      return {
        id: uuidv4(),
        fullScript: apiData.script,
        scenes,
        estimatedDuration: apiData.estimatedDuration,
      };
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Erreur lors de la génération du script');
    }
  }

  /**
   * Générer des images doodle pour les scènes
   */
  async generateDoodleImages(
    script: GeneratedScript,
    config: WizardConfiguration
  ): Promise<GeneratedAsset[]> {
    const assets: GeneratedAsset[] = [];

    try {
      for (const scene of script.scenes) {
        const imageCount =
          scene.aiDecisions?.imageCount ||
          Math.floor(
            Math.random() * (config.maxImagesPerScene - config.minImagesPerScene + 1)
          ) + config.minImagesPerScene;

        for (let i = 0; i < imageCount; i++) {
          try {
            // Générer une image via l'API AI
            const response = await httpClient.post<{
              success: boolean;
              data: {
                enhancedPrompt: string;
                imageUrl?: string;
                provider: string;
              };
            }>(API_ENDPOINTS.ai.generateImagePrompt, {
              prompt: `${scene.title} - illustration ${i + 1}`,
              style: config.doodleStyle,
            });

            const imageUrl =
              response.data.data.imageUrl ||
              this.generatePlaceholderUrl(scene.title, i, config);

            assets.push({
              id: uuidv4(),
              type: 'doodle',
              url: imageUrl,
              sceneId: scene.id,
              description: `Doodle image ${i + 1} pour ${scene.title}`,
              position: {
                x: 100 + i * 150,
                y: 100 + Math.random() * 200,
              },
              size: this.getImageSize(config.imageSize),
              reasoning: response.data.data.enhancedPrompt || 'Image générée par IA',
            });
          } catch (error) {
            console.warn(`Failed to generate image ${i} for scene ${scene.id}:`, error);
            // Fallback vers une image placeholder
            assets.push({
              id: uuidv4(),
              type: 'doodle',
              url: this.generatePlaceholderUrl(scene.title, i, config),
              sceneId: scene.id,
              description: `Doodle image ${i + 1} pour ${scene.title}`,
              position: { x: 100 + i * 150, y: 100 },
              size: this.getImageSize(config.imageSize),
              reasoning: 'Image placeholder',
            });
          }
        }
      }

      return assets;
    } catch (error) {
      console.error('Error generating doodle images:', error);
      throw new Error('Erreur lors de la génération des images');
    }
  }

  /**
   * Générer des voix-off pour les scènes
   */
  async generateVoiceover(
    script: GeneratedScript,
    config: WizardConfiguration
  ): Promise<GeneratedAsset[]> {
    const assets: GeneratedAsset[] = [];

    try {
      // Récupérer la liste des voix disponibles
      const voicesResponse = await httpClient.get<{
        success: boolean;
        data: {
          voices: Array<{
            id: string;
            name: string;
            gender: string;
            language: string;
          }>;
        };
      }>(API_ENDPOINTS.ai.voices);

      const voices = voicesResponse.data.data.voices;
      const selectedVoice =
        voices.find((v) => v.language === 'fr') || voices[0];

      if (!selectedVoice) {
        throw new Error('Aucune voix disponible');
      }

      for (const scene of script.scenes) {
        try {
          const response = await httpClient.post<{
            success: boolean;
            data: {
              audioUrl: string;
              duration: number;
              provider: string;
              characterCount: number;
            };
          }>(API_ENDPOINTS.ai.generateVoice, {
            text: scene.voiceoverText,
            voiceId: selectedVoice.id,
            speed: 1.0,
            stability: 0.5,
            language: 'fr',
          });

          assets.push({
            id: uuidv4(),
            type: 'audio',
            url: response.data.data.audioUrl,
            sceneId: scene.id,
            description: `Voix-off pour ${scene.title}`,
          });
        } catch (error) {
          console.warn(`Failed to generate voice for scene ${scene.id}:`, error);
          // Continuer avec les autres scènes
        }
      }

      return assets;
    } catch (error) {
      console.error('Error generating voiceover:', error);
      throw new Error('Erreur lors de la génération des voix-off');
    }
  }

  /**
   * Générer un projet complet (script + images + voix)
   */
  async generateFullProject(
    prompt: string,
    config: WizardConfiguration,
    onProgress?: (step: string, progress: number) => void
  ): Promise<{ script: GeneratedScript; assets: GeneratedAsset[]; scenes: Scene[] }> {
    try {
      // Étape 1: Générer le script
      onProgress?.('Génération du script...', 25);
      const script = await this.generateScript(prompt, config);

      // Étape 2: Générer les images
      onProgress?.('Génération des images doodle...', 50);
      const doodleAssets = config.generateImages
        ? await this.generateDoodleImages(script, config)
        : [];

      // Étape 3: Générer les voix-off
      onProgress?.('Génération des voix-off...', 75);
      const voiceoverAssets = config.generateVoiceover
        ? await this.generateVoiceover(script, config)
        : [];

      const allAssets = [...doodleAssets, ...voiceoverAssets];

      // Étape 4: Assembler les scènes
      onProgress?.('Assemblage des scènes...', 90);
      const scenes = this.generateScenesFromAssets(script, allAssets, config);

      onProgress?.('Terminé!', 100);

      return { script, assets: allAssets, scenes };
    } catch (error) {
      console.error('Error generating full project:', error);
      throw error;
    }
  }

  /**
   * Convertir le script et les assets en objets Scene
   */
  private generateScenesFromAssets(
    script: GeneratedScript,
    assets: GeneratedAsset[],
    config: WizardConfiguration
  ): Scene[] {
    return script.scenes.map((scriptScene) => {
      const sceneAssets = assets.filter((asset) => asset.sceneId === scriptScene.id);
      const doodleImages = sceneAssets.filter((asset) => asset.type === 'doodle');
      const audioAsset = sceneAssets.find((asset) => asset.type === 'audio');

      const layers = doodleImages.map((doodle, idx) => ({
        id: uuidv4(),
        name: `Doodle ${idx + 1}`,
        type: 'IMAGE' as any,
        mode: 'DRAW' as any,
        position: doodle.position || { x: 100 + idx * 150, y: 100 },
        width: doodle.size?.width || 1920,
        height: doodle.size?.height || 1080,
        z_index: idx,
        scale: 1,
        opacity: 1,
        image_path: doodle.url,
        animation_type: 'draw',
        animation_speed: 1,
        hand_type: 'right',
      }));

      return {
        id: uuidv4(),
        title: scriptScene.title,
        content: scriptScene.content,
        duration: scriptScene.duration,
        animation: 'FADE' as any,
        backgroundImage: null,
        sceneImage: null,
        layers,
        cameras: [],
        sceneCameras: [],
        multiTimeline: {},
        audio: {},
        sceneAudio: audioAsset
          ? {
              fileId: audioAsset.id,
              fileName: `voiceover_${scriptScene.title}.mp3`,
              fileUrl: audioAsset.url,
              volume: 1,
              duration: scriptScene.duration,
            }
          : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  }

  // Helper methods
  private generateSuggestedVisuals(sceneTitle: string): string[] {
    const baseVisuals = [
      'Personnage doodle animé',
      'Icônes et symboles',
      'Flèches et connecteurs',
    ];

    if (
      sceneTitle.toLowerCase().includes('introduction') ||
      sceneTitle.toLowerCase().includes('bienvenue')
    ) {
      return [...baseVisuals, 'Logo', 'Titre animé'];
    } else if (
      sceneTitle.toLowerCase().includes('conclusion') ||
      sceneTitle.toLowerCase().includes('résumé')
    ) {
      return [...baseVisuals, 'Points clés', 'Call-to-action'];
    } else {
      return [...baseVisuals, 'Graphiques', 'Images illustratives'];
    }
  }

  private getColorSchemeForStyle(style: string): string {
    const schemes: Record<string, string> = {
      minimal: 'Monochrome avec accents subtils',
      detailed: 'Palette riche et variée',
      cartoon: 'Couleurs vives et saturées',
      sketch: 'Tons naturels et crayonnés',
      professional: 'Palette corporate sobre',
    };
    return schemes[style] || schemes.professional;
  }

  private getFontForStyle(style: string): string {
    const fonts: Record<string, string> = {
      minimal: 'Helvetica Neue - clarté et modernité',
      detailed: 'Georgia - élégance et lisibilité',
      cartoon: 'Comic Sans MS - ludique et accessible',
      sketch: 'Brush Script - aspect manuscrit',
      professional: 'Arial - professionnel et neutre',
    };
    return fonts[style] || fonts.professional;
  }

  private getImageSize(size: 'small' | 'medium' | 'large'): {
    width: number;
    height: number;
  } {
    const sizes = {
      small: { width: 400, height: 300 },
      medium: { width: 600, height: 450 },
      large: { width: 800, height: 600 },
    };
    return sizes[size];
  }

  private generatePlaceholderUrl(
    title: string,
    index: number,
    config: WizardConfiguration
  ): string {
    const size = this.getImageSize(config.imageSize);
    const colors = ['4A90E2', '50C878', 'F39C12', 'E74C3C', '9B59B6'];
    const color = colors[index % colors.length];
    return `https://via.placeholder.com/${size.width}x${size.height}/${color}/FFFFFF?text=${encodeURIComponent(
      title.substring(0, 15)
    )}`;
  }
}

export const aiService = new AIService();

// Export des fonctions pour compatibilité avec le code existant
export const generateScript = (prompt: string, config: WizardConfiguration) =>
  aiService.generateScript(prompt, config);

export const generateDoodleImages = (
  script: GeneratedScript,
  config: WizardConfiguration
) => aiService.generateDoodleImages(script, config);

export const generateVoiceover = (
  script: GeneratedScript,
  config: WizardConfiguration
) => aiService.generateVoiceover(script, config);

export const generateFullProject = (
  prompt: string,
  config: WizardConfiguration,
  onProgress?: (step: string, progress: number) => void
) => aiService.generateFullProject(prompt, config, onProgress);
