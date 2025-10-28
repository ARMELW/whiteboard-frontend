# Guide de Migration - Dynamisation de l'AnimatorContainer

## Vue d'ensemble

Ce document décrit les modifications apportées pour dynamiser l'`AnimatorContainer` avec l'intégration complète de l'API backend pour la gestion des assets, fonts et scenes.

## Changements Effectués

### 1. Service Fonts (Nouveau)

**Fichier:** `src/app/text/api/fontsService.ts`

Un nouveau service a été créé pour récupérer les polices de caractères depuis l'API backend avec fallback automatique.

```typescript
import fontsService from '@/app/text/api/fontsService';

// Récupérer toutes les fonts
const fonts = await fontsService.list();

// Récupérer les fonts par catégorie
const serifFonts = await fontsService.list({ category: 'serif' });

// Récupérer uniquement les fonts premium
const premiumFonts = await fontsService.list({ premiumOnly: true });
```

**Caractéristiques:**
- Appel API vers `GET /v1/fonts`
- Fallback automatique vers fonts hardcodées si l'API échoue
- Support des filtres (category, premiumOnly, popularOnly)
- Types TypeScript complets

### 2. Service Assets (Amélioré)

**Fichier:** `src/app/assets/api/assetsService.ts`

Le service assets a été migré vers TypeScript et amélioré avec support complet de l'API.

**Nouvelles fonctionnalités:**

```typescript
import assetsService from '@/app/assets';

// Upload via File object (recommandé)
const file = document.querySelector('input[type="file"]').files[0];
const asset = await assetsService.upload(file, {
  name: 'Mon image',
  category: 'illustration',
  tags: ['logo', 'brand']
});

// Upload via data object (legacy, backward compatible)
const asset = await assetsService.upload({
  name: 'Mon asset',
  dataUrl: 'data:image/png;base64,...',
  type: 'image/png',
  size: 12345
});

// Récupérer les statistiques
const stats = await assetsService.getStats();
console.log(stats.totalAssets, stats.totalSize, stats.byCategory);
```

**Améliorations:**
- Upload via FormData (multipart/form-data)
- Méthode `getStats()` pour récupérer les statistiques
- Types TypeScript complets
- Overload de méthodes pour plusieurs signatures
- Fallback automatique vers localStorage

### 3. Hooks Assets

**Fichiers:**
- `src/app/assets/hooks/useAssets.ts` (migré TypeScript)
- `src/app/assets/hooks/useAssetsActions.ts` (nouveau)

#### useAssets

Hook pour charger et gérer les assets:

```typescript
import { useAssets } from '@/app/assets';

function MyComponent() {
  const { 
    assets, 
    loading, 
    error, 
    loadAssets,
    uploadAsset,
    deleteAsset,
    getAssetsByType,
    searchAssets
  } = useAssets();
  
  const handleUpload = async (file: File) => {
    await uploadAsset(file, { category: 'icon' });
  };
  
  return (
    <div>
      {loading && <p>Chargement...</p>}
      {assets.map(asset => (
        <img key={asset.id} src={asset.url} alt={asset.name} />
      ))}
    </div>
  );
}
```

#### useAssetsActions

Hook pour les actions sur les assets (sans état local):

```typescript
import { useAssetsActions } from '@/app/assets';

function UploadButton() {
  const { uploadAsset, getAssetStats } = useAssetsActions();
  
  const handleUpload = async (file: File) => {
    const asset = await uploadAsset(file, {
      category: 'illustration',
      tags: ['logo']
    });
    console.log('Asset uploaded:', asset);
    
    const stats = await getAssetStats();
    console.log('Total assets:', stats.totalAssets);
  };
  
  return <button onClick={() => handleUpload(selectedFile)}>Upload</button>;
}
```

### 4. Hook Fonts

**Fichier:** `src/app/text/hooks/useFonts.ts`

Nouveau hook pour charger les fonts depuis l'API:

