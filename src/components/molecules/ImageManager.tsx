/**
 * Image Manager Component
 * Manages image library with upload, preview, and delete functionality
 */

import React, { useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageLibrary, useImageActions, IMAGE_CONFIG } from '@/app/images';
import { useCurrentScene } from '@/app/scenes/hooks/useCurrentScene';
import { useScenesActions } from '@/app/scenes';
import { LayerType, LayerMode } from '@/app/scenes/types';

const ImageManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files } = useImageLibrary();
  const { upload, isUploading, uploadProgress, deleteImage, error } = useImageActions();
  const currentScene = useCurrentScene();
  const { addLayer } = useScenesActions();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        await upload({ file });
      } catch (err) {
        console.error('Failed to upload image:', err);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddToScene = (imageFile: any) => {
    if (!currentScene) {
      alert('Please select a scene first');
      return;
    }

    const newLayer = {
      id: `layer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: imageFile.fileName,
      type: LayerType.IMAGE,
      mode: LayerMode.STATIC,
      position: { x: 100, y: 100 },
      z_index: currentScene.layers.length,
      scale: 1.0,
      opacity: 1.0,
      rotation: 0,
      image_path: imageFile.fileUrl,
      imageId: imageFile.id,
      fileName: imageFile.fileName,
      scaleX: 1.0,
      scaleY: 1.0,
      flipX: false,
      flipY: false,
    };

    addLayer({ sceneId: currentScene.id, layer: newLayer });
  };

  const handleDelete = async (id: string, fileName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}"?`
    );
    if (confirmed) {
      try {
        await deleteImage(id);
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <Button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full"
          size="sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Images'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(',')}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        {error && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500">
          Supported: {IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')} (max {IMAGE_CONFIG.MAX_FILE_SIZE_MB}MB)
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p className="text-sm">No images uploaded</p>
            <p className="text-xs mt-1">Click "Upload Images" to add files</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={file.fileUrl}
                    alt={file.fileName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAddToScene(file)}
                      className="h-8 px-2"
                      title="Add to current scene"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(file.id, file.fileName)}
                      className="h-8 w-8 p-0"
                      title="Delete image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-900 truncate" title={file.fileName}>
                    {file.fileName}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {file.width} × {file.height}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager;
