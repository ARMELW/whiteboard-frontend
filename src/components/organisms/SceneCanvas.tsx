
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer as KonvaLayer } from 'react-konva';
import { KonvaCamera, LayerImage, LayerText, FloatingToolbar } from '../molecules';
import { useScenesActionsWithHistory } from '@/app/hooks/useScenesActionsWithHistory';
import { createDefaultCamera } from '../../utils/cameraAnimator';
import LayerShape from '../LayerShape';
import type { Scene, Layer, Camera } from '../../app/scenes/types';
import { useSceneStore } from '@/app/scenes';

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

const SceneCanvas: React.FC<SceneCanvasProps> = ({
  scene,
  onUpdateScene,
  onUpdateLayer,
  selectedLayerId,
  onSelectLayer,
  onSelectCamera,
  sceneZoom: parentSceneZoom,
  onSceneZoomChange,
  selectedCameraId: parentSelectedCameraId,
  onCameraStateChange,
}) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingTextValue, setEditingTextValue] = useState('');
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  
  // Camera navigation panel state
  const [showCameraNav, setShowCameraNav] = useState(true);
  const [isCameraNavMinimized, setIsCameraNavMinimized] = useState(false);
  
  // Multi-selection support
  const selectedLayerIds = useSceneStore((state) => state.selectedLayerIds);
  const toggleLayerSelection = useSceneStore((state) => state.toggleLayerSelection);
  const setSelectedLayerIds = useSceneStore((state) => state.setSelectedLayerIds);
  const clearSelection = useSceneStore((state) => state.clearSelection);
  
  const { deleteLayer } = useScenesActionsWithHistory();

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
  const { updateScene } = useScenesActionsWithHistory();

  // Use parent's selectedCameraId if provided, otherwise use local state
  const effectiveSelectedCameraId = parentSelectedCameraId !== undefined ? parentSelectedCameraId : selectedCameraId;
  
  // Update local selectedCameraId when parent changes
  useEffect(() => {
    if (parentSelectedCameraId !== undefined && parentSelectedCameraId !== selectedCameraId) {
      setSelectedCameraId(parentSelectedCameraId);
    }
  }, [parentSelectedCameraId, selectedCameraId]);

  // Notify parent when camera selection changes
  React.useEffect(() => {
    if (onSelectCamera) {
      const selectedCamera = sceneCameras.find((cam: Camera) => cam.id === effectiveSelectedCameraId);
      onSelectCamera(selectedCamera);
    }
  }, [effectiveSelectedCameraId, sceneCameras, onSelectCamera]);
  
  const [sceneZoom, setSceneZoom] = useState(0.8);
  
  // Use parent's sceneZoom if provided, otherwise use local state
  const effectiveSceneZoom = parentSceneZoom !== undefined ? parentSceneZoom : sceneZoom;
  
  // Update local sceneZoom when parent changes
  useEffect(() => {
    if (parentSceneZoom !== undefined && parentSceneZoom !== sceneZoom) {
      setSceneZoom(parentSceneZoom);
    }
  }, [parentSceneZoom, sceneZoom]);
  
  // Handle zoom change - call parent callback if provided
  const handleSceneZoomChange = useCallback((newZoom: number) => {
    if (onSceneZoomChange) {
      onSceneZoomChange(newZoom);
    } else {
      setSceneZoom(newZoom);
    }
  }, [onSceneZoomChange]);
  const [hasCalculatedInitialZoom, setHasCalculatedInitialZoom] = useState(false);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Use reasonable scene dimensions based on default camera size
  // 2x camera dimensions to allow for camera movement and panning
  const sceneWidth = scene.sceneWidth || 1600;
  const sceneHeight = scene.sceneHeight || 900;

  // Constants for zoom and spacing
  const ZOOM_THRESHOLD_FOR_LARGE_SCENES = 0.5;
  const INITIAL_ZOOM_FOR_LARGE_SCENES = 0.2;
  const CANVAS_MARGIN = 100; // pixels of space around canvas for comfortable scrolling
  const DEFAULT_CAMERA_WIDTH = 800;
  const DEFAULT_CAMERA_HEIGHT = 450;
  const CAMERA_PADDING_RATIO = 0.9; // 90% of viewport for padding around camera
  const MAX_AUTO_FIT_ZOOM = 1.5; // Maximum zoom level for auto-fit

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
      // Allow zoom to be less than 1.0 for immense scenes
      // Use a smaller zoom for very large scenes to enable scrolling
      const initialZoom = fitZoom < ZOOM_THRESHOLD_FOR_LARGE_SCENES ? INITIAL_ZOOM_FOR_LARGE_SCENES : fitZoom;
      handleSceneZoomChange(initialZoom);
      setHasCalculatedInitialZoom(true);
    }
  }, [hasCalculatedInitialZoom, calculateFitZoom, handleSceneZoomChange]);

  // Auto-fit view to default camera
  const handleAutoFitCamera = useCallback(() => {
    const defaultCamera = sceneCameras.find((cam: Camera) => cam.isDefault);
    if (!defaultCamera || !scrollContainerRef.current) return;
    
    // Switch to default camera
    setSelectedCameraId(defaultCamera.id);
    
    // Calculate zoom to fit the default camera in viewport
    const container = scrollContainerRef.current as HTMLDivElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const cameraWidth = defaultCamera.width || DEFAULT_CAMERA_WIDTH;
    const cameraHeight = defaultCamera.height || DEFAULT_CAMERA_HEIGHT;
    
    // Calculate zoom to fit camera with some padding
    const zoomX = (containerWidth * CAMERA_PADDING_RATIO) / cameraWidth;
    const zoomY = (containerHeight * CAMERA_PADDING_RATIO) / cameraHeight;
    const optimalZoom = Math.min(zoomX, zoomY, MAX_AUTO_FIT_ZOOM);
    
    // Apply the zoom
    handleSceneZoomChange(optimalZoom);
  }, [sceneCameras, handleSceneZoomChange]);

  // Create a new camera
  const handleAddCamera = useCallback(() => {
    const defaultCamera = sceneCameras.find((cam: Camera) => cam.isDefault);
    const defaultPosition = defaultCamera ? defaultCamera.position : { x: 0.5, y: 0.5 };
    const cameraWidth = defaultCamera?.width || 800;
    const cameraHeight = defaultCamera?.height || 450;
    
    // Count non-default cameras to determine the next camera number
    const nonDefaultCameras = sceneCameras.filter((cam: Camera) => !cam.isDefault);
    const cameraNumber = nonDefaultCameras.length + 1;
    
    const newCamera: Camera = {
      id: `camera-${Date.now()}`,
      name: `Camera ${cameraNumber}`,
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

  // Memoize onSaveCameras callback to prevent infinite loops
  const handleSaveCameras = useCallback(async (updatedCameras: Camera[]) => {
    setSceneCameras(updatedCameras);
    onUpdateScene({ sceneCameras: updatedCameras });
    try {
      if (scene && scene.id) {
        await updateScene({ id: scene.id, data: { sceneCameras: updatedCameras } });
      }
    } catch (err) {
      console.error('Failed to persist cameras:', err);
    }
  }, [onUpdateScene, scene, updateScene]);

  // Type for camera state snapshot used in change detection
  interface CameraStateSnapshot {
    cameras: Camera[];
    selectedCameraId: string | null;
  }

  // Propagate camera state upward to AnimationContainer
  const prevCameraStateRef = useRef<CameraStateSnapshot | null>(null);
  
  useEffect(() => {
    if (onCameraStateChange) {
      // Only update if cameras or selectedCameraId actually changed
      // Using shallow comparison for performance
      const camerasChanged = !prevCameraStateRef.current || 
        prevCameraStateRef.current.cameras.length !== sceneCameras.length ||
        prevCameraStateRef.current.cameras.some((cam, idx) => 
          cam.id !== sceneCameras[idx]?.id || 
          cam.locked !== sceneCameras[idx]?.locked ||
          cam.zoom !== sceneCameras[idx]?.zoom
        ) ||
        prevCameraStateRef.current.selectedCameraId !== effectiveSelectedCameraId;
      
      if (camerasChanged) {
        prevCameraStateRef.current = {
          cameras: sceneCameras,
          selectedCameraId: effectiveSelectedCameraId
        };
        
        onCameraStateChange({
          cameras: sceneCameras,
          selectedCameraId: effectiveSelectedCameraId,
          callbacks: {
            onAddCamera: handleAddCamera,
            onToggleLock: handleToggleLock,
            onSaveCameras: handleSaveCameras
          }
        });
      }
    }
  }, [sceneCameras, effectiveSelectedCameraId, handleAddCamera, handleToggleLock, handleSaveCameras, onCameraStateChange]);

  // Reset centering flag when scene ID changes
  React.useEffect(() => {
    setHasInitialCentered(false);
  }, [scene.id]);

  // Auto-scroll to center on selected camera
  React.useEffect(() => {
    if (!scrollContainerRef.current || !selectedCameraId) return;
    
    const selectedCamera = sceneCameras.find((cam: Camera) => cam.id === selectedCameraId);
    if (!selectedCamera) return;
    
    const container = scrollContainerRef.current as HTMLDivElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate the pixel position of the camera center
    const cameraCenterX = selectedCamera.position.x * sceneWidth;
    const cameraCenterY = selectedCamera.position.y * sceneHeight;
    
    // Calculate scroll position to center the camera in the viewport
    const scrollLeft = (cameraCenterX * effectiveSceneZoom) - (containerWidth / 2);
    const scrollTop = (cameraCenterY * effectiveSceneZoom) - (containerHeight / 2);
    
    // Scroll to the camera position
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      top: Math.max(0, scrollTop),
      behavior: hasInitialCentered ? 'smooth' : 'auto'
    });
    
    if (!hasInitialCentered) {
      setHasInitialCentered(true);
    }
  }, [selectedCameraId, sceneCameras, sceneWidth, sceneHeight, effectiveSceneZoom, hasInitialCentered]);
  
  // Handle keyboard shortcuts for multi-selection deletion
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete or Backspace key - delete selected layers
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerIds.length > 0) {
        // Don't delete if user is editing text in modal
        if (isEditingText) return;
        
        // Don't delete if user is typing in any input or textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
        
        // Prevent default browser behavior
        e.preventDefault();
        
        // Delete all selected layers
        selectedLayerIds.forEach((layerId) => {
          deleteLayer({ sceneId: scene.id, layerId });
        });
        
        // Clear selection
        clearSelection();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerIds, scene.id, deleteLayer, clearSelection, isEditingText]);

  // Sort layers by z_index for rendering
  const sortedLayers = [...(scene.layers || [])].sort((a: Layer, b: Layer) =>
    (a.z_index || 0) - (b.z_index || 0)
  );

  const scaledSceneWidth = sceneWidth * effectiveSceneZoom;
  const scaledSceneHeight = sceneHeight * effectiveSceneZoom;

  return (
    <div className="flex relative flex-col h-full bg-white">
      <div className="flex flex-1 min-h-0 bg-white" style={{ height: '100%' }}>
        {/* Canvas Area - Centered viewport */}
        <div
          ref={scrollContainerRef}
          className="flex-1 bg-white relative overflow-auto"
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
              position: 'relative',
              margin: `${CANVAS_MARGIN}px` // Add margin so scene has space to scroll
            }}
          >
            {/* Konva Stage for layers and cameras */}
            <div style={{ position: 'relative', zIndex: 2, backgroundColor: 'white' }}>
              <Stage
                width={sceneWidth}
                height={sceneHeight}
                scaleX={effectiveSceneZoom}
                scaleY={effectiveSceneZoom}

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
                    // Clear selection if clicking on empty space (without Ctrl)
                    if (!e.evt.ctrlKey && !e.evt.metaKey) {
                      clearSelection();
                      onSelectLayer(null);
                      setSelectedCameraId('default-camera');
                    }
                  }
                }}
              >
                {/* Layers - En dessous */}
                <KonvaLayer>
                  {sortedLayers.map((layer: Layer) => {
                    const isLayerSelected = selectedLayerIds.includes(layer.id);
                    const handleLayerSelect = (e?: any) => {
                      const ctrlPressed = e?.evt?.ctrlKey || e?.evt?.metaKey;
                      if (ctrlPressed) {
                        // Multi-selection: toggle layer
                        toggleLayerSelection(layer.id);
                      } else {
                        // Single selection: clear others
                        onSelectLayer(layer.id);
                        setSelectedLayerIds([layer.id]);
                      }
                      setSelectedCameraId('default-camera');
                    };
                    
                    if (layer.type === 'text') {
                      return (
                        <LayerText
                          key={layer.id}
                          layer={layer}
                          isSelected={isLayerSelected}
                          onSelect={handleLayerSelect}
                          onChange={onUpdateLayer as (layer: any) => void}
                          onStartEditing={() => {
                            setIsEditingText(true);
                            setEditingLayerId(layer.id);
                            setEditingTextValue(layer.text_config?.text || '');
                          }}
                          selectedLayerIds={selectedLayerIds}
                          allLayers={sortedLayers}
                        />
                      );
                    } else if (layer.type === 'shape') {
                      return (
                        <LayerShape
                          key={layer.id}
                          layer={layer as any}
                          isSelected={isLayerSelected}
                          onSelect={handleLayerSelect}
                          onChange={onUpdateLayer as (layer: any) => void}
                        />
                      );
                    } else {
                      return (
                        <LayerImage
                          key={layer.id}
                          layer={layer}
                          isSelected={isLayerSelected}
                          onSelect={handleLayerSelect}
                          onChange={onUpdateLayer as (layer: any) => void}
                          selectedLayerIds={selectedLayerIds}
                          allLayers={sortedLayers}
                        />
                      );
                    }
                  })}
                </KonvaLayer>

                {/* Cameras Layer - Au dessus de tout */}
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
              </Stage>
            </div>

            {/* Camera Navigation Panel - Floating on canvas */}
            {showCameraNav && (
              <div 
                className={`absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-300 ${
                  isCameraNavMinimized ? 'p-2' : 'p-3'
                }`}
                style={{ maxWidth: isCameraNavMinimized ? '50px' : '280px' }}
              >
                {isCameraNavMinimized ? (
                  // Minimized view - just a button
                  <button
                    onClick={() => setIsCameraNavMinimized(false)}
                    className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    title="Afficher la navigation caméras"
                    aria-label={`Afficher la navigation des ${sceneCameras.length} caméras`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold" aria-label={`${sceneCameras.length} caméras`}>
                      {sceneCameras.length}
                    </span>
                  </button>
                ) : (
                  // Expanded view
                  <>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-sm font-semibold text-gray-800 flex-1">Navigation Caméras</h3>
                      <span className="text-xs text-gray-500">{sceneCameras.length}</span>
                      <button
                        onClick={() => setIsCameraNavMinimized(true)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Réduire"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowCameraNav(false)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Fermer"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
              
              {/* Auto-fit button */}
              <button
                onClick={handleAutoFitCamera}
                className="w-full mb-3 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                title="Ajuster la vue sur la caméra par défaut"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Ajuster la vue
              </button>

              <div className="space-y-2 max-h-96 overflow-y-auto" role="list" aria-label="Liste des caméras">
                {sceneCameras.map((camera: Camera, index: number) => {
                  const isSelected = selectedCameraId === camera.id;
                  const isDefault = camera.isDefault;
                  const nextCamera = index < sceneCameras.length - 1 ? sceneCameras[index + 1] : null;
                  
                  return (
                    <div key={camera.id}>
                      <button
                        onClick={() => {
                          setSelectedCameraId(camera.id);
                          // Auto-center will be triggered by useEffect
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md'
                            : isDefault
                            ? 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                        role="listitem"
                        aria-label={`Caméra ${index + 1}: ${camera.name || `Camera ${index + 1}`}, Zoom ${camera.zoom?.toFixed(1)}x${isDefault ? ', caméra par défaut' : ''}${camera.locked ? ', verrouillée' : ''}${isSelected ? ', actuellement sélectionnée' : ''}`}
                        aria-current={isSelected ? 'true' : 'false'}
                      >
                        {/* Camera icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-500'
                            : isDefault
                            ? 'bg-blue-200'
                            : 'bg-gray-200'
                        }`}>
                          <span className={`text-xs font-bold ${
                            isSelected ? 'text-white' : isDefault ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                        
                        {/* Camera info */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {camera.name || `Camera ${index + 1}`}
                            </span>
                            {isDefault && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-200 text-blue-700">
                                Défaut
                              </span>
                            )}
                            {camera.locked && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="text-xs opacity-75 mt-0.5">
                            Zoom: {camera.zoom?.toFixed(1)}x
                          </div>
                        </div>
                        
                        {/* Location indicator */}
                        <div className="flex-shrink-0">
                          <svg className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                      
                      {/* Flow arrow to next camera */}
                      {nextCamera && (
                        <div className="flex items-center justify-center py-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          <div className="flex-1 border-t border-dashed border-gray-300 mx-2"></div>
                          <span className="text-xs text-gray-400 font-medium">PUIS</span>
                          <div className="flex-1 border-t border-dashed border-gray-300 mx-2"></div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Quick stats */}
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>{sceneCameras.filter(c => !c.isDefault).length} personnalisée(s)</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>{sceneCameras.filter(c => c.locked).length} verrouillée(s)</span>
                </div>
              </div>
                  </>
                )}
              </div>
            )}

            {/* Toggle button when panel is hidden */}
            {!showCameraNav && (
              <button
                onClick={() => setShowCameraNav(true)}
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg z-50 transition-colors"
                title="Afficher la navigation caméras"
                aria-label={`Afficher la navigation des ${sceneCameras.length} caméras`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Caméras ({sceneCameras.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Main Content Area */}

      {/* Text Editing Modal 
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
     */}
      {/* Floating Toolbar
      {selectedLayerId && !isEditingText && (() => {
        const selectedLayer = sortedLayers.find((l: Layer) => l.id === selectedLayerId);
        if (!selectedLayer || (selectedLayer.type !== 'text' && selectedLayer.type !== 'image')) return null;

        // Calculate position based on layer position and zoom
        const layerX = (selectedLayer.position?.x || 0) * effectiveSceneZoom;
        const layerY = (selectedLayer.position?.y || 0) * effectiveSceneZoom;
        
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