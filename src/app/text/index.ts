/**
 * Text Module - Public API
 */

// Hooks
export { useTextLibrary } from './hooks/useTextLibrary';
export { useTextActions } from './hooks/useTextActions';

// Store
export { useTextLibraryStore } from './store';

// Types
export type {
  TextLibraryItem,
  TextStyle,
  TextStroke,
  TextLayerProperties,
  TextAnimation,
  CreateTextPayload,
  UpdateTextPayload,
} from './types';

// Config
export {
  TEXT_CONFIG,
  WEB_SAFE_FONTS,
  GOOGLE_FONTS,
  AVAILABLE_FONTS,
  DEFAULT_TEXT_STYLE,
  TEXT_CONSTRAINTS,
  DEFAULT_TEXT_LAYER_PROPERTIES,
  getGoogleFontsUrl,
} from './config';

// Service (for advanced use)
export { textMockService } from './api/textMockService';
