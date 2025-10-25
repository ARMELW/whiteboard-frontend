import React from 'react';
import { ImageIcon, X } from 'lucide-react';

interface ThumbnailHeaderProps {
  onClose: () => void;
}

export const ThumbnailHeader: React.FC<ThumbnailHeaderProps> = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 px-6 py-4 flex items-center justify-between border-b border-purple-500/30">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Éditeur de Miniature</h2>
          <p className="text-sm text-purple-100">Créez des miniatures professionnelles • 1280x720</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white group"
        title="Fermer"
      >
        <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>
    </div>
  );
};
