/**
 * Audio Tab Component
 * Tab for managing audio library in the context panel
 */

import React from 'react';
import AudioManager from '../../molecules/AudioManager';

const AudioTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <AudioManager />
    </div>
  );
};

export default AudioTab;
