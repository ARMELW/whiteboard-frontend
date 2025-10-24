# Guide Visuel: Prévisualisation et Export Vidéo

## 📸 Aperçu des Fonctionnalités

### 1. Panneau de Génération Vidéo (VideoGenerationPanel)

```
┌──────────────────────────────────────────────────────────┐
│ Paramètres de Génération                                 │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Format                                                    │
│ ┌────────────────────────────────────────────────────┐  │
│ │ MP4 (recommandé)                            ▼      │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
│ Qualité                                                   │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Full HD (1920×1080)                         ▼      │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
│ Images par seconde (FPS)                                 │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 30 FPS (standard)                           ▼      │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
│ ─────────────────────────────────────────────────────   │
│ Durée totale:                             2:30 min       │
│ Nombre de scènes:                              5         │
├──────────────────────────────────────────────────────────┤
│ Musique de Fond (Optionnel)                              │
│ ┌────────────────────────────────────────────────────┐  │
│ │  📤  Ajouter Musique de Fond                       │  │
│ └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ ┌────────────────────────────────────────────────────┐  │
│ │  🎬  Générer la Vidéo                              │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### 2. État de Génération

#### En cours
```
┌──────────────────────────────────────────────────────────┐
│ ⏳ Génération en cours...                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ 65%                                                       │
└──────────────────────────────────────────────────────────┘
```

#### Terminée
```
┌──────────────────────────────────────────────────────────┐
│ ✓ Vidéo prête!                                           │
│ Votre vidéo est prête à être téléchargée ou              │
│ prévisualisée                                             │
├──────────────────────────────────────────────────────────┤
│ ┌─────────────────────┐  ┌─────────────────────┐        │
│ │  ▶ Prévisualiser    │  │  ⬇ Télécharger      │        │
│ └─────────────────────┘  └─────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

### 3. Lecteur Vidéo (VideoPreviewPlayer)

```
┌──────────────────────────────────────────────────────────┐
│ Prévisualisation Vidéo                               ✕   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│                                                           │
│                    [Vidéo Affichée]                       │
│                                                           │
│                                                           │
├──────────────────────────────────────────────────────────┤
│ 0:45 ━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2:30 │
│                                                           │
│ ▶  ↻  🔊 ━━━━━━●━━                             ⛶       │
│ Play Restart Volume                          Fullscreen  │
└──────────────────────────────────────────────────────────┘
```

### 4. AnimationHeader avec Bouton Preview

```
┌──────────────────────────────────────────────────────────┐
│ 🎬 Projet │ 📷 Camera │ [Undo] [Redo] [History] │ ▶ Play│
│                                                           │
│           Templates  Save  Exporter                       │
└──────────────────────────────────────────────────────────┘
                                    ↑
                          Nouveau bouton preview
```

### 5. Menu Contextuel Scène avec Preview

```
Scene Thumbnail
┌────────────────┐
│                │
│   Scene 1      │
│                │
│      ⋮         │ ← Clic sur menu
└────────────────┘
       ↓
┌────────────────────────┐
│ ▶ Prévisualiser        │ ← Nouvelle option
├────────────────────────┤
│ 📋 Dupliquer           │
│ 🔖 Sauvegarder         │
├────────────────────────┤
│ 🗑️ Supprimer          │
└────────────────────────┘
```

## 🎯 Flux d'Interaction Utilisateur

### Flux Principal: Générer et Prévisualiser

```
[Scènes prêtes]
     ↓
[Clic "Exporter"]
     ↓
[Configuration paramètres]
   Format: MP4
   Qualité: Full HD
   FPS: 30
     ↓
[Upload musique (optionnel)]
     ↓
[Clic "Générer la Vidéo"]
     ↓
[Génération en cours...]
   Barre de progression: 0% → 100%
     ↓
[Vidéo prête!]
   Deux boutons affichés:
   - Prévisualiser
   - Télécharger
     ↓
[Clic "Prévisualiser"]
     ↓
[Lecteur Vidéo Affiché]
   - Remplace l'éditeur Konva
   - Contrôles de lecture
   - Bouton X pour fermer
     ↓
[Lecture/Contrôle Vidéo]
     ↓
[Clic X pour fermer]
     ↓
[Retour à l'Éditeur]
     ↓
[Clic "Télécharger"]
     ↓
[Vidéo téléchargée] ✓
```

### Flux Alternatif: Preview Rapide par Scène

```
[Panneau Scènes]
     ↓
[Clic menu ⋮ sur une scène]
     ↓
[Sélection "Prévisualiser"]
     ↓
[Lecteur Vidéo Affiché]
   - Vidéo de cette scène
   - Titre: "Prévisualisation Scène"
     ↓
[Lecture Vidéo]
     ↓
[Clic X]
     ↓
[Retour à l'Éditeur] ✓
```

## 🎨 États Visuels

### 1. État Initial
- Panneau avec paramètres par défaut
- Bouton "Générer la Vidéo" actif
- Pas de musique sélectionnée

