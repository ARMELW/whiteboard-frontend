import React from 'react';
import { Download, ImageIcon } from 'lucide-react';

interface ThumbnailActionsProps {
  onDownload: () => void;
  onSave?: () => void;
}

export const ThumbnailActions: React.FC<ThumbnailActionsProps> = ({ 
  onDownload, 
  onSave 
}) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={onDownload}
        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
      >
        <Download className="w-5 h-5" />
        Télécharger
      </button>
      {onSave && (
        <button
          onClick={onSave}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          <ImageIcon className="w-5 h-5" />
          Enregistrer
        </button>
      )}
    </div>
  );
};
