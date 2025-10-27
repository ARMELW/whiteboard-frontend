# Guide de Migration vers l'API Réelle

## Résumé des Modifications

Ce document explique les modifications apportées pour remplacer les services mock par des appels API réels.

## Services Dynamiser

### 1. Service Projets (`projectService`)

**Fichier**: `src/app/projects/api/projectService.ts`

**Remplacement**: `projectMockService` → `projectService`

**Endpoints utilisés**:
- `GET /v1/channels/{channelId}/projects` - Liste les projets d'un canal
- `GET /v1/projects` - Liste tous les projets
- `GET /v1/projects/{id}` - Détails d'un projet
- `POST /v1/channels/{channelId}/projects` - Créer un projet
- `PUT /v1/projects/{id}` - Mettre à jour un projet
- `POST /v1/projects/{id}/duplicate` - Dupliquer un projet
- `DELETE /v1/projects/{id}` - Supprimer un projet
- `POST /v1/projects/{id}/autosave` - Sauvegarde automatique

### 2. Service Canaux (`channelService`)

**Fichier**: `src/app/channels/api/channelService.ts`

**Remplacement**: `channelMockService` → `channelService`

**Endpoints utilisés**:
- `GET /v1/channels` - Liste les canaux
- `GET /v1/channels/{id}` - Détails d'un canal
- `POST /v1/channels` - Créer un canal
- `PUT /v1/channels/{id}` - Mettre à jour un canal
- `POST /v1/channels/{id}/archive` - Archiver un canal
- `DELETE /v1/channels/{id}` - Supprimer un canal
- `GET /v1/channels/{id}/stats` - Statistiques d'un canal
- `POST /v1/channels/{id}/brand-kit/logo` - Uploader un logo

### 3. Service AI (`aiService`)

**Fichier**: `src/app/wizard/api/aiService.ts`

**Remplacement**: `mockAiService` → `aiService`

**Endpoints utilisés**:
- `POST /v1/ai/generate-script` - Générer un script
- `POST /v1/ai/generate-image-prompt` - Générer des images
- `POST /v1/ai/generate-voice` - Générer des voix-off
- `GET /v1/ai/voices` - Liste des voix disponibles

### 4. Service Génération Vidéo (`videoGenerationService`)

**Fichier**: `src/services/api/videoGenerationService.ts`

**Mise à jour**: Mock → API avec fallback

**Endpoints utilisés**:
- `POST /v1/export/video` - Générer une vidéo
- `GET /v1/export/status/{exportId}` - Statut de l'export

## Hooks Mis à Jour

Les hooks suivants ont été modifiés pour utiliser les nouveaux services:

1. `src/app/projects/hooks/useProjects.ts`
2. `src/app/projects/hooks/useProjectsActions.ts`
3. `src/app/channels/hooks/useChannels.ts`
4. `src/app/channels/hooks/useChannelsActions.ts`
5. `src/app/wizard/hooks/useWizard.ts`

**Aucun changement d'interface** - Les hooks exposent les mêmes méthodes et propriétés.

## Configuration Requise

### Variable d'Environnement

Créez un fichier `.env` à la racine du projet:

```env
VITE_API_URL=https://api.doodlio.com
# ou pour le développement local:
# VITE_API_URL=http://localhost:3000
```

### Authentification

Le `httpClient` gère automatiquement l'authentification:

```typescript
// Le token est ajouté automatiquement aux requêtes
// Stocké dans localStorage sous 'whiteboard_auth_token'
```

## Gestion des Erreurs

### Comportement en Cas d'Échec API

Les services incluent une gestion d'erreur robuste:

```typescript
try {
  const result = await projectService.list(channelId);
  // Traitement réussi
} catch (error) {
  console.error('Error listing projects:', error);
  // Erreur affichée via toast
  throw error;
}
```

### Fallback pour le Développement

Le `videoGenerationService` inclut un fallback automatique vers le comportement mock si l'API échoue:

```typescript
try {
  // Essayer l'API
  const response = await httpClient.post(API_ENDPOINTS.export.video, data);
  return response.data.data.exportId;
} catch (error) {
  // Fallback vers mock
  return this.generateMockJob();
}
```

## Test de l'Intégration

### 1. Test Local

```bash
# Démarrer le serveur de développement
npm run dev

# L'application devrait fonctionner normalement
# Si le backend n'est pas accessible, certains services utiliseront le fallback
```

### 2. Test de Production

```bash
# Build de production
npm run build

# Vérifier qu'il n'y a pas d'erreurs
npm run preview
```

### 3. Vérification des Appels API

Dans la console du navigateur (DevTools), vérifiez:

```javascript
// Network tab
// Les requêtes vers /v1/... devraient apparaître
// Status: 200 OK pour les requêtes réussies
// Status: 401/403 si problème d'authentification
```

## Points d'Attention

### 1. Authentification

Avant d'utiliser l'API, assurez-vous que:
- L'utilisateur est authentifié via Better Auth
- Le token est stocké correctement
- Le token est valide (non expiré)

### 2. CORS

Si vous testez en local, assurez-vous que le backend autorise les requêtes cross-origin:

```typescript
// Backend configuration (exemple)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 3. Gestion du Cache

Les données ne sont plus stockées en mémoire. Chaque requête contacte l'API.
Pour améliorer les performances, considérez:
- Utiliser React Query pour le cache
- Implémenter un système de cache localStorage
- Optimiser les appels API

## Compatibilité

### Code Existant

✅ **100% compatible** - Aucune modification requise dans:
- Les composants React
- Les stores Zustand
- Les types TypeScript
- La logique métier

### Anciens Services Mock

Les services mock originaux sont conservés pour:
- Référence
- Tests unitaires
- Développement offline

Fichiers conservés:
- `src/app/projects/api/projectMockService.ts`
- `src/app/channels/api/channelMockService.ts`
- `src/app/wizard/api/mockAiService.ts`

## Dépannage

### Problème: API non accessible

**Symptôme**: Erreurs réseau dans la console

**Solution**:
1. Vérifiez `VITE_API_URL` dans `.env`
2. Vérifiez que le backend est démarré
3. Vérifiez les logs du backend

### Problème: Erreur 401 Unauthorized

**Symptôme**: Requêtes rejetées avec status 401

**Solution**:
1. Vérifiez que l'utilisateur est connecté
2. Vérifiez le token dans localStorage
3. Reconnectez-vous si nécessaire

### Problème: Erreur 404 Not Found

**Symptôme**: Endpoint non trouvé

**Solution**:
1. Vérifiez que l'endpoint existe dans le backend
2. Vérifiez la version de l'API (v1)
3. Consultez `FRONTEND_API_GUIDE.md`

## Prochaines Étapes

Pour compléter l'intégration:

1. **Tests E2E**: Tester tous les flows avec l'API réelle
2. **Gestion d'État**: Implémenter React Query pour le cache
3. **Optimisations**: Réduire les appels API redondants
4. **Monitoring**: Ajouter des logs pour suivre les performances
5. **Documentation**: Mettre à jour la documentation utilisateur

## Références

- **Guide API**: `FRONTEND_API_GUIDE.md`
- **Configuration**: `src/config/api.ts`
- **HTTP Client**: `src/services/api/httpClient.ts`
- **Base Service**: `src/services/api/baseService.ts`

## Support

Pour toute question ou problème:
1. Consultez `FRONTEND_API_GUIDE.md`
2. Vérifiez les logs de la console navigateur
3. Vérifiez les logs du backend
4. Créez une issue sur GitHub
