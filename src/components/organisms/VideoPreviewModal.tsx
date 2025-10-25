import React, { useState, useEffect } from 'react';
import { X, Play, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sceneId?: string;
  isFullPreview?: boolean; // Pour la prévisualisation complète de toutes les scènes
  scenes?: any[]; // Pour la prévisualisation complète
}

const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({ 
  isOpen, 
  onClose,
  sceneId,
  isFullPreview = false,
  scenes = []
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setVideoUrl(null);
      setError(null);
      return;
    }

    // Simuler la récupération de l'URL de la vidéo (mocking)
    const fetchVideoUrl = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simuler un délai de chargement de 2-3 secondes
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
        
        // Mock: Générer une URL de vidéo factice
        // En production, cela appellerait l'API pour générer/récupérer la vidéo
        const mockVideoUrl = isFullPreview
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
        
        setVideoUrl(mockVideoUrl);
      } catch (err) {
        console.error('Erreur lors de la récupération de la vidéo:', err);
        setError('Impossible de charger la prévisualisation vidéo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoUrl();
  }, [isOpen, sceneId, isFullPreview]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center justify-between">
            <span>
              {isFullPreview ? 'Prévisualisation complète' : 'Prévisualisation de la scène'}
            </span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-white text-sm">
                {isFullPreview 
                  ? 'Génération de la vidéo complète en cours...'
                  : 'Génération de la prévisualisation en cours...'}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Cela peut prendre quelques secondes
              </p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
              <div className="text-red-400 text-center">
                <p className="text-lg font-semibold mb-2">Erreur</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {videoUrl && !isLoading && !error && (
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              className="w-full h-full"
              onLoadStart={() => console.log('Vidéo chargée')}
              onError={(e) => {
                console.error('Erreur de lecture vidéo:', e);
                setError('Erreur lors de la lecture de la vidéo');
              }}
            >
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          )}
          
          {!isLoading && !videoUrl && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
              <Play className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-400 text-sm">Aucune vidéo disponible</p>
            </div>
          )}
        </div>
        
        {isFullPreview && scenes.length > 0 && (
          <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>{scenes.length}</strong> scène{scenes.length > 1 ? 's' : ''} incluse{scenes.length > 1 ? 's' : ''} dans cette prévisualisation
            </p>
          </div>
        )}
        
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewModal;
