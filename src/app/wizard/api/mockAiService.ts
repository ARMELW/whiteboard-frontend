import { v4 as uuidv4 } from 'uuid';
import { 
  GeneratedScript, 
  ScriptScene, 
  GeneratedAsset, 
  WizardConfiguration,
  DoodleStyle,
  VoiceType 
} from '../types';
import { Scene, LayerType, LayerMode, SceneAnimationType } from '../../scenes/types';

// Mock delay to simulate API call
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock templates for different topics
const topicTemplates: Record<string, string[]> = {
  education: [
    "Introduction: Bienvenue dans cette leçon",
    "Concept principal: Comprendre les bases",
    "Exemples pratiques: Mise en application",
    "Exercices: À vous de jouer",
    "Conclusion: Résumé et prochaines étapes"
  ],
  marketing: [
    "Hook: Captez l'attention",
    "Problème: Identifiez le besoin",
    "Solution: Notre offre",
    "Bénéfices: Ce que vous gagnez",
    "Appel à l'action: Passez à l'action maintenant"
  ],
  tutorial: [
    "Introduction: Vue d'ensemble",
    "Préparation: Ce dont vous avez besoin",
    "Étape 1: Commençons",
    "Étape 2: Continuons",
    "Résultat final: Félicitations"
  ],
  presentation: [
    "Titre: Bienvenue",
    "Contexte: Pourquoi c'est important",
    "Points clés: Les essentiels",
    "Démonstration: Voyons cela en action",
    "Questions: Vos interrogations"
  ]
};

// Generate a script based on prompt
export const generateScript = async (
  prompt: string,
  config: WizardConfiguration
): Promise<GeneratedScript> => {
  await mockDelay(2000); // Simulate API processing

  // Detect topic from prompt
  let template = topicTemplates.tutorial;
  if (prompt.toLowerCase().includes('éducation') || prompt.toLowerCase().includes('leçon')) {
    template = topicTemplates.education;
  } else if (prompt.toLowerCase().includes('marketing') || prompt.toLowerCase().includes('vente')) {
    template = topicTemplates.marketing;
  } else if (prompt.toLowerCase().includes('présentation')) {
    template = topicTemplates.presentation;
  }

  const scenes: ScriptScene[] = template.map((sceneTitle, index) => {
    // AI Decision Making: Determine optimal visual strategy
    const contentComplexity = prompt.length / template.length;
    const isTextHeavy = config.textImageBalance === 'text_heavy' || 
                        (config.textImageBalance === 'auto' && contentComplexity > 50);
    
    // Determine image count based on configuration and content
    let imageCount = Math.floor(Math.random() * (config.maxImagesPerScene - config.minImagesPerScene + 1)) + config.minImagesPerScene;
    
    // Generate intelligent positioning based on strategy
    const imagePositions = generateImagePositions(imageCount, config.imagePlacementStrategy);
    const textLayers = config.useTextLayers ? generateTextLayers(sceneTitle, imageCount) : [];
    
    return {
      id: uuidv4(),
      title: sceneTitle,
      content: `Contenu généré automatiquement pour "${prompt}". ${sceneTitle}. Ceci est un exemple de contenu qui serait généré par l'IA en fonction de votre demande.`,
      duration: config.sceneDuration,
      suggestedVisuals: generateSuggestedVisuals(sceneTitle, config.doodleStyle),
      voiceoverText: `Texte de voix-off pour ${sceneTitle}. L'IA génère automatiquement un script engageant basé sur votre prompt.`,
      aiDecisions: {
        imageCount,
        imagePositions,
        textLayers,
        styleChoices: {
          colorScheme: getColorSchemeForStyle(config.doodleStyle),
          fontChoice: getFontForStyle(config.doodleStyle),
          layoutReason: getLayoutReason(config.imagePlacementStrategy, imageCount),
        },
      },
    };
  });

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  return {
    id: uuidv4(),
    fullScript: `Script complet généré pour: "${prompt}"\n\n${scenes.map(s => s.voiceoverText).join('\n\n')}`,
    scenes,
    estimatedDuration: totalDuration,
  };
};

