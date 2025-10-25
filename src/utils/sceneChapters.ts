/**
 * SceneChapter Type and Helper Functions
 * Groups scenes into chapters for better organization
 */

export interface SceneChapter {
  id: string;
  name: string;
  sceneIds: string[];
  isExpanded: boolean;
}

export const DEFAULT_CHAPTER_SIZE = 5;

/**
 * Group scenes into chapters
 * Each chapter contains up to 5 scenes by default
 */
export function groupScenesIntoChapters(
  scenes: any[],
  chapterSize: number = DEFAULT_CHAPTER_SIZE
): SceneChapter[] {
  const chapters: SceneChapter[] = [];
  
  for (let i = 0; i < scenes.length; i += chapterSize) {
    const chapterScenes = scenes.slice(i, Math.min(i + chapterSize, scenes.length));
    const chapterNumber = Math.floor(i / chapterSize) + 1;
    
    chapters.push({
      id: `chapter-${chapterNumber}`,
      name: `Chapitre ${chapterNumber}`,
      sceneIds: chapterScenes.map(scene => scene.id),
      isExpanded: true, // Default to expanded
    });
  }
  
  return chapters;
}

/**
 * Get chapter containing a specific scene
 */
export function getChapterForScene(
  chapters: SceneChapter[],
  sceneId: string
): SceneChapter | null {
  return chapters.find(chapter => chapter.sceneIds.includes(sceneId)) || null;
}

/**
 * Get scene index within all scenes (considering chapters)
 */
export function getGlobalSceneIndex(
  chapters: SceneChapter[],
  sceneId: string
): number {
  let index = 0;
  
  for (const chapter of chapters) {
    const sceneIndex = chapter.sceneIds.indexOf(sceneId);
    if (sceneIndex !== -1) {
      return index + sceneIndex;
    }
    index += chapter.sceneIds.length;
  }
  
  return -1;
}
