import React, { useCallback, useEffect, useState } from 'react';
import { Type, Palette, Maximize, Eye, RotateCw, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface FloatingToolbarProps {
  layer: any;
  position: { x: number; y: number };
  onPropertyChange: (property: string, value: any) => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  layer,
  position,
  onPropertyChange
}) => {
  const [localFontSize, setLocalFontSize] = useState<number>(layer.text_config?.size || 48);
  const [localOpacity, setLocalOpacity] = useState<number>(layer.opacity || 1.0);
  const [localScale, setLocalScale] = useState<number>(layer.scale || 1.0);
  const [localRotation, setLocalRotation] = useState<number>(layer.rotation || 0);

  // Update local state when layer changes
  useEffect(() => {
    if (layer.text_config?.size) setLocalFontSize(layer.text_config.size);
    if (layer.opacity !== undefined) setLocalOpacity(layer.opacity);
    if (layer.scale !== undefined) setLocalScale(layer.scale);
    if (layer.rotation !== undefined) setLocalRotation(layer.rotation);
  }, [layer]);

  const handleTextConfigChange = useCallback((property: string, value: any) => {
    const updatedTextConfig = { ...layer.text_config, [property]: value };
    onPropertyChange('text_config', updatedTextConfig);
  }, [layer.text_config, onPropertyChange]);

  const handleColorChange = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    handleTextConfigChange('color', [r, g, b]);
  }, [handleTextConfigChange]);

  const getColorHex = (colorArr: number[] | string) => {
    if (Array.isArray(colorArr)) {
      return `#${colorArr.map((c: number) => c.toString(16).padStart(2, '0')).join('')}`;
    }
    return colorArr || '#000000';
  };

  const isTextLayer = layer.type === 'text';
  const isImageLayer = layer.type === 'image';

  return (
    <div
      className="absolute bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg p-2 flex items-center gap-2 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 60}px`,
        minWidth: '300px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Text-specific controls */}
      {isTextLayer && (
        <>
          {/* Font Size */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Type className="w-4 h-4 text-gray-600" />
            <input
              type="number"
              value={localFontSize}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLocalFontSize(val);
                handleTextConfigChange('size', val);
              }}
              className="w-16 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              min="12"
              max="120"
            />
          </div>

          {/* Text Color */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Palette className="w-4 h-4 text-gray-600" />
            <input
              type="color"
              value={getColorHex(layer.text_config?.color)}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-200"
            />
          </div>

          {/* Text Alignment */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <button
              onClick={() => handleTextConfigChange('align', 'left')}
              className={`p-1 rounded hover:bg-gray-100 ${layer.text_config?.align === 'left' ? 'bg-purple-100' : ''}`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleTextConfigChange('align', 'center')}
              className={`p-1 rounded hover:bg-gray-100 ${layer.text_config?.align === 'center' ? 'bg-purple-100' : ''}`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleTextConfigChange('align', 'right')}
              className={`p-1 rounded hover:bg-gray-100 ${layer.text_config?.align === 'right' ? 'bg-purple-100' : ''}`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Font Style */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <button
              onClick={() => {
                const currentStyle = layer.text_config?.style || 'normal';
                const newStyle = currentStyle === 'bold' ? 'normal' : 'bold';
                handleTextConfigChange('style', newStyle);
              }}
              className={`px-2 py-1 text-xs font-bold rounded hover:bg-gray-100 ${layer.text_config?.style?.includes('bold') ? 'bg-purple-100' : ''}`}
              title="Bold"
            >
              B
            </button>
            <button
              onClick={() => {
                const currentStyle = layer.text_config?.style || 'normal';
                const newStyle = currentStyle === 'italic' ? 'normal' : 'italic';
                handleTextConfigChange('style', newStyle);
              }}
              className={`px-2 py-1 text-xs italic rounded hover:bg-gray-100 ${layer.text_config?.style?.includes('italic') ? 'bg-purple-100' : ''}`}
              title="Italic"
            >
              I
            </button>
          </div>
        </>
      )}

      {/* Common controls for both text and image */}
      {/* Opacity */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Eye className="w-4 h-4 text-gray-600" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={localOpacity}
          onChange={(e) => {
            const val = Number(e.target.value);
            setLocalOpacity(val);
            onPropertyChange('opacity', val);
          }}
          className="w-16"
          title="Opacity"
        />
        <span className="text-xs text-gray-600">{Math.round(localOpacity * 100)}%</span>
      </div>

      {/* Scale (for images) */}
      {isImageLayer && (
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Maximize className="w-4 h-4 text-gray-600" />
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={localScale}
            onChange={(e) => {
              const val = Number(e.target.value);
              setLocalScale(val);
              onPropertyChange('scale', val);
            }}
            className="w-16"
            title="Scale"
          />
          <span className="text-xs text-gray-600">{localScale.toFixed(1)}x</span>
        </div>
      )}

      {/* Rotation */}
      <div className="flex items-center gap-1">
        <RotateCw className="w-4 h-4 text-gray-600" />
        <input
          type="number"
          value={Math.round(localRotation)}
          onChange={(e) => {
            const val = Number(e.target.value);
            setLocalRotation(val);
            onPropertyChange('rotation', val);
          }}
          className="w-12 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
          min="0"
          max="360"
        />
        <span className="text-xs text-gray-600">°</span>
      </div>
    </div>
  );
};
