import React, { useState } from 'react';
import { useTemplateActions, TemplateType, TemplateStyle } from '@/app/templates';
import { Scene } from '@/app/scenes/types';
import { Button, Input } from '../atoms';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SaveAsTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  scene: Scene;
}

const SaveAsTemplateDialog: React.FC<SaveAsTemplateDialogProps> = ({
  isOpen,
  onClose,
  scene,
}) => {
  const [name, setName] = useState(`Template - ${scene.title}`);
  const [description, setDescription] = useState(scene.content);
  const [type, setType] = useState<TemplateType>(TemplateType.OTHER);
  const [style, setStyle] = useState<TemplateStyle>(TemplateStyle.MINIMAL);
  const [tags, setTags] = useState('');
  
  const { createTemplateFromScene, loading } = useTemplateActions();

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Le nom du template est requis');
      return;
    }

    const template = await createTemplateFromScene(scene, {
      name: name.trim(),
      description: description.trim(),
      type,
      style,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });

    if (template) {
      alert('Template créé avec succès !');
      onClose();
      // Reset form
      setName(`Template - ${scene.title}`);
      setDescription(scene.content);
      setType(TemplateType.OTHER);
      setStyle(TemplateStyle.MINIMAL);
      setTags('');
    } else {
      alert('Erreur lors de la création du template');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sauvegarder comme Template</DialogTitle>
          <DialogDescription>
            Créez un template réutilisable depuis cette scène
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="template-name">Nom du template *</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du template"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du template"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="template-type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as TemplateType)}>
              <SelectTrigger id="template-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TemplateType.EDUCATION}>Éducatif</SelectItem>
                <SelectItem value={TemplateType.MARKETING}>Marketing</SelectItem>
                <SelectItem value={TemplateType.PRESENTATION}>Présentation</SelectItem>
                <SelectItem value={TemplateType.TUTORIAL}>Tutoriel</SelectItem>
                <SelectItem value={TemplateType.ENTERTAINMENT}>Divertissement</SelectItem>
                <SelectItem value={TemplateType.OTHER}>Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label htmlFor="template-style">Style</Label>
            <Select value={style} onValueChange={(value) => setStyle(value as TemplateStyle)}>
              <SelectTrigger id="template-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TemplateStyle.MINIMAL}>Minimaliste</SelectItem>
                <SelectItem value={TemplateStyle.COLORFUL}>Coloré</SelectItem>
                <SelectItem value={TemplateStyle.PROFESSIONAL}>Professionnel</SelectItem>
                <SelectItem value={TemplateStyle.CREATIVE}>Créatif</SelectItem>
                <SelectItem value={TemplateStyle.DARK}>Sombre</SelectItem>
                <SelectItem value={TemplateStyle.LIGHT}>Clair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="template-tags">Tags (séparés par des virgules)</Label>
            <Input
              id="template-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="animation, tutoriel, simple..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Sauvegarde...
              </>
            ) : (
              'Sauvegarder'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveAsTemplateDialog;
