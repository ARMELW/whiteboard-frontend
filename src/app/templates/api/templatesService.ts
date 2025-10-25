import BaseService from '../../../services/api/baseService';
import API_ENDPOINTS from '../../../config/api';
import { STORAGE_KEYS } from '../../../config/constants';
import { 
  Template, 
  TemplatePayload, 
  TemplateFilter, 
  TemplateMetadata,
  TemplateExportFormat,
  TemplateImportValidation,
  TemplateComplexity
} from '../types';
import { Scene } from '../../scenes/types';

const CURRENT_TEMPLATE_VERSION = '1.0.0';

class TemplatesService extends BaseService<Template> {
  constructor() {
    super(STORAGE_KEYS.TEMPLATES, API_ENDPOINTS.templates);
  }

  async create(payload: TemplatePayload): Promise<Template> {
    const defaultTemplate: Partial<Template> = {
      id: `template-${Date.now()}`,
      name: 'Nouveau Template',
      description: 'Description du template',
      type: payload.type || 'other',
      style: payload.style || 'minimal',
      tags: payload.tags || [],
      thumbnail: payload.thumbnail || null,
      previewAnimation: payload.previewAnimation || null,
      metadata: payload.metadata || {
        layerCount: 0,
        cameraCount: 0,
        hasAudio: false,
        hasBackground: false,
        complexity: TemplateComplexity.BEGINNER,
      },
      rating: payload.rating || { average: 0, count: 0 },
      popularity: payload.popularity || 0,
      sceneData: payload.sceneData || {} as Scene,
      version: CURRENT_TEMPLATE_VERSION,
      ...payload,
    };

    return super.create(defaultTemplate);
  }

  async createFromScene(scene: Scene, templateData: Partial<TemplatePayload>): Promise<Template> {
    const metadata: TemplateMetadata = {
      layerCount: scene.layers?.length || 0,
      cameraCount: scene.sceneCameras?.length || 0,
      hasAudio: !!scene.sceneAudio,
      hasBackground: !!scene.backgroundImage,
      complexity: this.calculateComplexity(scene),
      estimatedDuration: scene.duration,
    };

    const templatePayload: TemplatePayload = {
      name: templateData.name || `Template - ${scene.title}`,
      description: templateData.description || scene.content,
      type: templateData.type || 'other',
      style: templateData.style || 'minimal',
      tags: templateData.tags || [],
      thumbnail: templateData.thumbnail || scene.sceneImage || null,
      metadata,
      sceneData: scene,
      version: CURRENT_TEMPLATE_VERSION,
    };

    return this.create(templatePayload);
  }

  async filter(filters: TemplateFilter): Promise<Template[]> {
    await this.delay();
    const result = await this.list({ page: 1, limit: 1000 });
    let filtered = result.data;

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.style) {
      filtered = filtered.filter(t => t.style === filters.style);
    }

    if (filters.complexity) {
      filtered = filtered.filter(t => t.metadata.complexity === filters.complexity);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(t => 
        filters.tags!.some(tag => t.tags.includes(tag))
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter(t => 
        t.rating && t.rating.average >= filters.minRating!
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.sortByPopularity) {
      filtered = filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return filtered;
  }

  async exportTemplate(id: string): Promise<string> {
    await this.delay();
    const template = await this.detail(id);
    
    const exportData: TemplateExportFormat = {
      version: CURRENT_TEMPLATE_VERSION,
      template,
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(exportData, null, 2);
  }

  async validateTemplate(jsonString: string): Promise<TemplateImportValidation> {
    try {
      const data = JSON.parse(jsonString) as TemplateExportFormat;
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!data.template) {
        errors.push('Template data is missing');
        return { isValid: false, errors, warnings, needsMigration: false };
      }

      if (!data.version) {
        warnings.push('Template version is missing, assuming legacy format');
      }

      const needsMigration = data.version !== CURRENT_TEMPLATE_VERSION;
      if (needsMigration) {
        warnings.push(`Template version ${data.version} will be migrated to ${CURRENT_TEMPLATE_VERSION}`);
      }

      if (!data.template.sceneData) {
        errors.push('Scene data is required');
      }

      if (!data.template.name || !data.template.type) {
        errors.push('Template name and type are required');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        needsMigration,
        sourceVersion: data.version,
        targetVersion: CURRENT_TEMPLATE_VERSION,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Invalid JSON format: ' + (error instanceof Error ? error.message : 'Unknown error')],
        warnings: [],
        needsMigration: false,
      };
    }
  }

  async importTemplate(jsonString: string): Promise<Template> {
    await this.delay();
    
    const validation = await this.validateTemplate(jsonString);
    if (!validation.isValid) {
      throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
    }

    const data = JSON.parse(jsonString) as TemplateExportFormat;
    let templateData = data.template;

    if (validation.needsMigration) {
      templateData = await this.migrateTemplate(templateData, data.version, CURRENT_TEMPLATE_VERSION);
    }
    
    const newTemplate: TemplatePayload = {
      ...templateData,
      id: `template-${Date.now()}`,
      version: CURRENT_TEMPLATE_VERSION,
    };

    return this.create(newTemplate);
  }

  private async migrateTemplate(
    template: Template, 
    fromVersion: string | undefined, 
    toVersion: string
  ): Promise<Template> {
    let migrated = { ...template };

    if (!fromVersion || fromVersion < '1.0.0') {
      if (!migrated.metadata.complexity) {
        migrated.metadata.complexity = this.calculateComplexity(migrated.sceneData);
      }
      if (!migrated.rating) {
        migrated.rating = { average: 0, count: 0 };
      }
      if (migrated.popularity === undefined) {
        migrated.popularity = 0;
      }
    }

    migrated.version = toVersion;
    return migrated;
  }

  private calculateComplexity(scene: Scene): TemplateComplexity {
    const layerCount = scene.layers?.length || 0;
    const cameraCount = scene.sceneCameras?.length || 0;
    const hasAudio = !!scene.sceneAudio;
    const hasAnimations = scene.layers?.some(l => l.animation_type) || false;

    const score = layerCount + (cameraCount * 2) + (hasAudio ? 1 : 0) + (hasAnimations ? 2 : 0);

    if (score <= 3) return TemplateComplexity.BEGINNER;
    if (score <= 7) return TemplateComplexity.INTERMEDIATE;
    if (score <= 12) return TemplateComplexity.ADVANCED;
    return TemplateComplexity.EXPERT;
  }
}

export default new TemplatesService();
