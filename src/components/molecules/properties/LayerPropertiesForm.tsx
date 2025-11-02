import React from 'react';
import { TextPropertiesForm } from './TextPropertiesForm';
import { ImagePropertiesForm } from './ImagePropertiesForm';
import { ShapePropertiesForm } from './ShapePropertiesForm';

export interface LayerPropertiesFormProps {
  layer: any;
  onPropertyChange: (layerId: string, property: string, value: any) => void;
}

export const LayerPropertiesForm: React.FC<LayerPropertiesFormProps> = React.memo(({ layer, onPropertyChange }) => {
  if (!layer) return null;
  if (layer.type === 'text') {
    return <TextPropertiesForm layer={layer} onPropertyChange={onPropertyChange} />;
  }
  if (layer.type === 'image') {
    return <ImagePropertiesForm layer={layer} onPropertyChange={onPropertyChange} />;
  }
  if (layer.type === 'shape') {
    return <ShapePropertiesForm layer={layer} onPropertyChange={onPropertyChange} />;
  }
  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border">
      <h3 className="text-foreground font-semibold mb-3 text-sm">
        Propriétés de la Couche Sélectionnée
      </h3>
      <p className="text-xs text-muted-foreground">Aucun formulaire dédié pour ce type de calque.</p>
    </div>
  );
});
