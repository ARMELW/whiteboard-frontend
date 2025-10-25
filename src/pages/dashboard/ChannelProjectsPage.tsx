import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectsList } from '@/app/projects/components/ProjectsList';
import { CreateProjectModal } from '@/app/projects/components/CreateProjectModal';
import { Project } from '@/app/projects/types';
import { useProjectsActions } from '@/app/projects/hooks/useProjectsActions';
import { useProjectStore } from '@/app/projects/store';
import { useChannels } from '@/app/channels/hooks/useChannels';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function ChannelProjectsPage() {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const { data: channels } = useChannels();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [duplicateTitle, setDuplicateTitle] = useState('');
  
  const { deleteProject, duplicateProject } = useProjectsActions();
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);

  const channel = channels?.find(c => c.id === channelId);
  const channelName = channel?.name || 'Chaîne';

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    navigate(`/channels/${channelId}/editor/${project.id}`);
  };

  const handleDuplicateProject = (project: Project) => {
    setSelectedProject(project);
    setDuplicateTitle(`${project.title} (copie)`);
    setDuplicateDialogOpen(true);
  };

  const confirmDuplicate = async () => {
    if (!selectedProject) return;
    
    try {
      await duplicateProject(selectedProject.id, duplicateTitle);
      setDuplicateDialogOpen(false);
      setSelectedProject(null);
      setDuplicateTitle('');
    } catch (error) {
      // Error handled by action
    }
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    
    try {
      await deleteProject(selectedProject.id);
      setDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      // Error handled by action
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{channelName}</h1>
        <p className="text-muted-foreground">
          Projets de cette chaîne
        </p>
      </div>

      <ProjectsList
        channelId={channelId!}
        onCreateProject={() => setCreateModalOpen(true)}
        onEditProject={handleEditProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
      />

      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        defaultChannelId={channelId!}
        onSuccess={(projectId) => {
          console.log('Project created:', projectId);
          // Project will be available in the list to click and open
        }}
      />

      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dupliquer le projet</DialogTitle>
            <DialogDescription>
              Donnez un titre au nouveau projet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="duplicate-title">Titre</Label>
              <Input
                id="duplicate-title"
                value={duplicateTitle}
                onChange={(e) => setDuplicateTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={confirmDuplicate} disabled={!duplicateTitle}>
              Dupliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le projet</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedProject?.title}" ?
              Cette action est réversible pendant 30 jours.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
