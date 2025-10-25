import React from 'react';
import { Upload, Type, Square } from 'lucide-react';

interface ThumbnailAddElementsProps {
  onImageUpload: () => void;
  onAddText: () => void;
  onAddShape?: () => void;
  imageUploadRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ThumbnailAddElements: React.FC<ThumbnailAddElementsProps> = ({
  onImageUpload,
  onAddText,
  onAddShape,
  imageUploadRef,
  onFileChange
}) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Type className="w-4 h-4 text-purple-400" />
        Ajouter des éléments
      </h3>
      
      <div className="space-y-2">
        <button
          onClick={onImageUpload}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <Upload className="w-4 h-4" />
          Importer Image
        </button>
        <input
          ref={imageUploadRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
        
        <button
          onClick={onAddText}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <Type className="w-4 h-4" />
          Ajouter Texte
        </button>
        
        {onAddShape && (
          <button
            onClick={onAddShape}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <Square className="w-4 h-4" />
            Ajouter Forme
          </button>
        )}
      </div>
    </div>
  );
};
