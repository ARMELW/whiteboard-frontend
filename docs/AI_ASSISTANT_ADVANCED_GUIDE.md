# Assistant IA - Guide des Fonctionnalités Avancées

## 🎯 Vue d'ensemble

L'assistant IA a été considérablement amélioré pour offrir plus de contrôle, de transparence et de fonctionnalités avancées. Ce guide explique comment l'IA prend ses décisions et comment vous pouvez les influencer.

## ✨ Nouvelles Fonctionnalités

### 1. Import et Copier-Coller de Scénarios

**Emplacement:** Étape 1 - Bouton "Importer un scénario"

L'assistant offre maintenant deux façons d'importer des scénarios existants:

#### Option A: Copier-Coller
- Collez directement votre scénario dans la zone de texte
- Utilisez le bouton "Coller depuis presse-papiers" pour coller automatiquement
- Formats supportés: texte brut, markdown, scripts structurés

#### Option B: Import de Fichier
- Uploadez des fichiers TXT, MD ou JSON
- Le contenu est automatiquement extrait et analysé
- Prévisualisation du contenu importé

**Comment l'IA analyse votre scénario:**
- ✓ Détecte automatiquement la structure (scènes, sections)
- ✓ Identifie les mots-clés et concepts principaux
- ✓ Détermine le ton et le style appropriés
- ✓ Calcule le nombre optimal de scènes

### 2. Configuration Avancée

**Emplacement:** Étape 2 - Section "Paramètres Avancés"

#### 2.1 Stratégie de Placement des Images

L'IA peut positionner les images selon 4 stratégies:

| Stratégie | Description | Quand l'utiliser |
|-----------|-------------|------------------|
| **Automatique** | L'IA choisit la meilleure disposition | Recommandé dans la plupart des cas |
| **Centré** | Images centrées pour impact maximum | Présentations importantes, messages clés |
| **Grille** | Disposition organisée en grille | Comparaisons, listes, structures |
| **Dispersé** | Placement naturel et dynamique | Contenu créatif, storytelling |

**Détails techniques:**
- **Centré**: Position calculée à (canvasWidth/2, canvasHeight/2)
- **Grille**: Division intelligente en colonnes/lignes selon le nombre d'images
- **Dispersé**: Positions aléatoires dans une zone sécurisée (marges respectées)
- **Auto**: Algorithme adaptatif basé sur le nombre d'éléments et le contenu

#### 2.2 Équilibre Texte/Image

Contrôlez la proportion de texte vs images dans vos scènes:

- **Automatique**: L'IA analyse le contenu et décide (recommandé)
- **Priorité Texte (70/30)**: Plus de texte pour explications détaillées
- **Équilibré (50/50)**: Mix égal pour contenu mixte
- **Priorité Images (30/70)**: Plus d'images pour contenu visuel

**Comment l'IA décide (mode Auto):**
```
Si longueur_contenu / nombre_scènes > 50:
    → Mode texte prioritaire
Sinon si contient mots_clés_visuels:
    → Mode images prioritaire
Sinon:
    → Mode équilibré
```

#### 2.3 Nombre d'Images par Scène

- **Minimum**: 0-10 images (défaut: 1)
- **Maximum**: 1-10 images (défaut: 4)

**Algorithme de décision:**
```javascript
imageCount = random(min, max) + ajustement_selon_contenu

Ajustements:
- Scène d'introduction: -1 image (focus sur titre)
- Scène complexe: +1 image (support visuel)
- Scène de conclusion: -1 image (focus sur message)
```

#### 2.4 Taille des Images

- **Petite**: 400x300px - Pour scènes avec beaucoup d'éléments
- **Moyenne**: 600x450px - Standard, recommandé
- **Grande**: 800x600px - Pour images détaillées ou impactantes

#### 2.5 Calques de Texte

Activez pour ajouter du texte superposé aux images:
- Extrait automatiquement les mots-clés importants
- Positionne le texte selon la hiérarchie (titre haut, support bas)
- Améliore la compréhension et la rétention

