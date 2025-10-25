# Audio & Template System Enhancement Guide

This document describes the new features added to the whiteboard frontend application for audio editing, template management, and camera animation.

## 🎵 Audio Enhancement Features

### 1. Audio Trimming and Fading

The new `AudioEditor` component allows precise control over audio playback:

**Features:**
- **Trim Audio**: Set start and end points to use only a portion of the audio file
- **Fade In/Out**: Configure smooth fade transitions (0-5 seconds)
- **Real-time Preview**: See duration changes as you adjust settings

**Usage:**
```typescript
import AudioEditor from '@/components/molecules/AudioEditor';

// In your component
<AudioEditor
  audioFile={selectedAudioFile}
  onUpdateTrim={(trimConfig) => updateTrim({ id: file.id, trimConfig })}
  onUpdateFade={(fadeConfig) => updateFade({ id: file.id, fadeConfig })}
  onClose={() => setEditingAudio(null)}
/>
```

### 2. Advanced Audio Library

The enhanced `AudioManager` now includes:

**Categorization:**
- Music
- Sound Effects (SFX)
- Voiceover
- Ambient
- Other

**Search & Filter:**
- Full-text search across filenames and tags
- Filter by category
- Filter by favorites
- Combination filters supported

**Actions:**
- ⭐ Toggle favorites
- 🏷️ Add/edit tags
- ✏️ Edit trim/fade settings
- 🗑️ Delete audio files

**Code Example:**
```typescript
import { useAudioLibrary, useAudioActions, AudioCategory } from '@/app/audio';

const { files } = useAudioLibrary({ 
  category: AudioCategory.MUSIC,
  search: 'background',
  favoritesOnly: true 
});

const { toggleFavorite, updateCategory } = useAudioActions();
```

## 📚 Template System

### 3. Professional Templates

**15 Pre-configured Templates Available:**

1. **Educational Whiteboard** - Teaching concepts with step-by-step explanations
2. **Marketing Presentation** - Product launches and campaigns
3. **Technical Tutorial** - Coding tutorials and technical walkthroughs
4. **Explanatory Animation** - Visual concept explanations
5. **Promotional Video** - Advertisements and promotions
6. **Business Presentation** - Corporate meetings and reports
7. **Creative Storytelling** - Artistic narratives
8. **Minimal Presentation** - Clean, focused content
9. **Science Education** - Lab demonstrations and experiments
10. **Social Media Short** - Instagram Reels, TikTok, YouTube Shorts
11. **Product Demo** - Feature showcases and SaaS demos
12. **Animated Infographic** - Data visualization
13. **Webinar Introduction** - Professional event openings
14. **Training Module** - Employee training and onboarding
15. **Children's Education** - Fun learning for kids

**Template Metadata:**
- Type (Education, Marketing, Tutorial, etc.)
- Style (Minimal, Colorful, Professional, etc.)
- Complexity (Beginner, Intermediate, Advanced, Expert)
- Ratings and popularity
- Estimated duration
- Layer/camera counts
- Recommended use cases

### 4. Template Import/Export

**Export Format (.wbtemplate):**
```json
{
  "version": "1.0.0",
  "template": {
    "id": "...",
    "name": "My Template",
    "description": "...",
    "type": "education",
    "style": "professional",
    "sceneData": { ... }
  },
  "exportedAt": "2025-01-15T10:00:00Z"
}
```

**Usage:**
```typescript
import { useTemplateActions } from '@/app/templates';

const { exportTemplate, importTemplate, validateTemplate } = useTemplateActions();

// Export
const jsonString = await exportTemplate(templateId);
// Creates downloadable .wbtemplate file

// Validate before import
const validation = await validateTemplate(jsonString);
if (validation.isValid) {
  const template = await importTemplate(jsonString);
}
```

**Validation Features:**
- Format validation
- Version checking
- Automatic migration from older versions
- Error and warning reporting
- Schema validation

### 5. Template Gallery

The `TemplateGallery` component provides:

**Filtering Options:**
- By type (Education, Marketing, etc.)
- By style (Minimal, Colorful, etc.)
- By complexity level
- By popularity
- By rating
- Full-text search

**Features:**
- Grid view with thumbnails
- Template metadata display
- Quick template selection
- Export individual templates
- Import custom templates

**Usage:**
```typescript
import TemplateGallery from '@/components/organisms/TemplateGallery';

<TemplateGallery
  onSelectTemplate={(template) => applyTemplate(template)}
  onClose={() => setGalleryOpen(false)}
/>
```

## 🎥 Camera Animation System

### 6. Camera Sequences

**New Camera Movement Types:**
- Static (no movement)
- Zoom In / Zoom Out
- Pan Left / Right / Up / Down
- Focus Point (dynamic focus)
- Circular (rotating camera)
- Custom (keyframe-based)

**Easing Functions:**
- Linear
- Ease In
- Ease Out
- Ease In Out
- Bounce
- Elastic

### 7. Camera Sequence Editor

The `CameraSequenceEditor` provides a complete timeline-based camera animation system:

**Features:**
- Multiple camera sequences per scene
- Keyframe-based animation
- Visual timeline representation
- Precise timing control
- Position and zoom control
- Transition easing

**Keyframe Properties:**
- Time (when the keyframe occurs)
- Position X/Y (0-1 normalized coordinates)
- Zoom level (0.1x to 3x)
- Easing function

