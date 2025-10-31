# Guide du Système de Projection

## Vue d'ensemble

Le système de projection permet de calculer automatiquement les positions et dimensions des layers (calques) sur un écran de preview donné (par exemple 1920×1080). Cela garantit que tous les éléments sont positionnés correctement lors de l'affichage de la preview.

## Architecture

### 1. Store (Zustand)

Les dimensions de l'écran de projection sont stockées dans le `SceneStore`:

```typescript
interface SceneState {
  // Projection screen dimensions
  projectionScreenWidth: number;   // Default: 1920
  projectionScreenHeight: number;  // Default: 1080
  
  // Action pour mettre à jour l'écran de projection
  setProjectionScreen: (width: number, height: number) => void;
}
```

### 2. Calculateur de Projection

Le fichier `src/utils/projectionCalculator.ts` contient toutes les fonctions de calcul:

#### Fonctions principales:

- **`calculateProjectionScale()`** - Calcule le facteur d'échelle pour adapter la scène à l'écran
- **`calculateProjectedLayerPosition()`** - Calcule la position projetée d'un layer
- **`calculateProjectedLayerDimensions()`** - Calcule les dimensions projetées d'un layer
- **`isLayerVisibleInCamera()`** - Vérifie si un layer est visible dans le viewport de la caméra
- **`projectLayersToScreen()`** - Projette tous les layers sur l'écran

### 3. Hooks Personnalisés

Deux hooks facilitent l'utilisation du système:

- **`useProjection(options)`** - Hook de base pour les calculs de projection
- **`useSceneProjection(scene)`** - Hook pour projeter automatiquement une scène complète

## Utilisation

### 1. Définir l'écran de projection

```typescript
import { useSceneStore } from '@/app/scenes/store';

function MyComponent() {
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  
  // Définir un écran 1920×1080 (Full HD)
  setProjectionScreen(1920, 1080);
  
  // Ou un écran 1280×720 (HD)
  setProjectionScreen(1280, 720);
  
  // Ou un écran 3840×2160 (4K)
  setProjectionScreen(3840, 2160);
}
```

### 2. Utiliser le hook de projection

```typescript
import { useProjection } from '@/hooks/useProjection';
import { useCurrentScene } from '@/app/scenes';

function PreviewComponent() {
  const scene = useCurrentScene();
  const defaultCamera = scene?.sceneCameras?.find(cam => cam.isDefault);
  
  const {
    screenWidth,
    screenHeight,
    projectionScale,
    projectLayers,
    projectLayer,
    isLayerVisible
  } = useProjection({
    camera: defaultCamera,
    sceneWidth: scene?.sceneWidth || 1920,
    sceneHeight: scene?.sceneHeight || 1080
  });
  
  // Obtenir tous les layers projetés
  const projectedLayers = projectLayers(scene?.layers || []);
  
  return (
    <div style={{ width: screenWidth, height: screenHeight }}>
      {projectedLayers.map(projectedLayer => (
        projectedLayer.isVisible && (
          <div
            key={projectedLayer.id}
            style={{
              position: 'absolute',
              left: projectedLayer.position.x,
              top: projectedLayer.position.y,
              width: projectedLayer.width,
              height: projectedLayer.height,
              opacity: projectedLayer.opacity,
              transform: `rotate(${projectedLayer.rotation || 0}deg)`
            }}
          >
            {/* Contenu du layer */}
          </div>
        )
      ))}
    </div>
  );
}
```

### 3. Hook simplifié pour une scène

```typescript
import { useSceneProjection } from '@/hooks/useProjection';
import { useCurrentScene } from '@/app/scenes';

function ScenePreview() {
  const scene = useCurrentScene();
  const {
    screenWidth,
    screenHeight,
    projectionScale,
    projectedLayers
  } = useSceneProjection(scene);
  
  return (
    <div style={{ width: screenWidth, height: screenHeight }}>
      <h3>Preview à l'échelle {projectionScale.toFixed(2)}</h3>
      <p>Écran: {screenWidth}×{screenHeight}</p>
      <p>Layers visibles: {projectedLayers.filter(l => l.isVisible).length}/{projectedLayers.length}</p>
      
      {projectedLayers.map(layer => (
        layer.isVisible && (
          <LayerPreview key={layer.id} layer={layer} />
        )
      ))}
    </div>
  );
}
```

## Calculs Mathématiques

### Échelle de projection

L'échelle de projection maintient le ratio d'aspect de la scène:

```
scaleX = screenWidth / cameraWidth
scaleY = screenHeight / cameraHeight
projectionScale = min(scaleX, scaleY)
```

### Position projetée

La position d'un layer sur l'écran de projection est calculée en plusieurs étapes:

1. **Position relative à la caméra**:
   ```
   relativeX = layer.position.x - cameraViewportX
   relativeY = layer.position.y - cameraViewportY
   ```

2. **Application de l'échelle de projection**:
   ```
   projectedX = relativeX × projectionScale
   projectedY = relativeY × projectionScale
   ```

3. **Centrage si nécessaire**:
   ```
   finalX = projectedX + offsetX
   finalY = projectedY + offsetY
   ```
   où `offsetX` et `offsetY` centrent la projection si l'écran est plus grand que nécessaire.

### Dimensions projetées

```
projectedWidth = layer.width × layer.scale × projectionScale
projectedHeight = layer.height × layer.scale × projectionScale
```

### Visibilité

