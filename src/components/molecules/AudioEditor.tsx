/**
 * Audio Editor Component
 * Provides controls for trimming, fading, and editing audio files
 */

import React, { useState } from 'react';
import { Scissors, Volume2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AudioFile, AudioTrimConfig, AudioFadeConfig } from '@/app/audio/types';

interface AudioEditorProps {
  audioFile: AudioFile;
  onUpdateTrim: (trimConfig: AudioTrimConfig) => void;
  onUpdateFade: (fadeConfig: AudioFadeConfig) => void;
  onClose: () => void;
}

const AudioEditor: React.FC<AudioEditorProps> = ({
  audioFile,
  onUpdateTrim,
  onUpdateFade,
  onClose,
}) => {
  const [startTime, setStartTime] = useState(audioFile.trimConfig?.startTime || 0);
  const [endTime, setEndTime] = useState(audioFile.trimConfig?.endTime || audioFile.duration);
  const [fadeIn, setFadeIn] = useState(audioFile.fadeConfig?.fadeIn || 0);
  const [fadeOut, setFadeOut] = useState(audioFile.fadeConfig?.fadeOut || 0);

  const handleSave = () => {
    onUpdateTrim({ startTime, endTime });
    onUpdateFade({ fadeIn, fadeOut });
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-auto">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Audio: {audioFile.fileName}</h3>
          <p className="text-sm text-gray-500">Duration: {formatTime(audioFile.duration)}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Trim Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-gray-600" />
              <h4 className="font-medium">Trim Audio</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <label>Start Time: {formatTime(startTime)}</label>
              </div>
              <Slider
                value={[startTime]}
                onValueChange={(values) => setStartTime(Math.min(values[0], endTime - 0.1))}
                min={0}
                max={audioFile.duration}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <label>End Time: {formatTime(endTime)}</label>
              </div>
              <Slider
                value={[endTime]}
                onValueChange={(values) => setEndTime(Math.max(values[0], startTime + 0.1))}
                min={0}
                max={audioFile.duration}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="text-xs text-gray-500">
              Selected duration: {formatTime(endTime - startTime)}
            </div>
          </div>

          {/* Fade Section */}
          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-gray-600" />
              <h4 className="font-medium">Fade Effects</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <label>Fade In: {fadeIn.toFixed(1)}s</label>
              </div>
              <Slider
                value={[fadeIn]}
                onValueChange={(values) => setFadeIn(values[0])}
                min={0}
                max={Math.min(5, (endTime - startTime) / 2)}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <label>Fade Out: {fadeOut.toFixed(1)}s</label>
              </div>
              <Slider
                value={[fadeOut]}
                onValueChange={(values) => setFadeOut(values[0])}
                min={0}
                max={Math.min(5, (endTime - startTime) / 2)}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioEditor;
