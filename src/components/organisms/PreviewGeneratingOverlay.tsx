import React from 'react';
import { Loader2, X } from 'lucide-react';

interface PreviewGeneratingOverlayProps {
  isVisible: boolean;
  progress: number;
  onCancel?: () => void;
}

const PreviewGeneratingOverlay: React.FC<PreviewGeneratingOverlayProps> = ({
  isVisible,
  progress,
  onCancel
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4">
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>

        <h2 className="text-center text-lg font-semibold text-gray-900 mb-2">
          Génération du préview
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6">
          Veuillez patienter...
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-center text-sm font-medium text-gray-700 mt-2">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(PreviewGeneratingOverlay);
