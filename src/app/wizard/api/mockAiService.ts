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

  const scenes: ScriptScene[] = template.map((sceneTitle, index) => ({
    id: uuidv4(),
    title: sceneTitle,
    content: `Contenu généré automatiquement pour "${prompt}". ${sceneTitle}. Ceci est un exemple de contenu qui serait généré par l'IA en fonction de votre demande.`,
    duration: config.sceneDuration,
    suggestedVisuals: generateSuggestedVisuals(sceneTitle, config.doodleStyle),
    voiceoverText: `Texte de voix-off pour ${sceneTitle}. L'IA génère automatiquement un script engageant basé sur votre prompt.`,
  }));

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  return {
    id: uuidv4(),
    fullScript: `Script complet généré pour: "${prompt}"\n\n${scenes.map(s => s.voiceoverText).join('\n\n')}`,
    scenes,
    estimatedDuration: totalDuration,
  };
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

  for (const scene of script.scenes) {
    // Generate 2-3 doodle images per scene
    const imageCount = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < imageCount; i++) {
      assets.push({
        id: uuidv4(),
        type: 'doodle',
        url: generateMockDoodleUrl(scene.title, i, config.doodleStyle),
        sceneId: scene.id,
        description: `Doodle image ${i + 1} pour ${scene.title}`,
      });
    }
  }

  return assets;
};

// Generate mock doodle URL (in production, this would be actual AI-generated images)
const generateMockDoodleUrl = (title: string, index: number, style: DoodleStyle): string => {
  // For now, return placeholder images
  // In production, this would return URLs to AI-generated doodle images
  const colors = ['4A90E2', '50C878', 'F39C12', 'E74C3C', '9B59B6'];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/400x300/${color}/FFFFFF?text=${encodeURIComponent(title.substring(0, 20))}`;
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
