# Système de Sauvegarde Backend

## Vue d'ensemble

Ce document décrit le système de sauvegarde implémenté pour permettre la synchronisation des données entre le frontend et le backend.

## Architecture

### 1. Client HTTP (`src/services/api/httpClient.ts`)

Client HTTP centralisé basé sur Axios pour toutes les communications avec le backend.

**Fonctionnalités:**
- Configuration centralisée des requêtes HTTP
- Intercepteurs pour l'ajout automatique de headers (ex: authentification)
- Gestion d'erreurs centralisée
- Détection de l'état du réseau (online/offline)
- Timeouts configurables
- Méthode de test de connexion au backend

**Exemple d'utilisation:**
```typescript
import httpClient from '@/services/api/httpClient';

// GET request
const response = await httpClient.get('/scenes');

// POST request
const newScene = await httpClient.post('/scenes', sceneData);

// PUT request
const updated = await httpClient.put(`/scenes/${id}`, updates);

// Test de connexion
const isOnline = await httpClient.testConnection();
```

### 2. Service de Base Hybride (`src/services/api/baseService.ts`)

Service de base amélioré qui supporte trois modes de fonctionnement:

#### Modes de Stockage

1. **Mode Hybride (par défaut):** 
   - Essaye d'abord le backend via HTTP
   - Fallback automatique vers localStorage en cas d'échec
   - Synchronisation automatique du cache localStorage avec le backend
   - Idéal pour le développement et la production avec backend optionnel

2. **Mode HTTP uniquement:**
   - Toutes les opérations passent par le backend
   - Lève une erreur si le backend n'est pas disponible
   - Recommandé pour la production avec backend garanti

3. **Mode localStorage uniquement:**
   - Toutes les opérations utilisent localStorage
   - Aucune requête HTTP n'est effectuée
   - Utile pour le développement hors ligne ou les démos

**Configuration du mode:**
```typescript
class ScenesService extends BaseService<Scene> {
  constructor() {
    // Mode hybride (par défaut)
    super(STORAGE_KEYS.SCENES, API_ENDPOINTS.scenes, 'hybrid');
    
    // Ou mode HTTP uniquement
    // super(STORAGE_KEYS.SCENES, API_ENDPOINTS.scenes, 'http');
    
    // Ou mode localStorage uniquement
    // super(STORAGE_KEYS.SCENES, API_ENDPOINTS.scenes, 'localStorage');
  }
}
```

**Méthodes disponibles:**
- `list(params)` - Liste paginée des éléments
- `detail(id)` - Récupère un élément par son ID
- `create(payload)` - Crée un nouvel élément
- `update(id, payload)` - Met à jour un élément existant
- `delete(id)` - Supprime un élément
- `bulkUpdate(items)` - Met à jour plusieurs éléments en masse

### 3. Hook de Sauvegarde (`src/app/scenes/hooks/useSaveScene.ts`)

Hook React personnalisé pour gérer la sauvegarde des scènes.

**API du Hook:**

```typescript
const {
  // État
  isSaving,              // boolean - Indique si une sauvegarde est en cours
  lastSaved,             // Date | null - Timestamp de la dernière sauvegarde réussie
  error,                 // Error | null - Dernière erreur rencontrée
  hasUnsavedChanges,     // boolean - Indique s'il y a des modifications non sauvegardées
  
  // Actions
  saveAllScenes,         // () => Promise<boolean> - Sauvegarde toutes les scènes
  saveScene,             // (sceneId: string) => Promise<boolean> - Sauvegarde une scène spécifique
  saveCurrentScene,      // () => Promise<boolean> - Sauvegarde la scène courante
  syncToBackend,         // () => Promise<boolean> - Synchronise tout avec le backend
} = useSaveScene();
```

**Exemple d'utilisation:**

```typescript
import { useSaveScene } from '@/app/scenes';

function MyComponent() {
  const { saveAllScenes, isSaving, lastSaved } = useSaveScene();
  
  const handleSave = async () => {
    const success = await saveAllScenes();
    if (success) {
      console.log('Sauvegarde réussie !');
    }
  };
  
  return (
    <button onClick={handleSave} disabled={isSaving}>
      {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
    </button>
  );
}
```

### 4. Intégration UI (`src/components/organisms/AnimationHeader.tsx`)

Le bouton de sauvegarde dans le header propose:

**États Visuels:**
- **Idle:** Icône Save grise, hover bg-gray-800
- **Saving:** Loader animé + texte "Sauvegarde..."
- **Saved:** Icône Check verte avec timestamp dans le tooltip

**Raccourcis Clavier:**
- `Ctrl+S` (Windows/Linux) ou `Cmd+S` (Mac) pour sauvegarder

**Feedback Utilisateur:**
- Toast notifications de succès/erreur
- Tooltip avec timestamp de dernière sauvegarde
- Désactivation du bouton pendant la sauvegarde

## Configuration

### Variables d'Environnement

Créez un fichier `.env` à la racine du projet:

```bash
# URL de base de l'API backend
VITE_API_URL=http://localhost:3000/api
```

Pour la production, définissez cette variable dans votre environnement de déploiement.

### Endpoints API

Les endpoints sont configurés dans `src/config/api.ts`:

```typescript
export const API_ENDPOINTS = {
  scenes: {
    base: `${prefix}/scenes`,
    list: `${prefix}/scenes`,
    create: `${prefix}/scenes`,
    detail: (id: string) => `${prefix}/scenes/${id}`,
    update: (id: string) => `${prefix}/scenes/${id}`,
    delete: (id: string) => `${prefix}/scenes/${id}`,
    duplicate: (id: string) => `${prefix}/scenes/${id}/duplicate`,
    reorder: `${prefix}/scenes/reorder`,
  },
  // ... autres endpoints
};
```

