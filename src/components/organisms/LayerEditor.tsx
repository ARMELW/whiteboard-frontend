import React, { useRef, useCallback } from 'react';
import { useSceneStore } from '../../app/scenes';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import {
  useLayerEditor,
  useLayerCreationHandlers
} from '../molecules/layer-management';
import { useLayerCreation } from '../molecules/layer-management/useLayerCreation';
import LayerEditorModals from './LayerEditorModals';
import LayerEditorCanvas from './LayerEditorCanvas';
import VideoPreviewPlayer from './VideoPreviewPlayer';
import { useCurrentScene } from '@/app/scenes';
import { createDefaultCamera } from '@/utils/cameraAnimator';
import type { Camera } from '@/app/scenes/types';

interface LayerEditorProps {
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

const LayerEditor: React.FC<LayerEditorProps> = ({ 
  sceneZoom,
  onSceneZoomChange,
  selectedCameraId: parentSelectedCameraId,
  onCameraStateChange 
}) => {
  const scene = useCurrentScene();
  const showShapeToolbar = useSceneStore((state) => state.showShapeToolbar);
  const setShowShapeToolbar = useSceneStore((state) => state.setShowShapeToolbar);
  const showAssetLibrary = useSceneStore((state) => state.showAssetLibrary);
  const showCropModal = useSceneStore((state) => state.showCropModal);
  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const pendingImageData = useSceneStore((state) => state.pendingImageData);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);
  const selectedLayerId = useSceneStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useSceneStore((state) => state.setSelectedLayerId);
  
  // Preview state
  const previewMode = useSceneStore((state) => state.previewMode);
  const previewVideoUrl = useSceneStore((state) => state.previewVideoUrl);
  const previewType = useSceneStore((state) => state.previewType);
  const stopPreview = useSceneStore((state) => state.stopPreview);

  // Use actions from useScenesActionsWithHistory hook for history tracking
  const { updateScene } = useScenesActionsWithHistory();

  const sceneWidth = 1920;
  const sceneHeight = 1080;
  
  const [selectedCamera, setSelectedCamera] = React.useState<any>(() => {
    const defaultCam = scene?.sceneCameras?.find((cam: any) => cam.isDefault) || 
                       scene?.sceneCameras?.[0] || 
                       createDefaultCamera('16:9');
    return defaultCam;
  });

  const {
    editedScene,
    setEditedScene,
    showThumbnailMaker,
    setShowThumbnailMaker,
    handleUpdateScene,
    handleUpdateLayer,
    handleAddLayer
  } = useLayerEditor({
    scene,
    selectedLayerId,
    onSelectLayer: (layerId: string | null) => setSelectedLayerId(layerId)
  });

  const {
    handleAddShape,
    handleCropComplete: handleCropCompleteBase
  } = useLayerCreationHandlers({
    sceneWidth,
    sceneHeight,
    selectedCamera,
    onAddLayer: handleAddLayer,
    onCloseShapeToolbar: () => setShowShapeToolbar(false)
  });

  const { createImageLayer } = useLayerCreation({ sceneWidth, sceneHeight, selectedCamera });

  // Référence pour tracker l'état précédent et éviter les sauvegardes inutiles
  const lastSavedStateRef = useRef<string>('');
  // autoSaveTimeoutRef and initialLoadRef removed (no auto-save)
  const isSavingRef = useRef(false);

