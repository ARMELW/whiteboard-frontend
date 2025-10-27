# MVP - Tâches Frontend Restantes

**Date:** 2025-10-23  
**Projet:** Whiteboard Frontend  
**Contexte:** La génération de vidéo doodle se fait côté backend

---

## 📋 Vue d'Ensemble

Ce document liste toutes les tâches frontend restantes pour compléter le MVP de l'application Whiteboard. Le backend gère déjà la génération des vidéos doodle, ce document se concentre uniquement sur les fonctionnalités frontend.

---

## 🎯 Statut Actuel

### ✅ Fonctionnalités Déjà Implémentées

- [x] Gestion multi-scènes avec panneau latéral
- [x] Éditeur de scènes (propriétés, durée, animations)
- [x] Animation HandWriting avec mode JSON
- [x] Timeline basique avec contrôles de lecture
- [x] Export de couches depuis JSON (PNG haute qualité)
- [x] Créateur de miniatures YouTube (1280x720)
- [x] Gestionnaire d'assets avec catégorisation par tags
- [x] Éditeur Konva pour manipulation d'objets
- [x] Système de caméra avec viewports
- [x] Formes géométriques (cercle, rectangle, triangle, étoile, etc.)
- [x] Gestion de texte avec styles et animations
- [x] Import/Export JSON de configurations
- [x] Persistance localStorage
- [x] Interface responsive avec Tailwind CSS

---

## 🔴 PRIORITÉ CRITIQUE - MVP Bloqueurs

### 1. Intégration Backend pour Génération Vidéo

**Statut:** ❌ Non implémenté  
**Effort estimé:** 5-7 jours  
**Description:** Créer l'interface frontend pour soumettre les projets au backend et récupérer les vidéos générées.

#### Tâches détaillées:
- [ ] Créer service API pour communication backend
  - [ ] Endpoint pour soumettre projet (scenes + config)
  - [ ] Endpoint pour vérifier statut de génération
  - [ ] Endpoint pour télécharger vidéo générée
  - [ ] Gestion des erreurs et timeouts
  
- [ ] Créer composant `VideoGenerationPanel`
  - [ ] Bouton "Générer Vidéo" principal
  - [ ] Sélection des paramètres de génération
    - [ ] Format (MP4, WebM, etc.)
    - [ ] Qualité (HD, Full HD, 4K)
    - [ ] FPS (24, 30, 60)
    - [ ] Durée totale calculée
  - [ ] Barre de progression de génération
  - [ ] État: En attente / En cours / Complété / Erreur
  
- [ ] Implémenter queue de génération
  - [ ] Liste des projets en génération
  - [ ] Historique des vidéos générées
  - [ ] Option pour annuler génération en cours
  
- [ ] Prévisualisation et téléchargement
  - [ ] Player vidéo pour preview
  - [ ] Bouton téléchargement vidéo finale
  - [ ] Métadonnées (taille, durée, format)
  - [ ] Option de partage (lien temporaire)

**Fichiers à créer:**
```
src/services/api/videoGenerationService.ts
src/components/organisms/VideoGenerationPanel.tsx
src/components/molecules/GenerationProgress.tsx
src/components/molecules/VideoPreview.tsx
src/hooks/useVideoGeneration.ts
```

**API Endpoints nécessaires (backend):**
```typescript
POST   /api/v1/video/generate
GET    /api/v1/video/status/:jobId
GET    /api/v1/video/download/:jobId
DELETE /api/v1/video/cancel/:jobId
GET    /api/v1/video/history
```

---

### 2. Gestionnaire Audio Complet

**Statut:** ⚠️ Partiellement implémenté (UI existe mais non fonctionnel)  
**Effort estimé:** 7-10 jours  
**Description:** Finaliser l'intégration audio complète avec synchronisation backend.

#### Tâches détaillées:
- [ ] Finaliser `AudioManager` component
  - [ ] Upload fichiers audio vers backend
  - [ ] Gestion bibliothèque audio (musiques, effets, voix-off)
  - [ ] Prévisualisation audio dans le navigateur
  - [ ] Découpage/trim audio
  
- [ ] Synchronisation audio-vidéo
  - [ ] Mapping audio avec timeline scènes
  - [ ] Points de synchronisation (markers)
  - [ ] Fade in/out par scène
  - [ ] Volume par scène et global
  
- [ ] Intégration avec génération vidéo
  - [ ] Envoi fichiers audio au backend
  - [ ] Gestion formats audio (MP3, WAV, OGG)
  - [ ] Compression audio si nécessaire
  
- [ ] Bibliothèque d'assets audio
  - [ ] Catégorisation (musique, effets, voix)
  - [ ] Tags et recherche
  - [ ] Favoris
  - [ ] Preview avant ajout

