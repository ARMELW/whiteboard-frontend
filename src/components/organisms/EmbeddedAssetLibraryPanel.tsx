
import React, { useRef, useCallback } from 'react';
import EmbeddedAssetLibrary from '../molecules/EmbeddedAssetLibrary';
import { v4 as uuidv4 } from 'uuid';
import { useSceneStore } from '@/app/scenes';
import { LayerType, LayerMode } from '@/app/scenes/types';
import { ImagePlus } from 'lucide-react';

const EmbeddedAssetLibraryPanel: React.FC = () => {

  const setShowCropModal = useSceneStore((state) => state.setShowCropModal);
  const setPendingImageData = useSceneStore((state) => state.setPendingImageData);
  const addLayer = useSceneStore((state) => state.addLayer);
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const scenes = useSceneStore((state) => state.scenes);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Handle image file selection for direct upload/crop
  const handleImageFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImageData({
        imageUrl: event.target?.result,
        fileName: file.name,
        originalUrl: event.target?.result,
        fileType: file.type
      });
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [setPendingImageData, setShowCropModal]);

  // Handler to add asset as image layer
  const handleSelectAsset = (asset: any) => {
    const scene = scenes[selectedSceneIndex];
    if (!scene) return;
    // Find default camera
    const defaultCamera = (scene.sceneCameras || []).find((c) => c.isDefault) || (scene.cameras || []).find((c) => c.isDefault);
    // Default to center if no camera
    let position = { x: 0.5, y: 0.5 };
    if (defaultCamera) {
      // If camera uses normalized coordinates, use as is
      if (
        typeof defaultCamera.position.x === 'number' &&
        defaultCamera.position.x <= 1 &&
        defaultCamera.position.y <= 1
      ) {
        position = { x: defaultCamera.position.x, y: defaultCamera.position.y };
      } else if (defaultCamera.width && defaultCamera.height) {
        // If absolute, convert to center
        position = {
          x: defaultCamera.position.x * defaultCamera.width,
          y: defaultCamera.position.y * defaultCamera.height,
        };
      }
    }
    const newLayer = {
      id: uuidv4(),
      name: asset.name || 'Image',
      type: LayerType.IMAGE,
      mode: LayerMode.STATIC,
      position,
      z_index: (scene.layers?.length || 0) + 1,
      scale: 1,
      opacity: 1,
      image_path: asset.dataUrl,
    };
    addLayer(scene.id, newLayer);
  };

  return (
    <div className="relative px-2">
      <EmbeddedAssetLibrary onSelectAsset={handleSelectAsset} />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />
      {/* Floating upload bar at bottom */}
      <div className="absolute bottom-0 right-0 z-20 px-4 py-2">
        <button
          onClick={() => imageInputRef.current?.click()}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-border bg-purple-400 shadow-lg hover:bg-secondary/30 hover:scale-105 transition-all pointer-events-auto"
          style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)' }}
          aria-label="Ajouter une image"
        >
          <ImagePlus className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default EmbeddedAssetLibraryPanel;
