/**
 * Google Fonts Loader Utility
 * Dynamically loads Google Fonts into the document
 */

import { GOOGLE_FONTS, getGoogleFontsUrl } from '@/app/text';

/**
 * Load Google Fonts by injecting a link element
 */
export const loadGoogleFonts = (): void => {
  // Check if already loaded
  const existingLink = document.querySelector('link[data-google-fonts]');
  if (existingLink) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = getGoogleFontsUrl(GOOGLE_FONTS);
  link.setAttribute('data-google-fonts', 'true');
  
  document.head.appendChild(link);
};

/**
 * Check if a font is loaded and ready to use
 */
export const isFontReady = async (fontFamily: string): Promise<boolean> => {
  try {
    await document.fonts.load(`16px "${fontFamily}"`);
    return document.fonts.check(`16px "${fontFamily}"`);
  } catch (error) {
    console.warn(`Font ${fontFamily} failed to load:`, error);
    return false;
  }
};

/**
 * Wait for all Google Fonts to be ready
 */
export const waitForFonts = async (): Promise<void> => {
  try {
    await document.fonts.ready;
  } catch (error) {
    console.warn('Error waiting for fonts:', error);
  }
};
