import { useSceneStore } from '@/app/scenes';
import { useState, useCallback, useEffect } from 'react';

export interface LayerEditorState {
  editedScene: any;
  showThumbnailMaker: boolean;
}

export interface LayerEditorOptions {
  scene: any;
  selectedLayerId?: string | null;
  onSelectLayer?: (layerId: string | null) => void;
}

export const useLayerEditor = ({ 
  scene, 
  selectedLayerId: externalSelectedLayerId,
  onSelectLayer: externalOnSelectLayer 
}: LayerEditorOptions) => {
  const [editedScene, setEditedScene] = useState(scene);
  const [internalSelectedLayerId, setInternalSelectedLayerId] = useState<string | null>(null);
  const [showThumbnailMaker, setShowThumbnailMaker] = useState(false);

  const selectedLayerId = externalSelectedLayerId !== undefined ? externalSelectedLayerId : internalSelectedLayerId;
  
  const setSelectedLayerId = useCallback((layerId: string | null) => {
    if (externalOnSelectLayer) {
      externalOnSelectLayer(layerId);
    } else {
      setInternalSelectedLayerId(layerId);
    }
  }, [externalOnSelectLayer]);

  useEffect(() => {
    setEditedScene(scene);
    // If the selected layer is no longer in the scene, deselect it.
    if (selectedLayerId && !scene?.layers?.some((l: any) => l.id === selectedLayerId)) {
      setSelectedLayerId(null);
    }
  }, [scene, selectedLayerId, setSelectedLayerId]);

  const handleChange = useCallback((field: string, value: any) => {
    setEditedScene((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const handleUpdateScene = useCallback((updates: any) => {
    setEditedScene((prev: any) => ({ ...prev, ...updates }));
  }, []);

  const handleUpdateLayer = useCallback((updatedLayer: any) => {
    setEditedScene((prev: any) => {
      const newLayers = prev.layers.map((layer: any) =>
        layer.id === updatedLayer.id ? updatedLayer : layer
      );
      const newScene = { ...prev, layers: newLayers };
      
      if (prev.id) {
        useSceneStore.getState().updateLayer(prev.id, updatedLayer);
      }
      
      return newScene;
    });
  }, []);

  const handleAddLayer = useCallback((newLayer: any) => {
    setEditedScene((prev: any) => {
      // Ajoute la couche localement
      const updated = {
        ...prev,
        layers: [...prev.layers, newLayer]
      };
      // Persiste dans le store global si la scène a un id
      if (prev.id) {
        useSceneStore.getState().addLayer(prev.id, newLayer);
      }
      return updated;
    });
    setSelectedLayerId(newLayer.id);
  }, [setSelectedLayerId]);

  const handleDeleteLayer = useCallback((layerId: string) => {
    setEditedScene((prev: any) => ({
      ...prev,
      layers: prev.layers.filter((layer: any) => layer.id !== layerId)
    }));
    setSelectedLayerId(null);
  }, [setSelectedLayerId]);

  const handleDuplicateLayer = useCallback((layerId: string) => {
    setEditedScene((prev: any) => {
      const layerToDuplicate = prev.layers.find((l: any) => l.id === layerId);
      if (!layerToDuplicate) return prev;

      const duplicatedLayer = {
        ...layerToDuplicate,
        id: `layer-${Date.now()}`,
        name: `${layerToDuplicate.name} (Copie)`,
        position: {
          x: (layerToDuplicate.position?.x || 0) + 20,
          y: (layerToDuplicate.position?.y || 0) + 20,
        }
      };

      return {
        ...prev,
        layers: [...prev.layers, duplicatedLayer]
      };
    });
  }, []);

  const handleMoveLayer = useCallback((layerId: string, direction: 'up' | 'down') => {
    setEditedScene((prev: any) => {
      const currentIndex = prev.layers.findIndex((l: any) => l.id === layerId);
      if (currentIndex === -1) return prev;

      const newLayers = [...prev.layers];
      if (direction === 'up' && currentIndex > 0) {
        [newLayers[currentIndex], newLayers[currentIndex - 1]] = 
          [newLayers[currentIndex - 1], newLayers[currentIndex]];
      } else if (direction === 'down' && currentIndex < newLayers.length - 1) {
        [newLayers[currentIndex], newLayers[currentIndex + 1]] = 
          [newLayers[currentIndex + 1], newLayers[currentIndex]];
      }

      newLayers.forEach((layer, index) => {
        layer.z_index = index + 1;
      });

      return {
        ...prev,
        layers: newLayers
      };
    });
  }, []);

  const handleLayerPropertyChange = useCallback((layerId: string, property: string, value: any) => {
    setEditedScene((prev: any) => {
      const newLayers = prev.layers.map((layer: any) =>
        layer.id === layerId ? { ...layer, [property]: value } : layer
      );
      const newScene = { ...prev, layers: newLayers };

      if (prev.id) {
        const updatedLayer = newLayers.find((l: any) => l.id === layerId);
        if (updatedLayer) {
          useSceneStore.getState().updateLayer(prev.id, updatedLayer);
        }
      }
      
      return newScene;
    });
  }, []);

  const selectedLayer = editedScene?.layers?.find((layer: any) => layer.id === selectedLayerId);

  return {
    editedScene,
    setEditedScene,
    selectedLayerId,
    setSelectedLayerId,
    selectedLayer,
    showThumbnailMaker,
    setShowThumbnailMaker,
    handleChange,
    handleUpdateScene,
    handleUpdateLayer,
    handleAddLayer,
    handleDeleteLayer,
    handleDuplicateLayer,
    handleMoveLayer,
    handleLayerPropertyChange
  };
};