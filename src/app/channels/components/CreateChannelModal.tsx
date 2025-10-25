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
import { Textarea } from '@/components/ui/textarea';
import { useChannelsActions } from '../hooks/useChannelsActions';
import { ChannelPayload } from '../types';
import { Loader2 } from 'lucide-react';

interface CreateChannelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateChannelModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateChannelModalProps) {
  const { createChannel, isCreating } = useChannelsActions();
  const [formData, setFormData] = useState<ChannelPayload>({
    name: '',
    description: '',
    youtube_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createChannel(formData);
      onOpenChange(false);
      setFormData({ name: '', description: '', youtube_url: '' });
      onSuccess?.();
    } catch (error) {
      // Error already handled in the action with toast
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({ name: '', description: '', youtube_url: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle chaîne</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle chaîne pour organiser vos projets vidéo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nom de la chaîne <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ma Chaîne Cuisine"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de votre chaîne (optionnel)"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_url">URL YouTube</Label>
              <Input
                id="youtube_url"
                type="url"
                placeholder="https://youtube.com/@machaîne (optionnel)"
                value={formData.youtube_url || ''}
                onChange={(e) =>
                  setFormData({ ...formData, youtube_url: e.target.value })
                }
              />
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
            <Button type="submit" disabled={isCreating || !formData.name}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer la chaîne'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