  // Fonction pour créer un hash simple de l'état (pour détecter les changements)
  const createStateHash = useCallback((state: any) => {
    return JSON.stringify({
      layers: state.layers?.map((l: any) => ({ id: l.id, ...l })),
      sceneCameras: state.sceneCameras,
      backgroundImage: state.backgroundImage,
      duration: state.duration,
      title: state.title,
      content: state.content,
      animation: state.animation,
      multiTimeline: state.multiTimeline,
      audio: state.audio,
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!scene?.id || isSavingRef.current) return;
    
    try {
      isSavingRef.current = true;
      
      // Créer un hash de l'état actuel
      const currentStateHash = createStateHash(editedScene);
      
      // Vérifier si l'état a réellement changé
      if (currentStateHash === lastSavedStateRef.current) {
        console.log('[LayerEditor] No changes detected, skipping save');
        return;
      }

      console.log('[LayerEditor] Auto-saving scene...');
      
      // Pass a Scene-shaped object instead of { id, data: { ... } }
      await updateScene({
        // ensure id is preserved and pass the edited scene fields directly
        ...(editedScene || {}),
        id: scene.id,
      });
      
      // Mettre à jour l'état sauvegardé après une sauvegarde réussie
      lastSavedStateRef.current = currentStateHash;
      console.log('[LayerEditor] Scene saved successfully');
    } catch (err) {
      console.error('[LayerEditor] Auto-save failed', err);
    } finally {
      isSavingRef.current = false;
    }
  }, [scene?.id, editedScene, updateScene, createStateHash]);

  // Auto-save removed: user must save manually

  // Sauvegarder avant de quitter la page
  /**useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (autoSaveTimeoutRef.current) {
        // Exécuter immédiatement la sauvegarde avant de quitter
        handleSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleSave]);
  **/

  const handleCropComplete = async (croppedImageUrl: string, imageDimensions?: { width: number; height: number }) => {
    const newLayer = await handleCropCompleteBase(croppedImageUrl, imageDimensions, pendingImageData, editedScene.layers.length);
    if (!newLayer) {
      try {
        if (croppedImageUrl && pendingImageData) {
          const fallback = createImageLayer(
            croppedImageUrl,
            pendingImageData.fileName || 'image',
            imageDimensions || (pendingImageData.originalWidth && pendingImageData.originalHeight ? { width: pendingImageData.originalWidth, height: pendingImageData.originalHeight } : null),
            editedScene.layers.length
          );
          handleAddLayer(fallback);
        } else {
          console.warn('[LayerEditor] cannot create fallback image layer: missing data', { croppedImageUrl, pendingImageData });
        }
      } catch (err) {
        console.error('[LayerEditor] fallback createImageLayer failed', err);
      }
    }

    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setPendingImageData(null);
  };

  const handleAddShapeWrapper = (shapeLayer: any) => {
    handleAddShape(shapeLayer, editedScene.layers.length);
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      {/* Show Video Preview or Normal Editor */}
      {previewMode && previewVideoUrl ? (
        <VideoPreviewPlayer
          videoUrl={previewVideoUrl}
          onClose={stopPreview}
          title={previewType === 'scene' ? 'Prévisualisation Scène' : 'Prévisualisation Complète'}
        />
      ) : (
        <>
          <LayerEditorModals
            showShapeToolbar={showShapeToolbar}
            showAssetLibrary={showAssetLibrary}
            showCropModal={showCropModal}
            showThumbnailMaker={showThumbnailMaker}
            pendingImageData={pendingImageData}
            scene={editedScene}
            onCloseShapeToolbar={() => setShowShapeToolbar(false)}
            onCloseThumbnailMaker={() => setShowThumbnailMaker(false)}
            onAddShape={handleAddShapeWrapper}
            onCropComplete={handleCropComplete}
            onCropCancel={handleCropCancel}
            onSaveThumbnail={(updatedScene) => {
              setEditedScene(updatedScene);
              setShowThumbnailMaker(false);
            }}
          />

          <LayerEditorCanvas
            scene={editedScene}
            selectedLayerId={selectedLayerId}
            onUpdateScene={handleUpdateScene}
            onUpdateLayer={handleUpdateLayer}
            onSelectLayer={setSelectedLayerId}
            onSelectCamera={setSelectedCamera}
            onSave={handleSave}
            sceneZoom={sceneZoom}
            onSceneZoomChange={onSceneZoomChange}
            selectedCameraId={parentSelectedCameraId}
            onCameraStateChange={onCameraStateChange}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(LayerEditor);