import { useCallback } from 'react';
import { useLayerCreation, LayerCreationOptions } from './useLayerCreation';

export const useImageHandling = (options: LayerCreationOptions) => {
  const { createImageLayer } = useLayerCreation(options);

  const handleCropComplete = useCallback(async (
    croppedImageUrl: string,
    imageDimensions: any,
    pendingImageData: any,
    layersLength: number,
    tags?: string[]
  ) => {
    if (!pendingImageData) return null;

    let imageUrl = croppedImageUrl;

    try {
      console.debug('[useImageHandling] handleCropComplete called', { croppedImageUrl, imageDimensions, pendingImageData, layersLength, tags });
      
      // Upload to backend instead of localStorage
      const { dataUrlToFile, getExtensionFromDataUrl } = await import('../../../utils/fileHelpers');
      const { default: assetsService } = await import('../../../app/assets/api/assetsService');
      
      const extension = getExtensionFromDataUrl(croppedImageUrl);
      const filename = `${pendingImageData.fileName.replace(/\.[^.]+$/, '')}.${extension}`;
      const file = dataUrlToFile(croppedImageUrl, filename);
      
      const uploadedAsset = await assetsService.upload(file, {
        name: pendingImageData.fileName,
        tags: tags || [],
        dimensions: imageDimensions || null,
      });
      
      // Use the backend URL instead of dataURL
      imageUrl = uploadedAsset.url || croppedImageUrl;
      console.debug('[useImageHandling] asset uploaded successfully', uploadedAsset);
    } catch (error) {
      console.error('Error uploading asset to backend, using dataURL fallback:', error);
      // Fall back to using the dataURL if upload fails
    }

    const layer = createImageLayer(
      imageUrl,
      pendingImageData.fileName,
      imageDimensions,
      layersLength
    );
    console.debug('[useImageHandling] createImageLayer returned', layer);
    return layer;
  }, [createImageLayer]);

  const handleSelectAssetFromLibrary = useCallback((
    asset: any,
    layersLength: number
  ) => {
    return createImageLayer(
      asset.dataUrl,
      asset.name,
      { width: asset.width, height: asset.height },
      layersLength
    );
  }, [createImageLayer]);

  return {
    handleCropComplete,
    handleSelectAssetFromLibrary
  };
};
