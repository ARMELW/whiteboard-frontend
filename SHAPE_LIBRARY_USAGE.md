# Shape Library - Guide d'utilisation

## Vue d'ensemble

Le système de gestion des formes (Shape Library) permet d'importer, gérer et utiliser des fichiers SVG dans vos scènes d'animation. Les formes peuvent être dessinées progressivement dans vos vidéos doodle, offrant des animations fluides et professionnelles.

## Fonctionnalités

- ✅ **Import de fichiers SVG** - Upload direct sans recadrage
- ✅ **Gestion complète** - Liste, recherche, filtrage et suppression
- ✅ **Catégorisation** - Organisation par catégories (basic, arrow, callout, banner, icon, decorative, other)
- ✅ **Ajout aux scènes** - Intégration simple par clic
- ✅ **Configuration personnalisée** - Couleurs, épaisseur de trait, remplissage

## Accès à la bibliothèque

### Option 1 : Onglet Shapes dans la barre latérale (Recommandé)

1. Ouvrez l'éditeur de projet
2. Dans la barre latérale gauche, cliquez sur l'onglet **"Shapes"** (icône de formes géométriques)
3. La bibliothèque compacte s'affiche avec toutes vos formes

### Option 2 : Modal ShapeLibrary (À venir)

Une version plein écran de la bibliothèque est disponible via `ShapeLibrary.tsx` pour une gestion plus détaillée.

## Importer des formes SVG

1. Dans l'onglet **Shapes**, cliquez sur le bouton **"Importer"**
2. Sélectionnez un ou plusieurs fichiers SVG depuis votre ordinateur
3. Les formes sont automatiquement uploadées vers le serveur
4. Elles apparaissent immédiatement dans votre bibliothèque

### Formats acceptés
- Extension : `.svg`
- Type MIME : `image/svg+xml`
- Taille : Selon les limites du serveur backend

### Note importante
Contrairement aux images, les SVG ne passent **pas** par l'outil de recadrage. Ils sont uploadés directement tels quels.

## Utiliser les formes

### Ajouter une forme à la scène

1. Sélectionnez une scène dans votre projet
2. Dans l'onglet **Shapes**, parcourez votre bibliothèque
3. **Cliquez sur la forme** que vous souhaitez ajouter
4. La forme est automatiquement ajoutée au centre de la scène

### Propriétés de la couche Shape

Quand une forme est ajoutée, elle crée une couche avec les propriétés suivantes :

```typescript
{
  type: "shape",                    // Type de couche
  name: "nom-de-la-forme",          // Nom de la forme
  mode: "draw",                     // Mode d'animation (draw, static)
  svg_path: "url/to/shape.svg",     // Chemin vers le fichier SVG
  svg_sampling_rate: 1,             // Taux d'échantillonnage du tracé
  svg_reverse: false,               // Inverser le sens du tracé
  position: { x: 200, y: 150 },     // Position dans la scène
  width: 200,                       // Largeur de la forme
  height: 200,                      // Hauteur de la forme
  scale: 1,                         // Échelle
  opacity: 1,                       // Opacité
  rotation: 0,                      // Rotation en degrés
  shape_config: {
    color: "#222222",               // Couleur du trait
    fill_color: "#222222",          // Couleur de remplissage
    stroke_width: 5                 // Épaisseur du trait
  },
  z_index: 0,                       // Ordre d'affichage
  skip_rate: 5,                     // Vitesse d'animation
  visible: true,                    // Visibilité
  locked: false                     // Verrouillage
}
```

### Modes d'animation

- **draw** : La forme se dessine progressivement (effet doodle)
- **static** : La forme apparaît instantanément
- **animated** : Animations personnalisées

## Gérer les formes

### Rechercher une forme

Utilisez la barre de recherche en haut de l'onglet Shapes pour filtrer par nom.

### Filtrer par catégorie

Cliquez sur l'un des boutons de catégorie :
- **Toutes** : Affiche toutes les formes
- **basic** : Formes basiques (cercle, carré, triangle)
- **arrow** : Flèches directionnelles
- **callout** : Bulles de texte et annotations
- **banner** : Bannières et rubans
- **icon** : Icônes vectorielles
- **decorative** : Éléments décoratifs
- **other** : Autres formes

### Supprimer une forme

1. Survolez la carte de la forme avec votre souris
2. Cliquez sur le bouton **rouge de suppression** qui apparaît
3. Confirmez la suppression

⚠️ **Attention** : La suppression est définitive et supprime la forme du serveur.

## Personnalisation des formes

### Via le panneau de propriétés (À venir)

Quand une couche shape est sélectionnée, vous pourrez modifier :
- **Couleurs** : Trait et remplissage
- **Épaisseur du trait** : stroke_width
- **Vitesse d'animation** : skip_rate
- **Échantillonnage** : svg_sampling_rate
- **Sens du tracé** : svg_reverse

### Paramètres d'animation

- **skip_rate** (1-10) : Plus le nombre est élevé, plus l'animation est rapide
- **svg_sampling_rate** (0.1-2) : Densité des points de tracé
- **svg_reverse** : Inverse le sens de dessin de la forme

## Structure des fichiers

### Composants créés

