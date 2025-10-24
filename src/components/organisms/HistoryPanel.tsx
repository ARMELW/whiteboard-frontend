import React from 'react';
import { Clock, CornerUpLeft, CornerUpRight } from 'lucide-react';
import { useHistory } from '@/app/history';

interface HistoryPanelProps {
  onClose?: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onClose }) => {
  const { undoStack, redoStack, undo, redo, canUndo, canRedo } = useHistory();
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };
  
  return (
    <div className="history-panel bg-white border-l border-gray-200 w-80 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Historique</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            title="Fermer"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="px-4 py-3 border-b border-gray-200 flex gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
            canUndo
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title="Annuler (Ctrl+Z)"
        >
          <CornerUpLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Annuler</span>
        </button>
        
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
            canRedo
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title="Rétablir (Ctrl+Y)"
        >
          <CornerUpRight className="w-4 h-4" />
          <span className="text-sm font-medium">Rétablir</span>
        </button>
      </div>
      
      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {undoStack.length === 0 && redoStack.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
            <Clock className="w-12 h-12 mb-2" />
            <p className="text-sm text-center">Aucune action pour le moment</p>
          </div>
        ) : (
          <div className="py-2">
            {/* Undo Stack (in reverse order - most recent first) */}
            {[...undoStack].reverse().map((action, index) => {
              const actualIndex = undoStack.length - 1 - index;
              const isCurrentState = actualIndex === undoStack.length - 1;
              
              return (
                <div
                  key={`undo-${actualIndex}-${action.timestamp}`}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    isCurrentState ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isCurrentState ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {action.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(action.timestamp)}
                      </p>
                    </div>
                    {isCurrentState && (
                      <span className="text-xs font-medium text-blue-600 flex-shrink-0">
                        État actuel
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Redo Stack */}
            {redoStack.length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-100 border-y border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Actions annulées
                  </p>
                </div>
                {[...redoStack].reverse().map((action, index) => {
                  const actualIndex = redoStack.length - 1 - index;
                  
                  return (
                    <div
                      key={`redo-${actualIndex}-${action.timestamp}`}
                      className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors opacity-60"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {action.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(action.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
        <p className="text-xs text-gray-500">
          {undoStack.length} action{undoStack.length !== 1 ? 's' : ''} disponible{undoStack.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default HistoryPanel;
