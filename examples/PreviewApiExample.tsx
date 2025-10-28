/**
 * Example component showing how to use the preview API
 * This component demonstrates both scene preview and complete video preview
 */

import React from 'react';
import { Play, Video } from 'lucide-react';
import { useScenePreview } from '@/hooks/useScenePreview';
import { useCompletePreview } from '@/hooks/useCompletePreview';
import { useSceneStore } from '@/app/scenes/store';
import { Scene } from '@/app/scenes/types';
import { Button } from '@/components/atoms';

interface PreviewButtonsExampleProps {
  projectId: string;
}

/**
 * Example component showing preview buttons for current scene and all scenes
 */
export const PreviewButtonsExample: React.FC<PreviewButtonsExampleProps> = ({ projectId }) => {
  const scenes = useSceneStore((state) => state.scenes);
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const currentScene = scenes[selectedSceneIndex];

  // Scene preview hook
  const { 
    generatePreview: generateScenePreview, 
    isGenerating: isGeneratingScenePreview,
    progress: scenePreviewProgress 
  } = useScenePreview({
    onSuccess: (videoUrl) => {
      console.log('Scene preview ready:', videoUrl);
    },
    onError: (error) => {
      console.error('Scene preview failed:', error);
    },
    onProgress: (progress) => {
      console.log('Scene preview progress:', progress);
    }
  });

  // Complete preview hook
  const { 
    generatePreview: generateCompletePreview, 
    isGenerating: isGeneratingCompletePreview,
    progress: completePreviewProgress 
  } = useCompletePreview({
    onSuccess: (videoUrl) => {
      console.log('Complete preview ready:', videoUrl);
    },
    onError: (error) => {
      console.error('Complete preview failed:', error);
    },
    onProgress: (progress) => {
      console.log('Complete preview progress:', progress);
    },
    width: 1920,
    height: 1080,
    fps: 30
  });

  const handlePreviewCurrentScene = async () => {
    if (!currentScene) {
      return;
    }
    await generateScenePreview(currentScene);
  };

  const handlePreviewAllScenes = async () => {
    if (!scenes || scenes.length === 0) {
      return;
    }
    await generateCompletePreview(projectId, scenes);
  };

  return (
    <div className="flex gap-2">
      {/* Preview Current Scene Button */}
      <Button
        onClick={handlePreviewCurrentScene}
        disabled={isGeneratingScenePreview || !currentScene}
        variant="outline"
        size="small"
      >
        <Play className="w-4 h-4 mr-2" />
        {isGeneratingScenePreview 
          ? `Preview Scene (${scenePreviewProgress}%)` 
          : 'Preview Scene'}
      </Button>

      {/* Preview All Scenes Button */}
      <Button
        onClick={handlePreviewAllScenes}
        disabled={isGeneratingCompletePreview || scenes.length === 0}
        variant="primary"
        size="small"
      >
        <Video className="w-4 h-4 mr-2" />
        {isGeneratingCompletePreview 
          ? `Preview All (${completePreviewProgress}%)` 
          : 'Preview All Scenes'}
      </Button>
    </div>
  );
};

/**
 * Example component showing preview with custom options
 */
export const PreviewWithCustomOptions: React.FC = () => {
  const scenes = useSceneStore((state) => state.scenes);
  const selectedSceneIndex = useSceneStore((state) => state.selectedSceneIndex);
  const currentScene = scenes[selectedSceneIndex];

  const [previewConfig, setPreviewConfig] = React.useState({
    width: 1920,
    height: 1080,
    fps: 30
  });

  // Preview hook with custom config
  const { 
    generatePreview, 
    isGenerating,
    progress 
  } = useCompletePreview({
    width: previewConfig.width,
    height: previewConfig.height,
    fps: previewConfig.fps,
  });

  const handlePreview = async () => {
    if (!scenes || scenes.length === 0 || !currentScene?.projectId) {
      return;
    }
    await generatePreview(currentScene.projectId, scenes);
  };

  return (
    <div className="space-y-4">
      {/* Config Options */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Width</label>
          <input
            type="number"
            value={previewConfig.width}
            onChange={(e) => setPreviewConfig({ ...previewConfig, width: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            disabled={isGenerating}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height</label>
          <input
            type="number"
            value={previewConfig.height}
            onChange={(e) => setPreviewConfig({ ...previewConfig, height: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            disabled={isGenerating}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">FPS</label>
          <input
            type="number"
            value={previewConfig.fps}
            onChange={(e) => setPreviewConfig({ ...previewConfig, fps: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            disabled={isGenerating}
          />
        </div>
      </div>

      {/* Preview Button */}
      <Button
        onClick={handlePreview}
        disabled={isGenerating || scenes.length === 0}
        variant="primary"
        className="w-full"
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>Generating Preview... {progress}%</span>
          </div>
        ) : (
          <>
            <Video className="w-4 h-4 mr-2" />
            Generate Preview
          </>
        )}
      </Button>
    </div>
  );
};

/**
 * Example of programmatic preview generation
 */
export const useProgrammaticPreview = () => {
  const { generatePreview: generateScenePreview } = useScenePreview();
  const { generatePreview: generateCompletePreview } = useCompletePreview();

  // Function to generate preview for a specific scene
  const previewScene = async (scene: Scene) => {
    try {
      await generateScenePreview(scene);
    } catch (error) {
      console.error('Error generating scene preview:', error);
    }
  };

  // Function to generate preview for all scenes in a project
  const previewProject = async (projectId: string, scenes: Scene[]) => {
    try {
      await generateCompletePreview(projectId, scenes);
    } catch (error) {
      console.error('Error generating complete preview:', error);
    }
  };

  return {
    previewScene,
    previewProject
  };
};

export default PreviewButtonsExample;
