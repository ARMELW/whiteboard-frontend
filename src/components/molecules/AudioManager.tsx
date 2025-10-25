/**
 * Audio Manager Component
 * Manages audio library with upload, preview, categorization, and editing
 */

import React, { useRef, useState } from 'react';
import { Upload, Trash2, Music, Star, Edit2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioLibrary, useAudioActions, AUDIO_CONFIG, AudioCategory, AudioFilter } from '@/app/audio';
import AudioPlayer from './AudioPlayer';
import AudioEditor from './AudioEditor';

const AudioManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AudioCategory | undefined>();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [editingAudio, setEditingAudio] = useState<string | null>(null);

  const filter: AudioFilter = {
    search: searchQuery || undefined,
    category: selectedCategory,
    favoritesOnly: showFavoritesOnly,
  };

  const { files } = useAudioLibrary(filter);
  const { 
    upload, 
    isUploading, 
    uploadProgress, 
    deleteAudio, 
    toggleFavorite,
    updateCategory,
    updateTrim,
    updateFade,
    error 
  } = useAudioActions();

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

  const editingFile = editingAudio ? files.find(f => f.id === editingAudio) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Upload Section */}
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

      {/* Search and Filter Section */}
      <div className="p-3 border-b border-gray-200 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search audio files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-600" />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value as AudioCategory || undefined)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="">All Categories</option>
            <option value={AudioCategory.MUSIC}>Music</option>
            <option value={AudioCategory.SFX}>Sound Effects</option>
            <option value={AudioCategory.VOICEOVER}>Voiceover</option>
            <option value={AudioCategory.AMBIENT}>Ambient</option>
            <option value={AudioCategory.OTHER}>Other</option>
          </select>

          <Button
            size="sm"
            variant={showFavoritesOnly ? 'default' : 'outline'}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="h-7 px-2"
          >
            <Star className={`h-3 w-3 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Audio Files List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Music className="h-12 w-12 mb-2" />
            <p className="text-sm">No audio files found</p>
            <p className="text-xs mt-1">
              {searchQuery || selectedCategory || showFavoritesOnly
                ? 'Try adjusting your filters'
                : 'Click "Upload Audio" to add files'}
            </p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg border border-gray-200 p-3 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {file.fileName}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(file.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Star 
                        className={`h-3 w-3 ${file.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                      />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {Math.floor(file.duration)}s
                  </div>
                  {file.category && (
                    <div className="mt-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {file.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingAudio(file.id)}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAudio(file.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Category Selector */}
              <select
                value={file.category || AudioCategory.OTHER}
                onChange={(e) => updateCategory(file.id, e.target.value as AudioCategory)}
                className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
              >
                <option value={AudioCategory.MUSIC}>Music</option>
                <option value={AudioCategory.SFX}>Sound Effects</option>
                <option value={AudioCategory.VOICEOVER}>Voiceover</option>
                <option value={AudioCategory.AMBIENT}>Ambient</option>
                <option value={AudioCategory.OTHER}>Other</option>
              </select>
              
              <AudioPlayer audioUrl={file.fileUrl} fileName={file.fileName} compact />
            </div>
          ))
        )}
      </div>

      {/* Audio Editor Modal */}
      {editingFile && (
        <AudioEditor
          audioFile={editingFile}
          onUpdateTrim={(trimConfig) => updateTrim({ id: editingFile.id, trimConfig })}
          onUpdateFade={(fadeConfig) => updateFade({ id: editingFile.id, fadeConfig })}
          onClose={() => setEditingAudio(null)}
        />
      )}
    </div>
  );
};

export default AudioManager;
