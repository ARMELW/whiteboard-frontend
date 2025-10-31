# Guide d'utilisation du Projection Viewer

## Vue d'ensemble

Le **Projection Viewer** est un composant visuel qui permet de vérifier l'exactitude des coordonnées de projection des layers sur différentes résolutions d'écran. C'est un outil de debug et de validation essentiel pour s'assurer que tous les éléments sont positionnés correctement.

## Composants

### 1. ProjectionViewer

Composant principal qui affiche la projection des layers.

**Fichier**: `src/components/organisms/ProjectionViewer.tsx`

**Props**:
```typescript
interface ProjectionViewerProps {
  scene: Scene;              // La scène à projeter
  showGrid?: boolean;        // Afficher la grille (défaut: true)
  showCoordinates?: boolean; // Afficher les coordonnées au survol (défaut: true)
  showBounds?: boolean;      // Afficher les limites du canvas (défaut: true)
}
```

### 2. ProjectionTestPage

Page de test dédiée pour utiliser le ProjectionViewer.

**Fichier**: `src/pages/ProjectionTestPage.tsx`

## Utilisation

### Méthode 1: Page de test dédiée

Accéder à la page `/projection-test` dans votre application:

```typescript
// Dans votre router
import { ProjectionTestPage } from '@/pages/ProjectionTestPage';

// Ajouter la route
<Route path="/projection-test" element={<ProjectionTestPage />} />
```

### Méthode 2: Intégration dans un composant existant

```typescript
import { ProjectionViewer } from '@/components/organisms/ProjectionViewer';
import { useCurrentScene } from '@/app/scenes';

function MyComponent() {
  const scene = useCurrentScene();
  
  if (!scene) return null;
  
  return (
    <div>
      <h1>Test de projection</h1>
      <ProjectionViewer 
        scene={scene}
        showGrid={true}
        showCoordinates={true}
        showBounds={true}
      />
    </div>
  );
}
```

### Méthode 3: Modal de debug

```typescript
import { useState } from 'react';
import { ProjectionViewer } from '@/components/organisms/ProjectionViewer';
import { Dialog } from '@/components/ui/dialog';

function SceneEditor() {
  const [showProjection, setShowProjection] = useState(false);
  const scene = useCurrentScene();
  
  return (
    <>
      <button onClick={() => setShowProjection(true)}>
        🎯 Test Projection
      </button>
      
      <Dialog open={showProjection} onOpenChange={setShowProjection}>
        <ProjectionViewer scene={scene} />
      </Dialog>
    </>
  );
}
```

## Fonctionnalités

### 1. Sélection de résolution

Le viewer propose plusieurs résolutions prédéfinies:

- **SD** (640×480) - Résolution standard
- **HD** (1280×720) - Haute définition
- **Full HD** (1920×1080) - Full HD
- **2K** (2560×1440) - 2K
- **4K** (3840×2160) - Ultra HD

Changez la résolution pour voir comment les layers s'adaptent.

### 2. Grille de référence

La grille affiche:
- Carrés de 50×50 pixels
- Lignes centrales en rouge pointillé
- Aide à vérifier l'alignement et les positions

### 3. Affichage des coordonnées

Au survol d'un layer, vous voyez:
- **Projected**: Position sur l'écran de projection
- **Size**: Dimensions projetées
- **Opacity**: Opacité du layer

### 4. Liste des layers

Deux colonnes affichent:

#### Visible Layers (✓)
- Layers visibles dans le viewport de la caméra
- Coordonnées de la scène vs coordonnées projetées
- Dimensions originales vs dimensions projetées
- Position relative à la caméra (camera_position)

#### Hidden Layers (✗)
- Layers en dehors du viewport de la caméra
- Position dans la scène
- Raison de l'invisibilité

### 5. Informations de projection

En haut de la page:
- **Screen**: Dimensions de l'écran de projection
- **Scale**: Facteur d'échelle appliqué
- **Visible**: Nombre de layers visibles
- **Hidden**: Nombre de layers cachés

