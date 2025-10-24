import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FileText, Layout, Sparkles } from 'lucide-react';

interface NewSceneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBlank: () => void;
  onCreateFromTemplate: () => void;
  onCreateFromWizard?: () => void;
}

export const NewSceneDialog: React.FC<NewSceneDialogProps> = ({
  isOpen,
  onClose,
  onCreateBlank,
  onCreateFromTemplate,
  onCreateFromWizard,
}) => {
  const handleCreateBlank = () => {
    onCreateBlank();
    onClose();
  };

  const handleCreateFromTemplate = () => {
    onCreateFromTemplate();
    onClose();
  };

  const handleCreateFromWizard = () => {
    if (onCreateFromWizard) {
      onCreateFromWizard();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle scène</DialogTitle>
          <DialogDescription>
            Choisissez comment vous souhaitez créer votre nouvelle scène
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          {/* AI Wizard Option */}
          {onCreateFromWizard && (
            <button
              onClick={handleCreateFromWizard}
              className="group relative flex flex-col items-center gap-4 rounded-lg border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 p-6 hover:border-purple-600 hover:shadow-lg transition-all"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 group-hover:bg-purple-600 transition-colors">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">Assistant IA</h3>
                  <span className="px-2 py-0.5 text-xs font-bold text-purple-600 bg-purple-100 rounded-full">
                    NOUVEAU
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Laissez l'IA créer votre projet automatiquement
                </p>
              </div>
            </button>
          )}

          {/* Blank Scene Option */}
          <button
            onClick={handleCreateBlank}
            className="group relative flex flex-col items-center gap-4 rounded-lg border-2 border-border bg-background p-6 hover:border-primary hover:bg-secondary/50 transition-all"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">Scène vierge</h3>
              <p className="text-sm text-muted-foreground">
                Commencer avec une scène complètement vide
              </p>
            </div>
          </button>

          {/* Template Option */}
          <button
            onClick={handleCreateFromTemplate}
            className="group relative flex flex-col items-center gap-4 rounded-lg border-2 border-border bg-background p-6 hover:border-primary hover:bg-secondary/50 transition-all"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Layout className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">Depuis un template</h3>
              <p className="text-sm text-muted-foreground">
                Utiliser un template pré-configuré
              </p>
            </div>
          </button>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
