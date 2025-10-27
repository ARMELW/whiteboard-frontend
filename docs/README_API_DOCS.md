# 📚 Guide de Documentation API - Whiteboard Animation

## 📋 Fichiers Créés

Ce dépôt contient maintenant une documentation API complète en 2 fichiers:

```
whiteboard-frontend/
├── API_SPECIFICATIONS.md    (34 KB, 1696 lignes) - Documentation complète
├── API_SUMMARY.md            (5.6 KB, 175 lignes) - Résumé exécutif
└── README_API_DOCS.md        (ce fichier) - Guide d'utilisation
```

## 🎯 Quel Document Utiliser?

### Pour Développeurs Backend - Démarrage
👉 **Commencez par: `API_SUMMARY.md`**
- Vue d'ensemble rapide
- Endpoints principaux
- Focus images
- Priorités d'implémentation

### Pour Implémentation Détaillée
👉 **Référence: `API_SPECIFICATIONS.md`**
- Spécifications complètes
- Tous les payloads
- Tous les paramètres
- Exemples de code
- Modèles de données

## 📁 Structure API_SPECIFICATIONS.md

```
📄 API_SPECIFICATIONS.md
│
├── 📋 Vue d'ensemble
│   ├── Base URL
│   ├── Format des réponses
│   └── Gestion d'erreurs
│
├── 🔐 Authentication
│   └── Headers requis
│
├── 📁 1. Gestion des Assets (Images) ⭐ PRINCIPAL
│   ├── 1.1 Upload d'Image
│   ├── 1.2 Récupérer Liste des Images
│   ├── 1.3 Récupérer une Image Spécifique
│   ├── 1.4 Télécharger l'Image Brute
│   ├── 1.5 Mettre à Jour une Image
│   ├── 1.6 Supprimer une Image
│   └── 1.7 Statistiques des Assets
│
├── 🎬 2. Gestion des Projets
│   ├── 2.1 Créer un Projet
│   ├── 2.2 Lister les Projets
│   ├── 2.3 Récupérer un Projet
│   ├── 2.4 Mettre à Jour
│   ├── 2.5 Dupliquer
│   ├── 2.6 Supprimer
│   └── 2.7 Autosave
│
├── 🎨 3. Gestion des Scènes
│   ├── 3.1 Créer une Scène
│   ├── 3.2 Lister les Scènes
│   ├── 3.3 Récupérer une Scène
│   ├── 3.4 Mettre à Jour
│   ├── 3.5 Dupliquer
│   ├── 3.6 Réorganiser
│   └── 3.7 Supprimer
│
├── 📺 4. Gestion des Channels
│   ├── 4.1 Créer un Channel
│   ├── 4.2 Lister les Channels
│   ├── 4.3 Mettre à Jour
│   ├── 4.4 Upload Logo
│   ├── 4.5 Archiver
│   └── 4.6 Statistiques
│
├── 🎵 5. Gestion des Audio
│   ├── 5.1 Upload Audio
│   ├── 5.2 Lister les Fichiers
│   ├── 5.3 Récupérer Audio
│   ├── 5.4 Mettre à Jour
│   └── 5.5 Supprimer
│
├── 📝 6. Gestion des Templates
│   ├── 6.1 Créer un Template
│   ├── 6.2 Lister les Templates
│   ├── 6.3 Récupérer Template
│   ├── 6.4 Mettre à Jour
│   ├── 6.5 Supprimer
│   ├── 6.6 Exporter
│   └── 6.7 Importer
│
├── 🎬 7. Export et Génération Vidéo
│   ├── 7.1 Exporter une Scène
│   ├── 7.2 Générer Vidéo Complète
│   ├── 7.3 Vérifier le Statut
│   ├── 7.4 Télécharger la Vidéo
│   └── 7.5 Configuration d'Export
│
├── 🏥 8. Health & Monitoring
│   ├── 8.1 Health Check
│   └── 8.2 Version API
│
├── 📊 9. Modèles de Données
│   ├── Asset (Image)
│   ├── Project
│   ├── Scene
│   ├── Layer
│   ├── Camera
│   ├── AudioFile
│   ├── Channel
│   └── Template
│
├── 🔒 10. Sécurité et Validation
│   ├── Upload de Fichiers
│   ├── Rate Limiting
│   └── Codes d'Erreur
│
└── 🚀 11. Priorités d'Implémentation
    ├── Phase 1 (MVP)
    ├── Phase 2
    ├── Phase 3
    └── Phase 4
```

## 🎯 Focus: Récupération d'Images

### Endpoints Images Disponibles

