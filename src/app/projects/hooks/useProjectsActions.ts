import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../api/projectService';
import { ProjectPayload, Project } from '../types';
import { toast } from 'sonner';
import { projectsKeys } from '../config';

export const useProjectsActions = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({ channelId, payload }: { channelId: string; payload: ProjectPayload }) =>
      projectService.create(channelId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      toast.success('Projet créé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création du projet');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProjectPayload> & { status?: Project['status'] } }) =>
      projectService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectsKeys.detail(data.data.id) });
      toast.success('Projet mis à jour avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du projet');
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: ({ id, newTitle, channelId }: { id: string; newTitle: string; channelId?: string }) =>
      projectService.duplicate(id, { new_title: newTitle, channel_id: channelId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      toast.success('Projet dupliqué avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la duplication du projet');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      queryClient.removeQueries({ queryKey: projectsKeys.detail(id) });
      toast.success('Projet supprimé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du projet');
    },
  });

  const autosaveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { scenes: any[]; audio_tracks: any[] } }) =>
      projectService.autosave(id, data),
    onError: (error) => {
      console.error('Autosave error:', error);
    },
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: projectsKeys.lists(),
      refetchType: 'all',
    });
  };

  return {
    createProject: async (channelId: string, payload: ProjectPayload) => {
      const result = await createMutation.mutateAsync({ channelId, payload });
      return result.data;
    },
    updateProject: async (id: string, payload: Partial<ProjectPayload> & { status?: Project['status'] }) => {
      const result = await updateMutation.mutateAsync({ id, payload });
      return result.data;
    },
    duplicateProject: async (id: string, newTitle: string, channelId?: string) => {
      const result = await duplicateMutation.mutateAsync({ id, newTitle, channelId });
      return result.data;
    },
    deleteProject: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    autosave: async (id: string, data: { scenes: any[]; audio_tracks: any[] }) => {
      await autosaveMutation.mutateAsync({ id, data });
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDuplicating: duplicateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    invalidate,
  };
};
