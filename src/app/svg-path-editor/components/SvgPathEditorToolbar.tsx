import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { usePathEditorStore } from '../store';
import { SvgData } from '../types';
import { Upload, Trash2, Download, Undo, Redo, X } from 'lucide-react';

export const SvgPathEditorToolbar: React.FC = () => {
  const {
    svgData,
    points,
    setSvgData,
    clearPoints,
    reset,
    undo,
    redo,
    canUndo,
    canRedo,
  } = usePathEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('svg')) {
      alert('Please upload an SVG file');
      return;
    }

    try {
      const text = await file.text();
      
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(text, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;

      if (svgElement.nodeName !== 'svg') {
        alert('Invalid SVG file');
        return;
      }

      let width = 800;
      let height = 600;
      let viewBox = '';

      const widthAttr = svgElement.getAttribute('width');
      const heightAttr = svgElement.getAttribute('height');
      const viewBoxAttr = svgElement.getAttribute('viewBox');

      if (viewBoxAttr) {
        const [, , vbWidth, vbHeight] = viewBoxAttr.split(' ').map(Number);
        width = vbWidth;
        height = vbHeight;
        viewBox = viewBoxAttr;
      } else if (widthAttr && heightAttr) {
        width = parseFloat(widthAttr);
        height = parseFloat(heightAttr);
      }

      const svgData: SvgData = {
        content: text,
        width,
        height,
        viewBox,
      };

      setSvgData(svgData);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error loading SVG:', error);
      alert('Error loading SVG file');
    }
  };

  const handleExport = () => {
    if (points.length === 0) {
      alert('No points to export');
      return;
    }

    const exportData = points.map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) }));
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'path-points.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearPoints = () => {
    if (points.length === 0) return;
    if (confirm('Are you sure you want to clear all points?')) {
      clearPoints();
    }
  };

  const handleReset = () => {
    if (!svgData && points.length === 0) return;
    if (confirm('Are you sure you want to reset everything? This will clear the SVG and all points.')) {
      reset();
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white">SVG Path Editor</h1>
          {svgData && (
            <span className="text-sm text-gray-400">
              {points.length} point{points.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <Button
            onClick={handleUploadClick}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload SVG
          </Button>

          {svgData && (
            <>
              <div className="w-px h-6 bg-gray-600" />
              
              <Button
                onClick={() => undo()}
                disabled={!canUndo()}
                variant="ghost"
                size="sm"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => redo()}
                disabled={!canRedo()}
                variant="ghost"
                size="sm"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-gray-600" />

              <Button
                onClick={handleClearPoints}
                disabled={points.length === 0}
                variant="ghost"
                size="sm"
                className="gap-2"
                title="Clear all points"
              >
                <Trash2 className="w-4 h-4" />
                Clear Points
              </Button>

              <Button
                onClick={handleExport}
                disabled={points.length === 0}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </Button>

              <Button
                onClick={handleReset}
                variant="destructive"
                size="sm"
                className="gap-2"
                title="Reset everything"
              >
                <X className="w-4 h-4" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      {svgData && (
        <div className="mt-3 text-xs text-gray-400">
          <p>
            <strong>Tips:</strong> Click on the SVG to add points • Drag points to move them • 
            Press Delete key to remove selected point • Press Escape to deselect • 
            Ctrl+Z to undo • Ctrl+Y to redo
          </p>
        </div>
      )}
    </div>
  );
};
