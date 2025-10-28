
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FileText, Clock, Image as ImageIcon, Play, Music } from 'lucide-react';
import SceneAudioControl from '../molecules/SceneAudioControl';
import { ScenePropertiesForm } from '../molecules/scene/ScenePropertiesForm';

interface ScenePropertiesPanelProps {
  scene: any;
  handleSceneChange: (field: string, value: any) => void;
}

const ScenePropertiesPanel: React.FC<ScenePropertiesPanelProps> = ({ scene, handleSceneChange }) => {
  return (
    <Accordion type="multiple" defaultValue={["basic", "transitions", "timing", "audio"]} className="w-full">
      {/* Basic Properties */}
      <AccordionItem value="basic">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Slide {scene.order || 1}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <ScenePropertiesForm scene={scene} onChange={handleSceneChange} />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Transitions */}
      <AccordionItem value="transitions">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span>Transitions</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Transition type
              </label>
              <Select
                value={scene.animation || 'fade'}
                onValueChange={(value) => handleSceneChange('animation', value)}
              >
                <SelectTrigger className="w-full bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Fade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Timing */}
      <AccordionItem value="timing">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Timing</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="block text-foreground text-xs mb-1.5">
                Total slide duration
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={scene.duration || 5}
                  onChange={(e) => handleSceneChange('duration', Number(e.target.value))}
                  className="w-20 bg-secondary text-foreground border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">sec</span>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Audio */}
      <AccordionItem value="audio">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span>Audio</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <SceneAudioControl sceneId={scene.id} sceneAudio={scene.sceneAudio} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ScenePropertiesPanel;
