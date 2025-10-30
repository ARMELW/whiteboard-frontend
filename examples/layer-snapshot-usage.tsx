/**
 * Layer Snapshot System - Usage Examples
 * 
 * This file demonstrates how to use the layer snapshot system in different scenarios.
 * Each example shows a practical use case with comments explaining the implementation.
 */

import React from 'react';
import { useSceneStore } from '../src/app/scenes';
import { Layer } from '../src/app/scenes/types';

/**
 * Example 1: Display Layer Thumbnails in a Sidebar
 * 
 * Shows how to display cached layer snapshots as thumbnails in a layer list.
 * The snapshots are automatically generated when layers are added or modified.
 */
export const LayerThumbnailList: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const scenes = useSceneStore((state) => state.scenes);
  const scene = scenes.find(s => s.id === sceneId);

  if (!scene || !scene.layers) {
    return <div>No layers found</div>;
  }

  return (
    <div className="layer-list">
      <h3>Layers ({scene.layers.length})</h3>
      {scene.layers.map((layer) => (
        <div key={layer.id} className="layer-item">
          <div className="layer-thumbnail">
            {layer.cachedImage ? (
              <img 
                src={layer.cachedImage} 
                alt={layer.name}
                style={{ 
                  width: '150px', 
                  height: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                title="Full scene snapshot with this layer"
              />
            ) : (
              <div 
                style={{ 
                  width: '150px', 
                  height: '84px',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Generating...
              </div>
            )}
          </div>
          <div className="layer-info">
            <strong>{layer.name}</strong>
            <small>Type: {layer.type}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Example 2: Export Layer Snapshot
 * 
 * Shows how to export a layer snapshot (full scene with layer) as a downloadable file.
 */
export const ExportLayerButton: React.FC<{ layer: Layer }> = ({ layer }) => {
  const handleExport = () => {
    if (!layer.cachedImage) {
      alert('Snapshot not ready yet. Please wait...');
      return;
    }

    // Create a download link
    const link = document.createElement('a');
    link.href = layer.cachedImage;
    link.download = `${layer.name}-snapshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      disabled={!layer.cachedImage}
      title="Export this layer snapshot (full scene with layer at real position)"
    >
      {layer.cachedImage ? '📥 Export Snapshot' : '⏳ Generating...'}
    </button>
  );
};

/**
 * Example 3: Layer History with Visual Preview
 * 
 * Shows how to use layer snapshots for visual history/undo functionality.
 */
interface LayerHistoryEntry {
  timestamp: number;
  layer: Layer;
  snapshot: string | null;
}

export const LayerHistory: React.FC<{ layerId: string; sceneId: string }> = ({ 
  layerId, 
  sceneId 
}) => {
  const [history, setHistory] = React.useState<LayerHistoryEntry[]>([]);
  const scenes = useSceneStore((state) => state.scenes);
  const scene = scenes.find(s => s.id === sceneId);
  const layer = scene?.layers?.find(l => l.id === layerId);

  // Save current state to history
  const saveToHistory = React.useCallback(() => {
    if (!layer) return;
    
    setHistory(prev => [
      ...prev,
      {
        timestamp: Date.now(),
        layer: { ...layer },
        snapshot: layer.cachedImage || null
      }
    ]);
  }, [layer]);

  return (
    <div className="layer-history">
      <button onClick={saveToHistory}>
        💾 Save Current State to History
      </button>
      
      <div className="history-list">
        <h4>History ({history.length} entries)</h4>
        {history.map((entry, index) => (
          <div key={entry.timestamp} className="history-entry">
            <span>#{index + 1}</span>
            <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
            {entry.snapshot && (
              <img 
                src={entry.snapshot} 
                alt={`State ${index + 1}`}
                style={{ width: '100px', height: 'auto' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Example 4: Layer Preview Comparison
 * 
 * Shows how to compare two layer states side by side using their snapshots.
 */
export const LayerComparison: React.FC<{ 
  layerBefore: Layer; 
  layerAfter: Layer;
}> = ({ layerBefore, layerAfter }) => {
  return (
    <div className="layer-comparison">
      <div className="comparison-side">
        <h4>Before</h4>
        {layerBefore.cachedImage ? (
          <img 
            src={layerBefore.cachedImage} 
            alt="Before"
            style={{ width: '300px', height: 'auto' }}
          />
        ) : (
          <div>No snapshot available</div>
        )}
        <div className="properties">
          <p>Position: ({layerBefore.position.x}, {layerBefore.position.y})</p>
          <p>Scale: {layerBefore.scale}</p>
          <p>Opacity: {layerBefore.opacity}</p>
        </div>
      </div>
      
      <div className="comparison-side">
        <h4>After</h4>
        {layerAfter.cachedImage ? (
          <img 
            src={layerAfter.cachedImage} 
            alt="After"
            style={{ width: '300px', height: 'auto' }}
          />
        ) : (
          <div>No snapshot available</div>
        )}
        <div className="properties">
          <p>Position: ({layerAfter.position.x}, {layerAfter.position.y})</p>
          <p>Scale: {layerAfter.scale}</p>
          <p>Opacity: {layerAfter.opacity}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Example 5: Layer Search with Visual Preview
 * 
 * Shows how to implement a searchable layer gallery using snapshots.
 */
export const LayerGallery: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const scenes = useSceneStore((state) => state.scenes);
  const scene = scenes.find(s => s.id === sceneId);

  const filteredLayers = React.useMemo(() => {
    if (!scene?.layers) return [];
    
    return scene.layers.filter(layer => 
      layer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      layer.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scene?.layers, searchTerm]);

  return (
    <div className="layer-gallery">
      <input 
        type="text"
        placeholder="Search layers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ 
          width: '100%', 
          padding: '8px', 
          marginBottom: '16px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      
      <div className="gallery-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {filteredLayers.map(layer => (
          <div key={layer.id} className="gallery-item" style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px'
          }}>
            {layer.cachedImage ? (
              <img 
                src={layer.cachedImage} 
                alt={layer.name}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  borderRadius: '4px'
                }}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                paddingTop: '56.25%',
                background: '#f0f0f0',
                position: 'relative'
              }}>
                <span style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}>
                  Loading...
                </span>
              </div>
            )}
            <div style={{ marginTop: '8px' }}>
              <strong>{layer.name}</strong>
              <br />
              <small>{layer.type}</small>
            </div>
          </div>
        ))}
      </div>
      
      {filteredLayers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          No layers found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

/**
 * Example 6: Monitor Snapshot Generation Status
 * 
 * Shows how to track which layers have snapshots ready.
 */
export const SnapshotStatus: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const scenes = useSceneStore((state) => state.scenes);
  const scene = scenes.find(s => s.id === sceneId);

  if (!scene?.layers) return null;

  const layersWithSnapshots = scene.layers.filter(l => l.cachedImage).length;
  const totalLayers = scene.layers.length;
  const percentage = totalLayers > 0 ? (layersWithSnapshots / totalLayers) * 100 : 0;

  return (
    <div className="snapshot-status" style={{
      padding: '16px',
      background: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '16px'
    }}>
      <h4>Snapshot Generation Status</h4>
      <div style={{ marginBottom: '8px' }}>
        {layersWithSnapshots} / {totalLayers} layers ready
      </div>
      <div style={{
        height: '8px',
        background: '#ddd',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: percentage === 100 ? '#4caf50' : '#2196f3',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
        {percentage === 100 ? (
          '✓ All snapshots generated'
        ) : (
          `⏳ Generating snapshots... (${percentage.toFixed(0)}%)`
        )}
      </div>
    </div>
  );
};

/**
 * Example 7: Complete Layer Management Panel
 * 
 * Combines multiple features into a comprehensive layer management interface.
 */
export const LayerManagementPanel: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const [selectedLayerId, setSelectedLayerId] = React.useState<string | null>(null);
  const scenes = useSceneStore((state) => state.scenes);
  const scene = scenes.find(s => s.id === sceneId);
  const selectedLayer = scene?.layers?.find(l => l.id === selectedLayerId);

  return (
    <div className="layer-management-panel" style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '16px',
      height: '600px'
    }}>
      {/* Sidebar with layer list */}
      <div style={{ 
        borderRight: '1px solid #ddd',
        padding: '16px',
        overflowY: 'auto'
      }}>
        <SnapshotStatus sceneId={sceneId} />
        
        <h3>Layers</h3>
        {scene?.layers?.map(layer => (
          <div 
            key={layer.id}
            onClick={() => setSelectedLayerId(layer.id)}
            style={{
              padding: '8px',
              marginBottom: '8px',
              border: layer.id === selectedLayerId ? '2px solid #2196f3' : '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              background: layer.id === selectedLayerId ? '#e3f2fd' : 'white'
            }}
          >
            {layer.cachedImage && (
              <img 
                src={layer.cachedImage}
                alt={layer.name}
                style={{ 
                  width: '100%',
                  height: 'auto',
                  marginBottom: '8px',
                  borderRadius: '4px'
                }}
              />
            )}
            <div>
              <strong>{layer.name}</strong>
              <br />
              <small>{layer.type}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div style={{ padding: '16px', overflowY: 'auto' }}>
        {selectedLayer ? (
          <div>
            <h2>{selectedLayer.name}</h2>
            
            {/* Large preview */}
            {selectedLayer.cachedImage && (
              <div style={{ marginBottom: '16px' }}>
                <img 
                  src={selectedLayer.cachedImage}
                  alt={selectedLayer.name}
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  ℹ️ This is a full scene snapshot (1920x1080) with the layer at its real position
                </p>
              </div>
            )}

            {/* Layer properties */}
            <div style={{ 
              background: '#f5f5f5',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <h3>Properties</h3>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><strong>Type:</strong></td>
                    <td>{selectedLayer.type}</td>
                  </tr>
                  <tr>
                    <td><strong>Position:</strong></td>
                    <td>({selectedLayer.position.x}, {selectedLayer.position.y})</td>
                  </tr>
                  <tr>
                    <td><strong>Scale:</strong></td>
                    <td>{selectedLayer.scale}</td>
                  </tr>
                  <tr>
                    <td><strong>Opacity:</strong></td>
                    <td>{selectedLayer.opacity}</td>
                  </tr>
                  <tr>
                    <td><strong>Rotation:</strong></td>
                    <td>{selectedLayer.rotation || 0}°</td>
                  </tr>
                  <tr>
                    <td><strong>Snapshot:</strong></td>
                    <td>{selectedLayer.cachedImage ? '✓ Ready' : '⏳ Generating...'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div>
              <ExportLayerButton layer={selectedLayer} />
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#999'
          }}>
            Select a layer to view details
          </div>
        )}
      </div>
    </div>
  );
};
