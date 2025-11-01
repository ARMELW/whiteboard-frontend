import React from 'react';
import { ShapeAsset } from '@/app/shapes/api/shapesService';
import { ShapeCard } from './ShapeCard';
import { useShapeLibraryStore } from './useShapeLibraryStore';
import { useShapesActions } from '@/app/shapes';
import { toast } from 'sonner';

interface ShapeGridProps {
  shapes: ShapeAsset[];
  onShapeChanged?: () => void;
}

export const ShapeGrid: React.FC<ShapeGridProps> = ({ shapes, onShapeChanged }) => {
  const {
    selectedShapeId,
    editingShapeId,
    editName,
    editTags,
    editCategory,
    handleSelectShape,
    handleEditShape,
    handleDeleteShape,
    handleSaveEdit,
    handleCancelEdit,
    setEditName,
    setEditTags,
    setEditCategory,
    formatSize,
    formatDate,
  } = useShapeLibraryStore();

  const { updateShape, deleteShape } = useShapesActions();

  const handleDelete = async (shapeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette forme ?')) {
      try {
        await deleteShape(shapeId);
        onShapeChanged?.();
      } catch (error) {
        console.error('Error deleting shape:', error);
        toast.error('Erreur lors de la suppression de la forme');
      }
    }
  };

  const handleSave = async (shapeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const tags = editTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      await updateShape(shapeId, {
        name: editName,
        tags,
        category: editCategory as any,
      });
      handleSaveEdit(shapeId, e, onShapeChanged);
    } catch (error) {
      console.error('Error updating shape:', error);
      toast.error('Erreur lors de la mise à jour de la forme');
    }
  };

  if (shapes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-lg mb-2">Aucune forme trouvée</p>
        <p className="text-sm">Importez des formes SVG pour commencer</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4">
      {shapes.map((shape) => (
        <ShapeCard
          key={shape.id}
          shape={shape}
          isSelected={selectedShapeId === shape.id}
          isEditing={editingShapeId === shape.id}
          editName={editName}
          editTags={editTags}
          editCategory={editCategory}
          onSelect={() => handleSelectShape(shape)}
          onEdit={(e) => handleEditShape(shape, e)}
          onDelete={(e) => handleDelete(shape.id, e)}
          onSaveEdit={(e) => handleSave(shape.id, e)}
          onCancelEdit={handleCancelEdit}
          onEditNameChange={setEditName}
          onEditTagsChange={setEditTags}
          onEditCategoryChange={setEditCategory}
          formatSize={formatSize}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};
