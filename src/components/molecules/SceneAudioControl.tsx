/**
 * Scene Audio Control Component
 * Allows adding audio to a scene, adjusting volume, and removing audio
 */

import React, { useState, useEffect } from 'react';
import { Music, Trash2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudioLibrary, AUDIO_CONFIG, SceneAudioConfig } from '@/app/audio';
import { useSceneStore } from '@/app/scenes';
import AudioPlayer from './AudioPlayer';

interface SceneAudioControlProps {
  sceneId: string;
  sceneAudio?: SceneAudioConfig | null;
}

const SceneAudioControl: React.FC<SceneAudioControlProps> = ({ sceneId, sceneAudio }) => {
  const { files } = useAudioLibrary();
  const { setSceneAudio, updateSceneAudioVolume } = useSceneStore();
  const [showAudioList, setShowAudioList] = useState(false);
  const [localVolume, setLocalVolume] = useState(sceneAudio?.volume || AUDIO_CONFIG.DEFAULT_VOLUME);

  useEffect(() => {
    if (sceneAudio) {
      setLocalVolume(sceneAudio.volume);
    }
  }, [sceneAudio]);

  const handleAddAudio = (audioFile: any) => {
    const audioConfig: SceneAudioConfig = {
      fileId: audioFile.id,
      fileName: audioFile.fileName,
      fileUrl: audioFile.fileUrl,
      volume: AUDIO_CONFIG.DEFAULT_VOLUME,
      duration: audioFile.duration,
    };
    setSceneAudio(sceneId, audioConfig);
    setShowAudioList(false);
  };

  const handleRemoveAudio = () => {
    setSceneAudio(sceneId, null);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setLocalVolume(newVolume);
    updateSceneAudioVolume(sceneId, newVolume);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Music className="h-4 w-4" />
          Scene Audio
        </label>
      </div>

      {!sceneAudio ? (
        <div className="space-y-2">
          {!showAudioList ? (
            <Button
              onClick={() => setShowAudioList(true)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Music className="h-4 w-4 mr-2" />
              Add Audio to Scene
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Select Audio File:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAudioList(false)}
                  className="h-6 text-xs"
                >
                  Cancel
                </Button>
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2 bg-gray-50">
                {files.length === 0 ? (
                  <div className="text-xs text-gray-500 text-center py-4">
                    No audio files available. Upload audio files in the Audio tab.
                  </div>
                ) : (
                  files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleAddAudio(file)}
                      className="w-full text-left p-2 rounded border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {file.fileName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.floor(file.duration)}s
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {sceneAudio.fileName}
                </div>
                <div className="text-xs text-gray-500">
                  Duration: {Math.floor(sceneAudio.duration)}s
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemoveAudio}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <AudioPlayer 
              audioUrl={sceneAudio.fileUrl} 
              fileName={sceneAudio.fileName}
              compact
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
              <Volume2 className="h-3 w-3" />
              Volume: {Math.round(localVolume * 100)}%
            </label>
            <Slider
              value={[localVolume * 100]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneAudioControl;
