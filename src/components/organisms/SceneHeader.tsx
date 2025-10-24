import React from 'react';
import CameraToolbar from '../molecules/CameraToolbar';
import CameraManagerModal from './CameraManagerModal';
import type { Camera } from '@/app/scenes/types';

interface SceneHeaderProps {
  sceneCameras: Camera[];
  selectedCameraId: string;
  onAddCamera: () => void;
  onSelectCamera: (id: string | null) => void;
  onZoomCamera: () => void;
  onToggleLock: (cameraId: string) => void;
  sceneZoom: number;
  onSceneZoom: (zoom: number) => void;
  onFitToViewport: () => void;
  showCameraManager: boolean;
  setShowCameraManager: (show: boolean) => void;
  onSaveCameras: (updated: Camera[]) => Promise<void>;
}

const SceneHeader: React.FC<SceneHeaderProps> = ({
  sceneCameras,
  selectedCameraId,
  onAddCamera,
  onSelectCamera,
  onZoomCamera,
  onToggleLock,
  sceneZoom,
  onSceneZoom,
  onFitToViewport,
  showCameraManager,
  setShowCameraManager,
  onSaveCameras,
}) => (
  <div className="bg-white border-b border-border">
    <CameraToolbar
      cameras={sceneCameras}
      selectedCameraId={selectedCameraId}
      onAddCamera={onAddCamera}
      onSelectCamera={onSelectCamera}
      onZoomCamera={onZoomCamera}
      onToggleLock={onToggleLock}
      sceneZoom={sceneZoom}
      onSceneZoom={onSceneZoom}
      onFitToViewport={onFitToViewport}
      onOpenCameraManager={() => setShowCameraManager(true)}
    />
    {showCameraManager && (
      <CameraManagerModal
        cameras={sceneCameras}
        onClose={() => setShowCameraManager(false)}
        onSave={onSaveCameras}
      />
    )}
  </div>
);

export default SceneHeader;
