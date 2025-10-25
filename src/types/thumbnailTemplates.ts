import { ThumbnailLayer } from '../components/organisms/ThumbnailMaker';

export interface ThumbnailTemplate {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  layers: ThumbnailLayer[];
  preview?: string;
}

const WIDTH = 1280;
const HEIGHT = 720;

/**
 * Template YouTube Classique
 * Style classique avec titre gros et accrocheur, fond dégradé
 */
export const youtubeClassicTemplate: ThumbnailTemplate = {
  id: 'youtube-classic',
  name: 'YouTube Classique',
  description: 'Style YouTube classique avec titre imposant',
  backgroundColor: '#1a1a2e',
  layers: [
    {
      id: 'title-1',
      type: 'text',
      text: 'VOTRE TITRE ICI',
      x: WIDTH / 2,
      y: HEIGHT / 2 - 80,
      fontSize: 90,
      fontFamily: 'Impact',
      fontStyle: 'bold',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 10,
      shadowEnabled: true,
      align: 'center',
    },
    {
      id: 'subtitle-1',
      type: 'text',
      text: 'Sous-titre explicatif',
      x: WIDTH / 2,
      y: HEIGHT / 2 + 80,
      fontSize: 42,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#fbbf24',
      stroke: '#000000',
      strokeWidth: 6,
      shadowEnabled: true,
      align: 'center',
    },
  ],
};

/**
 * Template Doodle
 * Style coloré et fun, parfait pour la plateforme Doodle
 */
export const doodleTemplate: ThumbnailTemplate = {
  id: 'doodle',
  name: 'Doodle',
  description: 'Style coloré et dynamique pour Doodle',
  backgroundColor: '#4f46e5',
  layers: [
    {
      id: 'title-doodle',
      type: 'text',
      text: 'Créez avec Doodle!',
      x: WIDTH / 2,
      y: HEIGHT / 3,
      fontSize: 80,
      fontFamily: 'Comic Sans MS',
      fontStyle: 'bold',
      fill: '#fbbf24',
      stroke: '#1e293b',
      strokeWidth: 8,
      shadowEnabled: true,
      align: 'center',
    },
    {
      id: 'subtitle-doodle',
      type: 'text',
      text: 'Animations vidéo faciles',
      x: WIDTH / 2,
      y: HEIGHT / 2 + 60,
      fontSize: 48,
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 4,
      shadowEnabled: false,
      align: 'center',
    },
    {
      id: 'shape-doodle-1',
      type: 'shape',
      x: 200,
      y: 150,
      scaleX: 1,
      scaleY: 1,
      rotation: 20,
      shape_config: {
        shape: 'circle',
        width: 120,
        height: 120,
        fill: '#f43f5e',
        stroke: '#ffffff',
        strokeWidth: 6,
        opacity: 0.8,
        cornerRadius: 0,
        fillMode: 'fill',
      },
    },
    {
      id: 'shape-doodle-2',
      type: 'shape',
      x: WIDTH - 200,
      y: HEIGHT - 150,
      scaleX: 1,
      scaleY: 1,
      rotation: -15,
      shape_config: {
        shape: 'star',
        width: 100,
        height: 100,
        fill: '#fbbf24',
        stroke: '#ffffff',
        strokeWidth: 5,
        opacity: 0.9,
        cornerRadius: 0,
        fillMode: 'fill',
      },
    },
  ],
};

/**
 * Template Minimaliste
 * Design épuré et élégant
 */
export const minimalistTemplate: ThumbnailTemplate = {
  id: 'minimalist',
  name: 'Minimaliste',
  description: 'Design épuré et professionnel',
  backgroundColor: '#f8fafc',
  layers: [
    {
      id: 'title-minimal',
      type: 'text',
      text: 'Titre Simple',
      x: WIDTH / 2,
      y: HEIGHT / 2 - 50,
      fontSize: 72,
      fontFamily: 'Helvetica',
      fontStyle: 'bold',
      fill: '#0f172a',
      stroke: 'transparent',
      strokeWidth: 0,
      shadowEnabled: false,
      align: 'center',
    },
    {
      id: 'subtitle-minimal',
      type: 'text',
      text: 'Description concise',
      x: WIDTH / 2,
      y: HEIGHT / 2 + 50,
      fontSize: 36,
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#64748b',
      stroke: 'transparent',
      strokeWidth: 0,
      shadowEnabled: false,
      align: 'center',
    },
    {
      id: 'line-minimal',
      type: 'shape',
      x: WIDTH / 2,
      y: HEIGHT / 2,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      shape_config: {
        shape: 'rectangle',
        width: 400,
        height: 4,
        fill: '#4f46e5',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        cornerRadius: 2,
        fillMode: 'fill',
      },
    },
  ],
};

/**
 * Template Énergie
 * Style dynamique et énergique avec accents rouges
 */
