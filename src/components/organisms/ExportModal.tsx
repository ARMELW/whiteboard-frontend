import React from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ExportPanel from './ExportPanel';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvas: HTMLCanvasElement | null;
  onExport?: (result: any) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  onClose, 
  canvas,
  onExport 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center justify-between">
            <span>Exporter la scène</span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ExportPanel canvas={canvas} onExport={onExport} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
