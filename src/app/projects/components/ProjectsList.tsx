import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2, Search } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface ProjectsListProps {
  channelId?: string;
  onCreateProject: () => void;
  onEditProject: (project: Project) => void;
  onDuplicateProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

export function ProjectsList({
  channelId,
  onCreateProject,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
}: ProjectsListProps) {
  const { projects, loading, error } = useProjects(channelId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <p>Erreur lors du chargement des projets: {error.message}</p>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mes Projets</h2>
          <p className="text-muted-foreground">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'title')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date de modification</SelectItem>
            <SelectItem value="title">Titre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Aucun projet trouvé'
              : 'Aucun projet créé'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={onCreateProject}>
              <Plus className="h-4 w-4 mr-2" />
              Créer mon premier projet
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDuplicate={onDuplicateProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