export const energyTemplate: ThumbnailTemplate = {
  id: 'energy',
  name: 'Énergie',
  description: 'Style dynamique et énergique',
  backgroundColor: '#dc2626',
  layers: [
    {
      id: 'title-energy',
      type: 'text',
      text: 'EXPLOSIVE!',
      x: WIDTH / 2,
      y: HEIGHT / 2 - 60,
      fontSize: 96,
      fontFamily: 'Impact',
      fontStyle: 'bold',
      fill: '#ffffff',
      stroke: '#0a0a0a',
      strokeWidth: 12,
      shadowEnabled: true,
      align: 'center',
    },
    {
      id: 'subtitle-energy',
      type: 'text',
      text: 'Contenu puissant',
      x: WIDTH / 2,
      y: HEIGHT / 2 + 70,
      fontSize: 44,
      fontFamily: 'Arial Black',
      fontStyle: 'bold',
      fill: '#fbbf24',
      stroke: '#0a0a0a',
      strokeWidth: 6,
      shadowEnabled: true,
      align: 'center',
    },
  ],
};

/**
 * Template Tech
 * Style moderne et technologique avec couleurs tech
 */
export const techTemplate: ThumbnailTemplate = {
  id: 'tech',
  name: 'Tech',
  description: 'Style moderne et technologique',
  backgroundColor: '#0f172a',
  layers: [
    {
      id: 'title-tech',
      type: 'text',
      text: 'TECH NEWS',
      x: WIDTH / 2,
      y: HEIGHT / 3,
      fontSize: 84,
      fontFamily: 'Courier New',
      fontStyle: 'bold',
      fill: '#06b6d4',
      stroke: '#0369a1',
      strokeWidth: 4,
      shadowEnabled: true,
      align: 'center',
    },
    {
      id: 'subtitle-tech',
      type: 'text',
      text: 'Innovation & Technologie',
      x: WIDTH / 2,
      y: HEIGHT / 2 + 80,
      fontSize: 40,
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#e2e8f0',
      stroke: 'transparent',
      strokeWidth: 0,
      shadowEnabled: false,
      align: 'center',
    },
    {
      id: 'shape-tech-1',
      type: 'shape',
      x: 150,
      y: 150,
      scaleX: 1.5,
      scaleY: 1.5,
      rotation: 45,
      shape_config: {
        shape: 'rectangle',
        width: 80,
        height: 80,
        fill: 'transparent',
        stroke: '#06b6d4',
        strokeWidth: 4,
        opacity: 0.6,
        cornerRadius: 0,
        fillMode: 'stroke',
      },
    },
  ],
};

/**
 * Template Élégant
 * Style sophistiqué et classe
 */
export const elegantTemplate: ThumbnailTemplate = {
  id: 'elegant',
  name: 'Élégant',
  description: 'Style sophistiqué et raffiné',
  backgroundColor: '#1e1e1e',
  layers: [
    {
      id: 'title-elegant',
      type: 'text',
      text: 'Excellence',
      x: WIDTH / 2,
      y: HEIGHT / 2 - 40,
      fontSize: 76,
      fontFamily: 'Georgia',
      fontStyle: 'bold',
      fill: '#d4af37',
      stroke: 'transparent',
      strokeWidth: 0,
      shadowEnabled: true,
      align: 'center',
    },
    {
      id: 'subtitle-elegant',
      type: 'text',
      text: 'Premium Quality',
      x: WIDTH / 2,
      y: HEIGHT / 2 + 60,
      fontSize: 38,
      fontFamily: 'Georgia',
      fontStyle: 'italic',
      fill: '#e5e7eb',
      stroke: 'transparent',
      strokeWidth: 0,
      shadowEnabled: false,
      align: 'center',
    },
    {
      id: 'line-elegant-top',
      type: 'shape',
      x: WIDTH / 2,
      y: HEIGHT / 2 - 100,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      shape_config: {
        shape: 'rectangle',
        width: 300,
        height: 2,
        fill: '#d4af37',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        cornerRadius: 0,
        fillMode: 'fill',
      },
    },
    {
      id: 'line-elegant-bottom',
      type: 'shape',
      x: WIDTH / 2,
      y: HEIGHT / 2 + 120,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      shape_config: {
        shape: 'rectangle',
        width: 300,
        height: 2,
        fill: '#d4af37',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        cornerRadius: 0,
        fillMode: 'fill',
      },
    },
  ],
};

// Export all templates
export const THUMBNAIL_TEMPLATES: ThumbnailTemplate[] = [
  youtubeClassicTemplate,
  doodleTemplate,
  minimalistTemplate,
  energyTemplate,
  techTemplate,
  elegantTemplate,
];

// Helper function to get a template by ID
export const getTemplateById = (id: string): ThumbnailTemplate | undefined => {
  return THUMBNAIL_TEMPLATES.find(template => template.id === id);
};

// Helper function to apply a template (returns layers and backgroundColor)
export const applyTemplate = (template: ThumbnailTemplate, customTitle?: string) => {
  const layers = template.layers.map(layer => {
    // If custom title provided and this is the first text layer, replace the text
    if (customTitle && layer.type === 'text' && layer.id.includes('title')) {
      return { ...layer, text: customTitle };
    }
    return { ...layer };
  });

  return {
    backgroundColor: template.backgroundColor,
    layers,
  };
};