**Usage:**
```typescript
import CameraSequenceEditor from '@/components/organisms/CameraSequenceEditor';
import { CameraSequence } from '@/app/scenes/types';

<CameraSequenceEditor
  sequences={scene.multiTimeline.cameraSequences || []}
  sceneDuration={scene.duration}
  onSave={(sequences) => updateCameraSequences(sequences)}
  onClose={() => setEditorOpen(false)}
/>
```

**Example Sequence:**
```typescript
const sequence: CameraSequence = {
  id: 'seq-1',
  name: 'Zoom and Pan',
  startTime: 0,
  endTime: 5,
  movementType: CameraMovementType.CUSTOM,
  easing: CameraEasing.EASE_IN_OUT,
  keyframes: [
    {
      time: 0,
      position: { x: 0.5, y: 0.5 },
      zoom: 1,
      easing: CameraEasing.EASE_IN_OUT
    },
    {
      time: 2.5,
      position: { x: 0.3, y: 0.3 },
      zoom: 1.5,
      easing: CameraEasing.EASE_IN_OUT
    },
    {
      time: 5,
      position: { x: 0.7, y: 0.7 },
      zoom: 1,
      easing: CameraEasing.EASE_OUT
    }
  ]
};
```

## 🚀 Getting Started

### Initialize Professional Templates

```typescript
import { initializeProfessionalTemplates } from '@/app/templates';

// Call once on app initialization
await initializeProfessionalTemplates();
```

### Complete Example: Using All Features

```typescript
import { useEffect } from 'react';
import { useAudioLibrary, useAudioActions, AudioCategory } from '@/app/audio';
import { useTemplates, initializeProfessionalTemplates } from '@/app/templates';
import TemplateGallery from '@/components/organisms/TemplateGallery';
import CameraSequenceEditor from '@/components/organisms/CameraSequenceEditor';

function MyComponent() {
  // Initialize templates on mount
  useEffect(() => {
    initializeProfessionalTemplates();
  }, []);

  // Audio management
  const { files } = useAudioLibrary({ 
    category: AudioCategory.MUSIC,
    favoritesOnly: false 
  });

  // Template management
  const { templates } = useTemplates({ 
    type: TemplateType.EDUCATION,
    complexity: TemplateComplexity.BEGINNER 
  });

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
```

## 📝 Type Definitions

### Audio Types
```typescript
enum AudioCategory {
  MUSIC = 'music',
  SFX = 'sfx',
  VOICEOVER = 'voiceover',
  AMBIENT = 'ambient',
  OTHER = 'other',
}

interface AudioTrimConfig {
  startTime: number;
  endTime: number;
}

interface AudioFadeConfig {
  fadeIn: number;  // seconds
  fadeOut: number; // seconds
}
```

### Template Types
```typescript
enum TemplateComplexity {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

interface TemplateRating {
  average: number;
  count: number;
}
```

### Camera Types
```typescript
enum CameraMovementType {
  STATIC = 'static',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out',
  PAN_LEFT = 'pan_left',
  PAN_RIGHT = 'pan_right',
  PAN_UP = 'pan_up',
  PAN_DOWN = 'pan_down',
  FOCUS_POINT = 'focus_point',
  CIRCULAR = 'circular',
  CUSTOM = 'custom',
}

interface CameraKeyframe {
  time: number;
  position: { x: number; y: number };
  zoom: number;
  easing?: CameraEasing;
}
```

## 🎯 Best Practices

1. **Audio Management:**
   - Always categorize audio files for better organization
   - Use trim/fade to avoid abrupt audio transitions
   - Preview audio before adding to scenes

2. **Template Usage:**
   - Start with a template that matches your use case
   - Customize templates to match your brand
   - Export customized templates for reuse

3. **Camera Animations:**
   - Use easing functions for smooth transitions
   - Keep camera sequences short (2-5 seconds)
   - Preview animations before finalizing

4. **Performance:**
   - Clean up unused audio files regularly
   - Limit camera keyframes to necessary points
   - Use appropriate complexity templates for your needs

## 🔧 Technical Notes

- All features are backward compatible
- Templates use versioning for future migrations
- Audio files are stored as blob URLs (memory-efficient)
- Camera sequences support unlimited keyframes
- TypeScript types provide full IDE support

## 📦 File Structure

```
src/
├── app/
│   ├── audio/
│   │   ├── types.ts (Enhanced with new features)
│   │   ├── store.ts (New actions)
│   │   ├── hooks/
│   │   │   ├── useAudioLibrary.ts (Filter support)
│   │   │   └── useAudioActions.ts (New actions)
│   │   └── api/
│   │       └── audioMockService.ts (Enhanced)
│   ├── templates/
│   │   ├── types.ts (Enhanced metadata)
│   │   ├── data/
│   │   │   └── professionalTemplates.ts (15 templates)
│   │   ├── utils/
│   │   │   └── templateInitializer.ts (Setup utility)
│   │   └── api/
│   │       └── templatesService.ts (Validation & migration)
│   └── scenes/
│       └── types.ts (Camera enhancements)
└── components/
    ├── molecules/
    │   └── AudioEditor.tsx (New)
    └── organisms/
        ├── CameraSequenceEditor.tsx (New)
        └── TemplateGallery.tsx (New)
```
