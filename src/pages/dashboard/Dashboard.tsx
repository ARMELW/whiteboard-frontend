import { useState } from 'react';
import { ChannelsList } from '@/app/channels/components/ChannelsList';
import { CreateChannelModal } from '@/app/channels/components/CreateChannelModal';
import { Channel } from '@/app/channels/types';

export function Dashboard() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
    // TODO: Navigate to channel projects view
    console.log('Channel clicked:', channel);
  };

  const handleChannelSettings = (channel: Channel) => {
    setSelectedChannel(channel);
    // TODO: Open channel settings modal
    console.log('Channel settings:', channel);
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
      />
    </div>
  );
}
