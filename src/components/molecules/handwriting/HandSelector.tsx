import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HandOption {
  id: string;
  name: string;
  imagePath: string;
  maskPath: string;
  thumbnail?: string;
}

interface HandSelectorProps {
  selectedHandId: string;
  onHandChange: (handId: string) => void;
  disabled?: boolean;
}

const HAND_OPTIONS: HandOption[] = [
  {
    id: 'default',
    name: 'Main par défaut',
    imagePath: '/data/images/drawing-hand.png',
    maskPath: '/data/images/hand-mask.png',
  },
  {
    id: 'hand-2',
    name: 'Main 2 (bientôt disponible)',
    imagePath: '/data/images/drawing-hand.png',
    maskPath: '/data/images/hand-mask.png',
  },
  {
    id: 'hand-3',
    name: 'Main 3 (bientôt disponible)',
    imagePath: '/data/images/drawing-hand.png',
    maskPath: '/data/images/hand-mask.png',
  },
];

export const HandSelector: React.FC<HandSelectorProps> = ({
  selectedHandId,
  onHandChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-foreground text-xs font-medium">
        Style de main
      </label>
      <Select
        value={selectedHandId}
        onValueChange={onHandChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <SelectValue placeholder="Sélectionner un style de main" />
        </SelectTrigger>
        <SelectContent>
          {HAND_OPTIONS.map((hand) => (
            <SelectItem 
              key={hand.id} 
              value={hand.id}
              disabled={hand.id !== 'default'}
            >
              <div className="flex items-center gap-2">
                <span>{hand.name}</span>
                {hand.id !== 'default' && (
                  <span className="text-xs text-muted-foreground">(à venir)</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Preview area - will show hand image when available */}
      <div className="mt-2 p-3 bg-secondary/30 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground mb-2">Aperçu:</div>
        <div className="h-20 bg-white/5 rounded flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            {selectedHandId === 'default' ? '✋ Main par défaut' : 'Photo à venir'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const getHandImages = (handId: string) => {
  const hand = HAND_OPTIONS.find(h => h.id === handId) || HAND_OPTIONS[0];
  return {
    imagePath: hand.imagePath,
    maskPath: hand.maskPath,
  };
};
