import React from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '../../atoms';

interface ShapeStats {
  totalShapes: number;
  totalSizeMB: string;
}

interface ShapeLibraryHeaderProps {
  stats: ShapeStats | null;
  onClose: () => void;
  onAddShape: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onShapeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ShapeLibraryHeader: React.FC<ShapeLibraryHeaderProps> = ({
  stats,
  onClose,
  onAddShape,
  fileInputRef,
  onShapeUpload
}) => {
  return (
    <div className="bg-white px-6 py-4 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold text-white">Bibliothèque de Formes</h2>
        {stats && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {stats.totalShapes} forme{stats.totalShapes !== 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span>{stats.totalSizeMB} MB</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={onAddShape}
          className="gap-2"
          size="default"
        >
          <Upload className="w-4 h-4" />
          <span>Importer SVG</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          multiple
          onChange={onShapeUpload}
          className="hidden"
        />
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-white transition-colors"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
