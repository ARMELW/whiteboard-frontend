# Backend Implementation Guide: Mini-Scenes Feature

## Vue d'ensemble

Ce document décrit l'implémentation backend nécessaire pour supporter la fonctionnalité de **mini-scènes** avec caméras et transitions dédiées. Cette fonctionnalité permet de diviser une scène principale en plusieurs mini-scènes, chacune avec sa propre caméra, sa durée, et ses transitions d'entrée et de sortie.

## Architecture Frontend (Pour Référence)

Le frontend a été implémenté avec les structures suivantes qui doivent être reflétées côté backend.

### Types TypeScript Définis

```typescript
// Énumérations pour les transitions
export enum TransitionType {
  NONE = 'none',
  FADE = 'fade',
  WIPE_LEFT = 'wipe_left',
  WIPE_RIGHT = 'wipe_right',
  WIPE_UP = 'wipe_up',
  WIPE_DOWN = 'wipe_down',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out',
  FADE_BLACK = 'fade_black',
  FADE_WHITE = 'fade_white',
  SLIDE_LEFT = 'slide_left',
  SLIDE_RIGHT = 'slide_right',
  SLIDE_UP = 'slide_up',
  SLIDE_DOWN = 'slide_down',
}

export enum TransitionEasing {
  LINEAR = 'linear',
  EASE_IN = 'ease_in',
  EASE_OUT = 'ease_out',
  EASE_IN_OUT = 'ease_in_out',
}

// Structure d'une transition
export interface MiniSceneTransition {
  type: TransitionType;
  duration: number; // en secondes
  easing: TransitionEasing;
  direction?: 'left' | 'right' | 'up' | 'down';
}

// Structure d'une mini-scène
export interface MiniScene {
  id: string;
  name: string;
  duration: number; // en secondes
  camera: Camera; // Caméra dédiée
  visibleLayerIds: string[]; // IDs des layers visibles
  transitionIn: MiniSceneTransition; // Transition d'entrée
  transitionOut: MiniSceneTransition; // Transition de sortie
  order: number; // Ordre dans la séquence
  startTime?: number; // Calculé automatiquement
  endTime?: number; // Calculé automatiquement
}

// La scène principale inclut maintenant un tableau de mini-scènes
export interface Scene {
  id: string;
  projectId: string;
  // ... autres propriétés existantes
  miniScenes?: MiniScene[]; // NOUVEAU
}
```

## Implémentation Backend

### 1. Modèles de Base de Données

#### Option A: Base de données relationnelle (PostgreSQL, MySQL)

```sql
-- Table pour les transitions de mini-scènes
CREATE TABLE mini_scene_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- TransitionType enum
    duration DECIMAL(5,2) NOT NULL DEFAULT 0.5,
    easing VARCHAR(50) NOT NULL DEFAULT 'ease_in_out',
    direction VARCHAR(10), -- 'left', 'right', 'up', 'down'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les mini-scènes
CREATE TABLE mini_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    duration DECIMAL(8,2) NOT NULL DEFAULT 5.0,
    camera_id UUID REFERENCES cameras(id) ON DELETE SET NULL,
    transition_in_id UUID REFERENCES mini_scene_transitions(id) ON DELETE SET NULL,
    transition_out_id UUID REFERENCES mini_scene_transitions(id) ON DELETE SET NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    start_time DECIMAL(8,2),
    end_time DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contrainte d'unicité pour éviter les doublons d'ordre
    UNIQUE(scene_id, order_index)
);

-- Index pour améliorer les performances
CREATE INDEX idx_mini_scenes_scene_id ON mini_scenes(scene_id);
CREATE INDEX idx_mini_scenes_order ON mini_scenes(scene_id, order_index);

-- Table de jointure pour les layers visibles dans chaque mini-scène
CREATE TABLE mini_scene_visible_layers (
    mini_scene_id UUID NOT NULL REFERENCES mini_scenes(id) ON DELETE CASCADE,
    layer_id UUID NOT NULL REFERENCES layers(id) ON DELETE CASCADE,
    PRIMARY KEY (mini_scene_id, layer_id)
);

-- Index pour les requêtes de layers
CREATE INDEX idx_mini_scene_layers ON mini_scene_visible_layers(mini_scene_id);
```

