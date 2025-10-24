import { useEffect } from 'react';
import { AnimationContainer } from './components/organisms';
import { loadGoogleFonts } from './utils/fontLoader';

function App() {
  // Load Google Fonts on app mount
  useEffect(() => {
    loadGoogleFonts();
  }, []);

  return <AnimationContainer />;
}

export default App;
