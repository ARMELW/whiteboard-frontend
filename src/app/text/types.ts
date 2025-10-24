/**
 * Text Management Types
 * Defines the structure for text library items and text styling
 */

export interface TextStroke {
  color: string;
  width: number;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  opacity: number;
  backgroundColor: string | null;
  stroke: TextStroke | null;
}

export interface TextLibraryItem {
  id: string;
  content: string;
  style: TextStyle;
  createdAt: string;
  usageCount: number;
}

export interface TextLayerProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  scaleX: number;
  scaleY: number;
}

export interface TextAnimation {
  type: 'none' | 'fade-in' | 'fade-out' | 'slide-in' | 'typewriter';
  duration: number;
  delay: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface TextLibraryState {
  items: TextLibraryItem[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateTextPayload {
  content: string;
  style: Partial<TextStyle>;
}

export interface UpdateTextPayload {
  id: string;
  content?: string;
  style?: Partial<TextStyle>;
}
