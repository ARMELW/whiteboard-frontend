/**
 * TextPreview Component
 * Shows a preview of the styled text
 */

import React from 'react';
import { TextStyle } from '@/app/text';

interface TextPreviewProps {
  content: string;
  style: TextStyle;
  className?: string;
}

export const TextPreview: React.FC<TextPreviewProps> = ({ content, style, className = '' }) => {
  const textStyles: React.CSSProperties = {
    fontFamily: style.fontFamily,
    fontSize: `${style.fontSize}px`,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    color: style.color,
    textAlign: style.textAlign,
    lineHeight: style.lineHeight,
    letterSpacing: `${style.letterSpacing}px`,
    opacity: style.opacity,
    backgroundColor: style.backgroundColor || 'transparent',
    padding: '1rem',
    minHeight: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  };

  if (style.stroke) {
    Object.assign(textStyles, {
      WebkitTextStroke: `${style.stroke.width}px ${style.stroke.color}`,
    });
  }

  return (
    <div className={`border border-border rounded-lg bg-secondary/20 overflow-hidden ${className}`}>
      <div className="bg-secondary/50 px-3 py-2 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground">Aperçu</p>
      </div>
      <div style={textStyles}>
        {content || 'Votre texte ici...'}
      </div>
    </div>
  );
};
