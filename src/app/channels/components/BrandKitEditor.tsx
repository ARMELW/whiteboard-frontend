import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './ColorPicker';
import { Channel, BrandKit } from '../types';
import { useChannelsActions } from '../hooks/useChannelsActions';
import { Upload, Loader2 } from 'lucide-react';

interface BrandKitEditorProps {
  channel: Channel;
  onUpdate?: () => void;
}

export function BrandKitEditor({ channel, onUpdate }: BrandKitEditorProps) {
  const { updateChannel, uploadLogo, isUpdating } = useChannelsActions();
  const [colors, setColors] = useState(channel.brand_kit.colors);
  const [uploading, setUploading] = useState(false);

  const handleColorChange = async (colorKey: keyof BrandKit['colors'], value: string) => {
    const newColors = { ...colors, [colorKey]: value };
    setColors(newColors);
    
    try {
      await updateChannel(channel.id, {
        brand_kit: { colors: newColors },
      });
      onUpdate?.();
    } catch (error) {
      // Error handled by action
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Maximum 5 MB.');
      return;
    }

    setUploading(true);
    try {
      await uploadLogo(channel.id, file);
      onUpdate?.();
    } catch (error) {
      // Error handled by action
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo de la chaîne</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {channel.brand_kit.logo_url ? (
              <img
                src={channel.brand_kit.logo_url}
                alt="Logo"
                className="w-24 h-24 rounded-lg object-cover border-2"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold text-3xl border-2"
                style={{ backgroundColor: channel.brand_kit.colors.primary }}
              >
                {channel.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <label htmlFor="logo-upload">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Télécharger un logo
                    </>
                  )}
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                PNG, JPG ou SVG. Max 5 MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Palette de couleurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPicker
            label="Couleur primaire"
            value={colors.primary}
            onChange={(value) => handleColorChange('primary', value)}
          />
          <ColorPicker
            label="Couleur secondaire"
            value={colors.secondary}
            onChange={(value) => handleColorChange('secondary', value)}
          />
          <ColorPicker
            label="Couleur d'accent"
            value={colors.accent}
            onChange={(value) => handleColorChange('accent', value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center justify-center p-8 border-2 border-dashed rounded-lg">
            <div
              className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-bold text-4xl shadow-lg"
              style={{ backgroundColor: colors.primary }}
            >
              {channel.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-2">
              <div
                className="h-8 w-48 rounded"
                style={{ backgroundColor: colors.secondary }}
              />
              <div
                className="h-8 w-32 rounded"
                style={{ backgroundColor: colors.accent }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
