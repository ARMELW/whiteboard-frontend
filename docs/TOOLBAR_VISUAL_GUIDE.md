# Visual Feature Guide: Toolbar Actions

## Double-Click Text Editing

### Before Double-Click
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│         [Selected Text Layer]           │  ← User double-clicks
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### After Double-Click
```
┌───────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────┐ │
│  │                                             │ │
│  │  Modifier le texte                          │ │
│  │  ┌───────────────────────────────────────┐ │ │
│  │  │                                       │ │ │
│  │  │  [Editable Textarea]                  │ │ │
│  │  │  Styled with layer font/size/color    │ │ │
│  │  │                                       │ │ │
│  │  └───────────────────────────────────────┘ │ │
│  │                                             │ │
│  │         [Annuler]  [Valider]                │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
```

## Floating Toolbar for Text Layer

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│  [A 48] | [🎨] | [⬅] [⬌] [➡] | [B] [I] | [👁 ▬▬●▬] | [↻ 45°] │
│  Font    Color  Alignment    Style    Opacity   Rotation     │
└──────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│                                         │
│         [Selected Text Layer]           │
│                                         │
└─────────────────────────────────────────┘
```

### Text Controls Detail
```
┌───────────────┬─────────────┬──────────────────┬────────────┬──────────────┬─────────────┐
│   Font Size   │   Color     │   Alignment      │   Style    │   Opacity    │  Rotation   │
├───────────────┼─────────────┼──────────────────┼────────────┼──────────────┼─────────────┤
│  [Type] [48▼] │  [🎨] [■]   │  [⬅] [⬌] [➡]    │  [B] [I]   │  [👁] [80%]  │  [↻] [45°]  │
│               │             │                  │            │              │             │
│  Number input │  Color      │  Toggle buttons  │  Toggle    │  Range       │  Number     │
│  12-120       │  picker     │  Left/Ctr/Right  │  Bold/Ital │  slider      │  input      │
└───────────────┴─────────────┴──────────────────┴────────────┴──────────────┴─────────────┘
```

## Floating Toolbar for Image Layer

### Layout
```
┌──────────────────────────────────────────────────────┐
│  [⛶ ▬▬●▬ 1.5x] | [👁 ▬▬●▬ 100%] | [↻ 0°]            │
│   Scale           Opacity         Rotation           │
└──────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│                                         │
│         [Selected Image Layer]          │
│                                         │
└─────────────────────────────────────────┘
```

### Image Controls Detail
```
┌────────────────────┬──────────────────┬─────────────┐
│      Scale         │    Opacity       │  Rotation   │
├────────────────────┼──────────────────┼─────────────┤
│  [⛶] [▬▬●▬] [1.5x] │  [👁] [▬▬●▬] 80% │  [↻] [45°]  │
│                    │                  │             │
│  Range slider      │  Range slider    │  Number     │
│  0.1x - 3.0x       │  0% - 100%       │  input      │
└────────────────────┴──────────────────┴─────────────┘
```

## User Interaction Flow

### Scenario 1: Edit Text via Double-Click
```
1. User sees text layer
   ┌─────────────┐
   │ Hello World │
   └─────────────┘

2. User double-clicks
   ▼ (double-click)

3. Modal appears
   ┌─────────────────────────┐
   │ Modifier le texte       │
   │ ┌─────────────────────┐ │
   │ │ Hello World         │ │
   │ └─────────────────────┘ │
   │   [Annuler] [Valider]   │
   └─────────────────────────┘

4. User edits
   ┌─────────────────────────┐
   │ Modifier le texte       │
   │ ┌─────────────────────┐ │
   │ │ Bonjour Monde       │ │ ← edited
   │ └─────────────────────┘ │
   │   [Annuler] [Valider]   │
   └─────────────────────────┘

5. User clicks Valider
   ▼

6. Text updated
   ┌──────────────┐
   │ Bonjour Monde│
   └──────────────┘
```

### Scenario 2: Change Text Color via Toolbar
```
1. User selects text layer
   ┌─────────────┐
   │ Hello World │ ← selected
   └─────────────┘

2. Toolbar appears above
   ┌────────────────────────────────┐
   │ [A 48] | [🎨 ■] | ... toolbar  │
   └────────────────────────────────┘
           ↓
   ┌─────────────┐
   │ Hello World │
   └─────────────┘

