import React from 'react';
import { Save } from 'lucide-react';
import SceneCanvas from './SceneCanvas';
import type { Camera } from '@/app/scenes/types';

interface LayerEditorCanvasProps {
  scene: any;
  selectedLayerId: string | null;
  onUpdateScene: (updates: any) => void;
  onUpdateLayer: (layer: any) => void;
  onSelectLayer: (layerId: string | null) => void;
  onSelectCamera: (camera: any) => void;
  onSave: () => void;
  sceneZoom?: number;
  onSceneZoomChange?: (zoom: number) => void;
  selectedCameraId?: string | null;
  onCameraStateChange?: (state: {
    cameras: Camera[];
    selectedCameraId: string | null;
    callbacks: {
      onAddCamera?: () => void;
      onToggleLock?: (cameraId: string) => void;
      onSaveCameras?: (cameras: Camera[]) => Promise<void>;
    };
  }) => void;
}

const LayerEditorCanvas: React.FC<LayerEditorCanvasProps> = ({
  scene,
  selectedLayerId,
  onUpdateScene,
  onUpdateLayer,
  onSelectLayer,
  onSelectCamera,
  onSave,
  sceneZoom,
  onSceneZoomChange,
  selectedCameraId,
  onCameraStateChange
}) => {
  return (
    <div className="bg-secondary/20 dark:bg-secondary flex flex-col flex-1 w-full h-full min-w-0 relative">
      <SceneCanvas
        scene={scene}
        onUpdateScene={onUpdateScene}
        onUpdateLayer={onUpdateLayer}
        selectedLayerId={selectedLayerId}
        onSelectLayer={onSelectLayer}
        onSelectCamera={onSelectCamera}
        sceneZoom={sceneZoom}
        onSceneZoomChange={onSceneZoomChange}
        selectedCameraId={selectedCameraId}
        onCameraStateChange={onCameraStateChange}
      />
      
      {/**<button
        onClick={onSave}
        className="absolute bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:shadow-xl z-10"
        title="Sauvegarder les modifications"
      >
        <Save className="w-5 h-5" />
        <span>Sauvegarder</span>
      </button>**/}
    </div>
  );
};

export default React.memo(LayerEditorCanvas);
