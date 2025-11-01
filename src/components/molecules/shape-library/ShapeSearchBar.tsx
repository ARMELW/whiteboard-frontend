import React from 'react';
import { Search, X } from 'lucide-react';

interface ShapeSearchBarProps {
  searchQuery: string;
  selectedTags: string[];
  onSearchChange: (query: string) => void;
}

export const ShapeSearchBar: React.FC<ShapeSearchBarProps> = ({
  searchQuery,
  selectedTags,
  onSearchChange
}) => {
  return (
    <div className="p-4 border-b border-border">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher une forme..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-secondary text-white pl-10 pr-10 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {selectedTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Filtres actifs:</span>
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-purple-600 text-white px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