3. User clicks color picker
   ┌────────────────────────────────┐
   │ [A 48] | [🎨 ■] ← clicks        │
   │          ┌─────────────┐       │
   │          │ Color Wheel │       │
   │          └─────────────┘       │
   └────────────────────────────────┘

4. User selects red color
   ▼

5. Text color updates immediately
   ┌─────────────┐
   │ Hello World │ ← now red
   └─────────────┘
```

### Scenario 3: Scale Image via Toolbar
```
1. User selects image layer
   ┌─────────┐
   │ [IMAGE] │ ← selected
   └─────────┘

2. Toolbar appears above
   ┌────────────────────────────────┐
   │ [⛶ ▬▬●▬ 1.0x] | ... toolbar    │
   └────────────────────────────────┘
           ↓
   ┌─────────┐
   │ [IMAGE] │
   └─────────┘

3. User drags scale slider
   ┌────────────────────────────────┐
   │ [⛶ ▬▬▬●─ 2.0x] ← dragged right │
   └────────────────────────────────┘

4. Image scales in real-time
   ┌──────────────┐
   │              │
   │   [IMAGE]    │ ← now 2x bigger
   │              │
   └──────────────┘
```

## Component Hierarchy

```
SceneCanvas
├── CameraToolbar
├── Stage (Konva)
│   ├── KonvaLayer (Cameras)
│   └── KonvaLayer (Layers)
│       ├── LayerText
│       │   └── onDblClick → triggers editing
│       ├── LayerImage
│       └── LayerShape
├── Text Editing Modal (conditional)
│   ├── Modal Backdrop
│   └── Modal Content
│       ├── Title
│       ├── Textarea
│       └── Buttons (Annuler, Valider)
└── FloatingToolbar (conditional)
    ├── Text Controls (if text layer)
    │   ├── Font Size
    │   ├── Color Picker
    │   ├── Alignment Buttons
    │   ├── Style Buttons
    │   ├── Opacity Slider
    │   └── Rotation Input
    └── Image Controls (if image layer)
        ├── Scale Slider
        ├── Opacity Slider
        └── Rotation Input
```

## Toolbar Visual States

### Normal State
```
┌────────────────────────────────────────┐
│  [A 48] | [🎨] | [⬅] [⬌] [➡] | ...   │
│  ↑                                     │
│  Neutral colors, subtle borders        │
└────────────────────────────────────────┘
```

### Hover State
```
┌────────────────────────────────────────┐
│  [A 48] | [🎨] | [⬅] [⬌] [➡] | ...   │
│           ↑                            │
│           Light gray background        │
└────────────────────────────────────────┘
```

### Active State (Selected Button)
```
┌────────────────────────────────────────┐
│  [A 48] | [🎨] | [⬅] [⬌] [➡] | ...   │
│                  ↑                     │
│                  Purple background     │
└────────────────────────────────────────┘
```

## Positioning Logic

### At Default Zoom (1.0x)
```
Canvas Container
┌─────────────────────────────────────────┐
│                                         │
│  Toolbar ← positioned 60px above layer  │
│  ┌──────────────────────┐               │
│  └──────────────────────┘               │
│           ↓                             │
│  ┌──────────────────────┐               │
│  │   Selected Layer     │               │
│  └──────────────────────┘               │
│                                         │
└─────────────────────────────────────────┘
```

### At Zoomed In (2.0x)
```
Canvas Container (Zoomed)
┌─────────────────────────────────────────┐
│                                         │
│  Toolbar (scales with zoom)             │
│  ┌────────────────────────────────────┐ │
│  └────────────────────────────────────┘ │
│              ↓                          │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │      Selected Layer (2x)          │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Color Scheme

```
Background:     white/95 (semi-transparent)
Border:         gray-300
Text:           gray-600 (labels), gray-900 (values)
Hover:          gray-100
Active/Focus:   purple-600 (primary color)
Active Bg:      purple-100 (light)
Backdrop:       black/50 (modal overlay)
```

## Icons Used (Lucide React)

- Type: Font size indicator
- Palette: Color picker
- AlignLeft, AlignCenter, AlignRight: Text alignment
- Eye: Opacity control
- Maximize: Scale control
- RotateCw: Rotation control

## Responsive Behavior

The toolbar automatically:
1. Positions itself above the selected layer
2. Adjusts for canvas zoom level
3. Accounts for canvas centering in viewport
4. Stays within viewport bounds
5. Updates position on layer movement
6. Disappears when layer is deselected
7. Hides during text editing mode
