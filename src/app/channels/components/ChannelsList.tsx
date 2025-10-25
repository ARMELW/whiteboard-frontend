import { useChannels } from '../hooks/useChannels';
import { Channel } from '../types';
import { ChannelCard } from './ChannelCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface ChannelsListProps {
  onCreateChannel: () => void;
  onChannelSettings: (channel: Channel) => void;
  onChannelClick: (channel: Channel) => void;
}

export function ChannelsList({
  onCreateChannel,
  onChannelSettings,
  onChannelClick,
}: ChannelsListProps) {
  const { channels, loading, error } = useChannels();

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
        <p>Erreur lors du chargement des chaînes: {error.message}</p>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mes Chaînes</h2>
          <p className="text-muted-foreground">
            {channels.length} chaîne{channels.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onCreateChannel}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle chaîne
        </Button>
      </div>

      {channels.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">Aucune chaîne créée</p>
          <Button onClick={onCreateChannel}>
            <Plus className="h-4 w-4 mr-2" />
            Créer ma première chaîne
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onSettings={onChannelSettings}
              onClick={onChannelClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