### 3. Génération avec Transparence

**Emplacement:** Étape 3 - Génération

L'IA affiche maintenant ses décisions en temps réel:

#### Étapes de Génération

1. **Analyse du scénario** (2s)
   - Détection structure et thèmes
   - Classification du type de contenu

2. **Planification visuelle** (1.5s)
   - Calcul du nombre d'éléments
   - Choix de la stratégie de placement
   - Exemple: "Scénario éducatif détecté → 3-4 images par scène"

3. **Génération des images** (3s)
   - Création des illustrations doodle
   - Application du style choisi

4. **Positionnement intelligent** (1.5s)
   - Calcul des positions optimales
   - Exemple: "Disposition en grille pour optimiser lisibilité"

5. **Génération voix-off** (2.5s)
   - Synthèse vocale adaptée

6. **Assemblage des scènes** (1.5s)
   - Création de la timeline finale
   - Exemple: "Équilibre 60/40 texte/image selon densité"

### 4. Revue Détaillée des Décisions

**Emplacement:** Étape 4 - Aperçu du Projet

Pour chaque scène, l'IA expose:

#### Informations Principales
- 📸 Nombre d'images générées
- 📍 Raison du layout choisi
- 📝 Nombre de calques de texte

#### Détails de Positionnement (accordéon)

Pour chaque image:
```
Image 1:
  Position: (960, 540)
  Raison: "Centré pour impact maximum"
  
Image 2:
  Position: (1440, 540)
  Raison: "Placement droit pour équilibre"
```

Pour chaque texte:
```
Texte 1: "Introduction"
  Position: (960, 150)
  Raison: "Mot-clé principal en haut pour hiérarchie visuelle"
```

#### Hover sur Images
Survolez une image pour voir sa raison de positionnement dans une tooltip.

## 🔍 Comment l'IA Prend Ses Décisions

### Analyse de Contenu

```
1. Détection du Type
   - Éducatif: mots-clés (apprendre, leçon, tutoriel)
   - Marketing: mots-clés (vente, promotion, offre)
   - Présentation: mots-clés (présenter, démonstration)
   - Tutorial: structure étape par étape

2. Analyse de Complexité
   complexité = longueur_texte / nombre_scènes
   
   Si complexité > 50:
     → Plus de texte, moins d'images
   Sinon:
     → Plus d'images, animations simples
```

### Positionnement Intelligent

#### Algorithme Auto
```javascript
if (imageCount <= 2) {
  // Disposition horizontale simple
  positions = [gauche, droite]
} else if (imageCount <= 4) {
  // Grille 2x2
  positions = calculer_grille(2, 2)
} else {
  // Disposition circulaire
  positions = calculer_cercle(rayon=300)
}
```

#### Facteurs Pris en Compte
- Nombre d'éléments visuels
- Type de contenu (narratif vs didactique)
- Durée de la scène
- Hiérarchie des informations
- Flux de lecture naturel (gauche → droite, haut → bas)

### Choix de Style

#### Palette de Couleurs
```
Minimal → Monochrome + accents subtils
Détaillé → Palette riche (6+ couleurs)
Cartoon → Couleurs vives (saturation > 80%)
Sketch → Tons naturels (saturation < 50%)
Professionnel → Corporate (bleu, gris, blanc)
```

#### Typographie
```
Minimal → Helvetica Neue (clarté)
Détaillé → Georgia (élégance)
Cartoon → Comic Sans MS (ludique)
Sketch → Brush Script (manuscrit)
Professionnel → Arial (neutre)
```

## 💡 Conseils d'Utilisation

### Pour du Contenu Éducatif
```
✓ Utilisez "Priorité Images" (70%)
✓ Stratégie "Grille" pour clarté
✓ Min 2, Max 4 images par scène
✓ Activez les calques de texte
✓ Style "Professionnel" ou "Minimal"
```

