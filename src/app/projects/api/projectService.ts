import httpClient from '@/services/api/httpClient';
import { API_ENDPOINTS } from '@/config/api';
import { Project, ProjectPayload } from '../types';

/**
 * Service API pour la gestion des projets
 * Utilise le backend API avec fallback localStorage via httpClient
 */
class ProjectService {
  /**
   * Lister tous les projets d'un canal
   */
  async list(channelId: string): Promise<{
    success: boolean;
    data: {
      projects: Project[];
      total: number;
    };
  }> {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: Project[];
        total: number;
      }>(API_ENDPOINTS.projects.list(channelId));

      return {
        success: true,
        data: {
          projects: response.data.data || [],
          total: response.data.total || 0,
        },
      };
    } catch (error) {
      console.error('Error listing projects:', error);
      throw error;
    }
  }

  /**
   * Lister tous les projets (tous canaux confondus)
   */
  async listAll(): Promise<{
    success: boolean;
    data: {
      projects: Project[];
      total: number;
    };
  }> {
    try {
      // Note: L'API ne fournit pas d'endpoint pour tous les projets
      // On peut utiliser l'endpoint de base avec query params
      const response = await httpClient.get<{
        success: boolean;
        data: Project[];
        total: number;
      }>(API_ENDPOINTS.projects.base);

      return {
        success: true,
        data: {
          projects: response.data.data || [],
          total: response.data.total || 0,
        },
      };
    } catch (error) {
      console.error('Error listing all projects:', error);
      throw error;
    }
  }

  /**
   * Obtenir les détails d'un projet
   */
  async detail(id: string): Promise<{ success: boolean; data: Project }> {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: Project;
      }>(API_ENDPOINTS.projects.detail(id));

      return response.data;
    } catch (error) {
      console.error(`Error getting project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Créer un nouveau projet
   */
  async create(
    channelId: string,
    payload: ProjectPayload
  ): Promise<{ success: boolean; data: Project }> {
    try {
      const response = await httpClient.post<{
        success: boolean;
        data: Project;
      }>(API_ENDPOINTS.projects.create(channelId), payload);

      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un projet
   */
  async update(
    id: string,
    payload: Partial<ProjectPayload> & { status?: Project['status'] }
  ): Promise<{ success: boolean; data: Project }> {
    try {
      const response = await httpClient.put<{
        success: boolean;
        data: Project;
      }>(API_ENDPOINTS.projects.update(id), payload);

      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Dupliquer un projet
   */
  async duplicate(
    id: string,
    payload: { new_title: string; channel_id?: string }
  ): Promise<{ success: boolean; data: Project }> {
    try {
      const response = await httpClient.post<{
        success: boolean;
        data: Project;
      }>(API_ENDPOINTS.projects.duplicate(id), {
        title: payload.new_title,
        channelId: payload.channel_id,
      });

      return response.data;
    } catch (error) {
      console.error(`Error duplicating project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprimer un projet
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      await httpClient.delete(API_ENDPOINTS.projects.delete(id));

      return {
        success: true,
        message: 'Project moved to trash',
      };
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Sauvegarde automatique d'un projet
   */
  async autosave(
    id: string,
    data: { scenes: any[]; audio_tracks: any[] }
  ): Promise<{ success: boolean; saved_at: string }> {
    try {
      const response = await httpClient.post<{
        success: boolean;
        saved_at: string;
      }>(API_ENDPOINTS.projects.autosave(id), {
        data,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        saved_at: response.data.saved_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error autosaving project ${id}:`, error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();