```
src/
├── components/
│   ├── molecules/
│   │   └── shape-library/
│   │       ├── ShapeCard.tsx              # Carte d'affichage d'une forme
│   │       ├── ShapeGrid.tsx              # Grille de formes
│   │       ├── ShapeLibraryHeader.tsx     # En-tête avec upload
│   │       ├── ShapeSearchBar.tsx         # Barre de recherche
│   │       ├── ShapeSortControls.tsx      # Contrôles de tri
│   │       ├── ShapeCategoryFilter.tsx    # Filtre par catégorie
│   │       ├── useShapeLibraryStore.ts    # État global Zustand
│   │       └── index.ts                   # Exports
│   └── organisms/
│       ├── ShapeLibrary.tsx               # Modal plein écran
│       └── tabs/
│           └── ShapesTab.tsx              # Onglet sidebar compact
└── app/
    └── shapes/
        ├── api/
        │   └── shapesService.ts           # Service API backend
        ├── hooks/
        │   ├── useShapes.ts               # Hook de lecture
        │   └── useShapesActions.ts        # Hook d'actions
        ├── config.ts                      # Query keys
        └── index.ts                       # Exports
```

## API Backend

Les endpoints API pour les formes :

- `POST /api/v1/shapes/upload` - Upload de fichiers SVG
- `GET /api/v1/shapes` - Liste avec filtres et pagination
- `GET /api/v1/shapes/{id}` - Détails d'une forme
- `PUT /api/v1/shapes/{id}` - Mise à jour des métadonnées
- `DELETE /api/v1/shapes/{id}` - Suppression
- `GET /api/v1/shapes/stats` - Statistiques

### Paramètres de filtrage

```typescript
{
  page?: number;           // Numéro de page (défaut: 1)
  limit?: number;          // Résultats par page (défaut: 20)
  filter?: string;         // Recherche par nom
  category?: ShapeCategory; // Filtre par catégorie
  tags?: string[];         // Filtre par tags
  sortBy?: string;         // Tri (name, uploadDate, size, usageCount)
  sortOrder?: 'asc' | 'desc'; // Ordre de tri
}
```

## Hooks React

### useShapes

Récupère la liste des formes avec filtres :

```typescript
import { useShapes } from '@/app/shapes';

const { shapes, loading, total, refetch } = useShapes({
  filter: 'arrow',
  category: 'arrow',
  sortBy: 'uploadDate',
  sortOrder: 'desc'
});
```

### useShapesActions

Actions de gestion des formes :

```typescript
import { useShapesActions } from '@/app/shapes';

const {
  uploadShape,    // (file, metadata) => Promise<ShapeAsset>
  updateShape,    // (id, updates) => Promise<ShapeAsset>
  deleteShape,    // (id) => Promise<void>
  isUploading,    // boolean
  isUpdating,     // boolean
  isDeleting,     // boolean
} = useShapesActions();

// Upload
await uploadShape(file, {
  name: 'Ma forme',
  category: 'icon',
  tags: ['custom', 'logo']
});

// Update
await updateShape(shapeId, {
  name: 'Nouveau nom',
  category: 'banner'
});

// Delete
await deleteShape(shapeId);
```

## Bonnes pratiques

### Optimisation des SVG

Pour de meilleures performances :
- Utilisez des SVG optimisés (SVGO, SVGOMG)
- Évitez les SVG trop complexes (>10000 points)
- Simplifiez les chemins quand possible
- Supprimez les métadonnées inutiles

### Organisation

- **Catégorisez** vos formes dès l'import
- **Utilisez des tags** pour une recherche rapide
- **Nommez clairement** vos formes (ex: "fleche-droite-bold")
- **Supprimez** les formes inutilisées régulièrement

### Animation

- Testez différents `skip_rate` pour la vitesse optimale
- Ajustez `svg_sampling_rate` si le tracé est saccadé
- Utilisez `svg_reverse` pour changer le sens de dessin
- Le mode `draw` fonctionne mieux avec des SVG simples

## Dépannage

### La forme ne s'affiche pas

- Vérifiez que le fichier SVG est valide
- Vérifiez que la couche est visible (visible: true)
- Vérifiez le z_index (peut être masqué par d'autres couches)

### L'animation est trop lente/rapide

- Ajustez le paramètre `skip_rate` (1-10)
- Plus le nombre est élevé, plus c'est rapide

### Le tracé est saccadé

- Augmentez `svg_sampling_rate` (essayez 1.5 ou 2)
- Simplifiez le SVG avec un outil d'optimisation

### Upload échoue

- Vérifiez que le fichier est bien un SVG
- Vérifiez la taille du fichier (limite serveur)
- Vérifiez la connexion au backend

## Exemples d'utilisation

### Ajouter une flèche animée

```typescript
// 1. Import du SVG de flèche via l'interface
// 2. Ajouter à la scène
// 3. Configuration dans le panneau de propriétés:
{
  mode: "draw",
  skip_rate: 3,
  shape_config: {
    color: "#FF0000",
    stroke_width: 8
  }
}
```

### Créer une animation de logo

```typescript
// 1. Import du logo SVG
// 2. Mode "draw" pour effet de dessin
// 3. Configuration:
{
  skip_rate: 2,           // Animation fluide
  svg_sampling_rate: 1.5, // Tracé précis
  shape_config: {
    color: "#000000",
    stroke_width: 3
  }
}
```

## Support

Pour toute question ou problème :
- Consultez la documentation technique dans `SHAPES_MODULE_USAGE.md`
- Vérifiez les logs du navigateur (F12)
- Contactez l'équipe de développement

## Prochaines améliorations

- [ ] Panneau de propriétés dédié aux formes
- [ ] Prévisualisation de l'animation avant ajout
- [ ] Import par glisser-déposer
- [ ] Bibliothèque de formes pré-incluses
- [ ] Édition du SVG dans l'application
- [ ] Dupliquer une forme avec configuration
