import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { loadGoogleFonts } from './utils/fontLoader';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Load Google Fonts on app mount
  useEffect(() => {
    loadGoogleFonts();
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
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