**Fichiers à modifier/créer:**
```
src/components/organisms/AudioManager.tsx (améliorer)
src/services/api/audioService.ts (nouveau)
src/hooks/useAudioSync.ts (nouveau)
src/utils/audioProcessor.ts (nouveau)
```

---

### 3. Timeline Avancée avec Keyframes

**Statut:** ⚠️ Timeline basique existe  
**Effort estimé:** 8-10 jours  
**Description:** Améliorer la timeline pour supporter keyframes et animations complexes.

#### Tâches détaillées:
- [ ] Système de keyframes
  - [ ] Ajout/suppression de keyframes visuellement
  - [ ] Interpolation entre keyframes
  - [ ] Courbes d'easing (linear, ease-in, ease-out, etc.)
  - [ ] Timeline multi-pistes (par layer)
  
- [ ] Markers et sync points
  - [ ] Markers temporels nommés
  - [ ] Sync points audio
  - [ ] Zones de répétition (loops)
  
- [ ] Contrôles avancés
  - [ ] Zoom timeline (granularité)
  - [ ] Snap to grid
  - [ ] Selection multiple de keyframes
  - [ ] Copy/paste keyframes
  - [ ] Ajustement durée par drag
  
- [ ] Preview temps réel
  - [ ] Scrubbing fluide
  - [ ] Playback avec audio
  - [ ] Frame-by-frame navigation

**Fichiers à créer/modifier:**
```
src/components/organisms/AdvancedTimeline.tsx (nouveau)
src/components/molecules/KeyframeEditor.tsx (nouveau)
src/components/molecules/TimelineMarkers.tsx (nouveau)
src/utils/keyframeInterpolator.ts (nouveau)
src/utils/easingFunctions.ts (améliorer existant)
```

---

## 🟡 PRIORITÉ HAUTE - Fonctionnalités Importantes

### 4. Animations de Texte Avancées

**Statut:** ⚠️ Texte basique existe  
**Effort estimé:** 4-6 jours  
**Description:** Ajouter des animations de texte character-by-character et word-by-word.

#### Tâches:
- [ ] Character-by-character reveal
  - [ ] Fade in par caractère
  - [ ] Type writer effect avec timing
  - [ ] Sons de machine à écrire (optionnel)
  
- [ ] Word-by-word animations
  - [ ] Apparition mot par mot
  - [ ] Animations scale/bounce par mot
  
- [ ] Text effects avancés
  - [ ] Glow effect
  - [ ] Multi-color gradient text
  - [ ] Animated underline
  - [ ] Highlight effect
  
- [ ] Text along path
  - [ ] Texte qui suit une courbe
  - [ ] Animation le long du path

**Fichiers:**
```
src/components/molecules/TextAnimationEditor.tsx (améliorer)
src/utils/textAnimation.ts (améliorer)
src/utils/textEffects.ts (nouveau)
```

---

### 5. Système de Particules

**Statut:** ⚠️ Existe partiellement  
**Effort estimé:** 4-6 jours  
**Description:** Finaliser et intégrer le système de particules.

#### Tâches:
- [ ] Finaliser `ParticleSystem` component
  - [ ] Confettis
  - [ ] Étincelles
  - [ ] Fumée
  - [ ] Explosion
  - [ ] Effet magique
  
- [ ] Éditeur de particules
  - [ ] Paramètres personnalisables
  - [ ] Preview en temps réel
  - [ ] Presets sauvegardables
  
- [ ] Intégration timeline
  - [ ] Déclenchement à un temps précis
  - [ ] Durée d'effet
  - [ ] Répétition

**Fichiers:**
```
src/components/ParticleSystem.tsx (finaliser)
src/components/molecules/ParticleEditor.tsx (nouveau)
src/utils/particleEngine.ts (améliorer)
src/utils/particlePresets.ts (améliorer)
```

---

### 6. Gestion Avancée des Layers

**Statut:** ⚠️ Basique existe  
**Effort estimé:** 3-5 jours  
**Description:** Améliorer la gestion des layers avec groupes et effets.

#### Tâches:
- [ ] Hiérarchie de layers
  - [ ] Groupes de layers
  - [ ] Dossiers/organisation
  - [ ] Parent-child relationships
  
- [ ] Effets par layer
  - [ ] Blur
  - [ ] Brightness/Contrast
  - [ ] Saturation
  - [ ] Filtres couleur
  
- [ ] Masques et blending
  - [ ] Alpha masks
  - [ ] Blend modes (multiply, screen, etc.)
  
- [ ] Lock et visibilité
  - [ ] Lock layer (non modifiable)
  - [ ] Hide/show layer
  - [ ] Solo mode