Un layer est visible si:
1. Il chevauche le viewport de la caméra
2. `layer.visible !== false`
3. `layer.opacity > 0`

## Exemples d'utilisation

### Exemple 1: Preview plein écran

```typescript
function FullScreenPreview() {
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  
  useEffect(() => {
    // S'adapter à la taille de la fenêtre
    const updateScreen = () => {
      setProjectionScreen(window.innerWidth, window.innerHeight);
    };
    
    updateScreen();
    window.addEventListener('resize', updateScreen);
    return () => window.removeEventListener('resize', updateScreen);
  }, [setProjectionScreen]);
  
  // ... reste du composant
}
```

### Exemple 2: Preview avec ratio fixe

```typescript
function AspectRatioPreview({ aspectRatio = '16:9' }) {
  const setProjectionScreen = useSceneStore(state => state.setProjectionScreen);
  
  useEffect(() => {
    const ratios = {
      '16:9': { width: 1920, height: 1080 },
      '4:3': { width: 1024, height: 768 },
      '1:1': { width: 1080, height: 1080 }
    };
    
    const { width, height } = ratios[aspectRatio] || ratios['16:9'];
    setProjectionScreen(width, height);
  }, [aspectRatio, setProjectionScreen]);
  
  // ... reste du composant
}
```

### Exemple 3: Vérifier si un layer est visible

```typescript
function LayerList({ layers }: { layers: Layer[] }) {
  const scene = useCurrentScene();
  const defaultCamera = scene?.sceneCameras?.find(cam => cam.isDefault);
  const { isLayerVisible } = useProjection({ camera: defaultCamera });
  
  return (
    <ul>
      {layers.map(layer => (
        <li key={layer.id}>
          {layer.name}
          {isLayerVisible(layer) ? '👁️ Visible' : '❌ Hors champ'}
        </li>
      ))}
    </ul>
  );
}
```

## Types TypeScript

### ProjectedLayer

```typescript
interface ProjectedLayer {
  id: string;
  position: ProjectedPosition;  // Position sur l'écran de projection
  width: number;                // Largeur projetée
  height: number;               // Hauteur projetée
  scale: number;                // Échelle du layer
  opacity: number;              // Opacité
  rotation?: number;            // Rotation en degrés
  isVisible: boolean;           // Visible dans le viewport de la caméra
}
```

### ProjectionHelpers

```typescript
interface ProjectionHelpers {
  screenWidth: number;                              // Largeur écran de projection
  screenHeight: number;                             // Hauteur écran de projection
  projectionScale: number;                          // Facteur d'échelle
  setProjectionScreen: (w: number, h: number) => void;  // Mise à jour écran
  projectLayers: (layers: Layer[]) => ProjectedLayer[]; // Projeter tous les layers
  projectLayer: (layer: Layer) => ProjectedLayer;       // Projeter un layer
  isLayerVisible: (layer: Layer) => boolean;            // Vérifier visibilité
}
```

## Cas d'usage

### 1. Génération de Preview Vidéo

Avant de générer une preview vidéo, définir l'écran de projection selon le format souhaité:

```typescript
// Preview 1080p
setProjectionScreen(1920, 1080);

// Preview 720p (plus rapide)
setProjectionScreen(1280, 720);

// Preview 4K (haute qualité)
setProjectionScreen(3840, 2160);
```

### 2. Mode Présentation

Adapter l'affichage à l'écran du présentateur:

```typescript
const screenMode = useScreenMode(); // 'laptop', 'projector', '4k', etc.

useEffect(() => {
  const screens = {
    laptop: { width: 1920, height: 1080 },
    projector: { width: 1024, height: 768 },
    '4k': { width: 3840, height: 2160 }
  };
  
  const screen = screens[screenMode] || screens.laptop;
  setProjectionScreen(screen.width, screen.height);
}, [screenMode]);
```

### 3. Export d'images

Projeter la scène à différentes résolutions pour l'export:

```typescript
function exportSceneImage(scene: Scene, resolution: 'sd' | 'hd' | 'fhd' | '4k') {
  const resolutions = {
    sd: { width: 640, height: 480 },
    hd: { width: 1280, height: 720 },
    fhd: { width: 1920, height: 1080 },
    '4k': { width: 3840, height: 2160 }
  };
  
  const { width, height } = resolutions[resolution];
  setProjectionScreen(width, height);
  
  const { projectedLayers } = useSceneProjection(scene);
  // Générer l'image avec les layers projetés
}
```

## Avantages

✅ **Positions cohérentes**: Tous les éléments sont positionnés correctement sur n'importe quel écran  
✅ **Gestion du ratio**: Maintient automatiquement le ratio d'aspect de la scène  
✅ **Performance**: Calculs optimisés avec useMemo  
✅ **Visibilité**: Détecte automatiquement les layers visibles/invisibles  
✅ **Flexibilité**: Fonctionne avec n'importe quelle résolution d'écran  
✅ **Type-safe**: Types TypeScript complets  

## Notes importantes

⚠️ **Caméra par défaut**: Les calculs utilisent toujours la caméra avec `isDefault: true`  
⚠️ **Centrage automatique**: Si l'écran est plus grand que nécessaire, la projection est centrée  
⚠️ **Coordonnées absolues**: Les positions projetées sont en pixels absolus  
⚠️ **Ratio d'aspect**: L'échelle de projection préserve le ratio d'aspect de la scène  

---

**Date**: 2025-10-31  
**Version**: 1.2.0  
**Status**: ✅ Implémenté et prêt à l'emploi
