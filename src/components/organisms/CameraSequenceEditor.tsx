/**
 * Camera Sequence Editor Component
 * Advanced camera animation editor with keyframes and sequences
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Play, Camera as CameraIcon, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  CameraSequence, 
  CameraKeyframe, 
  CameraMovementType, 
  CameraEasing,
  Position 
} from '@/app/scenes/types';

interface CameraSequenceEditorProps {
  sequences: CameraSequence[];
  sceneDuration: number;
  onSave: (sequences: CameraSequence[]) => void;
  onClose: () => void;
}

const CameraSequenceEditor: React.FC<CameraSequenceEditorProps> = ({
  sequences: initialSequences,
  sceneDuration,
  onSave,
  onClose,
}) => {
  const [sequences, setSequences] = useState<CameraSequence[]>(initialSequences);
  const [selectedSequence, setSelectedSequence] = useState<string | null>(
    initialSequences[0]?.id || null
  );

  const addSequence = () => {
    const newSequence: CameraSequence = {
      id: `camera-seq-${Date.now()}`,
      name: `Sequence ${sequences.length + 1}`,
      startTime: 0,
      endTime: Math.min(5, sceneDuration),
      keyframes: [
        {
          time: 0,
          position: { x: 0.5, y: 0.5 },
          zoom: 1,
          easing: CameraEasing.EASE_IN_OUT,
        },
      ],
      movementType: CameraMovementType.STATIC,
      easing: CameraEasing.EASE_IN_OUT,
    };

    setSequences([...sequences, newSequence]);
    setSelectedSequence(newSequence.id);
  };

  const removeSequence = (id: string) => {
    const updated = sequences.filter(s => s.id !== id);
    setSequences(updated);
    if (selectedSequence === id) {
      setSelectedSequence(updated[0]?.id || null);
    }
  };

  const updateSequence = (id: string, updates: Partial<CameraSequence>) => {
    setSequences(sequences.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const addKeyframe = (sequenceId: string) => {
    const sequence = sequences.find(s => s.id === sequenceId);
    if (!sequence) return;

    const newKeyframe: CameraKeyframe = {
      time: Math.min(sequence.endTime - sequence.startTime, 
        (sequence.keyframes[sequence.keyframes.length - 1]?.time || 0) + 1),
      position: sequence.keyframes[sequence.keyframes.length - 1]?.position || { x: 0.5, y: 0.5 },
      zoom: sequence.keyframes[sequence.keyframes.length - 1]?.zoom || 1,
      easing: CameraEasing.EASE_IN_OUT,
    };

    updateSequence(sequenceId, {
      keyframes: [...sequence.keyframes, newKeyframe],
    });
  };

  const removeKeyframe = (sequenceId: string, index: number) => {
    const sequence = sequences.find(s => s.id === sequenceId);
    if (!sequence || sequence.keyframes.length <= 1) return;

    updateSequence(sequenceId, {
      keyframes: sequence.keyframes.filter((_, i) => i !== index),
    });
  };

  const updateKeyframe = (
    sequenceId: string, 
    index: number, 
    updates: Partial<CameraKeyframe>
  ) => {
    const sequence = sequences.find(s => s.id === sequenceId);
    if (!sequence) return;

    updateSequence(sequenceId, {
      keyframes: sequence.keyframes.map((kf, i) => 
        i === index ? { ...kf, ...updates } : kf
      ),
    });
  };

  const selectedSeq = sequences.find(s => s.id === selectedSequence);

  const getMovementTypeIcon = (type: CameraMovementType) => {
    switch (type) {
      case CameraMovementType.ZOOM_IN:
      case CameraMovementType.ZOOM_OUT:
        return <ZoomIn className="h-4 w-4" />;
      case CameraMovementType.PAN_LEFT:
      case CameraMovementType.PAN_RIGHT:
      case CameraMovementType.PAN_UP:
      case CameraMovementType.PAN_DOWN:
        return <Move className="h-4 w-4" />;
      default:
        return <CameraIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Camera Sequence Editor</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sequences List */}
          <div className="w-64 border-r bg-gray-50 p-3 overflow-y-auto">
            <div className="mb-3">
              <Button 
                onClick={addSequence} 
                size="sm" 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Sequence
              </Button>
            </div>

            <div className="space-y-2">
              {sequences.map((seq) => (
                <div
                  key={seq.id}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    selectedSequence === seq.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedSequence(seq.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getMovementTypeIcon(seq.movementType)}
                      <span className="text-sm font-medium truncate">
                        {seq.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSequence(seq.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {seq.startTime.toFixed(1)}s - {seq.endTime.toFixed(1)}s
                  </div>
                  <div className="text-xs text-gray-500">
                    {seq.keyframes.length} keyframe(s)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sequence Details */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedSeq ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Sequence Name
                    </label>
                    <input
                      type="text"
                      value={selectedSeq.name}
                      onChange={(e) => updateSequence(selectedSeq.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Start Time (s)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max={sceneDuration}
                        value={selectedSeq.startTime}
                        onChange={(e) => updateSequence(selectedSeq.id, { 
                          startTime: Math.min(parseFloat(e.target.value), selectedSeq.endTime - 0.1)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        End Time (s)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max={sceneDuration}
                        value={selectedSeq.endTime}
                        onChange={(e) => updateSequence(selectedSeq.id, { 
                          endTime: Math.max(parseFloat(e.target.value), selectedSeq.startTime + 0.1)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Movement Type
                    </label>
                    <select
                      value={selectedSeq.movementType}
                      onChange={(e) => updateSequence(selectedSeq.id, { 
                        movementType: e.target.value as CameraMovementType
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={CameraMovementType.STATIC}>Static</option>
                      <option value={CameraMovementType.ZOOM_IN}>Zoom In</option>
                      <option value={CameraMovementType.ZOOM_OUT}>Zoom Out</option>
                      <option value={CameraMovementType.PAN_LEFT}>Pan Left</option>
                      <option value={CameraMovementType.PAN_RIGHT}>Pan Right</option>
                      <option value={CameraMovementType.PAN_UP}>Pan Up</option>
                      <option value={CameraMovementType.PAN_DOWN}>Pan Down</option>
                      <option value={CameraMovementType.FOCUS_POINT}>Focus Point</option>
                      <option value={CameraMovementType.CIRCULAR}>Circular</option>
                      <option value={CameraMovementType.CUSTOM}>Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Easing
                    </label>
                    <select
                      value={selectedSeq.easing}
                      onChange={(e) => updateSequence(selectedSeq.id, { 
                        easing: e.target.value as CameraEasing
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={CameraEasing.LINEAR}>Linear</option>
                      <option value={CameraEasing.EASE_IN}>Ease In</option>
                      <option value={CameraEasing.EASE_OUT}>Ease Out</option>
                      <option value={CameraEasing.EASE_IN_OUT}>Ease In Out</option>
                      <option value={CameraEasing.BOUNCE}>Bounce</option>
                      <option value={CameraEasing.ELASTIC}>Elastic</option>
                    </select>
                  </div>
                </div>

                {/* Keyframes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Keyframes</h4>
                    <Button
                      onClick={() => addKeyframe(selectedSeq.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Keyframe
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {selectedSeq.keyframes.map((kf, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">
                            Keyframe {index + 1}
                          </span>
                          {selectedSeq.keyframes.length > 1 && (
                            <button
                              onClick={() => removeKeyframe(selectedSeq.id, index)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Time: {kf.time.toFixed(1)}s
                            </label>
                            <Slider
                              value={[kf.time]}
                              onValueChange={(values) => updateKeyframe(selectedSeq.id, index, { 
                                time: values[0]
                              })}
                              min={0}
                              max={selectedSeq.endTime - selectedSeq.startTime}
                              step={0.1}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Zoom: {kf.zoom.toFixed(2)}x
                            </label>
                            <Slider
                              value={[kf.zoom]}
                              onValueChange={(values) => updateKeyframe(selectedSeq.id, index, { 
                                zoom: values[0]
                              })}
                              min={0.1}
                              max={3}
                              step={0.1}
                              className="w-full"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Position X: {kf.position.x.toFixed(2)}
                              </label>
                              <Slider
                                value={[kf.position.x]}
                                onValueChange={(values) => updateKeyframe(selectedSeq.id, index, { 
                                  position: { ...kf.position, x: values[0] }
                                })}
                                min={0}
                                max={1}
                                step={0.01}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Position Y: {kf.position.y.toFixed(2)}
                              </label>
                              <Slider
                                value={[kf.position.y]}
                                onValueChange={(values) => updateKeyframe(selectedSeq.id, index, { 
                                  position: { ...kf.position, y: values[0] }
                                })}
                                min={0}
                                max={1}
                                step={0.01}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <CameraIcon className="h-12 w-12 mx-auto mb-3" />
                  <p>No sequence selected</p>
                  <p className="text-sm">Add a sequence to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(sequences)}>
            Save Sequences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraSequenceEditor;
