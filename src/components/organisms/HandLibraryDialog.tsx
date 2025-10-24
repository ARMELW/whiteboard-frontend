import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Hand } from 'lucide-react';

export enum HandType {
  NONE = 'none',
  HAND_1 = 'hand_1', // Main droite - peau claire
  HAND_2 = 'hand_2', // Main droite - peau medium
  HAND_3 = 'hand_3', // Main droite - peau foncée
  HAND_4 = 'hand_4', // Main gauche - peau claire
  HAND_5 = 'hand_5', // Main gauche - peau medium
  HAND_6 = 'hand_6', // Main gauche - peau foncée
}

interface HandLibraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHand: (handType: HandType) => void;
  currentHandType?: HandType;
}

const handOptions = [
  { type: HandType.NONE, label: 'Aucune main', description: 'Pas de main visible' },
  { type: HandType.HAND_1, label: 'Main droite - Claire', description: 'Main droite avec peau claire' },
  { type: HandType.HAND_2, label: 'Main droite - Medium', description: 'Main droite avec peau medium' },
  { type: HandType.HAND_3, label: 'Main droite - Foncée', description: 'Main droite avec peau foncée' },
  { type: HandType.HAND_4, label: 'Main gauche - Claire', description: 'Main gauche avec peau claire' },
  { type: HandType.HAND_5, label: 'Main gauche - Medium', description: 'Main gauche avec peau medium' },
  { type: HandType.HAND_6, label: 'Main gauche - Foncée', description: 'Main gauche avec peau foncée' },
];

export const HandLibraryDialog: React.FC<HandLibraryDialogProps> = ({
  isOpen,
  onClose,
  onSelectHand,
  currentHandType = HandType.NONE,
}) => {
  const [selectedHand, setSelectedHand] = useState<HandType>(currentHandType);

  const handleSelect = (handType: HandType) => {
    setSelectedHand(handType);
  };

  const handleConfirm = () => {
    onSelectHand(selectedHand);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bibliothèque de mains</DialogTitle>
          <DialogDescription>
            Sélectionnez le type de main pour l'animation d'écriture
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {handOptions.map((hand) => (
            <button
              key={hand.type}
              onClick={() => handleSelect(hand.type)}
              className={`group relative flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                selectedHand === hand.type
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50 hover:bg-secondary/50'
              }`}
            >
              <div className={`flex h-20 w-20 items-center justify-center rounded-full transition-colors ${
                selectedHand === hand.type
                  ? 'bg-primary/20'
                  : 'bg-muted group-hover:bg-primary/10'
              }`}>
                <Hand className={`h-10 w-10 ${
                  selectedHand === hand.type ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm mb-1">{hand.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {hand.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleConfirm}>
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
