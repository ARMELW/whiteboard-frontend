import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, FolderOpen, Settings, ChevronLeft } from 'lucide-react';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isProjects = location.pathname === '/projects';

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToAllProjects = () => {
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">Whiteboard Anim</h1>
              <div className="flex gap-2">
                {!isHome && (
                  <Button
                    variant="ghost"
                    onClick={navigateToHome}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                )}
                <Button
                  variant={isHome ? 'default' : 'ghost'}
                  onClick={navigateToHome}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={isProjects ? 'default' : 'ghost'}
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
        <Outlet />
      </main>
    </div>
  );
}
