import { useState } from 'react';
import { ChannelsList } from '@/app/channels/components/ChannelsList';
import { CreateChannelModal } from '@/app/channels/components/CreateChannelModal';
import { ChannelSettingsModal } from '@/app/channels/components/ChannelSettingsModal';
import { Channel } from '@/app/channels/types';
import { useChannels } from '@/app/channels/hooks/useChannels';

export function Dashboard() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const { refetch } = useChannels();

  const handleChannelClick = (channel: Channel) => {
    console.log('Channel clicked:', channel);
    // TODO: Navigate to channel projects view
  };

  const handleChannelSettings = (channel: Channel) => {
    setSelectedChannel(channel);
    setSettingsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Gérez vos chaînes et vos projets vidéo
        </p>
      </div>

      <ChannelsList
        onCreateChannel={() => setCreateModalOpen(true)}
        onChannelSettings={handleChannelSettings}
        onChannelClick={handleChannelClick}
      />

      <CreateChannelModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => refetch()}
      />

      <ChannelSettingsModal
        channel={selectedChannel}
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        onUpdate={() => refetch()}
      />
    </div>
  );
}
