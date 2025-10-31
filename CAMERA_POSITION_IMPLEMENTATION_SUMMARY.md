# Camera Position Implementation Summary

## Overview

This implementation adds a new `camera_position` field to layers that stores the layer's position **relative to the default camera viewport**. This provides essential information for the backend to understand how layers appear from the user's perspective.

## Key Question Answered

**Q: "On est sûr que c'est la position du layer par rapport à la caméra par défaut là?"**  
**A: OUI** ✅ - Le code calcule **toujours** la position par rapport à la **caméra par défaut** (identifiée par `isDefault: true`), pas la caméra sélectionnée.

## Implementation Details

### 1. Type Definition

**File**: `src/app/scenes/types.ts`

```typescript
export interface Layer {
  // ... existing fields
  position: Position;              // Position absolue dans la scène
  camera_position?: Position;      // Position relative à la caméra par défaut
  // ... other fields
}
```

### 2. Utility Function

**File**: `src/utils/cameraAnimator.ts`

```typescript
export const calculateCameraRelativePosition = (
  layerPosition: Position,
  camera: Camera,
  sceneWidth: number = 1920,
  sceneHeight: number = 1080
): Position => {
  const cameraX = (camera.position.x * sceneWidth) - (camera.width / 2);
  const cameraY = (camera.position.y * sceneHeight) - (camera.height / 2);
  
  return {
    x: layerPosition.x - cameraX,
    y: layerPosition.y - cameraY,
  };
};
```

### 3. Layer Creation

**File**: `src/components/molecules/layer-management/useLayerCreation.ts`

Modifications clés:
- Ajout du paramètre `sceneCameras` à `LayerCreationOptions`
- Nouvelle fonction `getDefaultCamera()` qui trouve la caméra avec `isDefault: true`
- Toutes les fonctions de création (text, image, shape) calculent `camera_position` en utilisant la caméra par défaut

```typescript
// Trouve TOUJOURS la caméra par défaut
const getDefaultCamera = useCallback(() => {
  const defaultCam = sceneCameras?.find((cam: any) => cam.isDefault === true);
  return defaultCam || createDefaultCamera('16:9');
}, [sceneCameras]);

// Calcule la position relative à la caméra par défaut
const defaultCamera = getDefaultCamera();
const cameraPosition = calculateCameraRelativePosition(
  { x: initialX, y: initialY },
  defaultCamera,
  sceneWidth,
  sceneHeight
);
```

### 4. UI Display

**Files**: 
- `src/components/molecules/properties/TextPropertiesForm.tsx`
- `src/components/molecules/properties/ImagePropertiesForm.tsx`

Affiche la position relative à la caméra dans un panneau dédié:

```tsx
{layer.camera_position && (
  <div className="p-3 bg-secondary/50 rounded border border-border">
    <label className="block text-foreground text-xs font-medium mb-2">
      Position relative to camera
    </label>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-muted-foreground text-xs mb-1">Camera X</label>
        <div className="bg-background text-foreground border border-border rounded px-3 py-2 text-sm font-mono">
          {Math.round(layer.camera_position.x)}
        </div>
      </div>
      <div>
        <label className="block text-muted-foreground text-xs mb-1">Camera Y</label>
        <div className="bg-background text-foreground border border-border rounded px-3 py-2 text-sm font-mono">
          {Math.round(layer.camera_position.y)}
        </div>
      </div>
    </div>
  </div>
)}
```

## How It Works

### Calculation Logic

1. **Trouver la caméra par défaut**: 
   ```typescript
   const defaultCam = sceneCameras?.find(cam => cam.isDefault === true)
   ```

2. **Calculer le viewport de la caméra** (coin supérieur gauche):
   ```
   cameraX = (camera.position.x × sceneWidth) - (camera.width ÷ 2)
   cameraY = (camera.position.y × sceneHeight) - (camera.height ÷ 2)
   ```

3. **Calculer la position relative**:
   ```
   camera_position.x = layer.position.x - cameraX
   camera_position.y = layer.position.y - cameraY
   ```

### Example

Pour une scène 1920×1080 avec caméra par défaut centrée:

- **Caméra par défaut**: position (0.5, 0.5), taille 1920×1080
- **Viewport caméra**: (0, 0) car centré sur la scène
- **Layer au centre (960, 540)**:
  - `camera_position.x = 960 - 0 = 960`
  - `camera_position.y = 540 - 0 = 540`
  - Le layer apparaît au centre du viewport de la caméra

## Files Changed

1. ✅ `src/app/scenes/types.ts` - Ajout du champ `camera_position?: Position`
2. ✅ `src/utils/cameraAnimator.ts` - Ajout de `calculateCameraRelativePosition()`
3. ✅ `src/components/molecules/layer-management/useLayerCreation.ts` - Calcul automatique lors de la création
4. ✅ `src/components/molecules/properties/TextPropertiesForm.tsx` - Affichage UI
5. ✅ `src/components/molecules/properties/ImagePropertiesForm.tsx` - Affichage UI
6. ✅ `BACKEND_LAYER_CAMERA_POSITION.md` - Documentation backend complète
7. ✅ `examples/layer-with-camera-position-example.json` - Exemple de données

## Backend Integration

Le backend doit:

1. **Accepter le champ optionnel** `camera_position` dans le schéma Layer
2. **Identifier la caméra par défaut** via `isDefault: true`
3. **Utiliser camera_position** pour le rendu si disponible, sinon calculer manuellement
4. **Valider** que les positions sont cohérentes

Voir `BACKEND_LAYER_CAMERA_POSITION.md` pour les détails complets.

## Testing

### Build Status
✅ Build successful (`npm run build`)

### Lint Status
✅ No new lint errors (existing test file errors remain)

### Type Safety
✅ TypeScript compilation successful

### Manual Testing Checklist

Pour tester l'implémentation:

1. ✅ Créer un nouveau layer de texte → `camera_position` est calculé
2. ✅ Créer un nouveau layer d'image → `camera_position` est calculé
3. ✅ Créer une nouvelle forme → `camera_position` est calculé
4. ✅ Sélectionner un layer → Voir `camera_position` dans le panneau des propriétés
5. ✅ Vérifier que c'est toujours par rapport à la caméra par défaut

## Benefits

### Pour le Frontend
- ✅ Calcul cohérent lors de la création des layers
- ✅ Affichage clair de la position relative dans l'UI
- ✅ Rétrocompatibilité (champ optionnel)

### Pour le Backend
- ✅ Position pré-calculée pour le rendu
- ✅ Pas besoin de recalculer à chaque fois
- ✅ Cohérence garantie avec le frontend
- ✅ Facilite la détermination des layers visibles

## Important Notes

⚠️ **Toujours par rapport à la caméra par défaut**: La `camera_position` est calculée en utilisant la caméra avec `isDefault: true`, PAS la caméra actuellement sélectionnée.

✅ **Backward Compatible**: Le champ est optionnel, donc les anciennes données sans `camera_position` continuent de fonctionner.

📏 **Coordonnées absolues**: Les valeurs de `camera_position` sont en pixels, pas normalisées (0-1).

🎯 **Référence viewport**: Position (0, 0) signifie le coin supérieur gauche du viewport de la caméra.

## Next Steps

Pour le backend:
1. Mettre à jour le schéma pour accepter `camera_position`
2. Implémenter la logique de rendu utilisant `camera_position`
3. Ajouter la migration pour les layers existants
4. Tester avec les exemples fournis

---

**Date**: 2025-10-31  
**Version**: 1.1.0  
**Status**: ✅ Implémentation complète - Prêt pour intégration backend
