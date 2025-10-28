# AnimatorContainer - Intégration API Complète

## Vue d'ensemble

L'`AnimatorContainer` est le composant principal de l'application qui orchestre toutes les fonctionnalités d'animation. Il a été mis à jour pour charger dynamiquement toutes les ressources depuis l'API backend.

## Architecture

```
AnimatorContainer
├── useAssets() - Gestion des assets (images, médias)
├── useAssetsActions() - Actions sur les assets
├── useFonts() - Chargement des polices de caractères
├── useScenes() - Gestion des scènes
├── useScenesActions() - Actions sur les scènes (create, update, delete)
└── Composants enfants (AssetLibrary, ScenePanel, etc.)
```

## Fonctionnalités Intégrées

### 1. Gestion des Assets

**Chargement automatique:**
- Tous les assets sont chargés depuis l'API au montage du composant
- Mise en cache automatique dans localStorage (mode hybrid)
- Logs de debug pour le monitoring

**Actions disponibles:**
```typescript
const assetsActions = useAssetsActions();

// Upload d'un asset
await assetsActions.uploadAsset(file, {
  category: 'illustration',
  tags: ['logo', 'brand']
});

// Mise à jour d'un asset
await assetsActions.updateAsset(assetId, { name: 'Nouveau nom' });

// Suppression d'un asset
await assetsActions.deleteAsset(assetId);

// Statistiques
const stats = await assetsActions.getAssetStats();
```

### 2. Gestion des Fonts

**Chargement automatique:**
- Toutes les fonts sont chargées depuis l'API au montage
- Fallback automatique vers fonts hardcodées si l'API échoue
- Support des filtres (category, premiumOnly, popularOnly)

**Utilisation:**
```typescript
const { fonts, loading, error } = useFonts();

// Les fonts sont disponibles pour tous les composants enfants
fonts.forEach(font => {
  console.log(font.name, font.family, font.category);
});
```

### 3. Gestion des Scènes

**Chargement automatique:**
- Toutes les scènes sont chargées depuis l'API
- Synchronisation avec le store Zustand
- Support de la mise à jour temps réel

**Actions disponibles:**
```typescript
const scenesActions = useScenesActions();

// Créer une scène
await scenesActions.createScene({
  title: 'Ma scène',
  duration: 10,
  project_id: 'project-123'
});

// Mettre à jour une scène
await scenesActions.updateScene({
  id: 'scene-123',
  data: { title: 'Nouveau titre' }
});

// Supprimer une scène
await scenesActions.deleteScene('scene-123');

// Dupliquer une scène
await scenesActions.duplicateScene('scene-123');

// Réorganiser les scènes
await scenesActions.reorderScenes(['scene-1', 'scene-2', 'scene-3']);
```

## Logs de Debug

Le composant inclut des logs automatiques pour le monitoring:

```javascript
[AnimationContainer] Assets loaded: 42
[AnimationContainer] Fonts loaded: 18
[AnimationContainer] Scenes loaded: 5
```

Ces logs apparaissent dans la console du navigateur quand les ressources sont chargées.

## États de Chargement

Le composant gère trois états de chargement indépendants:

```typescript
const { assets, loading: assetsLoading } = useAssets();
const { fonts, loading: fontsLoading } = useFonts();
const { scenes, loading: scenesLoading } = useScenes();

// Vous pouvez afficher un loader global:
const isLoading = assetsLoading || fontsLoading || scenesLoading;
```

## Gestion des Erreurs

Tous les hooks incluent une gestion d'erreur:

```typescript
const { error: assetsError } = useAssets();
const { error: fontsError } = useFonts();
const { error: scenesError } = useScenes();

if (assetsError) {
  console.error('Erreur de chargement des assets:', assetsError);
}
```

## Composants Enfants

Les composants enfants peuvent accéder aux ressources de plusieurs manières:

### 1. Via Props (Recommandé)

```typescript
<ScenePanel 
  scenes={scenes}
  onCreateScene={scenesActions.createScene}
  onUpdateScene={scenesActions.updateScene}
/>
```

### 2. Via Store Zustand

```typescript
import { useSceneStore } from '@/app/scenes';

function ScenePanel() {
  const scenes = useSceneStore(state => state.scenes);
  // ...
}
```

### 3. Via Hooks directs

```typescript
import { useAssets } from '@/app/assets';

function AssetLibrary() {
  const { assets } = useAssets();
  // ...
}
```

## Performance

### Optimisations Intégrées