## Format des Données

### Requêtes Backend

#### Créer une scène
```http
POST /api/scenes
Content-Type: application/json

{
  "id": "scene-1234567890",
  "title": "Nouvelle Scène",
  "content": "Contenu...",
  "duration": 5,
  "layers": [...],
  "sceneCameras": [...],
  "createdAt": "2025-10-25T10:00:00.000Z",
  "updatedAt": "2025-10-25T10:00:00.000Z"
}
```

#### Mettre à jour une scène
```http
PUT /api/scenes/{id}
Content-Type: application/json

{
  "title": "Titre Modifié",
  "duration": 7,
  "updatedAt": "2025-10-25T10:30:00.000Z"
}
```

#### Lister les scènes
```http
GET /api/scenes?page=1&limit=10&filter=search_term
```

**Réponse:**
```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

## Gestion des Erreurs

Le système gère automatiquement plusieurs types d'erreurs:

1. **Erreurs Réseau:** Fallback automatique vers localStorage en mode hybride
2. **Timeouts:** 30 secondes par défaut, configurable
3. **Erreurs Backend:** Messages d'erreur affichés via toast
4. **Hors Ligne:** Détection automatique et mode localStorage

**Logs de Debug:**
```typescript
// Les erreurs sont loggées dans la console
console.warn('Backend request failed, falling back to localStorage', error);
console.error('HTTP Error:', status, data);
console.error('Network Error: No response received');
```

## Tests

### Test de Connexion Backend

```typescript
import httpClient from '@/services/api/httpClient';

const isBackendAvailable = await httpClient.testConnection();
console.log('Backend disponible:', isBackendAvailable);
```

### Test Manuel

1. Démarrer l'application: `npm run dev`
2. Ouvrir la console développeur
3. Créer ou modifier une scène
4. Cliquer sur le bouton "Save" ou appuyer sur Ctrl+S
5. Vérifier les messages dans la console et les toasts
6. Inspecter le réseau (Network tab) pour voir les requêtes HTTP

### Test avec Backend Indisponible

1. S'assurer qu'aucun backend ne tourne sur `http://localhost:3000`
2. Effectuer des opérations de sauvegarde
3. Vérifier que les données sont sauvegardées dans localStorage
4. Vérifier les messages de fallback dans la console

## Migration des Données

Si vous avez déjà des données dans localStorage, elles seront:
1. Conservées en mode hybride
2. Synchronisées avec le backend lors de la prochaine sauvegarde
3. Utilisées comme cache pour améliorer les performances

## Développement

### Ajouter un Nouveau Service

1. Créer les endpoints dans `src/config/api.ts`
2. Créer un service qui étend `BaseService`
3. Créer des hooks personnalisés si nécessaire
4. Utiliser le service dans vos composants

**Exemple:**
```typescript
// 1. config/api.ts
export const API_ENDPOINTS = {
  assets: {
    base: `${prefix}/assets`,
    list: `${prefix}/assets`,
    create: `${prefix}/assets`,
    // ...
  }
};

// 2. services/assetsService.ts
class AssetsService extends BaseService<Asset> {
  constructor() {
    super(STORAGE_KEYS.ASSETS, API_ENDPOINTS.assets);
  }
}

export default new AssetsService();

// 3. hooks/useAssets.ts
export const useAssets = () => {
  // ... logique du hook
};
```

## Sécurité

### Authentification

Le client HTTP est prêt pour l'ajout de tokens d'authentification:

```typescript
// Dans httpClient.ts
this.client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### CORS

Assurez-vous que votre backend autorise les requêtes depuis votre domaine frontend:

```javascript
// Exemple avec Express.js
app.use(cors({
  origin: 'http://localhost:5173', // Ou votre domaine de production
  credentials: true
}));
```

## Performance

### Cache et Synchronisation

En mode hybride:
- Les données sont d'abord récupérées depuis le backend
- Puis mises en cache dans localStorage
- Les lectures suivantes utilisent le cache
- Les écritures synchronisent automatiquement les deux sources

### Optimisations Possibles

1. **Debouncing:** Attendre un délai avant de sauvegarder les modifications fréquentes
2. **Batch Updates:** Grouper plusieurs modifications en une seule requête
3. **Compression:** Compresser les données avant envoi au backend
4. **Lazy Loading:** Charger les scènes à la demande plutôt que toutes à la fois

## Troubleshooting

### Le bouton Save ne fait rien

1. Vérifier que `hasCurrentScene` est true
2. Vérifier la console pour les erreurs
3. Vérifier que les scènes existent dans le store

### Erreur "Network Error"

1. Vérifier que le backend est démarré
2. Vérifier l'URL dans `.env` (VITE_API_URL)
3. Vérifier la configuration CORS du backend
4. En mode hybride, les données sont sauvegardées dans localStorage

### Les données ne persistent pas

1. Vérifier que localStorage n'est pas désactivé
2. Vérifier les quotas de stockage du navigateur
3. En mode HTTP uniquement, vérifier la connexion backend

### Timeout Errors

1. Augmenter le timeout dans `httpClient.ts`
2. Optimiser les requêtes backend
3. Réduire la taille des payloads

## Support

Pour toute question ou problème:
1. Consulter les logs de la console navigateur
2. Vérifier les requêtes dans l'onglet Network
3. Vérifier localStorage dans l'onglet Application/Storage
4. Créer une issue sur GitHub avec les détails de l'erreur
