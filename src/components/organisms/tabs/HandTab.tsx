/**
 * Hand Tab Component
 * Tab for managing hand animations in the context panel
 */

import React, { useState } from 'react';
import { Hand, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HandLibraryDialog, HandType } from '../HandLibraryDialog';

const HandTab: React.FC = () => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedHandType, setSelectedHandType] = useState<HandType>(HandType.NONE);

  const handleSelectHand = (handType: HandType) => {
    setSelectedHandType(handType);
    // TODO: Integrate with scene/layer system to apply hand animation
  };

  const getHandLabel = (handType: HandType): string => {
    const labels: Record<HandType, string> = {
      [HandType.NONE]: 'Aucune main',
      [HandType.HAND_1]: 'Main droite - Claire',
      [HandType.HAND_2]: 'Main droite - Medium',
      [HandType.HAND_3]: 'Main droite - Foncée',
      [HandType.HAND_4]: 'Main gauche - Claire',
      [HandType.HAND_5]: 'Main gauche - Medium',
      [HandType.HAND_6]: 'Main gauche - Foncée',
    };
    return labels[handType];
  };

  return (
    <>
      <HandLibraryDialog
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectHand={handleSelectHand}
        currentHandType={selectedHandType}
      />

      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-gray-200 space-y-3">
          <Button
            onClick={() => setIsLibraryOpen(true)}
            className="w-full"
            size="sm"
          >
            <Hand className="h-4 w-4 mr-2" />
            Choose Hand Type
          </Button>
          
          <div className="text-xs text-gray-500">
            Select hand animations for writing effects
          </div>
        </div>

        {/* Current Selection */}
        <div className="flex-1 overflow-y-auto p-3">
          {selectedHandType === HandType.NONE ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Hand className="h-12 w-12 mb-2" />
              <p className="text-sm">No hand selected</p>
              <p className="text-xs mt-1">Click "Choose Hand Type" to select</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <Hand className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Current Hand</h3>
                    <p className="text-xs text-gray-600">{getHandLabel(selectedHandType)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-blue-900 mb-2">Usage</h4>
                <p className="text-xs text-blue-700">
                  This hand will be used for handwriting animations in your scenes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(HandTab);
