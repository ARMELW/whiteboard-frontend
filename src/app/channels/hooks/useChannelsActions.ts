import { useChannelStore } from '../store';
import { channelMockService } from '../api/channelMockService';
import { ChannelPayload } from '../types';
import { toast } from 'sonner';

export const useChannelsActions = () => {
  const addChannel = useChannelStore((state) => state.addChannel);
  const updateChannel = useChannelStore((state) => state.updateChannel);
  const deleteChannel = useChannelStore((state) => state.deleteChannel);
  const loading = useChannelStore((state) => state.loading);

  return {
    createChannel: async (payload: ChannelPayload) => {
      useChannelStore.setState({ loading: true });
      try {
        const result = await channelMockService.create(payload);
        if (result.success) {
          addChannel(result.data);
          toast.success('Chaîne créée avec succès');
          return result.data;
        } else {
          toast.error(result.error.message);
          throw new Error(result.error.message);
        }
      } catch (error) {
        toast.error('Erreur lors de la création de la chaîne');
        throw error;
      } finally {
        useChannelStore.setState({ loading: false });
      }
    },

    updateChannel: async (
      id: string,
      payload: Partial<ChannelPayload> & {
        brand_kit?: Partial<{
          logo_url: string | null;
          colors: { primary: string; secondary: string; accent: string };
        }>;
      }
    ) => {
      useChannelStore.setState({ loading: true });
      try {
        const result = await channelMockService.update(id, payload);
        updateChannel(result.data);
        toast.success('Chaîne mise à jour avec succès');
        return result.data;
      } catch (error) {
        toast.error('Erreur lors de la mise à jour de la chaîne');
        throw error;
      } finally {
        useChannelStore.setState({ loading: false });
      }
    },

    archiveChannel: async (id: string) => {
      useChannelStore.setState({ loading: true });
      try {
        await channelMockService.archive(id);
        deleteChannel(id);
        toast.success('Chaîne archivée avec succès');
      } catch (error) {
        toast.error("Erreur lors de l'archivage de la chaîne");
        throw error;
      } finally {
        useChannelStore.setState({ loading: false });
      }
    },

    deleteChannel: async (id: string) => {
      useChannelStore.setState({ loading: true });
      try {
        const result = await channelMockService.delete(id);
        if (result.success) {
          deleteChannel(id);
          toast.success('Chaîne supprimée avec succès');
        } else {
          toast.error(result.error.message);
          throw new Error(result.error.message);
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression de la chaîne');
        throw error;
      } finally {
        useChannelStore.setState({ loading: false });
      }
    },

    uploadLogo: async (id: string, file: File) => {
      useChannelStore.setState({ loading: true });
      try {
        const result = await channelMockService.uploadLogo(id, file);
        const channels = useChannelStore.getState().channels;
        const channel = channels.find((c) => c.id === id);
        if (channel) {
          const updatedChannel = {
            ...channel,
            brand_kit: {
              ...channel.brand_kit,
              logo_url: result.data.logo_url,
            },
            updated_at: result.data.uploaded_at,
          };
          updateChannel(updatedChannel);
        }
        toast.success('Logo téléchargé avec succès');
        return result.data;
      } catch (error) {
        toast.error('Erreur lors du téléchargement du logo');
        throw error;
      } finally {
        useChannelStore.setState({ loading: false });
      }
    },

    getStats: async (id: string) => {
      try {
        const result = await channelMockService.getStats(id);
        return result.data;
      } catch (error) {
        toast.error('Erreur lors de la récupération des statistiques');
        throw error;
      }
    },

    isCreating: loading,
    isUpdating: loading,
    isDeleting: loading,
  };
};
