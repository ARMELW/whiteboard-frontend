import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectsActions } from '../hooks/useProjectsActions';
import { useChannels } from '@/app/channels/hooks/useChannels';
import { ProjectPayload } from '../types';
import { Loader2 } from 'lucide-react';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultChannelId?: string;
  onSuccess?: (projectId: string) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  defaultChannelId,
  onSuccess,
}: CreateProjectModalProps) {
  const { createProject, isCreating } = useProjectsActions();
  const { channels } = useChannels();
  const [channelId, setChannelId] = useState(defaultChannelId || '');
  const [formData, setFormData] = useState<ProjectPayload>({
    title: '',
    aspect_ratio: '16:9',
    resolution: '1080p',
    fps: 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId) return;

    try {
      const project = await createProject(channelId, formData);
      onOpenChange(false);
      setFormData({
        title: '',
        aspect_ratio: '16:9',
        resolution: '1080p',
        fps: 30,
      });
      onSuccess?.(project.id);
    } catch (error) {
      // Error already handled in the action with toast
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      title: '',
      aspect_ratio: '16:9',
      resolution: '1080p',
      fps: 30,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
          <DialogDescription>
            Configurez votre nouveau projet vidéo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Titre du projet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ma Nouvelle Vidéo"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel">
                Chaîne <span className="text-red-500">*</span>
              </Label>
              <Select value={channelId} onValueChange={setChannelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une chaîne" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aspect_ratio">Format</Label>
                <Select
                  value={formData.aspect_ratio}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      aspect_ratio: value as ProjectPayload['aspect_ratio'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Paysage)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Carré)</SelectItem>
                    <SelectItem value="4:5">4:5 (Instagram)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resolution">Résolution</Label>
                <Select
                  value={formData.resolution}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      resolution: value as ProjectPayload['resolution'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isCreating}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isCreating || !formData.title || !channelId}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer le projet'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
