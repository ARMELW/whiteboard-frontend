import React from 'react';
import { TemplateType, TemplateStyle, TemplateFilter } from '@/app/templates';
import { Input } from '../../atoms';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateFiltersProps {
  filters: TemplateFilter;
  onFiltersChange: (filters: TemplateFilter) => void;
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'Tous les types' },
  { value: TemplateType.EDUCATION, label: 'Éducatif' },
  { value: TemplateType.MARKETING, label: 'Marketing' },
  { value: TemplateType.PRESENTATION, label: 'Présentation' },
  { value: TemplateType.TUTORIAL, label: 'Tutoriel' },
  { value: TemplateType.ENTERTAINMENT, label: 'Divertissement' },
  { value: TemplateType.OTHER, label: 'Autre' },
];

const STYLE_OPTIONS = [
  { value: 'all', label: 'Tous les styles' },
  { value: TemplateStyle.MINIMAL, label: 'Minimaliste' },
  { value: TemplateStyle.COLORFUL, label: 'Coloré' },
  { value: TemplateStyle.PROFESSIONAL, label: 'Professionnel' },
  { value: TemplateStyle.CREATIVE, label: 'Créatif' },
  { value: TemplateStyle.DARK, label: 'Sombre' },
  { value: TemplateStyle.LIGHT, label: 'Clair' },
];

const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      type: value !== 'all' ? (value as TemplateType) : undefined,
    });
  };

  const handleStyleChange = (value: string) => {
    onFiltersChange({
      ...filters,
      style: value !== 'all' ? (value as TemplateStyle) : undefined,
    });
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          type="text"
          placeholder="Rechercher un template..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Type and Style Filters */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={filters.type || 'all'}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.style || 'all'}
          onValueChange={handleStyleChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            {STYLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TemplateFilters;
