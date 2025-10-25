import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '../types';
import { Copy, MoreVertical, Play, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const statusColors = {
  draft: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
};

const statusLabels = {
  draft: 'Brouillon',
  in_progress: 'En cours',
  completed: 'Terminé',
};

export function ProjectCard({
  project,
  onEdit,
  onDuplicate,
  onDelete,
}: ProjectCardProps) {
  const lastUpdateText = project.updated_at
    ? formatDistanceToNow(new Date(project.updated_at), {
        addSuffix: true,
        locale: fr,
      })
    : 'Jamais';

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader className="p-0">
        <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge className={statusColors[project.status]}>
              {statusLabels[project.status]}
            </Badge>
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Play className="h-4 w-4 mr-2" />
                  Ouvrir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(project)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Dupliquer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(project)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3
          className="font-semibold text-lg truncate cursor-pointer hover:text-primary"
          onClick={() => onEdit(project)}
        >
          {project.title}
        </h3>
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {project.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
        <span>{project.aspect_ratio}</span>
        <span>{formatDuration(project.duration)}</span>
        <span>{lastUpdateText}</span>
      </CardFooter>
    </Card>
  );
}