## Interactivité

### Survol des layers

1. **Sur le canvas**: Passez la souris sur un layer pour:
   - Le mettre en surbrillance (bordure verte)
   - Voir ses coordonnées détaillées
   - Visualiser sa zone

2. **Dans la liste**: Passez la souris sur un layer pour:
   - Le synchroniser avec le canvas
   - Le mettre en surbrillance
   - Voir toutes ses propriétés

## Cas d'usage

### 1. Vérification de l'exactitude des coordonnées

```typescript
// Créer un layer au centre exact
const layer = {
  position: { x: 960, y: 540 },
  camera_position: { x: 960, y: 540 }
};

// Vérifier dans le ProjectionViewer que:
// - Le layer apparaît au centre du canvas
// - Les coordonnées projetées sont (960, 540) en Full HD
// - Les coordonnées changent proportionnellement en HD
```

### 2. Test de différentes résolutions

```typescript
// Tester le layer sur plusieurs résolutions
const resolutions = ['hd', 'fhd', '4k'];

resolutions.forEach(res => {
  // Changer la résolution dans le viewer
  // Vérifier que:
  // - Le layer reste visible
  // - Les proportions sont correctes
  // - L'échelle est appliquée uniformément
});
```

### 3. Détection des layers hors champ

```typescript
// Placer un layer en dehors du viewport
const offScreenLayer = {
  position: { x: 3000, y: 2000 }  // Hors d'un écran 1920×1080
};

// Dans le ProjectionViewer:
// - Le layer apparaît dans "Hidden Layers"
// - Le message indique "Outside camera viewport"
// - Il n'est pas affiché sur le canvas
```

### 4. Validation avant export

```typescript
function validateBeforeExport(scene: Scene) {
  // Utiliser ProjectionViewer pour vérifier:
  
  // 1. Tous les layers importants sont visibles
  const visibleLayers = projectedLayers.filter(l => l.isVisible);
  if (visibleLayers.length < scene.layers.length) {
    console.warn('Some layers are hidden!');
  }
  
  // 2. Les positions sont dans les limites
  visibleLayers.forEach(layer => {
    if (layer.position.x < 0 || layer.position.y < 0) {
      console.warn(`Layer ${layer.id} has negative coordinates`);
    }
  });
  
  // 3. L'échelle est raisonnable
  if (projectionScale < 0.5 || projectionScale > 2) {
    console.warn('Unusual projection scale detected');
  }
}
```

## Captures d'écran

### Vue normale
```
┌─────────────────────────────────────────┐
│  Resolution: [Full HD (1920×1080) ▼]   │
│  Screen: 1920×1080px  Scale: 1.000x     │
│  ✓ Visible: 5  ✗ Hidden: 2             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│                                         │
│      [Grid avec layers projetés]       │
│                                         │
│         Layer 1    Layer 2              │
│                         Layer 3         │
│                                         │
└─────────────────────────────────────────┘

┌──────────────────┬──────────────────────┐
│ ✓ Visible (5)    │ ✗ Hidden (2)        │
│                  │                      │
│ • Text Layer     │ • Off-screen text   │
│   Scene: (960,   │   Outside viewport  │
│          540)    │   Scene: (3000,     │
│   Proj:  (960,   │          2000)      │
│          540)    │                     │
└──────────────────┴──────────────────────┘
```

### Survol d'un layer
```
┌─────────────────────────────────────────┐
│           ┌──────────────────┐          │
│           │ Projected: (960, │          │
│           │           540)   │          │
│           │ Size: 300×80     │          │
│     ╔═════╧══════════════════╧═════╗    │
│     ║    [Layer en surbrillance]  ║    │
│     ╚═════════════════════════════╝    │
│                                         │
└─────────────────────────────────────────┘
```

## Debugging

### Problème: Les coordonnées ne correspondent pas

