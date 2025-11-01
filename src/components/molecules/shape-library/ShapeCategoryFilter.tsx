import React from 'react';
import { Filter, X } from 'lucide-react';

interface ShapeCategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const categoryLabels: Record<string, string> = {
  basic: 'Basique',
  arrow: 'Flèche',
  callout: 'Bulle',
  banner: 'Bannière',
  icon: 'Icône',
  decorative: 'Décoratif',
  other: 'Autre',
};

export const ShapeCategoryFilter: React.FC<ShapeCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
        <Filter className="w-4 h-4" />
        Catégories
      </h3>
      <div className="space-y-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:bg-secondary hover:text-white'
          }`}
        >
          Toutes les catégories
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-secondary hover:text-white'
            }`}
          >
            {categoryLabels[category] || category}
          </button>
        ))}
      </div>
      {selectedCategory && (
        <button
          onClick={() => onSelectCategory(null)}
          className="w-full mt-2 text-xs text-muted-foreground hover:text-white flex items-center justify-center gap-1"
        >
          <X className="w-3 h-3" />
          Effacer le filtre
        </button>
      )}
    </div>
  );
};
