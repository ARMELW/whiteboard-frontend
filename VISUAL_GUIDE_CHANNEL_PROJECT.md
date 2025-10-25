# 🖼️ Visual Feature Guide - Channel & Project Management

## 📱 Application Views

### 1. Main Navigation (Top-Right Toggle)
```
┌─────────────────────────────────────────────┐
│  [Dashboard] [Éditeur]                      │
└─────────────────────────────────────────────┘
```
- Floating toggle in top-right corner
- Switch between Dashboard App and Animation Editor
- Always visible for easy navigation

---

## 🏠 Dashboard View

### Channel Grid Layout
```
┌──────────────────────────────────────────────────────────┐
│ Tableau de bord                                          │
│ Gérez vos chaînes et vos projets vidéo                  │
│                                                          │
│ Mes Chaînes                    [+ Nouvelle chaîne]      │
│ 2 chaînes                                                │
│                                                          │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│ │ [Logo] 🍳   │  │ [Logo] 💻   │  │             │     │
│ │             │  │             │  │   Create    │     │
│ │ Ma Chaîne   │  │ Tech Reviews│  │   your      │     │
│ │ Cuisine     │  │ FR          │  │   first     │     │
│ │             │  │             │  │   channel   │     │
│ │ 🎥 12 projets│ │ 🎥 8 projets │  │             │     │
│ │ 📅 il y a 2h │ │ 📅 il y a 5h │  │ [+ Button]  │     │
│ │             │  │             │  │             │     │
│ │ ■ ■ ■       │  │ ■ ■ ■       │  │             │     │
│ │ (colors)    │  │ (colors)    │  │             │     │
│ │       [⚙️]   │  │       [⚙️]   │  │             │     │
│ └─────────────┘  └─────────────┘  └─────────────┘     │
└──────────────────────────────────────────────────────────┘
```

### Channel Card Components
- **Logo**: Uploaded image or auto-generated with first letter + primary color
- **Name & Description**: Channel title and optional description
- **Stats**: Project count and last activity (relative time)
- **Brand Colors**: Visual badges showing the 3 colors
- **Settings Icon**: Appears on hover, opens settings modal

---

## ➕ Create Channel Modal

```
┌───────────────────────────────────────┐
│ Créer une nouvelle chaîne            │
│ Ajoutez une nouvelle chaîne pour     │
│ organiser vos projets vidéo          │
│                                       │
│ Nom de la chaîne *                   │
│ [Ma Chaîne Cuisine                 ] │
│                                       │
│ Description                          │
│ [Recettes faciles...              ]│
│ [                                 ]│
│                                       │
│ URL YouTube                          │
│ [https://youtube.com/@...         ] │
│                                       │
│           [Annuler]  [Créer la chaîne]│
└───────────────────────────────────────┘
```

**Validation**:
- Name is required
- URL is optional but validated
- Plan limit checked before creation
- Shows error modal if limit reached

---

## ⚙️ Channel Settings Modal

### Tab Navigation
```
┌─────────────────────────────────────────────┐
│ Paramètres de la chaîne                    │
│ Ma Chaîne Cuisine                           │
│                                             │
│ [Général] [Brand Kit] [Statistiques]       │
│ ─────────                                   │
│ ...tab content...                           │
└─────────────────────────────────────────────┘
```

### General Tab
```
│ Nom de la chaîne                            │
│ [Ma Chaîne Cuisine                       ] │
│                                             │
│ Description                                 │
│ [Recettes faciles et délicieuses        ]│
│                                             │
│ URL YouTube                                 │
│ [https://youtube.com/@cuisine           ] │
│                                             │
│ [Enregistrer les modifications]            │
│                                             │
│ ─────────────────────────────────────────  │
│ Zone de danger                              │
│ [Archiver la chaîne]  [🗑️ Supprimer]       │
```

