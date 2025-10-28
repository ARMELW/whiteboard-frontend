import { useState, useEffect } from 'react';
import { DashboardApp } from './DashboardApp';
import { AnimationContainer } from '@/components/organisms';
import { Project } from '@/app/projects/types';
import { useSceneStore } from '@/app/scenes';
import { useProjectStore } from '@/app/projects/store';

type View = 'dashboard' | 'editor';

export function MainApp() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const setCurrentProjectId = useSceneStore((state) => state.setCurrentProjectId);
  const resetSceneStore = useSceneStore((state) => state.reset);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);

  const handleOpenEditor = (project: Project) => {
    setSelectedProject(project);
    setCurrentProject(project);
    setCurrentProjectId(project.id);
    setCurrentView('editor');
  };

  // Reset stores when switching back to dashboard
  useEffect(() => {
    if (currentView === 'dashboard') {
      resetSceneStore();
      setCurrentProject(null);
    }
  }, [currentView, resetSceneStore, setCurrentProject]);

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
