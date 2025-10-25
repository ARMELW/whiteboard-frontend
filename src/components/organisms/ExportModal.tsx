/**
 * ExportModal Component
 * Modal dialog for exporting video with generation options
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import VideoGenerationPanel from './VideoGenerationPanel';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            Exporter la Vidéo
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <VideoGenerationPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