#### Option B: Base de données NoSQL (MongoDB)

```javascript
// Collection: scenes
{
  _id: ObjectId("..."),
  projectId: ObjectId("..."),
  title: "Scene principale",
  // ... autres champs existants
  
  // Nouveau champ: mini-scènes imbriquées
  miniScenes: [
    {
      id: "uuid-v4",
      name: "Mini-Scene 1",
      duration: 5.0,
      camera: {
        id: "camera-uuid",
        name: "Camera 1",
        position: { x: 0, y: 0 },
        zoom: 1.5,
        // ... autres propriétés de caméra
      },
      visibleLayerIds: ["layer-id-1", "layer-id-2"],
      transitionIn: {
        type: "fade",
        duration: 0.5,
        easing: "ease_in_out"
      },
      transitionOut: {
        type: "slide_left",
        duration: 0.8,
        easing: "ease_out"
      },
      order: 0,
      startTime: 0,
      endTime: 5.0
    },
    {
      id: "uuid-v4-2",
      name: "Mini-Scene 2",
      duration: 7.5,
      camera: {
        id: "camera-uuid-2",
        name: "Camera 2",
        position: { x: 100, y: 50 },
        zoom: 2.0
      },
      visibleLayerIds: ["layer-id-2", "layer-id-3"],
      transitionIn: {
        type: "slide_left",
        duration: 0.8,
        easing: "ease_in"
      },
      transitionOut: {
        type: "fade",
        duration: 0.5,
        easing: "ease_out"
      },
      order: 1,
      startTime: 5.0,
      endTime: 12.5
    }
  ]
}
```

### 2. API Endpoints

Voici les endpoints REST à implémenter pour gérer les mini-scènes.

#### 2.1 Récupérer les mini-scènes d'une scène

