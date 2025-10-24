import React, { useState, useRef } from 'react';
import { Film, Download, Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { Button } from '../atoms';

const VideoGenerationPanel: React.FC = () => {
  const { generateVideo, downloadVideo, reset, currentJob, isGenerating, error, progress } =
    useVideoGeneration();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
  };

  const handleGenerate = () => {
    generateVideo(audioFile || undefined);
  };

  const handleDownload = () => {
    downloadVideo();
    reset();
  };

  return (
    <div className="space-y-4">
      {/* Audio Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Musique de Fond (Optionnel)
        </label>

        {!audioFile ? (
          <button
            onClick={() => audioInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-secondary/30 transition-colors"
          >
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ajouter Musique de Fond</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border">
            <Upload className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{audioFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(audioFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={handleRemoveAudio}
              className="p-1 hover:bg-secondary rounded transition-colors"
              title="Supprimer"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}

        <input
          ref={audioInputRef}
          type="file"
          accept="audio/mp3,audio/mpeg,audio/wav"
          onChange={handleAudioUpload}
          className="hidden"
        />
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-300">Génération en cours...</p>
              <div className="mt-2 h-2 bg-blue-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-blue-400">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isGenerating && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-300">Oups, réessayez</p>
              <p className="text-xs text-red-400 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {currentJob?.status === 'completed' && !isGenerating && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-300">Vidéo prête!</p>
              <p className="text-xs text-green-400 mt-1">Votre vidéo est prête à être téléchargée</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {currentJob?.status === 'completed' ? (
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
        >
          <Download className="w-6 h-6" />
          Télécharger la Vidéo
        </button>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg ${
            isGenerating
              ? 'bg-secondary text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <Film className="w-6 h-6" />
          {isGenerating ? 'Génération en cours...' : 'Générer la Vidéo'}
        </button>
      )}

      {/* Info */}
      <div className="p-3 bg-secondary/30 rounded-lg text-xs text-muted-foreground">
        <p>
          <strong>Note:</strong> La génération peut prendre quelques minutes selon la complexité de
          votre projet.
        </p>
      </div>
    </div>
  );
};

export default VideoGenerationPanel;
