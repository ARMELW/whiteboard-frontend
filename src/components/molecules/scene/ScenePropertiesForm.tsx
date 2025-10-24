import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ScenePropertiesFormProps {
  scene: any;
  onChange: (field: string, value: any) => void;
}

export const ScenePropertiesForm: React.FC<ScenePropertiesFormProps> = ({ scene, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Titre de la scène
        </label>
        <input
          type="text"
          value={scene.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full bg-secondary/30 text-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          placeholder="Entrez le titre..."
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Contenu
        </label>
        <textarea
          value={scene.content}
          onChange={(e) => onChange('content', e.target.value)}
          className="w-full bg-secondary/30 text-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary h-28 resize-none transition-all"
          placeholder="Entrez le contenu..."
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Durée (secondes)
        </label>
        <input
          type="number"
          min="1"
          max="60"
          value={scene.duration}
          onChange={(e) => onChange('duration', parseInt(e.target.value) || 5)}
          className="w-full bg-secondary/30 text-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      {/* Slide Duration */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Durée du slide (secondes)
        </label>
        <input
          type="number"
          min="1"
          max="60"
          value={scene.slide_duration || 5}
          onChange={(e) => onChange('slide_duration', parseInt(e.target.value) || 5)}
          className="w-full bg-secondary/30 text-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      {/* Background Image */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Image de fond (URL)
        </label>
        <input
          type="text"
          value={scene.backgroundImage || ''}
          onChange={(e) => onChange('backgroundImage', e.target.value || null)}
          className="w-full bg-secondary/30 text-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          placeholder="https://example.com/image.jpg"
        />
        {scene.backgroundImage && (
          <div className="mt-3">
            <img
              src={scene.backgroundImage}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Animation Type */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Type d'animation
        </label>
        <Select
          value={scene.animation}
          onValueChange={(value) => onChange('animation', value)}
        >
          <SelectTrigger className="w-full bg-secondary/30 text-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            <SelectValue placeholder="Sélectionner une animation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="slide">Slide</SelectItem>
            <SelectItem value="scale">Scale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transition Type */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Type de transition
        </label>
        <Select
          value={scene.transition_type || 'none'}
          onValueChange={(value) => onChange('transition_type', value)}
        >
          <SelectTrigger className="w-full bg-secondary/30 text-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            <SelectValue placeholder="Sélectionner une transition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune</SelectItem>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="slide">Slide</SelectItem>
            <SelectItem value="zoom">Zoom</SelectItem>
            <SelectItem value="wipe">Wipe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dragging Speed */}
      <div>
        <label className="block text-white font-semibold mb-2 text-sm">
          Vitesse de défilement
        </label>
        <Select
          value={(scene.dragging_speed || 1).toString()}
          onValueChange={(value) => onChange('dragging_speed', parseFloat(value))}
        >
          <SelectTrigger className="w-full bg-secondary/30 text-white border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            <SelectValue placeholder="Sélectionner une vitesse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5">0.5x (Lent)</SelectItem>
            <SelectItem value="1">1x (Normal)</SelectItem>
            <SelectItem value="2">2x (Rapide)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sync Slide with Voice Over */}
      <div className="flex items-center justify-between">
        <label className="text-white font-semibold text-sm">
          Synchroniser le slide avec la voix off
        </label>
        <Switch
          checked={scene.sync_slide_with_voice || false}
          onCheckedChange={(checked) => onChange('sync_slide_with_voice', checked)}
        />
      </div>
    </div>
  );
};
