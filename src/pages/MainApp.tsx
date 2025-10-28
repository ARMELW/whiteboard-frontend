import { useState } from 'react';
import { DashboardApp } from './DashboardApp';
import { AnimationContainer } from '@/components/organisms';
import { Project } from '@/app/projects/types';
import { useSceneStore } from '@/app/scenes';
import { useProjectStore, useProjectCleanup } from '@/app/projects';

type View = 'dashboard' | 'editor';

export function MainApp() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const setCurrentProjectId = useSceneStore((state) => state.setCurrentProjectId);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);

  // Reset stores when switching back to dashboard
  useProjectCleanup(currentView === 'dashboard');

  const handleOpenEditor = (project: Project) => {
    setSelectedProject(project);
    setCurrentProject(project);
    setCurrentProjectId(project.id);
    setCurrentView('editor');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'dashboard' ? (
        <DashboardApp onOpenEditor={handleOpenEditor} />
      ) : (
        <AnimationContainer />
      )}
    </div>
  );
}
