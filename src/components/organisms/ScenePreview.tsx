import React from 'react';
import { useCurrentScene } from '@/app/scenes';

// Composant de prévisualisation de la scène avec thème et padding
const ScenePreview: React.FC = () => {
  const scene = useCurrentScene();

  if (!scene) return null;

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <div className="rounded-xl shadow-lg border border-border bg-white p-8" style={{ minWidth: 600, minHeight: 340 }}>
        {/* Ici, on peut utiliser un composant Canvas ou LayerEditor en mode lecture seule */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold mb-4">Prévisualisation de la scène</h2>
          {/* Placeholder pour le rendu de la scène */}
          <div className="bg-gray-200 w-[480px] h-[270px] flex items-center justify-center rounded-lg">
            <span className="text-gray-500">[Aperçu de la scène ici]</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenePreview;
