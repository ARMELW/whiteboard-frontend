import { useState, useEffect, useCallback } from 'react';
import fontsService, { Font, ListFontsParams } from '../api/fontsService';

export const useFonts = (params: ListFontsParams = {}) => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadFonts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fontsService.list(params);
      setFonts(result);
    } catch (err) {
      console.error('Error loading fonts:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [params.category, params.premiumOnly, params.popularOnly]);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  return {
    fonts,
    loading,
    error,
    refetch: loadFonts,
  };
};
