import React from 'react';
import { Check, X, Edit2, Trash2 } from 'lucide-react';
import { ShapeAsset } from '@/app/shapes/api/shapesService';

interface ShapeCardProps {
  shape: ShapeAsset;
  isSelected: boolean;
  isEditing: boolean;
  editName: string;
  editTags: string;
  editCategory: string;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onSaveEdit: (e: React.MouseEvent) => void;
  onCancelEdit: (e: React.MouseEvent) => void;
  onEditNameChange: (value: string) => void;
  onEditTagsChange: (value: string) => void;
  onEditCategoryChange: (value: string) => void;
  formatSize: (size: number) => string;
  formatDate: (date: string) => string;
}

const categories = [
  { value: 'basic', label: 'Basique' },
  { value: 'arrow', label: 'Flèche' },
  { value: 'callout', label: 'Bulle' },
  { value: 'banner', label: 'Bannière' },
  { value: 'icon', label: 'Icône' },
  { value: 'decorative', label: 'Décoratif' },
  { value: 'other', label: 'Autre' },
];

export const ShapeCard: React.FC<ShapeCardProps> = ({
  shape,
  isSelected,
  isEditing,
  editName,
  editTags,
  editCategory,
  onSelect,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  onEditNameChange,
  onEditTagsChange,
  onEditCategoryChange,
  formatSize,
  formatDate
}) => {
  return (
    <div
      onClick={onSelect}
      className={`bg-secondary/30 rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected
          ? 'border-primary shadow-xl'
          : 'border-border hover:border-border'
      }`}
    >
      {/* Shape Preview */}
      <div className="aspect-square bg-white flex items-center justify-center overflow-hidden p-4">
        {shape.thumbnailUrl ? (
          <img
            src={shape.thumbnailUrl}
            alt={shape.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={shape.url}
            alt={shape.name}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Shape Info */}
      <div className="p-3">
        {isEditing ? (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              className="w-full bg-secondary text-white text-sm px-2 py-1 rounded border border-border"
              placeholder="Nom"
            />
            <select
              value={editCategory}
              onChange={(e) => onEditCategoryChange(e.target.value)}
              className="w-full bg-secondary text-white text-sm px-2 py-1 rounded border border-border"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={editTags}
              onChange={(e) => onEditTagsChange(e.target.value)}
              className="w-full bg-secondary text-white text-xs px-2 py-1 rounded border border-border"
              placeholder="Tags (séparés par virgule)"
            />
            <div className="flex gap-1">
              <button
                onClick={onSaveEdit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
              >
                <Check className="w-3 h-3 mx-auto" />
              </button>
              <button
                onClick={onCancelEdit}
                className="flex-1 bg-gray-600 hover:bg-secondary text-white px-2 py-1 rounded text-xs"
              >
                <X className="w-3 h-3 mx-auto" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-white text-sm font-medium truncate mb-1">
              {shape.name}
            </p>
            <p className="text-muted-foreground text-xs mb-2">
              {shape.width && shape.height ? `${shape.width} × ${shape.height} • ` : ''}
              {formatSize(shape.size)}
            </p>
            <div className="mb-2">
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                {categories.find(c => c.value === shape.category)?.label || shape.category}
              </span>
            </div>
            {shape.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {shape.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {shape.tags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{shape.tags.length - 2}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{formatDate(shape.uploadedAt)}</span>
              {shape.usageCount > 0 && (
                <span>Utilisé {shape.usageCount}×</span>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={onEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                Éditer
              </button>
              <button
                onClick={onDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Suppr.
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
