import React, { useState } from 'react';
import { useSceneStore } from '@/app/scenes';
import { MiniScene, TransitionType, TransitionEasing, Layer } from '@/app/scenes/types';
import { Button, Card } from '../atoms';
import { Camera, Zap, ArrowRight, Eye, EyeOff, Settings2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface MiniSceneEditorProps {
  sceneId: string;
  miniSceneId: string;
}

const transitionTypeLabels: Record<TransitionType, string> = {
  [TransitionType.NONE]: 'None',
  [TransitionType.FADE]: 'Fade',
  [TransitionType.WIPE_LEFT]: 'Wipe Left',
  [TransitionType.WIPE_RIGHT]: 'Wipe Right',
  [TransitionType.WIPE_UP]: 'Wipe Up',
  [TransitionType.WIPE_DOWN]: 'Wipe Down',
  [TransitionType.ZOOM_IN]: 'Zoom In',
  [TransitionType.ZOOM_OUT]: 'Zoom Out',
  [TransitionType.FADE_BLACK]: 'Fade to Black',
  [TransitionType.FADE_WHITE]: 'Fade to White',
  [TransitionType.SLIDE_LEFT]: 'Slide Left',
  [TransitionType.SLIDE_RIGHT]: 'Slide Right',
  [TransitionType.SLIDE_UP]: 'Slide Up',
  [TransitionType.SLIDE_DOWN]: 'Slide Down',
};

const easingLabels: Record<TransitionEasing, string> = {
  [TransitionEasing.LINEAR]: 'Linear',
  [TransitionEasing.EASE_IN]: 'Ease In',
  [TransitionEasing.EASE_OUT]: 'Ease Out',
  [TransitionEasing.EASE_IN_OUT]: 'Ease In Out',
};

const MiniSceneEditor: React.FC<MiniSceneEditorProps> = ({ sceneId, miniSceneId }) => {
  const scenes = useSceneStore((state) => state.scenes);
  const updateMiniScene = useSceneStore((state) => state.updateMiniScene);

  const scene = scenes.find((s) => s.id === sceneId);
  const miniScene = scene?.miniScenes?.find((ms) => ms.id === miniSceneId);

  if (!miniScene || !scene) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Select a mini-scene to edit</p>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<MiniScene>) => {
    updateMiniScene(sceneId, { ...miniScene, ...updates });
  };

  const handleCameraUpdate = (cameraUpdates: Partial<typeof miniScene.camera>) => {
    handleUpdate({
      camera: { ...miniScene.camera, ...cameraUpdates },
    });
  };

  const handleTransitionInUpdate = (transitionUpdates: Partial<typeof miniScene.transitionIn>) => {
    handleUpdate({
      transitionIn: { ...miniScene.transitionIn, ...transitionUpdates },
    });
  };

  const handleTransitionOutUpdate = (transitionUpdates: Partial<typeof miniScene.transitionOut>) => {
    handleUpdate({
      transitionOut: { ...miniScene.transitionOut, ...transitionUpdates },
    });
  };

  const toggleLayerVisibility = (layerId: string) => {
    const isVisible = miniScene.visibleLayerIds.includes(layerId);
    const newVisibleLayerIds = isVisible
      ? miniScene.visibleLayerIds.filter((id) => id !== layerId)
      : [...miniScene.visibleLayerIds, layerId];
    handleUpdate({ visibleLayerIds: newVisibleLayerIds });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">{miniScene.name}</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Settings */}
        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Basic Settings
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration" className="text-gray-300">
                Duration (seconds)
              </Label>
              <Input
                id="duration"
                type="number"
                min="0.1"
                step="0.1"
                value={miniScene.duration}
                onChange={(e) => handleUpdate({ duration: parseFloat(e.target.value) || 1 })}
                className="mt-1 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </Card>

        {/* Camera Settings */}
        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Camera
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="camera-name" className="text-gray-300">
                Camera Name
              </Label>
              <Input
                id="camera-name"
                type="text"
                value={miniScene.camera.name}
                onChange={(e) => handleCameraUpdate({ name: e.target.value })}
                className="mt-1 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="camera-x" className="text-gray-300">
                  Position X
                </Label>
                <Input
                  id="camera-x"
                  type="number"
                  value={miniScene.camera.position.x}
                  onChange={(e) =>
                    handleCameraUpdate({
                      position: { ...miniScene.camera.position, x: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="camera-y" className="text-gray-300">
                  Position Y
                </Label>
                <Input
                  id="camera-y"
                  type="number"
                  value={miniScene.camera.position.y}
                  onChange={(e) =>
                    handleCameraUpdate({
                      position: { ...miniScene.camera.position, y: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="camera-zoom" className="text-gray-300">
                Zoom Level
              </Label>
              <Input
                id="camera-zoom"
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={miniScene.camera.zoom || 1}
                onChange={(e) => handleCameraUpdate({ zoom: parseFloat(e.target.value) || 1 })}
                className="mt-1 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </Card>

        {/* Transition In */}
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-gray-800/50 border-green-700/50">
          <h3 className="text-sm font-semibold text-green-300 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Transition In
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transition-in-type" className="text-gray-300">
                Type
              </Label>
              <Select
                value={miniScene.transitionIn.type}
                onValueChange={(value) => handleTransitionInUpdate({ type: value as TransitionType })}
              >
                <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(transitionTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transition-in-duration" className="text-gray-300">
                  Duration (s)
                </Label>
                <Input
                  id="transition-in-duration"
                  type="number"
                  min="0"
                  step="0.1"
                  value={miniScene.transitionIn.duration}
                  onChange={(e) =>
                    handleTransitionInUpdate({ duration: parseFloat(e.target.value) || 0.5 })
                  }
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="transition-in-easing" className="text-gray-300">
                  Easing
                </Label>
                <Select
                  value={miniScene.transitionIn.easing}
                  onValueChange={(value) =>
                    handleTransitionInUpdate({ easing: value as TransitionEasing })
                  }
                >
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(easingLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Transition Out */}
        <Card className="p-4 bg-gradient-to-br from-red-900/20 to-gray-800/50 border-red-700/50">
          <h3 className="text-sm font-semibold text-red-300 mb-4 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Transition Out
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transition-out-type" className="text-gray-300">
                Type
              </Label>
              <Select
                value={miniScene.transitionOut.type}
                onValueChange={(value) => handleTransitionOutUpdate({ type: value as TransitionType })}
              >
                <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(transitionTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transition-out-duration" className="text-gray-300">
                  Duration (s)
                </Label>
                <Input
                  id="transition-out-duration"
                  type="number"
                  min="0"
                  step="0.1"
                  value={miniScene.transitionOut.duration}
                  onChange={(e) =>
                    handleTransitionOutUpdate({ duration: parseFloat(e.target.value) || 0.5 })
                  }
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="transition-out-easing" className="text-gray-300">
                  Easing
                </Label>
                <Select
                  value={miniScene.transitionOut.easing}
                  onValueChange={(value) =>
                    handleTransitionOutUpdate({ easing: value as TransitionEasing })
                  }
                >
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(easingLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Visible Layers */}
        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Visible Layers
          </h3>
          <div className="space-y-2">
            {scene.layers && scene.layers.length > 0 ? (
              scene.layers.map((layer: Layer) => {
                const isVisible = miniScene.visibleLayerIds.includes(layer.id);
                return (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-2">
                      {isVisible ? (
                        <Eye className="w-4 h-4 text-green-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-sm text-gray-300">{layer.name}</span>
                      <span className="text-xs text-gray-500">({layer.type})</span>
                    </div>
                    <Switch
                      checked={isVisible}
                      onCheckedChange={() => toggleLayerVisibility(layer.id)}
                    />
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No layers in this scene</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MiniSceneEditor;