### Brand Kit Tab
```
│ Logo de la chaîne                           │
│ ┌──────┐                                    │
│ │ [🍳] │  [📤 Télécharger un logo]          │
│ │ Logo │  PNG, JPG ou SVG. Max 5 MB.       │
│ └──────┘                                    │
│                                             │
│ Palette de couleurs                         │
│                                             │
│ Couleur primaire                            │
│ [🎨] [#FF6B6B                    ] [■]     │
│                                             │
│ Couleur secondaire                          │
│ [🎨] [#4ECDC4                    ] [■]     │
│                                             │
│ Couleur d'accent                            │
│ [🎨] [#FFE66D                    ] [■]     │
│                                             │
│ Aperçu                                      │
│ ┌──────────────────────────────┐            │
│ │  [■]      ───────             │           │
│ │ Large    ───────              │           │
│ │  Logo     ────                │           │
│ └──────────────────────────────┘            │
```

### Statistics Tab
```
│ ┌──────────────┐  ┌──────────────┐          │
│ │ Projets      │  │ Vidéos       │          │
│ │              │  │ exportées    │          │
│ │    12        │  │    45        │          │
│ └──────────────┘  └──────────────┘          │
│                                             │
│ ┌──────────────────────────────────┐        │
│ │ Dernière activité                │        │
│ │ 24 octobre 2025 à 16:45         │        │
│ └──────────────────────────────────┘        │
```

---

## 📁 Projects View

### Project List with Filters
```
┌───────────────────────────────────────────────────────────┐
│ Mes Projets                        [+ Nouveau projet]    │
│ 3 projets                                                 │
│                                                           │
│ [🔍 Rechercher...]  [Statut ▼]  [Trier par ▼]          │
│                                                           │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │ ╔══════════╗ │  │ ╔══════════╗ │  │ ╔══════════╗ │   │
│ │ ║[Thumbnail]║ │  │ ║ [▶️ Play] ║ │  │ ║[Thumbnail]║ │   │
│ │ ║  Image    ║ │  │ ║          ║ │  │ ║  Image    ║ │   │
│ │ ╚══════════╝ │  │ ╚══════════╝ │  │ ╚══════════╝ │   │
│ │ [Brouillon]  │  │ [En cours]   │  │ [Terminé]    │   │
│ │ [⋮]          │  │ [⋮]          │  │ [⋮]          │   │
│ │              │  │              │  │              │   │
│ │ Pâtes        │  │ Gâteau au    │  │ iPhone 15    │   │
│ │ Carbonara    │  │ Chocolat     │  │ Review       │   │
│ │              │  │              │  │              │   │
│ │ 16:9  2:00   │  │ 16:9  3:00   │  │ 16:9  5:00   │   │
│ │ il y a 1h    │  │ il y a 3h    │  │ il y a 2j    │   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────────────────────────────────────────────────────┘
```

### Project Card Actions (Dropdown Menu)
```
│ [⋮] ←─── Click
│   ↓
│ ┌─────────────────┐
│ │ ▶️  Ouvrir      │
│ │ 📋 Dupliquer    │
│ │ 🗑️  Supprimer   │
│ └─────────────────┘
```

### Filter Options
```
Status Filter:
┌────────────────────┐
│ Tous les statuts  │
│ Brouillon         │
│ En cours          │
│ Terminé           │
└────────────────────┘

Sort Options:
┌────────────────────────┐
│ Date de modification  │
│ Titre                 │
└────────────────────────┘
```

---

## ➕ Create Project Modal

```
┌───────────────────────────────────────┐
│ Créer un nouveau projet              │
│ Configurez votre nouveau projet vidéo│
│                                       │
│ Titre du projet *                    │
│ [Ma Nouvelle Vidéo                 ] │
│                                       │
│ Chaîne *                             │
│ [Ma Chaîne Cuisine              ▼] │
│                                       │
│ Format            Résolution         │
│ [16:9 (Paysage) ▼] [1080p (Full HD)▼]│
│                                       │
│           [Annuler]  [Créer le projet]│
└───────────────────────────────────────┘
```

