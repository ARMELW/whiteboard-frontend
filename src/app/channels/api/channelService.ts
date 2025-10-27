import httpClient from '@/services/api/httpClient';
import { API_ENDPOINTS } from '@/config/api';
import { Channel, ChannelPayload, ChannelStats, ChannelPlanLimits } from '../types';

/**
 * Service API pour la gestion des canaux
 * Utilise le backend API avec fallback localStorage via httpClient
 */
class ChannelService {
  /**
   * Lister tous les canaux de l'utilisateur
   */
  async list(): Promise<{
    success: boolean;
    data: {
      channels: Channel[];
      meta: ChannelPlanLimits;
    };
  }> {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: Channel[];
        total: number;
        page: number;
        limit: number;
      }>(API_ENDPOINTS.channels.list);

      // Transformer la réponse pour correspondre au format attendu
      const channels = response.data.data || [];
      const activeChannels = channels.filter((c) => c.status === 'active');

      // Note: Les informations du plan devraient venir de l'API
      // Pour l'instant, on utilise des valeurs par défaut
      return {
        success: true,
        data: {
          channels: activeChannels,
          meta: {
            total: activeChannels.length,
            used: activeChannels.length,
            limit: 10, // Devrait venir de l'API subscription
            plan: 'pro', // Devrait venir de l'API subscription
          },
        },
      };
    } catch (error) {
      console.error('Error listing channels:', error);
      throw error;
    }
  }

  /**
   * Obtenir les détails d'un canal
   */
  async detail(id: string): Promise<{ success: boolean; data: Channel }> {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: Channel;
      }>(API_ENDPOINTS.channels.detail(id));

      return response.data;
    } catch (error) {
      console.error(`Error getting channel ${id}:`, error);
      throw error;
    }
  }

  /**
   * Créer un nouveau canal
   */
  async create(
    payload: ChannelPayload
  ): Promise<{ success: boolean; data: Channel } | { success: false; error: any }> {
    try {
      const response = await httpClient.post<{
        success: boolean;
        data: Channel;
      }>(API_ENDPOINTS.channels.create, payload);

      return response.data;
    } catch (error: any) {
      console.error('Error creating channel:', error);
      
      // Gérer les erreurs de limite de canaux
      if (error.response?.data?.error?.code === 'CHANNEL_LIMIT_REACHED') {
        return {
          success: false,
          error: error.response.data.error,
        };
      }
      
      throw error;
    }
  }

  /**
   * Mettre à jour un canal
   */
  async update(
    id: string,
    payload: Partial<ChannelPayload> & { brand_kit?: Partial<Channel['brand_kit']> }
  ): Promise<{ success: boolean; data: Channel }> {
    try {
      const response = await httpClient.put<{
        success: boolean;
        data: Channel;
      }>(API_ENDPOINTS.channels.update(id), payload);

      return response.data;
    } catch (error) {
      console.error(`Error updating channel ${id}:`, error);
      throw error;
    }
  }

  /**
   * Archiver un canal
   */
  async archive(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpClient.post<{
        success: boolean;
        message: string;
      }>(API_ENDPOINTS.channels.archive(id));

      return {
        success: true,
        message: response.data.message || 'Channel archived successfully',
      };
    } catch (error) {
      console.error(`Error archiving channel ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprimer un canal
   */
  async delete(
    id: string
  ): Promise<{ success: boolean; message?: string } | { success: false; error: any }> {
    try {
      const response = await httpClient.delete<{
        success: boolean;
        message: string;
      }>(API_ENDPOINTS.channels.delete(id));

      return {
        success: true,
        message: response.data.message || 'Channel deleted successfully',
      };
    } catch (error: any) {
      console.error(`Error deleting channel ${id}:`, error);
      
      // Gérer les erreurs de suppression (projets actifs)
      if (error.response?.data?.error?.code === 'CHANNEL_HAS_ACTIVE_PROJECTS') {
        return {
          success: false,
          error: error.response.data.error,
        };
      }
      
      throw error;
    }
  }

  /**
   * Obtenir les statistiques d'un canal
   */
  async getStats(id: string): Promise<{ success: boolean; data: ChannelStats }> {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: ChannelStats;
      }>(API_ENDPOINTS.channels.stats(id));

      return response.data;
    } catch (error) {
      console.error(`Error getting channel stats ${id}:`, error);
      throw error;
    }
  }

  /**
   * Uploader un logo pour un canal
   */
  async uploadLogo(
    id: string,
    file: File
  ): Promise<{ success: boolean; data: { logo_url: string; uploaded_at: string } }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await httpClient.post<{
        success: boolean;
        data: { logo_url: string; uploaded_at: string };
      }>(API_ENDPOINTS.channels.uploadLogo(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error uploading logo for channel ${id}:`, error);
      throw error;
    }
  }
}

export const channelService = new ChannelService();
