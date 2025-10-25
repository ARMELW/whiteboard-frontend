import { create } from 'zustand';
import { Channel } from './types';

interface ChannelState {
  channels: Channel[];
  currentChannel: Channel | null;
  loading: boolean;
  error: Error | null;
  setChannels: (channels: Channel[]) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (channel: Channel) => void;
  deleteChannel: (channelId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  currentChannel: null,
  loading: false,
  error: null,
  setChannels: (channels) => set({ channels }),
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  addChannel: (channel) =>
    set((state) => ({
      channels: [...state.channels, channel],
    })),
  updateChannel: (channel) =>
    set((state) => ({
      channels: state.channels.map((c) => (c.id === channel.id ? channel : c)),
      currentChannel:
        state.currentChannel?.id === channel.id ? channel : state.currentChannel,
    })),
  deleteChannel: (channelId) =>
    set((state) => ({
      channels: state.channels.filter((c) => c.id !== channelId),
      currentChannel:
        state.currentChannel?.id === channelId ? null : state.currentChannel,
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