**Fichiers:**
```
src/components/organisms/LayerEditor.tsx (améliorer)
src/components/molecules/LayerEffects.tsx (nouveau)
src/components/molecules/LayerHierarchy.tsx (nouveau)
```

---

### 7. Système de Templates/Presets

**Statut:** ❌ Non implémenté  
**Effort estimé:** 3-4 jours  
**Description:** Créer un système de templates réutilisables.

#### Tâches:
- [ ] Bibliothèque de templates
  - [ ] Templates de scènes complètes
  - [ ] Templates de layouts
  - [ ] Templates d'animations
  
- [ ] Sauvegarde personnalisée
  - [ ] Sauvegarder scène comme template
  - [ ] Sauvegarder animation comme preset
  - [ ] Export/import templates
  
- [ ] Catégorisation
  - [ ] Par type (éducatif, marketing, etc.)
  - [ ] Par style
  - [ ] Tags et recherche
  
- [ ] Preview templates
  - [ ] Thumbnails
  - [ ] Aperçu animation
  - [ ] Métadonnées (durée, layers, etc.)

**Fichiers:**
```
src/components/organisms/TemplateLibrary.tsx (nouveau)
src/components/molecules/TemplateCard.tsx (nouveau)
src/services/storage/templateStorage.ts (nouveau)
```

---

## 🟢 PRIORITÉ MOYENNE - Améliorations UX

### 8. Undo/Redo Système

**Statut:** ❌ Non implémenté  
**Effort estimé:** 3-4 jours  
**Description:** Implémenter système complet d'historique.

#### Tâches:
- [ ] History manager
  - [ ] Stack d'actions
  - [ ] Limite d'historique (ex: 50 actions)
  
- [ ] Actions supportées
  - [ ] Modifications de layers
  - [ ] Ajout/suppression objets
  - [ ] Changements propriétés
  - [ ] Keyframes
  
- [ ] UI Controls
  - [ ] Boutons Undo/Redo
  - [ ] Raccourcis clavier (Ctrl+Z, Ctrl+Y)
  - [ ] Panneau historique visuel (optionnel)

**Fichiers:**
```
src/hooks/useHistory.ts (améliorer existant)
src/utils/historyManager.ts (nouveau)
```

---

### 9. Amélioration Export/Import

**Statut:** ⚠️ JSON import/export basique existe  
**Effort estimé:** 2-3 jours  
**Description:** Améliorer système export/import pour MVP.

#### Tâches:
- [ ] Export projet complet
  - [ ] Toutes les scènes + assets
  - [ ] Audio inclus (base64 ou références)
  - [ ] Format .wbanim (JSON compressé)
  
- [ ] Import projet
  - [ ] Validation du format
  - [ ] Gestion assets manquants
  - [ ] Migration versions anciennes
  
- [ ] Export formats additionnels
  - [ ] PNG séquence (déjà partiellement fait)
  - [ ] GIF animé (via backend)
  - [ ] WebM (via backend)

**Fichiers:**
```
src/utils/exportFormats.ts (améliorer)
src/services/storage/projectStorage.ts (nouveau)
```

---

### 10. Optimisation Performance

**Statut:** ⚠️ Besoin optimisations  
**Effort estimé:** 4-5 jours  
**Description:** Optimiser performances pour projets complexes.

#### Tâches:
- [ ] Lazy loading
  - [ ] Chargement différé des assets
  - [ ] Virtual scrolling pour grandes listes
  
- [ ] Memoization
  - [ ] Composants React.memo
  - [ ] useMemo pour calculs lourds
  - [ ] useCallback pour callbacks
  
- [ ] Canvas optimization
  - [ ] Render only visible layers
  - [ ] Debounce/throttle updates
  - [ ] WebGL acceleration si possible
  
- [ ] Asset caching
  - [ ] Cache images dans IndexedDB
  - [ ] Compression assets
  - [ ] Cleanup assets inutilisés

**Fichiers:**
```
src/utils/performanceOptimizer.ts (nouveau)
src/hooks/useVirtualScroll.ts (nouveau)
src/services/storage/assetCache.ts (nouveau)
```

---

### 11. Gestion des Erreurs et Validation

**Statut:** ⚠️ Basique  
**Effort estimé:** 2-3 jours  
**Description:** Améliorer feedback utilisateur et gestion erreurs.

#### Tâches:
- [ ] Validation formulaires
  - [ ] Messages d'erreur clairs
  - [ ] Validation temps réel
  - [ ] Indicateurs visuels
  
- [ ] Error boundaries
  - [ ] Catch erreurs React
  - [ ] Fallback UI élégant
  - [ ] Rapport d'erreurs (optionnel)
  
- [ ] Toast notifications
  - [ ] Succès
  - [ ] Erreurs
  - [ ] Warnings
  - [ ] Info
  
