/**
 * Multi-Camera View Component
 * Surveillance-style camera view system with grid layouts and automatic sequencing
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Maximize2, 
  Grid3x3, 
  Grid2x2, 
  Rows3, 
  X, 
  Play, 
  Pause, 
  AlertTriangle,
  Plus,
  Trash2,
  Video,
  VideoOff,
  Clock
} from 'lucide-react';
import { Button } from '@/components/atoms';
import { Camera as CameraType } from '@/app/scenes/types';

export type GridLayout = '1x1' | '2x2' | '3x3' | '2x3';

export interface CameraFeed extends CameraType {
  location?: string;
  status?: 'active' | 'inactive' | 'error';
  recording?: boolean;
  lastMotion?: Date;
}

interface MultiCameraViewProps {
  cameras: CameraFeed[];
  onCamerasChange?: (cameras: CameraFeed[]) => void;
  onCameraSelect?: (camera: CameraFeed | null) => void;
  defaultLayout?: GridLayout;
  enableSequencing?: boolean;
  sequenceDuration?: number;
  className?: string;
}

const MultiCameraView: React.FC<MultiCameraViewProps> = ({
  cameras: initialCameras,
  onCamerasChange,
  onCameraSelect,
  defaultLayout = '2x2',
  enableSequencing = false,
  sequenceDuration = 10000,
  className = '',
}) => {
  const [cameras, setCameras] = useState<CameraFeed[]>(initialCameras);
  const [layout, setLayout] = useState<GridLayout>(defaultLayout);
  const [fullscreenCamera, setFullscreenCamera] = useState<CameraFeed | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(null);
  const [isSequencing, setIsSequencing] = useState(false);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic camera sequencing
  useEffect(() => {
    if (!isSequencing || !enableSequencing || fullscreenCamera === null) return;

    const activeCameras = cameras.filter(cam => cam.status === 'active');
    if (activeCameras.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSequenceIndex((prev) => {
        const nextIndex = (prev + 1) % activeCameras.length;
        setFullscreenCamera(activeCameras[nextIndex]);
        return nextIndex;
      });
    }, sequenceDuration);

    return () => clearInterval(timer);
  }, [isSequencing, enableSequencing, cameras, sequenceDuration, fullscreenCamera]);

  // Notify parent of camera changes
  useEffect(() => {
    onCamerasChange?.(cameras);
  }, [cameras, onCamerasChange]);

  const addCamera = useCallback(() => {
    const newId = `camera-${Date.now()}`;
    const newCamera: CameraFeed = {
      id: newId,
      name: `Caméra ${cameras.length + 1}`,
      location: 'Non assignée',
      status: 'active',
      recording: true,
      position: { x: 0.5, y: 0.5 },
      zoom: 1,
    };

    setCameras([...cameras, newCamera]);
  }, [cameras]);

  const removeCamera = useCallback((id: string) => {
    setCameras(cameras.filter(cam => cam.id !== id));
    if (selectedCamera?.id === id) {
      setSelectedCamera(null);
      onCameraSelect?.(null);
    }
    if (fullscreenCamera?.id === id) {
      setFullscreenCamera(null);
    }
  }, [cameras, selectedCamera, fullscreenCamera, onCameraSelect]);

  const toggleRecording = useCallback((id: string) => {
    setCameras(cameras.map(cam => 
      cam.id === id ? { ...cam, recording: !cam.recording } : cam
    ));
  }, [cameras]);

  const handleCameraSelect = useCallback((camera: CameraFeed) => {
    setSelectedCamera(camera);
    onCameraSelect?.(camera);
  }, [onCameraSelect]);

  const enterFullscreen = useCallback((camera: CameraFeed) => {
    setFullscreenCamera(camera);
    setIsSequencing(false);
  }, []);

  const exitFullscreen = useCallback(() => {
    setFullscreenCamera(null);
    setIsSequencing(false);
  }, []);

  const startSequencing = useCallback(() => {
    const activeCameras = cameras.filter(cam => cam.status === 'active');
    if (activeCameras.length > 0) {
      setFullscreenCamera(activeCameras[0]);
      setCurrentSequenceIndex(0);
      setIsSequencing(true);
    }
  }, [cameras]);

  const stopSequencing = useCallback(() => {
    setIsSequencing(false);
  }, []);

  const getGridClass = () => {
    switch(layout) {
      case '1x1': return 'grid-cols-1 grid-rows-1';
      case '2x2': return 'grid-cols-2 grid-rows-2';
      case '3x3': return 'grid-cols-3 grid-rows-3';
      case '2x3': return 'grid-cols-2 grid-rows-3';
      default: return 'grid-cols-2 grid-rows-2';
    }
  };

  const getMaxCamerasForLayout = () => {
    switch(layout) {
      case '1x1': return 1;
      case '2x2': return 4;
      case '3x3': return 9;
      case '2x3': return 6;
      default: return 4;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`multi-camera-view flex flex-col h-full bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Camera className="h-6 w-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Centre de Surveillance</h2>
              <p className="text-sm text-gray-400">{formatDate(time)} - {formatTime(time)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Layout Controls */}
            <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setLayout('1x1')}
                className={`p-2 rounded transition-colors ${
                  layout === '1x1' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
                title="Vue unique"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayout('2x2')}
                className={`p-2 rounded transition-colors ${
                  layout === '2x2' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
                title="Grille 2x2"
              >
                <Grid2x2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayout('3x3')}
                className={`p-2 rounded transition-colors ${
                  layout === '3x3' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
                title="Grille 3x3"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayout('2x3')}
                className={`p-2 rounded transition-colors ${
                  layout === '2x3' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
                title="Grille 2x3"
              >
                <Rows3 className="h-4 w-4" />
              </button>
            </div>

            {/* Sequencing Controls */}
            {enableSequencing && (
              <button
                onClick={isSequencing ? stopSequencing : startSequencing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isSequencing
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isSequencing ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Arrêter</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Séquencer</span>
                  </>
                )}
              </button>
            )}

            {/* Add Camera */}
            <button
              onClick={addCamera}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter</span>
            </button>
          </div>
        </div>

        {/* Camera Count */}
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-300">
              {cameras.filter(c => c.status === 'active').length} active{cameras.filter(c => c.status === 'active').length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-gray-300">
              {cameras.filter(c => c.recording).length} en enregistrement
            </span>
          </div>
          <div className="text-gray-400">
            Total: {cameras.length} caméra{cameras.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {fullscreenCamera ? (
          // Fullscreen Mode
          <div className="h-full flex flex-col">
            <CameraFeedDisplay
              camera={fullscreenCamera}
              isFullscreen={true}
              isSequencing={isSequencing}
              onClose={exitFullscreen}
              onToggleRecording={() => toggleRecording(fullscreenCamera.id)}
            />
          </div>
        ) : (
          // Grid Mode
          <div className={`grid ${getGridClass()} gap-4 h-full`}>
            {cameras.slice(0, getMaxCamerasForLayout()).map((camera) => (
              <CameraFeedDisplay
                key={camera.id}
                camera={camera}
                isSelected={selectedCamera?.id === camera.id}
                onSelect={() => handleCameraSelect(camera)}
                onFullscreen={() => enterFullscreen(camera)}
                onRemove={() => removeCamera(camera.id)}
                onToggleRecording={() => toggleRecording(camera.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CameraFeedDisplayProps {
  camera: CameraFeed;
  isFullscreen?: boolean;
  isSelected?: boolean;
  isSequencing?: boolean;
  onSelect?: () => void;
  onFullscreen?: () => void;
  onClose?: () => void;
  onRemove?: () => void;
  onToggleRecording?: () => void;
}

const CameraFeedDisplay: React.FC<CameraFeedDisplayProps> = ({
  camera,
  isFullscreen = false,
  isSelected = false,
  isSequencing = false,
  onSelect,
  onFullscreen,
  onClose,
  onRemove,
  onToggleRecording,
}) => {
  const [motion, setMotion] = useState(false);
  const [localTime, setLocalTime] = useState(new Date());

  // Simulate motion detection
  useEffect(() => {
    if (camera.status === 'active') {
      const motionInterval = setInterval(() => {
        setMotion(Math.random() > 0.85);
      }, 3000);
      return () => clearInterval(motionInterval);
    }
  }, [camera.status]);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setLocalTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getStatusColor = () => {
    switch (camera.status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden border-2 transition-all ${
        isSelected ? 'border-blue-500' : 'border-gray-700'
      } ${!isFullscreen && 'cursor-pointer hover:border-blue-400'}`}
      onClick={!isFullscreen ? onSelect : undefined}
    >
      {/* Video Feed Placeholder */}
      <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
        {camera.status === 'active' ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900">
            {/* Simulated camera feed - replace with actual video/canvas rendering */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-600" />
            </div>
            
            {/* Motion indicator */}
            {motion && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Mouvement détecté</span>
              </div>
            )}

            {/* Recording indicator */}
            {camera.recording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-medium">REC</span>
              </div>
            )}

            {/* Sequencing indicator */}
            {isSequencing && isFullscreen && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Séquençage actif</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <p className="text-gray-400">Caméra {camera.status === 'error' ? 'hors ligne' : 'inactive'}</p>
          </div>
        )}

        {/* Camera Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
                <h3 className="text-white font-semibold">{camera.name}</h3>
              </div>
              {camera.location && (
                <p className="text-gray-300 text-sm">{camera.location}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">{formatTime(localTime)}</p>
            </div>

            {!isFullscreen && (
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRecording?.();
                  }}
                  className={`p-2 rounded transition-colors ${
                    camera.recording
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                  title={camera.recording ? 'Arrêter enregistrement' : 'Démarrer enregistrement'}
                >
                  {camera.recording ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFullscreen?.();
                  }}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  title="Plein écran"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.();
                  }}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Controls */}
      {isFullscreen && onClose && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={onToggleRecording}
            className={`p-3 rounded-lg transition-colors ${
              camera.recording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {camera.recording ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiCameraView;
