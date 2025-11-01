import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface ShapeSortControlsProps {
  sortBy: 'name' | 'uploadDate' | 'size' | 'usageCount';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'name' | 'uploadDate' | 'size' | 'usageCount') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

export const ShapeSortControls: React.FC<ShapeSortControlsProps> = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange
}) => {
  const sortOptions = [
    { value: 'uploadDate', label: 'Date d\'ajout' },
    { value: 'name', label: 'Nom' },
    { value: 'size', label: 'Taille' },
    { value: 'usageCount', label: 'Utilisation' },
  ];

  return (
    <div className="mb-4">
      <h3 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4" />
        Trier par
      </h3>
      <div className="space-y-2">
        {sortOptions.map(option => (
          <button
            key={option.value}
            onClick={() => onSortByChange(option.value as any)}
            className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
              sortBy === option.value
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-secondary hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onSortOrderChange('asc')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors text-sm ${
            sortOrder === 'asc'
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:bg-secondary hover:text-white'
          }`}
        >
          <ArrowUp className="w-4 h-4" />
          Croissant
        </button>
        <button
          onClick={() => onSortOrderChange('desc')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors text-sm ${
            sortOrder === 'desc'
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:bg-secondary hover:text-white'
          }`}
        >
          <ArrowDown className="w-4 h-4" />
          Décroissant
        </button>
      </div>
    </div>
  );
};
