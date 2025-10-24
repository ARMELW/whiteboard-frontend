import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FileText, Layout } from 'lucide-react';

interface NewSceneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBlank: () => void;
  onCreateFromTemplate: () => void;
}

export const NewSceneDialog: React.FC<NewSceneDialogProps> = ({
  isOpen,
  onClose,
  onCreateBlank,
  onCreateFromTemplate,
}) => {
  const handleCreateBlank = () => {
    onCreateBlank();
    onClose();
  };

  const handleCreateFromTemplate = () => {
    onCreateFromTemplate();
    onClose();
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
