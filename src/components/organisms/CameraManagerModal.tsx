import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '../atoms';

interface CameraItem {
  id: string;
  name?: string;
  zoom?: number;
  position?: any;
  width?: number;
  height?: number;
  isDefault?: boolean;
  archived?: boolean;
  [key: string]: any;
}

interface CameraManagerModalProps {
  cameras: CameraItem[];
  onClose: () => void;
  onSave: (updated: CameraItem[]) => void;
}

const CameraManagerModal: React.FC<CameraManagerModalProps> = ({ cameras, onClose, onSave }) => {
  const [local, setLocal] = useState<CameraItem[]>(() => cameras.map(c => ({ ...c })));

  const toggleArchive = (id: string) => {
    setLocal(prev => prev.map(c => c.id === id ? { ...c, archived: !c.archived } : c));
  };

  const handleDelete = (id: string) => {
    const cam = local.find(c => c.id === id);
    if (!cam) return;
    if (cam.isDefault) {
      alert('La caméra par défaut ne peut pas être supprimée');
      return;
    }
    if (!window.confirm(`Supprimer la caméra "${cam.name || cam.id}" ? Cette action est définitive.`)) return;
    const updated = local.filter(c => c.id !== id);
    setLocal(updated);
    // Immediately persist via onSave and close modal
    onSave(updated);
    onClose();
  };

  const updateField = (id: string, field: string, value: any) => {
    setLocal(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    onSave(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Gestion des caméras</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground"><X /></button>
        </div>

        <div className="p-4 space-y-3">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Conseil:</strong> Utilisez plusieurs caméras pour créer des scènes avec différents points de vue. 
              Les caméras peuvent être positionnées librement sur une scène immense pour capturer différentes zones.
            </p>
          </div>
          
          {local.map((cam) => (
            <div key={cam.id} className={`flex items-start gap-3 p-4 border-2 rounded-lg transition-all ${cam.archived ? 'opacity-50 bg-gray-50 border-gray-300' : 'bg-white border-gray-200 hover:border-purple-300'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <strong className="text-lg">{cam.isDefault ? `${cam.name} (par défaut)` : cam.name}</strong>
                  {cam.isDefault && <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">Protégée</span>}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nom de la caméra</label>
                    <input
                      className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={cam.name || ''}
                      onChange={(e) => updateField(cam.id, 'name', e.target.value)}
                      disabled={cam.isDefault}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Zoom</label>
                    <input
                      className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      type="number"
                      step={0.1}
                      min={0.1}
                      max={3}
                      value={cam.zoom ?? 1}
                      onChange={(e) => updateField(cam.id, 'zoom', parseFloat(e.target.value || '1'))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Dimensions:</span>
                    <div className="font-medium mt-1">{cam.width || 800} × {cam.height || 450}px</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Position X:</span>
                    <div className="font-medium mt-1">{((cam.position?.x || 0.5) * 100).toFixed(1)}%</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Position Y:</span>
                    <div className="font-medium mt-1">{((cam.position?.y || 0.5) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {!cam.isDefault && (
                  <>
                    <button
                      onClick={() => toggleArchive(cam.id)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${cam.archived ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                    >
                      {cam.archived ? 'Restaurer' : 'Archiver'}
                    </button>
                    <button
                      onClick={() => handleDelete(cam.id)}
                      className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 text-sm font-medium transition-colors"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave} className="bg-primary text-white">Enregistrer</Button>
        </div>
      </div>
    </div>
  );
};

export default CameraManagerModal;
