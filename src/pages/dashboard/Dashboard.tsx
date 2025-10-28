import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChannelsList } from '@/app/channels/components/ChannelsList';
import { CreateChannelModal } from '@/app/channels/components/CreateChannelModal';
import { ChannelSettingsModal } from '@/app/channels/components/ChannelSettingsModal';
import { Channel } from '@/app/channels/types';
import { useChannels } from '@/app/channels/hooks/useChannels';
import { toast } from 'sonner';

const STATUS_MESSAGES = {
  checkout: {
    success: 'Abonnement activé avec succès ! Bienvenue 🎉',
    cancel: 'Paiement annulé. Vous pouvez réessayer à tout moment.',
  },
  upgrade: {
    success: 'Votre plan a été mis à niveau avec succès ! 🚀',
    cancel: 'Mise à niveau annulée.',
  },
} as const;

export function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const { refetch } = useChannels();

  useEffect(() => {
    const params = ['checkout', 'upgrade'] as const;
    
    params.forEach((param) => {
      const status = searchParams.get(param);
      if (status === 'success' || status === 'cancel') {
        const message = STATUS_MESSAGES[param][status];
        status === 'success' ? toast.success(message) : toast.info(message);
        searchParams.delete(param);
      }
    });

    if (searchParams.toString() !== new URLSearchParams().toString()) {
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleChannelSettings = (channel: Channel) => {
    setSelectedChannel(channel);
    setSettingsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">

      <ChannelsList
        onCreateChannel={() => setCreateModalOpen(true)}
        onChannelSettings={handleChannelSettings}
        onChannelClick={(channel) => navigate(`/dashboard/channels/${channel.id}`)}
      />

      <CreateChannelModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={refetch}
      />

      <ChannelSettingsModal
        channel={selectedChannel}
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        onUpdate={refetch}
      />
    </div>
  );
}