**Format Options**:
- 16:9 (Paysage) - YouTube standard
- 9:16 (Portrait) - TikTok, Instagram Reels
- 1:1 (Carré) - Instagram feed
- 4:5 (Instagram) - Instagram optimized

**Resolution Options**:
- 720p (HD)
- 1080p (Full HD)
- 4K (Ultra HD)

---

## 🔄 Confirmation Dialogs

### Delete Project
```
┌────────────────────────────────────┐
│ Supprimer le projet               │
│                                    │
│ Êtes-vous sûr de vouloir supprimer│
│ "Ma Vidéo" ?                       │
│ Cette action est réversible        │
│ pendant 30 jours.                  │
│                                    │
│        [Annuler]  [Supprimer]     │
└────────────────────────────────────┘
```

### Delete Channel (with projects)
```
┌─────────────────────────────────────┐
│ ⚠️  Impossible de supprimer         │
│                                     │
│ Impossible de supprimer une chaîne  │
│ contenant des projets actifs        │
│                                     │
│ Projets actifs: 5                   │
│                                     │
│ Archivez ou supprimez d'abord les  │
│ projets de cette chaîne             │
│                                     │
│              [Compris]              │
└─────────────────────────────────────┘
```

### Plan Limit Reached
```
┌─────────────────────────────────────┐
│ ⚠️  Limite atteinte                 │
│                                     │
│ Vous avez atteint la limite de 3    │
│ chaînes pour votre plan Créateur    │
│                                     │
│ Chaînes utilisées: 3/3             │
│                                     │
│      [Annuler]  [Mettre à niveau]  │
└─────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Default Brand Kit Colors
```
Primary:   #3498DB (Blue)    ████
Secondary: #E74C3C (Red)     ████
Accent:    #F39C12 (Orange)  ████
```

### Status Badge Colors
```
Brouillon:  Gray   ████
En cours:   Blue   ████
Terminé:    Green  ████
```

---

## 📱 Responsive Breakpoints

### Desktop (lg)
- Channel Grid: 3 columns
- Project Grid: 4 columns
- Full navigation visible

### Tablet (md)
- Channel Grid: 2 columns
- Project Grid: 2 columns
- Compact navigation

### Mobile (sm)
- Channel Grid: 1 column
- Project Grid: 1 column
- Stacked filters
- Bottom navigation (future)

---

## ⌨️ Keyboard Shortcuts (Future)

```
Ctrl/Cmd + N  - New Channel
Ctrl/Cmd + P  - New Project
Ctrl/Cmd + K  - Search
Escape        - Close Modal
```

---

## 🔔 Toast Notifications

### Success Messages
```
┌────────────────────────────────┐
│ ✓ Chaîne créée avec succès    │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ✓ Projet dupliqué avec succès │
└────────────────────────────────┘
```

### Error Messages
```
┌─────────────────────────────────────┐
│ ✗ Erreur lors de la création        │
└─────────────────────────────────────┘
```

---

## 🎯 Interactive Elements

### Hover States
- Cards: Shadow increases
- Buttons: Background lightens
- Settings icon: Fades in
- Dropdown: Highlight row

### Loading States
- Spinner for list loading
- Button disabled with spinner
- Skeleton loaders (future)

### Empty States
- Dashed border container
- Icon + message
- Call-to-action button
- Helpful text

---

## 📊 Data Display Patterns

### Relative Time
```
il y a 2 minutes
il y a 1 heure
il y a 3 jours
il y a 2 semaines
```

### Duration Format
```
0:30  (30 seconds)
2:15  (2 minutes 15 seconds)
15:00 (15 minutes)
```

### Aspect Ratio Labels
```
16:9  Paysage (YouTube)
9:16  Portrait (TikTok)
1:1   Carré (Instagram)
4:5   Instagram
```

This visual guide provides a complete overview of all UI components and their interactions in the Channel & Project Management System!
