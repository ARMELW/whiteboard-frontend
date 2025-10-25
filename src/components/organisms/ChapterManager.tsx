import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FolderOpen, Folder } from 'lucide-react';

export interface Chapter {
  id: string;
  name: string;
  sceneIndices: number[]; // Indices des scènes dans ce chapitre
  isExpanded: boolean;
}

interface ChapterManagerProps {
  chapters: Chapter[];
  totalScenes: number;
  onChaptersChange: (chapters: Chapter[]) => void;
  onSelectScene: (sceneIndex: number) => void;
  selectedSceneIndex: number;
  renderSceneCard: (sceneIndex: number) => React.ReactNode;
}

const ChapterManager: React.FC<ChapterManagerProps> = ({
  chapters,
  totalScenes,
  onChaptersChange,
  onSelectScene,
  selectedSceneIndex,
  renderSceneCard
}) => {
  const toggleChapter = (chapterId: string) => {
    const updatedChapters = chapters.map(chapter =>
      chapter.id === chapterId
        ? { ...chapter, isExpanded: !chapter.isExpanded }
        : chapter
    );
    onChaptersChange(updatedChapters);
  };

  // Obtenir les scènes qui ne sont dans aucun chapitre
  const getUnassignedScenes = (): number[] => {
    const assignedScenes = new Set<number>();
    chapters.forEach(chapter => {
      chapter.sceneIndices.forEach(index => assignedScenes.add(index));
    });
    
    const unassigned: number[] = [];
    for (let i = 0; i < totalScenes; i++) {
      if (!assignedScenes.has(i)) {
        unassigned.push(i);
      }
    }
    return unassigned;
  };

  const unassignedScenes = getUnassignedScenes();

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Chapitres */}
      {chapters.map((chapter) => (
        <div key={chapter.id} className="bg-white rounded-lg border border-border overflow-hidden">
          {/* En-tête du chapitre */}
          <button
            onClick={() => toggleChapter(chapter.id)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
          >
            {chapter.isExpanded ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )}
            {chapter.isExpanded ? (
              <FolderOpen className="w-4 h-4 flex-shrink-0 text-primary" />
            ) : (
              <Folder className="w-4 h-4 flex-shrink-0 text-primary" />
            )}
            <span className="font-semibold text-sm">{chapter.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {chapter.sceneIndices.length} scène{chapter.sceneIndices.length > 1 ? 's' : ''}
            </span>
          </button>

          {/* Scènes du chapitre */}
          {chapter.isExpanded && (
            <div className="p-3 flex gap-3 overflow-x-auto hide-scrollbar">
              {chapter.sceneIndices.map((sceneIndex) => (
                <div key={sceneIndex} className="scene-card">
                  {renderSceneCard(sceneIndex)}
                </div>
              ))}
              {chapter.sceneIndices.length === 0 && (
                <div className="flex-1 text-center py-4 text-muted-foreground text-xs">
                  Aucune scène dans ce chapitre
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Scènes non assignées */}
      {unassignedScenes.length > 0 && (
        <div className="bg-white rounded-lg border border-border border-dashed overflow-hidden">
          <div className="px-3 py-2 bg-secondary/10">
            <span className="font-semibold text-sm text-muted-foreground">
              Scènes sans chapitre
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              ({unassignedScenes.length})
            </span>
          </div>
          <div className="p-3 flex gap-3 overflow-x-auto hide-scrollbar">
            {unassignedScenes.map((sceneIndex) => (
              <div key={sceneIndex} className="scene-card">
                {renderSceneCard(sceneIndex)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterManager;
