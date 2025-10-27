# Spécifications API Backend - Whiteboard Animation

## 📋 Vue d'ensemble

Ce document décrit toutes les APIs nécessaires pour le backend du projet Whiteboard Animation, incluant les spécifications détaillées des endpoints, les payloads, paramètres et formats de réponse.

### Base URL
```
http://localhost:3000/api
```

### Format des Réponses
Toutes les réponses suivent le format JSON standard avec gestion d'erreur cohérente.

#### Réponse Succès
```json
{
  "data": {},
  "message": "Success message (optionnel)"
}
```

#### Réponse Liste (avec pagination)
```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### Réponse Erreur
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Description de l'erreur",
    "details": {}
  }
}
```

---

## 🔐 Authentication

### Headers Requis
Tous les endpoints protégés par better auth:

---

## 📁 1. Gestion des Assets (Images)

### 1.1 Upload d'Image

**Endpoint:** `POST /assets/upload`

**Description:** Upload une image dans la base de données et la stocke avec métadonnées

**Content-Type:** `multipart/form-data`

**Payload:**
```typescript
interface UploadImagePayload {
  file: File;              // Fichier image (requis)
  name?: string;           // Nom personnalisé (optionnel, par défaut nom du fichier)
  tags?: string[];         // Tags pour catégorisation (optionnel)
  category?: string;       // Catégorie: 'illustration', 'icon', 'background', 'other'
}
```

**Exemple Request:**
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('name', 'Mon image');
formData.append('tags', JSON.stringify(['education', 'science']));
formData.append('category', 'illustration');

