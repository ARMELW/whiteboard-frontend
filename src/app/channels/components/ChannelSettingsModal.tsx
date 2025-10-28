import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BrandKitEditor } from './BrandKitEditor';
import { Channel, ChannelPayload } from '../types';
import { useChannelsActions } from '../hooks/useChannelsActions';
import { Loader2, Trash2 } from 'lucide-react';
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

interface ChannelSettingsModalProps {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function ChannelSettingsModal({
  channel,
  open,
  onOpenChange,
  onUpdate,
}: ChannelSettingsModalProps) {
  const { updateChannel, deleteChannel, archiveChannel, isUpdating } =
    useChannelsActions();
  const [formData, setFormData] = useState<Partial<ChannelPayload>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!channel) return null;

  const handleUpdateGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateChannel(channel.id, formData);
      onOpenChange(false);
      onUpdate?.();
    } catch (error) {
      // Error handled by action
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChannel(channel.id);
      setDeleteDialogOpen(false);
      onOpenChange(false);
      onUpdate?.();
    } catch (error) {
      // Error handled by action
    }
  };

  const handleArchive = async () => {
    try {
      await archiveChannel(channel.id);
      onOpenChange(false);
      onUpdate?.();
    } catch (error) {
      // Error handled by action
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Paramètres de la chaîne</DialogTitle>
            <DialogDescription>{channel.name}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <form onSubmit={handleUpdateGeneral} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la chaîne</Label>
                  <Input
                    id="name"
                    defaultValue={channel.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={channel.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              
                <div className="flex gap-2">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer les modifications'
                    )}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleArchive}
                      disabled={isUpdating}
                    >
                      Archiver la chaîne
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="stats" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Projets</p>
                  <p className="text-2xl font-bold">{channel.projectCount}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Vidéos exportées</p>
                  <p className="text-2xl font-bold">
                    {channel.totalVideosExported}
                  </p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Dernière activité
                </p>
                <p className="text-sm">
                  {new Date(channel.updatedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la chaîne</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{channel.name}" ? Cette action
              est irréversible et supprimera tous les projets associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
