/**
 * Media Tab Component
 * Unified tab for managing both assets and images in the context panel
 */

import React from 'react';
import MediaLibrary from '../MediaLibrary';

const MediaTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <MediaLibrary />
    </div>
  );
};

export default MediaTab;