| # | Endpoint | Méthode | Description |
|---|----------|---------|-------------|
| 1 | `/api/assets/upload` | POST | Upload image avec métadonnées |
| 2 | `/api/assets` | GET | Liste paginée avec filtres |
| 3 | `/api/assets/:id` | GET | Récupérer image spécifique |
| 4 | `/api/assets/:id/download` | GET | Télécharger fichier brut |
| 5 | `/api/assets/:id` | PUT | Mettre à jour métadonnées |
| 6 | `/api/assets/:id` | DELETE | Supprimer image |
| 7 | `/api/assets/stats` | GET | Statistiques d'utilisation |

### Exemple: Récupérer Liste d'Images

**Request:**
```bash
GET /api/assets?page=1&limit=20&category=illustration&sortBy=uploadDate&sortOrder=desc
Authorization: Bearer <token>
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
      "usageCount": 5
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

### Paramètres de Filtrage Images

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `page` | number | Numéro de page | `1` |
| `limit` | number | Résultats par page (max 100) | `20` |
| `filter` | string | Recherche textuelle | `"science"` |
| `category` | string | Filtrer par catégorie | `"illustration"` |
| `tags` | string[] | Filtrer par tags | `?tags[]=education` |
| `sortBy` | string | Champ de tri | `"uploadDate"` |
| `sortOrder` | string | Ordre de tri | `"desc"` |

## 🔧 Guide d'Implémentation Rapide

### Phase 1: MVP (Prioritaire)

1. **Setup Base**
   - Configuration serveur (Express/Fastify/NestJS)
   - Base de données PostgreSQL
   - Authentication (JWT)

2. **Images (Section 1)**
   - Implémenter `/assets/upload`
   - Implémenter `/assets` (liste)
   - Implémenter `/assets/:id` (détail)
   - Setup stockage cloud (S3/GCS)
   - Génération thumbnails automatique

3. **Projects & Scenes (Sections 2-3)**
   - CRUD basique projets
   - CRUD basique scènes
   - Relations entre entités

4. **Health Check (Section 8)**
   - `/health` endpoint
   - `/version` endpoint

### Technologies Recommandées

```typescript
// Stack suggéré
Backend:    Node.js + Express/NestJS
Database:   PostgreSQL (relations) + Redis (cache)
Storage:    AWS S3 / Google Cloud Storage
Queue:      Bull / Redis Queue
Auth:       JWT + Passport
Validation: Joi / Zod
ORM:        Prisma / TypeORM
```

## 📦 Modèles de Données Principaux

### Asset (Image)
```typescript
interface Asset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  type: string;              // MIME type
  size: number;              // bytes
  width: number;
  height: number;
  tags: string[];
  category: 'illustration' | 'icon' | 'background' | 'other';
  uploadedAt: string;        // ISO 8601
  lastUsed: string;
  usageCount: number;
  userId: string;
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
  resolution: '720p' | '1080p' | '4k';
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  fps: 24 | 30 | 60;
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

### Scene
```typescript
interface Scene {
  id: string;
  projectId: string;
  title: string;
  duration: number;
  layers: Layer[];
  cameras: Camera[];
  backgroundImage: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## 🔒 Sécurité

### Upload de Fichiers

**Images:**
- Formats: JPEG, PNG, WebP, GIF, SVG
- Taille max: 10 MB
- Dimensions max: 4096 x 4096 px
- Validation MIME type obligatoire

**Audio:**
- Formats: MP3, WAV, OGG, M4A
- Taille max: 50 MB
- Durée max: 30 minutes

### Rate Limiting

```
Upload:    10 requêtes/minute
Création:  30 requêtes/minute
Lecture:  100 requêtes/minute
Export:     5 requêtes/heure
```

## 📈 Statistiques

### Documents
- **Total lignes**: 1,871 lignes de documentation
- **Endpoints**: 50+ endpoints documentés
- **Modèles**: 8 interfaces TypeScript complètes
- **Exemples**: Nombreux exemples JavaScript/TypeScript

### Couverture
- ✅ 100% des endpoints CRUD images
- ✅ 100% des modèles de données
- ✅ 100% des codes d'erreur
- ✅ 100% des règles de sécurité
- ✅ Guide de priorisation complet

## 🚀 Démarrage Rapide

1. **Lire** `API_SUMMARY.md` pour vue d'ensemble (5 min)
2. **Référencer** `API_SPECIFICATIONS.md` pour détails (au besoin)
3. **Implémenter** Phase 1 (MVP) en priorité
4. **Tester** avec les exemples fournis
5. **Étendre** aux phases suivantes

## 💡 Support

Pour questions ou clarifications:
- Consulter les exemples dans `API_SPECIFICATIONS.md`
- Vérifier les modèles de données (section 9)
- Suivre les phases d'implémentation (section 11)

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2025-01-17  
**Auteur**: Copilot AI  
**License**: Projet ARMELW/whiteboard-frontend
