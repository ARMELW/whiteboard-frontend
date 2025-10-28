# Guide Multi-Caméra - Scènes Immenses

## Vue d'ensemble

Le système multi-caméra permet de créer des scènes de très grande taille (bien au-delà du format standard 1920x1080) et de définir plusieurs caméras indépendantes qui capturent différentes zones de la scène. Cette fonctionnalité est idéale pour :

- Créer des animations complexes avec différents points de vue
- Zoomer sur des détails spécifiques tout en gardant le contexte général
- Organiser des scènes avec plusieurs zones d'intérêt
- Créer des vidéos multi-angles

## Concepts Clés

### 1. Scène Immense

Une scène immense est une scène dont les dimensions dépassent le format standard 1920x1080. Vous pouvez configurer des scènes allant jusqu'à 10000x10000 pixels.

**Exemple de dimensions:**
- Standard: 1920 × 1080 (Full HD)
- Large: 3840 × 2160 (4K)
- Immense: 5000 × 3000 ou plus

### 2. Caméras Multiples

Chaque scène contient :
- **1 Caméra par défaut** : Non supprimable, centrée sur la scène, verrouillée par défaut
- **N Caméras personnalisées** : Ajoutables/supprimables, positionnables librement

Chaque caméra définit un "viewport" - une zone rectangulaire capturant une portion de la scène immense.

## Configuration d'une Scène Immense

### Étape 1: Définir les Dimensions de la Scène

1. Ouvrez le panneau **Propriétés de la Scène** (onglet de gauche)
2. Trouvez la section **"Dimensions de la scène (pixels)"**
3. Définissez les dimensions souhaitées :
   - **Largeur** : Minimum 1920, maximum 10000 pixels
   - **Hauteur** : Minimum 1080, maximum 10000 pixels
4. Les changements sont appliqués immédiatement

**Exemples de configurations :**

```
Scène panoramique ultra-large:
- Largeur: 6000px
- Hauteur: 1080px

Scène carrée géante:
- Largeur: 4000px
- Hauteur: 4000px

Scène verticale (mobile):
- Largeur: 1080px
- Hauteur: 3000px
```

### Étape 2: Ajouter des Objets

1. Ajoutez vos layers (images, textes, formes) normalement
2. Les objets peuvent être positionnés n'importe où dans la scène immense
3. Utilisez les contrôles de zoom dans le header pour naviguer

## Utilisation des Caméras Multiples

### Contrôles dans le Header

Le header de l'éditeur contient tous les contrôles de caméra :

```
[Caméra Sélecteur ▼] [X caméras] [+ Caméra] [Gérer] [- Zoom +] [Verrouillé/Déverrouillé]
```

- **Sélecteur de caméra** : Liste déroulante de toutes les caméras
- **Badge de compteur** : Affiche le nombre de caméras personnalisées
- **+ Caméra** : Ajoute une nouvelle caméra
- **Gérer** : Ouvre le gestionnaire de caméras
- **Zoom** : Contrôle le zoom de la vue d'édition (pas de la caméra)
- **Verrouillé/Déverrouillé** : Verrouille/déverrouille la caméra sélectionnée

### Ajouter une Caméra

1. Cliquez sur le bouton **"+ Caméra"** dans le header
2. Une nouvelle caméra apparaît sur le canvas, centrée par défaut
3. La caméra est automatiquement nommée "Camera 1", "Camera 2", etc.
4. Elle est sélectionnée automatiquement

### Positionner une Caméra

1. **Sélectionnez** la caméra en cliquant dessus ou via le sélecteur du header
2. **Déplacez** la caméra en la glissant avec la souris
3. **Redimensionnez** la caméra en utilisant les poignées aux coins
   - Le ratio est maintenu automatiquement
   - La taille minimale est de 100x100 pixels
4. **Ajustez le zoom** via le gestionnaire de caméras