1. **Chargement unique**: Les ressources sont chargées une seule fois au montage
2. **Cache localStorage**: Mode hybrid avec fallback automatique
3. **Lazy loading**: Les composants enfants sont rendus uniquement quand nécessaire
4. **Memoization**: Les actions sont memoizées avec useCallback

### Recommandations

Pour améliorer les performances:

1. **React Query**: Implémenter pour un meilleur cache
2. **Pagination**: Charger les assets par lot
3. **Virtualization**: Pour les grandes listes
4. **Web Workers**: Pour le traitement des assets lourds

## Configuration

### Variables d'environnement

```env
VITE_API_URL=https://api.doodlio.com
```

### Endpoints API utilisés

- `GET /v1/assets` - Liste des assets
- `POST /v1/assets/upload` - Upload d'asset
- `GET /v1/assets/stats` - Statistiques
- `GET /v1/fonts` - Liste des fonts
- `GET /v1/scenes` - Liste des scènes
- `POST /v1/scenes` - Créer une scène
- `PUT /v1/scenes/:id` - Mettre à jour une scène
- `DELETE /v1/scenes/:id` - Supprimer une scène
- `POST /v1/scenes/:id/duplicate` - Dupliquer une scène
- `POST /v1/scenes/reorder` - Réorganiser les scènes

## Tests

### Tests unitaires

```bash
# Tester les hooks
npm run test src/app/assets/hooks/useAssets.test.ts
npm run test src/app/text/hooks/useFonts.test.ts
```

### Tests d'intégration

```bash
# Tester l'AnimatorContainer
npm run test src/components/organisms/AnimationContainer.test.tsx
```

### Tests E2E

```bash
# Tester le flow complet
npm run test:e2e
```

## Dépannage

### Les assets ne se chargent pas

1. Vérifiez `VITE_API_URL` dans `.env`
2. Vérifiez le token d'authentification dans localStorage
3. Vérifiez les logs de la console
4. Vérifiez les logs du backend

### Les fonts ne se chargent pas

Les fonts ont un fallback automatique, donc elles devraient toujours se charger. Si ce n'est pas le cas:

1. Vérifiez les logs de la console
2. Vérifiez que le service fonts retourne bien le fallback

### Les scènes ne se chargent pas

1. Vérifiez que le projet_id est valide
2. Vérifiez les permissions utilisateur
3. Vérifiez les logs Zustand

## Exemples

### Exemple 1: Upload d'asset avec preview

```typescript
import { useAssetsActions } from '@/app/assets';

function AssetUploader() {
  const { uploadAsset } = useAssetsActions();
  const [preview, setPreview] = useState(null);
  
  const handleUpload = async (file: File) => {
    // Preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    
    // Upload
    const asset = await uploadAsset(file, {
      category: 'illustration',
      tags: ['user-upload']
    });
    
    console.log('Asset uploaded:', asset.url);
  };
  
  return (
    <div>
      <input type="file" onChange={e => handleUpload(e.target.files[0])} />
      {preview && <img src={preview} alt="Preview" />}
    </div>
  );
}
```

### Exemple 2: Sélecteur de fonts

```typescript
import { useFonts } from '@/app/text';

function FontSelector() {
  const { fonts, loading } = useFonts({ popularOnly: true });
  const [selected, setSelected] = useState('');
  
  if (loading) return <div>Chargement des fonts...</div>;
  
  return (
    <select value={selected} onChange={e => setSelected(e.target.value)}>
      {fonts.map(font => (
        <option key={font.id} value={font.family}>
          {font.name} {font.isPremium && '⭐'}
        </option>
      ))}
    </select>
  );
}
```

### Exemple 3: Gestionnaire de scènes

```typescript
import { useScenes, useScenesActions } from '@/app/scenes';

function SceneManager() {
  const { scenes, loading } = useScenes();
  const { createScene, deleteScene, duplicateScene } = useScenesActions();
  
  const handleCreate = async () => {
    await createScene({
      title: 'Nouvelle scène',
      duration: 5,
      project_id: 'current-project-id'
    });
  };
  
  return (
    <div>
      <button onClick={handleCreate}>Créer une scène</button>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {scenes.map(scene => (
            <li key={scene.id}>
              {scene.title}
              <button onClick={() => duplicateScene(scene.id)}>Dupliquer</button>
              <button onClick={() => deleteScene(scene.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Références

- [Guide de Migration](./ANIMATION_CONTAINER_MIGRATION.md)
- [API Guide](../FRONTEND_API_GUIDE.md)
- [Migration API](../MIGRATION_API.md)

## Support

Pour toute question ou problème:
1. Consultez la documentation
2. Vérifiez les logs de la console
3. Créez une issue sur GitHub avec les détails de l'erreur
