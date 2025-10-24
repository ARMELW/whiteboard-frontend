/**
 * Audio Manager Component
 * Manages audio library with upload, preview, and delete functionality
 */

import React, { useRef } from 'react';
import { Upload, Trash2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioLibrary, useAudioActions, AUDIO_CONFIG } from '@/app/audio';
import AudioPlayer from './AudioPlayer';

const AudioManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files } = useAudioLibrary();
  const { upload, isUploading, uploadProgress, deleteAudio, error } = useAudioActions();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        await upload({ file });
      } catch (err) {
        console.error('Failed to upload audio:', err);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <Button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full"
          size="sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Audio'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={AUDIO_CONFIG.ALLOWED_EXTENSIONS.join(',')}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        {error && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500">
          Supported: {AUDIO_CONFIG.ALLOWED_EXTENSIONS.join(', ')} (max {AUDIO_CONFIG.MAX_FILE_SIZE_MB}MB)
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Music className="h-12 w-12 mb-2" />
            <p className="text-sm">No audio files uploaded</p>
            <p className="text-xs mt-1">Click "Upload Audio" to add files</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg border border-gray-200 p-3 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {file.fileName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {Math.floor(file.duration)}s
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteAudio(file.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <AudioPlayer audioUrl={file.fileUrl} fileName={file.fileName} compact />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AudioManager;
