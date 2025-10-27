import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, FolderOpen, Settings, ChevronLeft, LogOut } from 'lucide-react';
import { useAuth, useSession } from '@/app/auth';
import { PlanBadge } from '@/app/subscription/components';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoggingOut } = useAuth();
  const { user, planId } = useSession();

  const isHome = location.pathname === '/';
  const isProjects = location.pathname === '/projects';

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToAllProjects = () => {
    navigate('/projects');
  };

  const handleLogout = async () => {
    await logout();
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
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="transition-transform hover:scale-105"
                    aria-label="Voir les plans et tarifs"
                  >
                    <PlanBadge planId={planId as any} />
                  </button>
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                </>
              )}
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
