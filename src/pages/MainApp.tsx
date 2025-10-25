import { useState } from 'react';
import { DashboardApp } from './DashboardApp';
import { AnimationContainer } from '@/components/organisms';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Palette } from 'lucide-react';

type View = 'dashboard' | 'editor';

export function MainApp() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white rounded-lg shadow-lg p-2">
        <Button
          variant={currentView === 'dashboard' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView('dashboard')}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant={currentView === 'editor' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView('editor')}
        >
          <Palette className="h-4 w-4 mr-2" />
          Éditeur
        </Button>
      </div>

      {currentView === 'dashboard' ? <DashboardApp /> : <AnimationContainer />}
    </div>
  );
}
