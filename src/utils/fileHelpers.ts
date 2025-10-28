/**
 * File utility functions for handling data URLs, blobs, and file conversions
 */

/**
 * Convert a data URL to a Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

/**
 * Convert a data URL to a File object
 */
export function dataUrlToFile(dataUrl: string, filename: string): File {
  const blob = dataUrlToBlob(dataUrl);
  return new File([blob], filename, { type: blob.type });
}

/**
 * Get the extension from a data URL
 */
export function getExtensionFromDataUrl(dataUrl: string): string {
  const mimeMatch = dataUrl.match(/data:(.*?);/);
  if (!mimeMatch) return 'png';
  
  const mime = mimeMatch[1];
  const mimeToExt: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  
  return mimeToExt[mime] || 'png';
}

/**
 * Get file size from data URL
 */
export function getDataUrlSize(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1];
  if (!base64) return 0;
  
  // Base64 encoding increases size by ~33%, so calculate approximate original size
  const padding = (base64.match(/=/g) || []).length;
  return Math.floor((base64.length * 3) / 4 - padding);
}
