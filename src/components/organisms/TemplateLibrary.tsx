import React, { useState, useCallback } from 'react';
import { useTemplates, useTemplateActions, Template, TemplateFilter } from '@/app/templates';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import TemplateCard from '../molecules/templates/TemplateCard';
import TemplateFilters from '../molecules/templates/TemplateFilters';
import { Button } from '../atoms';
import { X, Upload, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from 'react-router-dom';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState<TemplateFilter>({});
  const {projectId} = useParams();
  const { templates, loading: loadingTemplates, refetch } = useTemplates(filters);
  const { deleteTemplate, exportTemplate, importTemplate, loading: actionLoading } = useTemplateActions();
  const { createScene } = useScenesActionsWithHistory();

  const handleSelectTemplate = useCallback(async (template: Template) => {
    try {
      // Create a new scene from the template's scene data
      await createScene({
        ...template.sceneData,
        projectId: projectId || undefined,
        title: `${template.name} - Copie`,
      });
      onClose();
    } catch (error) {
      console.error('Error creating scene from template:', error);
      alert('Erreur lors de la création de la scène depuis le template');
    }
  }, [createScene, onClose]);

  const handleDeleteTemplate = useCallback(async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      return;
    }

    const success = await deleteTemplate(id);
    if (success) {
      refetch();
    } else {
      alert('Erreur lors de la suppression du template');
    }
  }, [deleteTemplate, refetch]);

  const handleExportTemplate = useCallback(async (id: string) => {
    const jsonString = await exportTemplate(id);
    if (!jsonString) {
      alert('Erreur lors de l\'export du template');
      return;
    }

    // Download as JSON file
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-${id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportTemplate]);

  const handleImportTemplate = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const jsonString = e.target?.result as string;
      const template = await importTemplate(jsonString);
      if (template) {
        refetch();
      } else {
        alert('Erreur lors de l\'import du template');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  }, [importTemplate, refetch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bibliothèque de Templates</DialogTitle>
          <DialogDescription>
            Sélectionnez un template pour créer une nouvelle scène
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Import Button */}
          <div className="flex justify-end">
            <label htmlFor="template-import">
              <Button variant="outline" size="sm" asChild>
                <span className="cursor-pointer flex items-center gap-2">
                  <Upload size={16} />
                  Importer un template
                </span>
              </Button>
            </label>
            <input
              id="template-import"
              type="file"
              accept=".json"
              onChange={handleImportTemplate}
              className="hidden"
            />
          </div>

          {/* Filters */}
          <TemplateFilters filters={filters} onFiltersChange={setFilters} />

          {/* Templates Grid */}
          {loadingTemplates || actionLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Aucun template trouvé</p>
              <p className="text-sm mt-2">
                Essayez de modifier vos filtres ou créez un nouveau template depuis une scène
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleSelectTemplate}
                  onDelete={handleDeleteTemplate}
                  onExport={handleExportTemplate}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateLibrary;