```typescript
import { useFonts } from '@/app/text';

function FontPicker() {
  const { fonts, loading, error, refetch } = useFonts();
  
  // Avec filtres
  const { fonts: serifFonts } = useFonts({ category: 'serif' });
  
  return (
    <select>
      {fonts.map(font => (
        <option key={font.id} value={font.family}>
          {font.name}
        </option>
      ))}
    </select>
  );
}
```

### 5. AnimatorContainer (Intégration)

**Fichier:** `src/components/organisms/AnimationContainer.tsx`

L'`AnimatorContainer` intègre maintenant tous les hooks pour charger dynamiquement les ressources:

```typescript
import { useAssets, useAssetsActions } from '@/app/assets';
import { useFonts } from '@/app/text';
import { useScenes, useScenesActions } from '@/app/scenes';

const AnimationContainer: React.FC = () => {
  // Chargement dynamique des assets
  const { assets, loading: assetsLoading } = useAssets();
  const assetsActions = useAssetsActions();
  
  // Chargement dynamique des fonts
  const { fonts, loading: fontsLoading } = useFonts();
  
  // Chargement dynamique des scènes
  const { scenes, loading: scenesLoading, refetch: refetchScenes } = useScenes();
  const scenesActions = useScenesActions();
  
  // Les composants enfants peuvent maintenant accéder à ces ressources
  // via le contexte ou les props
  
  return (
    <div>
      {/* Composants qui utilisent assets, fonts, scenes */}
    </div>
  );
}
```

**Logs de debug:**
- Logs automatiques quand les assets sont chargés
- Logs automatiques quand les fonts sont chargées
- Logs automatiques quand les scènes sont chargées

## Migration du Code Existant

### Avant

```typescript
// Code sans API dynamique
const assets = JSON.parse(localStorage.getItem('assets')) || [];
const fonts = ['Arial', 'Helvetica', 'Times New Roman'];
```

### Après

```typescript
// Code avec API dynamique
import { useAssets } from '@/app/assets';
import { useFonts } from '@/app/text';

const { assets, loading } = useAssets();
const { fonts } = useFonts();
```

## Types TypeScript

Tous les services et hooks sont maintenant typés:

```typescript
// Types Assets
interface Asset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  tags?: string[];
  category?: string;
  uploadedAt?: string;
  userId?: string;
}

// Types Fonts
interface Font {
  id: string;
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
  variants: string[];
  weights: number[];
  isPremium: boolean;
  isPopular: boolean;
}
```

## Configuration Requise

### Variables d'environnement

Assurez-vous que le fichier `.env` contient:

```env
VITE_API_URL=https://api.doodlio.com
# ou pour le développement:
# VITE_API_URL=http://localhost:3000
```

### Authentification

Le token d'authentification doit être stocké dans localStorage:

```javascript
localStorage.setItem('whiteboard_auth_token', 'YOUR_TOKEN');
```

## Gestion des Erreurs

Tous les services incluent un fallback automatique:

- **Fonts**: Fallback vers fonts hardcodées (Arial, Roboto, etc.)
- **Assets**: Fallback vers localStorage
- **Scenes**: Fallback vers localStorage

Les erreurs sont loggées dans la console pour le débogage.

## Tests

### Build

```bash
npm run build
```

✅ Build successful

### Linting

```bash
npm run lint
```

⚠️ Erreurs uniquement dans les fichiers de test (non liées aux changements)

## Prochaines Étapes

1. **Tests E2E**: Tester l'upload d'assets via l'interface
2. **Tests manuels**: Vérifier le chargement des fonts dans les composants
3. **Optimisation**: Implémenter React Query pour le cache
4. **Documentation utilisateur**: Mettre à jour les guides utilisateurs

## Support

Pour toute question:
1. Consultez `FRONTEND_API_GUIDE.md`
2. Vérifiez les logs de la console
3. Créez une issue sur GitHub

## Références

- **API Guide**: `FRONTEND_API_GUIDE.md`
- **Migration API**: `MIGRATION_API.md`
- **Configuration**: `src/config/api.ts`