// Helper: Generate intelligent image positions
const generateImagePositions = (count: number, strategy: string): Array<{ x: number; y: number; reason: string }> => {
  const positions: Array<{ x: number; y: number; reason: string }> = [];
  const canvasWidth = 1920;
  const canvasHeight = 1080;
  
  switch (strategy) {
    case 'centered':
      for (let i = 0; i < count; i++) {
        positions.push({
          x: canvasWidth / 2,
          y: canvasHeight / 2 + (i - count / 2) * 100,
          reason: 'Centré pour impact maximum',
        });
      }
      break;
    case 'grid':
      const cols = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / cols);
      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        positions.push({
          x: (canvasWidth / (cols + 1)) * (col + 1),
          y: (canvasHeight / (rows + 1)) * (row + 1),
          reason: 'Grille pour organisation claire',
        });
      }
      break;
    case 'scattered':
      for (let i = 0; i < count; i++) {
        positions.push({
          x: 300 + Math.random() * (canvasWidth - 600),
          y: 200 + Math.random() * (canvasHeight - 400),
          reason: 'Disposition dynamique et naturelle',
        });
      }
      break;
    default: // auto
      // Smart auto-placement based on count
      if (count <= 2) {
        positions.push(
          { x: canvasWidth * 0.3, y: canvasHeight * 0.5, reason: 'Placement gauche pour séquence naturelle' },
          { x: canvasWidth * 0.7, y: canvasHeight * 0.5, reason: 'Placement droit pour équilibre' }
        );
      } else {
        const angleStep = (2 * Math.PI) / count;
        const radius = 300;
        for (let i = 0; i < count; i++) {
          positions.push({
            x: canvasWidth / 2 + Math.cos(angleStep * i) * radius,
            y: canvasHeight / 2 + Math.sin(angleStep * i) * radius,
            reason: 'Disposition circulaire pour harmonie visuelle',
          });
        }
      }
  }
  
  return positions.slice(0, count);
};

// Helper: Generate text layers
const generateTextLayers = (title: string, imageCount: number): Array<{ content: string; position: { x: number; y: number }; reason: string }> => {
  const layers = [];
  const keywords = title.split(':')[0].split(' ').filter(w => w.length > 3);
  
  if (keywords.length > 0) {
    layers.push({
      content: keywords[0],
      position: { x: 960, y: 150 },
      reason: 'Mot-clé principal en haut pour hiérarchie visuelle',
    });
  }
  
  if (imageCount > 2 && keywords.length > 1) {
    layers.push({
      content: keywords.slice(1, 3).join(' '),
      position: { x: 960, y: 900 },
      reason: 'Texte de support en bas pour contexte',
    });
  }
  
  return layers;
};

// Helper: Get color scheme for style
const getColorSchemeForStyle = (style: string): string => {
  const schemes: Record<string, string> = {
    minimal: 'Monochrome avec accents subtils',
    detailed: 'Palette riche et variée',
    cartoon: 'Couleurs vives et saturées',
    sketch: 'Tons naturels et crayonnés',
    professional: 'Palette corporate sobre',
  };
  return schemes[style] || schemes.professional;
};

// Helper: Get font for style
const getFontForStyle = (style: string): string => {
  const fonts: Record<string, string> = {
    minimal: 'Helvetica Neue - clarté et modernité',
    detailed: 'Georgia - élégance et lisibilité',
    cartoon: 'Comic Sans MS - ludique et accessible',
    sketch: 'Brush Script - aspect manuscrit',
    professional: 'Arial - professionnel et neutre',
  };
  return fonts[style] || fonts.professional;
};

// Helper: Get layout reason
const getLayoutReason = (strategy: string, imageCount: number): string => {
  const reasons: Record<string, string> = {
    centered: 'Mise en valeur centrale pour capter l\'attention immédiatement',
    grid: 'Organisation structurée facilitant la comparaison et la compréhension',
    scattered: 'Aspect naturel et dynamique pour maintenir l\'engagement',
    auto: `Disposition optimale calculée pour ${imageCount} élément(s) selon principes de design`,
  };
  return reasons[strategy] || reasons.auto;
};

// Generate suggested visuals based on scene content
const generateSuggestedVisuals = (sceneTitle: string, style: DoodleStyle): string[] => {
  const baseVisuals = [
    'Personnage doodle animé',
    'Icônes et symboles',
    'Flèches et connecteurs',
  ];

  if (sceneTitle.toLowerCase().includes('introduction') || sceneTitle.toLowerCase().includes('bienvenue')) {
    return [...baseVisuals, 'Logo', 'Titre animé'];
  } else if (sceneTitle.toLowerCase().includes('conclusion') || sceneTitle.toLowerCase().includes('résumé')) {
    return [...baseVisuals, 'Points clés', 'Call-to-action'];
  } else {
    return [...baseVisuals, 'Graphiques', 'Images illustratives'];
  }
};