- [ ] Loading states
  - [ ] Skeletons
  - [ ] Spinners appropriés
  - [ ] Progress indicators

**Fichiers:**
```
src/components/molecules/ErrorBoundary.tsx (nouveau)
src/components/atoms/Toast.tsx (améliorer si existe)
src/utils/validation.ts (nouveau)
```

---

## 🔵 PRIORITÉ BASSE - Nice to Have

### 12. Mode Collaboratif (Phase 2)

**Statut:** ❌ Non implémenté  
**Effort estimé:** 10-15 jours  
**Description:** Permettre édition collaborative en temps réel.

#### Tâches:
- [ ] WebSocket connection
- [ ] Synchronisation état
- [ ] Curseurs utilisateurs
- [ ] Locks sur objets édités
- [ ] Chat intégré (optionnel)

---

### 13. Export vers Réseaux Sociaux

**Statut:** ❌ Non implémenté  
**Effort estimé:** 3-4 jours  
**Description:** Export direct vers YouTube, Facebook, etc.

#### Tâches:
- [ ] Intégrations API
  - [ ] YouTube API
  - [ ] Facebook API
  - [ ] TikTok API (si disponible)
  
- [ ] Upload direct
  - [ ] Authentification OAuth
  - [ ] Métadonnées (titre, description, tags)
  - [ ] Thumbnails automatiques

---

### 14. Analytics et Insights

**Statut:** ❌ Non implémenté  
**Effort estimé:** 2-3 jours  
**Description:** Statistiques d'utilisation et insights.

#### Tâches:
- [ ] Tracking événements
  - [ ] Créations projets
  - [ ] Exports vidéos
  - [ ] Features utilisées
  
- [ ] Dashboard analytics
  - [ ] Temps passé par projet
  - [ ] Features populaires
  - [ ] Taux de complétion

---

## 📊 Résumé et Priorisation

### Estimation Globale

| Priorité | Fonctionnalités | Effort Total | % du MVP |
|-----------|----------------|--------------|----------|
| 🔴 Critique | 3 features | 20-27 jours | 60% |
| 🟡 Haute | 4 features | 14-21 jours | 30% |
| 🟢 Moyenne | 4 features | 13-17 jours | 8% |
| 🔵 Basse | 3 features | 15-22 jours | 2% |
| **TOTAL MVP** | **7-11 features** | **47-65 jours** | **100%** |

### Timeline Recommandé

#### Sprint 1 (3 semaines) - MVP Core
- Intégration backend génération vidéo (bloqueur)
- Gestionnaire audio complet
- Timeline avancée avec keyframes

**Résultat:** MVP fonctionnel de base

#### Sprint 2 (2-3 semaines) - MVP Polish
- Animations texte avancées
- Système particules finalisé
- Gestion layers améliorée
- Templates/presets

**Résultat:** MVP riche en fonctionnalités

#### Sprint 3 (1-2 semaines) - MVP Final
- Undo/redo
- Export/import amélioré
- Optimisation performance
- Gestion erreurs

**Résultat:** MVP production-ready

---

## 🎯 Checklist Avant Release MVP

### Fonctionnel
- [ ] Génération vidéo backend fonctionne end-to-end
- [ ] Audio synchronisé avec vidéo
- [ ] Export réussi dans tous les formats
- [ ] Templates de base disponibles
- [ ] Performance acceptable (<3s pour charger projet)

### Qualité
- [ ] Pas de bugs critiques
- [ ] Messages d'erreur clairs
- [ ] Loading states partout
- [ ] Responsive sur desktop (mobile optionnel)
- [ ] Tests manuels complets

### Documentation
- [ ] Guide utilisateur de base
- [ ] Documentation API backend
- [ ] README à jour
- [ ] Vidéo démo

### Déploiement
- [ ] Build production optimisé
- [ ] Variables d'environnement configurées
- [ ] Backend accessible et stable
- [ ] Monitoring basique en place

---

## 📞 Prochaines Étapes

1. **Validation des priorités** avec l'équipe
2. **Estimation détaillée** par développeur
3. **Sprint planning** pour Sprint 1
4. **Kickoff** développement MVP

---

## 🔗 Références

- [README.md](./README.md) - Vue d'ensemble projet
- [INTEGRATION_ANALYSIS.md](./docs/INTEGRATION_ANALYSIS.md) - Analyse complète features
- [COMPTE_RENDU.md](./docs/COMPTE_RENDU.md) - Compte-rendu intégration
- [FEATURES_GUIDE.md](./docs/FEATURES_GUIDE.md) - Guide fonctionnalités existantes

---

**Dernière mise à jour:** 2025-10-23  
**Statut:** 📋 Liste complète pour MVP  
**Prêt pour:** Sprint planning
