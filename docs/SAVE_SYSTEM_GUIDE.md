# Guide d'Utilisation - Système de Sauvegarde

## 🎯 Démarrage Rapide

### 1. Configuration

Créez un fichier `.env` à la racine du projet:

```bash
cp .env.example .env
```

Éditez le fichier `.env` pour configurer l'URL de votre backend:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Utilisation

#### Sauvegarder via le Bouton

1. Ouvrez l'application dans votre navigateur
2. Créez ou modifiez des scènes
3. Cliquez sur le bouton "Save" (💾) dans le header en haut à droite
4. Un toast de confirmation apparaîtra

**États du bouton:**
- 🔘 Gris: Aucune modification ou scène vide
- ⏳ Bleu avec loader: Sauvegarde en cours
- ✅ Vert avec checkmark: Sauvegarde réussie (affiche l'heure)

#### Sauvegarder via Raccourci Clavier

Appuyez sur:
- `Ctrl+S` (Windows/Linux)
- `Cmd+S` (Mac)

#### Utilisation Programmatique

```typescript
import { useSaveScene } from '@/app/scenes';

function MyComponent() {
  const { 
    saveAllScenes,      // Sauvegarde toutes les scènes
    saveCurrentScene,   // Sauvegarde la scène active
    isSaving,           // État de sauvegarde
    lastSaved           // Dernière sauvegarde
  } = useSaveScene();

  return (
    <button onClick={saveAllScenes} disabled={isSaving}>
      {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
    </button>
  );
}
```

## 🔧 Modes de Fonctionnement

### Mode Hybride (Recommandé)

Par défaut, l'application utilise le mode hybride:

```typescript
// Mode automatique dans scenesService.ts
constructor() {
  super(STORAGE_KEYS.SCENES, API_ENDPOINTS.scenes, 'hybrid');
}
```

**Comportement:**
1. ✅ Essaye de sauvegarder sur le backend
2. 🔄 Si échec, sauvegarde dans localStorage
3. 💾 Synchronise le cache localStorage avec le backend
4. 📶 Détecte automatiquement si vous êtes hors ligne

**Avantages:**
- Fonctionne avec ou sans backend
- Pas de perte de données
- Parfait pour le développement

### Mode Backend Uniquement

Pour forcer l'utilisation exclusive du backend:

```typescript
constructor() {
  super(STORAGE_KEYS.SCENES, API_ENDPOINTS.scenes, 'http');
}
```

**Comportement:**
- ✅ Toutes les opérations passent par le backend
- ❌ Erreur si le backend n'est pas disponible
- 🚀 Recommandé pour la production

### Mode LocalStorage Uniquement

Pour développer hors ligne:

```typescript
constructor() {
  super(STORAGE_KEYS.SCENES, API_ENDPOINTS.scenes, 'localStorage');
}
```

**Comportement:**
- 💾 Toutes les données dans localStorage
- 🚫 Aucune requête HTTP
- 🔌 Parfait pour démos hors ligne

## 📊 Feedback Utilisateur

### Notifications Toast

Le système affiche automatiquement des toasts pour:

**Succès:**
```
✅ 3 scènes sauvegardées avec succès
```

**Avertissement:**
```
⚠️ Aucune scène à sauvegarder
```

**Erreur:**
```
❌ Erreur lors de la sauvegarde: Network error
```

### Indicateurs Visuels

**Tooltip du bouton Save:**
- Idle: "Sauvegarder (Ctrl+S)"
- Saving: "Sauvegarde en cours..."
- Saved: "Dernière sauvegarde: 14:32:15"

**Console du navigateur:**
```
✓ 3 scenes saved successfully
⚠ Backend request failed, falling back to localStorage
ℹ Network: Offline
```

## 🐛 Dépannage

### Le bouton Save est désactivé

**Causes possibles:**
- Aucune scène créée
- Sauvegarde déjà en cours

**Solution:**
1. Créez au moins une scène
2. Attendez la fin de la sauvegarde en cours

### Erreur "Network Error"

**Causes possibles:**
- Backend pas démarré
- URL incorrecte dans `.env`
- Problème CORS

**Solutions:**

1. Vérifier que le backend tourne:
```bash
# Tester avec une requête directe vers votre backend
curl http://localhost:3000/api/scenes
```

2. Vérifier le fichier `.env`:
```bash
cat .env
# Doit contenir: VITE_API_URL=http://localhost:3000/api
```

3. Redémarrer l'application:
```bash
npm run dev
```

4. En mode hybride, les données sont quand même sauvegardées dans localStorage

### Les données ne persistent pas après rechargement

**En mode HTTP uniquement:**
- Vérifier que le backend enregistre bien les données
- Vérifier l'endpoint `/api/scenes` avec les requêtes GET

**En mode hybride ou localStorage:**
- Ouvrir DevTools > Application > Local Storage
- Vérifier que la clé `scenes` contient des données
- Si vide, vérifier les quotas de stockage du navigateur

### Timeout lors de la sauvegarde

**Causes:**
- Trop de données à envoyer
- Backend lent
- Connexion lente

**Solutions:**

1. Augmenter le timeout dans `httpClient.ts`:
```typescript
constructor(config: HttpClientConfig = {}) {
  this.client = axios.create({
    timeout: 60000, // 60 secondes au lieu de 30
    // ...
  });
}
```

2. Sauvegarder les scènes individuellement:
```typescript
const { saveScene } = useSaveScene();
await saveScene(sceneId);
```

## 🧪 Tester le Système

### Test 1: Sauvegarde avec Backend

1. Démarrer le backend sur `http://localhost:3000`
2. Créer une scène dans l'application
3. Cliquer sur Save
4. Vérifier la requête dans Network tab (DevTools)
5. Vérifier que le backend a reçu les données

### Test 2: Sauvegarde sans Backend (Fallback)

1. Arrêter le backend
2. Créer une scène dans l'application
3. Cliquer sur Save
4. Vérifier le message de fallback dans la console:
   ```
   ⚠ Backend request failed, falling back to localStorage
   ```
5. Ouvrir DevTools > Application > Local Storage
6. Vérifier que les données sont dans la clé `scenes`

### Test 3: Raccourci Clavier

1. Créer une scène
2. Appuyer sur `Ctrl+S` (ou `Cmd+S` sur Mac)
3. Vérifier qu'un toast de succès apparaît

### Test 4: Synchronisation

1. Créer des scènes avec backend arrêté (données dans localStorage)
2. Démarrer le backend
3. Cliquer sur Save
4. Vérifier que les données sont envoyées au backend
5. Vérifier dans localStorage ET dans le backend

## 📱 Exemples de Code

### Sauvegarder une scène spécifique

```typescript
import { useSaveScene } from '@/app/scenes';

function SceneEditor({ sceneId }) {
  const { saveScene, isSaving } = useSaveScene();

  const handleSave = async () => {
    const success = await saveScene(sceneId);
    if (success) {
      console.log('Scène sauvegardée!');
    }
  };

  return (
    <button onClick={handleSave} disabled={isSaving}>
      Sauvegarder cette scène
    </button>
  );
}
```

### Synchroniser avec le backend

```typescript
import { useSaveScene } from '@/app/scenes';

function SyncButton() {
  const { syncToBackend, isSaving } = useSaveScene();

  return (
    <button onClick={syncToBackend} disabled={isSaving}>
      {isSaving ? 'Synchronisation...' : 'Synchroniser avec le serveur'}
    </button>
  );
}
```

### Afficher le statut de sauvegarde

```typescript
import { useSaveScene } from '@/app/scenes';

function SaveStatus() {
  const { isSaving, lastSaved, hasUnsavedChanges } = useSaveScene();

  return (
    <div>
      {isSaving && <span>💾 Sauvegarde en cours...</span>}
      {lastSaved && (
        <span>✅ Sauvegardé à {lastSaved.toLocaleTimeString()}</span>
      )}
      {hasUnsavedChanges && (
        <span>⚠️ Modifications non sauvegardées</span>
      )}
    </div>
  );
}
```

## 🔐 Sécurité

### Ajouter l'authentification

Pour ajouter l'authentification, modifiez `src/services/api/httpClient.ts`:

```typescript
// Dans setupInterceptors(), ajoutez:
this.client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Note: Ce code n'est pas encore implémenté. Vous devrez l'ajouter si vous avez besoin d'authentification.

### Configuration CORS Backend

Exemple avec Express.js:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 📚 Ressources

- [Documentation complète](./SAVE_SYSTEM.md)
- [Architecture du projet](./ARCHITECTURE.md)
- [Guide des fonctionnalités](../FEATURES_GUIDE.md)

## 💡 Conseils

1. **Développement:** Utilisez le mode hybride
2. **Production:** Utilisez le mode HTTP avec backend fiable
3. **Démo:** Utilisez le mode localStorage
4. **Testez:** Toujours tester avec et sans backend
5. **Sauvegardez souvent:** Utilisez Ctrl+S régulièrement