// Generate doodle images for scenes
export const generateDoodleImages = async (
  script: GeneratedScript,
  config: WizardConfiguration
): Promise<GeneratedAsset[]> => {
  await mockDelay(3000); // Simulate AI image generation

  const assets: GeneratedAsset[] = [];
  const imageSizes = {
    small: { width: 400, height: 300 },
    medium: { width: 600, height: 450 },
    large: { width: 800, height: 600 },
  };
  const size = imageSizes[config.imageSize];

  for (const scene of script.scenes) {
    // Use AI decisions from scene if available
    const imageCount = scene.aiDecisions?.imageCount || Math.floor(Math.random() * 2) + 2;
    const positions = scene.aiDecisions?.imagePositions || [];
    
    for (let i = 0; i < imageCount; i++) {
      const position = positions[i] || { x: 100 + i * 150, y: 100 };
      const reasoning = positions[i]?.reason || 'Placement automatique selon contenu';
      
      assets.push({
        id: uuidv4(),
        type: 'doodle',
        url: generateMockDoodleUrl(scene.title, i, config.doodleStyle, size),
        sceneId: scene.id,
        description: `Doodle image ${i + 1} pour ${scene.title}`,
        position: { x: position.x, y: position.y },
        size,
        reasoning,
      });
    }
  }

  return assets;
};

// Generate mock doodle URL (in production, this would be actual AI-generated images)
const generateMockDoodleUrl = (title: string, index: number, style: DoodleStyle, size: { width: number; height: number }): string => {
  // For now, return placeholder images
  // In production, this would return URLs to AI-generated doodle images
  const colors = ['4A90E2', '50C878', 'F39C12', 'E74C3C', '9B59B6'];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/${size.width}x${size.height}/${color}/FFFFFF?text=${encodeURIComponent(title.substring(0, 15))}`;
};

// Generate voiceover audio
export const generateVoiceover = async (
  script: GeneratedScript,
  config: WizardConfiguration
): Promise<GeneratedAsset[]> => {
  await mockDelay(2500); // Simulate AI voice generation

  const assets: GeneratedAsset[] = script.scenes.map(scene => ({
    id: uuidv4(),
    type: 'audio',
    url: generateMockAudioUrl(scene.id, config.voiceType),
    sceneId: scene.id,
    description: `Voix-off pour ${scene.title}`,
  }));

  return assets;
};

// Generate mock audio URL
const generateMockAudioUrl = (sceneId: string, voiceType: VoiceType): string => {
  // In production, this would return URLs to AI-generated voice files
  return `https://example.com/audio/voiceover_${sceneId}_${voiceType}.mp3`;
};

// Convert generated script and assets into Scene objects
export const generateScenesFromWizard = async (
  script: GeneratedScript,
  assets: GeneratedAsset[],
  config: WizardConfiguration
): Promise<Scene[]> => {
  await mockDelay(1500); // Simulate scene assembly

  const scenes: Scene[] = script.scenes.map((scriptScene, index) => {
    const sceneAssets = assets.filter(asset => asset.sceneId === scriptScene.id);
    const doodleImages = sceneAssets.filter(asset => asset.type === 'doodle');
    const audioAsset = sceneAssets.find(asset => asset.type === 'audio');

    // Create layers from doodle images
    const layers = doodleImages.map((doodle, idx) => ({
      id: uuidv4(),
      name: `Doodle ${idx + 1}`,
      type: LayerType.IMAGE,
      mode: LayerMode.DRAW,
      position: {
        x: 100 + (idx * 150),
        y: 100 + (Math.random() * 200),
      },
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

    // Create scene
    const scene: Scene = {
      id: uuidv4(),
      title: scriptScene.title,
      content: scriptScene.content,
      duration: scriptScene.duration,
      animation: SceneAnimationType.FADE,
      backgroundImage: null,
      sceneImage: null,
      layers,
      cameras: [],
      sceneCameras: [],
      multiTimeline: {},
      audio: {},
      sceneAudio: audioAsset ? {
        fileId: audioAsset.id,
        fileName: `voiceover_${index + 1}.mp3`,
        fileUrl: audioAsset.url,
        volume: 1,
        duration: scriptScene.duration,
      } : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return scene;
  });

  return scenes;
};

// Main function to generate everything
export const generateFullProject = async (
  prompt: string,
  config: WizardConfiguration,
  onProgress?: (step: string, progress: number) => void
): Promise<{ script: GeneratedScript; assets: GeneratedAsset[]; scenes: Scene[] }> => {
  try {
    // Step 1: Generate script
    onProgress?.('Génération du script...', 25);
    const script = await generateScript(prompt, config);

    // Step 2: Generate images
    onProgress?.('Génération des images doodle...', 50);
    const doodleAssets = config.generateImages 
      ? await generateDoodleImages(script, config)
      : [];

    // Step 3: Generate voiceover
    onProgress?.('Génération des voix-off...', 75);
    const voiceoverAssets = config.generateVoiceover
      ? await generateVoiceover(script, config)
      : [];

    const allAssets = [...doodleAssets, ...voiceoverAssets];

    // Step 4: Assemble scenes
    onProgress?.('Assemblage des scènes...', 90);
    const scenes = await generateScenesFromWizard(script, allAssets, config);

    onProgress?.('Terminé!', 100);

    return { script, assets: allAssets, scenes };
  } catch (error) {
    throw new Error('Erreur lors de la génération: ' + (error as Error).message);
  }
};
