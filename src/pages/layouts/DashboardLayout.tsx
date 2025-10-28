import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Settings, ChevronLeft, LogOut } from 'lucide-react';
import { useAuth, useSession } from '@/app/auth';
import { PlanBadge } from '@/app/subscription/components';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Mes chaines', icon: Home }
] as const;

export function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, isLoggingOut } = useAuth();
  const { user, planId } = useSession();

  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo et navigation */}
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap">
                Doodlio
              </h1>
              
              <div className="hidden md:flex gap-1">
                {!isHome && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    <ChevronLeft className="h-4 w-4 mr-1.5" />
                    Retour
                  </Button>
                )}
                {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                  <Button
                    key={path}
                    variant={pathname === path ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate(path)}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    <span className="hidden lg:inline">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user && (
                <>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                    aria-label="Voir les plans et tarifs"
                  >
                    <PlanBadge planId={planId as any} />
                  </button>
                  <span className="text-sm text-muted-foreground hidden xl:inline truncate max-w-[200px]">
                    {user.email}
                  </span>
                </>
              )}
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/settings')}
                  aria-label="Paramètres"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  disabled={isLoggingOut}
                  aria-label="Se déconnecter"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}