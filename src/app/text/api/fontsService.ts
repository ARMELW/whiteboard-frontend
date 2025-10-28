import httpClient from '@/services/api/httpClient';
import API_ENDPOINTS from '@/config/api';

export interface Font {
  id: string;
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
  variants: string[];
  weights: number[];
  isPremium: boolean;
  isPopular: boolean;
}

export interface ListFontsParams {
  category?: string;
  premiumOnly?: boolean;
  popularOnly?: boolean;
}

export interface ListFontsResponse {
  success: boolean;
  data: Font[];
}

class FontsService {
  async list(params: ListFontsParams = {}): Promise<Font[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.premiumOnly) queryParams.append('premiumOnly', 'true');
      if (params.popularOnly) queryParams.append('popularOnly', 'true');

      const url = `${API_ENDPOINTS.fonts.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await httpClient.get<ListFontsResponse>(url);
      return response.data.data;
    } catch (error) {
      console.warn('Failed to fetch fonts from API, using fallback', error);
      return this.getFallbackFonts();
    }
  }

  private getFallbackFonts(): Font[] {
    const webSafeFonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
      'Courier New', 'Verdana'
    ];
    
    const googleFonts = [
      'Roboto', 'Open Sans', 'Montserrat', 'Lato', 
      'Poppins', 'Playfair Display', 'Bebas Neue', 'Pacifico'
    ];

    const allFonts = [...webSafeFonts, ...googleFonts];

    return allFonts.map((font, index) => ({
      id: font.toLowerCase().replace(/\s+/g, '-'),
      name: font,
      family: font,
      category: index < webSafeFonts.length ? 'sans-serif' : 'sans-serif',
      variants: ['regular', 'bold'],
      weights: [400, 700],
      isPremium: false,
      isPopular: index < 8,
    }));
  }
}

export default new FontsService();
