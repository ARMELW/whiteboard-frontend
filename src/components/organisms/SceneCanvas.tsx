
import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer as KonvaLayer } from 'react-konva';
import { CameraToolbar, KonvaCamera, LayerImage, LayerText, FloatingToolbar } from '../molecules';
import { useScenesActions } from '@/app/scenes';
import CameraManagerModal from './CameraManagerModal';
import { createDefaultCamera } from '../../utils/cameraAnimator';
import LayerShape from '../LayerShape';
import type { Scene, Layer, Camera } from '../../app/scenes/types';

/**
 * SceneCanvas Component
 * Main canvas for scene editing with camera viewport management
 */
interface SceneCanvasProps {
  scene: Scene;
  onUpdateScene: (updates: Partial<Scene>) => void;
  onUpdateLayer: (layer: Layer) => void;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string | null) => void;
  onSelectCamera?: (camera: Camera | undefined) => void;
}

const SceneCanvas: React.FC<SceneCanvasProps> = ({
  scene,
  onUpdateScene,
  onUpdateLayer,
  selectedLayerId,
  onSelectLayer,
  onSelectCamera,
}) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingTextValue, setEditingTextValue] = useState('');
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);

  const ensureCamera = (cam: Partial<Camera>): Camera => ({
    id: cam.id ?? 'default-camera',
    name: cam.name ?? 'Camera',
    position: cam.position ?? { x: 0.5, y: 0.5 },
    scale: typeof cam.scale === 'number' ? cam.scale : 1,
    animation: cam.animation,
    zoom: (cam as any).zoom ?? 1,
    duration: (cam as any).duration ?? 2,
    transition_duration: (cam as any).transition_duration ?? 1,
    easing: (cam as any).easing ?? 'ease_out',
    width: (cam as any).width ?? 800,
    height: (cam as any).height ?? 450,
  locked: (cam as any).locked ?? ((cam as any).isDefault ? true : false),
    isDefault: (cam as any).isDefault ?? false,
    pauseDuration: (cam as any).pauseDuration ?? 0,
    movementType: (cam as any).movementType ?? 'ease_out',
  });
  const [sceneCameras, setSceneCameras] = useState<Camera[]>(() => {
    if (!scene.sceneCameras || scene.sceneCameras.length === 0) {
      return [ensureCamera(createDefaultCamera('16:9'))];
    }
    const hasDefaultCamera = scene.sceneCameras.some((cam: Camera) => cam.isDefault);
    if (!hasDefaultCamera) {
      return [ensureCamera(createDefaultCamera('16:9')), ...scene.sceneCameras.map(ensureCamera)];
    }
    return scene.sceneCameras.map(ensureCamera);
  });
  const [selectedCameraId, setSelectedCameraId] = useState<string>('default-camera');
  const [hasInitialCentered, setHasInitialCentered] = useState(false);
  const [showCameraManager, setShowCameraManager] = useState(false);
  const { updateScene } = useScenesActions();
  
  // Notify parent when camera selection changes
  React.useEffect(() => {
    if (onSelectCamera) {
  const selectedCamera = sceneCameras.find((cam: Camera) => cam.id === selectedCameraId);
      onSelectCamera(selectedCamera);
    }
  }, [selectedCameraId, sceneCameras, onSelectCamera]);
  const [sceneZoom, setSceneZoom] = useState(0.8);
  const [hasCalculatedInitialZoom, setHasCalculatedInitialZoom] = useState(false);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const sceneWidth = 1920;
  const sceneHeight = 1080;

  // Calculate zoom to fit scene in viewport
  const calculateFitZoom = useCallback(() => {
    if (!scrollContainerRef.current) return 1.0;
    const container = scrollContainerRef.current as HTMLDivElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const zoomX = (containerWidth * 0.95) / sceneWidth;
    const zoomY = (containerHeight * 0.95) / sceneHeight;
    return Math.min(zoomX, zoomY, 1.0);
  }, [sceneWidth, sceneHeight]);

  // Set initial zoom to fit scene in viewport
  React.useEffect(() => {
    if (!hasCalculatedInitialZoom && scrollContainerRef.current) {
      const fitZoom = calculateFitZoom();
      setSceneZoom(Math.max(fitZoom, 1.0));
      setHasCalculatedInitialZoom(true);
    }
  }, [hasCalculatedInitialZoom, calculateFitZoom]);

  // Create a new camera
  const handleAddCamera = useCallback(() => {
  const defaultCamera = sceneCameras.find((cam: Camera) => cam.isDefault);
    const defaultPosition = defaultCamera ? defaultCamera.position : { x: 0.5, y: 0.5 };
    const cameraWidth = defaultCamera?.width || 800;
    const cameraHeight = defaultCamera?.height || 450;
  const newCamera: Camera = {
      id: `camera-${Date.now()}`,
      name: `Camera ${sceneCameras.length}`,
      position: { x: defaultPosition.x, y: defaultPosition.y },
      width: cameraWidth,
      height: cameraHeight,
      zoom: 1.0,
      duration: 2.0,
      transition_duration: 1.0,
      easing: 'ease_out',
      locked: false,
      isDefault: false,
      pauseDuration: 0,
      movementType: 'ease_out',
      scale: 1,
    };
    const updatedCameras = [...sceneCameras, newCamera];
    setSceneCameras(updatedCameras);
  setSelectedCameraId(newCamera.id);
  onUpdateScene({ sceneCameras: updatedCameras });
  }, [sceneCameras, onUpdateScene]);

  // Update camera properties
  const handleUpdateCamera = useCallback((cameraId: string, updates: Partial<Camera>) => {
    const updatedCameras = sceneCameras.map((cam: Camera) =>
      cam.id === cameraId ? { ...cam, ...updates } : cam
    );
    setSceneCameras(updatedCameras);
    onUpdateScene({ sceneCameras: updatedCameras });
  }, [sceneCameras, onUpdateScene]);

  // Camera deletion is handled elsewhere; toolbar no longer exposes delete

  // Zoom specific camera: handled via handleUpdateCamera when needed

  // Toggle lock/unlock camera
  const handleToggleLock = useCallback((cameraId: string) => {
    const camera = sceneCameras.find((cam: Camera) => cam.id === cameraId);
    if (camera && !camera.isDefault) {
      handleUpdateCamera(cameraId, { locked: !camera.locked });
    }
  }, [sceneCameras, handleUpdateCamera]);

  // Sync cameras from scene prop when scene changes
  React.useEffect(() => {
    if (scene.sceneCameras) {
      const hasDefaultCamera = scene.sceneCameras.some((cam: Camera) => cam.isDefault);
      if (!hasDefaultCamera && scene.sceneCameras.length > 0) {
        setSceneCameras([
          ensureCamera(createDefaultCamera('16:9')),
          ...scene.sceneCameras.map(ensureCamera)
        ]);
      } else if (!hasDefaultCamera && scene.sceneCameras.length === 0) {
        setSceneCameras([ensureCamera(createDefaultCamera('16:9'))]);
      } else {
        setSceneCameras(scene.sceneCameras.map(ensureCamera));
      }
    } else {
  setSceneCameras([ensureCamera(createDefaultCamera('16:9'))]);
    }
  }, [scene.sceneCameras]);

  // Reset centering flag when scene ID changes
  React.useEffect(() => {
    setHasInitialCentered(false);
  }, [scene.id]);

  // Auto-scroll to selected camera - disabled since canvas is now centered with flexbox
  // The canvas is always centered in the viewport, so scrolling is not needed
  React.useEffect(() => {
    // Mark as centered immediately since we don't need to scroll
    if (!hasInitialCentered) {
      setHasInitialCentered(true);
    }
  }, [selectedCameraId, hasInitialCentered]);

  // Sort layers by z_index for rendering
  const sortedLayers = [...(scene.layers || [])].sort((a: Layer, b: Layer) => 
    (a.z_index || 0) - (b.z_index || 0)
  );

  const scaledSceneWidth = sceneWidth * sceneZoom;
  const scaledSceneHeight = sceneHeight * sceneZoom;
  
  return (
    <div className="flex flex-col h-full bg-secondary">
      {/* Camera Toolbar */}
      <CameraToolbar
        cameras={sceneCameras}
        selectedCameraId={selectedCameraId}
        onAddCamera={handleAddCamera}
        onSelectCamera={(id: string | null) => setSelectedCameraId(id || 'default-camera')}
        onZoomCamera={() => {}}
  onToggleLock={handleToggleLock}
        sceneZoom={sceneZoom}
        onSceneZoom={setSceneZoom}
        onFitToViewport={() => setSceneZoom(calculateFitZoom())}
        onOpenCameraManager={() => setShowCameraManager(true)}
      />
      {showCameraManager && (
        <CameraManagerModal
          cameras={sceneCameras}
          onClose={() => setShowCameraManager(false)}
          onSave={async (updated: any[]) => {
            // apply updated cameras to local state and notify parent
            setSceneCameras(updated.map((c: any) => ({ ...c })));
            onUpdateScene({ sceneCameras: updated });

            // Persist immediately if scene id is available
            try {
              if (scene && scene.id) {
                await updateScene({ id: scene.id, data: { sceneCameras: updated } });
              }
            } catch (err) {
              console.error('Failed to persist cameras:', err);
            }
          }}
        />
      )}
      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 bg-white" style={{ height: '100%' }}>
        {/* Canvas Area - Centered viewport */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 bg-white relative flex items-center justify-center overflow-hidden"
          style={{ 
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle, #4b5563 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0'
          }}
        >
          {/* Scene Canvas - The actual stage */}
          <div
            ref={canvasRef}
            className="bg-white shadow-2xl"
            style={{
              width: `${scaledSceneWidth}px`,
              height: `${scaledSceneHeight}px`,
              position: 'relative'
            }}
          >
            {/* Konva Stage for layers and cameras */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Stage
                width={sceneWidth}
                height={sceneHeight}
                scaleX={sceneZoom}
                scaleY={sceneZoom}
                
                style={{
                  width: `${scaledSceneWidth}px`,
                  height: `${scaledSceneHeight}px`,
                  backgroundImage: scene.backgroundImage 
                    ? `url(${scene.backgroundImage})` 
                    : 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                ref={stageRef}
                onMouseDown={(e) => {
                  const clickedOnEmpty = e.target === e.target.getStage();
                  if (clickedOnEmpty) {
                    onSelectLayer(null);
                    setSelectedCameraId('default-camera');
                  }
                }}
              >
                {/* Cameras Layer - En dessous */}
                <KonvaLayer>
                  {sceneCameras.map((camera: Camera) => (
                    <KonvaCamera
                      key={camera.id}
                      camera={camera}
                      isSelected={selectedCameraId === camera.id}
                      onSelect={() => setSelectedCameraId(camera.id ?? 'default-camera')}
                      onUpdate={handleUpdateCamera}
                      sceneWidth={sceneWidth}
                      sceneHeight={sceneHeight}
                    />
                  ))}
                </KonvaLayer>
                
                {/* Layers - Au dessus */}
                <KonvaLayer>
                  {sortedLayers.map((layer: Layer) => {
                    if (layer.type === 'text') {
                      return (
                        <LayerText
                          key={layer.id}
                          layer={layer}
                          isSelected={layer.id === selectedLayerId}
                          onSelect={() => {
                            onSelectLayer(layer.id);
                            setSelectedCameraId('default-camera');
                          }}
                          onChange={onUpdateLayer as (layer: any) => void}
                          onStartEditing={() => {
                            setIsEditingText(true);
                            setEditingLayerId(layer.id);
                            setEditingTextValue(layer.text_config?.text || '');
                          }}
                        />
                      );
                    } else if (layer.type === 'shape') {
                      return (
                        <LayerShape
                          key={layer.id}
                          layer={layer as any}
                          isSelected={layer.id === selectedLayerId}
                          onSelect={() => {
                            onSelectLayer(layer.id);
                            setSelectedCameraId('default-camera');
                          }}
                          onChange={onUpdateLayer as (layer: any) => void}
                        />
                      );
                    } else {
                      return (
                        <LayerImage
                          key={layer.id}
                          layer={layer}
                          isSelected={layer.id === selectedLayerId}
                          onSelect={() => {
                            onSelectLayer(layer.id);
                            setSelectedCameraId('default-camera');
                          }}
                          onChange={onUpdateLayer as (layer: any) => void}
                        />
                      );
                    }
                  })}
                </KonvaLayer>
              </Stage>
            </div>
          </div>
        </div>
      </div>

      {/* Text Editing Modal */}
      {isEditingText && editingLayerId && (() => {
        const editingLayer = sortedLayers.find((l: Layer) => l.id === editingLayerId);
        if (!editingLayer || editingLayer.type !== 'text') return null;
        
        const textConfig = editingLayer.text_config || {};
        const fontSize = textConfig.size || 48;
        const fontFamily = textConfig.font || 'Arial';
        let fontStyle = 'normal';
        if (textConfig.style === 'bold') fontStyle = 'bold';
        else if (textConfig.style === 'italic') fontStyle = 'italic';
        else if (textConfig.style === 'bold_italic') fontStyle = 'bold italic';
        
        let fill = '#000000';
        if (Array.isArray(textConfig.color)) {
          fill = `#${textConfig.color.map((c: number) => c.toString(16).padStart(2, '0')).join('')}`;
        } else if (typeof textConfig.color === 'string') {
          fill = textConfig.color;
        }

        return (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
            onClick={() => setIsEditingText(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Modifier le texte</h3>
              <textarea
                value={editingTextValue}
                onChange={(e) => setEditingTextValue(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  fontSize: `${Math.min(fontSize, 24)}px`,
                  fontFamily: fontFamily,
                  fontStyle: fontStyle,
                  color: fill,
                  minHeight: '150px',
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsEditingText(false);
                    setEditingTextValue('');
                    setEditingLayerId(null);
                  }
                }}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setIsEditingText(false);
                    setEditingTextValue('');
                    setEditingLayerId(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (editingLayer) {
                      onUpdateLayer({
                        ...editingLayer,
                        text_config: {
                          ...editingLayer.text_config,
                          text: editingTextValue
                        }
                      });
                    }
                    setIsEditingText(false);
                    setEditingTextValue('');
                    setEditingLayerId(null);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Floating Toolbar
      {selectedLayerId && !isEditingText && (() => {
        const selectedLayer = sortedLayers.find((l: Layer) => l.id === selectedLayerId);
        if (!selectedLayer || (selectedLayer.type !== 'text' && selectedLayer.type !== 'image')) return null;

        // Calculate position based on layer position and zoom
        const layerX = (selectedLayer.position?.x || 0) * sceneZoom;
        const layerY = (selectedLayer.position?.y || 0) * sceneZoom;
        
        // Adjust for canvas position in viewport
        const canvasContainer = scrollContainerRef.current;
        if (!canvasContainer) return null;
        
        const containerRect = canvasContainer.getBoundingClientRect();
        const toolbarX = containerRect.left + layerX + (containerRect.width - scaledSceneWidth) / 2;
        const toolbarY = containerRect.top + layerY + (containerRect.height - scaledSceneHeight) / 2;

        return (
          <FloatingToolbar
            layer={selectedLayer}
            position={{ x: toolbarX, y: toolbarY }}
            onPropertyChange={(property: string, value: any) => {
              onUpdateLayer({
                ...selectedLayer,
                [property]: value
              });
            }}
          />
        );
      })()}
         */}
    </div>
  );
};

export default React.memo(SceneCanvas);