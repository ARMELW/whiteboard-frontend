import { useState } from 'react';
import { Dashboard } from './dashboard/Dashboard';
import { ProjectsPage } from './dashboard/ProjectsPage';
import { ChannelProjectsPage } from './dashboard/ChannelProjectsPage';
import { Button } from '@/components/ui/button';
import { Home, FolderOpen, Settings, ChevronLeft } from 'lucide-react';

type Page = 'dashboard' | 'projects' | 'channelProjects';

interface NavigationState {
  page: Page;
  channelId?: string;
  channelName?: string;
}

export function DashboardApp() {
  const [navState, setNavState] = useState<NavigationState>({ page: 'dashboard' });

  const navigateToChannelProjects = (channelId: string, channelName: string) => {
    setNavState({ page: 'channelProjects', channelId, channelName });
  };

  const navigateToHome = () => {
    setNavState({ page: 'dashboard' });
  };

  const navigateToAllProjects = () => {
    setNavState({ page: 'projects' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">Whiteboard Anim</h1>
              <div className="flex gap-2">
                {navState.page !== 'dashboard' && (
                  <Button
                    variant="ghost"
                    onClick={navigateToHome}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                )}
                <Button
                  variant={navState.page === 'dashboard' ? 'default' : 'ghost'}
                  onClick={navigateToHome}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={navState.page === 'projects' ? 'default' : 'ghost'}
                  onClick={navigateToAllProjects}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Tous les projets
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {navState.page === 'dashboard' && (
          <Dashboard onChannelClick={navigateToChannelProjects} />
        )}
        {navState.page === 'projects' && <ProjectsPage />}
        {navState.page === 'channelProjects' && navState.channelId && (
          <ChannelProjectsPage
            channelId={navState.channelId}
            channelName={navState.channelName || 'Chaîne'}
          />
        )}
      </main>
    </div>
  );
}
