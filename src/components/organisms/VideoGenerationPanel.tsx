import React, { useState, useRef, useMemo } from 'react';
import { Film, Download, Upload, X, Loader2, AlertCircle, CheckCircle, Play } from 'lucide-react';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { useSceneStore } from '@/app/scenes';
import { Button } from '../atoms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VideoGenerationPanel: React.FC = () => {
  const { generateVideo, downloadVideo, reset, currentJob, isGenerating, error, progress } =
    useVideoGeneration();
  const scenes = useSceneStore((state) => state.scenes);
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'mp4' | 'webm'>('mp4');
  const [quality, setQuality] = useState<'hd' | 'fullhd' | '4k'>('fullhd');
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const [startFromScene, setStartFromScene] = useState<number>(0);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const totalDuration = useMemo(() => {
    const scenesToInclude = scenes.slice(startFromScene);
    return scenesToInclude.reduce((acc, scene) => acc + (scene.duration || 0), 0);
  }, [scenes, startFromScene]);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
    e.target.value = '';
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
  };

  const handleGenerate = () => {
    generateVideo(audioFile || undefined, { format, quality, fps });
  };

  const handleDownload = () => {
    downloadVideo();
    reset();
  };

  return (
    <div className="space-y-4">
      {/* Generation Parameters */}
      <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2">Paramètres de Génération</h3>
        
        {/* Start Scene Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground">Commencer à partir de la scène</label>
          <Select value={startFromScene.toString()} onValueChange={(value) => setStartFromScene(parseInt(value))}>
            <SelectTrigger className="w-full bg-white text-foreground border border-border rounded px-3 py-2 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scenes.map((scene, index) => (
                <SelectItem key={scene.id} value={index.toString()}>
                  Scène {index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Format Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground">Format</label>
          <Select value={format} onValueChange={(value: 'mp4' | 'webm') => setFormat(value)}>
            <SelectTrigger className="w-full bg-white text-foreground border border-border rounded px-3 py-2 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4 (recommandé)</SelectItem>
              <SelectItem value="webm">WebM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quality Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground">Qualité</label>
          <Select value={quality} onValueChange={(value: 'hd' | 'fullhd' | '4k') => setQuality(value)}>
            <SelectTrigger className="w-full bg-white text-foreground border border-border rounded px-3 py-2 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hd">HD (1280×720)</SelectItem>
              <SelectItem value="fullhd">Full HD (1920×1080)</SelectItem>
              <SelectItem value="4k">4K (3840×2160)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* FPS Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-foreground">Images par seconde (FPS)</label>
          <Select value={fps.toString()} onValueChange={(value) => setFps(parseInt(value) as 24 | 30 | 60)}>
            <SelectTrigger className="w-full bg-white text-foreground border border-border rounded px-3 py-2 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 FPS (cinéma)</SelectItem>
              <SelectItem value="30">30 FPS (standard)</SelectItem>
              <SelectItem value="60">60 FPS (fluide)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Total Duration Display */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Durée totale:</span>
            <span className="font-semibold text-foreground">
              {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toFixed(0).padStart(2, '0')} min
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
            <span>Scènes à générer:</span>
            <span>{scenes.length - startFromScene} / {scenes.length}</span>
          </div>
        </div>
      </div>

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

      {/* Success State with Preview Button */}
      {currentJob?.status === 'completed' && !isGenerating && (
        <div className="space-y-3">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-300">Vidéo prête!</p>
                <p className="text-xs text-green-400 mt-1">Votre vidéo est prête à être téléchargée ou prévisualisée</p>
              </div>
            </div>
          </div>

          {/* Preview and Download Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (currentJob.videoUrl) {
                  useSceneStore.getState().startPreview(currentJob.videoUrl, 'full');
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              <Play className="w-5 h-5" />
              Prévisualiser
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              Télécharger
            </button>
          </div>
        </div>
      )}

      {/* Action Button - Only show if not completed */}
      {currentJob?.status !== 'completed' && (
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
