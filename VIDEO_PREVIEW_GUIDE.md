# Guide d'Utilisation: Prévisualisation et Export Vidéo

## Vue d'ensemble

Le système de prévisualisation et d'export vidéo permet aux utilisateurs de:
- **Générer des vidéos** avec des paramètres personnalisables (format, qualité, FPS)
- **Prévisualiser les vidéos** avant le téléchargement
- **Prévisualiser une scène unique** pour vérifier le rendu
- **Télécharger les vidéos** générées

## 🎬 Fonctionnalités

### 1. Génération de Vidéo

#### Paramètres disponibles
- **Format**: MP4 (recommandé) ou WebM
- **Qualité**: 
  - HD (1280×720)
  - Full HD (1920×1080) 
  - 4K (3840×2160)
- **FPS (Images par seconde)**:
  - 24 FPS (cinéma)
  - 30 FPS (standard)
  - 60 FPS (fluide)

#### Musique de fond
- Optionnelle
- Formats supportés: MP3, WAV
- Upload via interface drag & drop

#### Informations affichées
- **Durée totale**: Calculée automatiquement depuis toutes les scènes
- **Nombre de scènes**: Affichage du nombre total de scènes

### 2. Prévisualisation

#### Prévisualisation Complète
1. Cliquer sur le bouton **Play** dans la barre d'en-tête (AnimationHeader)
2. Ou générer une vidéo et cliquer sur **Prévisualiser** dans le panneau Export
3. La vidéo s'affiche dans un lecteur intégré à la place de l'éditeur Konva
4. Fermer avec le bouton X pour retourner à l'éditeur

#### Prévisualisation par Scène
1. Dans le panneau des scènes (en bas), cliquer sur le menu **...** d'une scène
2. Sélectionner **Prévisualiser**
3. La vidéo de cette scène s'affiche dans le lecteur
4. Fermer avec le bouton X pour retourner à l'éditeur

### 3. Lecteur Vidéo

#### Contrôles disponibles
- **Lecture/Pause**: Démarrer ou mettre en pause la vidéo
- **Restart**: Recommencer la vidéo depuis le début
- **Barre de progression**: Naviguer dans la vidéo en cliquant
- **Volume**: 
  - Bouton muet/son
  - Slider de volume
- **Plein écran**: Afficher la vidéo en plein écran
- **Temps**: Affichage du temps actuel et de la durée totale

#### Interface
- Design moderne et épuré
- Fond sombre pour une meilleure visibilité
- Contrôles intuitifs similaires aux lecteurs vidéo standards

## 📋 Guide Étape par Étape

### Générer et Prévisualiser une Vidéo

1. **Préparer les scènes**
   - Créer et configurer toutes vos scènes
   - Ajouter les éléments (images, textes, formes)
   - Configurer les animations et durées

2. **Accéder au panneau d'export**
   - Cliquer sur le bouton **Exporter** en haut à droite
   - Ou cliquer sur l'onglet **Export** dans le panneau de propriétés

3. **Configurer les paramètres**
   - Sélectionner le format désiré
   - Choisir la qualité de sortie
   - Définir les FPS
   - (Optionnel) Ajouter une musique de fond

4. **Générer la vidéo**
   - Cliquer sur **Générer la Vidéo**
   - Attendre la fin de la génération (barre de progression)

5. **Prévisualiser**
   - Cliquer sur **Prévisualiser** quand la génération est terminée
   - La vidéo s'affiche dans le lecteur intégré
   - Utiliser les contrôles pour naviguer dans la vidéo

6. **Télécharger**
   - Cliquer sur **Télécharger** si satisfait du résultat
   - Ou fermer la prévisualisation et régénérer avec d'autres paramètres

## 🔧 Architecture Technique

### Composants Créés

#### VideoGenerationPanel
**Fichier**: `src/components/organisms/VideoGenerationPanel.tsx`

Responsabilités:
- Affichage des paramètres de génération
- Gestion de l'upload de musique
- Déclenchement de la génération
- Affichage de la progression
- Boutons de prévisualisation et téléchargement

États:
```typescript
interface VideoGenerationState {
  audioFile: File | null;
  format: 'mp4' | 'webm';
  quality: 'hd' | 'fullhd' | '4k';
  fps: 24 | 30 | 60;
}
```

#### VideoPreviewPlayer
**Fichier**: `src/components/organisms/VideoPreviewPlayer.tsx`

Responsabilités:
- Affichage de la vidéo
- Contrôles de lecture (play, pause, seek)
- Gestion du volume
- Mode plein écran
- Fermeture et retour à l'éditeur

Props:
```typescript
interface VideoPreviewPlayerProps {
  videoUrl: string;
  onClose: () => void;
  title?: string;
}
```

### État Global (Store)

**Fichier**: `src/app/scenes/store.ts`

