import { useState } from 'react';
import templatesService from '../api/templatesService';
import { Template, TemplatePayload, TemplateImportValidation } from '../types';
import { Scene } from '../../scenes/types';

export const useTemplateActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTemplate = async (payload: TemplatePayload): Promise<Template | null> => {
    setLoading(true);
    setError(null);
    try {
      const template = await templatesService.create(payload);
      return template;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createTemplateFromScene = async (
    scene: Scene,
    templateData: Partial<TemplatePayload>
  ): Promise<Template | null> => {
    setLoading(true);
    setError(null);
    try {
      const template = await templatesService.createFromScene(scene, templateData);
      return template;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (id: string, payload: TemplatePayload): Promise<Template | null> => {
    setLoading(true);
    setError(null);
    try {
      const template = await templatesService.update(id, payload);
      return template;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await templatesService.delete(id);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportTemplate = async (id: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const jsonString = await templatesService.exportTemplate(id);
      return jsonString;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validateTemplate = async (jsonString: string): Promise<TemplateImportValidation | null> => {
    setLoading(true);
    setError(null);
    try {
      const validation = await templatesService.validateTemplate(jsonString);
      return validation;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const importTemplate = async (jsonString: string): Promise<Template | null> => {
    setLoading(true);
    setError(null);
    try {
      const template = await templatesService.importTemplate(jsonString);
      return template;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTemplate,
    createTemplateFromScene,
    updateTemplate,
    deleteTemplate,
    exportTemplate,
    validateTemplate,
    importTemplate,
    loading,
    error,
  };
};