fetch('/api/assets/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>'
  },
  body: formData
});
```

**Response:**
```json
{
  "data": {
    "id": "asset_1234567890",
    "name": "Mon image",
    "url": "https://storage.example.com/assets/asset_1234567890.jpg",
    "thumbnailUrl": "https://storage.example.com/assets/thumbs/asset_1234567890_thumb.jpg",
    "type": "image/jpeg",
    "size": 245678,
    "width": 1920,
    "height": 1080,
    "tags": ["education", "science"],
    "category": "illustration",
    "uploadedAt": "2025-01-15T10:30:00Z",
    "userId": "user_123"
  }
}
```

**Codes d'erreur:**
- `400`: Fichier invalide ou format non supporté
- `413`: Fichier trop volumineux (max 10MB)
- `401`: Non authentifié
- `500`: Erreur serveur

---

### 1.2 Récupérer Liste des Images

**Endpoint:** `GET /assets`

**Description:** Récupère la liste de toutes les images uploadées par l'utilisateur avec pagination et filtres

**Query Parameters:**
```typescript
interface AssetListParams {
  page?: number;              // Numéro de page (défaut: 1)
  limit?: number;             // Nombre par page (défaut: 20, max: 100)
  filter?: string;            // Recherche textuelle (nom, tags)
  category?: string;          // Filtrer par catégorie
  tags?: string[];            // Filtrer par tags (format: ?tags[]=tag1&tags[]=tag2)
  sortBy?: 'name' | 'uploadDate' | 'size' | 'usageCount';  // Tri (défaut: uploadDate)
  sortOrder?: 'asc' | 'desc'; // Ordre de tri (défaut: desc)
  userId?: string;            // Filtrer par utilisateur (admin seulement)
}
```

**Exemple Request:**
```
GET /api/assets?page=1&limit=20&filter=science&sortBy=uploadDate&sortOrder=desc
```

**Response:**
```json
{
  "data": [
    {
      "id": "asset_1234567890",
      "name": "Science Illustration",
      "url": "https://storage.example.com/assets/asset_1234567890.jpg",
      "thumbnailUrl": "https://storage.example.com/assets/thumbs/asset_1234567890_thumb.jpg",
      "type": "image/jpeg",
      "size": 245678,
      "width": 1920,
      "height": 1080,
      "tags": ["education", "science"],
      "category": "illustration",
      "uploadedAt": "2025-01-15T10:30:00Z",
      "lastUsed": "2025-01-16T14:20:00Z",
      "usageCount": 5,
      "userId": "user_123"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

---

### 1.3 Récupérer une Image Spécifique

**Endpoint:** `GET /assets/:id`

**Description:** Récupère les détails complets d'une image spécifique

**Path Parameters:**
- `id` (string): Identifiant de l'asset

**Response:**
```json
{
  "data": {
    "id": "asset_1234567890",
    "name": "Science Illustration",
    "url": "https://storage.example.com/assets/asset_1234567890.jpg",
    "thumbnailUrl": "https://storage.example.com/assets/thumbs/asset_1234567890_thumb.jpg",
    "type": "image/jpeg",
    "size": 245678,
    "width": 1920,
    "height": 1080,
    "tags": ["education", "science"],
    "category": "illustration",
    "uploadedAt": "2025-01-15T10:30:00Z",
    "lastUsed": "2025-01-16T14:20:00Z",
    "usageCount": 5,
    "userId": "user_123",
    "metadata": {
      "format": "jpeg",
      "colorSpace": "sRGB",
      "hasAlpha": false
    }
  }
}
```

**Codes d'erreur:**
- `404`: Asset non trouvé
- `403`: Accès non autorisé

---

### 1.4 Télécharger l'Image Brute

**Endpoint:** `GET /assets/:id/download`

**Description:** Télécharge le fichier image original

**Path Parameters:**
- `id` (string): Identifiant de l'asset

**Query Parameters:**
- `thumbnail` (boolean, optionnel): Si true, télécharge la miniature

**Response:** 
Fichier binaire avec headers appropriés:
```
Content-Type: image/jpeg
Content-Disposition: attachment; filename="image_name.jpg"
Content-Length: 245678
```

---

### 1.5 Mettre à Jour une Image

**Endpoint:** `PUT /assets/:id`

**Description:** Met à jour les métadonnées d'une image

**Path Parameters:**
- `id` (string): Identifiant de l'asset

**Payload:**
```json
{
  "name": "Nouveau nom",
  "tags": ["nouveau", "tags"],
  "category": "background"
}
```

**Response:**
```json
{
  "data": {
    "id": "asset_1234567890",
    "name": "Nouveau nom",
    "url": "https://storage.example.com/assets/asset_1234567890.jpg",
    "thumbnailUrl": "https://storage.example.com/assets/thumbs/asset_1234567890_thumb.jpg",
    "type": "image/jpeg",
    "size": 245678,
    "width": 1920,
    "height": 1080,
    "tags": ["nouveau", "tags"],
    "category": "background",
    "uploadedAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-17T09:15:00Z",
    "lastUsed": "2025-01-16T14:20:00Z",
    "usageCount": 5,
    "userId": "user_123"
  }
}
```

---

### 1.6 Supprimer une Image

**Endpoint:** `DELETE /assets/:id`

**Description:** Supprime une image de la base de données et du stockage

**Path Parameters:**
- `id` (string): Identifiant de l'asset

**Response:**
```json
{
  "success": true,
  "id": "asset_1234567890",
  "message": "Asset deleted successfully"
}
```

**Codes d'erreur:**
- `404`: Asset non trouvé
- `409`: Asset utilisé dans des projets actifs (prévention de suppression)

---

### 1.7 Statistiques des Assets

**Endpoint:** `GET /assets/stats`

**Description:** Récupère les statistiques d'utilisation des assets

**Response:**
```json
{
  "data": {
    "totalAssets": 156,
    "totalSize": 52428800,
    "totalSizeMB": "50.00",
    "assetsByCategory": {
      "illustration": 45,
      "icon": 78,
      "background": 23,
      "other": 10
    },
    "mostUsedAssets": [
      {
        "id": "asset_123",
        "name": "Logo",
        "usageCount": 45,
        "thumbnailUrl": "https://..."
      }
    ],
    "recentlyUploaded": [
      {
        "id": "asset_456",
        "name": "New Image",
        "uploadedAt": "2025-01-17T10:00:00Z",
        "thumbnailUrl": "https://..."
      }
    ]
  }
}
```

---

## 🎬 2. Gestion des Projets

### 2.1 Créer un Projet

**Endpoint:** `POST /channels/:channelId/projects`

**Description:** Crée un nouveau projet vidéo dans un channel

**Path Parameters:**
- `channelId` (string): ID du channel parent

**Payload:**
```typescript
interface CreateProjectPayload {
  title: string;                                    // Titre du projet (requis)
  description?: string;                             // Description
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';  // Défaut: '16:9'
  resolution?: '720p' | '1080p' | '4k';            // Défaut: '1080p'
  fps?: 24 | 30 | 60;                              // Défaut: 30
}
```

**Exemple:**
```json
{
  "title": "Mon Projet Éducatif",
  "description": "Vidéo explicative sur la photosynthèse",
  "aspectRatio": "16:9",
  "resolution": "1080p",
  "fps": 30
}
```

**Response:**
```json
{
  "data": {
    "id": "project_987654321",
    "userId": "user_123",
    "channelId": "channel_456",
    "title": "Mon Projet Éducatif",
    "description": "Vidéo explicative sur la photosynthèse",
    "thumbnailUrl": null,
    "resolution": "1080p",
    "aspectRatio": "16:9",
    "fps": 30,
    "duration": 0,
    "status": "draft",
    "createdAt": "2025-01-17T10:00:00Z",
    "updatedAt": "2025-01-17T10:00:00Z",
    "deletedAt": null
  }
}
```

---

### 2.2 Lister les Projets d'un Channel

**Endpoint:** `GET /channels/:channelId/projects`

**Description:** Récupère tous les projets d'un channel avec pagination

**Path Parameters:**
- `channelId` (string): ID du channel

**Query Parameters:**
```typescript
interface ProjectListParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'in_progress' | 'completed';
  sortBy?: 'created_at' | 'updated_at' | 'title';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "project_987654321",
      "userId": "user_123",
      "channelId": "channel_456",
      "title": "Mon Projet Éducatif",
      "description": "Vidéo explicative sur la photosynthèse",
      "thumbnailUrl": "https://storage.example.com/thumbnails/project_987654321.jpg",
      "resolution": "1080p",
      "aspectRatio": "16:9",
      "fps": 30,
      "duration": 180,
      "status": "in_progress",
      "createdAt": "2025-01-17T10:00:00Z",
      "updatedAt": "2025-01-17T15:30:00Z"
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 20
}
```

---

### 2.3 Récupérer un Projet Spécifique

**Endpoint:** `GET /projects/:id`

**Description:** Récupère les détails complets d'un projet

**Path Parameters:**
- `id` (string): ID du projet

**Response:**
```json
{
  "data": {
    "id": "project_987654321",
    "userId": "user_123",
    "channelId": "channel_456",
    "title": "Mon Projet Éducatif",
    "description": "Vidéo explicative sur la photosynthèse",
    "thumbnailUrl": "https://storage.example.com/thumbnails/project_987654321.jpg",
    "resolution": "1080p",
    "aspectRatio": "16:9",
    "fps": 30,
    "duration": 180,
    "status": "in_progress",
    "createdAt": "2025-01-17T10:00:00Z",
    "updatedAt": "2025-01-17T15:30:00Z",
    "deletedAt": null
  }
}
```

---

### 2.4 Mettre à Jour un Projet

**Endpoint:** `PUT /projects/:id`

**Description:** Met à jour les propriétés d'un projet

**Path Parameters:**
- `id` (string): ID du projet

**Payload:**
```json
{
  "title": "Titre Modifié",
  "description": "Nouvelle description",
  "status": "completed"
}
```

**Response:** Même structure que 2.3

---

### 2.5 Dupliquer un Projet

**Endpoint:** `POST /projects/:id/duplicate`

**Description:** Crée une copie complète d'un projet existant

**Path Parameters:**
- `id` (string): ID du projet à dupliquer

**Payload:**
```json
{
  "title": "Copie - Mon Projet"
}
```

**Response:** Nouveau projet créé avec toutes les scènes dupliquées

---

### 2.6 Supprimer un Projet

**Endpoint:** `DELETE /projects/:id`

**Description:** Supprime un projet (soft delete)

**Path Parameters:**
- `id` (string): ID du projet

**Response:**
```json
{
  "success": true,
  "id": "project_987654321",
  "message": "Project deleted successfully"
}
```

---

### 2.7 Autosave du Projet

**Endpoint:** `POST /projects/:id/autosave`

**Description:** Sauvegarde automatique de l'état du projet

**Path Parameters:**
- `id` (string): ID du projet

**Payload:**
```json
{
  "data": {
    "scenes": [],
    "lastEditedSceneId": "scene_123",
    "editPosition": { "x": 100, "y": 200 }
  },
  "timestamp": "2025-01-17T15:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "savedAt": "2025-01-17T15:30:00Z"
}
```

---

## 🎨 3. Gestion des Scènes

### 3.1 Créer une Scène

**Endpoint:** `POST /scenes`

**Description:** Crée une nouvelle scène pour un projet

**Payload:**
```typescript
interface CreateScenePayload {
  projectId: string;                    // ID du projet parent (requis)
  title: string;                        // Titre de la scène (requis)
  content?: string;                     // Contenu textuel
  duration?: number;                    // Durée en secondes (défaut: 10)
  backgroundImage?: string;             // URL de l'image de fond
  layers?: Layer[];                     // Calques de la scène
  cameras?: Camera[];                   // Configuration caméra
  audio?: AudioConfig;                  // Configuration audio
  transitionType?: 'none' | 'fade' | 'slide';  // Type de transition
}
```

**Exemple:**
```json
{
  "projectId": "project_987654321",
  "title": "Introduction",
  "content": "Bienvenue dans cette vidéo",
  "duration": 10,
  "backgroundImage": "https://storage.example.com/backgrounds/white.jpg",
  "layers": [
    {
      "id": "layer_1",
      "name": "Titre Principal",
      "type": "text",
      "mode": "static",
      "position": { "x": 960, "y": 540 },
      "zIndex": 1,
      "scale": 1,
      "opacity": 1,
      "text": "Bienvenue",
      "locked": false
    }
  ],
  "cameras": [
    {
      "id": "camera_1",
      "name": "Default Camera",
      "position": { "x": 0, "y": 0 },
      "zoom": 1,
      "isDefault": true
    }
  ],
  "transitionType": "fade"
}
```

**Response:**
```json
{
  "data": {
    "id": "scene_111222333",
    "projectId": "project_987654321",
    "title": "Introduction",
    "content": "Bienvenue dans cette vidéo",
    "duration": 10,
    "animation": "fade",
    "backgroundImage": "https://storage.example.com/backgrounds/white.jpg",
    "sceneImage": null,
    "layers": [...],
    "cameras": [...],
    "sceneCameras": [...],
    "multiTimeline": {},
    "audio": {},
    "sceneAudio": null,
    "createdAt": "2025-01-17T10:00:00Z",
    "updatedAt": "2025-01-17T10:00:00Z",
    "transitionType": "fade",
    "draggingSpeed": 1,
    "slideDuration": 0,
    "syncSlideWithVoice": false
  }
}
```

---

### 3.2 Lister les Scènes d'un Projet

**Endpoint:** `GET /scenes`

**Description:** Récupère toutes les scènes avec filtrage

**Query Parameters:**
```typescript
interface SceneListParams {
  projectId?: string;   // Filtrer par projet
  page?: number;
  limit?: number;
  filter?: string;      // Recherche textuelle
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "scene_111222333",
      "projectId": "project_987654321",
      "title": "Introduction",
      "content": "Bienvenue dans cette vidéo",
      "duration": 10,
      "animation": "fade",
      "backgroundImage": "https://storage.example.com/backgrounds/white.jpg",
      "sceneImage": "https://storage.example.com/thumbnails/scene_111222333.jpg",
      "layers": [],
      "cameras": [],
      "createdAt": "2025-01-17T10:00:00Z",
      "updatedAt": "2025-01-17T10:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

---

### 3.3 Récupérer une Scène Spécifique

**Endpoint:** `GET /scenes/:id`

**Description:** Récupère tous les détails d'une scène

**Path Parameters:**
- `id` (string): ID de la scène

**Response:** Même structure que la réponse de création (3.1)

---

### 3.4 Mettre à Jour une Scène

**Endpoint:** `PUT /scenes/:id`

**Description:** Met à jour une scène existante

**Path Parameters:**
- `id` (string): ID de la scène

**Payload:** Tous les champs de `CreateScenePayload` sont optionnels

**Response:** Scène mise à jour

---

### 3.5 Dupliquer une Scène

**Endpoint:** `POST /scenes/:id/duplicate`

**Description:** Crée une copie d'une scène

**Path Parameters:**
- `id` (string): ID de la scène à dupliquer

**Response:** Nouvelle scène créée

---

### 3.6 Réorganiser les Scènes

**Endpoint:** `POST /scenes/reorder`

**Description:** Change l'ordre des scènes dans un projet

**Payload:**
```json
{
  "projectId": "project_987654321",
  "sceneIds": ["scene_3", "scene_1", "scene_2"]
}
```

**Response:**
```json
{
  "success": true,
  "scenes": [...]
}
```

---

### 3.7 Supprimer une Scène

**Endpoint:** `DELETE /scenes/:id`

**Description:** Supprime une scène

**Path Parameters:**
- `id` (string): ID de la scène

**Response:**
```json
{
  "success": true,
  "id": "scene_111222333"
}
```

---

## �� 4. Gestion des Channels

### 4.1 Créer un Channel

**Endpoint:** `POST /channels`

**Payload:**
```typescript
interface CreateChannelPayload {
  name: string;              // Nom du channel (requis)
  description?: string;      // Description
  youtubeUrl?: string;       // URL de la chaîne YouTube
}
```

**Response:**
```json
{
  "data": {
    "id": "channel_456",
    "userId": "user_123",
    "name": "Ma Chaîne Éducative",
    "description": "Vidéos éducatives sur les sciences",
    "youtubeUrl": "https://youtube.com/@machaine",
    "brandKit": {
      "logoUrl": null,
      "colors": {
        "primary": "#3B82F6",
        "secondary": "#10B981",
        "accent": "#F59E0B"
      },
      "introVideoUrl": null,
      "outroVideoUrl": null,
      "customFonts": null
    },
    "projectCount": 0,
    "totalVideosExported": 0,
    "status": "active",
    "createdAt": "2025-01-17T10:00:00Z",
    "updatedAt": "2025-01-17T10:00:00Z"
  }
}
```

---

### 4.2 Lister les Channels

**Endpoint:** `GET /channels`

**Query Parameters:**
- `status`: 'active' | 'archived'
- `page`, `limit`: pagination

**Response:**
```json
{
  "data": [...],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

---

### 4.3 Mettre à Jour un Channel

**Endpoint:** `PUT /channels/:id`

**Payload:**
```json
{
  "name": "Nouveau Nom",
  "description": "Nouvelle description"
}
```

---

### 4.4 Upload Logo du Channel

**Endpoint:** `POST /channels/:id/brand-kit/logo`

**Description:** Upload le logo du brand kit

**Content-Type:** `multipart/form-data`

**Payload:**
```
file: File (image du logo)
```

**Response:**
```json
{
  "data": {
    "logoUrl": "https://storage.example.com/channels/channel_456/logo.png"
  }
}
```

---

### 4.5 Archiver un Channel

**Endpoint:** `POST /channels/:id/archive`

**Response:**
```json
{
  "success": true,
  "id": "channel_456",
  "status": "archived"
}
```

---

### 4.6 Statistiques d'un Channel

**Endpoint:** `GET /channels/:id/stats`

**Response:**
```json
{
  "data": {
    "channelId": "channel_456",
    "totalProjects": 15,
    "projectsByStatus": {
      "draft": 5,
      "inProgress": 7,
      "completed": 3
    },
    "totalVideosExported": 8,
    "totalDurationMinutes": 45,
    "lastActivity": "2025-01-17T15:30:00Z",
    "mostUsedAssets": [
      {
        "assetId": "asset_123",
        "name": "Logo",
        "usageCount": 12
      }
    ]
  }
}
```

---

## 🎵 5. Gestion des Audio

### 5.1 Upload Audio

**Endpoint:** `POST /audio/upload`

**Description:** Upload un fichier audio

**Content-Type:** `multipart/form-data`

**Payload:**
```typescript
interface UploadAudioPayload {
  file: File;                                                      // Fichier audio (requis)
  name?: string;                                                   // Nom personnalisé
  category?: 'music' | 'sfx' | 'voiceover' | 'ambient' | 'other'; // Catégorie
  tags?: string[];                                                 // Tags
}
```

**Response:**
```json
{
  "data": {
    "id": "audio_789456",
    "fileName": "background-music.mp3",
    "fileUrl": "https://storage.example.com/audio/audio_789456.mp3",
    "duration": 120.5,
    "uploadedAt": "2025-01-17T10:00:00Z",
    "size": 1234567,
    "category": "music",
    "tags": ["upbeat", "energetic"],
    "isFavorite": false
  }
}
```

---

### 5.2 Lister les Fichiers Audio

**Endpoint:** `GET /audio`

**Query Parameters:**
```typescript
interface AudioListParams {
  page?: number;
  limit?: number;
  category?: 'music' | 'sfx' | 'voiceover' | 'ambient' | 'other';
  tags?: string[];
  search?: string;
  favoritesOnly?: boolean;
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "audio_789456",
      "fileName": "background-music.mp3",
      "fileUrl": "https://storage.example.com/audio/audio_789456.mp3",
      "duration": 120.5,
      "uploadedAt": "2025-01-17T10:00:00Z",
      "size": 1234567,
      "category": "music",
      "tags": ["upbeat", "energetic"],
      "isFavorite": false,
      "trimConfig": null,
      "fadeConfig": null
    }
  ],
  "total": 23,
  "page": 1,
  "limit": 20
}
```

---

### 5.3 Récupérer un Audio Spécifique

**Endpoint:** `GET /audio/:id`

**Response:** Détails complets du fichier audio

---

### 5.4 Mettre à Jour un Audio

**Endpoint:** `PUT /audio/:id`

**Payload:**
```json
{
  "fileName": "Nouveau nom",
  "category": "voiceover",
  "tags": ["narrator", "male"],
  "isFavorite": true,
  "trimConfig": {
    "startTime": 5.0,
    "endTime": 115.0
  },
  "fadeConfig": {
    "fadeIn": 2.0,
    "fadeOut": 3.0
  }
}
```

---

### 5.5 Supprimer un Audio

**Endpoint:** `DELETE /audio/:id`

**Response:**
```json
{
  "success": true,
  "id": "audio_789456"
}
```

---

## 📝 6. Gestion des Templates

### 6.1 Créer un Template

**Endpoint:** `POST /templates`

**Payload:**
```typescript
interface CreateTemplatePayload {
  name: string;
  description: string;
  type: 'education' | 'marketing' | 'presentation' | 'tutorial' | 'entertainment' | 'other';
  style: 'minimal' | 'colorful' | 'professional' | 'creative' | 'dark' | 'light';
  tags: string[];
  thumbnail?: string;
  sceneData: Scene;  // Données complètes de la scène template
  metadata?: {
    layerCount: number;
    cameraCount: number;
    hasAudio: boolean;
    hasBackground: boolean;
    complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
}
```

**Response:**
```json
{
  "data": {
    "id": "template_555666",
    "name": "Template Éducatif Moderne",
    "description": "Template professionnel pour vidéos éducatives",
    "type": "education",
    "style": "professional",
    "tags": ["education", "clean", "modern"],
    "thumbnail": "https://storage.example.com/templates/template_555666_thumb.jpg",
    "previewAnimation": null,
    "metadata": {
      "layerCount": 5,
      "cameraCount": 2,
      "hasAudio": false,
      "hasBackground": true,
      "complexity": "intermediate"
    },
    "rating": {
      "average": 0,
      "count": 0
    },
    "popularity": 0,
    "sceneData": {...},
    "createdAt": "2025-01-17T10:00:00Z",
    "updatedAt": "2025-01-17T10:00:00Z",
    "version": "1.0.0"
  }
}
```

---

### 6.2 Lister les Templates

**Endpoint:** `GET /templates`

**Query Parameters:**
```typescript
interface TemplateListParams {
  page?: number;
  limit?: number;
  type?: TemplateType;
  style?: TemplateStyle;
  complexity?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags?: string[];
  search?: string;
  minRating?: number;
  sortByPopularity?: boolean;
}
```

**Response:** Liste paginée de templates

---

### 6.3 Récupérer un Template

**Endpoint:** `GET /templates/:id`

**Response:** Détails complets du template avec sceneData

---

### 6.4 Mettre à Jour un Template

**Endpoint:** `PUT /templates/:id`

**Payload:** Champs optionnels de `CreateTemplatePayload`

---

### 6.5 Supprimer un Template

**Endpoint:** `DELETE /templates/:id`

---

### 6.6 Exporter un Template

**Endpoint:** `GET /templates/:id/export`

**Description:** Exporte un template au format JSON pour partage/backup

**Response:**
```json
{
  "version": "1.0.0",
  "template": {...},
  "exportedAt": "2025-01-17T10:00:00Z"
}
```

---

### 6.7 Importer un Template

**Endpoint:** `POST /templates/import`

**Payload:**
```json
{
  "templateData": {
    "version": "1.0.0",
    "template": {...}
  }
}
```

**Response:** Template importé

---

## 🎬 7. Export et Génération Vidéo

### 7.1 Exporter une Scène

**Endpoint:** `POST /export/scene/:id`

**Description:** Exporte une scène en tant qu'image ou vidéo

**Path Parameters:**
- `id` (string): ID de la scène

**Payload:**
```json
{
  "format": "png" | "jpg" | "mp4" | "webm",
  "quality": "low" | "medium" | "high" | "ultra",
  "resolution": "720p" | "1080p" | "4k"
}
```

**Response:**
```json
{
  "data": {
    "exportId": "export_123456",
    "sceneId": "scene_111222333",
    "format": "mp4",
    "status": "processing",
    "progress": 0,
    "createdAt": "2025-01-17T10:00:00Z"
  }
}
```

---

### 7.2 Générer Vidéo Complète

**Endpoint:** `POST /export/video`

**Description:** Génère la vidéo complète du projet

**Payload:**
```typescript
interface ExportVideoPayload {
  projectId: string;
  format: 'mp4' | 'webm' | 'mov';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  resolution: '720p' | '1080p' | '4k';
  fps: 24 | 30 | 60;
  includeAudio: boolean;
  watermark?: {
    enabled: boolean;
    text?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
}
```

**Response:**
```json
{
  "data": {
    "exportId": "export_789123",
    "projectId": "project_987654321",
    "format": "mp4",
    "status": "queued",
    "progress": 0,
    "estimatedDuration": 300,
    "createdAt": "2025-01-17T10:00:00Z"
  }
}
```

---

### 7.3 Vérifier le Statut d'Export

**Endpoint:** `GET /export/status/:exportId`

**Response:**
```json
{
  "data": {
    "exportId": "export_789123",
    "status": "processing",
    "progress": 45,
    "currentStep": "Rendering scene 3/10",
    "videoUrl": null,
    "error": null,
    "createdAt": "2025-01-17T10:00:00Z",
    "completedAt": null
  }
}
```

Statuts possibles:
- `queued`: En file d'attente
- `processing`: En cours de génération
- `completed`: Terminé avec succès
- `failed`: Échec
- `cancelled`: Annulé

---

### 7.4 Télécharger la Vidéo Exportée

**Endpoint:** `GET /export/download/:exportId`

**Response:** Fichier vidéo binaire

---

### 7.5 Configuration d'Export

**Endpoint:** `GET /export/config`

**Description:** Récupère les configurations d'export disponibles

**Response:**
```json
{
  "data": {
    "formats": ["mp4", "webm", "mov"],
    "resolutions": ["720p", "1080p", "4k"],
    "qualities": ["low", "medium", "high", "ultra"],
    "fpsOptions": [24, 30, 60],
    "limits": {
      "maxDuration": 600,
      "maxScenes": 50,
      "maxResolution": "4k"
    }
  }
}
```

---

## 🏥 8. Health & Monitoring

### 8.1 Health Check

**Endpoint:** `GET /health`

**Description:** Vérifie l'état du serveur

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-17T10:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "storage": "healthy",
    "queue": "healthy"
  }
}
```

---

### 8.2 Version API

**Endpoint:** `GET /version`

**Response:**
```json
{
  "version": "1.0.0",
  "apiVersion": "v1",
  "buildDate": "2025-01-15",
  "environment": "production"
}
```

---

## 📊 Modèles de Données

### Asset (Image)
```typescript
interface Asset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  type: string;              // MIME type
  size: number;              // en bytes
  width: number;
  height: number;
  tags: string[];
  category: 'illustration' | 'icon' | 'background' | 'other';
  uploadedAt: string;        // ISO 8601
  lastUsed: string;          // ISO 8601
  usageCount: number;
  userId: string;
  metadata?: {
    format: string;
    colorSpace: string;
    hasAlpha: boolean;
  };
}
```

### Project
```typescript
interface Project {
  id: string;
  userId: string;
  channelId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  resolution: '720p' | '1080p' | '4k';
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  fps: 24 | 30 | 60;
  duration: number;          // en secondes
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

### Scene
```typescript
interface Scene {
  id: string;
  projectId: string;
  title: string;
  content: string;
  duration: number;
  animation: string;
  backgroundImage: string | null;
  sceneImage: string | null;
  layers: Layer[];
  cameras: Camera[];
  sceneCameras: Camera[];
  multiTimeline: MultiTimeline;
  audio: AudioConfig;
  sceneAudio: SceneAudioConfig | null;
  createdAt: string;
  updatedAt: string;
  transitionType?: string;
  draggingSpeed?: number;
  slideDuration?: number;
  syncSlideWithVoice?: boolean;
}
```

### Layer
```typescript
interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'video' | 'audio';
  mode: 'draw' | 'static' | 'animated';
  position: { x: number; y: number };
  zIndex: number;
  scale: number;
  opacity: number;
  skipRate?: number;
  imagePath?: string;
  text?: string;
  locked?: boolean;
  animationType?: string;
  animationSpeed?: number;
  endDelay?: number;
  handType?: string;
}
```

### Camera
```typescript
interface Camera {
  id: string;
  name: string;
  position: { x: number; y: number };
  scale?: number;
  zoom?: number;
  width?: number;
  height?: number;
  animation?: CameraAnimation;
  locked?: boolean;
  isDefault?: boolean;
  duration?: number;
  transitionDuration?: number;
  easing?: string;
  pauseDuration?: number;
  movementType?: string;
}
```

### AudioFile
```typescript
interface AudioFile {
  id: string;
  fileName: string;
  fileUrl: string;
  duration: number;
  uploadedAt: string;
  size: number;
  category: 'music' | 'sfx' | 'voiceover' | 'ambient' | 'other';
  tags: string[];
  isFavorite: boolean;
  trimConfig?: {
    startTime: number;
    endTime: number;
  };
  fadeConfig?: {
    fadeIn: number;
    fadeOut: number;
  };
}
```

### Channel
```typescript
interface Channel {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  youtubeUrl: string | null;
  brandKit: {
    logoUrl: string | null;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    introVideoUrl: string | null;
    outroVideoUrl: string | null;
    customFonts: string[] | null;
  };
  projectCount: number;
  totalVideosExported: number;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}
```

### Template
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  type: 'education' | 'marketing' | 'presentation' | 'tutorial' | 'entertainment' | 'other';
  style: 'minimal' | 'colorful' | 'professional' | 'creative' | 'dark' | 'light';
  tags: string[];
  thumbnail: string | null;
  previewAnimation: string | null;
  metadata: {
    layerCount: number;
    cameraCount: number;
    hasAudio: boolean;
    hasBackground: boolean;
    complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    estimatedDuration?: number;
    recommendedUseCase?: string;
  };
  rating: {
    average: number;
    count: number;
  };
  popularity: number;
  sceneData: Scene;
  createdAt: string;
  updatedAt: string;
  version: string;
}
```

---

## 🔒 Sécurité et Validation

### Upload de Fichiers

#### Images
- **Formats acceptés**: JPEG, PNG, WebP, GIF, SVG
- **Taille maximale**: 10 MB
- **Dimensions maximales**: 4096 x 4096 pixels
- **Validation**: Type MIME, dimensions, intégrité du fichier

#### Audio
- **Formats acceptés**: MP3, WAV, OGG, M4A
- **Taille maximale**: 50 MB
- **Durée maximale**: 30 minutes
- **Validation**: Type MIME, durée, bitrate

### Rate Limiting
```
- Upload: 10 requêtes / minute
- Création: 30 requêtes / minute
- Lecture: 100 requêtes / minute
- Export vidéo: 5 requêtes / heure
```

### Codes d'Erreur Standards

| Code | Description |
|------|-------------|
| 400  | Bad Request - Paramètres invalides |
| 401  | Unauthorized - Non authentifié |
| 403  | Forbidden - Accès refusé |
| 404  | Not Found - Ressource introuvable |
| 409  | Conflict - Conflit (ressource déjà existante) |
| 413  | Payload Too Large - Fichier trop volumineux |
| 422  | Unprocessable Entity - Validation échouée |
| 429  | Too Many Requests - Rate limit dépassé |
| 500  | Internal Server Error - Erreur serveur |
| 503  | Service Unavailable - Service temporairement indisponible |

---

## 📝 Notes d'Implémentation

### Stockage des Fichiers
- Utiliser un service de stockage cloud (AWS S3, Google Cloud Storage, Azure Blob)
- Générer automatiquement des thumbnails pour les images
- Implémenter un CDN pour la distribution des assets

### Base de Données
- PostgreSQL recommandé pour les données relationnelles
- Redis pour le cache et les files d'attente
- MongoDB optionnel pour les données de scènes complexes (JSON)

### File d'Attente
- Implémenter une queue (Redis Queue, Bull, RabbitMQ) pour:
  - Génération de vidéos
  - Traitement d'images (thumbnails, compression)
  - Traitement audio

### Websockets
- Pour notifier en temps réel:
  - Progression d'export vidéo
  - Autosave

### Optimisations
- Compression automatique des images uploadées
- Lazy loading des listes avec pagination
- Cache des assets fréquemment utilisés
- Indexation des recherches textuelles

---

## 🚀 Priorités d'Implémentation

### Phase 1 (MVP)
1. Authentication & Users
2. Assets (upload, list, retrieve, delete images)
3. Projects (CRUD basique)
4. Scenes (CRUD basique)
5. Health checks

### Phase 2
1. Channels
2. Audio management
3. Templates
4. Scene export (images)

### Phase 3
1. Video generation
2. Advanced exports
3. Statistics
4. Bulk operations

### Phase 4
1. Collaboration features
2. Real-time updates
3. Advanced analytics
4. AI integrations

---

## 📧 Support

Pour toute question sur ces spécifications API, contactez l'équipe de développement.

**Version du document**: 1.0.0  
**Dernière mise à jour**: 2025-01-17
