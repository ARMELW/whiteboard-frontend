import React from 'react';
import { useForm, Controller } from 'react-hook-form';

interface ImagePropertiesFormProps {
  layer: any;
  onPropertyChange: (layerId: string, property: string, value: any) => void;
}

export const ImagePropertiesForm: React.FC<ImagePropertiesFormProps> = ({ layer, onPropertyChange }) => {
  const { control, handleSubmit, watch } = useForm<{ name: string; positionX: number; positionY: number; scale: number; opacity: number; rotation: number; skip_rate: number }>({
    defaultValues: {
      name: layer.name || '',
      positionX: Math.round(layer.position?.x || 0),
      positionY: Math.round(layer.position?.y || 0),
      scale: layer.scale || 1.0,
      opacity: layer.opacity || 1.0,
      rotation: layer.rotation || 0,
      skip_rate: layer.skip_rate || 10,
    },
  });

  const onSubmit = (data: any) => {
    onPropertyChange(layer.id, 'name', data.name);
    onPropertyChange(layer.id, 'position', { x: data.positionX, y: data.positionY });
    onPropertyChange(layer.id, 'scale', data.scale);
    onPropertyChange(layer.id, 'opacity', data.opacity);
    onPropertyChange(layer.id, 'rotation', data.rotation);
    onPropertyChange(layer.id, 'skip_rate', data.skip_rate);
  };

  // useForm.watch ensures we have the latest values; coerce to numbers for display
  const watchedScale = Number(watch('scale') ?? 1);
  const watchedOpacity = Number(watch('opacity') ?? 1);
  const watchedRotation = Number(watch('rotation') ?? 0);

  return (
    <form onBlur={handleSubmit(onSubmit)} className="bg-secondary/30 rounded-lg p-4 border border-border">
      <h3 className="text-foreground font-semibold mb-3 text-sm">Propriétés Image</h3>
      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">Nom</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input {...field} className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nom de la couche" />
          )}
        />
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="block text-foreground text-xs mb-1.5">Position X</label>
          <Controller
            name="positionX"
            control={control}
            render={({ field }) => (
              <input type="number" {...field} className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            )}
          />
        </div>
        <div>
          <label className="block text-foreground text-xs mb-1.5">Position Y</label>
          <Controller
            name="positionY"
            control={control}
            render={({ field }) => (
              <input type="number" {...field} className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            )}
          />
        </div>
      </div>
      <div className="mb-3">
  <label className="block text-foreground text-xs mb-1.5">Échelle: <span className="font-mono">{isNaN(watchedScale) ? '1.00' : watchedScale.toFixed(2)}</span></label>
        <Controller
          name="scale"
          control={control}
          render={({ field }) => (
            <input type="range" min="0.1" max="3" step="0.1" {...field} className="w-full" />
          )}
        />
      </div>
      <div className="mb-3">
  <label className="block text-foreground text-xs mb-1.5">Opacité: <span className="font-mono">{Math.round((isNaN(watchedOpacity) ? 1.0 : watchedOpacity) * 100)}%</span></label>
        <Controller
          name="opacity"
          control={control}
          render={({ field }) => (
            <input type="range" min="0" max="1" step="0.05" {...field} className="w-full" />
          )}
        />
      </div>
      <div className="mb-3">
  <label className="block text-foreground text-xs mb-1.5">Rotation: <span className="font-mono">{Math.round(isNaN(watchedRotation) ? 0 : watchedRotation)}°</span></label>
        <Controller
          name="rotation"
          control={control}
          render={({ field }) => (
            <input type="range" min="0" max="360" step="1" {...field} className="w-full" />
          )}
        />
      </div>
      <div className="mb-3">
        <label className="block text-foreground text-xs mb-1.5">Skip Rate (Vitesse de dessin)</label>
        <Controller
          name="skip_rate"
          control={control}
          render={({ field }) => (
            <input type="number" min="1" max="50" {...field} className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          )}
        />
        <p className="text-gray-500 text-xs mt-1">Plus élevé = dessin plus rapide</p>
      </div>
    </form>
  );
};
