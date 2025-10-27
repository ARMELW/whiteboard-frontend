import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChannelsList } from '@/app/channels/components/ChannelsList';
import { CreateChannelModal } from '@/app/channels/components/CreateChannelModal';
import { ChannelSettingsModal } from '@/app/channels/components/ChannelSettingsModal';
import { Channel } from '@/app/channels/types';
import { useChannels } from '@/app/channels/hooks/useChannels';
import { toast } from 'sonner';

export function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const { refetch } = useChannels();

  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    const upgradeStatus = searchParams.get('upgrade');

    if (checkoutStatus === 'success') {
      toast.success('Abonnement activé avec succès ! Bienvenue 🎉');
      searchParams.delete('checkout');
      setSearchParams(searchParams);
    } else if (checkoutStatus === 'cancel') {
      toast.info('Paiement annulé. Vous pouvez réessayer à tout moment.');
      searchParams.delete('checkout');
      setSearchParams(searchParams);
    }

    if (upgradeStatus === 'success') {
      toast.success('Votre plan a été mis à niveau avec succès ! 🚀');
      searchParams.delete('upgrade');
      setSearchParams(searchParams);
    } else if (upgradeStatus === 'cancel') {
      toast.info('Mise à niveau annulée.');
      searchParams.delete('upgrade');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleChannelClick = (channel: Channel) => {
    navigate(`/channels/${channel.id}`);
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
