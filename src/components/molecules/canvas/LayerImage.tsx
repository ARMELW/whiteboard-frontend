import React, { useRef } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { applyMultiLayerDrag } from '@/utils/multiLayerDrag';

export interface LayerImageProps {
  layer: any;
  isSelected: boolean;
  onSelect: (e?: any) => void;
  onChange: (layer: any) => void;
  selectedLayerIds?: string[];
  allLayers?: any[];
}

const LayerImageComponent: React.FC<LayerImageProps> = ({
  layer,
  isSelected,
  onSelect,
  onChange,
  selectedLayerIds = [],
  allLayers = []
}) => {
  const [img] = useImage(layer.image_path);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current && img) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected, img]);

  if (!img) return null;

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const node = imageRef.current;
    if (!node) return pos;

    // Utilisation des dimensions stockées dans le layer, ou calcul initial
    // pour garantir la bonne limite de déplacement.
    const currentScale = layer.scale || 1.0;
    const width = layer.width || (img.width * currentScale); 
    const height = layer.height || (img.height * currentScale);

    let newX = pos.x;
    let newY = pos.y;
    const stageWidth = 1920;
    const stageHeight = 1080;

    // Limites en X
    if (newX < 0) newX = 0;
    if (newX + width > stageWidth) newX = stageWidth - width;

    // Limites en Y
    if (newY < 0) newY = 0;
    if (newY + height > stageHeight) newY = stageHeight - height;

    return { x: newX, y: newY };
  };

  return (
    <>
      <KonvaImage
        image={img}
        x={layer.position?.x || 0}
        y={layer.position?.y || 0}
        
        // CORRECTION 1: Simplification des scaleX/scaleY.
        // L'échelle globale (layer.scale) et le flip sont appliqués ici.
        // On retire layer.scaleX/Y si on ne gère que l'échelle uniforme.
        scaleX={(layer.scale || 1.0) * (layer.flipX ? -1 : 1)}
        scaleY={(layer.scale || 1.0) * (layer.flipY ? -1 : 1)}
        
        offsetX={layer.flipX ? img.width : 0}
        offsetY={layer.flipY ? img.height : 0}
        rotation={layer.rotation || 0}
        opacity={layer.opacity || 1.0}
        draggable={!layer.locked}
        dragBoundFunc={dragBoundFunc}
        onClick={(e) => onSelect(e)}
        onTap={(e) => onSelect(e)}
        ref={imageRef}
        onDragStart={(e) => {
          // Store initial position for multi-layer drag
          dragStartPosRef.current = {
            x: e.target.x(),
            y: e.target.y(),
            currentX: e.target.x(),
            currentY: e.target.y()
          };
        }}
        onDragMove={(e) => {
          // Just track position, don't update other layers yet (will do it in onDragEnd)
          if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
            // Track current position for the final update
            dragStartPosRef.current.currentX = e.target.x();
            dragStartPosRef.current.currentY = e.target.y();
          }
        }}
        onDragEnd={(e) => {
          const finalX = e.target.x();
          const finalY = e.target.y();

          const updatedLayer = {
            ...layer,
            position: {
              x: finalX,
              y: finalY,
            }
          };

          if (selectedLayerIds.length > 1 && dragStartPosRef.current) {
            const deltaX = finalX - dragStartPosRef.current.x;
            const deltaY = finalY - dragStartPosRef.current.y;

            applyMultiLayerDrag(selectedLayerIds, layer.id, updatedLayer, allLayers, deltaX, deltaY, onChange);
          } else {
            // Single layer drag
            onChange(updatedLayer);
          }

          dragStartPosRef.current = null;
        }}
        onTransformEnd={() => {
          const node = imageRef.current;
          if (!node) return;

          // CORRECTION 2: S'assurer que la nouvelle échelle est lue correctement (valeur absolue)
          // et que les dimensions sont mises à jour.
          
          // La nouvelle échelle est la valeur absolue de scaleX du node.
          // Elle inclut déjà la précédente layer.scale et le facteur du transformer.
          const newScale = Math.abs(node.scaleX()); 
          
          // Calcul des nouvelles dimensions affichées
          const newWidth = img.width * newScale;
          const newHeight = img.height * newScale;

          onChange({
            ...layer,
            position: {
              x: node.x(),
              y: node.y(),
            },
            // Mise à jour de width et height
            width: newWidth,
            height: newHeight,
            // Mise à jour de l'échelle
            scale: newScale,
            rotation: node.rotation(),
          });

          // ESSENTIEL : Réinitialiser le scale du nœud Konva à l'état de base (1 ou -1 pour le flip)
          // Cela force Konva à utiliser la nouvelle valeur 'layer.scale' (qui est dans les props)
          // pour le prochain rendu/transformation.
          node.scaleX(layer.flipX ? -1 : 1);
          node.scaleY(layer.flipY ? -1 : 1);
        }}
      />
      {isSelected && !layer.locked && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }

            if (newBox.x < 0 || newBox.y < 0 ||
              newBox.x + newBox.width > 1920 ||
              newBox.y + newBox.height > 1080) {
              return oldBox;
            }

            return newBox;
          }}
        />
      )}
    </>
  );
};

function areEqual(prevProps: LayerImageProps, nextProps: LayerImageProps) {
  // Comparaison plus complète pour inclure width/height/scale
  const l1 = prevProps.layer;
  const l2 = nextProps.layer;
  return (
    l1.id === l2.id &&
    l1.position?.x === l2.position?.x &&
    l1.position?.y === l2.position?.y &&
    l1.scale === l2.scale &&
    l1.width === l2.width && // Ajout de la comparaison de width
    l1.height === l2.height && // Ajout de la comparaison de height
    l1.rotation === l2.rotation &&
    l1.locked === l2.locked &&
    prevProps.isSelected === nextProps.isSelected
  );
}

export const LayerImage = React.memo(LayerImageComponent, areEqual);