/**
 * Multi-Camera View Demo Page
 * Demonstrates the multi-camera surveillance system functionality
 */

import React, { useState } from 'react';
import MultiCameraView, { CameraFeed, GridLayout } from '@/components/organisms/MultiCameraView';
import { Button } from '@/components/atoms';
import { ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MultiCameraDemo: React.FC = () => {
  const navigate = useNavigate();
  
  const [initialCameras] = useState<CameraFeed[]>([
    { 
      id: 'cam-1', 
      name: 'Entrée Principale', 
      location: 'Rez-de-chaussée', 
      status: 'active', 
      recording: true,
      position: { x: 0.3, y: 0.3 },
      zoom: 1.0,
    },
    { 
      id: 'cam-2', 
      name: 'Parking Est', 
      location: 'Extérieur', 
      status: 'active', 
      recording: true,
      position: { x: 0.7, y: 0.3 },
      zoom: 1.2,
    },
    { 
      id: 'cam-3', 
      name: 'Couloir A', 
      location: '1er étage', 
      status: 'active', 
      recording: false,
      position: { x: 0.3, y: 0.7 },
      zoom: 0.8,
    },
    { 
      id: 'cam-4', 
      name: 'Salle Serveur', 
      location: 'Sous-sol', 
      status: 'active', 
      recording: true,
      position: { x: 0.7, y: 0.7 },
      zoom: 1.5,
    },
  ]);

  const [cameras, setCameras] = useState<CameraFeed[]>(initialCameras);
  const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(null);

  const handleCamerasChange = (updatedCameras: CameraFeed[]) => {
    setCameras(updatedCameras);
  };

  const handleCameraSelect = (camera: CameraFeed | null) => {
    setSelectedCamera(camera);
    console.log('Camera selected:', camera);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Demo Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Démo Multi-Caméra</h1>
              <p className="text-gray-400 text-sm">Système de gestion de caméras multiples avec séquençage automatique</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-blue-400">
            <Info className="h-5 w-5" />
            <span className="text-sm">
              {selectedCamera ? `Caméra sélectionnée: ${selectedCamera.name}` : 'Aucune caméra sélectionnée'}
            </span>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-900/20 border-b border-blue-800/50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <h3 className="font-semibold text-white mb-2">🎥 Layouts disponibles</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Vue unique (1x1) - Plein écran</li>
                <li>• Grille 2x2 - Jusqu'à 4 caméras</li>
                <li>• Grille 3x3 - Jusqu'à 9 caméras</li>
                <li>• Grille 2x3 - Jusqu'à 6 caméras</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-3 rounded-lg">
              <h3 className="font-semibold text-white mb-2">⚡ Fonctionnalités</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Séquençage automatique des caméras</li>
                <li>• Mode plein écran pour chaque caméra</li>
                <li>• Détection de mouvement simulée</li>
                <li>• Contrôle d'enregistrement par caméra</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-3 rounded-lg">
              <h3 className="font-semibold text-white mb-2">🎮 Contrôles</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Cliquer pour sélectionner une caméra</li>
                <li>• Icône plein écran pour agrandir</li>
                <li>• Bouton + pour ajouter une caméra</li>
                <li>• Bouton séquencer pour le défilement auto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Camera View */}
      <div className="flex-1 overflow-hidden">
        <MultiCameraView
          cameras={cameras}
          onCamerasChange={handleCamerasChange}
          onCameraSelect={handleCameraSelect}
          defaultLayout="2x2"
          enableSequencing={true}
          sequenceDuration={5000}
          className="h-full"
        />
      </div>

      {/* Footer Info */}
      <div className="bg-gray-800 border-t border-gray-700 p-2">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-xs">
          <p>
            Système de surveillance multi-caméras • {cameras.length} caméra{cameras.length > 1 ? 's' : ''} active{cameras.length > 1 ? 's' : ''}
            {selectedCamera && ` • Vue actuelle: ${selectedCamera.name}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiCameraDemo;
