import { useState } from 'react';
import { Dashboard } from './dashboard/Dashboard';
import { ProjectsPage } from './dashboard/ProjectsPage';
import { Button } from '@/components/ui/button';
import { Home, FolderOpen, Settings } from 'lucide-react';

type Page = 'dashboard' | 'projects' | 'editor';

export function DashboardApp() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">Whiteboard Anim</h1>
              <div className="flex gap-2">
                <Button
                  variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage('dashboard')}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={currentPage === 'projects' ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage('projects')}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Projets
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
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'projects' && <ProjectsPage />}
      </main>
    </div>
  );
}
