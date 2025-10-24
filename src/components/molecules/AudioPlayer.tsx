/**
 * Audio Player Component
 * Displays audio preview controls with play/pause/stop
 */

import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudioPlayer } from '@/app/audio';

interface AudioPlayerProps {
  audioUrl: string;
  fileName: string;
  compact?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, fileName, compact = false }) => {
  const { isPlaying, currentTime, duration, volume, play, pause, stop, seek, setVolume } = useAudioPlayer(audioUrl);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-gray-50 rounded-lg border border-gray-200 ${compact ? 'p-2' : 'p-3'}`}>
      {!compact && (
        <div className="text-sm font-medium text-gray-700 mb-2 truncate">{fileName}</div>
      )}
      
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {!isPlaying ? (
            <Button
              size="sm"
              variant="outline"
              onClick={play}
              className="h-8 w-8 p-0"
            >
              <Play className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={pause}
              className="h-8 w-8 p-0"
            >
              <Pause className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={stop}
            className="h-8 w-8 p-0"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={(value) => seek(value[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {!compact && (
          <div className="w-20">
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0] / 100)}
              className="cursor-pointer"
            />
            <div className="text-xs text-gray-500 text-center mt-1">
              {Math.round(volume * 100)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
