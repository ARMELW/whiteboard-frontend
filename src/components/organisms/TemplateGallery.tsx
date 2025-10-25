/**
 * Template Gallery Component
 * Browse and select professional templates
 */

import React, { useState } from 'react';
import { Search, Star, Filter, Download, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTemplates } from '@/app/templates/hooks/useTemplates';
import { useTemplateActions } from '@/app/templates/hooks/useTemplateActions';
import { 
  Template, 
  TemplateFilter, 
  TemplateType, 
  TemplateStyle, 
  TemplateComplexity 
} from '@/app/templates/types';

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TemplateType | undefined>();
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle | undefined>();
  const [selectedComplexity, setSelectedComplexity] = useState<TemplateComplexity | undefined>();
  const [sortByPopularity, setSortByPopularity] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const filter: TemplateFilter = {
    search: searchQuery || undefined,
    type: selectedType,
    style: selectedStyle,
    complexity: selectedComplexity,
    sortByPopularity,
  };

  const { templates, loading } = useTemplates(filter);
  const { exportTemplate, importTemplate, loading: actionLoading } = useTemplateActions();

  const handleExport = async (template: Template) => {
    const jsonString = await exportTemplate(template.id);
    if (jsonString) {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '_')}.wbtemplate`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const template = await importTemplate(text);
    if (template) {
      setImportDialogOpen(false);
      // TODO: Replace with toast notification
      console.log('Template imported successfully!');
    }
  };

  const getComplexityColor = (complexity?: TemplateComplexity) => {
    switch (complexity) {
      case TemplateComplexity.BEGINNER:
        return 'text-green-600 bg-green-50';
      case TemplateComplexity.INTERMEDIATE:
        return 'text-blue-600 bg-blue-50';
      case TemplateComplexity.ADVANCED:
        return 'text-orange-600 bg-orange-50';
      case TemplateComplexity.EXPERT:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[1200px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Template Gallery</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setImportDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-gray-600" />
              
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value as TemplateType || undefined)}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="">All Types</option>
                <option value={TemplateType.EDUCATION}>Education</option>
                <option value={TemplateType.MARKETING}>Marketing</option>
                <option value={TemplateType.PRESENTATION}>Presentation</option>
                <option value={TemplateType.TUTORIAL}>Tutorial</option>
                <option value={TemplateType.WHITEBOARD}>Whiteboard</option>
                <option value={TemplateType.TECHNICAL}>Technical</option>
                <option value={TemplateType.EXPLANATORY}>Explanatory</option>
                <option value={TemplateType.PROMOTIONAL}>Promotional</option>
                <option value={TemplateType.ENTERTAINMENT}>Entertainment</option>
              </select>

              <select
                value={selectedStyle || ''}
                onChange={(e) => setSelectedStyle(e.target.value as TemplateStyle || undefined)}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="">All Styles</option>
                <option value={TemplateStyle.MINIMAL}>Minimal</option>
                <option value={TemplateStyle.COLORFUL}>Colorful</option>
                <option value={TemplateStyle.PROFESSIONAL}>Professional</option>
                <option value={TemplateStyle.CREATIVE}>Creative</option>
                <option value={TemplateStyle.DARK}>Dark</option>
                <option value={TemplateStyle.LIGHT}>Light</option>
              </select>

              <select
                value={selectedComplexity || ''}
                onChange={(e) => setSelectedComplexity(e.target.value as TemplateComplexity || undefined)}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="">All Levels</option>
                <option value={TemplateComplexity.BEGINNER}>Beginner</option>
                <option value={TemplateComplexity.INTERMEDIATE}>Intermediate</option>
                <option value={TemplateComplexity.ADVANCED}>Advanced</option>
                <option value={TemplateComplexity.EXPERT}>Expert</option>
              </select>

              <Button
                size="sm"
                variant={sortByPopularity ? 'default' : 'outline'}
                onClick={() => setSortByPopularity(!sortByPopularity)}
                className="h-7 px-2"
              >
                Popular
              </Button>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading templates...</div>
            </div>
          ) : templates.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <p>No templates found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  {/* Thumbnail */}
                  <div 
                    className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center"
                    style={{
                      backgroundColor: template.sceneData.backgroundImage?.startsWith('#') 
                        ? template.sceneData.backgroundImage 
                        : undefined,
                    }}
                  >
                    {template.thumbnail ? (
                      <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <div className="text-4xl mb-2">🎬</div>
                        <div className="text-sm">{template.name}</div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{template.name}</h4>
                      {template.rating && (
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{template.rating.average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {template.type}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                        {template.style}
                      </span>
                      {template.metadata.complexity && (
                        <span className={`text-xs px-2 py-0.5 rounded ${getComplexityColor(template.metadata.complexity)}`}>
                          {template.metadata.complexity}
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-gray-500 mb-3 space-y-1">
                      <div>📊 {template.metadata.layerCount} layers • {template.metadata.cameraCount} cameras</div>
                      {template.metadata.estimatedDuration && (
                        <div>⏱️ ~{Math.round(template.metadata.estimatedDuration / 60)}min</div>
                      )}
                      {template.popularity !== undefined && (
                        <div>🔥 Popularity: {template.popularity}%</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => onSelectTemplate(template)}
                      >
                        Use Template
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExport(template)}
                        disabled={actionLoading}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Import Dialog */}
        {importDialogOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <h4 className="text-lg font-semibold mb-4">Import Template</h4>
              <input
                type="file"
                accept=".wbtemplate,.json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImport(file);
                }}
                className="w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setImportDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;
