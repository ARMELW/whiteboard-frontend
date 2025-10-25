import { useEffect } from 'react';
import { MainApp } from './pages/MainApp';
import { loadGoogleFonts } from './utils/fontLoader';
import { migrateScenesToProjectHierarchy, ensureDefaultProject } from './utils/sceneMigration';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Load Google Fonts on app mount
  useEffect(() => {
    loadGoogleFonts();
  }, []);

  // Run data migration on app mount
  useEffect(() => {
    ensureDefaultProject();
    migrateScenesToProjectHierarchy();
  }, []);

  return (
    <ErrorBoundary>
      <MainApp />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'white',
            color: '#333',
            border: '1px solid #e5e7eb',
          },
        }}
        richColors
      />
    </ErrorBoundary>
  );
}

export default App;