```typescript
// Vérifier:
1. La caméra par défaut est bien définie (isDefault: true)
2. Les dimensions de la scène sont correctes (sceneWidth, sceneHeight)
3. camera_position est bien calculé lors de la création
4. Le projectionScale est appliqué uniformément
```

### Problème: Layer invisible mais devrait être visible

```typescript
// Vérifier:
1. layer.visible !== false
2. layer.opacity > 0
3. Position dans les limites du viewport de la caméra
4. z_index n'est pas négatif
```

### Problème: Échelle incorrecte

```typescript
// Vérifier:
1. projectionScreen dimensions sont correctes
2. camera.width et camera.height sont définis
3. Pas de scale=0 ou scale<0 sur les layers
```

## Conseils

### ✅ Bonnes pratiques

1. **Tester sur plusieurs résolutions** avant l'export
2. **Vérifier les layers cachés** - ils peuvent être importants
3. **Utiliser la grille** pour l'alignement précis
4. **Valider l'échelle** - devrait être proche de 1.0 pour Full HD
5. **Vérifier camera_position** - doit correspondre à la position visuelle

### ❌ À éviter

1. **Ne pas ignorer les warnings** de layers hors champ
2. **Ne pas supposer** que tous les layers sont visibles
3. **Ne pas tester** sur une seule résolution
4. **Ne pas oublier** de vérifier l'opacité et la visibilité

## API du composant

### ProjectionViewer

```typescript
import { ProjectionViewer } from '@/components/organisms/ProjectionViewer';

<ProjectionViewer
  scene={scene}           // Scene à projeter (required)
  showGrid={true}         // Afficher la grille (optional, default: true)
  showCoordinates={true}  // Afficher coordonnées survol (optional, default: true)
  showBounds={true}       // Afficher limites canvas (optional, default: true)
/>
```

### Accès programmatique

```typescript
import { useSceneProjection } from '@/hooks/useProjection';

const {
  screenWidth,
  screenHeight,
  projectionScale,
  projectedLayers
} = useSceneProjection(scene);

// Filtrer les layers visibles
const visibleLayers = projectedLayers.filter(l => l.isVisible);

// Trouver un layer spécifique
const specificLayer = projectedLayers.find(l => l.id === 'layer-123');

console.log('Position projetée:', specificLayer.position);
console.log('Dimensions projetées:', specificLayer.width, specificLayer.height);
```

## Exemples avancés

### Export conditionnel basé sur la visibilité

```typescript
function exportWithValidation(scene: Scene) {
  const { projectedLayers } = useSceneProjection(scene);
  
  const hiddenLayers = projectedLayers.filter(l => !l.isVisible);
  
  if (hiddenLayers.length > 0) {
    const confirmed = confirm(
      `${hiddenLayers.length} layer(s) will not be visible in the export. Continue?`
    );
    if (!confirmed) return;
  }
  
  // Procéder à l'export
  exportScene(scene);
}
```

### Ajustement automatique des positions

```typescript
function ensureAllLayersVisible(scene: Scene) {
  const { projectedLayers, isLayerVisible } = useSceneProjection(scene);
  const defaultCamera = scene.sceneCameras?.find(c => c.isDefault);
  
  scene.layers.forEach(layer => {
    if (!isLayerVisible(layer)) {
      console.warn(`Layer ${layer.name} is outside viewport, adjusting...`);
      
      // Ajuster pour centrer dans la caméra
      layer.position = {
        x: defaultCamera.position.x * scene.sceneWidth,
        y: defaultCamera.position.y * scene.sceneHeight
      };
    }
  });
}
```

## Support

Pour toute question ou problème avec le ProjectionViewer:
1. Vérifier que la scène a une caméra par défaut
2. Vérifier les dimensions de la scène
3. Consulter PROJECTION_SYSTEM_GUIDE.md
4. Consulter BACKEND_PROJECTION_INTEGRATION.md

---

**Date**: 2025-10-31  
**Version**: 1.2.0  
**Status**: ✅ Documentation complète du Projection Viewer