**Indicateurs visuels :**
- Caméra sélectionnée : Bordure rose foncé (#ec4899)
- Caméra non sélectionnée : Bordure rose clair (#f9a8d4)
- Caméra verrouillée : Bordure continue
- Caméra déverrouillée : Bordure en pointillés
- Libellé : Le nom de la caméra s'affiche en haut à gauche

### Verrouiller une Caméra

Le verrouillage empêche toute modification accidentelle de position/taille.

1. Sélectionnez la caméra
2. Cliquez sur le bouton **"Verrouillé/Déverrouillé"** dans le header
3. Une caméra verrouillée ne peut pas être déplacée ou redimensionnée

> **Note:** La caméra par défaut est toujours verrouillée et ne peut pas être modifiée.

## Gestionnaire de Caméras

Le gestionnaire offre une vue d'ensemble et des contrôles avancés.

### Ouvrir le Gestionnaire

Cliquez sur le bouton **"Gérer"** dans le header.

### Fonctionnalités du Gestionnaire

Pour chaque caméra, vous pouvez voir et modifier :

**Informations affichées :**
- Nom de la caméra
- Dimensions (largeur × hauteur en pixels)
- Position X (pourcentage de la largeur de la scène)
- Position Y (pourcentage de la hauteur de la scène)
- Niveau de zoom

**Actions disponibles :**
- **Modifier le nom** : Cliquez dans le champ "Nom de la caméra"
- **Ajuster le zoom** : Valeur entre 0.1 et 3.0
- **Archiver** : Masque temporairement la caméra (restaurable)
- **Supprimer** : Suppression définitive (avec confirmation)

> **Important:** La caméra par défaut ne peut pas être archivée ou supprimée.

## Cas d'Usage Pratiques

### Cas 1: Animation avec Zoom Progressif

**Objectif:** Commencer avec une vue large, puis zoomer sur un détail.

1. Créez une scène de 4000 × 3000 pixels
2. Ajoutez tous vos éléments sur la scène
3. Gardez la caméra par défaut pour la vue large (couvre toute la scène)
4. Ajoutez "Camera 1" et positionnez-la sur une zone spécifique
5. Réduisez sa taille pour créer un effet de zoom
6. Utilisez l'animation de transition entre caméras dans la timeline

### Cas 2: Multi-Angles d'un Même Sujet

**Objectif:** Montrer le même sujet sous différents angles.

1. Créez une scène de 5000 × 2000 pixels
2. Placez votre sujet principal au centre
3. Ajoutez "Camera 1" cadrant le sujet de face
4. Ajoutez "Camera 2" cadrant le sujet en plongée
5. Ajoutez "Camera 3" cadrant un détail du sujet
6. Alternez entre les caméras dans votre animation

### Cas 3: Storytelling Multi-Scènes

**Objectif:** Plusieurs mini-scènes dans une grande scène.

1. Créez une scène de 6000 × 2000 pixels
2. Divisez mentalement en 3 zones de 2000 × 2000 pixels
3. Zone 1: Scène d'introduction
4. Zone 2: Scène d'action
5. Zone 3: Scène de conclusion
6. Créez une caméra pour chaque zone
7. Déplacez la caméra active selon votre narration

## Conseils et Bonnes Pratiques

### Performance

- **Taille raisonnable:** Bien que 10000 × 10000 soit possible, restez sous 6000 × 6000 pour de meilleures performances
- **Nombre de caméras:** Limitez-vous à 5-6 caméras actives maximum par scène
- **Résolution des assets:** Adaptez la résolution de vos images à la taille de la scène

### Organisation

- **Nommage:** Donnez des noms explicites à vos caméras ("Vue Principale", "Zoom Détail", etc.)
- **Verrouillage:** Verrouillez les caméras finalisées pour éviter les modifications accidentelles
- **Archivage:** Archivez les caméras de test plutôt que de les supprimer

### Workflow

1. **Planification:** Esquissez votre scène et les positions de caméras avant de commencer
2. **Construction:** Créez d'abord la scène avec tous les éléments
3. **Cadrage:** Ajoutez et positionnez ensuite les caméras
4. **Animation:** Configurez les transitions et animations de caméra
5. **Finalisation:** Vérifiez chaque vue de caméra et ajustez si nécessaire

## Limitations Connues

- Les dimensions minimales de scène sont 1920 × 1080 pixels
- Les dimensions maximales de scène sont 10000 × 10000 pixels
- La caméra par défaut ne peut pas être supprimée ou déverrouillée
- Le ratio des caméras est maintenu lors du redimensionnement
- Les caméras doivent faire au minimum 100 × 100 pixels

## Support et Questions

Pour toute question ou problème technique, consultez :
- La documentation générale du projet
- Les issues GitHub du projet
- L'équipe de développement

## Exemples Vidéo

*(À venir)*

---

**Version:** 1.0  
**Dernière mise à jour:** Octobre 2025  
**Contributeurs:** Équipe Whiteboard Animation
