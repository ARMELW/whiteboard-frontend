/**
 * Images Tab Component
 * Tab for managing image library in the context panel
 */

import React from 'react';
import ImageManager from '../../molecules/ImageManager';

const ImagesTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <ImageManager />
    </div>
  );
};

export default ImagesTab;
