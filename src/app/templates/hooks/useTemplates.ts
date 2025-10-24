import { useEffect, useCallback, useState } from 'react';
import templatesService from '../api/templatesService';
import { Template, TemplateFilter } from '../types';

export const useTemplates = (filters?: TemplateFilter) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (filters && Object.keys(filters).length > 0) {
        result = await templatesService.filter(filters);
      } else {
        const response = await templatesService.list({ page: 1, limit: 1000 });
        result = response.data;
      }
      setTemplates(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const refetch = useCallback(() => {
    return fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    refetch,
  };
};
