import { STORAGE_KEYS } from '@/config/constants';
import type { Scene } from '@/app/scenes/types';

/**
 * Migrate existing scenes in localStorage to include project_id
 * This is needed for backwards compatibility with scenes created before the project hierarchy
 */
export function migrateScenesToProjectHierarchy(): void {
  try {
    const scenesJson = localStorage.getItem(STORAGE_KEYS.SCENES);
    if (!scenesJson) return;

    const scenes = JSON.parse(scenesJson) as Scene[];
    let needsMigration = false;

    const migratedScenes = scenes.map(scene => {
      if (!scene.project_id) {
        needsMigration = true;
        return {
          ...scene,
          project_id: 'default-project', // Assign all old scenes to a default project
        };
      }
      return scene;
    });

    if (needsMigration) {
      localStorage.setItem(STORAGE_KEYS.SCENES, JSON.stringify(migratedScenes));
      console.log('[Migration] Migrated', scenes.length, 'scenes to include project_id');
    }
  } catch (error) {
    console.error('[Migration] Failed to migrate scenes:', error);
  }
}

/**
 * Get or create a default project for backwards compatibility
 */
export function ensureDefaultProject(): string {
  const defaultProjectId = 'default-project';
  
  // Check if we need to create mock projects in localStorage
  try {
    const projectsJson = localStorage.getItem('whiteboard-projects');
    if (!projectsJson) {
      // Create a default project for existing scenes
      const defaultProject = {
        id: defaultProjectId,
        user_id: 'user_123',
        channel_id: 'chn_456', // Assign to first mock channel
        title: 'Projet par défaut',
        description: 'Projet créé automatiquement pour les scènes existantes',
        thumbnail_url: null,
        resolution: '1080p',
        aspect_ratio: '16:9',
        fps: 30,
        duration: 0,
        status: 'in_progress',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      };
      
      localStorage.setItem('whiteboard-projects', JSON.stringify([defaultProject]));
      console.log('[Migration] Created default project for existing scenes');
    }
  } catch (error) {
    console.error('[Migration] Failed to create default project:', error);
  }
  
  return defaultProjectId;
}
