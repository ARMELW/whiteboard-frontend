/**
 * Text Library Configuration
 * Constants and settings for text management
 */

export const TEXT_CONFIG = {
  STORAGE_KEY: 'whiteboard_text_library',
  MAX_CONTENT_LENGTH: 5000,
} as const;

// Web-safe fonts (always available)
export const WEB_SAFE_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
] as const;

// Google Fonts for MVP
export const GOOGLE_FONTS = [
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Playfair Display',
  'Bebas Neue',
  'Pacifico',
] as const;

// All available fonts
export const AVAILABLE_FONTS = [...WEB_SAFE_FONTS, ...GOOGLE_FONTS] as const;

// Google Fonts API URL builder
export const getGoogleFontsUrl = (fonts: readonly string[]) => {
  const formattedFonts = fonts.map(font => 
    `family=${font.replace(/ /g, '+')}:wght@400;700`
  ).join('&');
  return `https://fonts.googleapis.com/css2?${formattedFonts}&display=swap`;
};

// Default text style
export const DEFAULT_TEXT_STYLE = {
  fontFamily: 'Arial',
  fontSize: 48,
  fontWeight: 'normal' as const,
  fontStyle: 'normal' as const,
  textDecoration: 'none' as const,
  color: '#000000',
  textAlign: 'center' as const,
  lineHeight: 1.2,
  letterSpacing: 0,
  opacity: 1.0,
  backgroundColor: null,
  stroke: null,
} as const;

// Slider constraints
export const TEXT_CONSTRAINTS = {
  fontSize: { min: 12, max: 200, default: 48 },
  lineHeight: { min: 0.8, max: 3.0, default: 1.2, step: 0.1 },
  letterSpacing: { min: -5, max: 20, default: 0, step: 0.5 },
  opacity: { min: 0, max: 1, default: 1, step: 0.01 },
  strokeWidth: { min: 0, max: 10, default: 2, step: 0.5 },
} as const;

// Default layer properties for text
export const DEFAULT_TEXT_LAYER_PROPERTIES = {
  x: 100,
  y: 50,
  width: 600,
  height: 100,
  rotation: 0,
  opacity: 1.0,
  scaleX: 1.0,
  scaleY: 1.0,
} as const;