```http
GET /api/v1/scenes/{sceneId}/mini-scenes
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "mini-scene-uuid-1",
      "sceneId": "scene-uuid",
      "name": "Mini-Scene 1",
      "duration": 5.0,
      "camera": {
        "id": "camera-uuid",
        "name": "Camera 1",
        "position": { "x": 0, "y": 0 },
        "zoom": 1.5
      },
      "visibleLayerIds": ["layer-1", "layer-2"],
      "transitionIn": {
        "type": "fade",
        "duration": 0.5,
        "easing": "ease_in_out"
      },
      "transitionOut": {
        "type": "slide_left",
        "duration": 0.8,
        "easing": "ease_out"
      },
      "order": 0,
      "startTime": 0,
      "endTime": 5.0,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### 2.2 Créer une mini-scène

```http
POST /api/v1/scenes/{sceneId}/mini-scenes
Content-Type: application/json
```

**Requête:**
```json
{
  "name": "Mini-Scene 1",
  "duration": 5.0,
  "camera": {
    "name": "Camera 1",
    "position": { "x": 0, "y": 0 },
    "zoom": 1.5
  },
  "visibleLayerIds": ["layer-1", "layer-2"],
  "transitionIn": {
    "type": "fade",
    "duration": 0.5,
    "easing": "ease_in_out"
  },
  "transitionOut": {
    "type": "fade",
    "duration": 0.5,
    "easing": "ease_in_out"
  }
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "mini-scene-uuid-1",
    "sceneId": "scene-uuid",
    "name": "Mini-Scene 1",
    "duration": 5.0,
    "camera": {
      "id": "camera-uuid-generated",
      "name": "Camera 1",
      "position": { "x": 0, "y": 0 },
      "zoom": 1.5
    },
    "visibleLayerIds": ["layer-1", "layer-2"],
    "transitionIn": {
      "type": "fade",
      "duration": 0.5,
      "easing": "ease_in_out"
    },
    "transitionOut": {
      "type": "fade",
      "duration": 0.5,
      "easing": "ease_in_out"
    },
    "order": 0,
    "startTime": 0,
    "endTime": 5.0,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

#### 2.3 Mettre à jour une mini-scène

```http
PUT /api/v1/scenes/{sceneId}/mini-scenes/{miniSceneId}
Content-Type: application/json
```

**Requête:**
```json
{
  "name": "Mini-Scene 1 (modifiée)",
  "duration": 7.5,
  "camera": {
    "id": "camera-uuid",
    "name": "Camera 1 Updated",
    "position": { "x": 50, "y": 25 },
    "zoom": 2.0
  },
  "visibleLayerIds": ["layer-1", "layer-2", "layer-3"],
  "transitionIn": {
    "type": "slide_left",
    "duration": 0.8,
    "easing": "ease_in"
  },
  "transitionOut": {
    "type": "zoom_out",
    "duration": 1.0,
    "easing": "ease_out"
  }
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "mini-scene-uuid-1",
    "sceneId": "scene-uuid",
    "name": "Mini-Scene 1 (modifiée)",
    "duration": 7.5,
    "camera": {
      "id": "camera-uuid",
      "name": "Camera 1 Updated",
      "position": { "x": 50, "y": 25 },
      "zoom": 2.0
    },
    "visibleLayerIds": ["layer-1", "layer-2", "layer-3"],
    "transitionIn": {
      "type": "slide_left",
      "duration": 0.8,
      "easing": "ease_in"
    },
    "transitionOut": {
      "type": "zoom_out",
      "duration": 1.0,
      "easing": "ease_out"
    },
    "order": 0,
    "startTime": 0,
    "endTime": 7.5,
    "updatedAt": "2025-01-15T11:00:00Z"
  }
}
```

#### 2.4 Supprimer une mini-scène

```http
DELETE /api/v1/scenes/{sceneId}/mini-scenes/{miniSceneId}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Mini-scene deleted successfully"
}
```

#### 2.5 Réorganiser les mini-scènes

```http
PUT /api/v1/scenes/{sceneId}/mini-scenes/reorder
Content-Type: application/json
```

**Requête:**
```json
{
  "miniSceneIds": [
    "mini-scene-uuid-2",
    "mini-scene-uuid-1",
    "mini-scene-uuid-3"
  ]
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "mini-scene-uuid-2",
      "order": 0,
      "startTime": 0,
      "endTime": 7.5
    },
    {
      "id": "mini-scene-uuid-1",
      "order": 1,
      "startTime": 7.5,
      "endTime": 12.5
    },
    {
      "id": "mini-scene-uuid-3",
      "order": 2,
      "startTime": 12.5,
      "endTime": 18.0
    }
  ]
}
```

### 3. Logique Métier Importante

#### 3.1 Calcul automatique des startTime et endTime

Les `startTime` et `endTime` doivent être calculés automatiquement en fonction de l'ordre des mini-scènes:

```python
# Exemple en Python
def recalculate_mini_scene_times(mini_scenes):
    """
    Recalcule les startTime et endTime pour toutes les mini-scènes
    en fonction de leur ordre et durée
    """
    # Trier par ordre
    mini_scenes.sort(key=lambda ms: ms.order)
    
    current_time = 0.0
    
    for mini_scene in mini_scenes:
        mini_scene.start_time = current_time
        mini_scene.end_time = current_time + mini_scene.duration
        current_time = mini_scene.end_time
    
    return mini_scenes
```

```javascript
// Exemple en JavaScript/Node.js
function recalculateMiniSceneTimes(miniScenes) {
  // Trier par ordre
  miniScenes.sort((a, b) => a.order - b.order);
  
  let currentTime = 0;
  
  return miniScenes.map(miniScene => {
    const startTime = currentTime;
    const endTime = currentTime + miniScene.duration;
    currentTime = endTime;
    
    return {
      ...miniScene,
      startTime,
      endTime
    };
  });
}
```

#### 3.2 Validation des transitions

Valider que les types de transitions sont corrects:

```python
# Validation des types de transitions
VALID_TRANSITION_TYPES = [
    'none', 'fade', 'wipe_left', 'wipe_right', 'wipe_up', 'wipe_down',
    'zoom_in', 'zoom_out', 'fade_black', 'fade_white',
    'slide_left', 'slide_right', 'slide_up', 'slide_down'
]

VALID_EASING_TYPES = ['linear', 'ease_in', 'ease_out', 'ease_in_out']

def validate_transition(transition):
    if transition['type'] not in VALID_TRANSITION_TYPES:
        raise ValueError(f"Invalid transition type: {transition['type']}")
    
    if transition['easing'] not in VALID_EASING_TYPES:
        raise ValueError(f"Invalid easing type: {transition['easing']}")
    
    if transition['duration'] < 0:
        raise ValueError("Transition duration must be positive")
    
    return True
```

#### 3.3 Gestion de la caméra

Chaque mini-scène a sa propre caméra. Lors de la création d'une mini-scène:

1. Si une caméra existante est fournie (avec un `id`), l'utiliser
2. Sinon, créer une nouvelle caméra avec les paramètres fournis
3. Associer la caméra à la mini-scène

```python
def create_or_get_camera(camera_data, scene_id):
    """
    Crée une nouvelle caméra ou récupère une existante
    """
    if 'id' in camera_data and camera_data['id']:
        # Récupérer la caméra existante
        camera = Camera.query.get(camera_data['id'])
        if not camera:
            raise ValueError(f"Camera {camera_data['id']} not found")
        return camera
    else:
        # Créer une nouvelle caméra
        camera = Camera(
            scene_id=scene_id,
            name=camera_data.get('name', 'Camera'),
            position_x=camera_data.get('position', {}).get('x', 0),
            position_y=camera_data.get('position', {}).get('y', 0),
            zoom=camera_data.get('zoom', 1.0)
        )
        db.session.add(camera)
        db.session.flush()  # Pour obtenir l'ID
        return camera
```

### 4. Exemple d'Implémentation Complète (Python/Flask)

```python
from flask import Blueprint, request, jsonify
from models import Scene, MiniScene, Camera, MiniSceneTransition, db
from uuid import uuid4

mini_scenes_bp = Blueprint('mini_scenes', __name__)

@mini_scenes_bp.route('/api/v1/scenes/<scene_id>/mini-scenes', methods=['GET'])
def get_mini_scenes(scene_id):
    """Récupère toutes les mini-scènes d'une scène"""
    scene = Scene.query.get_or_404(scene_id)
    
    mini_scenes = MiniScene.query.filter_by(scene_id=scene_id)\
                                  .order_by(MiniScene.order_index)\
                                  .all()
    
    return jsonify({
        'success': True,
        'data': [ms.to_dict() for ms in mini_scenes]
    })

@mini_scenes_bp.route('/api/v1/scenes/<scene_id>/mini-scenes', methods=['POST'])
def create_mini_scene(scene_id):
    """Crée une nouvelle mini-scène"""
    scene = Scene.query.get_or_404(scene_id)
    data = request.get_json()
    
    # Valider les données
    if not data.get('name'):
        return jsonify({'success': False, 'error': 'Name is required'}), 400
    
    # Créer ou récupérer la caméra
    camera = create_or_get_camera(data.get('camera', {}), scene_id)
    
    # Créer les transitions
    transition_in = MiniSceneTransition(
        type=data['transitionIn']['type'],
        duration=data['transitionIn']['duration'],
        easing=data['transitionIn']['easing'],
        direction=data['transitionIn'].get('direction')
    )
    db.session.add(transition_in)
    
    transition_out = MiniSceneTransition(
        type=data['transitionOut']['type'],
        duration=data['transitionOut']['duration'],
        easing=data['transitionOut']['easing'],
        direction=data['transitionOut'].get('direction')
    )
    db.session.add(transition_out)
    
    db.session.flush()
    
    # Déterminer l'ordre
    max_order = db.session.query(db.func.max(MiniScene.order_index))\
                          .filter_by(scene_id=scene_id)\
                          .scalar() or -1
    
    # Créer la mini-scène
    mini_scene = MiniScene(
        id=str(uuid4()),
        scene_id=scene_id,
        name=data['name'],
        duration=data.get('duration', 5.0),
        camera_id=camera.id,
        transition_in_id=transition_in.id,
        transition_out_id=transition_out.id,
        order_index=max_order + 1
    )
    db.session.add(mini_scene)
    
    # Ajouter les layers visibles
    for layer_id in data.get('visibleLayerIds', []):
        mini_scene.visible_layers.append(Layer.query.get(layer_id))
    
    db.session.commit()
    
    # Recalculer les temps
    recalculate_times(scene_id)
    
    return jsonify({
        'success': True,
        'data': mini_scene.to_dict()
    }), 201

@mini_scenes_bp.route('/api/v1/scenes/<scene_id>/mini-scenes/<mini_scene_id>', 
                      methods=['PUT'])
def update_mini_scene(scene_id, mini_scene_id):
    """Met à jour une mini-scène"""
    mini_scene = MiniScene.query.filter_by(
        id=mini_scene_id, 
        scene_id=scene_id
    ).first_or_404()
    
    data = request.get_json()
    
    # Mettre à jour les champs
    if 'name' in data:
        mini_scene.name = data['name']
    
    if 'duration' in data:
        mini_scene.duration = data['duration']
    
    # Mettre à jour la caméra si fournie
    if 'camera' in data:
        camera = create_or_get_camera(data['camera'], scene_id)
        mini_scene.camera_id = camera.id
    
    # Mettre à jour les transitions
    if 'transitionIn' in data:
        mini_scene.transition_in.type = data['transitionIn']['type']
        mini_scene.transition_in.duration = data['transitionIn']['duration']
        mini_scene.transition_in.easing = data['transitionIn']['easing']
    
    if 'transitionOut' in data:
        mini_scene.transition_out.type = data['transitionOut']['type']
        mini_scene.transition_out.duration = data['transitionOut']['duration']
        mini_scene.transition_out.easing = data['transitionOut']['easing']
    
    # Mettre à jour les layers visibles
    if 'visibleLayerIds' in data:
        mini_scene.visible_layers = []
        for layer_id in data['visibleLayerIds']:
            layer = Layer.query.get(layer_id)
            if layer:
                mini_scene.visible_layers.append(layer)
    
    db.session.commit()
    
    # Recalculer les temps
    recalculate_times(scene_id)
    
    return jsonify({
        'success': True,
        'data': mini_scene.to_dict()
    })

@mini_scenes_bp.route('/api/v1/scenes/<scene_id>/mini-scenes/<mini_scene_id>', 
                      methods=['DELETE'])
def delete_mini_scene(scene_id, mini_scene_id):
    """Supprime une mini-scène"""
    mini_scene = MiniScene.query.filter_by(
        id=mini_scene_id, 
        scene_id=scene_id
    ).first_or_404()
    
    db.session.delete(mini_scene)
    db.session.commit()
    
    # Recalculer les temps et réorganiser les ordres
    recalculate_times(scene_id)
    
    return jsonify({
        'success': True,
        'message': 'Mini-scene deleted successfully'
    })

@mini_scenes_bp.route('/api/v1/scenes/<scene_id>/mini-scenes/reorder', 
                      methods=['PUT'])
def reorder_mini_scenes(scene_id):
    """Réorganise l'ordre des mini-scènes"""
    scene = Scene.query.get_or_404(scene_id)
    data = request.get_json()
    
    mini_scene_ids = data.get('miniSceneIds', [])
    
    # Mettre à jour l'ordre
    for index, mini_scene_id in enumerate(mini_scene_ids):
        mini_scene = MiniScene.query.filter_by(
            id=mini_scene_id,
            scene_id=scene_id
        ).first()
        
        if mini_scene:
            mini_scene.order_index = index
    
    db.session.commit()
    
    # Recalculer les temps
    mini_scenes = recalculate_times(scene_id)
    
    return jsonify({
        'success': True,
        'data': [ms.to_dict() for ms in mini_scenes]
    })

def recalculate_times(scene_id):
    """Recalcule les startTime et endTime de toutes les mini-scènes"""
    mini_scenes = MiniScene.query.filter_by(scene_id=scene_id)\
                                  .order_by(MiniScene.order_index)\
                                  .all()
    
    current_time = 0.0
    
    for mini_scene in mini_scenes:
        mini_scene.start_time = current_time
        mini_scene.end_time = current_time + mini_scene.duration
        current_time = mini_scene.end_time
    
    db.session.commit()
    return mini_scenes

def create_or_get_camera(camera_data, scene_id):
    """Crée une nouvelle caméra ou récupère une existante"""
    if camera_data.get('id'):
        camera = Camera.query.get(camera_data['id'])
        if not camera:
            raise ValueError(f"Camera {camera_data['id']} not found")
        
        # Mettre à jour les propriétés si nécessaire
        if 'name' in camera_data:
            camera.name = camera_data['name']
        if 'position' in camera_data:
            camera.position_x = camera_data['position'].get('x', camera.position_x)
            camera.position_y = camera_data['position'].get('y', camera.position_y)
        if 'zoom' in camera_data:
            camera.zoom = camera_data['zoom']
        
        return camera
    else:
        # Créer une nouvelle caméra
        camera = Camera(
            id=str(uuid4()),
            scene_id=scene_id,
            name=camera_data.get('name', 'Camera'),
            position_x=camera_data.get('position', {}).get('x', 0),
            position_y=camera_data.get('position', {}).get('y', 0),
            zoom=camera_data.get('zoom', 1.0)
        )
        db.session.add(camera)
        db.session.flush()
        return camera
```

### 5. Modèles de Données (Python/SQLAlchemy)

```python
from sqlalchemy import Column, String, Float, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from extensions import db
from datetime import datetime

# Table d'association pour les layers visibles
mini_scene_visible_layers = Table('mini_scene_visible_layers', db.Model.metadata,
    Column('mini_scene_id', String(36), ForeignKey('mini_scenes.id', ondelete='CASCADE')),
    Column('layer_id', String(36), ForeignKey('layers.id', ondelete='CASCADE'))
)

class MiniSceneTransition(db.Model):
    __tablename__ = 'mini_scene_transitions'
    
    id = Column(String(36), primary_key=True)
    type = Column(String(50), nullable=False)
    duration = Column(Float, nullable=False, default=0.5)
    easing = Column(String(50), nullable=False, default='ease_in_out')
    direction = Column(String(10), nullable=True)
    created_at = Column(db.DateTime, default=datetime.utcnow)
    updated_at = Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'type': self.type,
            'duration': self.duration,
            'easing': self.easing,
            'direction': self.direction
        }

class MiniScene(db.Model):
    __tablename__ = 'mini_scenes'
    
    id = Column(String(36), primary_key=True)
    scene_id = Column(String(36), ForeignKey('scenes.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(255), nullable=False)
    duration = Column(Float, nullable=False, default=5.0)
    camera_id = Column(String(36), ForeignKey('cameras.id', ondelete='SET NULL'))
    transition_in_id = Column(String(36), ForeignKey('mini_scene_transitions.id'))
    transition_out_id = Column(String(36), ForeignKey('mini_scene_transitions.id'))
    order_index = Column(Integer, nullable=False, default=0)
    start_time = Column(Float)
    end_time = Column(Float)
    created_at = Column(db.DateTime, default=datetime.utcnow)
    updated_at = Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    scene = relationship('Scene', back_populates='mini_scenes')
    camera = relationship('Camera')
    transition_in = relationship('MiniSceneTransition', foreign_keys=[transition_in_id])
    transition_out = relationship('MiniSceneTransition', foreign_keys=[transition_out_id])
    visible_layers = relationship('Layer', secondary=mini_scene_visible_layers)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sceneId': self.scene_id,
            'name': self.name,
            'duration': self.duration,
            'camera': self.camera.to_dict() if self.camera else None,
            'visibleLayerIds': [layer.id for layer in self.visible_layers],
            'transitionIn': self.transition_in.to_dict() if self.transition_in else None,
            'transitionOut': self.transition_out.to_dict() if self.transition_out else None,
            'order': self.order_index,
            'startTime': self.start_time,
            'endTime': self.end_time,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

# Ajouter à la classe Scene existante
class Scene(db.Model):
    # ... champs existants ...
    
    # Nouvelle relation
    mini_scenes = relationship('MiniScene', back_populates='scene', 
                               cascade='all, delete-orphan',
                               order_by='MiniScene.order_index')
    
    def to_dict(self):
        # ... dictionnaire existant ...
        result['miniScenes'] = [ms.to_dict() for ms in self.mini_scenes]
        return result
```

### 6. Génération Vidéo avec Mini-Scènes

Lors de la génération vidéo, le backend doit:

1. **Charger les mini-scènes** dans l'ordre
2. **Pour chaque mini-scène:**
   - Appliquer la transition d'entrée
   - Configurer la caméra
   - Afficher uniquement les layers visibles
   - Animer pendant la durée spécifiée
   - Appliquer la transition de sortie
3. **Enchaîner** automatiquement vers la mini-scène suivante

```python
def generate_video_with_mini_scenes(scene):
    """
    Génère une vidéo avec les mini-scènes
    """
    video_clips = []
    
    # Si pas de mini-scènes, comportement classique
    if not scene.mini_scenes:
        return generate_classic_video(scene)
    
    for mini_scene in scene.mini_scenes:
        # 1. Créer le clip de la mini-scène
        clip = create_mini_scene_clip(
            scene=scene,
            mini_scene=mini_scene,
            duration=mini_scene.duration
        )
        
        # 2. Appliquer la transition d'entrée
        if mini_scene.transition_in.type != 'none':
            clip = apply_transition_in(
                clip, 
                mini_scene.transition_in
            )
        
        # 3. Appliquer la transition de sortie
        if mini_scene.transition_out.type != 'none':
            clip = apply_transition_out(
                clip,
                mini_scene.transition_out
            )
        
        video_clips.append(clip)
    
    # Concatener tous les clips
    final_video = concatenate_videoclips(video_clips)
    
    return final_video

def create_mini_scene_clip(scene, mini_scene, duration):
    """
    Crée un clip pour une mini-scène spécifique
    """
    # Charger uniquement les layers visibles
    visible_layers = [
        layer for layer in scene.layers 
        if layer.id in mini_scene.visibleLayerIds
    ]
    
    # Appliquer la caméra de la mini-scène
    camera = mini_scene.camera
    
    # Créer le clip avec les layers et la caméra
    clip = render_layers_with_camera(
        layers=visible_layers,
        camera=camera,
        duration=duration,
        background=scene.backgroundImage
    )
    
    return clip

def apply_transition_in(clip, transition):
    """
    Applique une transition d'entrée
    """
    if transition.type == 'fade':
        return clip.fadein(transition.duration)
    
    elif transition.type == 'slide_left':
        return clip.slide_in(
            duration=transition.duration,
            direction='left'
        )
    
    elif transition.type == 'zoom_in':
        return clip.zoom_in(
            duration=transition.duration,
            easing=transition.easing
        )
    
    # ... autres transitions
    
    return clip

def apply_transition_out(clip, transition):
    """
    Applique une transition de sortie
    """
    if transition.type == 'fade':
        return clip.fadeout(transition.duration)
    
    elif transition.type == 'slide_right':
        return clip.slide_out(
            duration=transition.duration,
            direction='right'
        )
    
    elif transition.type == 'zoom_out':
        return clip.zoom_out(
            duration=transition.duration,
            easing=transition.easing
        )
    
    # ... autres transitions
    
    return clip
```

### 7. Tests et Validation

#### Tests unitaires recommandés:

```python
import unittest
from app import app, db
from models import Scene, MiniScene, Camera

class MiniSceneTestCase(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        db.create_all()
        
        # Créer une scène de test
        self.scene = Scene(id='test-scene-1', title='Test Scene')
        db.session.add(self.scene)
        db.session.commit()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()
    
    def test_create_mini_scene(self):
        """Test de création d'une mini-scène"""
        response = self.app.post(
            f'/api/v1/scenes/{self.scene.id}/mini-scenes',
            json={
                'name': 'Test Mini-Scene',
                'duration': 5.0,
                'camera': {
                    'name': 'Test Camera',
                    'position': {'x': 0, 'y': 0},
                    'zoom': 1.5
                },
                'visibleLayerIds': [],
                'transitionIn': {
                    'type': 'fade',
                    'duration': 0.5,
                    'easing': 'ease_in_out'
                },
                'transitionOut': {
                    'type': 'fade',
                    'duration': 0.5,
                    'easing': 'ease_in_out'
                }
            }
        )
        
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['name'], 'Test Mini-Scene')
    
    def test_reorder_mini_scenes(self):
        """Test de réorganisation des mini-scènes"""
        # Créer 3 mini-scènes
        ms1 = MiniScene(id='ms1', scene_id=self.scene.id, name='MS1', order_index=0)
        ms2 = MiniScene(id='ms2', scene_id=self.scene.id, name='MS2', order_index=1)
        ms3 = MiniScene(id='ms3', scene_id=self.scene.id, name='MS3', order_index=2)
        db.session.add_all([ms1, ms2, ms3])
        db.session.commit()
        
        # Réorganiser: 3, 1, 2
        response = self.app.put(
            f'/api/v1/scenes/{self.scene.id}/mini-scenes/reorder',
            json={'miniSceneIds': ['ms3', 'ms1', 'ms2']}
        )
        
        self.assertEqual(response.status_code, 200)
        
        # Vérifier l'ordre
        mini_scenes = MiniScene.query.filter_by(scene_id=self.scene.id)\
                                      .order_by(MiniScene.order_index)\
                                      .all()
        self.assertEqual(mini_scenes[0].id, 'ms3')
        self.assertEqual(mini_scenes[1].id, 'ms1')
        self.assertEqual(mini_scenes[2].id, 'ms2')
    
    def test_time_calculation(self):
        """Test du calcul automatique des temps"""
        # Créer 2 mini-scènes avec des durées différentes
        ms1 = MiniScene(
            id='ms1', 
            scene_id=self.scene.id, 
            name='MS1', 
            duration=5.0,
            order_index=0
        )
        ms2 = MiniScene(
            id='ms2', 
            scene_id=self.scene.id, 
            name='MS2', 
            duration=7.5,
            order_index=1
        )
        db.session.add_all([ms1, ms2])
        db.session.commit()
        
        # Recalculer les temps
        recalculate_times(self.scene.id)
        
        # Vérifier
        db.session.refresh(ms1)
        db.session.refresh(ms2)
        
        self.assertEqual(ms1.start_time, 0.0)
        self.assertEqual(ms1.end_time, 5.0)
        self.assertEqual(ms2.start_time, 5.0)
        self.assertEqual(ms2.end_time, 12.5)

if __name__ == '__main__':
    unittest.main()
```

### 8. Considérations de Performance

1. **Index de base de données**: Créer des index sur `scene_id` et `order_index`
2. **Pagination**: Pour les scènes avec beaucoup de mini-scènes
3. **Cache**: Mettre en cache les mini-scènes fréquemment consultées
4. **Lazy loading**: Charger les caméras et transitions uniquement si nécessaire

### 9. Checklist d'Implémentation

- [ ] Créer les tables de base de données
- [ ] Implémenter les modèles (ORM)
- [ ] Créer les endpoints API REST
- [ ] Implémenter la logique de calcul des temps
- [ ] Ajouter la validation des données
- [ ] Implémenter la gestion des caméras
- [ ] Intégrer dans le système de génération vidéo
- [ ] Écrire les tests unitaires
- [ ] Documenter l'API (Swagger/OpenAPI)
- [ ] Tester l'intégration avec le frontend

### 10. Ressources Complémentaires

- **Documentation API complète**: À générer avec Swagger/OpenAPI
- **Exemples de requêtes**: Voir Postman collection
- **Diagrammes**: Architecture et flux de données (à créer)

---

## Support et Questions

Pour toute question sur cette implémentation, contactez l'équipe de développement.

**Version**: 1.0  
**Date**: 2025-01-15  
**Auteur**: Équipe Frontend