### Pour du Marketing
```
✓ Utilisez "Équilibré" (50/50)
✓ Stratégie "Centré" pour impact
✓ Min 1, Max 3 images (focus message)
✓ Taille "Grande" pour impact
✓ Style "Cartoon" ou "Détaillé"
```

### Pour des Tutoriels
```
✓ Utilisez "Priorité Images" (60%)
✓ Stratégie "Grille" ou "Auto"
✓ Min 3, Max 5 images (étapes)
✓ Activez les calques de texte
✓ Style "Professionnel"
```

## 🚀 Exemples Pratiques

### Exemple 1: Vidéo Éducative

**Scénario:**
```
Introduction: Les bases de la photographie
Concepts: Ouverture, vitesse, ISO
Pratique: Comment régler votre appareil
Conclusion: Résumé des points clés
```

**Configuration IA:**
- Équilibre: Priorité Images (70%)
- Placement: Grille
- Images par scène: 3-4
- Taille: Moyenne
- Style: Professionnel

**Résultat:**
- Scène 1: 2 images (titre + icône appareil)
- Scène 2: 4 images (grille 2x2 pour 4 concepts)
- Scène 3: 3 images (étapes séquentielles)
- Scène 4: 2 images (résumé visuel)

### Exemple 2: Import de Script Existant

**Fichier importé (script.txt):**
```
# Marketing Digital en 5 Étapes

## 1. Définir votre audience
Identifiez qui sont vos clients idéaux...

## 2. Créer du contenu de valeur
Le contenu attire et engage...

## 3. Optimiser pour les moteurs
SEO et visibilité...

## 4. Promouvoir sur les réseaux
Amplifiez votre portée...

## 5. Analyser et ajuster
Mesurez vos résultats...
```

**Analyse IA:**
- Type détecté: Marketing + Tutorial
- Structure: 5 scènes (1 par section)
- Images suggérées: 3 par scène
- Placement: Grille (comparaison d'étapes)
- Texte: Titres extraits automatiquement

**Décisions par Scène:**
```
Scène 1 "Audience":
  - 3 images: personas, démographie, analytics
  - Layout: Grille 1x3 horizontale
  - Texte: "Définir", "Audience", "Clients"

Scène 2 "Contenu":
  - 3 images: blog, video, infographie
  - Layout: Centré
  - Texte: "Créer", "Valeur"
```

## 📊 Métriques et Performance

### Temps de Génération Typique
- Analyse: 2 secondes
- Planification: 1.5 secondes
- Images: 3 secondes
- Positionnement: 1.5 secondes
- Voix-off: 2.5 secondes
- Assemblage: 1.5 secondes
**Total: ~12 secondes** pour 5 scènes

### Limites Actuelles
- Maximum 10 scènes par projet
- Maximum 10 images par scène
- Durée scène: 5-60 secondes
- Fichiers import: < 1 MB

## 🔧 Mode Debug (Développeurs)

Pour voir tous les détails des décisions IA:

```javascript
// Dans la console du navigateur
const wizard = useWizardStore.getState();
console.log('Script:', wizard.generatedScript);
console.log('AI Decisions:', wizard.generatedScript.scenes.map(s => s.aiDecisions));
```

Chaque décision contient:
- `imageCount`: Nombre calculé
- `imagePositions`: Array de {x, y, reason}
- `textLayers`: Array de {content, position, reason}
- `styleChoices`: {colorScheme, fontChoice, layoutReason}

## 📚 Ressources Supplémentaires

- **Principes de Design**: Gestalt, hiérarchie visuelle, F-pattern
- **Algorithmes**: Grille responsive, placement circulaire, golden ratio
- **Psychologie**: Attention visuelle, charge cognitive, mémorisation

---

**Note**: Cette fonctionnalité utilise actuellement un mock AI service pour la démonstration. En production, elle se connecterait à une vraie API d'IA (OpenAI, Anthropic, etc.) pour générer du contenu réel.
