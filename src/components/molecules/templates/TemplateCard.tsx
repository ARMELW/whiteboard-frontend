import React from 'react';
import { Card } from '../../atoms';
import { Template, TemplateType, TemplateStyle } from '@/app/templates';
import { Trash2, Download, Image as ImageIcon, Layers, Camera, Music } from 'lucide-react';
import { Button } from '../../atoms';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

const TYPE_LABELS: Record<TemplateType, string> = {
  [TemplateType.EDUCATION]: 'Éducatif',
  [TemplateType.MARKETING]: 'Marketing',
  [TemplateType.PRESENTATION]: 'Présentation',
  [TemplateType.TUTORIAL]: 'Tutoriel',
  [TemplateType.ENTERTAINMENT]: 'Divertissement',
  [TemplateType.OTHER]: 'Autre',
};

const STYLE_LABELS: Record<TemplateStyle, string> = {
  [TemplateStyle.MINIMAL]: 'Minimaliste',
  [TemplateStyle.COLORFUL]: 'Coloré',
  [TemplateStyle.PROFESSIONAL]: 'Professionnel',
  [TemplateStyle.CREATIVE]: 'Créatif',
  [TemplateStyle.DARK]: 'Sombre',
  [TemplateStyle.LIGHT]: 'Clair',
};

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onDelete,
  onExport,
}) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
      <div onClick={() => onSelect(template)}>
        {/* Thumbnail */}
        <div className="relative w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon size={48} />
            </div>
          )}
        </div>

        {/* Template Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm truncate">{template.name}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>

          {/* Type and Style Badges */}
          <div className="flex gap-1 flex-wrap">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {TYPE_LABELS[template.type]}
            </span>
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
              {STYLE_LABELS[template.style]}
            </span>
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {template.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{template.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Layers size={12} />
              {template.metadata.layerCount}
            </span>
            <span className="flex items-center gap-1">
              <Camera size={12} />
              {template.metadata.cameraCount}
            </span>
            {template.metadata.hasAudio && (
              <span className="flex items-center gap-1">
                <Music size={12} />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onExport(template.id);
          }}
          className="flex-1"
        >
          <Download size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(template.id);
          }}
          className="flex-1 text-red-600 hover:text-red-700"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  );
};

export default TemplateCard;
