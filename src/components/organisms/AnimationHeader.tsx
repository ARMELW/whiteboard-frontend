import React from 'react';
import { Save, Download, Undo, Redo, FileVideo, Play } from 'lucide-react';

const AnimationHeader: React.FC = () => (
  <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
    {/* Left: Logo & Project Name */}
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <FileVideo className="w-6 h-6 text-purple-500" />
      </div>
      <div className="h-6 w-px bg-gray-700" />
    </div>

    {/* Center: Quick Actions */}
    <div className="flex items-center gap-2">
      <button
        className="p-2 hover:bg-gray-800 rounded transition-colors"
        title="Annuler"
      >
        <Undo className="w-5 h-5 text-gray-300" />
      </button>
      <button
        className="p-2 hover:bg-gray-800 rounded transition-colors"
        title="Rétablir"
      >
        <Redo className="w-5 h-5 text-gray-300" />
      </button>
      <div className="h-6 w-px  mx-2" />
      <button
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
      >
        <Play className="w-4 h-4" />
      </button>
    </div>

    {/* Right: Save & Export */}
    <div className="flex items-center gap-2">
      <button
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-gray-300 rounded transition-colors"
      >
        <Save className="w-4 h-4" />
      </button>
      <button
        className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Exporter</span>
      </button>
    </div>
  </header>
);

export default AnimationHeader;