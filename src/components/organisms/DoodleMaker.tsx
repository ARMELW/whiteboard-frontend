import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text as KonvaText } from 'react-konva';
import { Button } from '../atoms';
import { 
  Pencil, Eraser, Circle as CircleIcon, Square, Type, 
  Download, Trash2, Undo, Redo, Palette 
} from 'lucide-react';

type Tool = 'pen' | 'eraser' | 'circle' | 'square' | 'text';

interface LineData {
  tool: 'pen' | 'eraser';
  points: number[];
  stroke: string;
  strokeWidth: number;
}

interface ShapeData {
  type: 'circle' | 'square';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  id: string;
}

interface TextData {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  id: string;
}

const COLORS = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
];

const DoodleMaker: React.FC = () => {
  const [tool, setTool] = useState<Tool>('pen');
  const [lines, setLines] = useState<LineData[]>([]);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [texts, setTexts] = useState<TextData[]>([]);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setDimensions({ width, height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const saveToHistory = () => {
    const currentState = { lines, shapes, texts };
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(currentState);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevState = history[historyStep - 1];
      setLines(prevState.lines);
      setShapes(prevState.shapes);
      setTexts(prevState.texts);
      setHistoryStep(historyStep - 1);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextState = history[historyStep + 1];
      setLines(nextState.lines);
      setShapes(nextState.shapes);
      setTexts(nextState.texts);
      setHistoryStep(historyStep + 1);
    }
  };

  const handleMouseDown = (e: any) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    
    if (tool === 'pen' || tool === 'eraser') {
      setLines([...lines, { 
        tool, 
        points: [pos.x, pos.y], 
        stroke: tool === 'eraser' ? '#ffffff' : color,
        strokeWidth: tool === 'eraser' ? strokeWidth * 3 : strokeWidth
      }]);
    } else if (tool === 'circle') {
      const newCircle: ShapeData = {
        type: 'circle',
        x: pos.x,
        y: pos.y,
        width: 50,
        height: 50,
        fill: color,
        id: `circle-${Date.now()}`
      };
      setShapes([...shapes, newCircle]);
      saveToHistory();
    } else if (tool === 'square') {
      const newSquare: ShapeData = {
        type: 'square',
        x: pos.x - 25,
        y: pos.y - 25,
        width: 50,
        height: 50,
        fill: color,
        id: `square-${Date.now()}`
      };
      setShapes([...shapes, newSquare]);
      saveToHistory();
    } else if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newText: TextData = {
          text,
          x: pos.x,
          y: pos.y,
          fontSize: 24,
          fill: color,
          id: `text-${Date.now()}`
        };
        setTexts([...texts, newText]);
        saveToHistory();
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || (tool !== 'pen' && tool !== 'eraser')) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    setLines([...lines.slice(0, -1), lastLine]);
  };

  const handleMouseUp = () => {
    if (isDrawing && (tool === 'pen' || tool === 'eraser')) {
      saveToHistory();
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (confirm('Clear entire canvas?')) {
      setLines([]);
      setShapes([]);
      setTexts([]);
      saveToHistory();
    }
  };

  const handleDownload = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'my-doodle.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toolButtons = [
    { tool: 'pen' as Tool, icon: Pencil, label: 'Pen', color: 'bg-blue-500' },
    { tool: 'eraser' as Tool, icon: Eraser, label: 'Eraser', color: 'bg-gray-500' },
    { tool: 'circle' as Tool, icon: CircleIcon, label: 'Circle', color: 'bg-green-500' },
    { tool: 'square' as Tool, icon: Square, label: 'Square', color: 'bg-yellow-500' },
    { tool: 'text' as Tool, icon: Type, label: 'Text', color: 'bg-purple-500' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Fun Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg px-6 py-4 border-b-4 border-purple-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bounce">🎨</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Doodle Maker
            </h1>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleUndo}
              disabled={historyStep <= 0}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              className="gap-1 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              className="gap-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Download className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Floating Toolbar */}
        <div className="absolute left-6 top-28 z-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-3 space-y-2 border-2 border-purple-200">
          {toolButtons.map((btn) => (
            <button
              key={btn.tool}
              onClick={() => setTool(btn.tool)}
              className={`
                w-14 h-14 rounded-xl flex items-center justify-center
                transition-all duration-200 transform hover:scale-110
                ${tool === btn.tool 
                  ? `${btn.color} text-white shadow-lg scale-105` 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              title={btn.label}
            >
              <btn.icon className="w-6 h-6" />
            </button>
          ))}
          
          {/* Color Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`
                w-14 h-14 rounded-xl flex items-center justify-center
                transition-all duration-200 transform hover:scale-110
                bg-gradient-to-br from-red-400 via-yellow-400 to-blue-400
                text-white shadow-lg
              `}
              title="Colors"
            >
              <Palette className="w-6 h-6" />
            </button>
            
            {showColorPicker && (
              <div className="absolute left-20 top-0 bg-white rounded-xl shadow-xl p-3 grid grid-cols-5 gap-2 border-2 border-purple-200">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      setShowColorPicker(false);
                    }}
                    className={`
                      w-8 h-8 rounded-lg transition-transform hover:scale-110
                      ${color === c ? 'ring-4 ring-purple-400' : ''}
                    `}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stroke Width */}
          <div className="pt-2 border-t-2 border-gray-200">
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-14 h-2"
              style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
              title={`Stroke: ${strokeWidth}px`}
            />
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-6"
        >
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-purple-300 overflow-hidden">
            <Stage
              ref={stageRef}
              width={dimensions.width - 100}
              height={dimensions.height - 150}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="cursor-crosshair"
            >
              <Layer>
                {/* Background */}
                <Rect
                  x={0}
                  y={0}
                  width={dimensions.width - 100}
                  height={dimensions.height - 150}
                  fill="#ffffff"
                />
                
                {/* Welcome message when empty */}
                {lines.length === 0 && shapes.length === 0 && texts.length === 0 && (
                  <KonvaText
                    text="🎨 Start drawing your doodle! ✨"
                    x={(dimensions.width - 100) / 2 - 150}
                    y={(dimensions.height - 150) / 2}
                    fontSize={24}
                    fill="#cbd5e1"
                    fontStyle="bold"
                  />
                )}
                
                {/* Lines */}
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.stroke}
                    strokeWidth={line.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      line.tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                  />
                ))}
                
                {/* Shapes */}
                {shapes.map((shape) => {
                  if (shape.type === 'circle') {
                    return (
                      <Circle
                        key={shape.id}
                        x={shape.x}
                        y={shape.y}
                        radius={shape.width / 2}
                        fill={shape.fill}
                        draggable
                      />
                    );
                  } else {
                    return (
                      <Rect
                        key={shape.id}
                        x={shape.x}
                        y={shape.y}
                        width={shape.width}
                        height={shape.height}
                        fill={shape.fill}
                        draggable
                      />
                    );
                  }
                })}
                
                {/* Texts */}
                {texts.map((text) => (
                  <KonvaText
                    key={text.id}
                    text={text.text}
                    x={text.x}
                    y={text.y}
                    fontSize={text.fontSize}
                    fill={text.fill}
                    draggable
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>

      {/* Fun Footer */}
      <div className="bg-white/80 backdrop-blur-sm px-6 py-3 border-t-2 border-purple-200">
        <div className="flex items-center justify-center gap-4">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-base">✨</span>
            <span>Draw, doodle, and create!</span>
            <span className="text-base">🎨</span>
          </p>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Current:</span>
            <span className="font-bold text-purple-600 capitalize">{tool}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Color:</span>
            <span 
              className="inline-block w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm" 
              style={{ backgroundColor: color }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoodleMaker;
