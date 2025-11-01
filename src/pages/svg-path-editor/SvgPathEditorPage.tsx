import React from 'react';
import { SvgPathEditorCanvas } from '@/app/svg-path-editor/components/SvgPathEditorCanvas';
import { SvgPathEditorToolbar } from '@/app/svg-path-editor/components/SvgPathEditorToolbar';

export const SvgPathEditorPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <SvgPathEditorToolbar />
      <div className="flex-1 p-6">
        <SvgPathEditorCanvas />
      </div>
    </div>
  );
};
