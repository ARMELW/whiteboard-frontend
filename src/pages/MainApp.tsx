import { useState } from 'react';
import { DashboardApp } from './DashboardApp';
import { AnimationContainer } from '@/components/organisms';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Palette } from 'lucide-react';
import { Project } from '@/app/projects/types';
import { useSceneStore } from '@/app/scenes';

type View = 'dashboard' | 'editor';

export function MainApp() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const setCurrentProjectId = useSceneStore((state) => state.setCurrentProjectId);

  const handleOpenEditor = (project: Project) => {
    setSelectedProject(project);
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
