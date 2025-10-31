/**
 * ProjectionViewerModal Component
 * Modal wrapper for the ProjectionViewer to debug projection coordinates
 */

import React from 'react';
import { X } from 'lucide-react';
import { ProjectionViewer } from './ProjectionViewer';
import { useCurrentScene } from '@/app/scenes';

interface ProjectionViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectionViewerModal: React.FC<ProjectionViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const scene = useCurrentScene();

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-[95vw] max-h-[95vh] overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="projection-viewer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-purple-700 text-white sticky top-0 z-10">
          <div>
            <h3 id="projection-viewer-title" className="text-xl font-bold">🎯 Projection Debugger</h3>
            <p className="text-sm opacity-90 mt-1">
              Vérifier les coordonnées et positions des layers projetés
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Fermer"
            aria-label="Fermer le debugger de projection"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {scene ? (
            <ProjectionViewer
              scene={scene}
              showGrid={true}
              showCoordinates={true}
              showBounds={true}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-lg font-medium">Aucune scène sélectionnée</p>
              <p className="text-sm mt-2">Veuillez sélectionner une scène pour visualiser la projection</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50 sticky bottom-0">
          <div className="text-sm text-gray-600">
            💡 <strong>Astuce:</strong> Survolez les layers pour voir leurs coordonnées détaillées
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectionViewerModal;
