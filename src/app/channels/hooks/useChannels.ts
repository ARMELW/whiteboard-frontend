import { useEffect, useCallback } from 'react';
import { useChannelStore } from '../store';
import { channelMockService } from '../api/channelMockService';

export const useChannels = () => {
  const channels = useChannelStore((state) => state.channels);
  const loading = useChannelStore((state) => state.loading);
  const error = useChannelStore((state) => state.error);
  const setChannels = useChannelStore((state) => state.setChannels);

  const setLoading = useCallback(
    (v: boolean) => useChannelStore.setState({ loading: v }),
    []
  );
  const setError = useCallback(
    (e: Error | null) => useChannelStore.setState({ error: e }),
    []
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await channelMockService.list();
      setChannels(result.data.channels);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setChannels]);

  useEffect(() => {
    if (channels.length === 0 && !loading) {
      refetch();
    }
  }, []);

  return {
    channels,
    loading,
    error,
    refetch,
  };
};
