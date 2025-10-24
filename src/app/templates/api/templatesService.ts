import BaseService from '../../../services/api/baseService';
import API_ENDPOINTS from '../../../config/api';
import { STORAGE_KEYS } from '../../../config/constants';
import { Template, TemplatePayload, TemplateFilter, TemplateMetadata } from '../types';
import { Scene } from '../../scenes/types';

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
      metadata: payload.metadata || {
        layerCount: 0,
        cameraCount: 0,
        hasAudio: false,
        hasBackground: false,
      },
      sceneData: payload.sceneData || {} as Scene,
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

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(t => 
        filters.tags!.some(tag => t.tags.includes(tag))
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

    return filtered;
  }

  async exportTemplate(id: string): Promise<string> {
    await this.delay();
    const template = await this.detail(id);
    return JSON.stringify(template, null, 2);
  }

  async importTemplate(jsonString: string): Promise<Template> {
    await this.delay();
    const templateData = JSON.parse(jsonString) as Template;
    
    // Create a new template with a new ID
    const newTemplate: TemplatePayload = {
      ...templateData,
      id: `template-${Date.now()}`,
    };

    return this.create(newTemplate);
  }
}

export default new TemplatesService();