### 2. État Avec Musique
- Fichier audio affiché
- Nom + taille du fichier
- Bouton X pour supprimer

### 3. État En Génération
- Bouton "Générer" désactivé
- Barre de progression animée
- Pourcentage affiché
- Message "Génération en cours..."

### 4. État Complété
- Message de succès vert
- Deux boutons actifs:
  - "Prévisualiser" (bleu)
  - "Télécharger" (vert)
- Icônes ✓

### 5. État Erreur
- Message d'erreur rouge
- Description de l'erreur
- Icône ⚠
- Bouton "Générer" réactivé

### 6. Mode Prévisualisation
- Éditeur Konva caché
- Lecteur vidéo affiché plein écran
- Header avec titre + bouton X
- Footer avec contrôles

## 🔄 Transitions

### Éditeur → Preview
```
[LayerEditor visible]
     ↓ startPreview()
[Fade out]
     ↓
[VideoPreviewPlayer fade in]
```

### Preview → Éditeur
```
[VideoPreviewPlayer visible]
     ↓ stopPreview()
[Fade out]
     ↓
[LayerEditor fade in]
```

## 📱 Responsive Design

### Desktop (> 1024px)
- Lecteur vidéo centré
- Contrôles bien espacés
- Pleine utilisation de l'espace

### Tablet (768px - 1024px)
- Lecteur vidéo adapté
- Contrôles légèrement plus compacts

### Mobile (< 768px)
- Lecteur vidéo fullscreen
- Contrôles tactiles optimisés
- Boutons plus grands

## 🎨 Palette de Couleurs

### Boutons Principaux
- **Purple**: #9333ea (hover: #7e22ce)
  - Bouton "Générer la Vidéo"
  
- **Blue**: #2563eb (hover: #1d4ed8)
  - Bouton "Prévisualiser"
  - Icône Play
  
- **Green**: #16a34a (hover: #15803d)
  - Bouton "Télécharger"
  - État succès

### États
- **Succès**: #22c55e (background: #22c55e/10)
- **Erreur**: #ef4444 (background: #ef4444/10)
- **Warning**: #f59e0b (background: #f59e0b/10)
- **Info**: #3b82f6 (background: #3b82f6/10)

### Lecteur Vidéo
- **Background**: #111827 (gray-900)
- **Header/Footer**: #1f2937 (gray-800)
- **Contrôles**: #ffffff
- **Hover**: #374151 (gray-700)

## 🎬 Animations

### Barre de Progression
- Animation fluide 0% → 100%
- Transition: 300ms ease-out
- Couleur: purple gradient

### Fade In/Out
- Duration: 200ms
- Easing: ease-in-out
- Opacity: 0 ↔ 1

### Hover Effects
- Scale: 1.02
- Shadow: 0 4px 8px rgba(0,0,0,0.1)
- Transition: 150ms

## 📐 Dimensions

### Lecteur Vidéo
- Width: 100% du container
- Height: 100% du container
- Max-width: 1920px
- Aspect-ratio: 16:9

### Contrôles
- Height: 60px (footer)
- Button size: 40px × 40px
- Icon size: 20px × 20px
- Slider height: 4px

### Panneau Export
- Width: 320px (fixed)
- Max-height: 100vh
- Padding: 16px

## 🖱️ Interactions

### Clavier
- **Space**: Play/Pause
- **Arrow Left/Right**: Seek ±5s
- **Arrow Up/Down**: Volume ±10%
- **F**: Fullscreen
- **M**: Mute/Unmute
- **Escape**: Exit fullscreen ou close preview

### Souris
- **Clic sur vidéo**: Play/Pause
- **Clic sur progress**: Seek
- **Hover sur contrôles**: Highlight
- **Drag sur sliders**: Ajuster valeur

### Tactile
- **Tap sur vidéo**: Show/Hide contrôles
- **Double tap**: Fullscreen
- **Swipe horizontal**: Seek
- **Pinch**: Zoom (si supporté)

## ✨ Fonctionnalités Visuelles Bonus

### Preview Thumbnail
- Thumbnail de la vidéo dans le panneau
- Hover: Animation de preview
- Clic: Démarrer preview

### Mini Player
- Option de mini-player dans un coin
- Permet de continuer l'édition en background
- Drag & drop repositionnable

### Progress Markers
- Marqueurs des scènes sur la barre de progression
- Clic sur marqueur: Jump à cette scène
- Couleurs différentes par scène

## 🎯 Points d'Attention UX

1. **Feedback Immédiat**: Toute action a un feedback visuel
2. **États Clairs**: L'utilisateur sait toujours où il en est
3. **Réversibilité**: Possibilité de fermer/annuler à tout moment
4. **Cohérence**: Design uniforme avec le reste de l'app
5. **Performance**: Transitions fluides sans lag

---

**Ce guide visuel accompagne l'implémentation technique pour donner une vue complète de l'expérience utilisateur.**