Nouveaux états:
```typescript
interface PreviewState {
  previewMode: boolean;          // Active le mode prévisualisation
  previewVideoUrl: string | null; // URL de la vidéo à afficher
  previewType: 'full' | 'scene' | null; // Type de prévisualisation
}
```

Nouvelles actions:
```typescript
startPreview(videoUrl: string, type: 'full' | 'scene'): void
stopPreview(): void
setPreviewMode(mode: boolean): void
setPreviewVideoUrl(url: string | null): void
setPreviewType(type: 'full' | 'scene' | null): void
```

### Hook Modifié

**Fichier**: `src/hooks/useVideoGeneration.ts`

Fonction mise à jour:
```typescript
generateVideo(
  audioFile?: File, 
  config?: { 
    format?: string; 
    quality?: string; 
    fps?: number 
  }
): Promise<void>
```

### Composants Modifiés

1. **LayerEditor**: Affichage conditionnel entre éditeur et lecteur
2. **AnimationHeader**: Bouton de prévisualisation
3. **ScenePanel**: Option de prévisualisation par scène
4. **PropertiesPanel**: Intégration de VideoGenerationPanel dans l'onglet Export

## 🎨 Design et UX

### Principes de Design
- **Cohérence**: Utilisation des composants UI existants (Radix UI)
- **Accessibilité**: Contrôles clavier, labels ARIA
- **Feedback**: États visuels clairs (chargement, succès, erreur)
- **Fluidité**: Transitions douces entre les modes

### Palette de Couleurs
- Boutons principaux: Purple (#9333ea)
- Bouton preview: Blue (#2563eb)
- Bouton download: Green (#16a34a)
- États de succès: Green (#22c55e)
- États d'erreur: Red (#ef4444)

## 🔄 Flux de Données

```
User Action
  ↓
VideoGenerationPanel (Generate Button)
  ↓
useVideoGeneration hook
  ↓
videoGenerationService
  ↓
Job Creation & Polling
  ↓
Status Updates (progress, completed, error)
  ↓
Display Results (Preview/Download buttons)
  ↓
User clicks Preview
  ↓
startPreview() action
  ↓
Store: previewMode = true
  ↓
LayerEditor: conditional render
  ↓
VideoPreviewPlayer displayed
  ↓
User interacts with video
  ↓
User closes preview
  ↓
stopPreview() action
  ↓
Store: previewMode = false
  ↓
Back to LayerEditor
```

## 📝 Notes d'Implémentation

### Mock vs Production

**Actuellement (Mock)**:
- Les vidéos générées sont des mocks
- Les URLs de prévisualisation sont des exemples
- Le service `videoGenerationService` simule la génération

**Pour la Production**:
1. Remplacer `videoGenerationService` par des appels API réels
2. Implémenter l'endpoint backend de génération vidéo
3. Gérer les véritables URLs de vidéos générées
4. Implémenter la génération par scène individuelle
5. Ajouter la gestion des erreurs réseau
6. Implémenter le système de notification (succès/échec)

### Améliorations Futures

1. **Cache des Prévisualisations**
   - Stocker les vidéos générées pour éviter les regénérations
   - Système de cache avec expiration

2. **Streaming Progressif**
   - Commencer la prévisualisation pendant la génération
   - Affichage de la progression frame by frame

3. **Édition Post-Génération**
   - Trim de la vidéo
   - Ajustement du volume audio
   - Ajout de transitions

4. **Export Avancé**
   - Sous-titres
   - Watermark
   - Templates de sortie (YouTube, Instagram, etc.)

5. **Prévisualisation en Temps Réel**
   - Preview de la scène courante sans génération complète
   - Rendu canvas en temps réel

## 🐛 Dépannage

### La prévisualisation ne s'affiche pas
- Vérifier que la génération est terminée (status: 'completed')
- Vérifier que `currentJob.videoUrl` existe
- Vérifier la console pour les erreurs JavaScript

### Le lecteur vidéo ne fonctionne pas
- Vérifier que l'URL de la vidéo est valide
- Vérifier le format de la vidéo (doit être supporté par le navigateur)
- Tester avec une autre URL de vidéo

### Les paramètres ne sont pas appliqués
- Vérifier que le hook `useVideoGeneration` reçoit bien les paramètres
- Vérifier que le service envoie les bons paramètres au backend

## 📚 Références

- **Radix UI**: https://www.radix-ui.com/
- **Zustand**: https://github.com/pmndrs/zustand
- **React Konva**: https://konvajs.org/docs/react/
- **HTML5 Video API**: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

## 🤝 Contribution

Pour contribuer à cette fonctionnalité:
1. Suivre les conventions de code existantes
2. Ajouter des tests pour les nouvelles fonctionnalités
3. Mettre à jour cette documentation
4. Créer une PR avec une description détaillée

## 📄 License

Voir LICENSE dans le répertoire racine du projet.
