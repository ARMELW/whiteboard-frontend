import { useProjectStore } from '../store';
import { projectService } from '../api/projectService';
import { ProjectPayload, Project } from '../types';
import { toast } from 'sonner';

export const useProjectsActions = () => {
  const addProject = useProjectStore((state) => state.addProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const loading = useProjectStore((state) => state.loading);

  return {
    createProject: async (channelId: string, payload: ProjectPayload) => {
      useProjectStore.setState({ loading: true });
      try {
        const result = await projectService.create(channelId, payload);
        addProject(result.data);
        toast.success('Projet créé avec succès');
        return result.data;
      } catch (error) {
        toast.error('Erreur lors de la création du projet');
        throw error;
      } finally {
        useProjectStore.setState({ loading: false });
      }
    },

    updateProject: async (
      id: string,
      payload: Partial<ProjectPayload> & { status?: Project['status'] }
    ) => {
      useProjectStore.setState({ loading: true });
      try {
        const result = await projectService.update(id, payload);
        updateProject(result.data);
        toast.success('Projet mis à jour avec succès');
        return result.data;
      } catch (error) {
        toast.error('Erreur lors de la mise à jour du projet');
        throw error;
      } finally {
        useProjectStore.setState({ loading: false });
      }
    },

    duplicateProject: async (id: string, newTitle: string, channelId?: string) => {
      useProjectStore.setState({ loading: true });
      try {
        const result = await projectService.duplicate(id, {
          new_title: newTitle,
          channel_id: channelId,
        });
        addProject(result.data);
        toast.success('Projet dupliqué avec succès');
        return result.data;
      } catch (error) {
        toast.error('Erreur lors de la duplication du projet');
        throw error;
      } finally {
        useProjectStore.setState({ loading: false });
      }
    },

    deleteProject: async (id: string) => {
      useProjectStore.setState({ loading: true });
      try {
        await projectService.delete(id);
        deleteProject(id);
        toast.success('Projet supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression du projet');
        throw error;
      } finally {
        useProjectStore.setState({ loading: false });
      }
    },

    autosave: async (id: string, data: { scenes: any[]; audio_tracks: any[] }) => {
      try {
        await projectService.autosave(id, data);
      } catch (error) {
        console.error('Autosave error:', error);
      }
    },

    isCreating: loading,
    isUpdating: loading,
    isDuplicating: loading,
    isDeleting: loading,
  };
};
